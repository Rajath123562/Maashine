import { requireStaff } from '../../../../../lib/requireStaff'
import { createClient } from '../../../../lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import StaffJobExecution from '../../../../../components/StaffJobExecution'

export default async function StaffJobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { staffRecord, user, isOwnerAdmin } = await requireStaff()
  const supabase = await createClient()

  // Fetch the assignment
  const { data: assignment } = await supabase
    .from('booking_assignments')
    .select(`
      *,
      staff(*),
      cleaning_requests(
        id,
        request_number,
        preferred_date,
        preferred_time,
        address,
        city,
        state,
        pincode,
        landmark,
        property_type,
        rooms,
        bathrooms,
        property_size,
        property_condition,
        additional_notes,
        status,
        services(name, description, price, pricing_type, includes),
        profiles(full_name, phone, email)
      )
    `)
    .eq('id', id)
    .single()

  if (!assignment) {
    return notFound()
  }

  // Security Check: If not owner admin, verify staff ownership
  const assignedStaff = assignment.staff as any
  if (!isOwnerAdmin && assignedStaff?.profile_id !== user.id) {
    return notFound()
  }

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      {/* Top Back Navigation */}
      <nav>
        <Link href="/staff/jobs" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal hover:underline py-2">
          <ArrowLeft size={16} />
          <span>Back to Assigned Jobs</span>
        </Link>
      </nav>

      {/* Main Execution Component */}
      <StaffJobExecution
        assignment={assignment}
        staffName={staffRecord?.full_name || 'MaaShine Cleaner'}
      />
    </div>
  )
}
