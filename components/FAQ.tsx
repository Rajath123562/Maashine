'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export const FAQ_ITEMS = [
  {
    question: "What cleaning services do you provide in Mysore?",
    answer: "We offer 9 specialized residential and commercial cleaning services across Mysore: Home Deep Cleaning, Kitchen Cleaning & Degreasing, Bathroom Sanitization & Descaling, Sofa & Upholstery Care, Mattress Dust-Mite & Sanitization, Office & Commercial Cleaning, Apartment & Common Area Cleaning, Window & Glass Cleaning, and Floor Scrubbing & Polishing."
  },
  {
    question: "How do I book a cleaning appointment?",
    answer: "You can book directly through our website by visiting our online booking page. Simply choose your desired service, enter property specifications, select your preferred date and time slot, enter your Mysore address, and confirm your request in under 2 minutes. You can also reach out via WhatsApp for immediate coordination."
  },
  {
    question: "How much does cleaning cost?",
    answer: "We believe in 100% transparent upfront pricing with zero hidden charges. Fixed-price services (like Bathroom, Kitchen, Sofa, Mattress, and Window cleaning) have clear, transparent rates. Home Deep Cleaning is conditionally priced based on your property size (1 BHK to 4+ BHK) and condition (Occupied vs. Vacant). Office, Apartment Building, and Floor Scrubbing services are priced on request based on custom scope."
  },
  {
    question: "Can I choose a specific date and time for cleaning?",
    answer: "Yes. During booking, you can select your preferred cleaning date and preferred time slot (Morning or Afternoon). Because MaaShine operates with a dedicated professional team, every confirmed slot is exclusively reserved for your property. You can also provide an alternative date and time in case your primary choice needs adjustment."
  },
  {
    question: "Do I need to provide cleaning supplies or equipment?",
    answer: "No, you do not need to provide supplies. Our MaaShine cleaning professionals bring all necessary professional equipment, vacuum cleaners, and eco-friendly cleaning supplies. All we require is access to running water and an electrical outlet at your property."
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer: "Yes. You can request a date/time reschedule or cancel your booking easily through your customer dashboard under 'My Requests' before our cleaning team begins service."
  },
  {
    question: "What areas of Mysore do you serve?",
    answer: "We serve all major localities across Mysore, including Gokulam (Stages 1-3), Vijayanagar (Stages 1-4), Jayalakshmipuram, Kuvempunagar, VV Mohalla, Saraswathipuram, Hebbal (1st & 2nd Stage), JP Nagar, Dattagalli, Bogadi, Yadavagiri, Siddhartha Layout, Ramakrishnanagar, Alanahalli, and all areas within the Mysore Outer Ring Road."
  }
]

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
