import Link from 'next/link'
import { getBusinessSettings } from '../app/actions/settings'
import { MapPin, Phone, Mail, MessageSquare, Clock, HeartHandshake } from 'lucide-react'

export default async function Footer() {
  const settings = await getBusinessSettings()
  const cleanPhone = (settings.phone || '').replace(/[^0-9+]/g, '')
  let cleanWA = (settings.whatsapp_number || '').replace(/[^0-9]/g, '')
  if (cleanWA.length === 10) {
    cleanWA = '91' + cleanWA
  }
  const waUrl = cleanWA
    ? `https://wa.me/${cleanWA}?text=${encodeURIComponent('Hi MaaShine, I would like to inquire about cleaning services in Mysore.')}`
    : 'https://wa.me/?text=Hi%20MaaShine'

  return (
    <footer className="bg-ink text-linen pt-16 pb-8 border-t-[8px] border-lime">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Col 1: Brand & Bio */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-start space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-teal tracking-tighter">
                Maa<span className="text-lime">Shine</span>
              </span>
            </Link>
            <p className="text-sage font-medium text-sm leading-relaxed">
              Professional residential & commercial cleaning services in Mysore, Karnataka. Trusted quality with upfront pricing.
            </p>
            <div className="pt-2">
              <Link
                href="/refer"
                className="inline-flex items-center gap-2 bg-lime/20 hover:bg-lime/30 text-lime font-bold text-xs px-3.5 py-2 rounded-xl transition-all border border-lime/30"
              >
                <HeartHandshake size={15} />
                <span>Refer MaaShine in Mysore</span>
              </Link>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2.5 font-medium text-sm text-sage">
              <li><Link href="/services/home-deep-cleaning" className="hover:text-teal transition-colors">Home Deep Cleaning</Link></li>
              <li><Link href="/services/kitchen-cleaning" className="hover:text-teal transition-colors">Kitchen Cleaning</Link></li>
              <li><Link href="/services/bathroom-toilet-cleaning" className="hover:text-teal transition-colors">Bathroom Cleaning</Link></li>
              <li><Link href="/services/sofa-cleaning" className="hover:text-teal transition-colors">Sofa & Mattress Care</Link></li>
              <li><Link href="/services/office-cleaning" className="hover:text-teal transition-colors">Office Cleaning</Link></li>
              <li><Link href="/services" className="text-teal font-bold hover:underline pt-1 inline-block">View All Services →</Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2.5 font-medium text-sm text-sage">
              <li><Link href="/booking" className="hover:text-teal transition-colors font-bold text-white">Book a Cleaning</Link></li>
              <li><Link href="/refer" className="hover:text-teal transition-colors">Share & Refer</Link></li>
              <li><Link href="/about" className="hover:text-teal transition-colors">About MaaShine</Link></li>
              <li><Link href="/contact" className="hover:text-teal transition-colors">Contact Support</Link></li>
              <li><Link href="/login" className="hover:text-teal transition-colors">Customer Login</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Mysore</h3>
            <ul className="space-y-3 font-medium text-sm text-sage">
              <li>
                <a href={`tel:${cleanPhone}`} className="flex items-center gap-2 hover:text-teal transition-colors text-white font-bold">
                  <Phone size={16} className="text-teal" />
                  <span>{settings.phone}</span>
                </a>
              </li>
              <li>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#25D366] transition-colors text-[#25D366] font-bold">
                  <MessageSquare size={16} className="fill-current" />
                  <span>Chat on WhatsApp</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-teal transition-colors">
                  <Mail size={16} className="text-teal" />
                  <span className="break-all">{settings.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <Clock size={16} className="text-teal flex-shrink-0 mt-0.5" />
                <span>{settings.operating_hours || 'Mon–Sat, 9AM to 6PM'}</span>
              </li>
              <li className="flex items-start gap-2 pt-1 text-xs leading-relaxed text-slate-400">
                <MapPin size={16} className="text-teal flex-shrink-0 mt-0.5" />
                <span>{settings.address || 'Mysore, Karnataka'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sage/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-sage/70">
          <p>&copy; {new Date().getFullYear()} {settings.business_name || 'MaaShine Cleaning Services'}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <Link
              href="/privacy"
              className="hover:text-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/terms"
              className="hover:text-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded"
            >
              Terms of Service
            </Link>
            <span>•</span>
            <span>Professional Cleaning in Mysore, KA</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

