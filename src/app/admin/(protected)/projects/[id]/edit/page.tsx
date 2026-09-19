import { notFound } from 'next/navigation'
import { ProjectForm } from '@/components/admin/project-form'
import { updateProject } from '@/features/projects/actions'
import { getAdminProjectById } from '@/features/projects/repository'
export default async function EditProjectPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const p=await getAdminProjectById(id);if(!p)notFound();return <div className="max-w-4xl"><a href="/admin/projects" className="text-sm text-white/40">← Projects</a><h1 className="mt-5 text-4xl font-semibold">Edit project</h1><div className="mt-8"><ProjectForm key={p.updatedAt} project={p} action={updateProject.bind(null,id)}/></div></div>}
