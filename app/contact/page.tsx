import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react'
import ContactForm from '../../components/ContactForm'
import { getBusinessSettings } from '../actions/settings'
import WhatsAppCTA from '../../components/WhatsAppCTA'
import PhoneCTA from '../../components/PhoneCTA'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact MaaShine | Cleaning Services in Mysore',
  description: 'Get in touch with MaaShine Cleaning Services in Mysore. Call, chat on WhatsApp, or send a message for instant inquiries and quotes.',
}

export default async function ContactPage() {
  const settings = await getBusinessSettings()
  const cleanPhone = (settings.phone || '').replace(/[^0-9+]/g, '')

  return (
    <main className="min-h-screen bg-linen pt-16 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4">
              <MapPin size={14} />
              <span>Mysore, Karnataka</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-ink mb-4">Get in Touch</h1>
            <p className="text-lg sm:text-xl text-sage">
              Have questions about our cleaning services or need a custom quote for your property in Mysore? Reach out anytime.
            </p>
          </div>
          
          <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-sage/20 shadow-sm">
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="bg-teal p-3 rounded-2xl text-white flex-shrink-0">
                <Phone size={22} />
              </div>
              <div>
                <h3 className="font-bold text-ink text-base">Phone Support</h3>
                <p className="text-sage text-sm mt-0.5">
                  <a href={`tel:${cleanPhone}`} className="hover:text-teal font-semibold text-ink transition-colors">
                    {settings.phone}
                  </a>
                </p>
                <p className="text-xs text-slate-400 mt-1">{settings.operating_hours || 'Mon – Sat, 9:00 AM – 6:00 PM'}</p>
              </div>
            </div>
            
            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="bg-[#25D366] p-3 rounded-2xl text-white flex-shrink-0">
                <MessageSquare size={22} className="fill-current" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-ink text-base">Instant WhatsApp Chat</h3>
                <p className="text-sage text-sm">Direct, quick assistance for quotes and slot availability.</p>
                <WhatsAppCTA
                  phoneNumber={settings.whatsapp_number}
                  variant="compact"
                  label="Chat on WhatsApp"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-marigold p-3 rounded-2xl text-ink flex-shrink-0">
                <Mail size={22} />
              </div>
              <div>
                <h3 className="font-bold text-ink text-base">Email</h3>
                <p className="text-sage text-sm mt-0.5">
                  <a href={`mailto:${settings.email}`} className="hover:text-teal font-semibold text-ink transition-colors break-all">
                    {settings.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Office Location */}
            <div className="flex items-start gap-4">
              <div className="bg-lime p-3 rounded-2xl text-ink flex-shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="font-bold text-ink text-base">Service Headquarters</h3>
                <p className="text-sage text-sm mt-0.5 leading-relaxed">
                  {settings.address || 'Mysore, Karnataka'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-3xl border border-sage/20 shadow-sm">
          <h2 className="text-2xl font-bold text-ink mb-2">Send Us a Message</h2>
          <p className="text-sage text-sm mb-6">Fill in your requirements and we will respond promptly.</p>
          <ContactForm />
        </div>

      </div>
    </main>
  )
}
