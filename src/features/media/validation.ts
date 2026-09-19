export type ValidationResult={ok:true;warning?:string}|{ok:false;message:string}
const IMAGE_TYPES=new Set(['image/jpeg','image/png','image/webp'])
const VIDEO_TYPES=new Set(['video/mp4','video/webm','video/quicktime'])
const MIB=1024*1024
export function validateImageFile(file:File):ValidationResult{if(!IMAGE_TYPES.has(file.type))return{ok:false,message:'Use a JPEG, PNG, or WebP image.'};if(file.size>10*MIB)return{ok:false,message:'Image must be 10 MiB or smaller.'};return{ok:true}}
export function validateVideoFile(file:File):ValidationResult{if(!VIDEO_TYPES.has(file.type))return{ok:false,message:'Use an MP4, WebM, or QuickTime video.'};if(file.size>250*MIB)return{ok:false,message:'Video must be 250 MiB or smaller.'};if(file.size>=100*MIB)return{ok:true,warning:'Large video — consider an external host for faster delivery'};return{ok:true}}
