'use client';

import Link from 'next/link';
import React from 'react';

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
    description:
      'Book appointments, send reminders, and sync with your calendar tools.',
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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Agent templates
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Production-ready AI agents you can deploy in seconds.
          </p>
        </div>
        <Link
          href="/agents/new"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow shadow-purple-900/40 hover:brightness-110"
        >
          Build custom agent
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-400">Filter by category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-3 py-1 text-[11px] ${
              activeCategory === cat
                ? 'bg-white text-gray-900'
                : 'bg-gray-900/80 text-gray-200 ring-1 ring-white/10 hover:bg-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <article
            key={t.id}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-gray-950/80 p-5 text-sm text-gray-200 shadow-sm shadow-black/40 ring-1 ring-white/10"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{t.emoji}</span>
                  <div>
                    <h2 className="text-sm font-semibold text-white sm:text-base">
                      {t.name}
                    </h2>
                    <p className="text-[11px] text-gray-400">{t.category}</p>
                  </div>
                </div>
                {t.badge && (
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-300 ring-1 ring-amber-500/40">
                    {t.badge}
                  </span>
                )}
              </div>
              <p className="mt-3 text-xs text-gray-300">{t.description}</p>
            </div>

            <div className="mt-5 flex gap-2 text-xs">
              <Link
                href={`/agents/new?template=${t.id}`}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-white/5 px-3 py-2 font-medium text-gray-100 ring-1 ring-white/15 hover:bg-white/10"
              >
                Preview
              </Link>
              <Link
                href={`/agents/new?template=${t.id}`}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-3 py-2 font-semibold text-white shadow shadow-purple-900/40 hover:brightness-110"
              >
                Use this template
              </Link>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-gray-400">
        Can&apos;t find what you need?{' '}
        <span className="font-medium text-gray-200">
          Build a custom agent from scratch →
        </span>
      </p>
    </div>
  );
}

