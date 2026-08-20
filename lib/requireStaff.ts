import { createClient } from '../app/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function requireStaff() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is in the staff table
  const { data: staffRecord } = await supabase
    .from('staff')
    .select('*')
    .eq('profile_id', user.id)
    .single()

  if (!staffRecord || staffRecord.status !== 'active') {
    // Check if they are an admin as fallback
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      return { supabase, user, isOwnerAdmin: true, staffRecord: null }
    }
    
    redirect('/dashboard')
  }

  return { supabase, user, isOwnerAdmin: false, staffRecord }
}
