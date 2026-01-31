"use client";

import Link from 'next/link';
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const templates = [
  {
    id: 'customer_service',
    emoji: '🛎️',
    name: 'Customer Service Bot',
    badge: 'Most Popular',
    description:
      'Answer FAQs, resolve issues, and escalate to humans when needed.',
    category: 'Customer Service',
  },
  {
    id: 'sales_qualifier',
    emoji: '💼',
    name: 'Sales Qualifier',
    badge: 'High Converting',
    description:
      'Qualify leads, book meetings, and push qualified leads into your CRM.',
    category: 'Sales',
  },
  {
    id: 'appointment_scheduler',
    emoji: '📅',
    name: 'Appointment Scheduler',
    description: 'Book appointments, send reminders, and sync with your calendar tools.',
    category: 'Scheduling',
  },
  {
    id: 'faq_assistant',
    emoji: '❓',
    name: 'FAQ Assistant',
    description: 'Answer common questions based on your knowledge base.',
    category: 'Customer Service',
  },
  {
    id: 'lead_capture',
    emoji: '🎯',
    name: 'Lead Capture Bot',
    badge: 'New',
    description: 'Collect contact details, validate emails, and grow your list.',
    category: 'Sales',
  },
];

const categories = ['All', 'Customer Service', 'Sales', 'Scheduling'] as const;

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] =
    React.useState<(typeof categories)[number]>('All');

  const filtered = templates.filter(
    (t) => activeCategory === 'All' || t.category === activeCategory,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 animate-slide-up selection:bg-violet-500/30 text-black">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-gradient-rainbow">Agent Templates</span>
          </h1>
          <p className="mt-2 text-black/60">
            Production-ready AI agents blueprints you can deploy in seconds.
          </p>
        </div>
        <Link
          href="/agents/new"
          className="btn-primary !h-12 !px-8 font-bold uppercase tracking-widest text-xs shadow-lg shadow-violet-500/10"
        >
          Build custom agent
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs mb-8">
        <span className="text-black/60 font-bold uppercase tracking-widest mr-2">Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-xl px-5 py-2 text-xs font-bold transition-all duration-300 border ${activeCategory === cat
              ? 'bg-violet-500 border-violet-500 text-white shadow-xl shadow-violet-500/20 scale-105'
              : 'bg-black/5 border-black/10 text-black/60 hover:bg-black/10 hover:text-black hover:border-black/20'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <article
            key={t.id}
            className="card p-6 flex flex-col justify-between hover:border-violet-500/30 hover:bg-black/5 transition-all group border-black/10 bg-black/[0.02]"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-black/5 flex items-center justify-center text-2xl shadow-inner border border-black/10 group-hover:scale-110 transition-transform">
                    {t.emoji}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-black group-hover:text-violet-600 transition-colors">
                      {t.name}
                    </h2>
                    <p className="text-[10px] text-black/60 font-bold uppercase tracking-widest mt-0.5">{t.category}</p>
                  </div>
                </div>
                {t.badge && (
                  <span className="badge badge-amber !bg-amber-500/10 !text-amber-600 border border-amber-500/20 font-black text-[9px] uppercase tracking-tighter px-2">
                    {t.badge}
                  </span>
                )}
              </div>
              <p className="mt-5 text-sm text-black/60 leading-relaxed font-medium">{t.description}</p>
            </div>

            <div className="mt-8 flex gap-3">
              <Link
                href={`/agents/new?template=${t.id}`}
                className="btn-secondary flex-1 text-center text-[10px] font-black tracking-[0.1em] transition-all py-3"
              >
                PREVIEW
              </Link>
              <Link
                href={`/agents/new?template=${t.id}`}
                className="btn-primary flex-1 text-center text-[10px] font-black tracking-[0.1em] py-3 shadow-lg shadow-violet-500/10"
              >
                USE TEMPLATE
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 rounded-3xl bg-black/[0.03] p-12 text-center border border-black/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="h-16 w-16 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-violet-500/20">
            <Sparkles className="h-8 w-8 text-violet-600" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-4">
            Can&apos;t find the perfect fit?
          </h3>
          <p className="text-black/60 font-medium mb-8">
            Architect a bespoke AI agent from the ground up, tailored specifically to your unique organizational logic and data.
          </p>
          <Link href="/agents/new" className="inline-flex btn-primary !h-14 !px-10 font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-violet-500/20">
            Launch Custom Builder
            <ArrowRight className="ml-3 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
