import { beforeEach, expect, it, vi } from 'vitest'
import { createClient } from '@/lib/supabase/server'
import { getAdminIdentity, requireAdmin } from '@/lib/auth/admin'
import { redirect } from 'next/navigation'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('next/navigation', () => ({ redirect: vi.fn(() => { throw new Error('redirected') }) }))
const mocked = vi.mocked(createClient)
function client({ sub, email, allow }: { sub?: string; email?: string; allow?: boolean }) { const query:any={select:vi.fn(()=>query),eq:vi.fn(()=>query),maybeSingle:vi.fn(async()=>({data:allow?{user_id:sub}:null,error:null}))}; return {auth:{getClaims:vi.fn(async()=>({data:{claims:sub?{sub,email}:null},error:null}))},from:vi.fn(()=>query)} }
beforeEach(() => vi.clearAllMocks())
it('returns null without a verified user',async()=>{mocked.mockResolvedValue(client({}) as never);expect(await getAdminIdentity()).toBeNull()})
it('returns null for authenticated non-admin',async()=>{mocked.mockResolvedValue(client({sub:'u1',email:'x@example.com',allow:false}) as never);expect(await getAdminIdentity()).toBeNull()})
it('returns identity for allowlisted admin',async()=>{mocked.mockResolvedValue(client({sub:'u1',email:'admin@example.com',allow:true}) as never);expect(await getAdminIdentity()).toEqual({userId:'u1',email:'admin@example.com'})})
it('requireAdmin redirects non-admin to login',async()=>{mocked.mockResolvedValue(client({sub:'u1',email:'x@example.com',allow:false}) as never);await expect(requireAdmin()).rejects.toThrow('redirected');expect(redirect).toHaveBeenCalledWith('/admin/login')})
