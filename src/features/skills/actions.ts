'use server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { skillSchema } from './schema'
export type SkillActionState={ok:boolean;message:string}
function parse(fd:FormData){return skillSchema.safeParse({name:fd.get('name')??'',kind:fd.get('kind')??'',sortOrder:fd.get('sortOrder')??0,isVisible:fd.get('isVisible')??false})}
function paths(){revalidatePath('/');revalidatePath('/admin/skills')}
export async function createSkill(fd:FormData):Promise<SkillActionState>{await requireAdmin();const p=parse(fd);if(!p.success)return{ok:false,message:'Invalid skill entry.'};const s=await createClient();const {error}=await s.from('skills').insert({name:p.data.name,kind:p.data.kind,sort_order:p.data.sortOrder,is_visible:p.data.isVisible});if(error)return{ok:false,message:error.message};paths();return{ok:true,message:'Added.'}}
export async function updateSkill(id:string,fd:FormData):Promise<SkillActionState>{await requireAdmin();const p=parse(fd);if(!p.success)return{ok:false,message:'Invalid skill entry.'};const s=await createClient();const {error}=await s.from('skills').update({name:p.data.name,kind:p.data.kind,sort_order:p.data.sortOrder,is_visible:p.data.isVisible}).eq('id',id);if(error)return{ok:false,message:error.message};paths();return{ok:true,message:'Updated.'}}
export async function deleteSkill(id:string):Promise<SkillActionState>{await requireAdmin();const s=await createClient();const {error}=await s.from('skills').delete().eq('id',id);if(error)return{ok:false,message:error.message};paths();return{ok:true,message:'Deleted.'}}
