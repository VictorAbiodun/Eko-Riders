-- Migration: 20261030000003_orders_api_and_tracking.sql
-- Description: RPC functions for atomic order creation, status transitions, and public customer tracking

-- 1. Function for public customer parcel tracking by order number or token
create or replace function public.get_tracking_order(p_query text)
returns table (
  order_id uuid,
  order_number text,
  tracking_token text,
  status public.order_status,
  product_description text,
  cod_amount_kobo bigint,
  delivery_fee_kobo bigint,
  pickup_address text,
  dropoff_address text,
  dropoff_area text,
  created_at timestamptz,
  seller_business_name text,
  customer_name text,
  customer_phone text,
  rider_name text,
  rider_phone text
) as $$
  select
    o.id as order_id,
    o.order_number,
    o.tracking_token,
    o.status,
    o.product_description,
    o.cod_amount_kobo,
    o.delivery_fee_kobo,
    o.pickup_address,
    o.dropoff_address,
    o.dropoff_area,
    o.created_at,
    coalesce(s.business_name, 'Merchant') as seller_business_name,
    coalesce(c.name, 'Customer') as customer_name,
    coalesce(c.phone, '') as customer_phone,
    coalesce(rp.full_name, null) as rider_name,
    coalesce(rp.phone, null) as rider_phone
  from orders o
  left join sellers s on o.seller_id = s.id
  left join customers c on o.customer_id = c.id
  left join riders r on o.rider_id = r.id
  left join profiles rp on r.profile_id = rp.id
  where o.order_number ilike p_query or o.tracking_token = p_query
  limit 1;
$$ language sql stable security definer;

-- 2. Atomic Order Creation for Sellers
create or replace function public.create_seller_order(
  p_customer_name text,
  p_customer_phone text,
  p_customer_address text,
  p_dropoff_area text,
  p_product_description text,
  p_cod_amount_kobo bigint,
  p_delivery_fee_kobo bigint
)
returns jsonb as $$
declare
  _seller_id uuid;
  _pickup_address text;
  _customer_id uuid;
  _order_id uuid;
  _order_number text;
  _tracking_token text;
begin
  -- 1. Identify active seller
  select id, coalesce(address, area || ', Lagos')
  into _seller_id, _pickup_address
  from sellers
  where profile_id = auth.uid()
  limit 1;

  if _seller_id is null then
    raise exception 'You must be registered as a seller to create orders.';
  end if;

  -- 2. Insert customer
  insert into customers (name, phone, address, area)
  values (p_customer_name, p_customer_phone, p_customer_address, coalesce(p_dropoff_area, 'Lagos'))
  returning id into _customer_id;

  -- 3. Insert order
  insert into orders (
    seller_id,
    customer_id,
    product_description,
    cod_amount_kobo,
    delivery_fee_kobo,
    pickup_address,
    dropoff_address,
    dropoff_area,
    status
  ) values (
    _seller_id,
    _customer_id,
    p_product_description,
    coalesce(p_cod_amount_kobo, 0),
    coalesce(p_delivery_fee_kobo, 150000),
    _pickup_address,
    p_customer_address,
    coalesce(p_dropoff_area, 'Ikeja'),
    'NEW'
  )
  returning id, order_number, tracking_token into _order_id, _order_number, _tracking_token;

  return jsonb_build_object(
    'order_id', _order_id,
    'order_number', _order_number,
    'tracking_token', _tracking_token
  );
end;
$$ language plpgsql security definer;

-- 3. Atomic Order Status Updates (Rider, Dispatch, Admin)
create or replace function public.update_order_status(
  p_order_id uuid,
  p_new_status public.order_status,
  p_failure_reason text default null
)
returns boolean as $$
declare
  _old_status public.order_status;
begin
  select status into _old_status from orders where id = p_order_id;
  if _old_status is null then
    raise exception 'Order not found';
  end if;

  update orders
  set status = p_new_status,
      failure_reason = p_failure_reason,
      updated_at = now()
  where id = p_order_id;

  return true;
end;
$$ language plpgsql security definer;

-- 4. Rider Assignment
create or replace function public.assign_order_rider(
  p_order_id uuid,
  p_rider_id uuid
)
returns boolean as $$
begin
  update orders
  set rider_id = p_rider_id,
      status = 'ASSIGNED',
      updated_at = now()
  where id = p_order_id;

  return true;
end;
$$ language plpgsql security definer;
