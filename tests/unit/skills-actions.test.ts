import { expect, it, vi } from 'vitest'
import { skillSchema } from '@/features/skills/schema'
import { createSkill } from '@/features/skills/actions'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
vi.mock('@/lib/auth/admin',()=>({requireAdmin:vi.fn()}));vi.mock('@/lib/supabase/server',()=>({createClient:vi.fn()}))
it('validates skill/software entries',()=>{expect(skillSchema.safeParse({name:'After Effects',kind:'software',sortOrder:0,isVisible:true}).success).toBe(true);expect(skillSchema.safeParse({name:'',kind:'other',sortOrder:-1,isVisible:true}).success).toBe(false)})
it('does not create skill when caller is not admin',async()=>{vi.mocked(requireAdmin).mockRejectedValue(new Error('redirect'));const from=vi.fn();vi.mocked(createClient).mockResolvedValue({from} as never);const fd=new FormData();fd.set('name','AE');fd.set('kind','software');fd.set('sortOrder','0');fd.set('isVisible','on');await expect(createSkill(fd)).rejects.toThrow('redirect');expect(from).not.toHaveBeenCalled()})
