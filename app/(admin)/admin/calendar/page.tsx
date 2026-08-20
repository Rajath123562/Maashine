import { createClient } from '../../../lib/supabase/server'
import { requireAdmin } from '../../../../lib/requireAdmin'
import { Calendar as CalendarIcon, Clock, MapPin, Phone, MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function AdminCalendarPage() {
  await requireAdmin()
  const supabase = await createClient()
  
  // Get upcoming requests that are active
  const { data: upcomingRequests } = await supabase
    .from('cleaning_requests')
    .select(`
      *,
      profiles(full_name, phone),
      services(name),
      booking_assignments(staff(full_name))
    `)
    .in('status', ['Confirmed', 'In Progress', 'Pending', 'Contacted'])
    .order('preferred_date', { ascending: true })

  // Group by date
  const groupedRequests = (upcomingRequests || []).reduce((acc: any, req: any) => {
    const date = req.preferred_date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(req)
    return acc
  }, {})

  // Sort dates
  const sortedDates = Object.keys(groupedRequests).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">Cleaning Schedule Calendar</h1>
        <p className="text-sage text-sm sm:text-base mt-1">
          Single-team operational schedule across Mysore. Only one active booking per slot.
        </p>
      </div>

      {sortedDates.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center space-y-3">
          <CalendarIcon className="mx-auto text-slate-300 w-14 h-14" />
          <p className="text-lg font-bold text-ink">No Scheduled Bookings</p>
          <p className="text-sm text-sage">Pending and confirmed cleanings will appear on the calendar timeline.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((dateStr) => {
            const dateObj = new Date(dateStr)
            const isToday = dateObj.toDateString() === new Date().toDateString()
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
            const formattedDate = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
            
            return (
              <div key={dateStr} className="space-y-4">
                {/* Date Header Sticky Bar */}
                <div className="sticky top-14 md:top-0 bg-slate-50/95 backdrop-blur z-20 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-7 rounded-full ${isToday ? 'bg-teal' : 'bg-slate-300'}`} />
                    <h2 className="text-base sm:text-lg font-extrabold text-ink flex items-center gap-2">
                      {isToday && (
                        <span className="bg-teal text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                          Today
                        </span>
                      )}
                      <span>{dayName}, {formattedDate}</span>
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {groupedRequests[dateStr].length} {groupedRequests[dateStr].length === 1 ? 'Slot' : 'Slots'} Booked
                  </span>
                </div>
                
                {/* Cards for this Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedRequests[dateStr].map((req: any) => {
                    const profile = req.profiles as any
                    const service = req.services as any
                    const assignment = req.booking_assignments && req.booking_assignments.length > 0 ? req.booking_assignments[0] : null
                    const cleanerName = assignment?.staff?.full_name

                    const cleanPhone = (profile?.phone || '').replace(/[^0-9+]/g, '')
                    let cleanWA = (profile?.phone || '').replace(/[^0-9]/g, '')
                    if (cleanWA.length === 10) {
                      cleanWA = '91' + cleanWA
                    }
                    const waMessage = encodeURIComponent(
                      `Hi ${profile?.full_name || 'Customer'}, MaaShine reminder for your ${service?.name} on ${req.preferred_date} at ${req.preferred_time}.`
                    )
                    const waUrl = cleanWA ? `https://wa.me/${cleanWA}?text=${waMessage}` : `https://wa.me/?text=${waMessage}`

                    return (
                      <div
                        key={req.id}
                        className={`bg-white p-5 rounded-3xl shadow-sm border transition-all space-y-3 ${
                          req.status === 'Confirmed' ? 'border-teal/30 bg-teal/[0.02]' :
                          req.status === 'In Progress' ? 'border-marigold/40 bg-marigold/[0.02]' :
                          'border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-mono font-bold text-slate-400">#{req.request_number}</span>
                          <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-lg ${
                            req.status === 'Confirmed' ? 'bg-lime/30 text-teal' :
                            req.status === 'In Progress' ? 'bg-marigold/20 text-marigold' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {req.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-ink text-base">{service?.name}</h4>
                          <p className="text-xs font-semibold text-teal mt-0.5">{profile?.full_name}</p>
                          {cleanerName && (
                            <p className="text-[11px] text-slate-500 mt-0.5">Assigned to: <span className="font-bold text-ink">{cleanerName}</span></p>
                          )}
                        </div>

                        <div className="space-y-1.5 text-xs text-sage pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1.5 font-bold text-ink">
                            <Clock size={13} className="text-teal" />
                            <span>{req.preferred_time}</span>
                          </div>
                          <div className="flex items-start gap-1.5 text-slate-500">
                            <MapPin size={13} className="text-teal flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{req.address}, {req.city}</span>
                          </div>
                        </div>

                        {/* Quick Contact & Details Bar */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            {cleanPhone && (
                              <a
                                href={`tel:${cleanPhone}`}
                                className="p-1.5 bg-teal/10 hover:bg-teal/20 text-teal rounded-lg text-xs"
                                aria-label="Call Customer"
                              >
                                <Phone size={14} />
                              </a>
                            )}
                            {cleanWA && (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-lg text-xs"
                                aria-label="WhatsApp Customer"
                              >
                                <MessageSquare size={14} className="text-[#25D366]" />
                              </a>
                            )}
                          </div>
                          <Link
                            href="/admin/requests"
                            className="inline-flex items-center gap-1 text-xs font-bold text-teal hover:underline"
                          >
                            <span>Manage</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
