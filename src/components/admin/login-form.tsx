'use client'
import { useActionState } from 'react'
import { login, type LoginState } from '@/app/admin/login/actions'
const initial: LoginState={ok:true,message:''}
export function LoginForm(){ const [state, action, pending]=useActionState(login, initial); return <form action={action} className="mt-8 grid gap-4"><label className="grid gap-2 text-sm text-white/60">Email<input name="email" type="email" required className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"/></label><label className="grid gap-2 text-sm text-white/60">Password<input name="password" type="password" required className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none"/></label>{state.message&&<p role="alert" className="text-sm text-red-300">{state.message}</p>}<button disabled={pending} className="mt-2 rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:opacity-50">{pending?'Signing in…':'Sign in'}</button></form> }
