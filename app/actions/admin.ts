'use server'

import { createClient } from '../lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendNotification } from '../../lib/notifications'

export async function updateRequestStatus(requestId: string, newStatus: string, adminNotes?: string) {
  const supabase = await createClient()
  
  // Verify Admin Role securely on the backend
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

  // Fetch existing request to get old status and customer details
  const { data: request } = await supabase
    .from('cleaning_requests')
    .select('status, customer_id, request_number, profiles(email)')
    .eq('id', requestId)
    .single()

  if (!request) throw new Error('Request not found')
  const oldStatus = request.status
  const customerProfile = request.profiles as any

  const updateData: any = { status: newStatus }
  if (adminNotes !== undefined) {
    updateData.admin_notes = adminNotes
  }

  const { error } = await supabase
    .from('cleaning_requests')
    .update(updateData)
    .eq('id', requestId)

  if (error) throw new Error(error.message)

  // Log status change history
  await supabase.from('booking_status_history').insert({
    request_id: requestId,
    old_status: oldStatus,
    new_status: newStatus,
    changed_by: user.id,
    note: adminNotes || 'Updated by Admin'
  })

  // Send notification to customer if status changed
  if (oldStatus !== newStatus) {
    await sendNotification({
      userId: request.customer_id,
      requestId: requestId,
      type: 'status_update',
      title: 'Booking Status Updated',
      message: `Your booking #${request.request_number} is now ${newStatus}. ${adminNotes ? `Message from admin: ${adminNotes}` : ''}`,
      sendEmail: true,
      emailAddress: customerProfile?.email
    })
  }

  revalidatePath(`/my-requests/${requestId}`)
  revalidatePath('/admin/requests')
  revalidatePath('/admin')
  return { success: true }
}
