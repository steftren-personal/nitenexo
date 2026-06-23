-- Profiles: one row per auth.users, holds display name.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row when a new user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Slots: consultation slots Stefan/Theodor open up for booking.
create table public.slots (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_booked boolean not null default false,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

alter table public.slots enable row level security;

create policy "Authenticated users read slots"
  on public.slots for select
  to authenticated
  using (true);

-- No insert/update/delete policy for regular users — only the
-- service-role client (admin API routes) can write to this table.

-- Appointments: a user's booking of a slot.
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slot_id uuid not null references public.slots (id) on delete cascade,
  status text not null default 'confirmed'
    check (status in ('confirmed', 'cancelled', 'completed', 'no_show')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.appointments enable row level security;

-- Double-booking protection: only one active (confirmed) appointment per
-- slot can exist. Cancelled rows are excluded, so a freed slot can be
-- rebooked, but two concurrent inserts for the same open slot can't both
-- succeed — the database enforces it, not just app logic.
create unique index appointments_slot_active_unique
  on public.appointments (slot_id)
  where (status = 'confirmed');

create policy "Users read own appointments"
  on public.appointments for select
  using (auth.uid() = user_id);

create policy "Users insert own appointments"
  on public.appointments for insert
  with check (auth.uid() = user_id);

create policy "Users cancel own appointments"
  on public.appointments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);