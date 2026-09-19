'use client'
import { useState } from 'react'
import { PROJECT_CATEGORIES, type Project, type ProjectCategory } from '@/features/projects/types'
import { ProjectCard } from './project-card'

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<'All' | ProjectCategory>('All')
  const visible = category === 'All' ? projects : projects.filter(p => p.category === category)
  return <section id="work" className="section-pad border-b border-white/10"><div className="site-shell"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">Selected projects</p><h2 className="section-title mt-3">Work that moves.</h2></div><div className="flex max-w-full gap-2 overflow-x-auto pb-2" role="group" aria-label="Project filters">{(['All', ...PROJECT_CATEGORIES] as const).map(item=><button key={item} onClick={()=>setCategory(item)} aria-pressed={category===item} className={`liquid-button liquid-filter shrink-0 px-4 py-2 text-xs ${category===item?'font-semibold':'text-white/65'}`}>{item}</button>)}</div></div><div className="mt-10 grid gap-5 md:grid-cols-2">{visible.map(p=><ProjectCard key={p.id} project={p}/>)}</div>{!visible.length&&<p className="mt-10 text-white/45">No projects in this category yet.</p>}</div></section>
}
