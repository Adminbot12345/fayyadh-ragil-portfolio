import { beforeEach, expect, it, vi } from 'vitest'
import { reorderProjects } from '@/features/projects/actions'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
vi.mock('@/lib/auth/admin',()=>({requireAdmin:vi.fn(async()=>({userId:'u',email:'a@b.com'}))}));vi.mock('@/lib/supabase/server',()=>({createClient:vi.fn()}))
beforeEach(()=>vi.clearAllMocks())
it('rejects duplicate IDs before writing',async()=>{const rpc=vi.fn();vi.mocked(createClient).mockResolvedValue({rpc} as never);const r=await reorderProjects(['a','a']);expect(r.ok).toBe(false);expect(rpc).not.toHaveBeenCalled()})
it('rejects missing or unknown IDs before RPC',async()=>{const rpc=vi.fn();const query:any={select:vi.fn(async()=>({data:[{id:'a'},{id:'b'}],error:null}))};vi.mocked(createClient).mockResolvedValue({from:vi.fn(()=>query),rpc} as never);const r=await reorderProjects(['a','c']);expect(r.ok).toBe(false);expect(rpc).not.toHaveBeenCalled()})
