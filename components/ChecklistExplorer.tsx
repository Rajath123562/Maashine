'use client'

import { useState } from 'react'
import { Sparkles, CheckSquare, Utensils, Bath, Home, Bed, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

interface ChecklistCategory {
  id: string
  title: string
  icon: any
  count: number
  description: string
  items: string[]
}

const CHECKLIST_CATEGORIES: ChecklistCategory[] = [
  {
    id: 'kitchen',
    title: 'Kitchen & Pantry',
    icon: Utensils,
    count: 12,
    description: 'Thorough grease removal, oil film degreasing, and food-safe surface sanitization.',
    items: [
      'Gas stove, burners, knobs & trivets deep degreasing',
      'Exhaust fan & chimney exterior mesh degreasing',
      'Granite/tile backsplash deep scrub & stain removal',
      'Kitchen platform, countertops & prep areas sanitized',
      'Sink basin, drain rim & tap descaling / sanitization',
      'Kitchen cabinets exterior & handle sanitization',
      'Tile wall wipe down and grout stain removal',
      'Floor scrubbing, mopping & grease strip treatment',
      'Refrigerator & microwave exterior wipe down',
      'Dustbin area sanitization & odour neutralizer',
      'Switchboards & appliance surface cleaning',
      'Window sill & accessible kitchen window cleaning'
    ]
  },
  {
    id: 'bathroom',
    title: 'Bathrooms & Toilets',
    icon: Bath,
    count: 14,
    description: 'Hard-water limescale removal, anti-bacterial disinfection, and crystal clear glass care.',
    items: [
      'Commode / WC deep disinfection & bowl descaling',
      'Washbasin, counter & chrome tap descaling',
      'Shower head, diverter & taps hard-water scale removal',
      'Glass shower partitions & mirrors descaled & polished',
      'Bathroom wall tiles high-pressure scrub & grout care',
      'Floor tiles scrubbing & anti-skid floor cleaning',
      'Exhaust fan grille & ventilation dust removal',
      'Door frame, latch, handle & backside cleaning',
      'Geyser exterior & accessible fixture wipe down',
      'Drain trap clearing and odour neutralization',
      'Towel racks, holders & soap dish sanitization',
      'Anti-fungal and anti-bacterial bathroom deodorization',
      'Switchboards & exhaust switch sanitization',
      'Ceiling cobweb inspection and removal'
    ]
  },
  {
    id: 'living',
    title: 'Living & Dining Area',
    icon: Home,
    count: 12,
    description: 'Dust-free entertainment spaces, detailed furniture care, and floor buffing.',
    items: [
      'Ceiling fan blades, motor housing & light fixtures cleaned',
      'Living room sofas vacuumed & surface dust extraction',
      'TV unit, coffee table & display console dusting',
      'Dining table, chairs & dining console sanitization',
      'Main entrance door, grill & handle polishing',
      'Sliding glass doors & balcony window pane cleaning',
      'Balcony railing & balcony floor washdown',
      'Wall skirtings, switchboards & door frames wiped',
      'Floor deep vacuuming followed by machine scrubbing',
      'Carpet & rug high-power dust-mite extraction',
      'Air conditioner exterior grille & flap dusting',
      'Corner cobweb clearance across entire ceiling perimeter'
    ]
  },
  {
    id: 'bedroom',
    title: 'Bedrooms & Storage',
    icon: Bed,
    count: 12,
    description: 'Allergen reduction, mattress care, and meticulous wardrobe exterior cleaning.',
    items: [
      'Mattress high-suction dust-mite vacuuming',
      'Bed frame, headboard & bedside table dusting',
      'Wardrobe exterior, mirrors & wardrobe handles polished',
      'Dressing table mirrors & drawers exterior wiped',
      'Ceiling fans & bedroom light fixtures dusted',
      'Window tracks, sills & glass panels cleaned',
      'Under-bed perimeter vacuuming (accessible areas)',
      'Door frames, knobs & window latches sanitization',
      'Switchboards, AC exterior & fan regulator cleaning',
      'Bedroom floor vacuuming & fragrance mop treatment',
      'Curtain rods & pelmet top dusting',
      'High-touch surface sanitization for peaceful sleep'
    ]
  }
]

export default function ChecklistExplorer({ className = '' }: { className?: string }) {
  const [activeTab, setActiveTab] = useState('kitchen')

  const activeCategory = CHECKLIST_CATEGORIES.find(c => c.id === activeTab) || CHECKLIST_CATEGORIES[0]
  const Icon = activeCategory.icon

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-sage/10 ${className}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4 border border-teal/20">
            <CheckSquare size={14} />
            <span>50-Point Quality Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink tracking-tight mb-4">
            The MaaShine <span className="text-teal">Checklist Guarantee</span>
          </h2>
          <p className="text-sage text-base sm:text-lg max-w-2xl mx-auto">
            Our trained local cleaning staff inspects and verifies every single point before marking any job complete in your presence.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10">
          {CHECKLIST_CATEGORIES.map((cat) => {
            const CatIcon = cat.icon
            const isSelected = activeTab === cat.id

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 font-bold text-xs sm:text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal border ${
                  isSelected
                    ? 'bg-teal text-white border-teal shadow-md scale-105'
                    : 'bg-linen text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <CatIcon size={20} className={isSelected ? 'text-white' : 'text-teal'} />
                <span>{cat.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {cat.count} Points
                </span>
              </button>
            )
          })}
        </div>

        {/* Checklist Content Card */}
        <div className="bg-linen p-6 sm:p-10 rounded-3xl border border-sage/20 shadow-xl max-w-4xl mx-auto">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal text-white flex items-center justify-center shadow-md">
                <Icon size={24} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-ink">{activeCategory.title} Checklist</h3>
                <p className="text-xs sm:text-sm text-sage">{activeCategory.description}</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-white text-ink text-xs font-bold px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <ShieldCheck size={16} className="text-teal" />
              <span>Verified on Every Cleaning</span>
            </div>
          </div>

          {/* Checklist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6">
            {activeCategory.items.map((item, index) => (
              <div
                key={index}
                className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-start gap-3 shadow-xs hover:border-teal/40 transition-colors"
              >
                <div className="w-5 h-5 rounded-md bg-teal/10 text-teal flex items-center justify-center flex-shrink-0 mt-0.5 font-mono text-xs font-bold">
                  {index + 1}
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-700 leading-snug">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Action */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-sage">
              <Sparkles size={16} className="text-teal" />
              <span>Eco-friendly supplies and industrial equipment provided by MaaShine</span>
            </div>

            <Link
              href="/booking"
              className="w-full sm:w-auto bg-teal hover:bg-teal/90 text-white font-bold px-8 py-3 rounded-full text-xs sm:text-sm shadow-md transition-all text-center"
            >
              Book 50-Point Deep Cleaning
            </Link>
          </div>

        </div>

      </div>
    </section>
  )
}
