import { createClient } from '../lib/supabase/server'
import ServiceCatalogue from '../../components/ServiceCatalogue'

export default async function ServicesPage() {
  let services: any[] | null = null

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true })
    services = data
  } catch (err) {
    console.error('Error fetching services:', err)
  }

  return (
    <main className="min-h-screen bg-linen pt-16 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-ink mb-4">Our Cleaning Services</h1>
          <p className="text-xl text-sage max-w-2xl mx-auto">Professional cleaning solutions designed to make your home and workplace cleaner, fresher, and more comfortable.</p>
        </div>

        {services && services.length > 0 && <ServiceCatalogue services={services} />}
        
        {(!services || services.length === 0) && (
          <div className="text-center py-20 bg-white rounded-3xl p-10 border border-sage/20 shadow-sm max-w-xl mx-auto">
            <h3 className="text-2xl font-bold text-ink mb-2">Setting Up Services</h3>
            <p className="text-sage mb-6">If you are the site owner, click below to automatically seed all 9 MaaShine services into the database.</p>
            <a href="/api/seed" className="inline-block bg-teal text-white font-bold px-8 py-3 rounded-full hover:bg-teal/90 transition-colors shadow-md">
              Initialize Services Database →
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
