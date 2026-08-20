import { createClient } from '../../../lib/supabase/server'
import { requireAdmin } from '../../../../lib/requireAdmin'
import RequestsList from '../../../../components/RequestsList'
import PendingReschedules from '../../../../components/PendingReschedules'

export default async function AdminRequestsPage() {
  await requireAdmin()
  const supabase = await createClient()
  
  const [
    { data: requests },
    { data: reschedules },
    { data: staffMembers }
  ] = await Promise.all([
    supabase
      .from('cleaning_requests')
      .select(`
        *,
        profiles(full_name, email, phone, address, city, state, pincode),
        services(name, price, pricing_type),
        booking_assignments(id, staff_id, status, staff(full_name))
      `)
      .order('created_at', { ascending: false }),
    supabase
      .from('reschedule_requests')
      .select('*, cleaning_requests(request_number, profiles(full_name))')
      .eq('status', 'pending')
      .order('created_at', { ascending: true }),
    supabase
      .from('staff')
      .select('id, full_name, role')
      .eq('status', 'active')
      .order('full_name', { ascending: true })
  ])

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">Booking Management</h1>
        <p className="text-sage text-sm sm:text-base mt-1">
          Review bookings, assign cleaning professionals, coordinate customer requests, and track operational progress in Mysore.
        </p>
      </div>

      <PendingReschedules reschedules={reschedules || []} />

      {(!requests || requests.length === 0) ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-sage text-lg font-medium">No bookings yet. New customer requests will appear here in real time.</p>
        </div>
      ) : (
        <RequestsList
          initialRequests={requests}
          staffMembers={staffMembers || []}
        />
      )}
    </div>
  )
}
