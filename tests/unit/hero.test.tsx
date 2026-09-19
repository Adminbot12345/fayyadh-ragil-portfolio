import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Hero } from '@/components/site/hero'
import { DEFAULT_SITE_SETTINGS } from '@/lib/site-defaults'

it('keeps identity visible when no showreel exists', () => {
  render(<Hero settings={{ ...DEFAULT_SITE_SETTINGS, heroVideoUrl: '', heroPosterUrl: '' }} />)
  expect(screen.getByRole('heading', { name: 'Fayyadh Ragil Al Qadri' })).toBeVisible()
  expect(screen.getByTestId('hero-fallback')).toBeVisible()
})

it('falls back if the hero video fails', () => {
  render(<Hero settings={{ ...DEFAULT_SITE_SETTINGS, heroVideoUrl: 'https://example.com/showreel.mp4' }} />)
  fireEvent.error(screen.getByTestId('hero-video'))
  expect(screen.getByTestId('hero-fallback')).toBeVisible()
  expect(screen.getByRole('heading', { name: 'Fayyadh Ragil Al Qadri' })).toBeVisible()
})
