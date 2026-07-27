create or replace function public.create_marketplace_order(
  p_public_id text,
  p_buyer_id uuid,
  p_seller_id uuid,
  p_product_id uuid,
  p_quantity smallint,
  p_subtotal_minor integer,
  p_delivery_minor integer,
  p_service_fee_minor integer,
  p_currency char(3),
  p_delivery_address jsonb,
  p_title_snapshot jsonb,
  p_oem_snapshot text,
  p_payment_provider text,
  p_payment_reference text,
  p_idempotency_key text,
  p_logistics_provider text,
  p_tracking_number text,
  p_label_url text default null
) returns table(order_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
begin
  select pe.order_id into v_order_id
  from public.payment_events pe
  where pe.idempotency_key = p_idempotency_key;

  if v_order_id is not null then
    return query select v_order_id;
    return;
  end if;

  insert into public.orders (
    public_id, buyer_id, seller_id, status, subtotal_minor, delivery_minor,
    service_fee_minor, total_minor, currency, delivery_address
  ) values (
    p_public_id, p_buyer_id, p_seller_id, 'payment_secured',
    p_subtotal_minor, p_delivery_minor, p_service_fee_minor,
    p_subtotal_minor + p_delivery_minor + p_service_fee_minor,
    p_currency, p_delivery_address
  ) returning id into v_order_id;

  insert into public.order_items (
    order_id, product_id, quantity, unit_price_minor, title_snapshot, oem_snapshot
  ) values (
    v_order_id, p_product_id, p_quantity, p_subtotal_minor / p_quantity,
    p_title_snapshot, p_oem_snapshot
  );

  insert into public.payment_events (
    order_id, provider, provider_reference, event_type, amount_minor, payload, idempotency_key
  ) values (
    v_order_id, p_payment_provider, p_payment_reference, 'authorized',
    p_subtotal_minor + p_delivery_minor + p_service_fee_minor,
    jsonb_build_object('capture_method', 'manual'), p_idempotency_key
  );

  insert into public.shipments (
    order_id, provider, tracking_number, status, label_url
  ) values (
    v_order_id, p_logistics_provider, p_tracking_number, 'created', p_label_url
  );

  insert into public.order_status_events (order_id, status, actor_id, note)
  values (v_order_id, 'payment_secured', p_buyer_id, 'Checkout authorization completed');

  return query select v_order_id;
end;
$$;

revoke all on function public.create_marketplace_order(
  text, uuid, uuid, uuid, smallint, integer, integer, integer, char,
  jsonb, jsonb, text, text, text, text, text, text, text
) from public, anon, authenticated;

grant execute on function public.create_marketplace_order(
  text, uuid, uuid, uuid, smallint, integer, integer, integer, char,
  jsonb, jsonb, text, text, text, text, text, text, text
) to service_role;
