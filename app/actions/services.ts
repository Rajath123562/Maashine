'use server'
import { createClient } from '../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addService(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  
  if (profile?.role !== 'admin') throw new Error('Unauthorized')

  const includesStr = formData.get('includes') as string;
  const includesArr = includesStr ? includesStr.split(',').map(i => i.trim()).filter(Boolean) : [];

  const name = formData.get('name') as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  await supabase.from('services').insert({
    name,
    slug,
    description: formData.get('description'),
    category: formData.get('category') || 'Residential',
    pricing_type: formData.get('pricing_type') || 'fixed',
    price: formData.get('price') || 0,
    includes: includesArr,
    active: true
  })

  revalidatePath('/admin/services')
  revalidatePath('/services')
}

export async function toggleServiceStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  
  if (profile?.role !== 'admin') throw new Error('Unauthorized')

  await supabase.from('services').update({ active: !currentStatus }).eq('id', id)

  revalidatePath('/admin/services')
  revalidatePath('/services')
}
