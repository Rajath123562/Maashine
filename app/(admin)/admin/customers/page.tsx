import { createClient } from '../../../lib/supabase/server'
import Link from 'next/link'
import { Phone, Mail, MapPin, Search } from 'lucide-react'
import { requireAdmin } from '../../../../lib/requireAdmin'

export default async function AdminCustomersPage() {
  await requireAdmin()
  const supabase = await createClient()
  
  const { data: customers } = await supabase
    .from('profiles')
    .select('*, cleaning_requests(count)')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-4xl font-extrabold text-ink mb-2">Customer Management</h1>
      <p className="text-sage mb-10">View and manage registered MaaShine customers.</p>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold text-sm border-b border-slate-200">
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Location</th>
                <th className="p-4">Requests</th>
                <th className="p-4">Registered</th>
              </tr>
            </thead>
            <tbody>
              {customers?.map(customer => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                  <td className="p-4 font-bold text-ink">{customer.full_name}</td>
                  <td className="p-4 text-sm text-ink">
                    <div className="block">{customer.email}</div>
                    <div className="block text-sage">{customer.phone}</div>
                  </td>
                  <td className="p-4 text-sm text-ink">{customer.city || 'N/A'}, {customer.state || 'N/A'}</td>
                  <td className="p-4">
                    <span className="bg-teal/10 text-teal font-bold px-3 py-1 rounded-full text-xs">
                      {customer.cleaning_requests?.[0]?.count || 0} Total
                    </span>
                  </td>
                  <td className="p-4 text-sm text-sage">{new Date(customer.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
