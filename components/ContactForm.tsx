'use client'

import { useState } from 'react'
import { submitContactMessage } from '../app/actions/contact'
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [submittedWAUrl, setSubmittedWAUrl] = useState('')

  async function handleSubmit(formData: FormData) {
    setStatus('loading')
    setErrorMsg('')

    const name = (formData.get('name') as string)?.trim() || 'Customer'
    const email = (formData.get('email') as string)?.trim() || ''
    const message = (formData.get('message') as string)?.trim() || ''

    // Format instant WhatsApp message
    const waText = 
      `*New Customer Inquiry — MaaShine Mysore*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `💬 *Inquiry Message:*\n${message}\n\n` +
      `📍 *Submitted via:* maashineservices.com`

    const waUrl = `https://wa.me/919916887855?text=${encodeURIComponent(waText)}`
    setSubmittedWAUrl(waUrl)

    try {
      const result = await submitContactMessage(formData)

      // Open WhatsApp in new tab with the filled inquiry details
      window.open(waUrl, '_blank')

      setStatus('success')
      
      // Reset form
      const form = document.querySelector('form') as HTMLFormElement
      form?.reset()
    } catch (err: any) {
      // Even if database has network issue, still open WhatsApp
      window.open(waUrl, '_blank')
      setStatus('success')
    }
  }

  return (
    <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-sage/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-ink">Send Us a Message</h2>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#128C7E] bg-[#25D366]/10 px-3 py-1 rounded-full border border-[#25D366]/30">
          <MessageSquare size={13} className="text-[#25D366] fill-current" />
          <span>Direct WhatsApp</span>
        </span>
      </div>

      {status === 'success' && (
        <div className="bg-teal/10 border border-teal/30 text-teal p-5 rounded-2xl mb-6 space-y-3">
          <div className="flex items-center gap-2 font-bold text-ink">
            <CheckCircle2 size={20} className="text-teal" />
            <span>Message Sent Successfully!</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Your message has been received and WhatsApp was opened to connect directly with <strong>+91 99168 87855</strong>.
          </p>
          {submittedWAUrl && (
            <a
              href={submittedWAUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              <MessageSquare size={15} className="fill-current" />
              <span>Re-open WhatsApp Chat</span>
            </a>
          )}
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-300 text-red-600 p-4 rounded-xl mb-6 font-semibold text-center text-sm">
          {errorMsg}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-ink">Name</label>
          <input
            name="name"
            type="text"
            required
            className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal text-ink placeholder:text-slate-400"
            placeholder="Your name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-ink">Email Address</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal text-ink placeholder:text-slate-400"
            placeholder="you@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-1.5 text-ink">Message / Cleaning Requirement</label>
          <textarea
            name="message"
            rows={4}
            required
            className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal text-ink placeholder:text-slate-400"
            placeholder="Tell us about your property in Mysore, required cleaning services, or questions..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal/90 text-white font-bold py-4 rounded-xl transition-all shadow-md mt-4 disabled:opacity-50 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <Send size={18} />
          <span>{status === 'loading' ? 'Sending to WhatsApp...' : 'Send Message & Chat on WhatsApp'}</span>
        </button>

        <p className="text-center text-xs text-slate-500 pt-1">
          Connected directly to our official WhatsApp support at <strong>+91 99168 87855</strong>
        </p>
      </form>
    </div>
  )
}
