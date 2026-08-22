'use client'

import { useState } from 'react'
import { Search, MapPin, CheckCircle2, ArrowRight, Clock, Shield } from 'lucide-react'
import Link from 'next/link'

interface Locality {
  name: string
  zone: string
  landmarks: string
  popular: boolean
}

const LOCALITIES: Locality[] = [
  { name: 'Gokulam', zone: 'Central North', landmarks: 'Stages 1, 2 & 3, 8th Main, Doctors Corner', popular: true },
  { name: 'Vijayanagar', zone: 'West Mysore', landmarks: '1st, 2nd, 3rd & 4th Stage, Water Tank', popular: true },
  { name: 'Jayalakshmipuram', zone: 'Central Mysore', landmarks: 'Kalidasa Road, BM Hospital Area', popular: true },
  { name: 'Kuvempunagar', zone: 'South Central', landmarks: 'M Block, Complex, Navodaya School', popular: true },
  { name: 'VV Mohalla', zone: 'Heritage Zone', landmarks: 'Vani Vilas Mohalla, Temple Road', popular: true },
  { name: 'Saraswathipuram', zone: 'Educational Hub', landmarks: 'Fire Brigade, Swimming Pool Road', popular: true },
  { name: 'Hebbal', zone: 'North Mysore', landmarks: 'Hebbal 1st & 2nd Stage, Industrial Area', popular: true },
  { name: 'JP Nagar', zone: 'South Mysore', landmarks: 'Gobli Mara, Ring Road, Police Booth', popular: true },
  { name: 'Dattagalli', zone: 'South West', landmarks: 'Kanakadasa Nagar, Ring Road Junction', popular: true },
  { name: 'Bogadi', zone: 'West Mysore', landmarks: 'Bogadi 2nd Stage, Ring Road, Marimallappa', popular: true },
  { name: 'Yadavagiri', zone: 'North Central', landmarks: 'AIR Station, Medha Trust Area', popular: false },
  { name: 'Siddhartha Layout', zone: 'East Mysore', landmarks: 'T. Narasipura Road, Lalitha Mahal', popular: false },
  { name: 'Ramakrishnanagar', zone: 'South Central', landmarks: 'Blocks A to H, Circle', popular: false },
  { name: 'Alanahalli & Ring Road', zone: 'Greater Mysore', landmarks: 'Bannur Road, Outer Ring Road', popular: false },
]

export default function LocalitySearch({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('')
  const [selectedLocality, setSelectedLocality] = useState<Locality | null>(LOCALITIES[0])

  const filtered = query.trim() === ''
    ? LOCALITIES
    : LOCALITIES.filter(l => 
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.landmarks.toLowerCase().includes(query.toLowerCase()) ||
        l.zone.toLowerCase().includes(query.toLowerCase())
      )

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-linen/60 ${className}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4 border border-teal/20">
            <MapPin size={14} />
            <span>Local Mysore Coverage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink tracking-tight mb-4">
            Check Service Availability in <span className="text-teal">Your Area</span>
          </h2>
          <p className="text-sage text-base sm:text-lg max-w-2xl mx-auto">
            Our single dedicated professional team covers all residential layouts and commercial areas across Mysore Corporation and Outer Ring Road limits.
          </p>
        </div>

        {/* Search Box & Quick Chips */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                const match = LOCALITIES.find(l => l.name.toLowerCase().includes(e.target.value.toLowerCase()))
                if (match) setSelectedLocality(match)
              }}
              placeholder="Type your Mysore layout (e.g. Gokulam, Vijayanagar, Kuvempunagar...)"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-sage/30 shadow-md text-ink text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal placeholder:text-slate-400"
            />
          </div>

          {/* Quick Select Popular Chips */}
          <div className="flex flex-wrap gap-2 mt-4 items-center justify-center">
            <span className="text-xs font-bold text-slate-400 mr-1">Popular:</span>
            {LOCALITIES.filter(l => l.popular).slice(0, 6).map((loc) => (
              <button
                key={loc.name}
                type="button"
                onClick={() => {
                  setSelectedLocality(loc)
                  setQuery(loc.name)
                }}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
                  selectedLocality?.name === loc.name
                    ? 'bg-teal text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Live Status Result Card */}
        {selectedLocality && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal/30 shadow-xl max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-extrabold text-teal uppercase tracking-wider">{selectedLocality.zone} • Mysore</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">{selectedLocality.name}</h3>
                <p className="text-xs sm:text-sm text-sage mt-0.5">Covering {selectedLocality.landmarks}</p>
              </div>

              <div className="bg-emerald-50 text-emerald-800 font-extrabold text-xs px-4 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Active Daily Service Zone</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-linen border border-slate-100 flex items-start gap-3">
                <Clock size={18} className="text-teal flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-ink block">Slots Open</span>
                  <span className="text-sage">Morning (9AM) & Afternoon (1:30PM)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-linen border border-slate-100 flex items-start gap-3">
                <Shield size={18} className="text-teal flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-ink block">Dedicated Team</span>
                  <span className="text-sage">Punctual arrival with professional gear</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-linen border border-slate-100 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-teal flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-ink block">100% Upfront</span>
                  <span className="text-sage">Transparent rates with ₹0 hidden fee</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-sage text-center sm:text-left">
                Ready to book your cleaning in <strong className="text-ink">{selectedLocality.name}</strong>?
              </span>
              <Link
                href="/booking"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal/90 text-white font-bold px-8 py-3.5 rounded-full text-sm shadow-md transition-all"
              >
                <span>Book in {selectedLocality.name}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
