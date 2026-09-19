import { validateImageFile, validateVideoFile, type ValidationResult } from './validation'
export type MediaKind='image'|'video'
export type ReplaceMediaResult={ok:true;url:string;warning?:string}|{ok:false;message:string}
type Bucket={upload:(path:string,file:File)=>Promise<{error:null|{message:string}}>;getPublicUrl:(path:string)=>{data:{publicUrl:string}};remove:(paths:string[])=>Promise<unknown>}
export type StorageLike={from:(bucket:string)=>Bucket}
export type ReplaceMediaInput={kind:MediaKind;file:File;ownerId:string;storage:StorageLike;persistUrl:(url:string)=>Promise<{ok:boolean;message?:string}>;previousManagedPath?:string|null}
export function safeFileName(name:string){return name.toLowerCase().replace(/[^a-z0-9._-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')||'media'}
export async function replaceMedia(input:ReplaceMediaInput):Promise<ReplaceMediaResult>{
  const validation:ValidationResult=input.kind==='image'?validateImageFile(input.file):validateVideoFile(input.file);if(!validation.ok)return validation
  const bucket=input.kind==='image'?'portfolio-images':'portfolio-videos';const newPath=`${input.ownerId}/${crypto.randomUUID()}-${safeFileName(input.file.name)}`;const api=input.storage.from(bucket)
  const {error:uploadError}=await api.upload(newPath,input.file);if(uploadError)return{ok:false,message:uploadError.message}
  const {data}=api.getPublicUrl(newPath);let persisted:{ok:boolean;message?:string}
  try{persisted=await input.persistUrl(data.publicUrl)}catch(error){persisted={ok:false,message:error instanceof Error?error.message:'Failed to save media URL.'}}
  if(!persisted.ok){await api.remove([newPath]);return{ok:false,message:persisted.message??'Failed to save media URL.'}}
  if(input.previousManagedPath)await api.remove([input.previousManagedPath])
  return{ok:true,url:data.publicUrl,warning:validation.warning}
}
export function managedPathFromPublicUrl(url:string|null|undefined,bucket:string):string|null{if(!url)return null;const marker=`/storage/v1/object/public/${bucket}/`;const at=url.indexOf(marker);return at>=0?decodeURIComponent(url.slice(at+marker.length)):null}
