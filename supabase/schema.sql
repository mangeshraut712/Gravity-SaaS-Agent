-- AgentFlow Supabase schema
-- Run this in your Supabase SQL editor.

-- Extension for UUIDs (usually enabled by default)
create extension if not exists "pgcrypto";

-- USERS ----------------------------------------------------------------------

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  avatar_url text,
  company_name text,
  created_at timestamp with time zone default now(),
  subscription_tier text default 'free', -- 'free', 'pro', 'business'
  polar_customer_id text,
  stripe_customer_id text,
  billing_metadata jsonb default '{}'::jsonb
);

-- Link auth.users -> public.users via trigger (one row per auth user)
create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

-- AGENTS ---------------------------------------------------------------------

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  avatar_url text,
  template_type text, -- 'customer_service', 'sales', 'scheduler', etc.
  personality text default 'friendly', -- 'friendly', 'professional', 'technical', 'fun'
  custom_instructions text,
  knowledge_base jsonb default '[]'::jsonb, -- uploaded docs + urls + manual text
  status text default 'active', -- 'active', 'paused'
  channels jsonb default '{"web": true}'::jsonb, -- {whatsapp: true, web: true, api: true}
  whatsapp_number text,
  api_key text unique,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_agents_user_id on public.agents(user_id);
create index if not exists idx_agents_status on public.agents(status);

-- CONVERSATIONS --------------------------------------------------------------

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete cascade,
  user_identifier text, -- email, phone, or anonymous ID
  status text default 'active', -- 'active', 'resolved', 'escalated'
  started_at timestamp with time zone default now(),
  last_message_at timestamp with time zone default now()
);

create index if not exists idx_conversations_agent_id on public.conversations(agent_id);
create index if not exists idx_conversations_status on public.conversations(status);

-- MESSAGES -------------------------------------------------------------------

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  role text not null, -- 'user' or 'agent'
  content text not null,
  created_at timestamp with time zone default now()
);

create index if not exists idx_messages_conversation_id on public.messages(conversation_id);
create index if not exists idx_messages_created_at on public.messages(created_at);

-- ANALYTICS EVENTS -----------------------------------------------------------

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete cascade,
  event_type text not null, -- 'message_sent', 'conversation_started', 'escalation', etc.
  metadata jsonb,
  created_at timestamp with time zone default now()
);

create index if not exists idx_analytics_events_agent_id on public.analytics_events(agent_id);
create index if not exists idx_analytics_events_created_at on public.analytics_events(created_at);

-- OPTIONAL: simple billing events log
create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  provider text not null, -- 'polar'
  event_type text not null,
  raw_payload jsonb,
  created_at timestamp with time zone default now()
);

create index if not exists idx_billing_events_user_id on public.billing_events(user_id);

-- RLS POLICIES ---------------------------------------------------------------

-- Enable RLS
alter table public.users enable row level security;
alter table public.agents enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.analytics_events enable row level security;
alter table public.billing_events enable row level security;

-- USERS: a user can see and update only their own profile
drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile"
  on public.users
  for select
  using (id = auth.uid());

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
  on public.users
  for update
  using (id = auth.uid());

-- AGENTS: owner can do everything
drop policy if exists "Users can manage own agents" on public.agents;
create policy "Users can manage own agents"
  on public.agents
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- CONVERSATIONS: visible through owned agents
drop policy if exists "Users can access conversations for own agents" on public.conversations;
create policy "Users can access conversations for own agents"
  on public.conversations
  for all
  using (
    exists (
      select 1 from public.agents a
      where a.id = conversations.agent_id
        and a.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.agents a
      where a.id = conversations.agent_id
        and a.user_id = auth.uid()
    )
  );

-- MESSAGES: visible through conversations
drop policy if exists "Users can access messages for own agents" on public.messages;
create policy "Users can access messages for own agents"
  on public.messages
  for all
  using (
    exists (
      select 1 from public.conversations c
      join public.agents a on a.id = c.agent_id
      where c.id = messages.conversation_id
        and a.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.conversations c
      join public.agents a on a.id = c.agent_id
      where c.id = messages.conversation_id
        and a.user_id = auth.uid()
    )
  );

-- ANALYTICS EVENTS: through owned agents
drop policy if exists "Users can access analytics for own agents" on public.analytics_events;
create policy "Users can access analytics for own agents"
  on public.analytics_events
  for all
  using (
    exists (
      select 1 from public.agents a
      where a.id = analytics_events.agent_id
        and a.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.agents a
      where a.id = analytics_events.agent_id
        and a.user_id = auth.uid()
    )
  );

-- BILLING EVENTS: user can see their own events
drop policy if exists "Users can read own billing events" on public.billing_events;
create policy "Users can read own billing events"
  on public.billing_events
  for select
  using (user_id = auth.uid());

