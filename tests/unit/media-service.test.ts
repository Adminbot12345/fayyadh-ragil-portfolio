import { expect, it, vi } from 'vitest'
import { replaceMedia } from '@/features/media/service'
it('cleans new upload and preserves old object when persistence fails',async()=>{
  const upload=vi.fn(async()=>({error:null})), remove=vi.fn(async()=>({error:null})), getPublicUrl=vi.fn(()=>({data:{publicUrl:'https://cdn/new.jpg'}}))
  const storage={from:vi.fn(()=>({upload,remove,getPublicUrl}))}
  const result=await replaceMedia({kind:'image',file:new File(['ok'],'new.jpg',{type:'image/jpeg'}),ownerId:'u1',storage:storage as never,previousManagedPath:'u1/old.jpg',persistUrl:vi.fn(async()=>({ok:false,message:'db failed'}))})
  expect(result.ok).toBe(false); expect(remove).toHaveBeenCalledTimes(1); expect(remove).toHaveBeenCalledWith([expect.stringMatching(/new\.jpg$/)]); expect(remove).not.toHaveBeenCalledWith(['u1/old.jpg'])
})
it('does not update or delete old media when upload fails',async()=>{
  const persistUrl=vi.fn(), remove=vi.fn(), storage={from:vi.fn(()=>({upload:vi.fn(async()=>({error:{message:'upload failed'}})),remove,getPublicUrl:vi.fn()}))}
  const result=await replaceMedia({kind:'image',file:new File(['ok'],'new.jpg',{type:'image/jpeg'}),ownerId:'u1',storage:storage as never,previousManagedPath:'u1/old.jpg',persistUrl})
  expect(result.ok).toBe(false);expect(persistUrl).not.toHaveBeenCalled();expect(remove).not.toHaveBeenCalled()
})
