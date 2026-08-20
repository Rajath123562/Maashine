'use server'

import { createClient } from '../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addStaffMember(formData: FormData) {
  const supabase = await createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Unauthorized')

  const full_name = formData.get('full_name') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const role = formData.get('role') as string
  const employee_code = formData.get('employee_code') as string

  // First, try to find an existing profile with this email to link
  let profile_id = null
  if (email) {
    const { data: existingProfile } = await supabase.from('profiles').select('id').eq('email', email).single()
    if (existingProfile) {
      profile_id = existingProfile.id
      
      // Update their role to staff equivalent if they are just a customer
      await supabase.from('profiles').update({ role: 'admin' }).eq('id', profile_id) // simplified role management
    }
  }

  const { error } = await supabase.from('staff').insert({
    full_name,
    phone,
    email,
    role,
    employee_code: employee_code || `EMP-${Math.floor(Math.random() * 10000)}`,
    profile_id,
    status: 'active'
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/staff')
  return { success: true }
}

export async function toggleStaffStatus(staffId: string, currentStatus: string) {
  const supabase = await createClient()
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
  
  const { error } = await supabase.from('staff').update({ status: newStatus }).eq('id', staffId)
  if (error) throw new Error(error.message)
    
  revalidatePath('/admin/staff')
  return { success: true }
}

export async function updateJobStatus(
  assignmentId: string,
  newStatus: 'assigned' | 'en_route' | 'in_progress' | 'completed' | 'cancelled',
  notes?: string
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  // Fetch the assignment and joined staff record
  const { data: assignment, error: assignmentError } = await supabase
    .from('booking_assignments')
    .select('*, staff(*), cleaning_requests(*)')
    .eq('id', assignmentId)
    .single()

  if (assignmentError || !assignment) {
    throw new Error('Assignment not found')
  }

  const staffRecord = assignment.staff as any
  const request = assignment.cleaning_requests as any

  // Authorization check: User must be an admin OR the staff member assigned to this job
  const isAssignedStaff = staffRecord?.profile_id === user.id
  if (!isAdmin && !isAssignedStaff) {
    throw new Error('Unauthorized: You are not assigned to this job')
  }

  // Update assignment status
  const updatePayload: any = {
    status: newStatus,
  }
  if (notes) {
    updatePayload.notes = notes
  }

  const { error: updateError } = await supabase
    .from('booking_assignments')
    .update(updatePayload)
    .eq('id', assignmentId)

  if (updateError) throw new Error(updateError.message)

  // Synchronize parent cleaning_requests status if appropriate
  let targetBookingStatus: any = null
  if (newStatus === 'in_progress') {
    targetBookingStatus = 'In Progress'
  } else if (newStatus === 'completed') {
    targetBookingStatus = 'Completed'
  }

  if (targetBookingStatus && request && request.status !== targetBookingStatus) {
    await supabase
      .from('cleaning_requests')
      .update({ status: targetBookingStatus })
      .eq('id', request.id)

    // Log in booking status history
    await supabase.from('booking_status_history').insert({
      request_id: request.id,
      old_status: request.status,
      new_status: targetBookingStatus,
      changed_by: user.id,
      note: notes || `Updated by field staff (${staffRecord?.full_name || 'Staff'})`
    })
  }

  revalidatePath('/staff')
  revalidatePath('/staff/jobs')
  revalidatePath(`/staff/jobs/${assignmentId}`)
  revalidatePath('/admin/requests')
  revalidatePath('/admin')
  if (request?.id) {
    revalidatePath(`/my-requests/${request.id}`)
  }

  return { success: true }
}

export async function assignStaffToBooking(
  requestId: string,
  staffId: string,
  notes?: string
) {
  const supabase = await createClient()
  
  // Verify Admin Role securely
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  // Check if an assignment already exists for this request
  const { data: existingAssignment } = await supabase
    .from('booking_assignments')
    .select('id')
    .eq('request_id', requestId)
    .maybeSingle()

  if (existingAssignment) {
    const { error } = await supabase
      .from('booking_assignments')
      .update({
        staff_id: staffId,
        assigned_by: user.id,
        status: 'assigned',
        notes: notes || null
      })
      .eq('id', existingAssignment.id)

    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('booking_assignments')
      .insert({
        request_id: requestId,
        staff_id: staffId,
        assigned_by: user.id,
        status: 'assigned',
        notes: notes || null
      })

    if (error) throw new Error(error.message)
  }

  // If request is still Pending, move it to Confirmed
  const { data: req } = await supabase
    .from('cleaning_requests')
    .select('status')
    .eq('id', requestId)
    .single()

  if (req && (req.status === 'Pending' || req.status === 'Contacted')) {
    await supabase
      .from('cleaning_requests')
      .update({ status: 'Confirmed' })
      .eq('id', requestId)

    await supabase.from('booking_status_history').insert({
      request_id: requestId,
      old_status: req.status,
      new_status: 'Confirmed',
      changed_by: user.id,
      note: 'Staff member assigned by Admin'
    })
  }

  revalidatePath('/admin/requests')
  revalidatePath('/admin/calendar')
  revalidatePath('/staff')
  revalidatePath('/staff/jobs')
  revalidatePath(`/my-requests/${requestId}`)

  return { success: true }
}
