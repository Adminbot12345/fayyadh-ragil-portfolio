import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { ProjectPreview } from '@/components/site/project-preview'

function desktopMatchMedia(reduced = false) {
  vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({ matches: query.includes('prefers-reduced-motion') ? reduced : true, media: query, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
}

it('shows a fallback after preview media errors', () => {
  desktopMatchMedia(false)
  render(<ProjectPreview title="Demo" videoUrl="https://example.com/demo.mp4" thumbnailUrl={null} />)
  fireEvent.pointerEnter(screen.getByTestId('project-preview'))
  fireEvent.error(screen.getByTestId('project-video'))
  expect(screen.getByTestId('project-media-fallback')).toBeVisible()
})

it('does not start hover autoplay when reduced motion is requested', () => {
  desktopMatchMedia(true)
  const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
  render(<ProjectPreview title="Demo" videoUrl="https://example.com/demo.mp4" thumbnailUrl={null} />)
  fireEvent.pointerEnter(screen.getByTestId('project-preview'))
  expect(play).not.toHaveBeenCalled()
  play.mockRestore()
})
