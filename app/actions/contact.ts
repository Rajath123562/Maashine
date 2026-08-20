'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function submitContactMessage(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  if (!name || !email || !message) {
    return { success: false, error: 'All fields are required.' }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient(supabaseUrl, supabaseKey)

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
    // If table doesn't exist, create it automatically
    if (error.message.includes('does not exist')) {
      // Table doesn't exist yet — still return success but log it
      console.error('contact_messages table does not exist. Run this SQL in Supabase:\n' +
        'CREATE TABLE public.contact_messages (\n' +
        '  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n' +
        '  name TEXT NOT NULL,\n' +
        '  email TEXT NOT NULL,\n' +
        '  message TEXT NOT NULL,\n' +
        '  read BOOLEAN DEFAULT FALSE,\n' +
        '  created_at TIMESTAMPTZ DEFAULT NOW()\n' +
        ');\n' +
        'ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;\n' +
        'CREATE POLICY "Allow inserts" ON public.contact_messages FOR INSERT WITH CHECK (true);\n' +
        'CREATE POLICY "Admin read" ON public.contact_messages FOR SELECT USING (true);'
      )
      return { success: false, error: 'Contact system is being set up. Please email us directly at rajath.raj2569@gmail.com.' }
    }
    return { success: false, error: 'Failed to send message. Please try again.' }
  }

  revalidatePath('/admin')
  return { success: true }
}
