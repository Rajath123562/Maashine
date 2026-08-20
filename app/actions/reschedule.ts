'use server'

import { createClient } from '../lib/supabase/server'
import { sendNotification } from '../../lib/notifications'
import { z } from 'zod'
import { requireAdmin } from '../../lib/requireAdmin'
import { revalidatePath } from 'next/cache'

const RescheduleSchema = z.object({
  requestId: z.string().uuid(),
  original_date: z.string(),
  original_time: z.string(),
  proposed_date: z.string().refine(val => new Date(val) >= new Date(new Date().setHours(0,0,0,0)), "Date cannot be in the past"),
  proposed_time: z.string(),
  customer_reason: z.string().optional()
})

export async function requestReschedule(formData: z.infer<typeof RescheduleSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const validated = RescheduleSchema.safeParse(formData)
  if (!validated.success) {
    throw new Error(validated.error.issues?.[0]?.message || 'Invalid reschedule request')
  }

  const { requestId, original_date, original_time, proposed_date, proposed_time, customer_reason } = validated.data

  // 1. Verify the booking belongs to the customer and is eligible
  const { data: booking, error: bookingError } = await supabase
    .from('cleaning_requests')
    .select('customer_id, status')
    .eq('id', requestId)
    .single()

  if (bookingError || !booking || booking.customer_id !== user.id) {
    throw new Error('Booking not found or unauthorized')
  }

  if (booking.status !== 'Pending' && booking.status !== 'Contacted') {
    throw new Error('Booking is not eligible for rescheduling at this stage')
  }

  // 2. Check for duplicate pending requests
  const { data: existing, error: existingError } = await supabase
    .from('reschedule_requests')
    .select('id')
    .eq('cleaning_request_id', requestId)
    .eq('status', 'pending')
    .maybeSingle()

  if (existing) {
    throw new Error('A reschedule request is already pending for this booking.')
  }

  // 3. Create the request
  const { error } = await supabase
    .from('reschedule_requests')
    .insert({
      cleaning_request_id: requestId,
      customer_id: user.id,
      original_date,
      original_time,
      proposed_date,
      proposed_time,
      customer_reason
    })

  if (error) {
    console.error('Failed to request reschedule:', error)
    throw new Error('Failed to request reschedule. Please try again.')
  }

  // 4. Notify Admin
  await sendNotification({
    userId: user.id, // Notification is tied to the customer
    requestId: requestId,
    type: 'reschedule_requested',
    title: 'Reschedule Requested',
    message: `You have requested to reschedule your booking to ${proposed_date} at ${proposed_time}. The admin will review it shortly.`,
    sendEmail: false
  })

  revalidatePath(`/my-requests/${requestId}`)
  revalidatePath('/admin/requests')

  return { success: true }
}

export async function processRescheduleRequest(rescheduleId: string, action: 'approved' | 'rejected', adminReason?: string) {
  await requireAdmin()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Fetch request
  const { data: request, error: fetchError } = await supabase
    .from('reschedule_requests')
    .select('*')
    .eq('id', rescheduleId)
    .single()

  if (fetchError || !request) {
    throw new Error('Reschedule request not found')
  }

  if (request.status !== 'pending') {
    throw new Error('This request has already been processed')
  }

  // 2. Process
  if (action === 'approved') {
    // Update the booking itself
    const { error: updateBookingError } = await supabase
      .from('cleaning_requests')
      .update({
        preferred_date: request.proposed_date,
        preferred_time: request.proposed_time
      })
      .eq('id', request.cleaning_request_id)

    if (updateBookingError) throw new Error('Failed to update booking date/time')

    // Also insert an audit log / status history
    await supabase.from('booking_status_history').insert({
      request_id: request.cleaning_request_id,
      status: 'Rescheduled',
      note: `Rescheduled to ${request.proposed_date} at ${request.proposed_time}`
    })
  }

  // 3. Update the reschedule request status
  const { error: updateError } = await supabase
    .from('reschedule_requests')
    .update({
      status: action,
      admin_reason: adminReason,
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', rescheduleId)

  if (updateError) throw new Error('Failed to update request status')

  // 4. Notify customer
  await sendNotification({
    userId: request.customer_id,
    requestId: request.cleaning_request_id,
    type: 'reschedule_processed',
    title: `Reschedule Request ${action === 'approved' ? 'Approved' : 'Rejected'}`,
    message: `Your request to reschedule booking to ${request.proposed_date} was ${action}. ${adminReason ? `Reason: ${adminReason}` : ''}`,
    sendEmail: true
  })

  revalidatePath('/admin/requests')
  revalidatePath(`/my-requests/${request.cleaning_request_id}`)

  return { success: true }
}
