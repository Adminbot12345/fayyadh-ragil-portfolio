import { logout } from '@/app/admin/login/actions'
export function LogoutButton(){return <form action={logout}><button className="w-full rounded-xl border border-white/10 px-3 py-2 text-left text-sm text-white/60 hover:text-white">Log out</button></form>}
