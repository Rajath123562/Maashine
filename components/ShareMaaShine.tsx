'use client'

import { useState } from 'react'
import { Share2, MessageSquare, Copy, Check } from 'lucide-react'

interface ShareMaaShineProps {
  url?: string
  title?: string
  text?: string
  variant?: 'card' | 'inline' | 'compact'
  className?: string
}

export default function ShareMaaShine({
  url,
  title = 'MaaShine Cleaning Services | Mysore',
  text = 'Looking for reliable home, kitchen, or deep cleaning in Mysore? Check out MaaShine Cleaning Services:',
  variant = 'card',
  className = ''
}: ShareMaaShineProps) {
  const [copied, setCopied] = useState(false)

  // Use current live browser origin or site url environment variable
  const activeUrl = url || (typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://maashine.vercel.app'))

  const sharePayload = {
    title,
    text: `${text}\n${activeUrl}`,
    url: activeUrl
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(sharePayload)
      } catch (err: any) {
        // User cancelled or share failed, fallback to copy
        if (err.name !== 'AbortError') {
          handleCopy()
        }
      }
    } else {
      handleCopy()
    }
  }

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(`${text}\n${activeUrl}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch (e) {
      console.error('Clipboard copy failed:', e)
    }
  }

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}\n${activeUrl}`)}`

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center gap-1.5 bg-linen hover:bg-slate-100 text-ink font-semibold text-xs px-3 py-1.5 rounded-lg border border-slate-200 transition-all"
        >
          <Share2 size={13} className="text-teal" />
          <span>Share</span>
        </button>
        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-semibold text-xs px-3 py-1.5 rounded-lg border border-[#25D366]/30 transition-all"
        >
          <MessageSquare size={13} className="text-[#25D366]" />
          <span>WhatsApp</span>
        </a>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center gap-2 bg-teal hover:bg-teal/90 text-white font-bold px-5 py-2.5 rounded-full text-sm shadow-sm transition-all"
        >
          <Share2 size={16} />
          <span>Share MaaShine</span>
        </button>
        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-5 py-2.5 rounded-full text-sm shadow-sm transition-all"
        >
          <MessageSquare size={16} className="fill-current" />
          <span>Share via WhatsApp</span>
        </a>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-ink font-bold px-5 py-2.5 rounded-full text-sm border border-slate-200 transition-all"
        >
          {copied ? <Check size={16} className="text-teal" /> : <Copy size={16} className="text-slate-400" />}
          <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-white p-6 sm:p-8 rounded-3xl border border-sage/20 shadow-sm text-center ${className}`}>
      <div className="w-14 h-14 bg-lime/30 text-ink rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Share2 size={26} className="text-ink" />
      </div>
      <h3 className="text-2xl font-extrabold text-ink mb-2">Know Someone Who Needs Cleaning in Mysore?</h3>
      <p className="text-sage text-sm sm:text-base max-w-lg mx-auto mb-6">
        Share MaaShine with friends, family, or neighbors looking for trusted deep cleaning, sofa care, or house cleaning.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-3.5 rounded-full text-sm shadow-md transition-all"
        >
          <MessageSquare size={18} className="fill-current" />
          <span>Share on WhatsApp</span>
        </a>

        <button
          onClick={handleNativeShare}
          className="inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal/90 text-white font-bold px-6 py-3.5 rounded-full text-sm shadow-md transition-all"
        >
          <Share2 size={18} />
          <span>Share Website</span>
        </button>

        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 bg-linen hover:bg-slate-100 text-ink font-bold px-5 py-3.5 rounded-full text-sm border border-slate-200 transition-all"
        >
          {copied ? <Check size={18} className="text-teal" /> : <Copy size={18} className="text-slate-500" />}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  )
}
