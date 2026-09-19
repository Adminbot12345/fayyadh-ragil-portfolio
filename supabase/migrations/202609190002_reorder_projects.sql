create or replace function public.reorder_projects(ordered_ids uuid[])
returns void language plpgsql security definer set search_path=public as $$
declare expected_count int; supplied_count int; unique_count int;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  select count(*) into expected_count from public.projects;
  supplied_count := coalesce(array_length(ordered_ids,1),0);
  select count(distinct x) into unique_count from unnest(ordered_ids) x;
  if supplied_count <> expected_count or unique_count <> expected_count then raise exception 'ordered_ids must contain every project exactly once'; end if;
  if exists(select 1 from unnest(ordered_ids) x left join public.projects p on p.id=x where p.id is null) then raise exception 'unknown project id'; end if;
  update public.projects p set sort_order=q.ord-1 from unnest(ordered_ids) with ordinality q(id,ord) where p.id=q.id;
end;$$;
revoke all on function public.reorder_projects(uuid[]) from public;
grant execute on function public.reorder_projects(uuid[]) to authenticated;
