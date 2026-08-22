'use server'

import { createClient } from '../lib/supabase/server'
import { requireAdmin } from '../../lib/requireAdmin'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const SettingsSchema = z.object({
  business_name: z.string().min(2, "Business name is too short").max(100),
  phone: z.string().min(10, "Phone number is too short").max(20),
  email: z.string().email("Invalid email address"),
  whatsapp_number: z.string().min(10, "WhatsApp number is too short").max(20),
  upi_id: z.string().min(5, "UPI ID is too short").max(50),
  address: z.string().min(5, "Address is too short").max(200),
  operating_hours: z.string().min(5, "Operating hours is too short").max(100)
})

export async function getBusinessSettings() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error || !data) {
      // Return sensible defaults if database doesn't have the row yet (or hasn't been migrated)
      return {
        business_name: 'MaaShine Cleaning Services',
        phone: '+91 99168 87855',
        email: 'rajath.raj2569@gmail.com',
        whatsapp_number: '+91 99168 87855',
        upi_id: '9916887855@upi',
        address: '#610, 8th Main, 12th Cross, Near Hemavathi School, Mysore, Karnataka',
        operating_hours: 'Mon-Sat, 9AM to 6PM'
      }
    }

    // If the database still holds initial placeholder zeros, use the active business number
    const isPlaceholderPhone = !data.phone || data.phone.includes('0000000000') || data.phone.includes('8105699620')
    const isPlaceholderWA = !data.whatsapp_number || data.whatsapp_number.includes('0000000000') || data.whatsapp_number.includes('8105699620')

    return {
      ...data,
      phone: isPlaceholderPhone ? '+91 99168 87855' : data.phone,
      whatsapp_number: isPlaceholderWA ? '+91 99168 87855' : data.whatsapp_number,
      upi_id: data.upi_id === 'yourbusiness@upi' || data.upi_id === '8105699620@upi' ? '9916887855@upi' : data.upi_id
    }
  } catch (err) {
    return {
      business_name: 'MaaShine Cleaning Services',
      phone: '+91 99168 87855',
      email: 'rajath.raj2569@gmail.com',
      whatsapp_number: '+91 99168 87855',
      upi_id: '9916887855@upi',
      address: '#610, 8th Main, 12th Cross, Near Hemavathi School, Mysore, Karnataka',
      operating_hours: 'Mon-Sat, 9AM to 6PM'
    }
  }
}

export async function updateBusinessSettings(formData: z.infer<typeof SettingsSchema>) {
  // 1. Authorize Admin
  await requireAdmin()
  
  // 2. Validate input
  const validated = SettingsSchema.safeParse(formData)
  if (!validated.success) {
    throw new Error(validated.error.issues?.[0]?.message || 'Invalid business settings')
  }

  // 3. Perform update (RLS also protects this)
  const supabase = await createClient()
  const { error } = await supabase
    .from('business_settings')
    .update(validated.data)
    .eq('id', 1)

  if (error) {
    console.error('Failed to update business settings:', error)
    throw new Error('Failed to update business settings. Please try again.')
  }

  // 4. Revalidate routes
  revalidatePath('/admin/settings')
  revalidatePath('/')
  
  return { success: true }
}
