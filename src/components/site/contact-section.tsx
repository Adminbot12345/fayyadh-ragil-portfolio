import type { SiteSettings } from '@/features/settings/types'
import { whatsAppHref } from '@/lib/contact'
import { Reveal } from '@/components/ui/reveal'

export function ContactSection({ settings }: { settings: SiteSettings }) {
  return <section id="contact" className="section-pad"><div className="site-shell"><Reveal><div className="liquid-card relative overflow-hidden rounded-[2rem] p-7 md:p-12 lg:p-16"><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"/><p className="eyebrow">Start a project</p><h2 className="relative mt-4 max-w-4xl text-5xl font-semibold tracking-[-.05em] md:text-7xl">Have a project in mind?<br/><span className="text-white/35">Let’s create something worth watching.</span></h2><div className="relative mt-10 flex flex-wrap gap-3"><a aria-label="WhatsApp contact" className="liquid-button liquid-button-primary px-6 py-3 font-semibold" href={whatsAppHref(settings.whatsappNumber)} target="_blank" rel="noreferrer">WhatsApp ↗</a><a aria-label="Instagram contact" className="liquid-button px-6 py-3" href={settings.instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a><a aria-label="Email contact" className="liquid-button px-6 py-3" href={`mailto:${settings.email}`}>Email ↗</a></div></div></Reveal></div></section>
}
