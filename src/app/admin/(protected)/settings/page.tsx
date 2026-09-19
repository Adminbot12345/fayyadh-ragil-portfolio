import { getSiteSettings } from '@/features/settings/repository'
import { SettingsForm } from '@/components/admin/settings-form'
export default async function AdminSettings(){const settings=await getSiteSettings();return <div><p className="eyebrow">Homepage & profile</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.04em]">Settings</h1><div className="mt-8"><SettingsForm key={settings.updatedAt} settings={settings}/></div></div>}
