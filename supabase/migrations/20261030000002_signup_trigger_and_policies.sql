-- Migration: 20261030000002_signup_trigger_and_policies.sql
-- Description: Automatically create profile and seller/rider on signup + add self-registration RLS policies

-- 1. Additional RLS Policies for Self-Registration
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can insert own profile'
  ) then
    create policy "Users can insert own profile"
      on profiles for insert
      with check (id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can update own profile'
  ) then
    create policy "Users can update own profile"
      on profiles for update
      using (id = auth.uid() or current_user_role() in ('admin', 'ops'));
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'sellers' and policyname = 'Sellers can insert own record'
  ) then
    create policy "Sellers can insert own record"
      on sellers for insert
      with check (profile_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'riders' and policyname = 'Riders can insert own record'
  ) then
    create policy "Riders can insert own record"
      on riders for insert
      with check (profile_id = auth.uid());
  end if;
end $$;

-- 2. Function to automatically create profile and role record on signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  _role public.user_role;
  _full_name text;
  _phone text;
  _business_name text;
  _area text;
  _vehicle_type public.rider_vehicle_type;
begin
  -- Extract metadata safely with fallbacks
  begin
    _role := coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'seller'::public.user_role);
  exception when others then
    _role := 'seller'::public.user_role;
  end;

  _full_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  _phone := coalesce(new.raw_user_meta_data->>'phone', '');
  _business_name := coalesce(new.raw_user_meta_data->>'business_name', _full_name || ' Deliveries');
  _area := coalesce(new.raw_user_meta_data->>'area', 'Ikeja');
  
  begin
    _vehicle_type := coalesce((new.raw_user_meta_data->>'vehicle_type')::public.rider_vehicle_type, 'bike'::public.rider_vehicle_type);
  exception when others then
    _vehicle_type := 'bike'::public.rider_vehicle_type;
  end;

  -- Insert profile
  insert into public.profiles (id, role, full_name, phone, status)
  values (new.id, _role, _full_name, _phone, 'active')
  on conflict (id) do update set
    full_name = excluded.full_name,
    phone = excluded.phone;

  -- Insert specific role record
  if _role = 'seller' then
    insert into public.sellers (profile_id, business_name, phone, area)
    values (new.id, _business_name, _phone, _area)
    on conflict (profile_id) do update set
      business_name = excluded.business_name,
      phone = excluded.phone,
      area = excluded.area;
  elsif _role = 'rider' then
    insert into public.riders (profile_id, vehicle_type, status, current_zone)
    values (new.id, _vehicle_type, 'available', _area)
    on conflict (profile_id) do update set
      vehicle_type = excluded.vehicle_type,
      current_zone = excluded.current_zone;
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
