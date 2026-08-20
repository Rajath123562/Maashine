'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  const isAdmin = (data.email || '').trim().toLowerCase() === 'rajath.raj2569@gmail.com'
  redirect(isAdmin ? '/admin' : '/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const full_name = (formData.get('full_name') as string)?.trim() || 'Customer'
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const phone = (formData.get('phone') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password || !phone) {
    redirect('/register?error=Please%20fill%20in%20all%20required%20fields')
  }

  const { error, data: authData } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        phone,
      }
    }
  })

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`)
  }

  const isAdmin = email === 'rajath.raj2569@gmail.com'

  // Insert or update profile
  if (authData.user) {
    await supabase.from('profiles').upsert({
      id: authData.user.id,
      full_name,
      email,
      phone,
      role: isAdmin ? 'admin' : 'customer'
    })
  }

  // If email verification is active on Supabase project, notify the user
  if (authData.user && !authData.session) {
    redirect('/login?message=Registration%20successful!%20Please%20log%20in%20to%20your%20account.')
  }

  revalidatePath('/', 'layout')
  redirect(isAdmin ? '/admin' : '/dashboard')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  })

  if (error) {
    redirect('/forgot-password?error=Could not send reset email')
  }

  redirect('/forgot-password?message=Password reset email sent. Please check your inbox.')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
