'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAdminIdentity } from '@/lib/auth/admin'
export type LoginState = { ok: boolean; message: string }
export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const supabase=await createClient(); const email=String(formData.get('email')??'').trim(); const password=String(formData.get('password')??'')
  const { error }=await supabase.auth.signInWithPassword({ email, password }); if(error) return { ok:false, message:'Invalid email or password.' }
  const admin=await getAdminIdentity(); if(!admin){ await supabase.auth.signOut(); return { ok:false, message:'This account is not authorized for admin access.' } }
  redirect('/admin')
}
export async function logout(): Promise<void> { const supabase=await createClient(); await supabase.auth.signOut(); redirect('/admin/login') }
