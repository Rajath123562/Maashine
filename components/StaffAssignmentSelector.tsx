'use client'

import { useState } from 'react'
import { assignStaffToBooking } from '../app/actions/staff'
import { UserCheck, Check, Loader2 } from 'lucide-react'

interface StaffAssignmentSelectorProps {
  requestId: string
  currentStaffId?: string
  currentStaffName?: string
  staffMembers: { id: string; full_name: string; role: string }[]
}

export default function StaffAssignmentSelector({
  requestId,
  currentStaffId,
  currentStaffName,
  staffMembers
}: StaffAssignmentSelectorProps) {
  const [selectedStaff, setSelectedStaff] = useState(currentStaffId || '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleAssign(newStaffId: string) {
    if (!newStaffId || newStaffId === selectedStaff) return
    setLoading(true)
    setErrorMsg('')
    try {
      await assignStaffToBooking(requestId, newStaffId)
      setSelectedStaff(newStaffId)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to assign staff')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <UserCheck size={13} className="text-teal" />
          <span>Assigned Staff</span>
        </span>
        {saved && <span className="text-teal font-bold text-[10px]">Assigned!</span>}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={selectedStaff}
          disabled={loading || staffMembers.length === 0}
          onChange={(e) => handleAssign(e.target.value)}
          className="w-full text-xs font-semibold p-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal disabled:opacity-50"
        >
          <option value="">-- Select Cleaner / Supervisor --</option>
          {staffMembers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name} ({s.role})
            </option>
          ))}
        </select>
        {loading && <Loader2 size={15} className="animate-spin text-teal flex-shrink-0" />}
      </div>

      {errorMsg && <p className="text-[10px] text-red-500 font-bold">{errorMsg}</p>}
    </div>
  )
}
