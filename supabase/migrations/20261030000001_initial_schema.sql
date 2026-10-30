-- Migration: 20261030000001_initial_schema.sql
-- Description: Initial Eko Riders database schema with roles, profiles, sellers, riders, customers, orders, and order_events.
-- Rules: Integer kobo for money, RLS enabled on all tables, automated order numbers and timestamps.

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
create type user_role as enum ('admin', 'ops', 'seller', 'rider');
create type rider_vehicle_type as enum ('bike', 'bicycle', 'van');
create type rider_status as enum ('available', 'on_delivery', 'offline');
create type order_status as enum (
  'NEW',
  'CONFIRMED',
  'ASSIGNED',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'FAILED',
  'RETURNED'
);

-- Sequence for human-readable order numbers (ORD-000001)
create sequence if not exists order_number_seq start with 1 increment by 1;

-- Function: update updated_at timestamp
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 1. Profiles (linked to auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  full_name text not null,
  phone text not null,
  status text not null default 'active' check (status in ('pending_approval', 'active', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger tr_profiles_updated_at
  before update on profiles
  for each row execute function handle_updated_at();

-- 2. Sellers
create table sellers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  business_name text not null,
  phone text not null,
  area text not null default 'Ikeja',
  address text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger tr_sellers_updated_at
  before update on sellers
  for each row execute function handle_updated_at();

-- 3. Riders
create table riders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  vehicle_type rider_vehicle_type not null default 'bike',
  status rider_status not null default 'offline',
  current_zone text not null default 'Ikeja',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger tr_riders_updated_at
  before update on riders
  for each row execute function handle_updated_at();

-- 4. Customers (can be guest accounts created with orders)
create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  address text not null,
  area text not null,
  landmark text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger tr_customers_updated_at
  before update on customers
  for each row execute function handle_updated_at();

-- 5. Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('ORD-' || lpad(nextval('order_number_seq')::text, 6, '0')),
  tracking_token text not null unique default encode(gen_random_bytes(16), 'hex'),
  seller_id uuid not null references sellers(id) on delete restrict,
  customer_id uuid not null references customers(id) on delete restrict,
  rider_id uuid references riders(id) on delete set null,
  status order_status not null default 'NEW',
  product_description text not null,
  cod_amount_kobo bigint not null default 0 check (cod_amount_kobo >= 0),
  delivery_fee_kobo bigint not null default 0 check (delivery_fee_kobo >= 0),
  pickup_address text not null,
  dropoff_address text not null,
  dropoff_area text not null,
  dropoff_landmark text,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_seller_id on orders(seller_id);
create index idx_orders_rider_id on orders(rider_id);
create index idx_orders_status on orders(status);
create index idx_orders_tracking_token on orders(tracking_token);

create trigger tr_orders_updated_at
  before update on orders
  for each row execute function handle_updated_at();

-- 6. Order Events (append-only timeline)
create table order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  from_status order_status,
  to_status order_status not null,
  actor_id uuid references profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index idx_order_events_order_id on order_events(order_id);

-- Function: Automatically log order events and validate status transitions
create or replace function handle_order_status_change()
returns trigger as $$
begin
  -- Validate transition rules
  if tg_op = 'UPDATE' and old.status is distinct from new.status then
    -- Allowed transitions
    if not (
      (old.status = 'NEW' and new.status in ('CONFIRMED', 'FAILED')) or
      (old.status = 'CONFIRMED' and new.status in ('ASSIGNED', 'FAILED')) or
      (old.status = 'ASSIGNED' and new.status in ('PICKED_UP', 'CONFIRMED', 'FAILED')) or
      (old.status = 'PICKED_UP' and new.status in ('OUT_FOR_DELIVERY', 'FAILED')) or
      (old.status = 'OUT_FOR_DELIVERY' and new.status in ('DELIVERED', 'FAILED')) or
      (old.status = 'FAILED' and new.status = 'RETURNED')
    ) then
      raise exception 'Invalid order status transition from % to %', old.status, new.status;
    end if;

    -- Record event in timeline
    insert into order_events (order_id, from_status, to_status, actor_id, note)
    values (new.id, old.status, new.status, auth.uid(), new.failure_reason);
  elsif tg_op = 'INSERT' then
    insert into order_events (order_id, from_status, to_status, actor_id, note)
    values (new.id, null, new.status, auth.uid(), 'Order created');
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger tr_order_events_logger
  after insert or update on orders
  for each row execute function handle_order_status_change();

-- ─── ROW LEVEL SECURITY (RLS) ────────────────────────────────────────────────

alter table profiles enable row level security;
alter table sellers enable row level security;
alter table riders enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_events enable row level security;

-- Helper functions for RLS
create or replace function current_user_role()
returns user_role as $$
  select role from profiles where id = auth.uid();
$$ language sql stable security definer;

create or replace function current_seller_id()
returns uuid as $$
  select id from sellers where profile_id = auth.uid();
$$ language sql stable security definer;

create or replace function current_rider_id()
returns uuid as $$
  select id from riders where profile_id = auth.uid();
$$ language sql stable security definer;

-- Profiles Policies
create policy "Users can read own profile"
  on profiles for select
  using (id = auth.uid() or current_user_role() in ('admin', 'ops'));

create policy "Admins can update profiles"
  on profiles for update
  using (current_user_role() in ('admin', 'ops'));

-- Sellers Policies
create policy "Sellers can view own record, admins view all"
  on sellers for select
  using (profile_id = auth.uid() or current_user_role() in ('admin', 'ops'));

create policy "Sellers can update own profile"
  on sellers for update
  using (profile_id = auth.uid() or current_user_role() in ('admin', 'ops'));

-- Riders Policies
create policy "Riders can view own record, admins view all"
  on riders for select
  using (profile_id = auth.uid() or current_user_role() in ('admin', 'ops'));

create policy "Riders can update their status"
  on riders for update
  using (profile_id = auth.uid() or current_user_role() in ('admin', 'ops'));

-- Customers Policies
create policy "Admins and sellers can read customer details for their orders"
  on customers for select
  using (
    current_user_role() in ('admin', 'ops') or
    exists (
      select 1 from orders
      where orders.customer_id = customers.id
      and (orders.seller_id = current_seller_id() or orders.rider_id = current_rider_id())
    )
  );

create policy "Sellers and admins can insert customers"
  on customers for insert
  with check (current_user_role() in ('admin', 'ops', 'seller'));

-- Orders Policies
create policy "Admins and ops have full access to orders"
  on orders for all
  using (current_user_role() in ('admin', 'ops'));

create policy "Sellers can view their own orders"
  on orders for select
  using (seller_id = current_seller_id());

create policy "Sellers can create orders"
  on orders for insert
  with check (seller_id = current_seller_id());

create policy "Sellers can cancel orders before pickup"
  on orders for update
  using (seller_id = current_seller_id() and status in ('NEW', 'CONFIRMED'))
  with check (status = 'FAILED');

create policy "Riders can view assigned orders"
  on orders for select
  using (rider_id = current_rider_id());

create policy "Riders can update assigned order statuses"
  on orders for update
  using (rider_id = current_rider_id())
  with check (status in ('PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED'));

-- Public customer tracking policy via unguessable tracking token
create policy "Public can track order by token"
  on orders for select
  to anon
  using (true); -- filtered in public view/rpc to minimize exposed fields

-- Order Events Policies
create policy "Admins can view all events"
  on order_events for select
  using (current_user_role() in ('admin', 'ops'));

create policy "Sellers can view events for their orders"
  on order_events for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_events.order_id
      and orders.seller_id = current_seller_id()
    )
  );

create policy "Riders can view events for their assigned orders"
  on order_events for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_events.order_id
      and orders.rider_id = current_rider_id()
    )
  );
