import { supabaseClient } from './supabaseClient';
import { getPlanLimits, type PlanLimits, type SubscriptionTier } from './billingPlans';

export interface UsageSnapshot {
  tier: SubscriptionTier;
  limits: PlanLimits;
  agentsCount: number;
  messagesThisMonth: number;
}

function currentMonthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

export async function getUsageSnapshotForCurrentUser(): Promise<UsageSnapshot | null> {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError || !user) return null;

  const { data: profile, error: profileError } = await supabaseClient
    .from('users')
    .select('id, subscription_tier')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) return null;

  const tier = (profile.subscription_tier as SubscriptionTier) ?? 'free';
  const limits = getPlanLimits(tier);

  const [{ count: agentsCount }, { count: messagesCount }] = await Promise.all([
    supabaseClient
      .from('agents')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', profile.id),
    supabaseClient
      .from('analytics_events')
      .select('id', { count: 'exact', head: true })
      .eq('event_type', 'message_sent')
      .gte('created_at', currentMonthStart()),
  ]);

  return {
    tier,
    limits,
    agentsCount: agentsCount ?? 0,
    messagesThisMonth: messagesCount ?? 0,
  };
}

