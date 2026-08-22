import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Lock, Database, UserCheck, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | MaaShine Cleaning Services Mysore',
  description: 'Learn how MaaShine protects customer privacy and securely stores booking data using PostgreSQL Row Level Security.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-linen pt-16 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck size={14} />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-ink">
            Privacy Policy
          </h1>
          <p className="text-sage text-base sm:text-lg max-w-2xl mx-auto">
            Your trust is our foundation. We collect only what is necessary to deliver exceptional cleaning services in Mysore.
          </p>
        </div>

        {/* Policy Content Card */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-sage/20 space-y-8 text-ink leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-2xl font-extrabold text-ink flex items-center gap-2.5">
              <UserCheck size={22} className="text-teal" />
              <span>1. Information We Collect</span>
            </h2>
            <p className="text-sage text-sm sm:text-base">
              When you use MaaShine to book a cleaning service, request a quote, or contact our team, we collect the following essential information:
            </p>
            <ul className="list-disc list-inside text-sage text-sm sm:text-base space-y-1 pl-2">
              <li><strong className="text-ink">Contact Details:</strong> Full name, phone number, and email address.</li>
              <li><strong className="text-ink">Service Address:</strong> Street address, locality, landmark, city (Mysore), state (Karnataka), and pincode.</li>
              <li><strong className="text-ink">Property Details:</strong> Property type (e.g. Apartment, Independent House, Villa), room counts, square footage estimates, and condition.</li>
              <li><strong className="text-ink">Payment Reference Data:</strong> UPI transaction IDs and receipt screenshots uploaded for payment verification.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-extrabold text-ink flex items-center gap-2.5">
              <Database size={22} className="text-teal" />
              <span>2. How Your Data Is Stored & Protected</span>
            </h2>
            <p className="text-sage text-sm sm:text-base">
              All personal data and booking records are securely stored within PostgreSQL databases hosted on Supabase enterprise infrastructure. We enforce strict <strong className="text-ink">Row-Level Security (RLS)</strong> policies:
            </p>
            <ul className="list-disc list-inside text-sage text-sm sm:text-base space-y-1 pl-2">
              <li>Customers can only read and manage their own private booking records and invoices.</li>
              <li>Field staff only receive address and contact information for jobs actively assigned to them.</li>
              <li>Payment screenshot files are stored in private storage buckets with temporary signed URLs accessible only by authorized administrators.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-extrabold text-ink flex items-center gap-2.5">
              <Lock size={22} className="text-teal" />
              <span>3. How We Use Your Information</span>
            </h2>
            <p className="text-sage text-sm sm:text-base">
              We use your information exclusively for operational purposes:
            </p>
            <ul className="list-disc list-inside text-sage text-sm sm:text-base space-y-1 pl-2">
              <li>Scheduling, dispatching, and fulfilling your requested cleaning services in Mysore.</li>
              <li>Communicating appointment confirmations, arrival updates via WhatsApp/Phone, and sending invoices.</li>
              <li>Verifying bank/UPI payments and preventing fraudulent bookings.</li>
              <li><strong className="text-ink">We do not sell, rent, or trade your personal data to any third parties or advertisers.</strong></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-extrabold text-ink">4. Cookies & Offline Caching</h2>
            <p className="text-sage text-sm sm:text-base">
              Our website functions as a Progressive Web App (PWA). We use essential authentication session cookies to keep you signed in securely. Sensitive customer data, admin portals, and invoices are strictly designated as network-only to prevent private information from being stored in shared offline caches.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-extrabold text-ink">5. Your Data Rights</h2>
            <p className="text-sage text-sm sm:text-base">
              You have full rights to view, update, or request the deletion of your account and personal booking history at any time. To exercise these rights, please contact our support team at <strong className="text-ink">rajath.raj2569@gmail.com</strong> or call us at <strong className="text-ink">+91 99168 87855</strong>.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-sage">
            <span>Last Updated: August 2026</span>
            <Link href="/terms" className="text-teal font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded">
              View Terms of Service →
            </Link>
          </div>

        </div>

      </div>
    </main>
  )
}
