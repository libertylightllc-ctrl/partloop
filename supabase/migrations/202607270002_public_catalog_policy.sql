create policy "public product images are readable"
on public.product_images for select
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'active'
  )
);
