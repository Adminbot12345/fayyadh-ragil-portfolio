import { requireAdmin } from '@/lib/auth/admin'
import { AdminShell } from '@/components/admin/admin-shell'
export const dynamic = 'force-dynamic'
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) { const admin=await requireAdmin(); return <AdminShell admin={admin}>{children}</AdminShell> }
