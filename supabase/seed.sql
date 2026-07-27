insert into public.categories (id, slug, name_en, name_ar) values
  ('10000000-0000-0000-0000-000000000001', 'lights', 'Lights', 'إضاءة'),
  ('10000000-0000-0000-0000-000000000002', 'engines', 'Engines', 'محركات'),
  ('10000000-0000-0000-0000-000000000003', 'body', 'Body parts', 'قطع الهيكل'),
  ('10000000-0000-0000-0000-000000000004', 'transmission', 'Transmission', 'ناقل الحركة'),
  ('10000000-0000-0000-0000-000000000005', 'wheels', 'Wheels', 'جنوط')
on conflict do nothing;

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000101',
  'authenticated',
  'authenticated',
  'seller@partsloop.local',
  crypt('PartsLoopDemo123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Khalid Al Quoz"}',
  now(), now(), '', '', '', ''
) on conflict (id) do nothing;

insert into auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) values (
  '00000000-0000-0000-0000-000000000102',
  '00000000-0000-0000-0000-000000000101',
  'seller@partsloop.local',
  '{"sub":"00000000-0000-0000-0000-000000000101","email":"seller@partsloop.local","email_verified":true}',
  'email', now(), now(), now()
) on conflict (provider_id, provider) do nothing;

insert into public.profiles (id, role, full_name, phone, locale)
values ('00000000-0000-0000-0000-000000000101', 'seller', 'Khalid Al Quoz', '+971500000001', 'en')
on conflict (id) do update set role = excluded.role, full_name = excluded.full_name;

insert into public.seller_profiles (
  id, owner_id, display_name, legal_name, city, verification_status, rating, completed_orders
) values (
  '20000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000101',
  'Al Quoz Auto Parts',
  'Al Quoz Auto Parts Trading LLC',
  'Dubai',
  'verified',
  4.9,
  1264
) on conflict (id) do update set verification_status = 'verified', rating = 4.9;

insert into public.products (
  id, seller_id, category_id, slug, title_en, title_ar, description_en,
  description_ar, oem_number, condition, grade, status, price_minor,
  currency, warranty_days, defects, ai_metadata
) values
(
  '30000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'toyota-land-cruiser-led-headlight-81150-60r30',
  'Toyota Land Cruiser LED Headlight — Left',
  'مصباح ليد يسار تويوتا لاند كروزر',
  'Genuine OEM left headlight. Clear lens, intact mounting tabs, bench tested.',
  'مصباح أمامي أصلي يسار، عدسة صافية وقواعد سليمة وتم اختباره.',
  '81150-60R30', 'used', 'a', 'active', 85000, 'AED', 30,
  '["Two faint surface marks"]',
  '{"source":"seed","condition_confidence":0.94}'
),
(
  '30000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  'nissan-patrol-vk56-engine',
  'Nissan Patrol VK56 5.6L Engine',
  'محرك نيسان باترول VK56 سعة 5.6 لتر',
  'Tested complete engine with compression report. Donor mileage 78,400 km.',
  'محرك كامل ومختبر مع تقرير ضغط وممشى 78,400 كم.',
  'VK56VD', 'used', 'b', 'active', 1280000, 'AED', 14,
  '["Cosmetic oxidation on cover"]',
  '{"source":"seed","condition_confidence":0.88}'
),
(
  '30000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000004',
  'toyota-prado-automatic-gearbox',
  'Toyota Prado Automatic Gearbox 6-Speed',
  'جير أوتوماتيك تويوتا برادو 6 سرعات',
  'Bench-tested transmission, flushed and supplied with a fitting kit.',
  'ناقل حركة تم اختباره وتنظيفه ويأتي مع طقم تركيب.',
  '35010-35B70', 'refurbished', 'a', 'active', 495000, 'AED', 90,
  '[]',
  '{"source":"seed","condition_confidence":0.96}'
)
on conflict (id) do update set
  title_en = excluded.title_en,
  title_ar = excluded.title_ar,
  status = 'active',
  price_minor = excluded.price_minor,
  updated_at = now();

insert into public.product_fitments (
  product_id, make, model, year_from, year_to, engine, status, source
) values
  ('30000000-0000-0000-0000-000000000001', 'Toyota', 'Land Cruiser', 2018, 2021, '4.0L', 'confirmed', 'catalogue'),
  ('30000000-0000-0000-0000-000000000002', 'Nissan', 'Patrol Y62', 2017, 2021, '5.6L', 'possible', 'seller'),
  ('30000000-0000-0000-0000-000000000003', 'Toyota', 'Prado', 2018, 2022, '4.0L', 'confirmed', 'catalogue')
on conflict do nothing;

insert into public.product_images (product_id, storage_path, sort_order, ai_checked) values
  ('30000000-0000-0000-0000-000000000001', 'https://upload.wikimedia.org/wikipedia/commons/8/8e/LED_Headlamp_inside.jpg', 0, true),
  ('30000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=82', 0, true),
  ('30000000-0000-0000-0000-000000000003', 'https://upload.wikimedia.org/wikipedia/commons/5/59/Gearbox.jpg', 0, true)
on conflict do nothing;
