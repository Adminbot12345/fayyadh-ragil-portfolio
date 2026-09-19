'use server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { projectFormSchema, type ProjectFormValues } from './schema'

export type ProjectActionState={ok:boolean;message:string;fieldErrors?:Record<string,string[]>}
const ok=(message:string):ProjectActionState=>({ok:true,message})
const fail=(message:string,fieldErrors?:Record<string,string[]>):ProjectActionState=>({ok:false,message,fieldErrors})

function parseForm(formData:FormData){
  return projectFormSchema.safeParse({
    title:formData.get('title')??'', slug:formData.get('slug')??'', description:formData.get('description')??'', category:formData.get('category')??'',
    clientName:formData.get('clientName')??'', year:formData.get('year')??'', thumbnailUrl:formData.get('thumbnailUrl')??'', videoUrl:formData.get('videoUrl')??'',
    instagramUrl:formData.get('instagramUrl')??'', externalUrl:formData.get('externalUrl')??'', sortOrder:formData.get('sortOrder')??0,
    isFeatured:formData.get('isFeatured')??false, isPublished:formData.get('isPublished')??false,
  })
}
function row(v:ProjectFormValues){return {title:v.title,slug:v.slug,description:v.description,category:v.category,client_name:v.clientName,year:v.year,thumbnail_url:v.thumbnailUrl,video_url:v.videoUrl,instagram_url:v.instagramUrl,external_url:v.externalUrl,is_featured:v.isFeatured,is_published:v.isPublished,sort_order:v.sortOrder}}
function invalidate(){revalidatePath('/');revalidatePath('/admin');revalidatePath('/admin/projects')}

export async function createProject(_:ProjectActionState,formData:FormData):Promise<ProjectActionState>{
  await requireAdmin(); const parsed=parseForm(formData); if(!parsed.success)return fail('Please fix the highlighted fields.',parsed.error.flatten().fieldErrors as Record<string,string[]>)
  const supabase=await createClient(); const {error}=await supabase.from('projects').insert(row(parsed.data)); if(error)return fail(error.code==='23505'?'That project slug is already in use.':error.message); invalidate(); return ok('Project created.')
}
export async function updateProject(id:string,_:ProjectActionState,formData:FormData):Promise<ProjectActionState>{
  await requireAdmin(); const parsed=parseForm(formData); if(!parsed.success)return fail('Please fix the highlighted fields.',parsed.error.flatten().fieldErrors as Record<string,string[]>)
  const supabase=await createClient(); const {error}=await supabase.from('projects').update(row(parsed.data)).eq('id',id); if(error)return fail(error.code==='23505'?'That project slug is already in use.':error.message); invalidate(); revalidatePath(`/admin/projects/${id}/preview`); return ok('Project updated.')
}
export async function deleteProject(id:string):Promise<ProjectActionState>{await requireAdmin();const supabase=await createClient();const {error}=await supabase.from('projects').delete().eq('id',id);if(error)return fail(error.message);invalidate();return ok('Project deleted.')}
export async function setProjectPublished(id:string,value:boolean):Promise<ProjectActionState>{await requireAdmin();const supabase=await createClient();const {error}=await supabase.from('projects').update({is_published:value}).eq('id',id);if(error)return fail(error.message);invalidate();return ok(value?'Project published.':'Project moved to draft.')}
export async function setProjectFeatured(id:string,value:boolean):Promise<ProjectActionState>{await requireAdmin();const supabase=await createClient();const {error}=await supabase.from('projects').update({is_featured:value}).eq('id',id);if(error)return fail(error.message);invalidate();return ok(value?'Project featured.':'Project removed from featured.')}

export async function uploadProjectMedia(projectId:string,kind:'image'|'video',formData:FormData):Promise<ProjectActionState>{
  const admin=await requireAdmin();const file=formData.get('file');if(!(file instanceof File)||file.size===0)return fail('Choose a file first.')
  const supabase=await createClient();const column=kind==='image'?'thumbnail_url':'video_url';const {data:current,error:readError}=await supabase.from('projects').select(column).eq('id',projectId).maybeSingle();if(readError)return fail(readError.message)
  const {replaceMedia,managedPathFromPublicUrl}=await import('@/features/media/service');const bucket=kind==='image'?'portfolio-images':'portfolio-videos';const previous=(current as Record<string,string|null>|null)?.[column]??null
  const result=await replaceMedia({kind,file,ownerId:admin.userId,storage:supabase.storage as never,previousManagedPath:managedPathFromPublicUrl(previous,bucket),persistUrl:async(url)=>{const {error}=await supabase.from('projects').update({[column]:url}).eq('id',projectId);return error?{ok:false,message:error.message}:{ok:true}}})
  if(!result.ok)return fail(result.message);invalidate();revalidatePath(`/admin/projects/${projectId}/edit`);return ok(result.warning??'Media uploaded.')
}

export async function reorderProjects(orderedIds:string[]):Promise<ProjectActionState>{
  await requireAdmin();if(new Set(orderedIds).size!==orderedIds.length)return fail('Project order contains duplicate IDs.');const supabase=await createClient();const {data,error}=await supabase.from('projects').select('id');if(error)return fail(error.message);const current=(data??[]).map((r:any)=>r.id as string);if(current.length!==orderedIds.length||current.some(id=>!orderedIds.includes(id)))return fail('Project order must contain every current project exactly once.');const {error:rpcError}=await supabase.rpc('reorder_projects',{ordered_ids:orderedIds});if(rpcError)return fail(rpcError.message);invalidate();return ok('Project order saved.')
}
