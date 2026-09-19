import { describe, expect, it } from 'vitest'
import { projectFormSchema } from '@/features/projects/schema'
const validProject={title:'Demo edit',slug:'demo-edit',description:'',category:'Cinematic',clientName:'',year:'2026',thumbnailUrl:'',videoUrl:'',instagramUrl:'',externalUrl:'',sortOrder:'0',isFeatured:false,isPublished:false}
describe('projectFormSchema',()=>{
  it('accepts empty optional URLs',()=>expect(projectFormSchema.safeParse(validProject).success).toBe(true))
  it('rejects malformed URL',()=>expect(projectFormSchema.safeParse({...validProject,instagramUrl:'not-a-url'}).success).toBe(false))
  it('rejects javascript URL',()=>expect(projectFormSchema.safeParse({...validProject,externalUrl:'javascript:alert(1)'}).success).toBe(false))
})
