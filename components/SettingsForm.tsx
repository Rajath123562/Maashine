'use client'

import { useState } from 'react'
import { updateBusinessSettings } from '../app/actions/settings'
import { Save } from 'lucide-react'

export default function SettingsForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    business_name: initialData.business_name || '',
    phone: initialData.phone || '',
    email: initialData.email || '',
    whatsapp_number: initialData.whatsapp_number || '',
    upi_id: initialData.upi_id || '',
    address: initialData.address || '',
    operating_hours: initialData.operating_hours || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await updateBusinessSettings(formData)
      setSuccess('Business settings updated successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-100">{error}</div>}
      {success && <div className="p-4 bg-teal/10 text-teal rounded-xl text-sm font-bold border border-teal/20">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-ink">Business Name</label>
          <input type="text" name="business_name" required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal/20 outline-none transition-all" value={formData.business_name} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-ink">UPI ID</label>
          <input type="text" name="upi_id" required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal/20 outline-none transition-all font-mono" value={formData.upi_id} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-ink">Phone Number</label>
          <input type="text" name="phone" required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal/20 outline-none transition-all" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-ink">WhatsApp Number</label>
          <input type="text" name="whatsapp_number" required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal/20 outline-none transition-all" value={formData.whatsapp_number} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-ink">Email Address</label>
          <input type="email" name="email" required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal/20 outline-none transition-all" value={formData.email} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-ink">Operating Hours</label>
          <input type="text" name="operating_hours" required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal/20 outline-none transition-all" value={formData.operating_hours} onChange={handleChange} />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-bold text-ink">Business Address</label>
          <textarea name="address" required rows={3} className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal/20 outline-none transition-all" value={formData.address} onChange={handleChange} />
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-slate-100">
        <button type="submit" disabled={loading} className="flex items-center gap-2 bg-teal hover:bg-teal/90 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50">
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

    </form>
  )
}
