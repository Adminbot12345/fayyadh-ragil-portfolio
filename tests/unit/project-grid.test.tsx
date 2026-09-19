import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { ProjectGrid } from '@/components/site/project-grid'
import type { Project } from '@/features/projects/types'

const base = { description: '', clientName: null, year: 2026, thumbnailUrl: null, videoUrl: null, instagramUrl: null, externalUrl: null, isFeatured: false, isPublished: true, sortOrder: 0, createdAt: '', updatedAt: '' }
const projects: Project[] = [
  { ...base, id: '1', slug: 'motion-demo', title: 'Motion Demo', category: 'Motion Design' },
  { ...base, id: '2', slug: 'cinematic-demo', title: 'Cinematic Demo', category: 'Cinematic', sortOrder: 1 },
]

it('filters selected projects by category', async () => {
  const user = userEvent.setup()
  render(<ProjectGrid projects={projects} />)
  await user.click(screen.getByRole('button', { name: 'Motion Design' }))
  expect(screen.getByText('Motion Demo')).toBeVisible()
  expect(screen.queryByText('Cinematic Demo')).not.toBeInTheDocument()
})
