import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { InstagramSection } from '@/components/site/instagram-section'
import { AboutSection } from '@/components/site/about-section'
import { ContactSection } from '@/components/site/contact-section'
import { DEFAULT_SITE_SETTINGS } from '@/lib/site-defaults'
import type { Project } from '@/features/projects/types'

const project: Project = { id:'1', title:'Reel', slug:'reel', description:'', category:'Reels / Short Form', clientName:null, year:2026, thumbnailUrl:null, videoUrl:null, instagramUrl:'https://www.instagram.com/p/demo/', externalUrl:null, isFeatured:false, isPublished:true, sortOrder:0, createdAt:'', updatedAt:'' }

it('exposes Instagram, email and WhatsApp contact paths', () => {
  render(<><InstagramSection projects={[project]} settings={DEFAULT_SITE_SETTINGS} /><ContactSection settings={DEFAULT_SITE_SETTINGS} /></>)
  expect(screen.getAllByRole('link', { name: /instagram/i }).length).toBeGreaterThan(0)
  expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute('href', 'mailto:fayyadhragil@gmail.com')
  expect(screen.getByRole('link', { name: /whatsapp/i })).toHaveAttribute('href', 'https://wa.me/6281241226094')
})

it('renders visible skills in about', () => {
  render(<AboutSection settings={DEFAULT_SITE_SETTINGS} skills={[{ id:'1', name:'After Effects', kind:'software', isVisible:true, sortOrder:0, createdAt:'', updatedAt:'' }]} />)
  expect(screen.getByText('After Effects')).toBeVisible()
})
