'use server'

import { createClient } from '../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitContactMessage(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()

  if (!name || !email || !message) {
    return { success: false, error: 'All fields are required.' }
  }

  const supabase = await createClient()

  // Try inserting into contact_messages table
  const { error } = await supabase
    .from('contact_messages')
    .insert({
      name,
      email,
      message,
      read: false
    })

  if (error) {
    console.error('Contact submission error:', error)
    return { 
      success: false, 
      error: error.message.includes('does not exist') 
        ? 'Contact database table is being initialized. You can also reach us directly via WhatsApp (9916887855) or email (rajath.raj2569@gmail.com).' 
        : error.message || 'Failed to send message. Please try again.' 
    }
  }

  revalidatePath('/admin')
  return { success: true }
}
