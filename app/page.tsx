import Link from 'next/link'
import { Sparkles, ShieldCheck, Clock, MapPin, CheckCircle2, Star, MessageSquare } from 'lucide-react'
import { getBusinessSettings } from './actions/settings'
import { createClient } from './lib/supabase/server'
import WhatsAppCTA from '../components/WhatsAppCTA'
import PhoneCTA from '../components/PhoneCTA'
import ServiceAreas from '../components/ServiceAreas'
import ShareMaaShine from '../components/ShareMaaShine'
import FAQ from '../components/FAQ'
import { FAQ_ITEMS } from '../lib/faqData'

export default async function HomePage() {
  const businessSettings = await getBusinessSettings()
  
  // FAQ Schema for SEO
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  }
  
  // Fetch real verified public reviews if any exist
  let reviews: any[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('reviews')
      .select('id, rating, comment, created_at, profiles(full_name)')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(6)
    reviews = data || []
  } catch (e) {
    reviews = []
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Hero Section */}
      <section className="bg-linen pt-16 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal via-linen to-linen pointer-events-none" />
        <div className="max-w-7xl mx-auto relative text-center">
          
          {/* Local Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold mb-6 border border-teal/20">
            <MapPin size={16} />
            <span>Professional Cleaning Services in Mysore, Karnataka</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-ink tracking-tight mb-6 leading-tight">
            A Cleaner Space.<br className="hidden sm:block" /> A Better Life in <span className="text-teal">Mysore</span>.
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-sage mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            Expert home deep cleaning, kitchen degreasing, bathroom sanitization, sofa care, and office cleaning with 100% transparent upfront pricing.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto">
            <Link
              href="/booking"
              className="w-full sm:w-auto bg-teal text-white font-bold px-10 py-4 rounded-full hover:bg-teal/90 transition-all shadow-lg hover:shadow-xl text-lg text-center"
            >
              Book a Cleaning
            </Link>
            <WhatsAppCTA
              phoneNumber={businessSettings.whatsapp_number}
              variant="outline"
              label="Chat on WhatsApp"
              className="w-full sm:w-auto"
            />
            <PhoneCTA
              phoneNumber={businessSettings.phone}
              variant="secondary"
              className="w-full sm:w-auto"
            />
          </div>

          {/* Quick Trust Highlights */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-12 text-xs sm:text-sm font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-teal" />
              <span>Upfront Pricing</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-teal" />
              <span>Trained Local Team</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-teal" />
              <span>Eco-Friendly Supplies</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-teal" />
              <span>Pay After Verification</span>
            </span>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section className="bg-linen/50 py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-sage/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl text-sage">Booking your professional cleaning in Mysore is fast and simple.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative">
            <div className="bg-white p-8 rounded-3xl border border-sage/20 relative text-center hover:-translate-y-1 transition-transform shadow-sm">
              <div className="bg-teal text-white font-extrabold w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl">01</div>
              <h3 className="text-xl font-bold text-ink mb-2">Select Service</h3>
              <p className="text-sage text-sm">Choose from our 9 specialized residential & commercial cleaning packages.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-sage/20 relative text-center hover:-translate-y-1 transition-transform shadow-sm">
              <div className="bg-marigold text-ink font-extrabold w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl">02</div>
              <h3 className="text-xl font-bold text-ink mb-2">Pick Date & Time</h3>
              <p className="text-sage text-sm">Choose your preferred date and slot. Server calculates your exact price upfront.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-sage/20 relative text-center hover:-translate-y-1 transition-transform shadow-sm">
              <div className="bg-lime text-ink font-extrabold w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl">03</div>
              <h3 className="text-xl font-bold text-ink mb-2">Admin Confirms</h3>
              <p className="text-sage text-sm">Our team verifies your slot and payment confirmation for your scheduled day.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-sage/20 relative text-center hover:-translate-y-1 transition-transform shadow-sm">
              <div className="bg-teal text-white font-extrabold w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl">04</div>
              <h3 className="text-xl font-bold text-ink mb-2">Spotless Results</h3>
              <p className="text-sage text-sm">Our dedicated professionals arrive on time and deliver a thorough, sparkling clean.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose MaaShine */}
      <section className="bg-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink mb-4">Why Mysore Trusts MaaShine</h2>
            <p className="text-lg sm:text-xl text-sage">We deliver meticulous, reliable cleaning services with zero compromises.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            <div className="bg-linen/50 p-8 rounded-3xl border border-sage/20 hover:border-teal/50 transition-colors">
              <div className="bg-teal w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-md">
                <Sparkles size={28} />
              </div>
              <h3 className="text-2xl font-bold text-ink mb-3">50-Point Quality Checklist</h3>
              <p className="text-sage text-sm sm:text-base leading-relaxed">
                From corner to ceiling, our trained cleaners follow a rigorous 50-point cleaning protocol to ensure no spot is missed.
              </p>
            </div>
            
            <div className="bg-linen/50 p-8 rounded-3xl border border-sage/20 hover:border-marigold/50 transition-colors">
              <div className="bg-marigold w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-ink shadow-md">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold text-ink mb-3">Trained & Vetted Staff</h3>
              <p className="text-sage text-sm sm:text-base leading-relaxed">
                Every MaaShine cleaning professional is background-checked, trained, and committed to treating your home with utmost care.
              </p>
            </div>
            
            <div className="bg-linen/50 p-8 rounded-3xl border border-sage/20 hover:border-lime/50 transition-colors">
              <div className="bg-lime w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-ink shadow-md">
                <Clock size={28} />
              </div>
              <h3 className="text-2xl font-bold text-ink mb-3">Punctual & Dependable</h3>
              <p className="text-sage text-sm sm:text-base leading-relaxed">
                We value your time. Our single dedicated team operates with precise scheduling across all Mysore zones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas in Mysore */}
      <ServiceAreas />

      {/* Frequently Asked Questions */}
      <FAQ />

      {/* Authentic Reviews Section */}
      <section className="bg-linen/40 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink mb-3">Customer Experiences</h2>
            <p className="text-sage text-base sm:text-lg">Real feedback from verified MaaShine customers in Mysore.</p>
          </div>

          {reviews && reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white p-6 rounded-3xl border border-sage/20 shadow-sm space-y-3">
                  <div className="flex text-marigold">
                    {Array.from({ length: r.rating || 5 }).map((_, i) => (
                      <Star key={i} size={18} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-ink text-sm leading-relaxed italic">"{r.comment}"</p>
                  <p className="text-xs font-bold text-teal pt-2">
                    — {r.profiles?.full_name || 'Verified Customer'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-10 rounded-3xl border border-sage/20 text-center max-w-xl mx-auto shadow-sm space-y-4">
              <div className="w-12 h-12 bg-lime/30 text-ink rounded-full flex items-center justify-center mx-auto">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-ink">Be One of Our First Reviewers!</h3>
              <p className="text-sage text-sm leading-relaxed">
                We believe in genuine, verified feedback. After your cleaning service is completed, you will receive an invitation to share your honest review here.
              </p>
              <Link
                href="/booking"
                className="inline-block bg-teal text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-teal/90 transition-all shadow-sm"
              >
                Experience MaaShine Today
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Refer & Share Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <ShareMaaShine
          title="MaaShine Cleaning Services | Mysore"
          text="Looking for trusted home, kitchen, or deep cleaning in Mysore? Check out MaaShine Cleaning Services:"
        />
      </section>

      {/* Final Call to Action */}
      <section className="bg-teal py-20 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold">Ready for a Cleaner Home in Mysore?</h2>
          <p className="text-lime text-lg sm:text-xl max-w-2xl mx-auto font-medium">
            Book online in under 2 minutes or chat directly with our team on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              href="/booking"
              className="w-full sm:w-auto bg-lime text-ink font-bold px-10 py-4 rounded-full hover:bg-marigold transition-all shadow-lg text-lg"
            >
              Book a Cleaning Now
            </Link>
            <WhatsAppCTA
              phoneNumber={businessSettings.whatsapp_number}
              variant="secondary"
              label="Inquire on WhatsApp"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </section>

      {/* Floating WhatsApp CTA */}
      <WhatsAppCTA
        phoneNumber={businessSettings.whatsapp_number}
        variant="floating"
      />
    </main>
  )
}
