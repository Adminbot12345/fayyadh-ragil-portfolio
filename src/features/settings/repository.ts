import { createClient } from '@/lib/supabase/server'
import { DEFAULT_SITE_SETTINGS, SITE_SETTINGS_ID } from '@/lib/site-defaults'
import type { SiteSettings } from './types'

export function mapSettingsRow(row: any): SiteSettings {
  return {
    id: row.id,
    fullName: row.full_name,
    headline: row.headline,
    heroSupportingText: row.hero_supporting_text ?? '',
    heroVideoUrl: row.hero_video_url ?? '',
    heroPosterUrl: row.hero_poster_url ?? '',
    profileImageUrl: row.profile_image_url ?? '',
    bio: row.bio ?? '',
    instagramUrl: row.instagram_url,
    whatsappNumber: row.whatsapp_number,
    email: row.email,
    primaryCtaLabel: row.primary_cta_label ?? 'View My Work',
    primaryCtaTarget: row.primary_cta_target ?? '#work',
    secondaryCtaLabel: row.secondary_cta_label ?? 'Hire Me',
    secondaryCtaTarget: row.secondary_cta_target ?? '#contact',
    updatedAt: row.updated_at ?? '',
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', SITE_SETTINGS_ID).single()
    if (error || !data) return DEFAULT_SITE_SETTINGS
    return mapSettingsRow(data)
  } catch { return DEFAULT_SITE_SETTINGS }
}
