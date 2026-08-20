import { createClient } from '../../../lib/supabase/server'
import ServiceToggle from '../../../../components/ServiceToggle'
import { addService } from '../../../actions/services'
import { requireAdmin } from '../../../../lib/requireAdmin'

export default async function AdminServicesPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data: services } = await supabase.from('services').select('*').order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-10 overflow-x-hidden">
      <h1 className="text-4xl font-extrabold text-ink mb-2">Manage Services</h1>
      <p className="text-sage mb-10">Add new cleaning services or toggle availability.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-ink">Active Services</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold text-sm border-b border-slate-200">
                  <th className="p-4">Name & Category</th>
                  <th className="p-4">Pricing</th>
                  <th className="p-4 w-32 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {services?.map(service => (
                  <tr key={service.id} className={`hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 ${!service.active ? 'opacity-50' : ''}`}>
                    <td className="p-4">
                      <div className="font-bold text-ink">{service.name}</div>
                      <div className="text-xs font-semibold text-teal mb-1 uppercase tracking-wider">{service.category}</div>
                      <div className="text-sm text-sage line-clamp-1">{service.description}</div>
                    </td>
                    <td className="p-4 text-sm font-medium">
                      {service.pricing_type === 'quote' ? (
                        <span className="text-marigold font-bold">Quote Required</span>
                      ) : (
                        <>
                          ₹{service.price} 
                          {service.pricing_type === 'conditional' && <span className="text-sage block text-xs">Dynamic Pricing</span>}
                        </>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <ServiceToggle id={service.id} active={service.active} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
          <h2 className="text-xl font-bold text-ink mb-6">Add New Service</h2>
          <form action={addService} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Service Name</label>
              <input name="name" required className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal" placeholder="e.g. Deep Cleaning" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select name="category" required className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal">
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Specialized</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Pricing Type</label>
                <select name="pricing_type" required className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal">
                  <option value="fixed">Fixed Price</option>
                  <option value="quote">Price on Request</option>
                  <option value="conditional">Conditional</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Base Price (₹) <span className="text-sage font-normal text-xs">(Leave 0 if quote)</span></label>
              <input name="price" type="number" defaultValue="0" className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Includes (Comma separated)</label>
              <input name="includes" className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal" placeholder="e.g. Dusting, Mopping, Windows" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea name="description" rows={3} required className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal"></textarea>
            </div>
            <button type="submit" className="w-full bg-teal text-white font-bold py-3 rounded-xl hover:bg-teal/90 transition-colors shadow-md mt-2">
              Create Service
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
