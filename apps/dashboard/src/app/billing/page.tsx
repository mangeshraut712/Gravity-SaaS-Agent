'use client';

import React from 'react';
import { supabaseClient } from '../../lib/supabaseClient';
import {
  buildPolarCheckoutUrl,
  getPlanLimits,
  type SubscriptionTier,
} from '../../lib/billingPlans';
import { getUsageSnapshotForCurrentUser } from '../../lib/usage';

export default function BillingPage() {
  const [loading, setLoading] = React.useState(true);
  const [tier, setTier] = React.useState<SubscriptionTier>('free');
  const [email, setEmail] = React.useState<string | null>(null);
  const [agentsUsed, setAgentsUsed] = React.useState(0);
  const [messagesUsed, setMessagesUsed] = React.useState(0);

  const limits = getPlanLimits(tier);

  React.useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const usage = await getUsageSnapshotForCurrentUser();
        if (usage) {
          setTier(usage.tier);
          setAgentsUsed(usage.agentsCount);
          setMessagesUsed(usage.messagesThisMonth);
        }
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();
        setEmail(user?.email ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const proCheckout = buildPolarCheckoutUrl('pro', email);
  const businessCheckout = buildPolarCheckoutUrl('business', email);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-semibold text-white sm:text-3xl">Billing</h1>
      <p className="mt-1 text-sm text-gray-400">
        Manage your AgentFlow subscription, usage, and invoices.
      </p>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-white/10 bg-gray-950/80 p-5 text-sm text-gray-200">
          <p className="text-xs font-semibold text-gray-300">Current plan</p>
          <p className="mt-1 text-lg font-semibold text-white capitalize">
            {tier} ·{' '}
            {tier === 'free'
              ? '$0 / month'
              : tier === 'pro'
                ? '$49 / month'
                : '$199 / month'}
          </p>
          <p className="mt-2 text-xs text-gray-400">
            {tier === 'free' &&
              'Upgrade to unlock WhatsApp, API access, and higher message limits.'}
            {tier === 'pro' &&
              'You have access to WhatsApp, custom domains, and increased limits.'}
            {tier === 'business' &&
              'You are on our highest plan with white-label and premium support.'}
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] text-gray-400">Agents</p>
              <p className="mt-1 text-base font-semibold text-white">
                {agentsUsed} / {limits.maxAgents}
              </p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-gray-800">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (agentsUsed / Math.max(1, limits.maxAgents)) * 100,
                    )}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Messages this month</p>
              <p className="mt-1 text-base font-semibold text-white">
                {messagesUsed} / {limits.maxMessagesPerMonth.toLocaleString()}
              </p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-gray-800">
                <div
                  className="h-1.5 rounded-full bg-emerald-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (messagesUsed /
                        Math.max(1, limits.maxMessagesPerMonth)) *
                        100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {loading && (
            <p className="mt-3 text-[11px] text-gray-500">
              Loading latest usage and plan information…
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-gray-950/80 p-5 text-xs text-gray-300">
          <p className="text-xs font-semibold text-gray-300">
            Manage subscription
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            AgentFlow uses Polar.sh for secure billing. Use the upgrade buttons
            below to change plans.
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Pro · $49 / month</span>
              {proCheckout ? (
                <a
                  href={proCheckout}
                  className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-3 py-1 text-[11px] font-semibold text-white hover:brightness-110"
                >
                  Upgrade to Pro
                </a>
              ) : (
                <span className="text-[11px] text-yellow-400">
                  Set POLAR_PRO_PRODUCT_ID + APP_URL
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span>Business · $199 / month</span>
              {businessCheckout ? (
                <a
                  href={businessCheckout}
                  className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-3 py-1 text-[11px] font-semibold text-white hover:brightness-110"
                >
                  Upgrade to Business
                </a>
              ) : (
                <span className="text-[11px] text-yellow-400">
                  Set POLAR_BUSINESS_PRODUCT_ID + APP_URL
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

