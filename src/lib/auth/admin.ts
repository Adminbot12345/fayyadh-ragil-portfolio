import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AdminIdentity = { userId: string; email: string }

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getClaims()
    const claims = data?.claims as { sub?: string; email?: string } | undefined
    if (error || !claims?.sub) return null
    const { data: allowed, error: allowError } = await supabase.from('admin_users').select('user_id').eq('user_id', claims.sub).maybeSingle()
    if (allowError || !allowed) return null
    return { userId: claims.sub, email: claims.email ?? '' }
  } catch { return null }
}

export async function requireAdmin(): Promise<AdminIdentity> {
  const admin = await getAdminIdentity()
  if (!admin) redirect('/admin/login')
  return admin
}
