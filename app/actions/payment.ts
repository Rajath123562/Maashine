'use server';

import { createClient } from '../lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { sendNotification } from '../../lib/notifications';
import { z } from 'zod';

const VerifyPaymentSchema = z.object({
  payment_id: z.string().min(1),
  action: z.enum(['verify', 'reject']),
  rejection_reason: z.string().optional()
});

export async function reviewPayment(formDataOrId: any, maybeAction?: 'verify' | 'reject', maybeReason?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Admin check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const payload = typeof formDataOrId === 'string'
    ? { payment_id: formDataOrId, action: maybeAction, rejection_reason: maybeReason }
    : formDataOrId;

  const parsedData = VerifyPaymentSchema.safeParse(payload);
  if (!parsedData.success) {
    throw new Error('Invalid data');
  }

  const { payment_id, action, rejection_reason } = parsedData.data;

  // Get current payment and associated request
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('request_id, amount, status, customer_id')
    .eq('id', payment_id)
    .single();

  if (paymentError || !payment) {
    throw new Error('Payment not found');
  }

  if (payment.status !== 'Verification Pending') {
    throw new Error('Payment is not pending verification');
  }

  // Fetch request details for notifications
  const { data: requestData } = await supabase
    .from('cleaning_requests')
    .select('request_number, profiles(email)')
    .eq('id', payment.request_id)
    .single();

  const customerProfile = requestData?.profiles as any;

  if (action === 'verify') {
    // 1. Update Payment Status
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'Paid',
        verified_by: user.id,
        verified_at: new Date().toISOString()
      })
      .eq('id', payment_id);

    if (updateError) throw new Error('Failed to update payment');

    // 2. Update Booking Status
    const { error: requestUpdateError } = await supabase
      .from('cleaning_requests')
      .update({ status: 'Confirmed' })
      .eq('id', payment.request_id);

    if (requestUpdateError) throw new Error('Failed to update booking status');

    // 3. Add to status history
    await supabase.from('booking_status_history').insert({
      request_id: payment.request_id,
      old_status: 'Pending',
      new_status: 'Confirmed',
      changed_by: user.id,
      note: 'Payment verified'
    });

    // Notify customer
    await sendNotification({
      userId: payment.customer_id,
      requestId: payment.request_id,
      type: 'payment_verified',
      title: 'Payment Verified & Booking Confirmed',
      message: `Your payment of ₹${payment.amount} has been successfully verified. Your booking #${requestData?.request_number} is now confirmed!`,
      sendEmail: true,
      emailAddress: customerProfile?.email
    });

  } else if (action === 'reject') {
    if (!rejection_reason) {
      throw new Error('Rejection reason is required');
    }

    // Update Payment Status only
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'Rejected',
        rejection_reason,
        verified_by: user.id,
        verified_at: new Date().toISOString()
      })
      .eq('id', payment_id);

    if (updateError) throw new Error('Failed to update payment');

    // Notify customer
    await sendNotification({
      userId: payment.customer_id,
      requestId: payment.request_id,
      type: 'payment_rejected',
      title: 'Payment Rejected',
      message: `Your payment of ₹${payment.amount} for booking #${requestData?.request_number} was rejected. Reason: ${rejection_reason}`,
      sendEmail: true,
      emailAddress: customerProfile?.email
    });
  }

  // Write to audit log
  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: `PAYMENT_${action.toUpperCase()}`,
    entity_type: 'payments',
    entity_id: payment_id,
    metadata: { reason: rejection_reason }
  });

  revalidatePath('/admin/payments');
  revalidatePath('/admin/requests');
  revalidatePath('/admin');
  revalidatePath(`/my-requests/${payment.request_id}`);
  
  return { success: true };
}

export async function submitPaymentClaim(bookingId: string, utr: string, amount: number) {
  const supabase = await createClient();
  const { data: booking, error } = await supabase
    .from('cleaning_requests')
    .select('service_id, services(price)')
    .eq('id', bookingId)
    .single();

  if (error || !booking) throw new Error('Booking not found');
  const actualPrice = Number((booking as any).services?.price || 0);
  if (actualPrice !== amount) {
    throw new Error('Amount mismatch detected');
  }

  const { error: insertError } = await supabase.from('payments').insert({
    booking_id: bookingId,
    amount,
    upi_transaction_id: utr,
    status: 'submitted'
  });

  if (insertError) throw new Error(insertError.message);
  return { success: true };
}

