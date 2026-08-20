'use client'

import { useState } from 'react'
import { submitContactMessage } from '../app/actions/contact'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(formData: FormData) {
    setStatus('loading')
    setErrorMsg('')

    const result = await submitContactMessage(formData)

    if (result.success) {
      setStatus('success')
      // Reset form
      const form = document.querySelector('form') as HTMLFormElement
      form?.reset()
    } else {
      setStatus('error')
      setErrorMsg(result.error || 'Something went wrong.')
    }
  }

  return (
    <div className="bg-white p-10 rounded-3xl shadow-xl border border-sage/20">
      <h2 className="text-2xl font-bold text-ink mb-6">Send a Message</h2>

      {status === 'success' && (
        <div className="bg-teal/10 border border-teal/30 text-teal p-4 rounded-xl mb-6 font-semibold text-center">
          ✅ Message sent successfully! We'll get back to you soon.
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-300 text-red-600 p-4 rounded-xl mb-6 font-semibold text-center text-sm">
          {errorMsg}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Name</label>
          <input
            name="name"
            type="text"
            required
            className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Message</label>
          <textarea
            name="message"
            rows={5}
            required
            className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal"
            placeholder="How can we help you?"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-teal text-white font-bold py-4 rounded-xl hover:bg-teal/90 transition-colors shadow-md mt-4 disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
