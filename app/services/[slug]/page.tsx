import { createClient } from '../../lib/supabase/server'
import { getBusinessSettings } from '../../actions/settings'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, ArrowLeft, ShieldCheck, Clock, MapPin } from 'lucide-react'
import WhatsAppCTA from '../../../components/WhatsAppCTA'
import PhoneCTA from '../../../components/PhoneCTA'
import ShareMaaShine from '../../../components/ShareMaaShine'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: service } = await supabase
    .from('services')
    .select('name, description')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!service) {
    return {
      title: 'Service Not Found | MaaShine Mysore',
    }
  }

  return {
    title: `${service.name} in Mysore | MaaShine Professional Cleaning`,
    description: `${service.description} Available across Mysore, Karnataka with transparent pricing and trained cleaners.`,
    openGraph: {
      title: `${service.name} in Mysore | MaaShine Cleaning Services`,
      description: service.description,
      url: `https://maashineservices.com/services/${slug}`,
    }
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const businessSettings = await getBusinessSettings()
  
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!service) {
    notFound()
  }

  const isQuote = service.pricing_type === 'quote'

  return (
    <main className="min-h-screen bg-linen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center justify-between text-sm">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-teal font-bold hover:underline">
            <ArrowLeft size={16} />
            <span>Back to All Services</span>
          </Link>
          <ShareMaaShine
            title={`${service.name} in Mysore | MaaShine`}
            variant="compact"
          />
        </nav>

        <div className="bg-white rounded-3xl shadow-xl border border-sage/20 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal to-teal/80 p-8 sm:p-10 text-white space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block px-3.5 py-1 bg-white/20 rounded-full text-xs font-extrabold uppercase tracking-wider">
                {service.category}
              </span>
              <span className="inline-flex items-center gap-1 bg-black/20 text-white px-3 py-1 rounded-full text-xs font-semibold">
                <MapPin size={12} />
                <span>Mysore, Karnataka</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">{service.name}</h1>
            <p className="text-base sm:text-lg text-white/90 max-w-2xl">{service.description}</p>
          </div>

          <div className="p-6 sm:p-10 space-y-10">
            
            {/* Pricing Details */}
            <section>
              <h2 className="text-2xl font-bold text-ink mb-6">Pricing in Mysore</h2>
              
              {service.pricing_type === 'fixed' && (
                <div className="bg-linen p-6 rounded-2xl border border-sage/20 inline-block">
                  <span className="block text-sm text-sage font-semibold mb-1">Standard Rate</span>
                  <span className="text-4xl font-extrabold text-teal">₹{service.price.toLocaleString('en-IN')}</span>
                  <p className="text-xs text-sage mt-2">Upfront price confirmed upon booking.</p>
                </div>
              )}

              {service.slug === 'home-deep-cleaning' && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-linen text-ink font-bold text-sm">
                        <th className="p-4 text-left rounded-tl-xl">Property Size</th>
                        <th className="p-4 text-left">Condition</th>
                        <th className="p-4 text-right rounded-tr-xl">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sage/10">
                        <td className="p-4 font-medium">20 × 30</td>
                        <td className="p-4 text-sage">New / Unoccupied</td>
                        <td className="p-4 text-right font-extrabold text-teal">₹6,500</td>
                      </tr>
                      <tr className="border-b border-sage/10">
                        <td className="p-4 font-medium">20 × 30</td>
                        <td className="p-4 text-sage">Living / Occupied</td>
                        <td className="p-4 text-right font-extrabold text-teal">₹7,500</td>
                      </tr>
                      <tr className="border-b border-sage/10">
                        <td className="p-4 font-medium">30 × 40</td>
                        <td className="p-4 text-sage">New / Unoccupied</td>
                        <td className="p-4 text-right font-extrabold text-teal">₹8,500</td>
                      </tr>
                      <tr className="border-b border-sage/10">
                        <td className="p-4 font-medium">30 × 40</td>
                        <td className="p-4 text-sage">Living / Occupied</td>
                        <td className="p-4 text-right font-extrabold text-teal">₹9,500</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Custom Size</td>
                        <td className="p-4 text-sage">Any</td>
                        <td className="p-4 text-right font-extrabold text-marigold">Price on Request</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-sage mt-3 italic">* Living/Occupied rates vary based on furniture density and specific site requirements.</p>
                </div>
              )}

              {service.slug === 'window-glass-cleaning' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-linen p-6 rounded-2xl border border-sage/20">
                    <span className="block text-sm text-sage font-semibold mb-1">Standard Window</span>
                    <span className="text-3xl font-extrabold text-teal">₹650</span>
                    <p className="text-xs text-sage mt-2">Frame and mesh cleaning included</p>
                  </div>
                  <div className="bg-linen p-6 rounded-2xl border border-sage/20">
                    <span className="block text-sm text-sage font-semibold mb-1">Balcony / Large Window</span>
                    <span className="text-3xl font-extrabold text-teal">₹850</span>
                    <p className="text-xs text-sage mt-2">Frame and mesh cleaning included</p>
                  </div>
                </div>
              )}

              {isQuote && (
                <div className="bg-marigold/10 p-6 rounded-2xl border border-marigold/30">
                  <span className="text-2xl font-extrabold text-marigold">Custom Quotation</span>
                  <p className="text-sm text-sage mt-2">Tailored pricing based on total floor area, site condition, and schedule requirements in Mysore.</p>
                </div>
              )}
            </section>

            {/* What's Included */}
            {service.includes && service.includes.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-ink mb-6">What's Included in this Service</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {service.includes.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 bg-linen/50 p-4 rounded-xl border border-sage/10">
                      <CheckCircle2 className="text-teal flex-shrink-0" size={20} />
                      <span className="text-ink font-medium text-sm sm:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* The MaaShine Promise */}
            <section className="bg-linen/50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <ShieldCheck size={24} className="text-teal flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-ink">Background-Checked</h4>
                  <p className="text-xs text-sage">Trusted local cleaners</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={24} className="text-marigold flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-ink">On-Time Arrival</h4>
                  <p className="text-xs text-sage">Punctual Mysore scheduling</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="text-teal flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-ink">Transparent Pricing</h4>
                  <p className="text-xs text-sage">No surprise add-ons</p>
                </div>
              </div>
            </section>

            {/* Action Card with Booking, WhatsApp & Call */}
            <section className="bg-linen p-8 rounded-3xl text-center border border-sage/20 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-ink">
                  {isQuote ? `Request a Quote for ${service.name}` : `Ready to Book ${service.name}?`}
                </h3>
                <p className="text-sage text-sm sm:text-base max-w-lg mx-auto">
                  {isQuote 
                    ? 'Submit your request or chat with us on WhatsApp for an immediate estimate.'
                    : 'Select your preferred date and slot online, or contact us directly on WhatsApp.'
                  }
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link 
                  href="/booking" 
                  className="w-full sm:w-auto bg-teal text-white font-bold px-10 py-4 rounded-full hover:bg-teal/90 transition-all shadow-md text-base text-center"
                >
                  {isQuote ? 'Request a Quote' : 'Book Online Now'}
                </Link>
                <WhatsAppCTA
                  phoneNumber={businessSettings.whatsapp_number}
                  serviceName={service.name}
                  variant="outline"
                  label="Ask on WhatsApp"
                  className="w-full sm:w-auto"
                />
                <PhoneCTA
                  phoneNumber={businessSettings.phone}
                  variant="compact"
                  className="w-full sm:w-auto justify-center"
                />
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  )
}
