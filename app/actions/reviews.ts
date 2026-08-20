'use server'

import { createClient } from '../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const request_id = formData.get('request_id') as string
  const rating = parseInt(formData.get('rating') as string)
  const comment = formData.get('comment') as string

  // Validate ownership and status
  const { data: request } = await supabase
    .from('cleaning_requests')
    .select('customer_id, status')
    .eq('id', request_id)
    .single()

  if (!request || request.customer_id !== user.id) {
    throw new Error('Unauthorized')
  }

  if (request.status !== 'Completed') {
    throw new Error('Can only review completed services')
  }

  // Insert review
  const { error } = await supabase.from('reviews').insert({
    request_id,
    customer_id: user.id,
    rating,
    comment,
    is_public: false // Requires admin approval to show on website
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/my-requests/${request_id}`)
  return { success: true }
}
