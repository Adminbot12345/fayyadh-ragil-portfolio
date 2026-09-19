# Fayyadh Ragil Al Qadri — Video Editor Portfolio

Dark-cinematic portfolio and admin dashboard for **Fayyadh Ragil Al Qadri**, **Video Editor & Motion Designer**. The public site highlights editing work, Reels/Instagram links, software/skills, and contact paths. `/admin` manages projects, publishing, ordering, showreel/profile settings, skills, and media without editing source code.

## Stack

- Next.js 16.3.3 App Router + React + TypeScript
- Tailwind CSS 4 + Motion for React
- Supabase PostgreSQL, Auth, Storage, RLS
- Vitest + Testing Library + Playwright
- pnpm 10

## 1. Requirements

Install Node.js 20.9+ (Node 22 recommended), pnpm 10, Docker Desktop for local Supabase, and the Supabase CLI. Then run:

```bash
pnpm install
```

## 2. Supabase setup

You may use a hosted Supabase project or local Supabase CLI.

### Local

```bash
pnpm dlx supabase@latest start
pnpm dlx supabase@latest db reset
pnpm dlx supabase@latest test db
```

The migrations create `admin_users`, `projects`, `site_settings`, `skills`, two public media buckets, Row Level Security policies, and an atomic project-reorder RPC. `supabase/seed.sql` adds Fayyadh's public identity, starter skills, and clearly labeled removable demo projects.

### Hosted

Create a Supabase project, apply the SQL migrations in order, then apply `supabase/seed.sql` if you want starter content.

## 3. Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Do **not** expose a Supabase service-role key to the browser. This app does not require one for normal operation; authorization is enforced with Supabase Auth + RLS + the `admin_users` allowlist.

## 4. Create the first admin

1. In Supabase Auth, create an email/password user.
2. Copy that user's UUID.
3. In the Supabase SQL editor run:

```sql
insert into public.admin_users (user_id)
values ('00000000-0000-0000-0000-000000000000');
```

Replace the example UUID above with the **actual Auth user UUID** before executing it.

Start the app:

```bash
pnpm dev
```

Visit `http://localhost:3000/admin/login` and sign in.

## 5. Portfolio workflow

From `/admin` you can:

- create, edit, delete, draft/publish, feature and preview projects;
- order projects with keyboard-accessible move up/down controls;
- upload thumbnail JPG/PNG/WebP files up to 10 MiB;
- upload MP4/WebM/QuickTime preview files up to 250 MiB;
- edit hero showreel/poster, profile image, bio, social links, CTA labels/targets;
- add, edit, hide and delete skills/software.

Videos at 100 MiB or above show a performance warning. Media replacement uploads the new object, persists its URL, and only then removes the old managed object. If persistence fails, the new upload is cleaned up and the old media is retained.

## 6. Instagram behavior

The site intentionally does **not** scrape Instagram. Add a project with its Instagram/Reel URL plus a custom thumbnail or local preview video. The public Instagram section stays stable even when Instagram embeds are unavailable.

## 7. Tests

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

For database policies:

```bash
pnpm dlx supabase@latest db reset
pnpm dlx supabase@latest test db
```

For browser tests:

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

Admin E2E tests require a **local/test Supabase project**, not production data. Configure:

```env
E2E_ADMIN_EMAIL=
E2E_ADMIN_PASSWORD=
E2E_NON_ADMIN_EMAIL=
E2E_NON_ADMIN_PASSWORD=
```

The non-admin account should be a valid Supabase Auth user that is not present in `public.admin_users`.

## 8. Deploy

### Vercel

Import the repository, set the three public environment variables above, and deploy. `vercel.json` declares the Next.js framework.

### Netlify

Import the repository. Netlify reads `netlify.toml` and runs `pnpm build`. Add the same environment variables in Site configuration. Modern Netlify supports Next.js through its platform adapter.

Set `NEXT_PUBLIC_SITE_URL` to the final production origin on either platform so sitemap entries use the correct domain.

## Browser notes

- Hero video uses `muted`, `playsInline`, `autoPlay`, `loop`, and a poster/fallback. Mobile browsers may still decline autoplay depending on power/data policies; the fallback keeps the hero readable.
- Project preview video is not mounted for every grid item. On pointer-capable desktop it mounts on hover intent; touch devices keep poster/fallback content and open the project by tap.
- All reveal motion honors `prefers-reduced-motion`.

## Personal details configured by default

- Name: Fayyadh Ragil Al Qadri
- Role: Video Editor & Motion Designer
- Instagram: `@fyyyyydhhhh`
- Email: `fayyadhragil@gmail.com`
- WhatsApp source: `081241226094` → public link `https://wa.me/6281241226094`
