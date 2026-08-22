'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { logout } from '../app/(auth)/login/actions'

export default function Navbar({ user, profile }: { user: any, profile: any }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) return null

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/refer', label: 'Refer' }
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-sage/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-3xl font-extrabold text-teal tracking-tighter">Maa<span className="text-lime">Shine</span></span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold ${pathname === link.href ? 'text-teal' : 'text-ink hover:text-teal'} transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-md px-1 py-0.5`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="border-l border-sage/30 h-8 mx-2" />
            
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={profile?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="bg-teal text-white font-bold px-6 py-2.5 rounded-full hover:bg-teal/90 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                >
                  Dashboard
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="text-sage hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    title="Log out"
                    aria-label="Log out of account"
                  >
                    <LogOut size={20} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-ink font-bold hover:text-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-md px-2 py-1"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-lime text-ink font-bold px-6 py-2.5 rounded-full hover:bg-marigold transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-ink hover:text-teal p-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal transition-colors"
              aria-label={isOpen ? "Close main navigation menu" : "Open main navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div id="mobile-nav-menu" className="md:hidden bg-white border-b border-sage/20 px-4 pt-2 pb-6 space-y-2 shadow-xl absolute w-full">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-md text-base font-bold text-ink hover:text-teal hover:bg-linen transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-sage/20 pt-4 mt-2">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={profile?.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-teal text-white font-bold px-6 py-3 rounded-xl hover:bg-teal/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                >
                  Dashboard
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-red-50 text-red-500 font-bold px-6 py-3 rounded-xl hover:bg-red-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    aria-label="Log out of account"
                  >
                    Log Out
                  </button>
                </form>
              </div>
            ) : (
               <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-linen text-ink font-bold px-6 py-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-lime text-ink font-bold px-6 py-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                >
                  Sign Up
                </Link>
               </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
