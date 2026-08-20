import { requireStaff } from '../../../lib/requireStaff'
import { createClient } from '../../lib/supabase/server'
import Link from 'next/link'
import { ClipboardList, Clock, Sparkles, Navigation, CheckCircle2, ChevronRight, MapPin } from 'lucide-react'

export default async function StaffDashboard() {
  const { staffRecord, user, isOwnerAdmin } = await requireStaff()
  const supabase = await createClient()
  
  const staffId = staffRecord?.id
  const todayStr = new Date().toISOString().split('T')[0]

  // If owner admin without staff record, fetch all assignments for operational view
  let query = supabase
    .from('booking_assignments')
    .select(`
      *,
      cleaning_requests(
        id,
        request_number,
        preferred_date,
        preferred_time,
        address,
        city,
        landmark,
        status,
        services(name),
        profiles(full_name, phone)
      )
    `)
    .order('assigned_at', { ascending: false })

  if (!isOwnerAdmin && staffId) {
    query = query.eq('staff_id', staffId)
  }

  const { data: assignments } = await query

  const allJobs = assignments || []
  const activeJob = allJobs.find(a => a.status === 'en_route' || a.status === 'in_progress')
  const todayJobs = allJobs.filter(a => {
    const req = a.cleaning_requests as any
    return req?.preferred_date === todayStr && a.status !== 'completed' && a.status !== 'cancelled'
  })
  const upcomingJobs = allJobs.filter(a => a.status === 'assigned')
  const completedJobs = allJobs.filter(a => a.status === 'completed')

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      
      {/* Welcome & Profile Header */}
      <header className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-lime/30 text-ink px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-2">
            <Sparkles size={12} />
            <span>MaaShine Field App</span>
          </div>
          <h2 className="text-xl font-extrabold text-ink">{staffRecord?.full_name || 'Admin Operations'}</h2>
          <p className="text-xs text-sage mt-0.5">Role: {staffRecord?.role || 'Administrator'}</p>
        </div>
        <div className="w-12 h-12 bg-teal text-white rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-sm">
          {(staffRecord?.full_name || 'A')[0]}
        </div>
      </header>

      {/* Quick Summary Numbers */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Today</span>
          <span className="text-2xl font-extrabold text-ink mt-1 block">{todayJobs.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Pending</span>
          <span className="text-2xl font-extrabold text-marigold mt-1 block">{upcomingJobs.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Done</span>
          <span className="text-2xl font-extrabold text-teal mt-1 block">{completedJobs.length}</span>
        </div>
      </div>

      {/* Active Job Alert Card */}
      {activeJob && (
        <section className="space-y-2">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-1">Currently In Progress</span>
          {(() => {
            const req = activeJob.cleaning_requests as any
            const profile = req?.profiles as any
            const serviceName = req?.services?.name || 'Cleaning Job'

            return (
              <div className="bg-teal text-white p-6 rounded-3xl shadow-lg relative overflow-hidden space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                      #{req?.request_number}
                    </span>
                    <h3 className="text-xl font-extrabold mt-2">{serviceName}</h3>
                    <p className="text-xs text-lime font-bold mt-0.5">{profile?.full_name}</p>
                  </div>
                  <span className="bg-lime text-ink text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm">
                    {activeJob.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-xs text-white/90">
                  <MapPin size={15} className="flex-shrink-0 mt-0.5 text-lime" />
                  <span className="line-clamp-2">{req?.address}, {req?.city}</span>
                </div>

                <Link
                  href={`/staff/jobs/${activeJob.id}`}
                  className="w-full bg-white text-ink font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md transition-all active:scale-[0.98]"
                >
                  <span>Continue Job Execution</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            )
          })()}
        </section>
      )}

      {/* Today's Schedule */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-base font-extrabold text-ink">Assigned Jobs</h3>
          <Link href="/staff/jobs" className="text-xs font-bold text-teal hover:underline">
            View All ({allJobs.length})
          </Link>
        </div>

        {allJobs.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2">
            <ClipboardList className="mx-auto text-slate-300 w-10 h-10" />
            <p className="font-bold text-ink text-sm">No assignments found</p>
            <p className="text-xs text-sage">New cleaning assignments from the admin will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allJobs.slice(0, 5).map((assignment) => {
              const req = assignment.cleaning_requests as any
              const profile = req?.profiles as any
              const serviceName = req?.services?.name || 'Cleaning Service'
              
              return (
                <Link
                  key={assignment.id}
                  href={`/staff/jobs/${assignment.id}`}
                  className="block bg-white p-5 rounded-2xl border border-slate-200 shadow-sm active:bg-slate-50 transition-colors"
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
                  <p className="text-xs text-slate-500 mt-0.5">{profile?.full_name}</p>
                  
                  <div className="flex items-center justify-between text-xs text-sage mt-3 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock size={13} className="text-teal" />
                      {req?.preferred_date} • {req?.preferred_time}
                    </span>
                    <span className="text-teal font-bold flex items-center gap-1">
                      Details <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

    </div>
  )
}
