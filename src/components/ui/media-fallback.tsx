import type { HTMLAttributes } from 'react'

export function MediaFallback({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`relative grid h-full min-h-56 place-items-center overflow-hidden bg-neutral-950 ${className}`} {...props}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.12),transparent_30%),linear-gradient(145deg,#111,#050505_65%)]" />
      <div className="relative flex items-center gap-3 text-xs uppercase tracking-[.22em] text-white/45">
        <span className="h-px w-8 bg-white/30" /> Selected work <span className="h-px w-8 bg-white/30" />
      </div>
    </div>
  )
}
