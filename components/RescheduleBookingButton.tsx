'use client'

import { useState } from 'react'
import { requestReschedule } from '../app/actions/reschedule'
import { Calendar } from 'lucide-react'

export default function RescheduleBookingButton({ 
  requestId, 
  currentStatus, 
  originalDate, 
  originalTime 
}: { 
  requestId: string, 
  currentStatus: string,
  originalDate: string,
  originalTime: string 
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({
    proposed_date: '',
    proposed_time: '',
    customer_reason: ''
  })

  // Only allow rescheduling in these states
  const canReschedule = ['Pending', 'Contacted'].includes(currentStatus)

  if (!canReschedule) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await requestReschedule({
        requestId,
        original_date: originalDate,
        original_time: originalTime,
        ...formData
      })
      setSuccess('Reschedule request submitted successfully. The admin will review it.')
      setShowForm(false)
    } catch (err: any) {
      setError(err.message || 'Failed to submit reschedule request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 border-t border-slate-100 pt-6">
      
      {error && <div className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg mb-4">{error}</div>}
      {success && <div className="text-teal text-sm font-bold bg-teal/10 p-3 rounded-lg mb-4">{success}</div>}
      
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 text-teal font-bold border border-teal/20 bg-teal/5 hover:bg-teal/10 px-6 py-2 rounded-xl transition-colors text-sm w-full md:w-auto"
        >
          <Calendar size={16} /> Request Reschedule
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-linen p-5 rounded-xl border border-slate-200 mt-2 space-y-4">
          <h3 className="font-bold text-ink flex items-center gap-2">
            <Calendar size={18} className="text-teal" /> Propose New Time
          </h3>
          <p className="text-sm text-sage">Select a new date and time. Your request will be reviewed by the admin.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">New Date</label>
              <input 
                type="date" 
                required 
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-slate-300 rounded-lg p-2" 
                value={formData.proposed_date} 
                onChange={e => setFormData(p => ({ ...p, proposed_date: e.target.value }))} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">New Time</label>
              <input 
                type="time" 
                required 
                className="w-full border border-slate-300 rounded-lg p-2" 
                value={formData.proposed_time} 
                onChange={e => setFormData(p => ({ ...p, proposed_time: e.target.value }))} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Reason (Optional)</label>
            <input 
              type="text" 
              placeholder="Why are you rescheduling?"
              className="w-full border border-slate-300 rounded-lg p-2" 
              value={formData.customer_reason} 
              onChange={e => setFormData(p => ({ ...p, customer_reason: e.target.value }))} 
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-teal text-white font-bold px-6 py-2 rounded-xl hover:bg-teal/90 disabled:opacity-50 text-sm"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={loading}
              className="bg-white text-slate-600 font-bold px-6 py-2 rounded-xl hover:bg-slate-100 disabled:opacity-50 text-sm border border-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
