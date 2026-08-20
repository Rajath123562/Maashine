import { createClient } from '../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function CustomerProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  async function updateProfile(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('profiles').update({
      full_name: formData.get('full_name'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      pincode: formData.get('pincode'),
    }).eq('id', user?.id)

    revalidatePath('/profile')
  }

  return (
    <main className="min-h-screen bg-linen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-ink mb-2">My Profile</h1>
        <p className="text-sage font-mono mb-8">Manage your personal information and address details.</p>

        <form action={updateProfile} className="bg-white p-8 rounded-3xl shadow-lg border border-sage/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold mb-2 text-ink">Full Name</label>
              <input name="full_name" defaultValue={profile?.full_name} required className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-ink">Phone Number</label>
              <input name="phone" defaultValue={profile?.phone} required className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal" />
            </div>
          </div>
          
          <div className="border-t border-sage/20 pt-8 mb-8">
            <h3 className="text-xl font-bold text-ink mb-6">Address Details</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-ink">Street Address</label>
                <textarea name="address" defaultValue={profile?.address} rows={3} className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-ink">City</label>
                  <input name="city" defaultValue={profile?.city} className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-ink">State</label>
                  <input name="state" defaultValue={profile?.state} className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-ink">Pincode</label>
                  <input name="pincode" defaultValue={profile?.pincode} className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-teal text-white font-bold py-3 px-8 rounded-xl hover:bg-teal/90 transition-colors shadow-md">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
