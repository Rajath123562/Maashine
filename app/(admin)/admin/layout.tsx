'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, ClipboardList, IndianRupee, Users, Box, LogOut, Menu, X, Calendar, FileText, Settings, Sparkles } from 'lucide-react'
import RealtimeAdminListener from '../../../components/RealtimeAdminListener'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
    { href: '/admin/requests', label: 'Requests', icon: ClipboardList },
    { href: '/admin/payments', label: 'Payments', icon: IndianRupee },
    { href: '/admin/staff', label: 'Staff', icon: Users },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/services', label: 'Services', icon: Box },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
    { href: '/admin/reports', label: 'Reports', icon: FileText },
  ]

  const mobileBottomNav = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
    { href: '/admin/requests', label: 'Requests', icon: ClipboardList },
    { href: '/admin/payments', label: 'Payments', icon: IndianRupee },
    { href: '/admin/staff', label: 'Staff', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <RealtimeAdminListener />

      {/* Mobile Header */}
      <div className="md:hidden bg-ink text-white px-4 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <Link href="/admin" className="flex items-center gap-1.5">
          <span className="text-xl font-extrabold text-teal tracking-tight">Maa<span className="text-lime">Admin</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/settings"
            className="p-2 text-slate-300 hover:text-white rounded-xl active:bg-white/10"
            aria-label="Settings"
          >
            <Settings size={20} />
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-2 text-slate-300 hover:text-white rounded-xl active:bg-white/10"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Full Menu Drawer) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-ink/95 z-50 p-6 flex flex-col gap-3 overflow-y-auto pb-24">
          <div className="text-xs font-extrabold text-lime uppercase tracking-wider mb-2">Admin Navigation</div>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 p-3.5 rounded-2xl font-bold transition-colors text-sm ${
                pathname === link.href ? 'bg-teal text-white' : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-700 mt-auto">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3.5 rounded-2xl font-bold text-marigold hover:bg-white/10 text-sm"
            >
              <LogOut size={18} />
              <span>Exit to Customer Dashboard</span>
            </Link>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-ink text-linen min-h-screen p-6 hidden md:flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <Link href="/admin" className="flex items-center gap-2 mb-8">
          <span className="text-2xl font-extrabold text-teal tracking-tight">Maa<span className="text-lime">Admin</span></span>
        </Link>
        <nav className="flex flex-col gap-1.5 flex-1">
          {navLinks.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-colors ${
                  isActive ? 'bg-teal text-white shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
            )
          })}
          
          <Link
            href="/dashboard"
            className="flex items-center gap-3 font-bold text-sage hover:bg-white/5 hover:text-white p-3 rounded-xl transition-colors mt-auto text-sm"
          >
            <LogOut size={18} />
            <span>Exit Admin</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden min-h-[calc(100vh-56px)] md:min-h-screen pb-20 md:pb-8">
        {children}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex justify-around items-center px-2 py-1.5 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        {mobileBottomNav.map(link => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-colors min-w-[56px] ${
                isActive ? 'text-teal font-extrabold' : 'text-slate-400 hover:text-ink font-semibold'
              }`}
            >
              <link.icon size={20} className={isActive ? 'text-teal' : 'text-slate-400'} />
              <span className="text-[10px] mt-0.5">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
