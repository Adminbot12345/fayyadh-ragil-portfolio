import type { Project } from '@/features/projects/types'
import { ProjectCard } from './project-card'
import { Reveal } from '@/components/ui/reveal'

export function FeaturedWork({ projects }: { projects: Project[] }) {
  if (!projects.length) return null
  return <section className="section-pad border-b border-white/10"><div className="site-shell"><p className="eyebrow">Featured work</p><Reveal className="mt-8"><div className="grid gap-5 md:grid-cols-2">{[...projects].sort((a,b)=>a.sortOrder-b.sortOrder).slice(0,4).map((p,i)=><ProjectCard key={p.id} project={p} featured={i===0}/>)}</div></Reveal></div></section>
}
