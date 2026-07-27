create extension if not exists "pgcrypto";

create type public.user_role as enum ('buyer', 'seller', 'admin');
create type public.listing_condition as enum ('new', 'used', 'refurbished');
create type public.condition_grade as enum ('new', 'a', 'b', 'c', 'repair', 'untested');
create type public.compatibility_status as enum ('confirmed', 'possible', 'unverified');
create type public.listing_status as enum ('draft', 'pending_review', 'active', 'paused', 'rejected', 'sold');
create type public.order_status as enum ('payment_secured', 'seller_confirmed', 'packed', 'collected', 'out_for_delivery', 'delivered', 'inspection', 'released', 'disputed', 'refunded', 'cancelled');
create type public.dispute_status as enum ('open', 'awaiting_seller', 'under_review', 'resolved');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'buyer',
  full_name text,
  phone text,
  locale text not null default 'en' check (locale in ('en', 'ar')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.seller_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  display_name text not null,
  legal_name text,
  city text not null,
  country_code char(2) not null default 'AE',
  verification_status text not null default 'pending' check (verification_status in ('pending', 'verified', 'rejected', 'suspended')),
  rating numeric(2,1) not null default 0,
  completed_orders integer not null default 0,
  stripe_account_id text,
  aramex_account_ref text,
  created_at timestamptz not null default now(),
  unique(owner_id)
);

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  make text not null,
  model text not null,
  model_year smallint not null check (model_year between 1950 and 2100),
  engine text not null,
  trim text,
  vin text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique(owner_id, vin)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  parent_id uuid references public.categories(id)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.seller_profiles(id) on delete restrict,
  category_id uuid not null references public.categories(id),
  slug text not null unique,
  title_en text not null,
  title_ar text not null,
  description_en text not null,
  description_ar text not null,
  oem_number text not null,
  condition public.listing_condition not null,
  grade public.condition_grade not null,
  status public.listing_status not null default 'draft',
  price_minor integer not null check (price_minor > 0),
  currency char(3) not null default 'AED',
  warranty_days smallint not null default 0,
  defects jsonb not null default '[]'::jsonb,
  ai_metadata jsonb not null default '{}'::jsonb,
  search_document tsvector generated always as (
    to_tsvector('simple', coalesce(title_en,'') || ' ' || coalesce(title_ar,'') || ' ' || coalesce(oem_number,''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_search_idx on public.products using gin(search_document);
create index products_oem_idx on public.products(lower(oem_number));
create index products_seller_status_idx on public.products(seller_id, status);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  sort_order smallint not null default 0,
  ai_checked boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.product_fitments (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  make text not null,
  model text not null,
  year_from smallint not null,
  year_to smallint not null,
  engine text,
  trim text,
  status public.compatibility_status not null default 'unverified',
  source text not null default 'seller' check (source in ('seller', 'catalogue', 'ai', 'admin')),
  unique(product_id, make, model, year_from, year_to, engine, trim)
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null unique references public.profiles(id) on delete cascade,
  updated_at timestamptz not null default now()
);

create table public.cart_items (
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity smallint not null default 1 check (quantity between 1 and 10),
  primary key (cart_id, product_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  buyer_id uuid not null references public.profiles(id),
  seller_id uuid not null references public.seller_profiles(id),
  status public.order_status not null default 'payment_secured',
  subtotal_minor integer not null,
  delivery_minor integer not null,
  service_fee_minor integer not null,
  total_minor integer not null,
  currency char(3) not null default 'AED',
  delivery_address jsonb not null,
  inspection_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_buyer_idx on public.orders(buyer_id, created_at desc);
create index orders_seller_idx on public.orders(seller_id, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity smallint not null check (quantity > 0),
  unit_price_minor integer not null,
  title_snapshot jsonb not null,
  oem_snapshot text not null
);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  provider_reference text not null,
  event_type text not null,
  amount_minor integer,
  payload jsonb not null default '{}'::jsonb,
  idempotency_key text not null unique,
  created_at timestamptz not null default now()
);

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  provider text not null,
  tracking_number text not null unique,
  status text not null default 'created',
  label_url text,
  tracking_events jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.order_status_events (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status not null,
  actor_id uuid references public.profiles(id),
  note text,
  created_at timestamptz not null default now()
);

create table public.disputes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id),
  opened_by uuid not null references public.profiles(id),
  reason text not null,
  buyer_statement text not null,
  seller_statement text,
  status public.dispute_status not null default 'open',
  recommended_resolution text check (recommended_resolution in ('refund', 'partial_refund', 'release')),
  resolution text check (resolution in ('refund', 'partial_refund', 'release')),
  resolution_note text,
  resolved_by uuid references public.profiles(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.dispute_evidence (
  id uuid primary key default gen_random_uuid(),
  dispute_id uuid not null references public.disputes(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id),
  storage_path text not null,
  media_type text not null check (media_type in ('photo', 'video', 'document')),
  created_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id),
  order_id uuid references public.orders(id),
  buyer_id uuid not null references public.profiles(id),
  seller_id uuid not null references public.seller_profiles(id),
  created_at timestamptz not null default now()
);

create table public.messages (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.seller_profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_fitments enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_events enable row level security;
alter table public.shipments enable row level security;
alter table public.order_status_events enable row level security;
alter table public.disputes enable row level security;
alter table public.dispute_evidence enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "public active products are readable" on public.products for select using (status = 'active');
create policy "public fitments are readable" on public.product_fitments for select using (exists (select 1 from public.products p where p.id = product_id and p.status = 'active'));
create policy "public seller summaries are readable" on public.seller_profiles for select using (verification_status = 'verified');
create policy "users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "owners manage garage" on public.vehicles for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "buyers manage own cart" on public.carts for all using (auth.uid() = buyer_id) with check (auth.uid() = buyer_id);
create policy "buyers manage own cart items" on public.cart_items for all using (exists (select 1 from public.carts c where c.id = cart_id and c.buyer_id = auth.uid()));
create policy "order participants read orders" on public.orders for select using (
  buyer_id = auth.uid() or exists (select 1 from public.seller_profiles s where s.id = seller_id and s.owner_id = auth.uid())
);
create policy "order participants read items" on public.order_items for select using (exists (
  select 1 from public.orders o join public.seller_profiles s on s.id = o.seller_id
  where o.id = order_id and (o.buyer_id = auth.uid() or s.owner_id = auth.uid())
));
create policy "order participants read shipment" on public.shipments for select using (exists (
  select 1 from public.orders o join public.seller_profiles s on s.id = o.seller_id
  where o.id = order_id and (o.buyer_id = auth.uid() or s.owner_id = auth.uid())
));
create policy "order participants read timeline" on public.order_status_events for select using (exists (
  select 1 from public.orders o join public.seller_profiles s on s.id = o.seller_id
  where o.id = order_id and (o.buyer_id = auth.uid() or s.owner_id = auth.uid())
));
create policy "dispute participants read" on public.disputes for select using (exists (
  select 1 from public.orders o join public.seller_profiles s on s.id = o.seller_id
  where o.id = order_id and (o.buyer_id = auth.uid() or s.owner_id = auth.uid())
));
create policy "conversation participants read" on public.conversations for select using (
  buyer_id = auth.uid() or exists (select 1 from public.seller_profiles s where s.id = seller_id and s.owner_id = auth.uid())
);
create policy "conversation participants read messages" on public.messages for select using (exists (
  select 1 from public.conversations c join public.seller_profiles s on s.id = c.seller_id
  where c.id = conversation_id and (c.buyer_id = auth.uid() or s.owner_id = auth.uid())
));
create policy "conversation participants send messages" on public.messages for insert with check (
  sender_id = auth.uid() and exists (
    select 1 from public.conversations c join public.seller_profiles s on s.id = c.seller_id
    where c.id = conversation_id and (c.buyer_id = auth.uid() or s.owner_id = auth.uid())
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-images', 'product-images', true, 10485760, array['image/jpeg','image/png','image/webp']),
  ('dispute-evidence', 'dispute-evidence', false, 26214400, array['image/jpeg','image/png','image/webp','video/mp4','application/pdf'])
on conflict (id) do nothing;
