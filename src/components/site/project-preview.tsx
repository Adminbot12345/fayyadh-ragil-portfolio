'use client'
import Image from 'next/image'
import { useEffect,useRef,useState } from 'react'
import { MediaFallback } from '@/components/ui/media-fallback'

export function ProjectPreview({ title, videoUrl, thumbnailUrl }: { title: string; videoUrl: string | null; thumbnailUrl: string | null }) {
  const videoRef=useRef<HTMLVideoElement | null>(null);const[failed,setFailed]=useState(false);const[intent,setIntent]=useState(false)
  const canHoverPlay=()=>typeof window!=='undefined'&&window.matchMedia('(hover: hover) and (pointer: fine)').matches&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(()=>{if(intent&&videoRef.current)videoRef.current.play().catch(()=>undefined)},[intent])
  const start=()=>{if(videoUrl&&canHoverPlay())setIntent(true)};const stop=()=>{if(videoRef.current){videoRef.current.pause();videoRef.current.currentTime=0}setIntent(false)}
  if(failed||(!videoUrl&&!thumbnailUrl))return <MediaFallback data-testid="project-media-fallback" className="aspect-video"/>
  return <div data-testid="project-preview" className="relative aspect-video overflow-hidden bg-neutral-950" onPointerEnter={start} onPointerLeave={stop}>{thumbnailUrl&&<Image src={thumbnailUrl} alt={`${title} thumbnail`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" onError={()=>!videoUrl&&setFailed(true)}/>} {!thumbnailUrl&&!intent&&<MediaFallback className="absolute inset-0"/>}{videoUrl&&intent&&<video data-testid="project-video" ref={videoRef} src={videoUrl} poster={thumbnailUrl||undefined} muted loop playsInline preload="none" onError={()=>setFailed(true)} className="absolute inset-0 h-full w-full object-cover"/>}<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"/><span className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] uppercase tracking-[.16em] text-white/55 backdrop-blur md:hidden">Open</span></div>
}
