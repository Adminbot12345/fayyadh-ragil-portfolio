import type { SiteSettings } from '@/features/settings/types'
import { whatsAppHref } from '@/lib/contact'
import { HeroVideo } from './hero-video'
import { SiteNav } from './site-nav'

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section id="home" className="grain relative flex min-h-[100svh] items-end overflow-hidden border-b border-white/10">
      <HeroVideo src={settings.heroVideoUrl} poster={settings.heroPosterUrl} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.18),rgba(0,0,0,.4)_45%,#050505_100%)]" />
      <SiteNav />
      <div className="site-shell relative z-10 pb-14 pt-40 md:pb-20">
        <div className="hero-reveal mb-8 flex items-center gap-3 text-xs uppercase tracking-[.22em] text-white/55"><span className="h-px w-10 bg-white/40" /> Available for freelance & opportunities</div>
        <h1 className="display hero-reveal-delay max-w-[12ch]">{settings.fullName}</h1>
        <div className="hero-reveal-delay-2 mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div><p className="text-xl font-medium md:text-3xl">{settings.headline}</p><p className="mt-3 max-w-xl text-sm leading-6 text-white/55 md:text-base">{settings.heroSupportingText}</p></div>
          <div className="flex flex-wrap gap-3">
            <a className="liquid-button liquid-button-primary px-6 py-3 text-sm font-semibold" href={settings.primaryCtaTarget}>{settings.primaryCtaLabel}</a>
            <a className="liquid-button px-6 py-3 text-sm font-semibold" href={settings.secondaryCtaTarget}>{settings.secondaryCtaLabel}</a>
          </div>
        </div>
        <div className="hero-reveal-delay-2 mt-10 flex flex-wrap gap-5 text-xs uppercase tracking-[.18em] text-white/50">
          <a aria-label="Instagram profile" href={settings.instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a>
          <a aria-label="WhatsApp contact" href={whatsAppHref(settings.whatsappNumber)} target="_blank" rel="noreferrer">WhatsApp ↗</a>
          <a aria-label="Email contact" href={`mailto:${settings.email}`}>Email ↗</a>
        </div>
      </div>
    </section>
  )
}
