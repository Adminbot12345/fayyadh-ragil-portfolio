'use client'
import { useState } from 'react'
import { MediaFallback } from '@/components/ui/media-fallback'

export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const [failed, setFailed] = useState(!src)
  if (failed) return <MediaFallback data-testid="hero-fallback" className="absolute inset-0 min-h-full" />
  return <video data-testid="hero-video" src={src} poster={poster || undefined} muted loop playsInline autoPlay preload="metadata" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
}
