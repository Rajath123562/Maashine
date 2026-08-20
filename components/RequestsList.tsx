'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Calendar, Clock, Home, User, Search, Filter, MessageSquare, Navigation } from 'lucide-react'
import StatusUpdater from './StatusUpdater'
import StaffAssignmentSelector from './StaffAssignmentSelector'

interface RequestsListProps {
  initialRequests: any[]
  staffMembers?: { id: string; full_name: string; role: string }[]
}

export default function RequestsList({ initialRequests, staffMembers = [] }: RequestsListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [quickDateFilter, setQuickDateFilter] = useState<'all' | 'today' | 'tomorrow'>('all')

  const todayStr = new Date().toISOString().split('T')[0]
  const tomorrowObj = new Date()
  tomorrowObj.setDate(tomorrowObj.getDate() + 1)
  const tomorrowStr = tomorrowObj.toISOString().split('T')[0]

  const filteredRequests = initialRequests.filter((req) => {
    const profile = req.profiles as any
    const matchesSearch = 
      req.request_number.toString().includes(search) ||
      profile?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      profile?.phone?.includes(search) ||
      req.address?.toLowerCase().includes(search.toLowerCase())
      
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter

    let matchesDate = true
    if (quickDateFilter === 'today') {
      matchesDate = req.preferred_date === todayStr
    } else if (quickDateFilter === 'tomorrow') {
      matchesDate = req.preferred_date === tomorrowStr
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div className="space-y-6">
      
      {/* Search & Status Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search Request ID, customer name, phone, locality..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal text-sm shadow-sm"
          />
        </div>
        
        <div className="relative w-full sm:w-56">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal text-sm font-bold appearance-none shadow-sm"
          >
            <option value="All">All Statuses ({initialRequests.length})</option>
            <option value="Pending">Pending</option>
            <option value="Contacted">Contacted</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Quick Date Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setQuickDateFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
            quickDateFilter === 'all' ? 'bg-teal text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All Dates
        </button>
        <button
          onClick={() => setQuickDateFilter('today')}
          className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
            quickDateFilter === 'today' ? 'bg-teal text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Today's Cleanings
        </button>
        <button
          onClick={() => setQuickDateFilter('tomorrow')}
          className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
            quickDateFilter === 'tomorrow' ? 'bg-teal text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Tomorrow
        </button>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2 shadow-sm">
          <p className="text-ink font-bold text-base">No bookings found</p>
          <p className="text-slate-400 text-xs">Try clearing your filters or search keywords.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const profile = req.profiles as any
            const service = req.services as any
            const assignment = req.booking_assignments && req.booking_assignments.length > 0 ? req.booking_assignments[0] : null
            const isQuote = req.is_quote_request || service?.pricing_type === 'quote'
            
            const cleanPhone = (profile?.phone || '').replace(/[^0-9+]/g, '')
            const cleanWA = (profile?.phone || '').replace(/[^0-9]/g, '')
            const customerName = profile?.full_name || 'Customer'
            const serviceName = service?.name || 'Cleaning Service'
            
            const waMessage = encodeURIComponent(
              `Hi ${customerName}, this is MaaShine Cleaning Services regarding your booking #${req.request_number} for ${serviceName} on ${req.preferred_date}.`
            )
            const waUrl = cleanWA ? `https://wa.me/${cleanWA}?text=${waMessage}` : `https://wa.me/?text=${waMessage}`
            
            const fullAddress = `${req.address || ''}${req.landmark ? ` (Near: ${req.landmark})` : ''}, ${req.city || 'Mysore'}, ${req.state || 'Karnataka'} ${req.pincode || ''}`
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden space-y-4 p-5 sm:p-6"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-ink text-base">#{req.request_number}</span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase font-extrabold ${
                      req.status === 'Pending' ? 'bg-marigold/20 text-marigold' :
                      req.status === 'Confirmed' ? 'bg-lime/30 text-teal' :
                      req.status === 'In Progress' ? 'bg-teal/20 text-teal' :
                      req.status === 'Completed' ? 'bg-teal/30 text-teal' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {req.status}
                    </span>
                    {isQuote && (
                      <span className="text-[10px] bg-marigold text-ink px-2 py-0.5 rounded-full uppercase font-extrabold">
                        Quote
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Col 1: Customer & Contact Quick Actions */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Customer Contact</span>
                    <div>
                      <h4 className="font-bold text-ink text-base">{customerName}</h4>
                      <p className="text-xs text-slate-500">{profile?.email}</p>
                    </div>

                    {/* Quick Call, WhatsApp, Map Action Bar */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {cleanPhone && (
                        <a
                          href={`tel:${cleanPhone}`}
                          className="inline-flex items-center gap-1.5 bg-teal/10 hover:bg-teal/20 text-teal font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
                        >
                          <Phone size={13} />
                          <span>Call</span>
                        </a>
                      )}
                      {cleanWA && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
                        >
                          <MessageSquare size={13} className="text-[#25D366]" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
                      >
                        <Navigation size={13} />
                        <span>Map</span>
                      </a>
                    </div>
                  </div>

                  {/* Col 2: Service & Property Details */}
                  <div className="space-y-2 text-xs">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Service Details</span>
                    <h4 className="font-bold text-ink text-sm">{serviceName}</h4>
                    
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <Calendar size={13} className="text-teal" />
                      <span>{req.preferred_date} • {req.preferred_time}</span>
                    </div>

                    <div className="flex items-start gap-1.5 text-slate-500 pt-1">
                      <MapPin size={13} className="text-teal flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">{fullAddress}</span>
                    </div>

                    {req.additional_notes && (
                      <div className="bg-linen p-2 rounded-xl text-[11px] text-ink italic mt-1">
                        "{req.additional_notes}"
                      </div>
                    )}
                  </div>

                  {/* Col 3: Staff Assignment & Status Updater */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Management</span>
                    
                    {/* Staff Assignment */}
                    <StaffAssignmentSelector
                      requestId={req.id}
                      currentStaffId={assignment?.staff_id}
                      currentStaffName={assignment?.staff?.full_name}
                      staffMembers={staffMembers}
                    />

                    {/* Status Updater */}
                    <StatusUpdater request={req} />
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
