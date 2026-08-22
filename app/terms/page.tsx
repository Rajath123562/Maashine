import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, CheckCircle2, Clock, IndianRupee, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | MaaShine Cleaning Services Mysore',
  description: 'Read the terms and conditions for booking professional cleaning services with MaaShine in Mysore, Karnataka.',
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-linen pt-16 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <FileText size={14} />
            <span>Service Agreement</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-ink">
            Terms of Service
          </h1>
          <p className="text-sage text-base sm:text-lg max-w-2xl mx-auto">
            Clear, honest terms designed for reliable cleaning services in Mysore.
          </p>
        </div>

        {/* Terms Content Card */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-sage/20 space-y-8 text-ink leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-2xl font-extrabold text-ink flex items-center gap-2.5">
              <CheckCircle2 size={22} className="text-teal" />
              <span>1. Booking & Slot Reservation</span>
            </h2>
            <p className="text-sage text-sm sm:text-base">
              MaaShine operates with a dedicated, highly trained cleaning crew in Mysore. To ensure meticulous quality and on-time arrival:
            </p>
            <ul className="list-disc list-inside text-sage text-sm sm:text-base space-y-1 pl-2">
              <li>Each date and time slot (Morning or Afternoon) accommodates one active cleaning reservation at a time.</li>
              <li>Your reservation is confirmed once reviewed by our operations team and verified against our scheduling engine.</li>
              <li>You agree to provide accurate contact information and service address details located within the Mysore service area.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-extrabold text-ink flex items-center gap-2.5">
              <IndianRupee size={22} className="text-teal" />
              <span>2. Upfront Pricing & Payments</span>
            </h2>
            <p className="text-sage text-sm sm:text-base">
              We stand by 100% upfront transparent pricing with zero surprise charges:
            </p>
            <ul className="list-disc list-inside text-sage text-sm sm:text-base space-y-1 pl-2">
              <li><strong className="text-ink">Fixed Services:</strong> Rates for specific services (Kitchen, Bathroom, Sofa, Mattress, Window Cleaning) are calculated and displayed upfront.</li>
              <li><strong className="text-ink">Home Deep Cleaning:</strong> Prices are calculated automatically based on your property configuration (BHK size and Occupied/Vacant condition).</li>
              <li><strong className="text-ink">Commercial & Custom Services:</strong> Office, Apartment Building, and Floor Scrubbing services are confirmed via custom written estimate.</li>
              <li><strong className="text-ink">Payment Flow:</strong> Payments are processed via UPI/Bank transfer. After uploading your transaction reference, our administrative team verifies the receipt and marks your invoice as Paid.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-extrabold text-ink flex items-center gap-2.5">
              <Clock size={22} className="text-teal" />
              <span>3. Rescheduling & Cancellations</span>
            </h2>
            <p className="text-sage text-sm sm:text-base">
              We understand that plans can change:
            </p>
            <ul className="list-disc list-inside text-sage text-sm sm:text-base space-y-1 pl-2">
              <li><strong className="text-ink">Reschedules:</strong> You can submit a reschedule request for an alternate available date/time through your customer dashboard under "My Requests".</li>
              <li><strong className="text-ink">Cancellations:</strong> You may cancel an upcoming booking before our team commences work on site through your dashboard or by notifying us directly.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-extrabold text-ink flex items-center gap-2.5">
              <ShieldCheck size={22} className="text-teal" />
              <span>4. Customer Responsibilities & Site Access</span>
            </h2>
            <p className="text-sage text-sm sm:text-base">
              To allow our cleaning professionals to work effectively and safely:
            </p>
            <ul className="list-disc list-inside text-sage text-sm sm:text-base space-y-1 pl-2">
              <li>The customer must provide access to running water and standard electricity at the property during the service duration.</li>
              <li>Precious personal belongings, jewelry, and fragile items should be safely stored prior to service arrival.</li>
              <li>An adult representative should be available at the beginning and completion of the service to review the 50-point checklist.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-extrabold text-ink">5. Quality Guarantee & Contact</h2>
            <p className="text-sage text-sm sm:text-base">
              If any aspect of the completed service does not meet our standard checklist, please notify us within 24 hours so we can address your concerns promptly. For any inquiries regarding these terms, reach us at <strong className="text-ink">rajath.raj2569@gmail.com</strong> or phone <strong className="text-ink">+91 99168 87855</strong>.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-sage">
            <span>Last Updated: August 2026</span>
            <Link href="/privacy" className="text-teal font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded">
              View Privacy Policy →
            </Link>
          </div>

        </div>

      </div>
    </main>
  )
}
