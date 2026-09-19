import { expect, it, vi } from 'vitest'
import { siteSettingsSchema } from '@/features/settings/schema'
import { updateSiteSettings } from '@/features/settings/actions'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
vi.mock('@/lib/auth/admin',()=>({requireAdmin:vi.fn()}));vi.mock('@/lib/supabase/server',()=>({createClient:vi.fn()}))
const base={fullName:'Fayyadh Ragil Al Qadri',headline:'Video Editor & Motion Designer',heroSupportingText:'hello',heroVideoUrl:'',heroPosterUrl:'',profileImageUrl:'',bio:'bio',instagramUrl:'https://instagram.com/fyyyyydhhhh',whatsappNumber:'081241226094',email:'fayyadhragil@gmail.com',primaryCtaLabel:'View My Work',primaryCtaTarget:'#work',secondaryCtaLabel:'Hire Me',secondaryCtaTarget:'#contact'}
it('rejects invalid email',()=>expect(siteSettingsSchema.safeParse({...base,email:'bad'}).success).toBe(false))
it('accepts safe anchors and rejects javascript CTA targets',()=>{expect(siteSettingsSchema.safeParse(base).success).toBe(true);expect(siteSettingsSchema.safeParse({...base,primaryCtaTarget:'javascript:alert(1)'}).success).toBe(false)})
it('requires http(s) Instagram URL',()=>expect(siteSettingsSchema.safeParse({...base,instagramUrl:'ftp://instagram.com/x'}).success).toBe(false))
it('does not update settings when caller is not admin',async()=>{vi.mocked(requireAdmin).mockRejectedValue(new Error('redirect'));const from=vi.fn();vi.mocked(createClient).mockResolvedValue({from} as never);const fd=new FormData();for(const [k,v] of Object.entries(base))fd.set(k,v);await expect(updateSiteSettings({ok:true,message:''},fd)).rejects.toThrow('redirect');expect(from).not.toHaveBeenCalled()})
