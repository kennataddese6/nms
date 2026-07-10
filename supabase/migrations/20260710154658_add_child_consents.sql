-- Alter children table to add consent fields
alter table public.children
add column photo_consent boolean default false not null,
add column emergency_medical_consent boolean default false not null;
