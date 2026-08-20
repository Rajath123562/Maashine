import { createClient } from '../../lib/supabase/server'
import Link from 'next/link'
import { requireAdmin } from '../../../lib/requireAdmin'
import { Calendar, Clock, CreditCard, CheckCircle2, AlertCircle, Users, ArrowRight, Sparkles, MessageSquare, Mail, Phone } from 'lucide-react'

export default async function AdminDashboard() {
  await requireAdmin()
  const supabase = await createClient()
  const todayStr = new Date().toISOString().split('T')[0]

  // Fetch real metrics securely
  const [
    { count: totalCustomers },
    { data: allRequests },
    { data: payments },
    { count: pendingReschedules },
    { data: contactMessages }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('cleaning_requests').select('id, request_number, status, preferred_date, preferred_time, created_at, profiles(full_name), services(name)').order('created_at', { ascending: false }),
    supabase.from('payments').select('id, amount, status, created_at, profiles(full_name)').order('created_at', { ascending: false }),
    supabase.from('reschedule_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(6)
  ])

  const requests = allRequests || []
  const pendingRequests = requests.filter(r => r.status === 'Pending')
  const todayBookings = requests.filter(r => r.preferred_date === todayStr && r.status !== 'Cancelled' && r.status !== 'Rejected')
  const confirmedJobs = requests.filter(r => r.status === 'Confirmed' || r.status === 'In Progress')
  const completedJobs = requests.filter(r => r.status === 'Completed')

  // Payments verification stats
  const allPayments = payments || []
  const pendingPayments = allPayments.filter(p => p.status === 'Verification Pending')
  const verifiedPayments = allPayments.filter(p => p.status === 'Paid')
  const totalRevenue = verifiedPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  const messages = contactMessages || []

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">Admin Operations</h1>
          <p className="text-sage text-sm sm:text-base mt-1">Real-time status of MaaShine cleaning jobs, inquiries, and payments in Mysore.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/calendar"
            className="inline-flex items-center gap-2 bg-teal text-white font-bold px-5 py-2.5 rounded-full text-sm shadow-sm hover:bg-teal/90 transition-all"
          >
            <Calendar size={16} />
            <span>View Calendar</span>
          </Link>
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-2 bg-white text-ink border border-slate-200 font-bold px-5 py-2.5 rounded-full text-sm shadow-sm hover:bg-slate-50 transition-all"
          >
            <span>All Requests</span>
          </Link>
        </div>
      </div>

      {/* Critical Alert Cards for Pending Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Requests Alert */}
        <Link
          href="/admin/requests"
          className={`p-5 rounded-3xl border transition-all ${
            pendingRequests.length > 0
              ? 'bg-marigold/10 border-marigold/40 hover:bg-marigold/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">New Requests</span>
            <span className={`w-2.5 h-2.5 rounded-full ${pendingRequests.length > 0 ? 'bg-marigold animate-pulse' : 'bg-slate-300'}`} />
          </div>
          <p className="text-3xl font-extrabold text-ink mt-2">{pendingRequests.length}</p>
          <p className="text-xs text-sage mt-1">Pending review & assignment</p>
        </Link>

        {/* Pending Payments Alert */}
        <Link
          href="/admin/payments"
          className={`p-5 rounded-3xl border transition-all ${
            pendingPayments.length > 0
              ? 'bg-teal/10 border-teal/40 hover:bg-teal/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Pending Payments</span>
            <CreditCard size={16} className="text-teal" />
          </div>
          <p className="text-3xl font-extrabold text-teal mt-2">{pendingPayments.length}</p>
          <p className="text-xs text-sage mt-1">UPI proofs waiting verification</p>
        </Link>

        {/* Pending Reschedules Alert */}
        <Link
          href="/admin/requests"
          className={`p-5 rounded-3xl border transition-all ${
            (pendingReschedules || 0) > 0
              ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Reschedule Requests</span>
            <Clock size={16} className="text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-blue-700 mt-2">{pendingReschedules || 0}</p>
          <p className="text-xs text-sage mt-1">Customer slot change requests</p>
        </Link>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Today's Jobs</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-ink mt-2">{todayBookings.length}</p>
          <span className="text-xs text-teal font-semibold mt-1 block">Scheduled for {todayStr}</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active / Confirmed</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-ink mt-2">{confirmedJobs.length}</p>
          <span className="text-xs text-sage mt-1 block">In pipeline or underway</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completed Jobs</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-teal mt-2">{completedJobs.length}</p>
          <span className="text-xs text-sage mt-1 block">All-time satisfied clients</span>
        </div>

        <div className="bg-teal text-white p-5 sm:p-6 rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-white/80 uppercase tracking-wider block">Verified Revenue</span>
          <p className="text-2xl sm:text-3xl font-extrabold mt-2">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <span className="text-xs text-lime font-bold mt-1 block">From {verifiedPayments.length} paid jobs</span>
        </div>
      </div>

      {/* Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Bookings Feed */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-ink">Recent Bookings</h2>
            <Link href="/admin/requests" className="text-teal font-bold hover:underline text-xs">
              View All →
            </Link>
          </div>
          
          <div className="space-y-3">
            {requests.slice(0, 5).map((r: any) => {
              const profile = r.profiles as any
              const service = r.services as any
              return (
                <div key={r.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-ink">#{r.request_number}</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        r.status === 'Pending' ? 'bg-marigold/20 text-marigold' :
                        r.status === 'Confirmed' ? 'bg-lime/30 text-teal' :
                        r.status === 'Completed' ? 'bg-teal/20 text-teal' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-ink mt-1">{service?.name || 'Cleaning'}</p>
                    <p className="text-[11px] text-slate-400">{profile?.full_name} • {r.preferred_date}</p>
                  </div>
                  <Link
                    href="/admin/requests"
                    className="p-2 text-slate-400 hover:text-teal rounded-lg transition-colors"
                  >
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )
            })}
          </div>
        </section>

        {/* Customer Contact Inquiries Feed */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-teal" />
              <h2 className="text-lg font-bold text-ink">Customer Inquiries</h2>
            </div>
            <span className="text-xs font-bold text-slate-400">Website Messages</span>
          </div>

          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No customer inquiries received yet.</p>
            ) : (
              messages.map((m: any) => (
                <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-ink">{m.name}</h4>
                      <p className="text-[11px] text-slate-400">{new Date(m.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <a
                      href={`mailto:${m.email}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal bg-teal/10 hover:bg-teal/20 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <Mail size={12} />
                      <span>Reply</span>
                    </a>
                  </div>
                  <p className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 italic">
                    "{m.message}"
                  </p>
                  <p className="text-[11px] text-teal font-semibold">{m.email}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

    </div>
  )
}
