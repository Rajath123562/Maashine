'use client'

import { MessageSquare } from 'lucide-react'

interface WhatsAppCTAProps {
  phoneNumber?: string
  message?: string
  variant?: 'primary' | 'secondary' | 'floating' | 'outline' | 'compact'
  label?: string
  className?: string
  serviceName?: string
}

export default function WhatsAppCTA({
  phoneNumber = '+91 99168 87855',
  message,
  variant = 'primary',
  label,
  className = '',
  serviceName
}: WhatsAppCTAProps) {
  // Clean phone number for WhatsApp link (digits only, e.g. 918105699620)
  let cleanNumber = (phoneNumber || '').replace(/[^0-9]/g, '')
  if (cleanNumber.length === 10) {
    cleanNumber = '91' + cleanNumber
  }

  // Generate appropriate pre-filled message
  const defaultMessage = serviceName
    ? `Hi MaaShine, I am interested in ${serviceName} in Mysore. Please share available slots and details.`
    : 'Hi MaaShine, I would like to know more about your professional cleaning services in Mysore.'

  const finalMessage = encodeURIComponent(message || defaultMessage)
  const waUrl = cleanNumber ? `https://wa.me/${cleanNumber}?text=${finalMessage}` : `https://wa.me/?text=${finalMessage}`

  if (variant === 'floating') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with MaaShine on WhatsApp"
        className={`fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:p-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 transition-all duration-200 group ${className}`}
      >
        <MessageSquare className="w-6 h-6 fill-current text-white" />
        <span className="hidden sm:inline font-bold text-sm pr-1">Chat on WhatsApp</span>
      </a>
    )
  }

  if (variant === 'compact') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label || "Chat on WhatsApp"}
        className={`inline-flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold px-4 py-2 rounded-full text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] transition-all ${className}`}
      >
        <MessageSquare size={16} className="text-[#25D366]" />
        <span>{label || 'WhatsApp'}</span>
      </a>
    )
  }

  if (variant === 'outline') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label || "Chat on WhatsApp"}
        className={`inline-flex items-center justify-center gap-2.5 border-2 border-[#25D366] text-ink hover:bg-[#25D366]/10 font-bold px-6 py-3.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] transition-all text-base ${className}`}
      >
        <MessageSquare size={20} className="text-[#25D366]" />
        <span>{label || 'Chat on WhatsApp'}</span>
      </a>
    )
  }

  if (variant === 'secondary') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label || "Chat on WhatsApp"}
        className={`inline-flex items-center justify-center gap-2.5 bg-white text-ink border border-slate-200 hover:border-[#25D366] hover:bg-[#25D366]/5 font-bold px-6 py-3.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] transition-all shadow-sm ${className}`}
      >
        <MessageSquare size={20} className="text-[#25D366]" />
        <span>{label || 'Ask on WhatsApp'}</span>
      </a>
    )
  }

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label || "Chat on WhatsApp"}
      className={`inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-8 py-4 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] transition-all shadow-md hover:shadow-lg text-base ${className}`}
    >
      <MessageSquare size={20} className="fill-current text-white" />
      <span>{label || 'Chat on WhatsApp'}</span>
    </a>
  )
}
