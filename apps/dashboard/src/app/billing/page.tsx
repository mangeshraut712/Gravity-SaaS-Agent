'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { Sparkles, Check, Zap, ArrowRight, Shield, Globe, MessageSquare, CreditCard } from 'lucide-react';
import {
  buildPolarCheckoutUrl,
  getPlanLimits,
  getUsageSnapshotForCurrentUser,
  supabaseClient,
  type SubscriptionTier,
} from '../../lib';
import { Badge, Button } from '../../components/ui';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    desc: 'For hobbyists exploring AI.',
    features: ['1 AI Agent', '100 messages/mo', 'Web Chat Widget', 'Standard Latency'],
    buttonText: 'Current Plan',
    premium: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$49',
    desc: 'For growing businesses.',
    features: ['5 AI Agents', '5,000 messages/mo', 'WhatsApp Channel', 'API Access', 'Priority Support'],
    buttonText: 'Upgrade to Pro',
    premium: true,
    popular: true
  },
  {
    id: 'business',
    name: 'Business',
    price: '$199',
    desc: 'For large enterprises.',
    features: ['Unlimited Agents', '25,000 messages/mo', 'White-labeling', 'Dedicated Manager', 'Custom Training'],
    buttonText: 'Contact Sales',
    premium: true
  }
];

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
    <div className="p-6 lg:p-10 space-y-12 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Subscription & Usage</h1>
        <p className="text-gray-400 mt-1">
          Scale your AI workforce as your business grows.
        </p>
      </div>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Plan</p>
              <h2 className="text-2xl font-bold text-white capitalize mt-1">{tier}</h2>
            </div>
            <Badge variant="success" className="h-8 px-4">Active</Badge>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Agents Deployed</span>
                <span className="text-white font-bold">{agentsUsed} / {limits.maxAgents}</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  style={{ width: `${(agentsUsed / limits.maxAgents) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Monthly Message Credits</span>
                <span className="text-white font-bold">{messagesUsed.toLocaleString()} / {limits.maxMessagesPerMonth.toLocaleString()}</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(messagesUsed / limits.maxMessagesPerMonth) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-8 bg-gradient-to-br from-purple-500/10 to-blue-600/10 border-purple-500/20 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Upgrade to unlock Pro
            </h3>
            <p className="text-sm text-gray-400">
              Get WhatsApp Business integration, REST API access, and 5x more message capacity.
            </p>
          </div>
          <div className="pt-6">
            <Button variant="premium" className="w-full gap-2">
              View Pro Features <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Plan Selections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className={`card p-8 flex flex-col transition-all hover:translate-y-[-4px] ${plan.popular ? 'border-purple-500/50 shadow-2xl shadow-purple-500/10 scale-105' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge variant="default" className="h-8 shadow-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white">Most Popular</Badge>
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{plan.desc}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-500">/mo</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-emerald-500" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <Button
              variant={plan.popular ? 'premium' : tier === plan.id ? 'outline' : 'default'}
              className="w-full"
              asChild={tier !== plan.id && !!(plan.id === 'pro' ? proCheckout : plan.id === 'business' ? businessCheckout : null)}
              disabled={tier === plan.id}
            >
              {tier === plan.id ? plan.buttonText : (
                <>
                  {plan.id === 'pro' && proCheckout && <a href={proCheckout}>{plan.buttonText}</a>}
                  {plan.id === 'business' && businessCheckout && <a href={businessCheckout}>{plan.buttonText}</a>}
                  {(!proCheckout && plan.id === 'pro') || (!businessCheckout && plan.id === 'business') ? plan.buttonText : null}
                  {plan.id === 'free' && plan.buttonText}
                </>
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Payment Security */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-gray-500 text-sm py-10">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Secure SSL Encryption
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Powered by Polar.sh
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          200+ Countries supported
        </div>
      </div>
    </div>
  );
}
