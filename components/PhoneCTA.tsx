'use client'

import { Phone } from 'lucide-react'

interface PhoneCTAProps {
  phoneNumber?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'compact'
  label?: string
  className?: string
}

export default function PhoneCTA({
  phoneNumber = '+91 99168 87855',
  variant = 'secondary',
  label,
  className = ''
}: PhoneCTAProps) {
  const cleanNumber = (phoneNumber || '').replace(/[^0-9+]/g, '')
  const displayLabel = label || `Call ${phoneNumber}`

  if (variant === 'compact') {
    return (
      <a
        href={`tel:${cleanNumber}`}
        className={`inline-flex items-center gap-2 text-ink hover:text-teal font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-md ${className}`}
        aria-label={`Call MaaShine at ${phoneNumber}`}
      >
        <Phone size={15} className="text-teal" />
        <span>{label || phoneNumber}</span>
      </a>
    )
  }

  if (variant === 'primary') {
    return (
      <a
        href={`tel:${cleanNumber}`}
        className={`inline-flex items-center justify-center gap-2.5 bg-teal hover:bg-teal/90 text-white font-bold px-8 py-4 rounded-full transition-all shadow-md hover:shadow-lg text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal ${className}`}
        aria-label={`Call MaaShine at ${phoneNumber}`}
      >
        <Phone size={20} />
        <span>{displayLabel}</span>
      </a>
    )
  }

  if (variant === 'outline') {
    return (
      <a
        href={`tel:${cleanNumber}`}
        className={`inline-flex items-center justify-center gap-2.5 border-2 border-teal/40 hover:border-teal text-teal hover:bg-teal/5 font-bold px-6 py-3.5 rounded-full transition-all text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal ${className}`}
        aria-label={`Call MaaShine at ${phoneNumber}`}
      >
        <Phone size={20} />
        <span>{displayLabel}</span>
      </a>
    )
  }

  return (
    <a
      href={`tel:${cleanNumber}`}
      className={`inline-flex items-center justify-center gap-2.5 bg-white text-ink border border-slate-200 hover:border-teal hover:bg-teal/5 font-bold px-6 py-3.5 rounded-full transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal ${className}`}
      aria-label={`Call MaaShine at ${phoneNumber}`}
    >
      <Phone size={20} className="text-teal" />
      <span>{displayLabel}</span>
    </a>
  )
}
