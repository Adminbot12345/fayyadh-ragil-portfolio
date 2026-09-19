import { expect, it, vi } from 'vitest'
import { createProject } from '@/features/projects/actions'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
vi.mock('@/lib/auth/admin',()=>({requireAdmin:vi.fn()}))
vi.mock('@/lib/supabase/server',()=>({createClient:vi.fn()}))
it('does not mutate when caller is not an admin', async()=>{
  vi.mocked(requireAdmin).mockRejectedValue(new Error('redirect'))
  const from=vi.fn(); vi.mocked(createClient).mockResolvedValue({from} as never)
  const fd=new FormData(); fd.set('title','Demo edit');fd.set('slug','demo-edit');fd.set('category','Cinematic');fd.set('sortOrder','0')
  await expect(createProject({ok:true,message:''},fd)).rejects.toThrow('redirect')
  expect(from).not.toHaveBeenCalled()
})
