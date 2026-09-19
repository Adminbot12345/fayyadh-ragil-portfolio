import Image from 'next/image'
import type { SiteSettings } from '@/features/settings/types'
import type { Skill } from '@/features/skills/types'
import { MediaFallback } from '@/components/ui/media-fallback'
import { Reveal } from '@/components/ui/reveal'

export function AboutSection({ settings, skills }: { settings: SiteSettings; skills: Skill[] }) {
  const visible = skills.filter(s=>s.isVisible)
  return <section id="about" className="section-pad border-b border-white/10"><div className="site-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div className="liquid-card aspect-[4/5] overflow-hidden rounded-[2rem]">{settings.profileImageUrl?<div className="relative h-full"><Image src={settings.profileImageUrl} alt={`${settings.fullName} profile`} fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover"/></div>:<MediaFallback className="h-full"/>}</div><Reveal><div><p className="eyebrow">About me</p><h2 className="section-title mt-3">Editing with rhythm, motion with purpose.</h2><p className="mt-8 max-w-2xl text-lg leading-8 text-white/60">{settings.bio}</p><div className="mt-10 flex flex-wrap gap-2">{visible.map(skill=><span key={skill.id} className="liquid-chip px-4 py-2 text-sm text-white/70">{skill.name}</span>)}</div></div></Reveal></div></section>
}
