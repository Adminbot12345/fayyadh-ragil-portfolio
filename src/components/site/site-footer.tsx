import type { SiteSettings } from '@/features/settings/types'
import { whatsAppHref } from '@/lib/contact'

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return <footer className="border-t border-white/10 py-8"><div className="site-shell flex flex-col gap-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between"><div><p className="font-medium text-white">{settings.fullName}</p><p>{settings.headline}</p></div><div className="flex flex-wrap gap-5"><a href={settings.instagramUrl}>Instagram</a><a href={`mailto:${settings.email}`}>Email</a><a href={whatsAppHref(settings.whatsappNumber)}>WhatsApp</a></div><p>© {new Date().getFullYear()} Fayyadh.</p></div></footer>
}
