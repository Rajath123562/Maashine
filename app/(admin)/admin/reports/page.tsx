import { createClient } from '../../../lib/supabase/server'
import { requireAdmin } from '../../../../lib/requireAdmin'
import { FileText, Download } from 'lucide-react'

export default async function AdminReportsPage() {
  await requireAdmin()
  const supabase = await createClient()

  // For a real production app, generating CSVs of large tables is often done via 
  // an API route so it streams, but for this size, we can fetch all or use a client component 
  // to fetch and download. We will create a UI that links to API routes for downloading CSVs.

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-4xl font-extrabold text-ink mb-2">Reports & Analytics</h1>
      <p className="text-sage mb-10">Export your business data for accounting and analysis.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Bookings Export */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-teal/10 p-3 rounded-xl">
              <FileText className="text-teal" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-ink text-lg">Bookings Report</h3>
              <p className="text-sm text-sage">All cleaning requests</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-6">Export a complete history of all bookings, their statuses, property details, and assigned services.</p>
          <a 
            href="/api/admin/export?type=bookings" 
            className="flex items-center justify-center gap-2 w-full bg-slate-50 hover:bg-slate-100 text-ink font-bold py-3 rounded-xl border border-slate-200 transition-colors"
          >
            <Download size={18} /> Export CSV
          </a>
        </div>

        {/* Payments Export */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-teal/10 p-3 rounded-xl">
              <FileText className="text-teal" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-ink text-lg">Payments Report</h3>
              <p className="text-sm text-sage">All verified payments</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-6">Export financial records including UTR numbers, amounts, and associated booking references.</p>
          <a 
            href="/api/admin/export?type=payments" 
            className="flex items-center justify-center gap-2 w-full bg-slate-50 hover:bg-slate-100 text-ink font-bold py-3 rounded-xl border border-slate-200 transition-colors"
          >
            <Download size={18} /> Export CSV
          </a>
        </div>

        {/* Customers Export */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-teal/10 p-3 rounded-xl">
              <FileText className="text-teal" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-ink text-lg">Customers Report</h3>
              <p className="text-sm text-sage">Registered users directory</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-6">Export your complete customer database for marketing, outreach, or CRM importing.</p>
          <a 
            href="/api/admin/export?type=customers" 
            className="flex items-center justify-center gap-2 w-full bg-slate-50 hover:bg-slate-100 text-ink font-bold py-3 rounded-xl border border-slate-200 transition-colors"
          >
            <Download size={18} /> Export CSV
          </a>
        </div>

      </div>
    </div>
  )
}
