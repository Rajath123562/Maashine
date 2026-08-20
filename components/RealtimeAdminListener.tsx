'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../app/lib/supabase/client'
import { Bell, Sparkles, X } from 'lucide-react'

export default function RealtimeAdminListener() {
  const router = useRouter()
  const [notification, setNotification] = useState<{ title: string; message: string } | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Listen for new cleaning requests
    const channel = supabase
      .channel('admin-realtime-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'cleaning_requests' },
        (payload) => {
          setNotification({
            title: 'New Booking Request!',
            message: `Booking #${payload.new.request_number || 'New'} received.`
          })
          router.refresh()
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'payments' },
        (payload) => {
          setNotification({
            title: 'Payment Submitted',
            message: `Payment of ₹${payload.new.amount} submitted for verification.`
          })
          router.refresh()
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reschedule_requests' },
        () => {
          setNotification({
            title: 'Reschedule Requested',
            message: 'A customer has requested to reschedule their cleaning.'
          })
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router])

  if (!notification) return null

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm bg-ink text-white p-4 rounded-2xl shadow-2xl border border-lime/30 flex items-start gap-3 animate-in slide-in-from-top duration-300">
      <div className="bg-lime text-ink p-2 rounded-xl flex-shrink-0 mt-0.5">
        <Bell size={18} className="fill-current" />
      </div>
      <div className="flex-1">
        <h4 className="font-extrabold text-sm text-lime">{notification.title}</h4>
        <p className="text-xs text-slate-300 mt-0.5">{notification.message}</p>
      </div>
      <button
        onClick={() => setNotification(null)}
        className="text-slate-400 hover:text-white p-1"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  )
}
