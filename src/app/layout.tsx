import type { Metadata } from 'next'
import './globals.css'
import { LiquidPointerEnhancer } from '@/components/ui/liquid-pointer-enhancer'

export const metadata: Metadata = {
  title: 'Fayyadh Ragil Al Qadri — Video Editor & Motion Designer',
  description: 'Portfolio of Fayyadh Ragil Al Qadri, Video Editor & Motion Designer.',
  openGraph: {
    title: 'Fayyadh Ragil Al Qadri — Video Editor & Motion Designer',
    description: 'Selected video editing, motion design, cinematic, and short-form work.',
    images: ['/og-default.svg'],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><LiquidPointerEnhancer />{children}</body>
    </html>
  )
}
