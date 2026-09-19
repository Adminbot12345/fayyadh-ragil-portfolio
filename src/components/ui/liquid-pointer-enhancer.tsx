'use client'

import { useEffect } from 'react'

export function LiquidPointerEnhancer() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onPointerMove = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>('.liquid-button, .liquid-card, .liquid-chip')
      if (!target) return
      const rect = target.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100
      target.style.setProperty('--liquid-x', `${Math.max(0, Math.min(100, x))}%`)
      target.style.setProperty('--liquid-y', `${Math.max(0, Math.min(100, y))}%`)
    }

    const onPointerOut = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>('.liquid-button, .liquid-card, .liquid-chip')
      if (!target) return
      const related = event.relatedTarget as Node | null
      if (related && target.contains(related)) return
      target.style.setProperty('--liquid-x', '50%')
      target.style.setProperty('--liquid-y', '18%')
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerout', onPointerOut, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerout', onPointerOut)
    }
  }, [])

  return null
}
