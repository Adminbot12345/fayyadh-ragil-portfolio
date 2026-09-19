import { getAdminSkills } from '@/features/skills/repository'
import { SkillsManager } from '@/components/admin/skills-manager'
export default async function AdminSkills(){const skills=await getAdminSkills();return <div><p className="eyebrow">Profile stack</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.04em]">Skills & software</h1><div className="mt-8"><SkillsManager skills={skills}/></div></div>}
