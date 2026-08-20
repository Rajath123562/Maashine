import { MapPin, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface ServiceAreasProps {
  className?: string
}

export default function ServiceAreas({ className = '' }: ServiceAreasProps) {
  const localities = [
    { name: 'Gokulam', desc: 'Stages 1, 2 & 3' },
    { name: 'Vijayanagar', desc: '1st, 2nd, 3rd & 4th Stage' },
    { name: 'Jayalakshmipuram', desc: 'Central Mysore' },
    { name: 'Kuvempunagar', desc: 'M Block & Surroundings' },
    { name: 'VV Mohalla', desc: 'Vani Vilas Mohalla' },
    { name: 'Saraswathipuram', desc: 'Residential Hub' },
    { name: 'Hebbal', desc: 'Hebbal 1st & 2nd Stage' },
    { name: 'JP Nagar', desc: 'South Mysore' },
    { name: 'Dattagalli', desc: 'Ring Road & Kanakadasa Nagar' },
    { name: 'Bogadi', desc: 'Bogadi 2nd Stage & Ring Road' },
    { name: 'Yadavagiri', desc: 'North Central' },
    { name: 'Siddhartha Layout', desc: 'East Mysore' },
    { name: 'Ramakrishnanagar', desc: 'Blocks A to H' },
    { name: 'Alanahalli & Ring Road', desc: 'Greater Mysore Areas' },
  ]

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-sage/10 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4">
            <MapPin size={14} />
            <span>Serving Mysore, Karnataka</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink mb-4">
            Professional Cleaning Across All Major Mysore Localities
          </h2>
          <p className="text-sage text-base sm:text-lg max-w-2xl mx-auto">
            Our dedicated cleaning team serves homes, apartments, villas, and workplaces across Mysore with punctual arrival and upfront pricing.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {localities.map((loc) => (
            <div
              key={loc.name}
              className="bg-linen/60 hover:bg-linen p-4 sm:p-5 rounded-2xl border border-sage/20 transition-all hover:border-teal/40 hover:-translate-y-0.5 shadow-sm"
            >
              <div className="flex items-start gap-2.5">
                <MapPin size={18} className="text-teal flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-ink text-base sm:text-lg">{loc.name}</h3>
                  <p className="text-xs text-sage mt-0.5">{loc.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-linen p-6 sm:p-8 rounded-3xl border border-sage/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-ink font-bold">
              <CheckCircle2 size={18} className="text-teal" />
              <span>Don't see your specific locality listed?</span>
            </div>
            <p className="text-sm text-sage">
              We serve all residential layouts and commercial areas within Mysore Corporation and Ring Road limits.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/booking"
              className="bg-teal hover:bg-teal/90 text-white font-bold px-6 py-3 rounded-full text-sm shadow-sm transition-all"
            >
              Book a Cleaning in Mysore
            </Link>
            <Link
              href="/contact"
              className="bg-white hover:bg-slate-50 text-ink font-bold px-6 py-3 rounded-full text-sm border border-slate-200 transition-all shadow-sm"
            >
              Check Availability
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
