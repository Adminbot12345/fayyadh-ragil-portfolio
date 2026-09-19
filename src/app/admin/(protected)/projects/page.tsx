import { getAdminProjects } from '@/features/projects/repository'
import { ProjectsTable } from '@/components/admin/projects-table'
import { ProjectOrderList } from '@/components/admin/project-order-list'
export default async function ProjectsPage(){const projects=await getAdminProjects();return <div><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Manage</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.04em]">Projects</h1></div><a className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black" href="/admin/projects/new">New project</a></div><div className="mt-8"><ProjectsTable projects={projects}/><ProjectOrderList projects={projects}/></div></div>}
