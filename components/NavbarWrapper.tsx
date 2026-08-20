import { createClient } from '../app/lib/supabase/server'
import NavbarClient from './Navbar'

export default async function NavbarWrapper() {
  // Prevent crashing if env variables are not set during build/dev
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <NavbarClient user={null} profile={null} />
  }

  try {
    const supabase = await createClient()

    let user = null
    try {
      const { data } = await supabase.auth.getUser()
      user = data?.user || null
    } catch (e) {
      user = null
    }
    
    let profile = null
    if (user) {
      try {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        profile = data || null
      } catch (e) {
        profile = null
      }
    }

    return <NavbarClient user={user} profile={profile} />
  } catch (error) {
    console.error('NavbarWrapper auth check error:', error)
    return <NavbarClient user={null} profile={null} />
  }
}
