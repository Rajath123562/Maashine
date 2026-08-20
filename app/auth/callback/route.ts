import { createClient } from '../../lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Ensure user profile exists in profiles table
      const { user } = data
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'Customer'
      const email = user.email || ''
      const phone = user.user_metadata?.phone || ''

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (!existingProfile) {
        await supabase.from('profiles').insert({
          id: user.id,
          full_name: fullName,
          email: email,
          phone: phone,
          role: 'customer'
        })
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login with error if auth failed
  return NextResponse.redirect(`${origin}/login?error=Could%20not%20authenticate%20with%20Google`)
}
