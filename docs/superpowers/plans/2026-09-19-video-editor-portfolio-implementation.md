# Fayyadh Video Editor Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready dark-cinematic portfolio for Fayyadh Ragil Al Qadri with a Supabase-backed admin dashboard that manages projects, showreel/profile settings, skills, media, publishing, and ordering without source-code edits.

**Architecture:** Use a single Next.js 16.3.3 App Router application. Public pages are server-rendered from typed repository functions with graceful fallbacks; authenticated `/admin` routes use Supabase cookie-based SSR auth, a database-backed `admin_users` allowlist, Server Actions, and RLS. Supabase Storage holds public portfolio media while database records control what is surfaced publicly; animation is isolated to small client components using `motion` so the default site remains server-rendered and lightweight.

**Tech Stack:** Next.js 16.3.3, React, TypeScript, Tailwind CSS 4, Motion for React (`motion`), Supabase PostgreSQL/Auth/Storage with `@supabase/ssr`, Zod, Vitest + Testing Library, Playwright, pnpm.

**Spec:** `docs/superpowers/specs/2026-09-19-video-editor-portfolio-design.md`

## Global Constraints

- Public identity: **Fayyadh Ragil Al Qadri**.
- Public role: **Video Editor & Motion Designer**.
- Instagram handle: **@fyyyyydhhhh**.
- Instagram URL: `https://www.instagram.com/fyyyyydhhhh/`.
- Email: `fayyadhragil@gmail.com`.
- WhatsApp source number: `081241226094`; rendered links must normalize it to Indonesia international format (`6281241226094`).
- Public portfolio categories: `Video Editing`, `Motion Design`, `Reels / Short Form`, `Cinematic`, `Social Media`.
- Public visitors may read only projects with `is_published = true` through normal application access.
- Only allowlisted admin users may insert, update, delete, reorder, upload, or modify settings.
- Supabase service-role credentials must never be exposed to the browser.
- Offscreen media must lazy-load; project grids must not autoplay every video.
- Hero video is muted, loops, and falls back to a poster when autoplay or playback fails.
- Mobile behavior must not depend on hover.
- All meaningful motion must respect `prefers-reduced-motion`.
- Initial content may use clearly labeled removable demo projects; no fabricated client names, testimonials, awards, or employment history.
- Version 1 excludes multi-user teams, client accounts, payments, built-in messaging, advanced analytics, Instagram scraping/synchronization, and video transcoding.
- Use Next.js `proxy.ts` (not `middleware.ts`) because the target baseline is Next.js 16.3.3.
- Use Supabase `@supabase/ssr` cookie-based auth and validate authorization with verified identity (`getClaims()` / `getUser()`), never by trusting `getSession()` alone on the server.

## Review Focus

1. **Malformed or missing external URLs:** invalid Instagram/external URLs must be rejected in admin forms while optional empty URLs remain valid; add Zod/action tests in Task 8.
2. **Draft leakage:** a direct public lookup by slug must not return an unpublished project; add repository and integration coverage in Tasks 3 and 12.
3. **Interrupted media replacement:** failed uploads or failed database updates must leave the previous media URL intact and must not delete the old object; add media service tests in Task 9.
4. **Broken/autoplay-blocked media:** hero and project cards must preserve layout and show a poster/fallback instead of a blank region; add component tests in Tasks 4 and 5.
5. **Non-admin authenticated user:** a valid Supabase login that is not present in `admin_users` must be denied `/admin` and mutation actions; add auth/action tests in Tasks 7 and 8.

---

## File Structure

Create the following responsibility boundaries. Do not collapse these into one large page or action file.

```text
.
├─ src/
│  ├─ app/
│  │  ├─ (site)/
│  │  │  ├─ page.tsx                       # Public portfolio composition only
│  │  │  └─ work/[slug]/page.tsx           # Public project detail
│  │  ├─ admin/
│  │  │  ├─ layout.tsx                     # Admin auth gate + shell
│  │  │  ├─ page.tsx                       # Overview metrics
│  │  │  ├─ login/page.tsx                 # Email/password login screen
│  │  │  ├─ projects/
│  │  │  │  ├─ page.tsx                    # Project list/reorder surface
│  │  │  │  ├─ new/page.tsx                # New project form
│  │  │  │  └─ [id]/
│  │  │  │     ├─ edit/page.tsx            # Edit project form
│  │  │  │     └─ preview/page.tsx         # Authenticated draft preview
│  │  │  ├─ settings/page.tsx              # Hero/profile/social settings
│  │  │  └─ skills/page.tsx                # Skills/software management
│  │  ├─ globals.css                       # Theme tokens + grain + focus styles
│  │  ├─ layout.tsx                        # Root metadata, font, body
│  │  ├─ not-found.tsx                     # Public 404
│  │  ├─ robots.ts                         # Robots rules
│  │  └─ sitemap.ts                        # Public URLs only
│  ├─ components/
│  │  ├─ site/                             # Hero/nav/work/about/contact/footer
│  │  ├─ admin/                            # Dashboard forms/tables/upload controls
│  │  └─ ui/                               # Reusable Button/Field/MediaFallback
│  ├─ features/
│  │  ├─ projects/
│  │  │  ├─ schema.ts                      # Zod form/domain validation
│  │  │  ├─ repository.ts                  # Public/admin project queries
│  │  │  ├─ actions.ts                     # Server Actions for project mutations
│  │  │  └─ types.ts                       # Project domain types
│  │  ├─ settings/
│  │  │  ├─ schema.ts
│  │  │  ├─ repository.ts
│  │  │  └─ actions.ts
│  │  ├─ skills/
│  │  │  ├─ schema.ts
│  │  │  ├─ repository.ts
│  │  │  └─ actions.ts
│  │  └─ media/
│  │     ├─ validation.ts                  # Media type/size validation
│  │     └─ service.ts                     # Upload/replace/delete orchestration
│  ├─ lib/
│  │  ├─ auth/admin.ts                     # Verified admin authorization helper
│  │  ├─ contact.ts                        # WhatsApp/email/social URL helpers
│  │  ├─ site-defaults.ts                  # Safe public fallbacks
│  │  └─ supabase/
│  │     ├─ client.ts                      # Browser client
│  │     ├─ server.ts                      # Server client
│  │     └─ proxy.ts                       # Session refresh
│  └─ proxy.ts                             # Next.js 16 proxy entrypoint
├─ supabase/
│  ├─ migrations/
│  │  └─ 202609190001_portfolio.sql         # Tables, functions, RLS, storage policies
│  └─ seed.sql                             # Identity, skills, explicit demo projects
├─ tests/
│  ├─ unit/                                # Vitest unit/component tests
│  └─ e2e/                                 # Playwright journeys
├─ public/
│  ├─ fallback-project.svg
│  └─ og-default.svg
├─ .env.example
├─ playwright.config.ts
├─ vitest.config.ts
└─ package.json
```

---

### Task 1: Scaffold the Next.js application and test harness

**Files:**
- Create: `package.json`
- Create: `pnpm-lock.yaml` (generated)
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/(site)/page.tsx`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `tests/unit/app-shell.test.tsx`
- Create: `.env.example`
- Create: `.gitignore`

**Interfaces:**
- Consumes: Approved design specification only.
- Produces: A Next.js App Router project with `@/*` alias, Tailwind 4, Vitest, Testing Library, and environment variable names `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

- [ ] **Step 1: Write the failing app-shell test**

```tsx
// tests/unit/app-shell.test.tsx
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/(site)/page'

it('renders Fayyadh primary identity', () => {
  render(<HomePage />)
  expect(screen.getByRole('heading', { name: /fayyadh ragil al qadri/i })).toBeInTheDocument()
  expect(screen.getByText(/video editor & motion designer/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Bootstrap dependencies and verify the test initially fails**

Run:

```bash
pnpm init
pnpm add next@16.3.3 react react-dom @supabase/supabase-js @supabase/ssr zod motion
pnpm add -D typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss postcss eslint eslint-config-next vitest jsdom @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event vite-tsconfig-paths
pnpm vitest run tests/unit/app-shell.test.tsx
```

Expected: FAIL because the app files and Vitest config do not exist yet.

- [ ] **Step 3: Add scripts, TypeScript aliases, Tailwind 4, and minimal app shell**

Use these scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

Use Tailwind 4 in `src/app/globals.css`:

```css
@import "tailwindcss";

:root {
  color-scheme: dark;
  --background: #050505;
  --foreground: #f5f5f4;
  --muted: #a8a29e;
  --panel: rgba(255, 255, 255, 0.055);
  --border: rgba(255, 255, 255, 0.12);
}

html { scroll-behavior: smooth; background: var(--background); }
body { margin: 0; background: var(--background); color: var(--foreground); }
:focus-visible { outline: 2px solid #fafafa; outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

Use a minimal `src/app/(site)/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main>
      <h1>Fayyadh Ragil Al Qadri</h1>
      <p>Video Editor & Motion Designer</p>
    </main>
  )
}
```

- [ ] **Step 4: Configure Vitest and run baseline quality checks**

`vitest.config.ts` must use `jsdom`, `vite-tsconfig-paths`, React plugin, and `tests/setup.ts` importing `@testing-library/jest-dom/vitest`.

Run:

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

Expected: all commands PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml next.config.ts tsconfig.json postcss.config.mjs src tests vitest.config.ts .env.example .gitignore
git commit -m "chore: scaffold portfolio app"
```

---

### Task 2: Create the Supabase schema, RLS policies, storage buckets, and seed content

**Files:**
- Create: `supabase/migrations/202609190001_portfolio.sql`
- Create: `supabase/seed.sql`
- Create: `supabase/tests/portfolio_rls.test.sql`
- Modify: `package.json`

**Interfaces:**
- Consumes: Supabase Auth `auth.uid()`.
- Produces: Tables `admin_users`, `projects`, `site_settings`, `skills`; SQL function `public.is_admin()`; storage buckets `portfolio-images` and `portfolio-videos`; RLS contract used by all later repository/action tasks.

- [ ] **Step 1: Write pgTAP tests for public/draft/admin policy intent**

```sql
-- supabase/tests/portfolio_rls.test.sql
begin;
select plan(8);

select has_table('public', 'projects', 'projects table exists');
select has_table('public', 'site_settings', 'site_settings table exists');
select has_table('public', 'skills', 'skills table exists');
select has_table('public', 'admin_users', 'admin_users table exists');
select has_function('public', 'is_admin', array[]::text[], 'is_admin exists');
select col_is_unique('public', 'projects', 'slug', 'project slugs are unique');
select policies_are('public', 'projects', array['public_read_published_projects','admin_manage_projects'], 'project policies are exact');
select policies_are('public', 'admin_users', array['admin_read_self'], 'admin allowlist is not public');

select * from finish();
rollback;
```

- [ ] **Step 2: Run database test before migration exists**

Run:

```bash
pnpm dlx supabase@latest start
pnpm dlx supabase@latest test db
```

Expected: FAIL because the portfolio schema/policies do not exist.

- [ ] **Step 3: Implement schema, constraints, RLS, and storage policies**

`projects.category` must be constrained to the five approved category values. `site_settings` uses one fixed row ID (`00000000-0000-0000-0000-000000000001`) and adds `primary_cta_target` plus `secondary_cta_target` (defaults `#work` and `#contact`) because the approved admin requirements make CTA targets editable. `admin_users.user_id` references `auth.users(id)` with cascade delete.

Core authorization function:

```sql
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  );
$$;
```

Project policies:

```sql
create policy "public_read_published_projects"
on public.projects for select
to anon, authenticated
using (is_published = true or public.is_admin());

create policy "admin_manage_projects"
on public.projects for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
```

Storage write policies must require `public.is_admin()` and restrict objects to `portfolio-images` / `portfolio-videos`. Public read access may be enabled for those two buckets because project publication is controlled by database metadata; never store secrets in these buckets.

- [ ] **Step 4: Seed identity, skills, and clearly labeled removable demo projects**

Seed settings must contain exactly:

```text
Fayyadh Ragil Al Qadri
Video Editor & Motion Designer
https://www.instagram.com/fyyyyydhhhh/
081241226094
fayyadhragil@gmail.com
```

Seed project titles must contain `Demo Project` and descriptions must state they are replaceable placeholders. Leave `client_name` null.

- [ ] **Step 5: Reset local Supabase and run database tests**

```bash
pnpm dlx supabase@latest db reset
pnpm dlx supabase@latest test db
```

Expected: all pgTAP tests PASS.

- [ ] **Step 6: Commit**

```bash
git add supabase package.json pnpm-lock.yaml
git commit -m "feat: add portfolio database and RLS"
```

---

### Task 3: Add Supabase clients, domain types, defaults, and read repositories

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/site-defaults.ts`
- Create: `src/features/projects/types.ts`
- Create: `src/features/projects/repository.ts`
- Create: `src/features/settings/repository.ts`
- Create: `src/features/skills/repository.ts`
- Create: `tests/unit/repositories.test.ts`

**Interfaces:**
- Produces: `getPublishedProjects(): Promise<Project[]>`, `getPublishedProjectBySlug(slug: string): Promise<Project | null>`, `getAdminProjectById(id: string): Promise<Project | null>`, `getSiteSettings(): Promise<SiteSettings>`, `getVisibleSkills(): Promise<Skill[]>`.
- Produces domain types: `Project`, `SiteSettings`, `Skill`, `ProjectCategory`.
- Public repository failures return safe defaults (`[]`, `null`, `DEFAULT_SITE_SETTINGS`) instead of throwing into the public page.

- [ ] **Step 1: Write repository tests for ordering, fallback, and draft leakage**

```ts
it('returns only published projects ordered by sort_order', async () => {
  const rows = await getPublishedProjects()
  expect(rows.every((p) => p.isPublished)).toBe(true)
  expect(rows.map((p) => p.sortOrder)).toEqual([...rows.map((p) => p.sortOrder)].sort((a, b) => a - b))
})

it('returns null when a slug exists only as a draft', async () => {
  expect(await getPublishedProjectBySlug('private-draft')).toBeNull()
})

it('falls back to approved identity when settings query fails', async () => {
  expect((await getSiteSettings()).fullName).toBe('Fayyadh Ragil Al Qadri')
})
```

Use dependency injection or mocked Supabase clients so unit tests do not require network access.

- [ ] **Step 2: Run the repository tests and verify failure**

```bash
pnpm vitest run tests/unit/repositories.test.ts
```

Expected: FAIL because repository functions/types do not exist.

- [ ] **Step 3: Implement typed row mapping and public-safe repositories**

`Project` must expose camelCase properties while DB rows remain snake_case. Keep mapping inside `repository.ts` so UI components never know Supabase column names.

Use these category types:

```ts
export const PROJECT_CATEGORIES = [
  'Video Editing',
  'Motion Design',
  'Reels / Short Form',
  'Cinematic',
  'Social Media',
] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]
```

`DEFAULT_SITE_SETTINGS` must include the approved identity and contacts, with empty media URLs rather than invented assets. It must also set `primaryCtaTarget: '#work'` and `secondaryCtaTarget: '#contact'`.

Core repository shape:

```ts
export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
    if (error) throw error
    return (data ?? []).map(mapProjectRow)
  } catch {
    return []
  }
}

export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()
  if (error) return null
  return data ? mapProjectRow(data) : null
}
```

- [ ] **Step 4: Run tests and typecheck**

```bash
pnpm vitest run tests/unit/repositories.test.ts
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib src/features tests/unit/repositories.test.ts
git commit -m "feat: add typed portfolio repositories"
```

---

### Task 4: Build the public navigation and cinematic hero with media fallback

**Files:**
- Create: `src/components/site/site-nav.tsx`
- Create: `src/components/site/hero.tsx`
- Create: `src/components/site/hero-video.tsx`
- Create: `src/components/ui/media-fallback.tsx`
- Create: `src/lib/contact.ts`
- Modify: `src/app/(site)/page.tsx`
- Modify: `src/app/globals.css`
- Create: `tests/unit/contact.test.ts`
- Create: `tests/unit/hero.test.tsx`

**Interfaces:**
- Consumes: `SiteSettings` from Task 3.
- Produces: `normalizeWhatsApp(number: string): string`, `whatsAppHref(number: string): string`, `Hero({ settings }: { settings: SiteSettings })`.

- [ ] **Step 1: Write contact normalization and hero fallback tests**

```ts
expect(normalizeWhatsApp('081241226094')).toBe('6281241226094')
expect(whatsAppHref('081241226094')).toBe('https://wa.me/6281241226094')
```

```tsx
render(<Hero settings={{ ...DEFAULT_SITE_SETTINGS, heroVideoUrl: '', heroPosterUrl: '' }} />)
expect(screen.getByRole('heading', { name: 'Fayyadh Ragil Al Qadri' })).toBeVisible()
expect(screen.getByTestId('hero-fallback')).toBeVisible()
```

Also dispatch a video `error` event and assert the fallback becomes visible without removing the hero heading.

- [ ] **Step 2: Run tests to verify failure**

```bash
pnpm vitest run tests/unit/contact.test.ts tests/unit/hero.test.tsx
```

Expected: FAIL because contact helpers and hero do not exist.

- [ ] **Step 3: Implement hero behavior and semantic nav**

Hero requirements:
- `<video muted loop playsInline autoPlay preload="metadata">` only when a URL exists.
- Use poster when available.
- `onError` switches to `MediaFallback` while keeping fixed `min-height: 100svh`.
- Overlay exact name and role.
- `View My Work` links to `#work`; `Hire Me` links to `#contact`.
- Social links have accessible labels.
- Gradient/vignette/grain must not block pointer events.

Navigation links: `Home`, `Work`, `About`, `Instagram`, `Contact`. Mobile menu must be keyboard operable and use a real button with `aria-expanded`.

Core fallback behavior:

```tsx
'use client'

export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const [failed, setFailed] = useState(!src)
  if (failed) return <MediaFallback data-testid="hero-fallback" />
  return (
    <video
      data-testid="hero-video"
      src={src}
      poster={poster || undefined}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}
```

- [ ] **Step 4: Run component tests, lint, and typecheck**

```bash
pnpm vitest run tests/unit/contact.test.ts tests/unit/hero.test.tsx
pnpm lint
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components src/lib/contact.ts src/app tests/unit/contact.test.ts tests/unit/hero.test.tsx
git commit -m "feat: build cinematic hero and navigation"
```

---

### Task 5: Build Featured Work, filterable Selected Projects, project detail, and safe video previews

**Files:**
- Create: `src/components/site/featured-work.tsx`
- Create: `src/components/site/project-grid.tsx`
- Create: `src/components/site/project-card.tsx`
- Create: `src/components/site/project-preview.tsx`
- Create: `src/app/(site)/work/[slug]/page.tsx`
- Modify: `src/app/(site)/page.tsx`
- Create: `tests/unit/project-grid.test.tsx`
- Create: `tests/unit/project-preview.test.tsx`

**Interfaces:**
- Consumes: `Project[]`, `PROJECT_CATEGORIES`, `getPublishedProjectBySlug`.
- Produces: filter UI with `All` plus approved categories; `ProjectPreview` that plays only on pointer-capable hover and never requires hover on touch devices.

- [ ] **Step 1: Write failing filter and media-fallback tests**

```tsx
await user.click(screen.getByRole('button', { name: 'Motion Design' }))
expect(screen.getByText('Motion Demo')).toBeVisible()
expect(screen.queryByText('Cinematic Demo')).not.toBeInTheDocument()
```

```tsx
fireEvent.error(screen.getByTestId('project-video'))
expect(screen.getByTestId('project-media-fallback')).toBeVisible()
```

Add a reduced-motion case that verifies preview autoplay is disabled when `matchMedia('(prefers-reduced-motion: reduce)')` matches.

- [ ] **Step 2: Run the tests and verify failure**

```bash
pnpm vitest run tests/unit/project-grid.test.tsx tests/unit/project-preview.test.tsx
```

Expected: FAIL because gallery components do not exist.

- [ ] **Step 3: Implement the editorial gallery and detail route**

Rules:
- Featured section shows `isFeatured` projects first and respects `sortOrder`.
- Project grid filter state is client-side only; content comes from server props.
- Images use `next/image` with explicit sizes/aspect ratios.
- Preview video uses `preload="none"` until user intent, and stops/reset on pointer leave.
- Touch devices show poster plus a play/open affordance instead of hover behavior.
- Detail page uses `notFound()` when repository returns null, protecting draft slugs through normal app routing.
- Instagram/external project URLs render only when valid data exists.

Filter state stays isolated in the gallery client component:

```tsx
const [category, setCategory] = useState<'All' | ProjectCategory>('All')
const visible = category === 'All'
  ? projects
  : projects.filter((project) => project.category === category)

return visible.map((project) => <ProjectCard key={project.id} project={project} />)
```

Preview intent must guard reduced motion and pointer capability before calling `video.play()`; always catch the returned promise so browser autoplay rejection does not surface as an unhandled error.

- [ ] **Step 4: Run tests and a production build**

```bash
pnpm test
pnpm build
```

Expected: PASS and no hydration/layout errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/site src/app tests/unit/project-grid.test.tsx tests/unit/project-preview.test.tsx
git commit -m "feat: add portfolio work gallery"
```

---

### Task 6: Complete About, Instagram, Contact, Footer, SEO, sitemap, and accessibility baseline

**Files:**
- Create: `src/components/site/instagram-section.tsx`
- Create: `src/components/site/about-section.tsx`
- Create: `src/components/site/contact-section.tsx`
- Create: `src/components/site/site-footer.tsx`
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Create: `public/fallback-project.svg`
- Create: `public/og-default.svg`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/(site)/page.tsx`
- Create: `tests/unit/public-sections.test.tsx`

**Interfaces:**
- Consumes: `SiteSettings`, `Skill[]`, published `Project[]` with `instagramUrl`.
- Produces: complete public one-page portfolio composition and metadata title `Fayyadh Ragil Al Qadri — Video Editor & Motion Designer`.

- [ ] **Step 1: Write section accessibility/content tests**

Assert:
- Instagram section links to the approved profile.
- Contact section exposes email, WhatsApp, and Instagram links.
- About section renders visible skills only.
- There is one page-level `<h1>`.
- Contact links have descriptive accessible names.

- [ ] **Step 2: Run tests and verify failure**

```bash
pnpm vitest run tests/unit/public-sections.test.tsx
```

Expected: FAIL because sections do not exist.

- [ ] **Step 3: Implement public sections and metadata**

Instagram cards use custom project thumbnails/previews and a `View on Instagram` button; do not implement scraping or fragile mandatory embeds.

Compose the public page from server-fetched data, keeping the H1 only inside `Hero`:

```tsx
export default async function HomePage() {
  const [settings, projects, skills] = await Promise.all([
    getSiteSettings(),
    getPublishedProjects(),
    getVisibleSkills(),
  ])

  return (
    <main>
      <Hero settings={settings} />
      <FeaturedWork projects={projects.filter((p) => p.isFeatured)} />
      <ProjectGrid projects={projects} />
      <InstagramSection projects={projects.filter((p) => p.instagramUrl)} settings={settings} />
      <AboutSection settings={settings} skills={skills} />
      <ContactSection settings={settings} />
      <SiteFooter settings={settings} />
    </main>
  )
}
```

Root metadata must include:

```ts
export const metadata: Metadata = {
  title: 'Fayyadh Ragil Al Qadri — Video Editor & Motion Designer',
  description: 'Portfolio of Fayyadh Ragil Al Qadri, Video Editor & Motion Designer.',
  openGraph: {
    title: 'Fayyadh Ragil Al Qadri — Video Editor & Motion Designer',
    description: 'Selected video editing, motion design, cinematic, and short-form work.',
    images: ['/og-default.svg'],
  },
}
```

`sitemap.ts` must include only public site routes and published project slugs. `robots.ts` must disallow `/admin`.

- [ ] **Step 4: Run tests and quality checks**

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src public tests/unit/public-sections.test.tsx
git commit -m "feat: complete public portfolio sections"
```

---

### Task 7: Implement Supabase SSR session refresh, admin allowlist authorization, login, logout, and admin shell

**Files:**
- Create: `src/lib/supabase/proxy.ts`
- Create: `src/proxy.ts`
- Create: `src/lib/auth/admin.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/login/actions.ts`
- Create: `src/app/admin/layout.tsx`
- Create: `src/components/admin/admin-shell.tsx`
- Create: `src/components/admin/logout-button.tsx`
- Create: `tests/unit/admin-auth.test.ts`

**Interfaces:**
- Produces: `requireAdmin(): Promise<AdminIdentity>`, `getAdminIdentity(): Promise<AdminIdentity | null>`, `login(formData: FormData): Promise<LoginState>`, `logout(): Promise<void>`.
- `AdminIdentity` is `{ userId: string; email: string }`.

- [ ] **Step 1: Write authorization tests including non-admin authenticated user**

Cases:
1. No verified user -> `getAdminIdentity()` returns null.
2. Verified authenticated user absent from `admin_users` -> null.
3. Verified user present in `admin_users` -> identity returned.
4. `requireAdmin()` redirects to `/admin/login` for cases 1 and 2.

- [ ] **Step 2: Run auth tests and verify failure**

```bash
pnpm vitest run tests/unit/admin-auth.test.ts
```

Expected: FAIL because auth helpers do not exist.

- [ ] **Step 3: Implement Next.js 16 `proxy.ts` and verified admin helper**

`src/proxy.ts`:

```ts
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

`updateSession` must follow the current Supabase SSR cookie pattern and call `supabase.auth.getClaims()` to refresh/verify auth cookies. Authenticated routes must not use ISR caching.

`getAdminIdentity()` must verify the user and query `admin_users` for `auth.uid()`. Never infer admin status from email alone.

- [ ] **Step 4: Implement login/logout and admin shell**

Login uses `signInWithPassword({ email, password })`; after login, call `getAdminIdentity()`. If not allowlisted, immediately sign out and return `This account is not authorized for admin access.`

Admin layout must be `export const dynamic = 'force-dynamic'` and call `requireAdmin()` before rendering dashboard navigation.

Login action core:

```ts
'use server'

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const supabase = await createClient()
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, message: 'Invalid email or password.' }

  const admin = await getAdminIdentity()
  if (!admin) {
    await supabase.auth.signOut()
    return { ok: false, message: 'This account is not authorized for admin access.' }
  }
  redirect('/admin')
}
```

- [ ] **Step 5: Run tests and build**

```bash
pnpm vitest run tests/unit/admin-auth.test.ts
pnpm typecheck
pnpm build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/supabase src/lib/auth src/proxy.ts src/app/admin src/components/admin tests/unit/admin-auth.test.ts
git commit -m "feat: protect admin with Supabase auth"
```

---

### Task 8: Implement project validation, admin overview, CRUD, draft preview, publish toggles, and URL validation

**Files:**
- Create: `src/features/projects/schema.ts`
- Create: `src/features/projects/actions.ts`
- Modify: `src/features/projects/repository.ts`
- Create: `src/components/admin/project-form.tsx`
- Create: `src/components/admin/projects-table.tsx`
- Create: `src/components/admin/delete-project-button.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/projects/page.tsx`
- Create: `src/app/admin/projects/new/page.tsx`
- Create: `src/app/admin/projects/[id]/edit/page.tsx`
- Create: `src/app/admin/projects/[id]/preview/page.tsx`
- Create: `tests/unit/project-schema.test.ts`
- Create: `tests/unit/project-actions.test.ts`

**Interfaces:**
- Produces Zod `projectFormSchema` and actions `createProject`, `updateProject`, `deleteProject`, `setProjectPublished`, `setProjectFeatured`.
- All mutations call `requireAdmin()` before touching Supabase and return `{ ok: boolean; message: string; fieldErrors?: Record<string,string[]> }`.

- [ ] **Step 1: Write malformed URL, empty optional URL, and non-admin mutation tests**

```ts
expect(projectFormSchema.safeParse({ ...validProject, instagramUrl: '' }).success).toBe(true)
expect(projectFormSchema.safeParse({ ...validProject, instagramUrl: 'not-a-url' }).success).toBe(false)
expect(projectFormSchema.safeParse({ ...validProject, externalUrl: 'javascript:alert(1)' }).success).toBe(false)
```

Action test: mocked `requireAdmin()` rejection must prevent `insert`, `update`, or `delete` calls.

- [ ] **Step 2: Run tests and verify failure**

```bash
pnpm vitest run tests/unit/project-schema.test.ts tests/unit/project-actions.test.ts
```

Expected: FAIL because schema/actions do not exist.

- [ ] **Step 3: Implement project schema and safe Server Actions**

Schema rules:
- title 2..120 chars
- slug lowercase kebab-case, 2..120 chars
- description max 1000 chars, optional
- category enum from `PROJECT_CATEGORIES`
- clientName max 120 chars, optional
- year 2000..2100 or null
- thumbnailUrl/videoUrl/instagramUrl/externalUrl: empty string transforms to null; otherwise require `http:` or `https:` URLs
- sortOrder integer 0..100000
- booleans for featured/published

Every successful mutation calls `revalidatePath('/')` and `revalidatePath('/admin/projects')`.

Use one shared HTTP(S)-or-empty transform for external URLs:

```ts
const optionalHttpUrl = z
  .string()
  .trim()
  .transform((value) => value === '' ? null : value)
  .refine((value) => {
    if (value === null) return true
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }, 'Use a valid http(s) URL')

export const projectFormSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(2).max(120),
  category: z.enum(PROJECT_CATEGORIES),
  instagramUrl: optionalHttpUrl,
  externalUrl: optionalHttpUrl,
  thumbnailUrl: optionalHttpUrl,
  videoUrl: optionalHttpUrl,
  sortOrder: z.coerce.number().int().min(0).max(100000),
  isFeatured: z.coerce.boolean(),
  isPublished: z.coerce.boolean(),
})
```

Each action begins with `await requireAdmin()` before creating a Supabase client or performing a mutation.

- [ ] **Step 4: Implement admin overview/list/form/preview**

Overview shows total/published/draft/featured counts plus five most recently updated projects.

Delete requires a browser confirmation dialog before submitting the destructive action.

Preview route is admin-only and renders the project from `getAdminProjectById(id)` even when draft, using the same visual card/detail components where practical.

- [ ] **Step 5: Run tests and build**

```bash
pnpm vitest run tests/unit/project-schema.test.ts tests/unit/project-actions.test.ts
pnpm typecheck
pnpm build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/projects src/components/admin src/app/admin tests/unit/project-schema.test.ts tests/unit/project-actions.test.ts
git commit -m "feat: add admin project workflow"
```

---

### Task 9: Implement safe image/video validation and replacement uploads

**Files:**
- Create: `src/features/media/validation.ts`
- Create: `src/features/media/service.ts`
- Create: `src/components/admin/media-upload-field.tsx`
- Modify: `src/features/projects/actions.ts`
- Modify: `src/components/admin/project-form.tsx`
- Create: `tests/unit/media-validation.test.ts`
- Create: `tests/unit/media-service.test.ts`

**Interfaces:**
- Produces: `validateImageFile(file: File): ValidationResult`, `validateVideoFile(file: File): ValidationResult`, `replaceMedia(input: ReplaceMediaInput): Promise<ReplaceMediaResult>`.
- Allowed images: JPEG, PNG, WebP; maximum 10 MiB.
- Allowed videos: MP4, WebM, QuickTime; maximum 250 MiB; show a warning from 100 MiB upward.

- [ ] **Step 1: Write validation and interrupted-replacement tests**

Test exact rejection cases for unsupported MIME type and oversize files.

Replacement failure test must model:
1. old URL exists;
2. new upload succeeds;
3. database update fails;
4. newly uploaded object is cleaned up;
5. old object is **not** deleted;
6. returned result is `{ ok: false }`.

Also test upload failure: no database update and no deletion of the old object.

- [ ] **Step 2: Run tests and verify failure**

```bash
pnpm vitest run tests/unit/media-validation.test.ts tests/unit/media-service.test.ts
```

Expected: FAIL because media services do not exist.

- [ ] **Step 3: Implement validation and transactional-style replacement orchestration**

Order of operations in `replaceMedia`:
1. validate file;
2. upload new object with collision-safe path `${ownerId}/${crypto.randomUUID()}-${safeName}`;
3. call supplied `persistUrl(newPublicUrl)`;
4. only after persistence succeeds, delete the previous storage object if it belongs to the managed bucket;
5. if persistence fails, remove the newly uploaded object and keep previous media untouched.

Do not accept arbitrary bucket names from the client; select bucket server-side from media kind.

Core orchestration:

```ts
export async function replaceMedia(input: ReplaceMediaInput): Promise<ReplaceMediaResult> {
  const validation = input.kind === 'image'
    ? validateImageFile(input.file)
    : validateVideoFile(input.file)
  if (!validation.ok) return validation

  const bucket = input.kind === 'image' ? 'portfolio-images' : 'portfolio-videos'
  const newPath = `${input.ownerId}/${crypto.randomUUID()}-${safeFileName(input.file.name)}`
  const { error: uploadError } = await input.storage.from(bucket).upload(newPath, input.file)
  if (uploadError) return { ok: false, message: uploadError.message }

  const { data } = input.storage.from(bucket).getPublicUrl(newPath)
  const persisted = await input.persistUrl(data.publicUrl)
  if (!persisted.ok) {
    await input.storage.from(bucket).remove([newPath])
    return persisted
  }

  if (input.previousManagedPath) {
    await input.storage.from(bucket).remove([input.previousManagedPath])
  }
  return { ok: true, url: data.publicUrl }
}
```

- [ ] **Step 4: Integrate uploads into project form**

The UI must:
- show upload progress state text;
- show validation failures next to the field;
- show `Large video — consider an external host for faster delivery` at >=100 MiB;
- preserve current thumbnail/video URL until replacement succeeds;
- allow external video/Instagram URL as an alternative.

- [ ] **Step 5: Run tests and quality checks**

```bash
pnpm vitest run tests/unit/media-validation.test.ts tests/unit/media-service.test.ts
pnpm typecheck
pnpm build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/media src/components/admin src/features/projects tests/unit/media-*.test.ts
git commit -m "feat: add safe portfolio media uploads"
```

---

### Task 10: Add project reordering, homepage/profile/social settings, and skills/software management

**Files:**
- Create: `src/features/settings/schema.ts`
- Create: `src/features/settings/actions.ts`
- Modify: `src/features/settings/repository.ts`
- Create: `src/features/skills/schema.ts`
- Create: `src/features/skills/actions.ts`
- Modify: `src/features/skills/repository.ts`
- Modify: `src/features/projects/actions.ts`
- Create: `src/components/admin/settings-form.tsx`
- Create: `src/components/admin/skills-manager.tsx`
- Create: `src/components/admin/project-order-list.tsx`
- Create: `src/app/admin/settings/page.tsx`
- Create: `src/app/admin/skills/page.tsx`
- Modify: `src/components/admin/media-upload-field.tsx`
- Create: `tests/unit/settings-actions.test.ts`
- Create: `tests/unit/skills-actions.test.ts`
- Create: `tests/unit/reorder-projects.test.ts`

**Interfaces:**
- Produces: `updateSiteSettings`, `createSkill`, `updateSkill`, `deleteSkill`, `reorderProjects(orderedIds: string[])`.
- Reorder action writes contiguous `sort_order` values `0..n-1` for the exact submitted admin-visible set.

- [ ] **Step 1: Write settings/skills/reorder tests**

Settings tests verify:
- invalid email rejected;
- CTA targets reject `javascript:` and accept `#work`, `#contact`, or HTTP(S) URLs;
- Instagram must be HTTP(S);
- WhatsApp stores the editable source value but public link normalization remains in `contact.ts`;
- non-admin call performs no update.

Reorder tests verify duplicates or missing/unknown IDs are rejected rather than partially applied.

- [ ] **Step 2: Run tests and verify failure**

```bash
pnpm vitest run tests/unit/settings-actions.test.ts tests/unit/skills-actions.test.ts tests/unit/reorder-projects.test.ts
```

Expected: FAIL because actions are not implemented.

- [ ] **Step 3: Implement validated actions and admin pages**

Homepage/profile/social settings form edits:
- full name
- headline
- hero supporting text
- hero video/poster URL
- profile image URL
- bio
- Instagram URL
- WhatsApp number
- email
- primary/secondary CTA labels
- primary/secondary CTA targets (default `#work` and `#contact`; accept safe same-page anchors or HTTP(S) URLs)

The settings form also uses `MediaUploadField` + `replaceMedia` for hero showreel, hero poster, and profile image, so these assets can be changed from the dashboard rather than by manually pasting URLs. It includes a live unsaved preview panel for the hero/profile fields; project draft preview remains the full-route preview mechanism.

Skills manager supports name, `skill | software`, visibility, and ordering. It must not require code changes to add Premiere Pro, After Effects, DaVinci Resolve, CapCut, Photoshop, Motion Graphics, Color Grading, or future entries.

Reordering uses accessible move-up/move-down buttons as the guaranteed interaction; drag-and-drop may be added only if keyboard controls remain available.

CTA targets use a dedicated validator:

```ts
const ctaTarget = z.string().trim().refine((value) => {
  if (/^#[A-Za-z][\w:-]*$/.test(value)) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}, 'Use a section anchor or http(s) URL')
```

Before writing order changes, compare `new Set(orderedIds)` with the current admin-visible project IDs. Abort the entire action if there are duplicates, missing IDs, or unknown IDs; otherwise update all rows to contiguous `sort_order` values.

- [ ] **Step 4: Connect public page to updated settings and skills repositories**

After mutations, revalidate `/`, `/admin/settings`, `/admin/skills`, and `/admin/projects` where applicable.

- [ ] **Step 5: Run tests and build**

```bash
pnpm test
pnpm typecheck
pnpm build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features src/components/admin src/app/admin tests/unit/settings-actions.test.ts tests/unit/skills-actions.test.ts tests/unit/reorder-projects.test.ts
git commit -m "feat: manage portfolio settings and ordering"
```

---

### Task 11: Polish cinematic motion, performance, accessibility, and responsive behavior

**Files:**
- Create: `src/components/ui/reveal.tsx`
- Create: `src/components/ui/reduced-motion.tsx`
- Modify: `src/components/site/hero.tsx`
- Modify: `src/components/site/project-card.tsx`
- Modify: `src/components/site/about-section.tsx`
- Modify: `src/components/site/contact-section.tsx`
- Modify: `src/app/globals.css`
- Create: `tests/unit/reduced-motion.test.tsx`
- Create: `tests/unit/mobile-nav.test.tsx`

**Interfaces:**
- Produces animation wrappers that use `motion/react` only where motion adds value; all core content stays readable without JavaScript animation.

- [ ] **Step 1: Write reduced-motion and keyboard navigation tests**

Reduced-motion test verifies reveal components render final visible state without animated transforms.

Mobile-nav test verifies:
- menu button exposes `aria-expanded`;
- keyboard activation opens/closes menu;
- clicking a navigation item closes it;
- focus remains visible.

- [ ] **Step 2: Run tests and verify failure**

```bash
pnpm vitest run tests/unit/reduced-motion.test.tsx tests/unit/mobile-nav.test.tsx
```

Expected: FAIL until accessibility/motion helpers are implemented.

- [ ] **Step 3: Add restrained cinematic motion and responsive tuning**

Motion rules:
- opacity/translate reveals only;
- subtle card scale capped near 1.02;
- no infinite decorative animation for text;
- no custom cursor in version 1;
- reduced-motion bypasses transforms/transitions;
- mobile uses fewer animated elements and no hover-only behavior.

Use a small reusable reveal wrapper instead of spreading animation logic across sections:

```tsx
'use client'
import { motion, useReducedMotion } from 'motion/react'

export function Reveal({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

Performance rules:
- use `next/image` for raster images;
- define `sizes` for responsive images;
- hero video `preload="metadata"`, project preview `preload="none"`;
- do not mount playable videos for every offscreen project simultaneously;
- dynamic-import the client-only gallery/video preview if bundle analysis shows it materially reduces initial JS.

- [ ] **Step 4: Run full static quality suite**

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src tests/unit/reduced-motion.test.tsx tests/unit/mobile-nav.test.tsx
git commit -m "feat: polish responsive cinematic experience"
```

---

### Task 12: Add end-to-end coverage, deploy configuration, setup documentation, and final verification

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/public-portfolio.spec.ts`
- Create: `tests/e2e/admin-auth.spec.ts`
- Create: `tests/e2e/admin-projects.spec.ts`
- Create: `README.md`
- Create: `netlify.toml`
- Create: `vercel.json`
- Modify: `.env.example`
- Modify: `package.json`

**Interfaces:**
- Produces: reproducible local setup and deployment instructions for Vercel/Netlify; E2E suite exercising public pages and authenticated admin using a local/test Supabase project.

- [ ] **Step 1: Write public E2E tests including draft leakage and broken media layout**

```ts
import { test, expect } from '@playwright/test'

test('public portfolio exposes identity and contact paths', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Fayyadh Ragil Al Qadri' })).toBeVisible()
  await expect(page.getByRole('link', { name: /instagram/i })).toHaveAttribute('href', 'https://www.instagram.com/fyyyyydhhhh/')
  await expect(page.getByRole('link', { name: /whatsapp/i })).toHaveAttribute('href', 'https://wa.me/6281241226094')
})

test('draft project is not accessible through public route', async ({ page }) => {
  const response = await page.goto('/work/private-draft')
  expect(response?.status()).toBe(404)
})
```

Add viewport cases for desktop (`1440x900`) and mobile (`390x844`).

- [ ] **Step 2: Write admin E2E journeys**

Cover:
- unauthenticated `/admin` -> login;
- non-admin authenticated fixture -> denied;
- admin login/logout;
- create draft;
- preview draft;
- publish;
- edit;
- feature/unfeature;
- reorder;
- delete with confirmation;
- settings update;
- skill visibility update.

Use test-only seeded Supabase users. Never commit real passwords; load test credentials from environment variables `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`, `E2E_NON_ADMIN_EMAIL`, `E2E_NON_ADMIN_PASSWORD`.

- [ ] **Step 3: Configure Playwright and local test scripts**

Add scripts:

```json
{
  "test:all": "pnpm test && pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e",
  "supabase:start": "supabase start",
  "supabase:reset": "supabase db reset"
}
```

Install the browser test dependency first:

```bash
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```

Playwright `webServer` starts `pnpm dev` on `http://127.0.0.1:3000` and reuses the server outside CI.

- [ ] **Step 4: Write README setup and admin bootstrap procedure**

README must document:
1. Node.js 20.9+ and pnpm installation.
2. `pnpm install`.
3. Supabase project creation or local CLI start.
4. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
5. Apply migrations.
6. Create the first Supabase Auth email/password user.
7. Insert that user's UUID into `public.admin_users` using the SQL editor:

```sql
insert into public.admin_users (user_id)
values ('00000000-0000-0000-0000-000000000000');
```

The README must explicitly say to replace that example UUID with the actual Auth user UUID before executing it.
8. Run `pnpm dev`.
9. Visit `/admin/login`.
10. Configure environment variables on Vercel or Netlify; do not set a service-role key in browser-exposed variables.

- [ ] **Step 5: Add deployment configuration and execute complete verification**

Run:

```bash
pnpm dlx supabase@latest db reset
pnpm dlx supabase@latest test db
pnpm test
pnpm lint
pnpm typecheck
pnpm build
pnpm test:e2e
```

Expected:
- database tests PASS;
- unit/component tests PASS;
- lint PASS;
- typecheck PASS;
- production build PASS;
- E2E PASS on desktop and mobile projects.

Then manually inspect Chrome/Edge desktop and, where available, iOS Safari/Android browser for autoplay policy differences and touch behavior. Record any browser-specific limitation in `README.md` rather than hiding it.

- [ ] **Step 6: Commit**

```bash
git add README.md playwright.config.ts tests/e2e netlify.toml vercel.json .env.example package.json pnpm-lock.yaml
git commit -m "test: verify portfolio end to end"
```

---

## Implementation Order and Definition of Done

Execute Tasks 1 through 12 in order because later tasks consume interfaces established earlier. A task is complete only after its specified tests pass and its commit exists.

The implementation is complete when all of the following are true:

- public homepage renders the approved identity and dark-cinematic layout;
- hero showreel has poster/fallback behavior;
- Featured Work and category filtering work on desktop and touch devices;
- Instagram-linked work does not depend on scraping;
- About, software/skills, contact, footer, SEO, sitemap, and robots are present;
- `/admin` requires an allowlisted authenticated user;
- admin can create/edit/delete/reorder/feature/publish projects;
- draft project preview is available only to admin and public draft route returns 404;
- media replacement preserves old media on failures;
- hero/profile/social settings and skills are editable without code changes;
- WhatsApp renders to `https://wa.me/6281241226094` from the stored Indonesian number;
- reduced-motion and keyboard navigation work;
- unit, database, build, and Playwright suites all pass;
- project can be deployed to either Vercel or Netlify with only documented environment variables.
