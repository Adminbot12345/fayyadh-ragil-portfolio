import type { MetadataRoute } from 'next'
import { getPublishedProjects } from '@/features/projects/repository'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base=(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000').replace(/\/$/,'')
  const projects=await getPublishedProjects()
  return [{url:base,lastModified:new Date(),priority:1},...projects.map(p=>({url:`${base}/work/${p.slug}`,lastModified:p.updatedAt?new Date(p.updatedAt):new Date(),priority:.7}))]
}
