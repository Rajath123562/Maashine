import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()

  // Verify Admin Role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Get export type
  const searchParams = req.nextUrl.searchParams
  const type = searchParams.get('type')

  let csvData = ''
  let filename = ''

  try {
    if (type === 'bookings') {
      const { data } = await supabase.from('cleaning_requests').select('*, profiles(full_name, phone), services(name)')
      
      const headers = ['Request Number', 'Customer', 'Phone', 'Service', 'Date', 'Time', 'Status', 'City', 'Created At']
      const rows = (data || []).map(r => [
        r.request_number,
        (r.profiles as any)?.full_name || '',
        (r.profiles as any)?.phone || '',
        (r.services as any)?.name || '',
        r.preferred_date,
        r.preferred_time,
        r.status,
        r.city,
        new Date(r.created_at).toISOString()
      ])
      
      csvData = [headers.join(','), ...rows.map(row => row.map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(','))].join('\n')
      filename = `bookings_export_${new Date().toISOString().split('T')[0]}.csv`
      
    } else if (type === 'payments') {
      const { data } = await supabase.from('payments').select('*, cleaning_requests(request_number)')
      
      const headers = ['ID', 'Request Number', 'Amount', 'Currency', 'Method', 'Reference', 'Status', 'Created At']
      const rows = (data || []).map(r => [
        r.id,
        (r.cleaning_requests as any)?.request_number || '',
        r.amount,
        r.currency,
        r.payment_method,
        r.transaction_reference,
        r.status,
        new Date(r.created_at).toISOString()
      ])
      
      csvData = [headers.join(','), ...rows.map(row => row.map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(','))].join('\n')
      filename = `payments_export_${new Date().toISOString().split('T')[0]}.csv`

    } else if (type === 'customers') {
      const { data } = await supabase.from('profiles').select('*').eq('role', 'customer')
      
      const headers = ['Name', 'Email', 'Phone', 'Address', 'City', 'State', 'Pincode', 'Joined At']
      const rows = (data || []).map(r => [
        r.full_name,
        r.email,
        r.phone,
        r.address,
        r.city,
        r.state,
        r.pincode,
        new Date(r.created_at).toISOString()
      ])
      
      csvData = [headers.join(','), ...rows.map(row => row.map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(','))].join('\n')
      filename = `customers_export_${new Date().toISOString().split('T')[0]}.csv`
    } else {
      return new NextResponse('Invalid export type', { status: 400 })
    }

    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error: any) {
    console.error('Export error:', error)
    return new NextResponse('Server error during export', { status: 500 })
  }
}
