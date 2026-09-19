import { expect, it } from 'vitest'
import { validateImageFile, validateVideoFile } from '@/features/media/validation'
function sizedFile(name:string,type:string,size:number){const file=new File(['x'],name,{type});Object.defineProperty(file,'size',{value:size});return file}
it('rejects unsupported image type',()=>expect(validateImageFile(sizedFile('a.gif','image/gif',1)).ok).toBe(false))
it('rejects oversized image',()=>expect(validateImageFile(sizedFile('a.jpg','image/jpeg',10*1024*1024+1)).ok).toBe(false))
it('warns for very large allowed video',()=>{const r=validateVideoFile(sizedFile('a.mp4','video/mp4',100*1024*1024));expect(r.ok).toBe(true);if(r.ok)expect(r.warning).toMatch(/Large video/i)})
