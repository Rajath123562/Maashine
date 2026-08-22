'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Phone, MessageSquare, Sparkles } from 'lucide-react'

export default function MobileBottomBar() {
  const pathname = usePathname()

  // Hide on admin and staff field execution routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/staff')) {
    return null
  }

  const phone = '+91 99168 87855'
  const cleanPhone = '9916887855'
  const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent('Hi MaaShine, I would like to book a professional cleaning in Mysore.')}`

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        
        {/* Quick Call */}
        <a
          href={`tel:+91${cleanPhone}`}
          aria-label={`Call MaaShine at ${phone}`}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <Phone size={18} className="text-teal mb-0.5" />
          <span className="text-[10px] font-bold">Call Now</span>
        </a>

        {/* Quick WhatsApp */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with MaaShine on WhatsApp"
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
        >
          <MessageSquare size={18} className="text-[#25D366] fill-current mb-0.5" />
          <span className="text-[10px] font-bold">WhatsApp</span>
        </a>

        {/* Primary Book CTA */}
        <Link
          href="/booking"
          className="flex-[1.6] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-teal hover:bg-teal/90 text-white font-bold text-xs shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <Sparkles size={15} />
          <span>Book Cleaning</span>
        </Link>

      </div>
    </div>
  )
}
