export const PROJECT_CATEGORIES = [
  'Video Editing',
  'Motion Design',
  'Reels / Short Form',
  'Cinematic',
  'Social Media',
] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

export type Project = {
  id: string
  title: string
  slug: string
  description: string
  category: ProjectCategory
  clientName: string | null
  year: number | null
  thumbnailUrl: string | null
  videoUrl: string | null
  instagramUrl: string | null
  externalUrl: string | null
  isFeatured: boolean
  isPublished: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}
