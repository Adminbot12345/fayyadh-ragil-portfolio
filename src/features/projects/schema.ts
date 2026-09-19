import { z } from 'zod'
import { PROJECT_CATEGORIES } from './types'

const optionalText = (max: number) => z.string().trim().max(max).transform(v => v === '' ? null : v)
export const optionalHttpUrl = z.string().trim().transform(v=>v===''?null:v).refine(value=>{
  if(value===null)return true
  try{const url=new URL(value); return url.protocol==='http:'||url.protocol==='https:'}catch{return false}
},'Use a valid http(s) URL')
const nullableYear = z.preprocess(v=>v===''||v===null||v===undefined?null:v,z.union([z.coerce.number().int().min(2000).max(2100),z.null()]))
const formBoolean = z.preprocess(v=>v===true||v==='true'||v==='on'||v==='1',z.boolean())

export const projectFormSchema=z.object({
  title:z.string().trim().min(2).max(120),
  slug:z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,'Use lowercase kebab-case'),
  description:z.string().trim().max(1000).default(''),
  category:z.enum(PROJECT_CATEGORIES),
  clientName:optionalText(120),
  year:nullableYear,
  thumbnailUrl:optionalHttpUrl,
  videoUrl:optionalHttpUrl,
  instagramUrl:optionalHttpUrl,
  externalUrl:optionalHttpUrl,
  sortOrder:z.coerce.number().int().min(0).max(100000),
  isFeatured:formBoolean,
  isPublished:formBoolean,
})
export type ProjectFormValues=z.infer<typeof projectFormSchema>
