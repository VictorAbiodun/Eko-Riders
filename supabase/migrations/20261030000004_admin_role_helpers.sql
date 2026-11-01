-- ============================================================================
-- Eko-Riders Migration: Admin Role Helpers
-- Allows promoting any user to 'admin' easily in the Supabase SQL Editor
-- ============================================================================

create or replace function public.promote_to_admin(p_email text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid;
  _name text;
begin
  select id into _uid
  from auth.users
  where lower(trim(email)) = lower(trim(p_email))
  limit 1;

  if _uid is null then
    return 'User not found for email: ' || p_email || '. Make sure the user has created an account first.';
  end if;

  update public.profiles
  set role = 'admin'
  where id = _uid
  returning full_name into _name;

  return 'Success: ' || coalesce(_name, p_email) || ' (' || p_email || ') is now an Eko-Riders Administrator.';
end;
$$;

-- Allow executing the function from authenticated clients or postgres
grant execute on function public.promote_to_admin(text) to authenticated, anon;
