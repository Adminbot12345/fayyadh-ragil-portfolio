import Link from 'next/link'
import type { Project } from '@/features/projects/types'
import { ProjectPreview } from './project-preview'

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <article className={`group ${featured ? 'md:col-span-2' : ''}`}>
      <Link href={`/work/${project.slug}`} className="liquid-card block overflow-hidden rounded-[1.5rem]">
        <ProjectPreview title={project.title} videoUrl={project.videoUrl} thumbnailUrl={project.thumbnailUrl} />
        <div className="flex items-end justify-between gap-4 p-5 md:p-6">
          <div><p className="mb-2 text-[11px] uppercase tracking-[.2em] text-white/45">{project.category}{project.year ? ` · ${project.year}` : ''}</p><h3 className="text-xl font-semibold tracking-[-.025em] md:text-2xl">{project.title}</h3></div>
          <span aria-hidden className="text-xl text-white/40">↗</span>
        </div>
      </Link>
    </article>
  )
}
