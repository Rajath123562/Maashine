'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Layers, CheckCircle2 } from 'lucide-react'

interface TransformationExample {
  title: string
  category: string
  description: string
  beforeText: string
  afterText: string
  beforeBg: string
  afterBg: string
  highlight: string
}

const TRANSFORMATIONS: TransformationExample[] = [
  {
    title: "Kitchen Deep Degreasing & Chimney",
    category: "Kitchen Care",
    description: "Removal of hardened grease, oil films, and grime buildup from stove tops, backsplashes, and chimney exterior.",
    beforeText: "Stubborn oil splatters, yellowed tiles & sticky grease buildup",
    afterText: "Spotless degreased surfaces, gleaming chrome & sparkling tiles",
    beforeBg: "from-amber-900/80 via-slate-800 to-amber-950/90",
    afterBg: "from-teal/90 via-emerald-800/90 to-teal/95",
    highlight: "100% Food-Safe Degreaser"
  },
  {
    title: "Sofa & Fabric Deep Steam Extraction",
    category: "Upholstery",
    description: "Deep dust-mite extraction, tea/coffee stain removal, and odor neutralization for fabric & leather couches.",
    beforeText: "Embedded dust, fabric discoloration & surface stains",
    afterText: "Revitalized upholstery texture, odor-free & deeply sanitized",
    beforeBg: "from-slate-900 via-stone-800 to-amber-950/80",
    afterBg: "from-cyan-900 via-teal to-emerald-900",
    highlight: "Dust-Mite Free & Sanitized"
  },
  {
    title: "Bathroom Hard-Water Descaling",
    category: "Sanitization",
    description: "Complete removal of white calcium scale, soap scum, and grout discoloration from taps, glass partitions, and floors.",
    beforeText: "Cloudy hard-water scale on taps, stained tile grout & soap scum",
    afterText: "Crystal clear glass, gleaming chrome fittings & sanitized grout",
    beforeBg: "from-zinc-900 via-neutral-800 to-stone-900",
    afterBg: "from-teal via-cyan-800 to-emerald-900",
    highlight: "Disinfected & Lime-Scale Free"
  }
]

export default function BeforeAfterSlider({ className = '' }: { className?: string }) {
  const [activeTab, setActiveTab] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const activeTransformation = TRANSFORMATIONS[activeTab]

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100))
    setSliderPosition(percent)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX)
    }
  }

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-sage/10 ${className}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4 border border-teal/20">
            <Sparkles size={14} />
            <span>Visible Transformations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink tracking-tight mb-4">
            See the <span className="text-teal">MaaShine Difference</span>
          </h2>
          <p className="text-sage text-base sm:text-lg max-w-2xl mx-auto">
            Drag the slider to preview the dramatic difference our professional 50-point cleaning checklist makes in Mysore homes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {TRANSFORMATIONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveTab(idx)
                setSliderPosition(50)
              }}
              className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
                activeTab === idx
                  ? 'bg-teal text-white shadow-md scale-105'
                  : 'bg-linen text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {item.category}: {item.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Interactive Comparison Card */}
        <div className="bg-linen p-4 sm:p-8 rounded-3xl border border-sage/20 shadow-xl max-w-4xl mx-auto">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <span className="text-xs font-extrabold text-teal uppercase tracking-wider block">{activeTransformation.category}</span>
              <h3 className="text-xl sm:text-2xl font-bold text-ink">{activeTransformation.title}</h3>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white text-ink text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
              <CheckCircle2 size={14} className="text-teal" />
              <span>{activeTransformation.highlight}</span>
            </div>
          </div>

          {/* Draggable Slider Window */}
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative h-72 sm:h-96 rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-inner border border-slate-200"
          >
            {/* After Layer (Background Full) */}
            <div className={`absolute inset-0 bg-gradient-to-br ${activeTransformation.afterBg} flex flex-col justify-end p-6 sm:p-8 text-white`}>
              <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg border border-white/20 uppercase tracking-wider">
                ✨ After MaaShine
              </div>
              <div className="max-w-xs sm:max-w-md ml-auto text-right">
                <p className="text-xs sm:text-sm font-semibold opacity-90">{activeTransformation.afterText}</p>
              </div>
            </div>

            {/* Before Layer (Clipped by slider position) */}
            <div
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
              className={`absolute inset-0 bg-gradient-to-br ${activeTransformation.beforeBg} flex flex-col justify-end p-6 sm:p-8 text-white`}
            >
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg border border-white/10 uppercase tracking-wider">
                ⚠️ Before Cleaning
              </div>
              <div className="max-w-xs sm:max-w-md">
                <p className="text-xs sm:text-sm font-semibold text-slate-300">{activeTransformation.beforeText}</p>
              </div>
            </div>

            {/* Slider Divider Line & Handle */}
            <div
              style={{ left: `${sliderPosition}%` }}
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)] pointer-events-none transform -translate-x-1/2"
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-teal">
                <div className="flex items-center gap-0.5 text-teal font-extrabold text-xs">
                  <span>◀</span>
                  <span>▶</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Instruction Prompt */}
          <div className="mt-4 text-center">
            <p className="text-xs text-sage font-medium flex items-center justify-center gap-1.5">
              <Layers size={14} className="text-teal" />
              <span>Drag slider left or right to inspect before and after</span>
            </p>
          </div>

        </div>

      </div>
    </section>
  )
}
