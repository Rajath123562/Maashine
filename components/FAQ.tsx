'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { FAQ_ITEMS } from '../lib/faqData'

export default function FAQ({ className = '' }: { className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-linen/50 border-t border-sage/10 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4">
            <HelpCircle size={14} />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sage text-base sm:text-lg max-w-2xl mx-auto">
            Everything you need to know about our professional cleaning services, transparent pricing, and scheduling in Mysore.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx
            const btnId = `faq-btn-${idx}`
            const panelId = `faq-panel-${idx}`

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-sage/20 hover:border-teal/50 transition-colors shadow-sm overflow-hidden"
              >
                <h3>
                  <button
                    type="button"
                    id={btnId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleFAQ(idx)}
                    className="w-full text-left flex justify-between items-center p-6 text-base sm:text-lg font-bold text-ink hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-3xl transition-colors"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      size={20}
                      className={`text-teal flex-shrink-0 ml-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  hidden={!isOpen}
                  className={`px-6 pb-6 pt-1 text-sm sm:text-base text-sage leading-relaxed border-t border-slate-50 ${
                    isOpen ? 'block' : 'hidden'
                  }`}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center text-sm text-sage">
          Still have questions?{' '}
          <Link href="/contact" className="text-teal font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded">
            Contact our team
          </Link>{' '}
          or chat with us on WhatsApp at{' '}
          <a
            href="https://wa.me/919916887855"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded"
          >
            +91 99168 87855
          </a>.
        </div>
      </div>
    </section>
  )
}
