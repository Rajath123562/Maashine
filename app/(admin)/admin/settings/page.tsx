import { getBusinessSettings } from '../../../../app/actions/settings'
import { requireAdmin } from '../../../../lib/requireAdmin'
import SettingsForm from '../../../../components/SettingsForm'

export default async function AdminSettingsPage() {
  await requireAdmin()
  const settings = await getBusinessSettings()

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-ink mb-2">Business Settings</h1>
      <p className="text-sage mb-8">Manage your business contact details, operating hours, and UPI payment configuration.</p>
      
      <SettingsForm initialData={settings} />
    </div>
  )
}
