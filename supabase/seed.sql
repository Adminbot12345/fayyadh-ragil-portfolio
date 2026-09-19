insert into public.site_settings (
  id, full_name, headline, hero_supporting_text, instagram_url, whatsapp_number, email,
  primary_cta_label, primary_cta_target, secondary_cta_label, secondary_cta_target
) values (
  '00000000-0000-0000-0000-000000000001',
  'Fayyadh Ragil Al Qadri',
  'Video Editor & Motion Designer',
  'Cinematic edits, motion design, and short-form stories crafted with rhythm and intent.',
  'https://www.instagram.com/fyyyyydhhhh/',
  '081241226094',
  'fayyadhragil@gmail.com',
  'View My Work', '#work', 'Hire Me', '#contact'
) on conflict (id) do update set
  full_name = excluded.full_name,
  headline = excluded.headline,
  instagram_url = excluded.instagram_url,
  whatsapp_number = excluded.whatsapp_number,
  email = excluded.email;

insert into public.skills (name, kind, is_visible, sort_order) values
  ('Adobe Premiere Pro', 'software', true, 0),
  ('Adobe After Effects', 'software', true, 1),
  ('DaVinci Resolve', 'software', true, 2),
  ('CapCut', 'software', true, 3),
  ('Adobe Photoshop', 'software', true, 4),
  ('Motion Graphics', 'skill', true, 5),
  ('Color Grading', 'skill', true, 6),
  ('Short-form Editing', 'skill', true, 7);

insert into public.projects (
  title, slug, description, category, client_name, year, is_featured, is_published, sort_order
) values
  ('Demo Project — Cinematic Edit', 'demo-project-cinematic-edit', 'Replaceable demo project placeholder. Add your own edit from the admin dashboard.', 'Cinematic', null, 2026, true, true, 0),
  ('Demo Project — Motion Design', 'demo-project-motion-design', 'Replaceable demo project placeholder. Add your own motion design from the admin dashboard.', 'Motion Design', null, 2026, true, true, 1),
  ('Demo Project — Short Form', 'demo-project-short-form', 'Replaceable demo project placeholder. Add your own Reel or short-form edit from the admin dashboard.', 'Reels / Short Form', null, 2026, false, true, 2)
on conflict (slug) do nothing;
