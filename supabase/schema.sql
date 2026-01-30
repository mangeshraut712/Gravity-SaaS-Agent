-- AgentFlow Unified Supabase Schema
-- Combined from Gravity-SaaS-Agent and gravitysaasagent

-- Extension for UUIDs
create extension if not exists "pgcrypto";

-- ENUMS ----------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.subscription_tier AS ENUM ('free', 'pro', 'business');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.agent_status AS ENUM ('active', 'paused', 'draft');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.personality_type AS ENUM ('friendly', 'professional', 'technical', 'fun');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.conversation_status AS ENUM ('active', 'resolved', 'escalated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- TABLES ---------------------------------------------------------------------

-- Profiles Table (Replacing users table)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  email text not null,
  full_name text,
  avatar_url text,
  company_name text,
  subscription_tier subscription_tier default 'free' not null,
  polar_customer_id text,
  stripe_customer_id text,
  billing_metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- User Roles Table
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone default now() not null,
  unique (user_id, role)
);

-- Agents Table
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  avatar_url text,
  template_type text not null, -- 'customer_service', 'sales', etc.
  personality personality_type default 'friendly' not null,
  custom_instructions text,
  knowledge_base jsonb default '[]'::jsonb,
  status agent_status default 'active' not null,
  channels jsonb default '{"web": true, "whatsapp": false, "api": false}'::jsonb,
  whatsapp_number text,
  api_key text unique default encode(gen_random_bytes(32), 'hex'),
  monetization_enabled boolean default false,
  price_per_month decimal(10, 2),
  free_trial_days integer default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index if not exists idx_agents_user_id on public.agents(user_id);
create index if not exists idx_agents_status on public.agents(status);

-- Conversations Table
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete cascade not null,
  user_identifier text, -- email, phone, or anonymous ID
  status conversation_status default 'active' not null,
  started_at timestamp with time zone default now() not null,
  last_message_at timestamp with time zone default now() not null
);

create index if not exists idx_conversations_agent_id on public.conversations(agent_id);
create index if not exists idx_conversations_status on public.conversations(status);

-- Messages Table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default now() not null
);

create index if not exists idx_messages_conversation_id on public.messages(conversation_id);
create index if not exists idx_messages_created_at on public.messages(created_at);

-- Analytics Events Table
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete cascade not null,
  event_type text not null, -- 'message_sent', 'conversation_started', 'escalation', etc.
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now() not null
);

create index if not exists idx_analytics_events_agent_id on public.analytics_events(agent_id);
create index if not exists idx_analytics_events_created_at on public.analytics_events(created_at);

-- Billing Events Table
create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null, -- 'polar'
  event_type text not null,
  raw_payload jsonb,
  created_at timestamp with time zone default now() not null
);

create index if not exists idx_billing_events_user_id on public.billing_events(user_id);

-- RLS POLICIES ---------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.agents enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.analytics_events enable row level security;
alter table public.billing_events enable row level security;

-- Profiles: user can see and update only their own profile
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (user_id = auth.uid());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (user_id = auth.uid());

-- User Roles
create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

-- Agents: owner can do everything
drop policy if exists "Users can manage own agents" on public.agents;
create policy "Users can manage own agents"
  on public.agents for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Conversations: visible through owned agents
drop policy if exists "Agent owners can view conversations" on public.conversations;
create policy "Agent owners can view conversations"
  on public.conversations for select
  using (
    exists (
      select 1 from public.agents a
      where a.id = conversations.agent_id
        and a.user_id = auth.uid()
    )
  );

-- Messages: visible through conversations
drop policy if exists "Agent owners can view messages" on public.messages;
create policy "Agent owners can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      join public.agents a on a.id = c.agent_id
      where c.id = messages.conversation_id
        and a.user_id = auth.uid()
    )
  );

-- Analytics
create policy "Agent owners can view analytics"
  on public.analytics_events for select
  using (
    exists (
      select 1 from public.agents a
      where a.id = analytics_events.agent_id
        and a.user_id = auth.uid()
    )
  );

-- Billing
create policy "Users can read own billing events"
  on public.billing_events for select
  using (user_id = auth.uid());

-- FUNCTIONS & TRIGGERS -------------------------------------------------------

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

-- Triggers for updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_agents_updated_at
  before update on public.agents
  for each row execute function public.update_updated_at_column();

-- Function to handle new user profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (user_id) do nothing;
  
  -- Assign default 'user' role
  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;
  
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger to auto-create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable realtime
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
