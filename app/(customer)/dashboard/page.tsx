import { createClient } from '../../lib/supabase/server'
import Link from 'next/link'
import { logout } from '../../(auth)/login/actions'

export default async function CustomerDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  // Fetch user's recent requests
  const { data: requests } = await supabase
    .from('cleaning_requests')
    .select('id, request_number, service_id, services(name), preferred_date, status')
    .eq('customer_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-linen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-ink mb-2">Welcome, {profile?.full_name || 'Customer'}</h1>
            <p className="text-sage font-mono">Here is an overview of your MaaShine services.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/profile" className="text-sage hover:text-teal font-bold text-sm transition-colors">Profile</Link>
            <Link href="/booking" className="bg-teal text-white font-bold py-3 px-6 rounded-full hover:bg-teal/90 transition-colors shadow-lg">
              Request New Cleaning
            </Link>
            <form action={logout}>
              <button type="submit" className="text-sage hover:text-red-500 font-bold text-sm transition-colors">Logout</button>
            </form>
          </div>
        </header>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage/20">
            <h3 className="text-sage font-semibold mb-2">Total Requests</h3>
            <p className="text-3xl font-extrabold text-ink">{requests?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage/20">
            <h3 className="text-sage font-semibold mb-2">Pending</h3>
            <p className="text-3xl font-extrabold text-marigold">{requests?.filter(r => r.status === 'Pending').length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage/20">
            <h3 className="text-sage font-semibold mb-2">Confirmed</h3>
            <p className="text-3xl font-extrabold text-lime">{requests?.filter(r => r.status === 'Confirmed').length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage/20">
            <h3 className="text-sage font-semibold mb-2">Completed</h3>
            <p className="text-3xl font-extrabold text-teal">{requests?.filter(r => r.status === 'Completed').length || 0}</p>
          </div>
        </div>

        <section className="bg-white rounded-3xl shadow-lg border border-sage/20 overflow-hidden">
          <div className="p-8 border-b border-sage/20 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-ink">Recent Requests</h2>
          </div>
          
          {(!requests || requests.length === 0) ? (
            <div className="p-16 text-center">
              <div className="w-24 h-24 bg-linen rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">No cleaning requests yet.</h3>
              <p className="text-sage mb-6">Ready for a spotless home? Request your first premium cleaning.</p>
              <Link href="/booking" className="inline-block bg-lime text-ink font-bold py-3 px-8 rounded-full hover:bg-marigold transition-colors">
                Request Cleaning
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-linen/50 text-sage font-semibold text-sm">
                    <th className="p-4 border-b border-sage/20">Request ID</th>
                    <th className="p-4 border-b border-sage/20">Service</th>
                    <th className="p-4 border-b border-sage/20">Date</th>
                    <th className="p-4 border-b border-sage/20">Status</th>
                    <th className="p-4 border-b border-sage/20 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-linen/30 transition-colors">
                      <td className="p-4 border-b border-sage/10 font-mono text-ink">#{req.request_number}</td>
                      <td className="p-4 border-b border-sage/10 font-medium text-ink">{(req.services as any)?.name}</td>
                      <td className="p-4 border-b border-sage/10 text-ink">{req.preferred_date}</td>
                      <td className="p-4 border-b border-sage/10">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          req.status === 'Pending' ? 'bg-marigold/20 text-marigold' :
                          req.status === 'Confirmed' ? 'bg-lime/20 text-teal' :
                          req.status === 'Completed' ? 'bg-teal/20 text-teal' :
                          'bg-sage/20 text-sage'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 border-b border-sage/10 text-right">
                        <Link href={`/my-requests/${req.id}`} className="text-teal font-bold hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
