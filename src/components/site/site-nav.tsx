'use client'
import { useState } from 'react'

const links = [
  ['Home', '#home'], ['Work', '#work'], ['About', '#about'], ['Instagram', '#instagram'], ['Contact', '#contact'],
] as const

export function SiteNav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="nav-liquid absolute inset-x-0 top-0 z-40">
      <div className="site-shell flex h-20 items-center justify-between">
        <a href="#home" className="text-sm font-semibold tracking-[-.02em]">FAYYADH R.</a>
        <nav aria-label="Primary" className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          {links.map(([label, href]) => <a key={href} className="nav-liquid-link" href={href}>{label}</a>)}
        </nav>
        <button className="liquid-button px-4 py-2 text-xs uppercase tracking-[.18em] md:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(v => !v)}>Menu</button>
      </div>
      {open && <nav id="mobile-menu" aria-label="Mobile" className="site-shell liquid-card mb-4 grid rounded-[1.5rem] p-3 md:hidden">
        {links.map(([label, href]) => <a key={href} className="liquid-button my-1 justify-start px-4 py-3 text-lg" href={href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>}
    </header>
  )
}
