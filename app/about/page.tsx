import Link from 'next/link'
import { Sparkles, ShieldCheck, MapPin, CheckCircle2, HeartHandshake } from 'lucide-react'
import { getBusinessSettings } from '../actions/settings'
import WhatsAppCTA from '../../components/WhatsAppCTA'
import PhoneCTA from '../../components/PhoneCTA'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About MaaShine | Professional Cleaning Company in Mysore',
  description: 'Learn about MaaShine Cleaning Services in Mysore, Karnataka. Our mission, quality standards, vetted team, and commitment to sparkling spaces.',
}

export default async function AboutPage() {
  const settings = await getBusinessSettings()

  return (
    <main className="min-h-screen bg-linen pt-16 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <MapPin size={14} />
            <span>Serving Mysore, Karnataka</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-ink">
            About <span className="text-teal">MaaShine</span>
          </h1>
          <p className="text-lg sm:text-xl text-sage max-w-2xl mx-auto">
            Dedicated to providing dependable, thorough, and transparent residential & commercial cleaning across Mysore.
          </p>
        </div>
        
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-sage/20 space-y-10">
          
          {/* Mission */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mb-4">Our Mission</h2>
            <p className="text-sage text-base sm:text-lg leading-relaxed">
              We believe a truly clean home fosters peace of mind and productivity. MaaShine was founded in Mysore to bring structured professionalism, dependable scheduling, and upfront honesty to property cleaning services.
            </p>
          </div>
          
          {/* Core Values */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mb-6">The MaaShine Standard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-linen/50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2.5 text-teal font-bold">
                  <ShieldCheck size={20} />
                  <span>Vetted & Background-Checked</span>
                </div>
                <p className="text-sage text-sm leading-relaxed">
                  Every cleaning team member undergoes identity verification and thorough practical training before entering your home.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-linen/50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2.5 text-teal font-bold">
                  <CheckCircle2 size={20} />
                  <span>100% Upfront Transparent Pricing</span>
                </div>
                <p className="text-sage text-sm leading-relaxed">
                  Clear prices calculated before booking. Zero hidden fees, unexpected surcharges, or on-site price renegotiations.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-linen/50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2.5 text-teal font-bold">
                  <Sparkles size={20} />
                  <span>50-Point Quality Checklist</span>
                </div>
                <p className="text-sage text-sm leading-relaxed">
                  Structured cleaning protocols ensuring high-touch areas, kitchen degreasing, and bathroom descaling are completely covered.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-linen/50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2.5 text-teal font-bold">
                  <HeartHandshake size={20} />
                  <span>Single-Team Punctual Service</span>
                </div>
                <p className="text-sage text-sm leading-relaxed">
                  We schedule one dedicated cleaning team per reserved slot, guaranteeing focused care and on-time arrival.
                </p>
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="bg-linen p-8 sm:p-10 rounded-3xl text-center border border-sage/20 space-y-6">
            <h3 className="text-2xl font-extrabold text-ink">Ready to Experience the MaaShine Difference?</h3>
            <p className="text-sage text-sm sm:text-base max-w-lg mx-auto">
              Book your preferred cleaning slot online or chat directly with our team in Mysore.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                href="/booking" 
                className="w-full sm:w-auto bg-teal text-white font-bold px-8 py-3.5 rounded-full hover:bg-teal/90 transition-all shadow-md text-center text-sm"
              >
                Book a Cleaning Online
              </Link>
              <WhatsAppCTA
                phoneNumber={settings.whatsapp_number}
                variant="outline"
                label="Chat on WhatsApp"
                className="w-full sm:w-auto"
              />
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
