'use client'

import { useState } from 'react'
import { Phone, MessageSquare, Navigation, CheckCircle2, Clock, MapPin, AlertCircle, Sparkles, Home, ShieldCheck } from 'lucide-react'
import { updateJobStatus } from '../app/actions/staff'

interface StaffJobExecutionProps {
  assignment: any
  staffName?: string
}

export default function StaffJobExecution({ assignment, staffName = 'MaaShine Staff' }: StaffJobExecutionProps) {
  const [currentStatus, setCurrentStatus] = useState<string>(assignment.status)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [notes, setNotes] = useState(assignment.notes || '')

  const req = assignment.cleaning_requests as any
  const profile = req?.profiles as any
  const service = req?.services as any

  const cleanPhone = (profile?.phone || '').replace(/[^0-9+]/g, '')
  const cleanWA = (profile?.phone || '').replace(/[^0-9]/g, '')
  
  const customerName = profile?.full_name || 'Customer'
  const serviceName = service?.name || 'Cleaning Service'
  const requestNumber = req?.request_number || assignment.id.slice(0, 6)
  
  const fullAddress = `${req?.address || ''}${req?.landmark ? ` (Near: ${req.landmark})` : ''}, ${req?.city || 'Mysore'}, ${req?.state || 'Karnataka'} - ${req?.pincode || ''}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`

  const waMessage = encodeURIComponent(
    `Namaskara ${customerName}! I am ${staffName} from MaaShine Cleaning Services. I am on my way to your location for your ${serviceName} scheduled today.`
  )
  const waUrl = cleanWA ? `https://wa.me/${cleanWA}?text=${waMessage}` : `https://wa.me/?text=${waMessage}`

  async function handleStatusChange(nextStatus: 'assigned' | 'en_route' | 'in_progress' | 'completed') {
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')
    try {
      await updateJobStatus(assignment.id, nextStatus, notes)
      setCurrentStatus(nextStatus)
      setSuccessMsg(`Status updated to ${nextStatus.replace('_', ' ').toUpperCase()}`)
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update job status')
    } finally {
      setLoading(false)
      setTimeout(() => {
        setSuccessMsg('')
        setErrorMsg('')
      }, 4000)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Status Progress Indicator */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold text-slate-400">Assignment #{assignment.id.slice(0, 8)}</span>
          <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${
            currentStatus === 'completed' ? 'bg-teal/20 text-teal' :
            currentStatus === 'in_progress' ? 'bg-marigold/20 text-marigold' :
            currentStatus === 'en_route' ? 'bg-lime/30 text-teal' :
            'bg-slate-100 text-slate-600'
          }`}>
            {currentStatus.replace('_', ' ')}
          </span>
        </div>

        {/* Action Progression Buttons */}
        <div className="space-y-3">
          {currentStatus === 'assigned' && (
            <button
              onClick={() => handleStatusChange('en_route')}
              disabled={loading}
              className="w-full bg-lime hover:bg-lime/90 text-ink font-extrabold py-4 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 text-base transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Navigation size={20} />
              <span>{loading ? 'Updating...' : 'Start Journey (On The Way)'}</span>
            </button>
          )}

          {currentStatus === 'en_route' && (
            <button
              onClick={() => handleStatusChange('in_progress')}
              disabled={loading}
              className="w-full bg-marigold hover:bg-marigold/90 text-ink font-extrabold py-4 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 text-base transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Clock size={20} />
              <span>{loading ? 'Updating...' : 'Arrived & Start Cleaning'}</span>
            </button>
          )}

          {currentStatus === 'in_progress' && (
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={loading}
              className="w-full bg-teal hover:bg-teal/90 text-white font-extrabold py-4 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 text-base transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <CheckCircle2 size={20} />
              <span>{loading ? 'Updating...' : 'Mark Job as Completed ✅'}</span>
            </button>
          )}

          {currentStatus === 'completed' && (
            <div className="bg-teal/10 border border-teal/30 p-4 rounded-2xl text-center space-y-1">
              <CheckCircle2 size={28} className="text-teal mx-auto" />
              <p className="font-extrabold text-teal text-base">Job Successfully Completed</p>
              <p className="text-xs text-slate-500">All checklist items marked done.</p>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-teal/10 border border-teal/30 text-teal text-xs font-bold rounded-xl text-center">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl text-center">
              {errorMsg}
            </div>
          )}
        </div>
      </div>

      {/* One-Touch Quick Contact & Navigation */}
      <div className="grid grid-cols-3 gap-3">
        <a
          href={`tel:${cleanPhone}`}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-1.5 active:bg-slate-50 transition-colors text-center"
        >
          <div className="w-11 h-11 bg-teal/10 text-teal rounded-full flex items-center justify-center">
            <Phone size={20} />
          </div>
          <span className="text-xs font-extrabold text-ink">Call</span>
        </a>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-1.5 active:bg-slate-50 transition-colors text-center"
        >
          <div className="w-11 h-11 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center">
            <MessageSquare size={20} className="fill-current" />
          </div>
          <span className="text-xs font-extrabold text-ink">WhatsApp</span>
        </a>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-1.5 active:bg-slate-50 transition-colors text-center"
        >
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Navigation size={20} />
          </div>
          <span className="text-xs font-extrabold text-ink">Navigate</span>
        </a>
      </div>

      {/* Customer & Location Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Customer & Site Location</h3>
        
        <div>
          <h4 className="text-xl font-extrabold text-ink">{customerName}</h4>
          <p className="text-sm text-teal font-semibold mt-0.5">{profile?.phone}</p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-start gap-3">
          <MapPin size={20} className="text-teal flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-ink leading-relaxed">{req?.address}</p>
            {req?.landmark && (
              <p className="text-xs font-bold text-marigold mt-1">Landmark: {req.landmark}</p>
            )}
            <p className="text-xs text-slate-400 mt-1">{req?.city}, {req?.state} - {req?.pincode}</p>
          </div>
        </div>

        {req?.additional_notes && (
          <div className="bg-linen p-4 rounded-2xl border border-sage/20 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sage block">Customer Instructions:</span>
            <p className="text-xs text-ink italic leading-relaxed">{req.additional_notes}</p>
          </div>
        )}
      </div>

      {/* Service Details & Checklist */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Service Scope</h3>
          <span className="text-xs font-extrabold text-teal bg-teal/10 px-2.5 py-1 rounded-full">
            {req?.preferred_date} • {req?.preferred_time}
          </span>
        </div>

        <div>
          <h4 className="text-lg font-bold text-ink">{serviceName}</h4>
          <div className="flex items-center gap-2 text-xs text-sage mt-1">
            <Home size={14} />
            <span>{req?.property_type} — {req?.rooms} Room{req?.rooms !== 1 ? 's' : ''}, {req?.bathrooms} Bath</span>
          </div>
          {req?.property_size && (
            <p className="text-xs text-slate-600 mt-1 font-semibold">Size: {req.property_size}</p>
          )}
          {req?.property_condition && (
            <p className="text-xs text-slate-500 italic mt-0.5">Condition: {req.property_condition}</p>
          )}
        </div>

        {/* Inclusions Checklist */}
        {service?.includes && service.includes.length > 0 && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-ink block">Standard Checklist:</span>
            <div className="space-y-2">
              {service.includes.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                  <CheckCircle2 size={16} className="text-teal flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Staff Field Notes */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Field Notes / Observations</h3>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about property condition, extra keys, or completion details..."
          className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal"
        />
        <p className="text-[10px] text-slate-400">Notes will be saved upon status update or admin review.</p>
      </div>

    </div>
  )
}
