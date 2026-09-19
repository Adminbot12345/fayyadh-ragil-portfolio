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
