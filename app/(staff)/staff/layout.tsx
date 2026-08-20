'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, LogOut } from 'lucide-react'

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navLinks = [
    { href: '/staff', label: 'Home', icon: Home },
    { href: '/staff/jobs', label: 'My Jobs', icon: Briefcase },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Mobile Header */}
      <header className="bg-teal text-white p-4 sticky top-0 z-50 shadow-md">
        <h1 className="text-xl font-extrabold text-center">MaaShine Staff</h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="bg-white border-t border-slate-200 fixed bottom-0 w-full z-50 flex justify-around p-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navLinks.map(link => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center p-2 min-w-[64px] ${isActive ? 'text-teal' : 'text-slate-400'}`}
            >
              <link.icon size={24} className="mb-1" />
              <span className="text-[10px] font-bold">{link.label}</span>
            </Link>
          )
        })}
        <Link
          href="/dashboard"
          className="flex flex-col items-center p-2 min-w-[64px] text-slate-400 hover:text-marigold"
        >
          <LogOut size={24} className="mb-1" />
          <span className="text-[10px] font-bold">Exit</span>
        </Link>
      </nav>
    </div>
  )
}
