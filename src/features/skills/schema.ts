import { z } from 'zod'
const formBool=z.preprocess(v=>v===true||v==='true'||v==='on'||v==='1',z.boolean())
export const skillSchema=z.object({name:z.string().trim().min(1).max(80),kind:z.enum(['skill','software']),sortOrder:z.coerce.number().int().min(0).max(100000),isVisible:formBool})
