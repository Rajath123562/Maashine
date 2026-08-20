'use server'

import { createClient } from '../lib/supabase/server'
import { revalidatePath } from 'next/cache'

import { BookingSchema, calculatePrice } from '../../lib/pricing'
import { sendNotification } from '../../lib/notifications'

export async function submitBookingRequest(formData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // 1. Validate Input Server-Side
  const parsedData = BookingSchema.safeParse(formData)
  if (!parsedData.success) {
    const errorMsg = parsedData.error.issues?.[0]?.message || 'Invalid booking data'
    throw new Error('Invalid booking data: ' + errorMsg)
  }
  const data = parsedData.data

  // 2. Duplicate Protection (Idempotency check within last 5 minutes)
  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  const { data: recentBookings } = await supabase
    .from('cleaning_requests')
    .select('id')
    .eq('customer_id', user.id)
    .eq('service_id', data.service_id)
    .gte('created_at', fiveMinsAgo)

  if (recentBookings && recentBookings.length > 0) {
    throw new Error('You just submitted a booking for this service. Please wait a few minutes.')
  }

  // Ensure profile exists (handles case where signup didn't create one)
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  let profile = existingProfile
  if (!profile) {
    const { data: newProfile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer',
        email: user.email!,
        phone: user.user_metadata?.phone || '',
        role: 'customer'
      })
      .select()
      .single()

    if (profileError) {
      throw new Error('Failed to create your profile. Please try again or contact support.')
    }
    profile = newProfile
  }

  // Calculate authoritative price on the server
  const { data: serviceData } = await supabase
    .from('services')
    .select('*')
    .eq('id', data.service_id)
    .single()

  if (!serviceData) {
    throw new Error('Service not found')
  }

  const priceResult = calculatePrice(serviceData as any, {
    property_size: data.property_size,
    property_condition: data.property_condition
  })

  // Insert Booking
  const { data: insertedData, error } = await supabase
    .from('cleaning_requests')
    .insert({
      customer_id: user.id,
      service_id: data.service_id,
      property_type: data.property_type,
      rooms: data.rooms,
      bathrooms: data.bathrooms,
      property_size: data.property_size,
      property_condition: data.property_condition || null,
      is_quote_request: priceResult.isQuote,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      alternative_date: data.alternative_date || null,
      alternative_time: data.alternative_time || null,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      landmark: data.landmark,
      additional_notes: data.additional_notes,
      status: 'Pending'
    })
    .select()
    .single()

  if (error) {
    if (error.message.includes('unique_active_booking_slot')) {
      throw new Error('This date and time slot has just been booked by someone else. Please select a different time.')
    }
    throw new Error(error.message)
  }

  // Insert Payment Record
  if (!priceResult.isQuote && formData.transaction_reference) {
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        request_id: insertedData.id,
        customer_id: user.id,
        amount: priceResult.amount || 0,
        currency: 'INR',
        payment_method: 'UPI',
        transaction_reference: formData.transaction_reference.trim(),
        screenshot_path: formData.screenshot_path || null,
        status: 'Verification Pending'
      })

    if (paymentError) {
      console.error('Failed to create payment record:', paymentError)
      // We do not fail the booking if payment creation fails, but we should log it
    }
  }

  // Notifications
  await sendNotification({
    userId: user.id,
    requestId: insertedData.id,
    type: 'booking_created',
    title: 'Booking Request Received',
    message: `Thank you for choosing MaaShine. We have received your booking request #${insertedData.request_number}. Our team will review it shortly.`,
    sendEmail: true,
    emailAddress: profile.email
  })

  revalidatePath('/dashboard')
  return { success: true, requestId: insertedData.id }
}

export async function cancelBookingRequest(requestId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // Verify ownership
  const { data: request } = await supabase
    .from('cleaning_requests')
    .select('customer_id, status')
    .eq('id', requestId)
    .single()

  if (!request || request.customer_id !== user.id) {
    throw new Error('Unauthorized')
  }

  // Only allow cancellation of Pending or Contacted requests
  if (!['Pending', 'Contacted'].includes(request.status)) {
    throw new Error(`Cannot cancel a request that is already ${request.status}`)
  }

  // Update status
  const { error } = await supabase
    .from('cleaning_requests')
    .update({ status: 'Cancelled' })
    .eq('id', requestId)

  if (error) throw new Error(error.message)

  // Log history
  await supabase.from('booking_status_history').insert({
    request_id: requestId,
    old_status: request.status,
    new_status: 'Cancelled',
    changed_by: user.id,
    note: 'Cancelled by customer'
  })

  // Optionally cancel related payments
  await supabase
    .from('payments')
    .update({ status: 'Rejected', rejection_reason: 'Booking Cancelled' })
    .eq('request_id', requestId)
    .eq('status', 'Verification Pending')

  // Notification for admin (Optional) could be added here, but customer notification for cancellation
  await sendNotification({
    userId: user.id,
    requestId: requestId,
    type: 'booking_cancelled',
    title: 'Booking Cancelled',
    message: `Your booking request has been successfully cancelled.`,
    sendEmail: false
  })

  revalidatePath(`/my-requests/${requestId}`)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function submitBooking(serviceId: string, bookingTime: string, frontendPrice: number) {
  const supabase = await createClient()
  const { data: service, error } = await supabase.from('services').select('price').eq('id', serviceId).single()
  if (error || !service) throw new Error('Service not found')
  if (parseFloat(service.price) !== frontendPrice) {
    throw new Error('Price manipulation detected')
  }
  const res = await supabase.rpc('create_booking', {
    p_service_id: serviceId,
    p_booking_time: bookingTime
  })
  return { success: true, bookingId: res?.data || 'booking-id' }
}
