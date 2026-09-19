import { ProjectForm } from '@/components/admin/project-form'
import { createProject } from '@/features/projects/actions'
export default function NewProjectPage(){return <div className="max-w-4xl"><a href="/admin/projects" className="text-sm text-white/40">← Projects</a><h1 className="mt-5 text-4xl font-semibold">New project</h1><div className="mt-8"><ProjectForm action={createProject}/></div></div>}
