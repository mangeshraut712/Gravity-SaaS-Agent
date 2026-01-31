"use client";

import React from 'react';
import { Sparkles, Check, Zap, ArrowRight, Shield, Globe, MessageSquare, CreditCard } from 'lucide-react';
import {
  buildPolarCheckoutUrl,
  cn,
  getPlanLimits,
  getUsageSnapshotForCurrentUser,
  supabaseClient,
  type SubscriptionTier,
} from '@/lib';
import { Badge, Button } from '@/components/ui';

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
    <div className="p-6 lg:p-10 space-y-12 animate-slide-up selection:bg-violet-500/30 text-black">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscription & Usage</h1>
        <p className="text-black/60 mt-1">
          Scale your AI workforce as your business grows.
        </p>
      </div>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-8 space-y-6 border-black/10 bg-black/[0.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-black/60 uppercase tracking-widest">Active Plan</p>
              <h2 className="text-2xl font-bold text-black capitalize mt-1">{tier}</h2>
            </div>
            <Badge variant="success" className="h-8 px-4 font-bold !bg-emerald-500/10 !text-emerald-600 border border-emerald-500/20">Active</Badge>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-black/60 font-medium">Agents Deployed</span>
                <span className="text-black font-bold">{agentsUsed} / {limits.maxAgents}</span>
              </div>
              <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                  style={{ width: `${(agentsUsed / limits.maxAgents) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-black/60 font-medium">Monthly Message Credits</span>
                <span className="text-black font-bold">{messagesUsed.toLocaleString()} / {limits.maxMessagesPerMonth.toLocaleString()}</span>
              </div>
              <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-emerald-500/80 rounded-full"
                  style={{ width: `${(messagesUsed / limits.maxMessagesPerMonth) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-8 bg-gradient-to-br from-violet-500/10 to-indigo-600/10 border-violet-500/20 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="h-32 w-32 text-violet-600" />
          </div>
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-bold text-black flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-600" />
              Upgrade to unlock Pro
            </h3>
            <p className="text-sm text-black/60 leading-relaxed font-medium">
              Get WhatsApp Business integration, REST API access, and 5x more message capacity to supercharge your growth.
            </p>
          </div>
          <div className="pt-6 relative z-10">
            <Button variant="premium" className="w-full gap-2 !h-12 font-bold uppercase tracking-widest text-[11px]">
              View Pro Features <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Plan Selections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className={`card p-8 flex flex-col transition-all hover:translate-y-[-8px] hover:border-black/10 ${plan.popular ? 'border-violet-500/30' : 'border-black/10'} bg-black/[0.02] relative overflow-hidden`}>
            {plan.popular && (
              <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1.5 rounded-b-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl">Most Popular</div>
              </div>
            )}
            <div className="mb-8 mt-4">
              <h3 className="text-2xl font-bold text-black tracking-tight">{plan.name}</h3>
              <p className="text-sm text-black/60 mt-2 font-medium">{plan.desc}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-black tracking-tighter">{plan.price}</span>
                <span className="text-black/60 font-bold text-lg">/mo</span>
              </div>
            </div>

            <ul className="space-y-5 mb-12 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-black/70 font-medium">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-600" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <Button
              variant={plan.popular ? 'premium' : tier === plan.id ? 'outline' : 'default'}
              className={cn("w-full !h-12 font-bold uppercase tracking-widest text-[10px]", tier === plan.id && "!border-black/10 !bg-black/5 !text-black/60 cursor-not-allowed")}
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
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 text-black/60 text-xs font-bold uppercase tracking-widest py-12 opacity-60">
        <div className="flex items-center gap-3">
          <Shield className="h-4 w-4 text-emerald-500" />
          Secure SSL Encryption
        </div>
        <div className="flex items-center gap-3">
          <CreditCard className="h-4 w-4 text-violet-500" />
          Powered by Polar.sh
        </div>
        <div className="flex items-center gap-3">
          <Globe className="h-4 w-4 text-indigo-500" />
          200+ Countries supported
        </div>
      </div>
    </div>
  );
}
