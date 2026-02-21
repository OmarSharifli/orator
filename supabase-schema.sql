-- Run this entire file in the Supabase SQL Editor: https://supabase.com/dashboard/project/lcqkokpatiekrhrxflqh/sql

-- =============================================
-- PROFILES TABLE
-- =============================================
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  username            text unique not null,
  total_xp            integer not null default 0,
  current_streak      integer not null default 0,
  longest_streak      integer not null default 0,
  sessions_completed  integer not null default 0,
  last_session_date   date,
  created_at          timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
create policy "Public read" on public.profiles for select using (true);
create policy "Own insert" on public.profiles for insert with check (auth.uid() = id);
create policy "Own update" on public.profiles for update using (auth.uid() = id);

-- =============================================
-- SESSIONS TABLE
-- =============================================
create table if not exists public.sessions (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.profiles(id) on delete cascade,
  topic                text not null,
  topic_id             integer,
  tip_id               integer,
  tip_speaker          text,
  duration_seconds     integer not null default 0,
  video_url            text,
  transcript           text,
  score_filler         integer,
  score_pace           integer,
  score_pauses         integer,
  score_storytelling   integer,
  score_clarity        integer,
  score_tip            integer,
  feedback_filler      text,
  feedback_pace        text,
  feedback_pauses      text,
  feedback_storytelling text,
  feedback_clarity     text,
  feedback_tip         text,
  overall_feedback     text,
  tip_used             boolean default false,
  total_xp_earned      integer not null default 0,
  filler_count         integer default 0,
  created_at           timestamptz not null default now()
);

alter table public.sessions enable row level security;
create policy "Own sessions" on public.sessions for all using (auth.uid() = user_id);
create policy "Public session read" on public.sessions for select using (true);

-- =============================================
-- USER TOPIC HISTORY TABLE
-- =============================================
create table if not exists public.user_topic_history (
  user_id   uuid not null references public.profiles(id) on delete cascade,
  topic_id  integer not null,
  seen_at   timestamptz not null default now(),
  primary key (user_id, topic_id)
);

alter table public.user_topic_history enable row level security;
create policy "Own history" on public.user_topic_history for all using (auth.uid() = user_id);

-- =============================================
-- STORAGE BUCKET
-- =============================================
insert into storage.buckets (id, name, public)
values ('recordings', 'recordings', true)
on conflict (id) do nothing;

create policy "Allow authenticated uploads"
  on storage.objects for insert
  with check (bucket_id = 'recordings' and auth.role() = 'authenticated');

create policy "Public read recordings"
  on storage.objects for select
  using (bucket_id = 'recordings');

-- =============================================
-- WAITLIST TABLE
-- =============================================
create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  created_at  timestamptz not null default now()
);

alter table public.waitlist enable row level security;
create policy "Anonymous insert to waitlist" on public.waitlist for insert with check (true);
create policy "Admin read waitlist" on public.waitlist for select using (true); -- Note: Adjust in production
