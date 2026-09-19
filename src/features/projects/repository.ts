import { createClient } from '@/lib/supabase/server'
import type { Project, ProjectCategory } from './types'

export function mapProjectRow(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? '',
    category: row.category as ProjectCategory,
    clientName: row.client_name ?? null,
    year: row.year ?? null,
    thumbnailUrl: row.thumbnail_url ?? null,
    videoUrl: row.video_url ?? null,
    instagramUrl: row.instagram_url ?? null,
    externalUrl: row.external_url ?? null,
    isFeatured: Boolean(row.is_featured),
    isPublished: Boolean(row.is_published),
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? '',
  }
}

export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('projects').select('*').eq('is_published', true).order('sort_order', { ascending: true })
    if (error) throw error
    return (data ?? []).map(mapProjectRow)
  } catch { return [] }
}

export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).eq('is_published', true).maybeSingle()
    if (error) return null
    return data ? mapProjectRow(data) : null
  } catch { return null }
}

export async function getAdminProjectById(id: string): Promise<Project | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle()
    if (error) return null
    return data ? mapProjectRow(data) : null
  } catch { return null }
}

export async function getAdminProjects(): Promise<Project[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapProjectRow)
}
