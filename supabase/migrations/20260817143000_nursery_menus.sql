-- =========================================================================
-- Migration: Nursery Nutrition & Weekly Menus
-- =========================================================================

-- 1. Create Nursery Menus Table
create table if not exists public.nursery_menus (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  breakfast text not null,
  morning_snack text not null,
  lunch jsonb not null,
  desserts jsonb not null,
  afternoon_snack jsonb not null,
  afternoon_tea jsonb not null,
  is_active boolean not null default false,
  created_at timestamp with time zone not null default now()
);

-- Indexing for name search and active flag lookup
create index if not exists nursery_menus_is_active_idx on public.nursery_menus(is_active);

-- Enable RLS
alter table public.nursery_menus enable row level security;

-- 2. Row Level Security Policies
create policy "Select menus policy"
  on public.nursery_menus
  for select
  using (true); -- Publicly viewable for parents and guests

create policy "All menus policy for staff"
  on public.nursery_menus
  for all
  using (has_permission('write_children_records'))
  with check (has_permission('write_children_records'));

-- 3. Seeding Sample Autumn Menus (Week 1 & Week 2)
insert into public.nursery_menus (
  name, 
  breakfast, 
  morning_snack, 
  lunch, 
  desserts, 
  afternoon_snack, 
  afternoon_tea, 
  is_active
)
values 
(
  'Autumn Menu 2025 - Week 1',
  'Cereals, Fresh fruit, Porridge, Toast. Served on a rolling basis between 7.30-8.45',
  'Served on a rolling basis from 10am',
  '{
    "Monday": "Creamy Cheese & Broccoli Pasta",
    "Tuesday": "Chicken Vermicelli Rice with Vegetables",
    "Wednesday": "Asian Noodle stir fry with a medley of vegetables",
    "Thursday": "Spaghetti with Meatballs in a rich Tomato & hidden vegetable sauce",
    "Friday": "Toma''s Special Chicken Stew & Rice"
  }'::jsonb,
  '{
    "Monday": "Toma''s famous, Vegan Chocolate Cake with yoghurt or custard",
    "Tuesday": "Jelly with a fruit surprise",
    "Wednesday": "Greek yoghurt & Bananas (& honey for our older children)",
    "Thursday": "Jam and coconut sponge",
    "Friday": "Rice Pudding"
  }'::jsonb,
  '{
    "Monday": "Home-made Date Loaf",
    "Tuesday": "Lemon mini muffins",
    "Wednesday": "Apple cinnamon bread",
    "Thursday": "Mini pinwheels",
    "Friday": "cheese, cucumber & breadsticks"
  }'::jsonb,
  '{
    "Monday": "White bean soup with homemade croutons",
    "Tuesday": "Fish fingers with roasted vegetables",
    "Wednesday": "Roasted Tomato soup",
    "Thursday": "Mini Burritos",
    "Friday": "Mac & Cheese"
  }'::jsonb,
  true -- Set Week 1 as the default active menu
),
(
  'Autumn Menu 2025 - Week 2',
  'Cereals, Fresh fruit, Porridge, Toast. Served on a rolling basis between 7.30-8.45',
  'Served on a rolling basis from 10am',
  '{
    "Monday": "Vegetable Frittata & Salad",
    "Tuesday": "Baked Salmon with sweet potato mash & green beans",
    "Wednesday": "Mild Turkey Korma with Basmati rice",
    "Thursday": "Beef Lasagne with garlic bread strips",
    "Friday": "Fish Pie with peas and sweetcorn"
  }'::jsonb,
  '{
    "Monday": "Fruit salad pots",
    "Tuesday": "Apple crumble with custard",
    "Wednesday": "Vanilla yoghurt & honey",
    "Thursday": "Oatmeal cookies with milk",
    "Friday": "Banana bread slices"
  }'::jsonb,
  '{
    "Monday": "Rice cakes with cream cheese",
    "Tuesday": "Oat bars and pear slices",
    "Wednesday": "Carrot sticks & hummus",
    "Thursday": "Yoghurt pots",
    "Friday": "Fruit skewers"
  }'::jsonb,
  '{
    "Monday": "Baked potato with cheese and beans",
    "Tuesday": "Vegetable pizza slices",
    "Wednesday": "Pita bread pockets with chicken salad",
    "Thursday": "Butternut squash soup with bread rolls",
    "Friday": "Scrambled eggs on toast"
  }'::jsonb,
  false
);
