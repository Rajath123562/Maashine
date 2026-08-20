import { createClient } from '../../../lib/supabase/server'
import { requireAdmin } from '../../../../lib/requireAdmin'
import { addStaffMember } from '../../../actions/staff'
import { Phone, Mail, UserCircle } from 'lucide-react'

export default async function AdminStaffPage() {
  await requireAdmin()
  const supabase = await createClient()
  
  const { data: staffMembers } = await supabase
    .from('staff')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-4xl font-extrabold text-ink mb-2">Staff Management</h1>
      <p className="text-sage mb-10">Manage your cleaning staff, supervisors, and their access.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Staff List */}
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-ink">Team Members</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold text-sm border-b border-slate-200">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-sage">No staff members added yet.</td>
                  </tr>
                ) : (
                  staffMembers?.map(staff => (
                    <tr key={staff.id} className={`hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 ${staff.status !== 'active' ? 'opacity-60' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <UserCircle size={32} className="text-teal" />
                          <div>
                            <div className="font-bold text-ink">{staff.full_name}</div>
                            <div className="text-xs text-sage font-mono">{staff.employee_code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                          {staff.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-ink mb-1">
                          <Phone size={14} className="text-sage" /> {staff.phone}
                        </div>
                        {staff.email && (
                          <div className="flex items-center gap-2 text-sm text-ink">
                            <Mail size={14} className="text-sage" /> {staff.email}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-extrabold ${
                          staff.status === 'active' ? 'bg-lime/30 text-teal' : 'bg-red-100 text-red-600'
                        }`}>
                          {staff.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Column: Add Staff Form */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
          <h2 className="text-xl font-bold text-ink mb-6">Add New Staff</h2>
          <form action={async (formData: FormData) => { 'use server'; await addStaffMember(formData); }} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input name="full_name" required className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal" placeholder="John Doe" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Phone</label>
                <input name="phone" required className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal" placeholder="10-digit number" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Role</label>
                <select name="role" required className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal">
                  <option value="cleaner">Cleaner</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email Address (Optional)</label>
              <input name="email" type="email" className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal" placeholder="For app access" />
              <p className="text-xs text-sage mt-1">If they create an account with this email, it will link automatically.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Employee Code (Optional)</label>
              <input name="employee_code" className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal" placeholder="Leave blank to auto-generate" />
            </div>
            
            <button type="submit" className="w-full bg-teal text-white font-bold py-3 rounded-xl hover:bg-teal/90 transition-colors shadow-md mt-2">
              Add Staff Member
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
