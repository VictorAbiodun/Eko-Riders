-- Fix GoTrue "Database error querying schema" and enable Password Login
-- Run this in Supabase Dashboard -> SQL Editor

-- 1. Ensure pgcrypto extension is active
create extension if not exists "pgcrypto";

-- 2. Supabase GoTrue (Go backend) throws "Database error querying schema" 
-- when scanning NULL into string fields (confirmation_token, recovery_token, email_change, etc.).
-- We update all required columns to empty strings ('') and configure GoTrue metadata.
update auth.users
set 
  instance_id = '00000000-0000-0000-0000-000000000000',
  aud = 'authenticated',
  role = 'authenticated',
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  email_change = coalesce(email_change, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  phone_change = coalesce(phone_change, ''),
  phone_change_token = coalesce(phone_change_token, ''),
  reauthentication_token = coalesce(reauthentication_token, ''),
  is_super_admin = coalesce(is_super_admin, false),
  is_sso_user = coalesce(is_sso_user, false),
  is_anonymous = coalesce(is_anonymous, false),
  raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
  raw_user_meta_data = case 
    when email like 'adunni%' then '{"full_name":"Adunni Okafor"}'::jsonb
    when email like 'ibrahim%' then '{"full_name":"Ibrahim Musa"}'::jsonb
    when email like 'admin%' then '{"full_name":"Ops Admin"}'::jsonb
    else coalesce(raw_user_meta_data, '{}'::jsonb)
  end,
  encrypted_password = crypt('Password123!', gen_salt('bf')),
  updated_at = now()
where id in (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000012',
  '00000000-0000-0000-0000-000000000013',
  '00000000-0000-0000-0000-000000000021',
  '00000000-0000-0000-0000-000000000022',
  '00000000-0000-0000-0000-000000000023',
  '00000000-0000-0000-0000-000000000024',
  '00000000-0000-0000-0000-000000000025'
);

-- Ensure admin email is normalized
update auth.users
set email = 'admin@example.com'
where id = '00000000-0000-0000-0000-000000000001';

-- 3. Populate auth.identities (GoTrue requires an identity row for email provider login)
delete from auth.identities
where user_id in (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000012',
  '00000000-0000-0000-0000-000000000013',
  '00000000-0000-0000-0000-000000000021',
  '00000000-0000-0000-0000-000000000022',
  '00000000-0000-0000-0000-000000000023',
  '00000000-0000-0000-0000-000000000024',
  '00000000-0000-0000-0000-000000000025'
);

insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
select 
  u.id,
  u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
  'email',
  u.id::text,
  now(),
  now(),
  now()
from auth.users u
where u.id in (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000012',
  '00000000-0000-0000-0000-000000000013',
  '00000000-0000-0000-0000-000000000021',
  '00000000-0000-0000-0000-000000000022',
  '00000000-0000-0000-0000-000000000023',
  '00000000-0000-0000-0000-000000000024',
  '00000000-0000-0000-0000-000000000025'
);
