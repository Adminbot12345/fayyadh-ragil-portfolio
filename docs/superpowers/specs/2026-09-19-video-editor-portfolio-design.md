# Fayyadh Ragil Al Qadri — Video Editor Portfolio Design

Date: 2026-09-19
Status: Approved design specification

## 1. Project Goal

Build a premium, dark-cinematic portfolio website for **Fayyadh Ragil Al Qadri**, branded publicly with Instagram handle **@fyyyyydhhhh**, positioning him as a **Video Editor & Motion Designer**.

The website serves two primary goals:

1. Attract freelance clients.
2. Present a professional portfolio suitable for work and internship applications.

The site must be easy to maintain without editing source code. A custom admin dashboard backed by Supabase will allow Fayyadh to add, edit, reorder, publish, feature, and remove portfolio work.

## 2. Brand and Visual Direction

### Visual style

- Dark cinematic aesthetic.
- Predominantly black / near-black background.
- Large editorial typography.
- Subtle glass / blur surfaces where appropriate.
- Soft gradients and vignettes over video content.
- Subtle film grain / noise texture.
- Premium animation rather than excessive neon or glitch effects.
- Strong emphasis on video content and project thumbnails.

### Motion language

- Smooth fade and reveal animations.
- Light parallax where it adds depth.
- Hover scale for project cards.
- Video-preview interactions on desktop.
- Reduced-motion support for accessibility.
- No excessive animation that harms readability or performance.

## 3. Public Website Structure

### 3.1 Navigation

Desktop navigation contains:

- Home
- Work
- About
- Instagram
- Contact

Mobile navigation collapses into a compact menu.

### 3.2 Hero

The first viewport is a fullscreen autoplaying muted loop showreel.

Overlay content:

- **Fayyadh Ragil Al Qadri**
- **Video Editor & Motion Designer**
- Primary CTA: **View My Work**
- Secondary CTA: **Hire Me**
- Quick social/contact links: Instagram, WhatsApp, Email

The hero video includes:

- Poster image fallback.
- Dark gradient overlay.
- Muted autoplay where browser rules allow it.
- Loop playback.
- Graceful fallback when video playback is blocked or unavailable.

### 3.3 Featured Work

A curated section showing the strongest work first.

Each featured project may show:

- Thumbnail / poster.
- Project title.
- Category.
- Year.
- Optional client name.
- Short description.
- Video preview.
- Link to project detail or external destination.

Desktop cards may play preview on hover. Mobile uses tap-based interaction and avoids expensive background autoplay.

### 3.4 Selected Projects

Portfolio grid with filterable categories:

- All
- Video Editing
- Motion Design
- Reels / Short Form
- Cinematic
- Social Media

The grid uses an editorial layout instead of a rigid identical-card arrangement. Featured or higher-priority work may occupy larger visual space.

### 3.5 Instagram Section

The Instagram section promotes **@fyyyyydhhhh** and showcases selected Reels or posts.

Because Instagram embeds and public scraping can be unreliable, projects are stored using:

- Instagram post / Reel URL.
- Custom thumbnail or poster.
- Optional locally hosted preview video.
- Button: **View on Instagram**.

This means the portfolio remains visually stable even if Instagram embeds fail.

### 3.6 About Section

Contains:

- Profile image.
- Short biography.
- Positioning as Video Editor & Motion Designer.
- Skill summary.
- Software list.

Initial software/skill examples may include:

- Adobe Premiere Pro
- Adobe After Effects
- DaVinci Resolve
- CapCut
- Adobe Photoshop
- Motion Graphics
- Color Grading
- Short-form Editing

These values remain editable through the admin dashboard.

### 3.7 Contact CTA

Large closing call-to-action:

> Have a project in mind?  
> Let’s create something worth watching.

Contact methods:

- Email: fayyadhragil@gmail.com
- Instagram: https://www.instagram.com/fyyyyydhhhh/
- WhatsApp: 081241226094

WhatsApp links should be normalized to the international Indonesia format when rendered as a clickable link.

### 3.8 Footer

Contains:

- Name / brand.
- Role.
- Instagram.
- Email.
- WhatsApp.
- Copyright year.

## 4. Admin Dashboard

Admin route: `/admin`

Access requires authentication.

### 4.1 Overview

Dashboard summary includes:

- Total projects.
- Published projects.
- Draft projects.
- Featured projects.
- Recent project updates.

### 4.2 Projects Management

Admin can:

- Create project.
- Edit project.
- Delete project.
- Save as draft.
- Publish / unpublish.
- Mark / unmark as featured.
- Reorder projects.
- Upload thumbnail.
- Upload preview video.
- Set Instagram / external URLs.

Project form fields:

- Title
- Slug
- Short description
- Category
- Client name
- Year
- Thumbnail
- Video
- Instagram URL
- External project URL
- Featured toggle
- Published toggle
- Sort order

### 4.3 Homepage Settings

Admin can edit:

- Hero showreel.
- Hero poster.
- Name.
- Headline.
- Hero supporting text.
- CTA labels / targets.

### 4.4 Profile Settings

Admin can edit:

- Profile image.
- Biography.
- Skills.
- Software.

### 4.5 Social Links

Admin can edit:

- Instagram URL.
- WhatsApp number.
- Email address.

### 4.6 Preview

Admin can preview changes before publishing whenever practical.

## 5. Technology Architecture

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend and data

- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage

### Deployment

The frontend should remain compatible with Vercel and Netlify.

### Media strategy

Supabase Storage is used for:

- Profile image.
- Project thumbnails.
- Hero poster.
- Light or moderate-size videos.

For large production video libraries, the architecture should allow a later migration of video media to Cloudinary or Cloudflare R2 without requiring a rewrite of the portfolio data model.

## 6. Database Design

### 6.1 `projects`

Fields:

- `id` UUID primary key
- `title` text
- `slug` text unique
- `description` text nullable
- `category` text
- `client_name` text nullable
- `year` integer nullable
- `thumbnail_url` text nullable
- `video_url` text nullable
- `instagram_url` text nullable
- `external_url` text nullable
- `is_featured` boolean default false
- `is_published` boolean default false
- `sort_order` integer default 0
- `created_at` timestamp
- `updated_at` timestamp

### 6.2 `site_settings`

Single active settings record containing:

- `id`
- `full_name`
- `headline`
- `hero_description`
- `bio`
- `hero_video_url`
- `hero_poster_url`
- `profile_image_url`
- `instagram_url`
- `whatsapp_number`
- `email`
- `primary_cta_label`
- `secondary_cta_label`
- `updated_at`

### 6.3 `skills`

Fields:

- `id`
- `name`
- `type` (`skill` or `software`)
- `sort_order`
- `is_visible`

## 7. Authentication and Authorization

### Authentication

- Supabase Auth using email + password.
- `/admin` protected by authenticated session checks.
- Login and logout supported.

### Authorization

Row Level Security must enforce:

- Public visitors can only read projects where `is_published = true`.
- Public visitors can read public site settings and visible skills.
- Only authorized admin users can insert, update, or delete projects and settings.

### Key handling

- Public Supabase anon key may be used client-side with RLS enabled.
- Supabase service role key must never be exposed to the browser.
- Secrets are stored in deployment environment variables.

## 8. Media Upload Flow

### Thumbnail / image upload

1. Admin selects file.
2. Client validates type and size.
3. File uploads to Supabase Storage.
4. Public or signed URL is generated according to bucket policy.
5. Project record stores the URL.
6. Old media is deleted only after the new upload and database update succeed.

### Video upload

Same flow as images, with stricter size and type validation.

Admin should be warned when a video is unusually large.

### External video / Instagram flow

Instead of upload, admin may enter an external URL. A custom thumbnail is still recommended so the design does not rely on third-party embed availability.

## 9. Error Handling

### Upload failure

- Keep previous media intact.
- Display clear error feedback.
- Allow retry.

### Missing thumbnail or broken video

- Show fallback visual.
- Preserve layout dimensions.
- Do not cause blank cards or broken sections.

### Instagram embed failure

- Show custom thumbnail.
- Keep project title and metadata visible.
- Keep **View on Instagram** button available.

### Database failure

- Public UI should fail gracefully rather than render an empty or broken page.
- Admin should receive actionable error feedback.

### Delete confirmation

Project deletion requires confirmation before destructive action.

## 10. Performance Requirements

- Lazy-load offscreen media.
- Do not autoplay all project videos at once.
- Prioritize hero poster / hero asset only where useful.
- Use optimized image formats and responsive images.
- Use poster images before video starts.
- Use dynamic import for heavier interactive components where beneficial.
- Avoid layout shift by defining media aspect ratios.
- Respect `prefers-reduced-motion`.
- Mobile experience should prioritize performance over decorative animation.

## 11. Responsive Behaviour

### Desktop

- Full cinematic hero.
- Larger editorial project grid.
- Hover previews.
- Persistent navigation.

### Tablet

- Reduced grid columns.
- Lighter motion.
- Touch-safe controls.

### Mobile

- Single-column or compact two-column content where appropriate.
- No hover-dependent functionality.
- Compact navigation menu.
- Reduced video loading.
- Large touch targets for CTAs.

## 12. Accessibility

- Semantic HTML.
- Keyboard accessible navigation and admin controls.
- Visible focus states.
- Sufficient text contrast.
- Alt text for meaningful images.
- Reduced-motion support.
- Buttons and links have descriptive accessible labels.

## 13. SEO and Sharing

The website should include:

- Page title and description.
- Open Graph metadata.
- Social preview image.
- Canonical URL support.
- Semantic heading structure.
- Basic sitemap / robots configuration.

Primary title direction:

**Fayyadh Ragil Al Qadri — Video Editor & Motion Designer**

## 14. Testing Scope

### Public website

Test:

- Hero showreel.
- Poster fallback.
- Project filters.
- Featured work.
- Project cards.
- Instagram links.
- Email CTA.
- WhatsApp CTA.
- Responsive navigation.
- Missing media fallback.

### Admin

Test:

- Login.
- Logout.
- Protected-route access.
- Create project.
- Edit project.
- Delete project.
- Draft / published states.
- Featured toggle.
- Upload thumbnail.
- Upload video.
- Reorder projects.
- Settings update.
- Skills update.

### Browsers / devices

Verify on:

- Chrome desktop.
- Edge desktop.
- Safari where available.
- Android mobile browser.
- iPhone / iOS Safari where available.

## 15. Initial Seed Content

Initial implementation may include removable sample projects so the site is visually complete before real portfolio media is uploaded.

Default identity settings:

- Name: Fayyadh Ragil Al Qadri
- Role: Video Editor & Motion Designer
- Instagram: @fyyyyydhhhh
- Instagram URL: https://www.instagram.com/fyyyyydhhhh/
- Email: fayyadhragil@gmail.com
- WhatsApp: 081241226094

No fabricated client names, testimonials, awards, or work history should be presented as real content.

## 16. Scope Boundaries for Version 1

Included in version 1:

- Public portfolio.
- Hero showreel.
- Featured / selected work.
- Instagram-linked projects.
- About / skills / software.
- Contact links.
- Custom admin dashboard.
- Supabase Auth.
- Supabase database.
- Supabase media storage.
- Draft / publish workflow.
- Responsive design.

Not required for version 1:

- Multi-user teams.
- Client accounts.
- Payments.
- Built-in messaging.
- Advanced analytics dashboard.
- Automatic Instagram scraping.
- Automatic social synchronization.
- Full video transcoding pipeline.

These can be added later without changing the core portfolio concept.

## 17. Success Criteria

The project is successful when:

1. Fayyadh can update portfolio projects from `/admin` without changing code.
2. The public site clearly presents him as a professional Video Editor & Motion Designer.
3. Featured work is the primary visual focus.
4. Instagram work can be included reliably without depending on scraping.
5. Visitors can contact him through WhatsApp, Instagram, or email.
6. The site works cleanly on desktop and mobile.
7. Media failures do not break the layout.
8. Unpublished projects remain inaccessible to public visitors through normal application access.
9. The design remains cinematic while maintaining readable content and acceptable loading performance.
