import { Hero } from '@/components/site/hero'
import { FeaturedWork } from '@/components/site/featured-work'
import { ProjectGrid } from '@/components/site/project-grid'
import { InstagramSection } from '@/components/site/instagram-section'
import { AboutSection } from '@/components/site/about-section'
import { ContactSection } from '@/components/site/contact-section'
import { SiteFooter } from '@/components/site/site-footer'
import { getPublishedProjects } from '@/features/projects/repository'
import { getSiteSettings } from '@/features/settings/repository'
import { getVisibleSkills } from '@/features/skills/repository'

export default async function HomePage() {
  const [settings, projects, skills] = await Promise.all([getSiteSettings(), getPublishedProjects(), getVisibleSkills()])
  return <main><Hero settings={settings}/><FeaturedWork projects={projects.filter(p=>p.isFeatured)}/><ProjectGrid projects={projects}/><InstagramSection projects={projects.filter(p=>p.instagramUrl)} settings={settings}/><AboutSection settings={settings} skills={skills}/><ContactSection settings={settings}/><SiteFooter settings={settings}/></main>
}
