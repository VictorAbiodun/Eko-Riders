-- Seed Data for Eko Riders Local & Staging Development
-- Money amounts stored in integer KOBO (e.g., ₦12,500 = 1250000 kobo)

-- Enable pgcrypto
create extension if not exists "pgcrypto";

-- 1. Create auth users & profiles (Password: Password123!)
-- Admin
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
) values (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('Password123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name": "Ops Admin"}'::jsonb,
  false,
  now(),
  now()
) on conflict (id) do update set
  instance_id = excluded.instance_id,
  aud = excluded.aud,
  role = excluded.role,
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data;

insert into profiles (id, role, full_name, phone, status)
values (
  '00000000-0000-0000-0000-000000000001',
  'admin',
  'Ops Admin',
  '+2348000000001',
  'active'
) on conflict (id) do update set
  role = excluded.role,
  full_name = excluded.full_name;

-- Sellers
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
) values
  (
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'adunni@example.com',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name": "Adunni Okafor"}'::jsonb,
    false,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'emeka@example.com',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name": "Emeka Nwankwo"}'::jsonb,
    false,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'fatima@example.com',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name": "Fatima Bello"}'::jsonb,
    false,
    now(),
    now()
  )
on conflict (id) do update set
  instance_id = excluded.instance_id,
  aud = excluded.aud,
  role = excluded.role,
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data;

insert into profiles (id, role, full_name, phone, status)
values
  ('00000000-0000-0000-0000-000000000011', 'seller', 'Adunni Okafor', '+2348032214455', 'active'),
  ('00000000-0000-0000-0000-000000000012', 'seller', 'Emeka Nwankwo', '+2348029873344', 'active'),
  ('00000000-0000-0000-0000-000000000013', 'seller', 'Fatima Bello', '+2348095567788', 'active')
on conflict (id) do update set
  role = excluded.role,
  full_name = excluded.full_name;

insert into sellers (id, profile_id, business_name, phone, area, address, approved_at)
values
  ('11111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011', 'Adunni Fashion Hub', '+2348032214455', 'Lekki Phase 1', '14 Admiralty Way, Lekki', now()),
  ('11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000012', 'Emeka Electronics', '+2348029873344', 'Computer Village, Ikeja', '5 Pepple Street, Ikeja', now()),
  ('11111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000013', 'Halal Snacks NG', '+2348095567788', 'Yaba', '28 Commercial Ave, Yaba', now())
on conflict (id) do nothing;

-- Riders
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
) values
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'chidi@example.com', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name": "Chidi Okonkwo"}'::jsonb, false, now(), now()),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'blessing@example.com', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name": "Blessing Adeyemi"}'::jsonb, false, now(), now()),
  ('00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ibrahim@example.com', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name": "Ibrahim Musa"}'::jsonb, false, now(), now()),
  ('00000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'grace@example.com', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name": "Grace Etim"}'::jsonb, false, now(), now()),
  ('00000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tunde@example.com', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name": "Tunde Bakare"}'::jsonb, false, now(), now())
on conflict (id) do update set
  instance_id = excluded.instance_id,
  aud = excluded.aud,
  role = excluded.role,
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data;

insert into profiles (id, role, full_name, phone, status)
values
  ('00000000-0000-0000-0000-000000000021', 'rider', 'Chidi Okonkwo', '+2347013348899', 'active'),
  ('00000000-0000-0000-0000-000000000022', 'rider', 'Blessing Adeyemi', '+2347081125566', 'active'),
  ('00000000-0000-0000-0000-000000000023', 'rider', 'Ibrahim Musa', '+2348034459900', 'active'),
  ('00000000-0000-0000-0000-000000000024', 'rider', 'Grace Etim', '+2348167782233', 'active'),
  ('00000000-0000-0000-0000-000000000025', 'rider', 'Tunde Bakare', '+2349096671122', 'active')
on conflict (id) do update set
  role = excluded.role,
  full_name = excluded.full_name;

insert into riders (id, profile_id, vehicle_type, status, current_zone)
values
  ('22222222-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000021', 'bike', 'on_delivery', 'Lekki'),
  ('22222222-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000022', 'bike', 'available', 'Ikeja'),
  ('22222222-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000023', 'bicycle', 'on_delivery', 'Yaba'),
  ('22222222-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000024', 'bike', 'available', 'Surulere'),
  ('22222222-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000025', 'van', 'offline', 'Victoria Island')
on conflict (id) do nothing;

-- 2. Customers
insert into customers (id, name, phone, address, area, landmark)
values
  ('33333333-0000-0000-0000-000000000001', 'Ngozi Eze', '+2348021112233', '12 Admiralty Way, Lekki Phase 1', 'Lekki', 'Near Filmhouse'),
  ('33333333-0000-0000-0000-000000000002', 'Kunle Ajayi', '+2348034445566', '45 Herbert Macaulay Way, Yaba', 'Yaba', 'Opposite Ozone Cinema'),
  ('33333333-0000-0000-0000-000000000003', 'Amina Yusuf', '+2347018889900', '8 Allen Avenue, Ikeja', 'Ikeja', 'Beside Alausa Gate'),
  ('33333333-0000-0000-0000-000000000004', 'David Ogunleye', '+2348123334455', '22 Bode Thomas Street, Surulere', 'Surulere', 'Near Shitta'),
  ('33333333-0000-0000-0000-000000000005', 'Chioma Nwosu', '+2349012223344', '3 Ozumba Mbadiwe Ave, Victoria Island', 'Victoria Island', 'Next to Civic Centre')
on conflict (id) do nothing;

-- 3. Orders (Money in KOBO)
insert into orders (
  id,
  order_number,
  tracking_token,
  seller_id,
  customer_id,
  rider_id,
  status,
  product_description,
  cod_amount_kobo,
  delivery_fee_kobo,
  pickup_address,
  dropoff_address,
  dropoff_area,
  dropoff_landmark
) values
  (
    '44444444-0000-0000-0000-000000000001',
    'ORD-000001',
    'token-ord-000001-preview-test',
    '11111111-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000001',
    '22222222-0000-0000-0000-000000000001',
    'DELIVERED',
    'Ankara print wrap dress (Size M)',
    1850000, -- ₦18,500
    150000,  -- ₦1,500
    '14 Admiralty Way, Lekki Phase 1',
    '12 Admiralty Way, Lekki Phase 1, Lagos',
    'Lekki',
    'Near Filmhouse'
  ),
  (
    '44444444-0000-0000-0000-000000000002',
    'ORD-000002',
    'token-ord-000002-preview-test',
    '11111111-0000-0000-0000-000000000002',
    '33333333-0000-0000-0000-000000000002',
    '22222222-0000-0000-0000-000000000003',
    'OUT_FOR_DELIVERY',
    'Wireless earbuds + phone case bundle',
    3200000, -- ₦32,000
    120000,  -- ₦1,200
    '5 Pepple Street, Ikeja',
    '45 Herbert Macaulay Way, Yaba, Lagos',
    'Yaba',
    'Opposite Ozone Cinema'
  ),
  (
    '44444444-0000-0000-0000-000000000003',
    'ORD-000003',
    'token-ord-000003-preview-test',
    '11111111-0000-0000-0000-000000000003',
    '33333333-0000-0000-0000-000000000003',
    '22222222-0000-0000-0000-000000000002',
    'PICKED_UP',
    'Party snack platter (20 pcs)',
    850000, -- ₦8,500
    100000, -- ₦1,000
    '28 Commercial Ave, Yaba',
    '8 Allen Avenue, Ikeja, Lagos',
    'Ikeja',
    'Beside Alausa Gate'
  ),
  (
    '44444444-0000-0000-0000-000000000004',
    'ORD-000004',
    'token-ord-000004-preview-test',
    '11111111-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000004',
    '22222222-0000-0000-0000-000000000004',
    'ASSIGNED',
    'Men''s agbada (Custom fit)',
    4500000, -- ₦45,000
    180000,  -- ₦1,800
    '14 Admiralty Way, Lekki Phase 1',
    '22 Bode Thomas Street, Surulere, Lagos',
    'Surulere',
    'Near Shitta'
  ),
  (
    '44444444-0000-0000-0000-000000000005',
    'ORD-000005',
    'token-ord-000005-preview-test',
    '11111111-0000-0000-0000-000000000002',
    '33333333-0000-0000-0000-000000000005',
    null,
    'CONFIRMED',
    'USB-C hub 7-in-1',
    2200000, -- ₦22,000
    150000,  -- ₦1,500
    '5 Pepple Street, Ikeja',
    '3 Ozumba Mbadiwe Ave, Victoria Island, Lagos',
    'Victoria Island',
    'Next to Civic Centre'
  ),
  (
    '44444444-0000-0000-0000-000000000006',
    'ORD-000006',
    'token-ord-000006-preview-test',
    '11111111-0000-0000-0000-000000000003',
    '33333333-0000-0000-0000-000000000001',
    null,
    'NEW',
    'Suya spice kit (3-pack)',
    450000, -- ₦4,500
    120000, -- ₦1,200
    '28 Commercial Ave, Yaba',
    '12 Admiralty Way, Lekki Phase 1, Lagos',
    'Lekki',
    'Near Filmhouse'
  )
on conflict (id) do nothing;
