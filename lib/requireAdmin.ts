import { createClient } from '../app/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Server-side admin role verification.
 * Call this at the top of every admin page to ensure only admins can access the data.
 * Redirects non-admin users to /dashboard.
 */
export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  return { supabase, user }
}
