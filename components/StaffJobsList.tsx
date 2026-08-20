'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, MapPin, ChevronRight, ClipboardList } from 'lucide-react'

interface StaffJobsListProps {
  initialAssignments: any[]
}

export default function StaffJobsList({ initialAssignments }: StaffJobsListProps) {
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all')
  const todayStr = new Date().toISOString().split('T')[0]

  const filtered = initialAssignments.filter((a) => {
    const req = a.cleaning_requests as any
    if (filter === 'today') {
      return req?.preferred_date === todayStr && a.status !== 'completed' && a.status !== 'cancelled'
    }
    if (filter === 'upcoming') {
      return a.status === 'assigned' || a.status === 'en_route' || a.status === 'in_progress'
    }
    if (filter === 'completed') {
      return a.status === 'completed'
    }
    return true
  })

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
        <button
          onClick={() => setFilter('all')}
          className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
            filter === 'all' ? 'bg-white text-ink shadow-sm' : 'text-slate-500 hover:text-ink'
          }`}
        >
          All ({initialAssignments.length})
        </button>
        <button
          onClick={() => setFilter('today')}
          className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
            filter === 'today' ? 'bg-white text-ink shadow-sm' : 'text-slate-500 hover:text-ink'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
            filter === 'upcoming' ? 'bg-white text-ink shadow-sm' : 'text-slate-500 hover:text-ink'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
            filter === 'completed' ? 'bg-white text-ink shadow-sm' : 'text-slate-500 hover:text-ink'
          }`}
        >
          Done
        </button>
      </div>

      {/* Jobs List */}
      {filtered.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-2">
          <ClipboardList className="mx-auto text-slate-300 w-12 h-12" />
          <p className="font-bold text-ink text-sm">No jobs match this filter</p>
          <p className="text-xs text-sage">Switch tabs to see all your assigned cleaning tasks.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((assignment) => {
            const req = assignment.cleaning_requests as any
            const profile = req?.profiles as any
            const serviceName = req?.services?.name || 'Cleaning Service'
            const isCompleted = assignment.status === 'completed'

            return (
              <Link
                key={assignment.id}
                href={`/staff/jobs/${assignment.id}`}
                className={`block bg-white p-5 rounded-2xl border shadow-sm active:bg-slate-50 transition-colors ${
                  isCompleted ? 'border-teal/20 bg-slate-50/50' : 'border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono font-bold text-slate-400">#{req?.request_number}</span>
                  <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-lg ${
                    assignment.status === 'completed' ? 'bg-teal/10 text-teal' :
                    assignment.status === 'in_progress' ? 'bg-marigold/20 text-marigold' :
                    assignment.status === 'en_route' ? 'bg-lime/30 text-teal' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {assignment.status.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="font-bold text-ink text-base">{serviceName}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{profile?.full_name}</p>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                  <MapPin size={13} className="text-sage" />
                  <span className="truncate">{req?.address}, {req?.city}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-sage mt-3 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Clock size={13} className="text-teal" />
                    {req?.preferred_date} • {req?.preferred_time}
                  </span>
                  <span className="text-teal font-bold flex items-center gap-0.5">
                    Open Job <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
