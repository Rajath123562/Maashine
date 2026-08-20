import { getBusinessSettings } from '../actions/settings'
import ShareMaaShine from '../../components/ShareMaaShine'
import WhatsAppCTA from '../../components/WhatsAppCTA'
import PhoneCTA from '../../components/PhoneCTA'
import Link from 'next/link'
import { Sparkles, ShieldCheck, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Share MaaShine | Refer Friends & Family in Mysore',
  description: 'Share trusted professional home and deep cleaning services in Mysore with friends, family, and neighbors.',
  openGraph: {
    title: 'Share MaaShine Cleaning Services | Mysore, Karnataka',
    description: 'Looking for reliable home, kitchen, bathroom, or sofa cleaning in Mysore? Share MaaShine with your network.',
    url: 'https://maashineservices.com/refer'
  }
}

export default async function ReferPage() {
  const businessSettings = await getBusinessSettings()

  const services = [
    { title: 'Home Deep Cleaning', desc: 'Complete property deep-clean with thorough disinfection.' },
    { title: 'Kitchen Cleaning', desc: 'Degreasing, tile scrubbing, exhaust & cabinet sanitization.' },
    { title: 'Bathroom Cleaning', desc: 'Hard water stain removal, tile descaling & full sanitization.' },
    { title: 'Sofa & Mattress Care', desc: 'Deep fabric extraction and dust-mite allergen removal.' },
  ]

  return (
    <main className="min-h-screen bg-linen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-lime/30 text-ink px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <HeartHandshake size={14} className="text-ink" />
            <span>Support Local Cleaning in Mysore</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-ink tracking-tight">
            Share <span className="text-teal">MaaShine</span> with Friends & Family
          </h1>
          <p className="text-lg sm:text-xl text-sage max-w-2xl mx-auto">
            Know someone moving into a new home, renovating, or needing a sparkling deep clean in Mysore? Help them discover professional, dependable cleaning.
          </p>
        </div>

        {/* Share Card Component */}
        <ShareMaaShine
          title="MaaShine Cleaning Services | Mysore"
          text="Looking for trusted home, kitchen, or deep cleaning in Mysore? I recommend MaaShine Cleaning Services:"
        />

        {/* Why People Trust MaaShine */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-sage/20 shadow-sm space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-extrabold text-ink mb-2">Why Recommend MaaShine?</h2>
            <p className="text-sage text-sm sm:text-base">
              Here is what your friends and family can expect when you refer them to MaaShine:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-linen/50 border border-slate-100">
              <div className="bg-teal text-white p-2.5 rounded-xl flex-shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold text-ink text-base">Upfront, Honest Pricing</h3>
                <p className="text-sage text-xs sm:text-sm mt-1">
                  Clear prices calculated before booking with zero hidden charges or on-site surprise fees.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-linen/50 border border-slate-100">
              <div className="bg-marigold text-ink p-2.5 rounded-xl flex-shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-ink text-base">Verified Cleaning Team</h3>
                <p className="text-sage text-xs sm:text-sm mt-1">
                  Background-checked, trained local professionals dedicated to thorough quality.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-linen/50 border border-slate-100">
              <div className="bg-lime text-ink p-2.5 rounded-xl flex-shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-ink text-base">Safe, Eco-Friendly Supplies</h3>
                <p className="text-sage text-xs sm:text-sm mt-1">
                  Kid- and pet-friendly cleaning solutions that clean deeply without harsh toxic fumes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-linen/50 border border-slate-100">
              <div className="bg-teal text-white p-2.5 rounded-xl flex-shrink-0">
                <HeartHandshake size={20} />
              </div>
              <div>
                <h3 className="font-bold text-ink text-base">Pay After Service Verification</h3>
                <p className="text-sage text-xs sm:text-sm mt-1">
                  Convenient, secure manual UPI/GPay payment verified after scheduling.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Highlight */}
        <div className="bg-white p-8 rounded-3xl border border-sage/20 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-ink">Popular Services We Offer</h2>
              <p className="text-sage text-sm">Available across all residential and commercial zones in Mysore.</p>
            </div>
            <Link href="/services" className="inline-flex items-center gap-1.5 text-teal font-bold text-sm hover:underline">
              <span>View All Services</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((srv, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-linen/30 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-teal flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-ink text-sm">{srv.title}</h3>
                  <p className="text-xs text-sage mt-0.5">{srv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Contact & Quick Booking CTAs */}
        <div className="bg-teal text-white p-8 sm:p-10 rounded-3xl shadow-lg text-center space-y-6">
          <h2 className="text-3xl font-extrabold">Ready to Schedule or Inquire?</h2>
          <p className="text-lime text-base sm:text-lg max-w-xl mx-auto font-medium">
            Contact us directly on WhatsApp or book your cleaning in seconds.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/booking"
              className="bg-lime hover:bg-marigold text-ink font-bold px-8 py-4 rounded-full shadow-md transition-all text-base"
            >
              Book a Cleaning Online
            </Link>
            <WhatsAppCTA
              phoneNumber={businessSettings.whatsapp_number}
              variant="secondary"
              label="Chat on WhatsApp"
            />
            <PhoneCTA
              phoneNumber={businessSettings.phone}
              variant="outline"
              className="!text-white !border-white/50 hover:!bg-white/10"
            />
          </div>
        </div>

      </div>
    </main>
  )
}
