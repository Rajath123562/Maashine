import { createClient } from '../lib/supabase/server'
import MultiStepBooking from '../../components/MultiStepBooking'
import { getBusinessSettings } from '../actions/settings'
import { redirect } from 'next/navigation'

export default async function BookingPage() {
  const supabase = await createClient()
  
  // Ensure user is logged in
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user || null
  } catch (err) {
    console.error('Error getting user:', err)
  }

  if (!user) {
    redirect('/login')
  }

  // Fetch active services
  let services: any[] | null = null
  let servicesError: any = null
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true })
    services = data
    servicesError = error
  } catch (err) {
    servicesError = err
    console.error('Error fetching services:', err)
  }

  // Fetch user profile for default values
  let profile = null
  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  } catch (err) {
    console.error('Error fetching profile:', err)
  }

  // Fetch business settings
  const businessSettings = await getBusinessSettings()

  return (
    <main className="min-h-screen bg-linen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-ink text-center mb-2">Request a Cleaning</h1>
        <p className="text-sage text-center mb-12">Complete the steps below to secure your preferred slot.</p>
        
        {/* Show actionable error if DB is misconfigured */}
        {servicesError && (
          <div className="bg-red-50 border-2 border-red-400 text-red-700 p-6 rounded-2xl mb-8">
            <h3 className="font-bold text-lg mb-2">⚠️ Services Not Available</h3>
            <p className="text-sm mb-3">The services database needs to be set up. Please visit the link below to initialize it:</p>
            <a href="/api/seed" className="inline-block bg-red-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-red-700 transition-colors">
              Click here to set up services →
            </a>
            <p className="text-xs mt-3 text-red-500 font-mono">{servicesError.message}</p>
          </div>
        )}

        {(!services || services.length === 0) && !servicesError && (
          <div className="bg-marigold/10 border border-marigold/30 text-ink p-6 rounded-2xl mb-8 text-center">
            <h3 className="font-bold text-lg mb-2">No Services Available</h3>
            <p className="text-sage text-sm mb-4">Click below to load all 9 MaaShine services into the database.</p>
            <a href="/api/seed" className="inline-block bg-teal text-white font-bold px-6 py-2 rounded-xl hover:bg-teal/90 transition-colors">
              Initialize Services Database →
            </a>
          </div>
        )}
        
        <MultiStepBooking services={services || []} profile={profile} businessSettings={businessSettings} />
      </div>
    </main>
  )
}
