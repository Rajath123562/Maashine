import { requireStaff } from '../../../../lib/requireStaff'
import { createClient } from '../../../lib/supabase/server'
import StaffJobsList from '../../../../components/StaffJobsList'

export default async function StaffJobsPage() {
  const { staffRecord, user, isOwnerAdmin } = await requireStaff()
  const supabase = await createClient()
  
  const staffId = staffRecord?.id

  // Fetch jobs for this staff member (or all jobs if owner admin)
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

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <header className="mb-2">
        <h2 className="text-2xl font-extrabold text-ink">My Cleaning Jobs</h2>
        <p className="text-sage text-xs">Track, navigate to, and complete your assigned jobs in Mysore.</p>
      </header>

      <StaffJobsList initialAssignments={assignments || []} />
    </div>
  )
}
