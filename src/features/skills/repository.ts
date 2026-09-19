import { createClient } from '@/lib/supabase/server'
import type { Skill, SkillKind } from './types'

export function mapSkillRow(row: any): Skill {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind as SkillKind,
    isVisible: Boolean(row.is_visible),
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? '',
  }
}

export async function getVisibleSkills(): Promise<Skill[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('skills').select('*').eq('is_visible', true).order('sort_order', { ascending: true })
    if (error) throw error
    return (data ?? []).map(mapSkillRow)
  } catch { return [] }
}

export async function getAdminSkills(): Promise<Skill[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('skills').select('*').order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapSkillRow)
}
