import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createClient } from '@/lib/supabase/server'
import { getPublishedProjectBySlug, getPublishedProjects } from '@/features/projects/repository'
import { getSiteSettings } from '@/features/settings/repository'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
const mockedCreateClient = vi.mocked(createClient)

function queryResult(data: unknown, error: unknown = null) {
  const chain: any = {
    select: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    order: vi.fn(async () => ({ data, error })),
    maybeSingle: vi.fn(async () => ({ data, error })),
  }
  return chain
}

describe('portfolio repositories', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns only published projects ordered by sort_order', async () => {
    const rows = [
      { id: '1', title: 'A', slug: 'a', description: '', category: 'Cinematic', client_name: null, year: 2026, thumbnail_url: null, video_url: null, instagram_url: null, external_url: null, is_featured: false, is_published: true, sort_order: 0, created_at: '', updated_at: '' },
      { id: '2', title: 'B', slug: 'b', description: '', category: 'Motion Design', client_name: null, year: 2026, thumbnail_url: null, video_url: null, instagram_url: null, external_url: null, is_featured: true, is_published: true, sort_order: 1, created_at: '', updated_at: '' },
    ]
    mockedCreateClient.mockResolvedValue({ from: vi.fn(() => queryResult(rows)) } as never)
    const projects = await getPublishedProjects()
    expect(projects.every((p) => p.isPublished)).toBe(true)
    expect(projects.map((p) => p.sortOrder)).toEqual([0, 1])
  })

  it('returns null when a slug exists only as a draft', async () => {
    mockedCreateClient.mockResolvedValue({ from: vi.fn(() => queryResult(null)) } as never)
    expect(await getPublishedProjectBySlug('private-draft')).toBeNull()
  })

  it('falls back to approved identity when settings query fails', async () => {
    const chain: any = { select: vi.fn(() => chain), eq: vi.fn(() => chain), single: vi.fn(async () => ({ data: null, error: new Error('offline') })) }
    mockedCreateClient.mockResolvedValue({ from: vi.fn(() => chain) } as never)
    expect((await getSiteSettings()).fullName).toBe('Fayyadh Ragil Al Qadri')
  })
})
