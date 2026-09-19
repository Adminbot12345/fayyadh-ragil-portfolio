import { notFound } from 'next/navigation'
import { getPublishedProjectBySlug } from '@/features/projects/repository'
import { ProjectPreview } from '@/components/site/project-preview'

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getPublishedProjectBySlug(slug)
  if (!project) notFound()
  return <main className="min-h-screen bg-[#050505] px-4 py-8 text-white md:px-8"><div className="mx-auto max-w-6xl"><a href="/#work" className="text-sm text-white/50">← Back to work</a><div className="mt-10"><p className="eyebrow">{project.category}{project.year ? ` · ${project.year}` : ''}</p><h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-.05em] md:text-8xl">{project.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/55">{project.description}</p></div><div className="mt-12 overflow-hidden rounded-[2rem] border border-white/10"><ProjectPreview title={project.title} videoUrl={project.videoUrl} thumbnailUrl={project.thumbnailUrl}/></div><div className="mt-8 flex flex-wrap gap-3">{project.instagramUrl&&<a className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black" href={project.instagramUrl} target="_blank" rel="noreferrer">View on Instagram ↗</a>}{project.externalUrl&&<a className="rounded-full border border-white/20 px-5 py-3 text-sm" href={project.externalUrl} target="_blank" rel="noreferrer">Open project ↗</a>}</div></div></main>
}
