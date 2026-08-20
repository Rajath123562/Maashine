'use client'

import { useState } from 'react'
import { processRescheduleRequest } from '../app/actions/reschedule'
import { Calendar, Check, X } from 'lucide-react'

export default function PendingReschedules({ reschedules }: { reschedules: any[] }) {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectFor, setShowRejectFor] = useState<string | null>(null)
  const [error, setError] = useState('')

  if (!reschedules || reschedules.length === 0) return null

  const handleProcess = async (id: string, action: 'approved' | 'rejected') => {
    if (action === 'rejected' && !rejectReason) {
      setError('Please provide a reason for rejection.')
      return
    }

    setProcessingId(id)
    setError('')
    try {
      await processRescheduleRequest(id, action, action === 'rejected' ? rejectReason : undefined)
      if (action === 'rejected') {
        setShowRejectFor(null)
        setRejectReason('')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process request')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
        <Calendar className="text-marigold" size={20} /> Pending Reschedule Requests
      </h2>
      
      {error && <div className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reschedules.map((req) => (
          <div key={req.id} className="bg-marigold/5 border border-marigold/30 p-5 rounded-2xl">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-ink">Booking #{req.cleaning_requests?.request_number || 'Unknown'}</h3>
              <span className="text-xs font-bold text-marigold bg-marigold/20 px-2 py-1 rounded-full uppercase">Action Required</span>
            </div>
            
            <p className="text-sm text-sage mb-4">Customer: <span className="font-semibold text-ink">{req.cleaning_requests?.profiles?.full_name || 'Unknown'}</span></p>

            <div className="flex flex-col sm:flex-row gap-4 mb-4 bg-white p-3 rounded-xl border border-slate-200">
              <div className="flex-1">
                <span className="text-xs font-semibold text-sage block mb-1">Original</span>
                <span className="text-sm font-bold text-slate-400 line-through">{req.original_date} at {req.original_time}</span>
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-teal block mb-1">Proposed</span>
                <span className="text-sm font-bold text-ink">{req.proposed_date} at {req.proposed_time}</span>
              </div>
            </div>

            {req.customer_reason && (
              <p className="text-sm text-ink italic mb-4">"{req.customer_reason}"</p>
            )}

            {showRejectFor === req.id ? (
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Reason for rejection..." 
                  className="w-full border border-red-200 rounded-lg p-2 text-sm"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleProcess(req.id, 'rejected')}
                    disabled={processingId === req.id}
                    className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors flex-1"
                  >
                    Confirm Rejection
                  </button>
                  <button 
                    onClick={() => setShowRejectFor(null)}
                    disabled={processingId === req.id}
                    className="bg-white border border-slate-200 text-slate-600 font-bold px-4 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => handleProcess(req.id, 'approved')}
                  disabled={processingId === req.id}
                  className="flex-1 bg-teal text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-teal/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={16} /> Approve
                </button>
                <button 
                  onClick={() => setShowRejectFor(req.id)}
                  disabled={processingId === req.id}
                  className="flex-1 bg-white border border-red-200 text-red-600 font-bold px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <X size={16} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
