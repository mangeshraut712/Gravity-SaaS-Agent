'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import React from 'react';
import { ArrowRight } from 'lucide-react';

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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 animate-slide-up">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
            <span className="text-gradient-rainbow">Agent templates</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Production-ready AI agents you can deploy in seconds.
          </p>
        </div>
        <Link
          href="/agents/new"
          className="btn-primary"
        >
          Build custom agent
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-500">Filter by category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${activeCategory === cat
                ? 'bg-violet-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            className="feature-card p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      {t.name}
                    </h2>
                    <p className="text-[11px] text-gray-500">{t.category}</p>
                  </div>
                </div>
                {t.badge && (
                  <span className="badge badge-amber">
                    {t.badge}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-gray-500">{t.description}</p>
            </div>

            <div className="mt-5 flex gap-2">
              <Link
                href={`/agents/new?template=${t.id}`}
                className="btn-secondary flex-1 text-center text-sm"
              >
                Preview
              </Link>
              <Link
                href={`/agents/new?template=${t.id}`}
                className="btn-primary flex-1 text-center text-sm"
              >
                Use Template
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-gradient-to-r from-violet-100 to-indigo-100 p-8 text-center border border-violet-200">
        <h3 className="text-xl font-semibold text-gray-900">
          Can&apos;t find what you need?
        </h3>
        <p className="mt-2 text-gray-600">
          Build a custom agent tailored to your specific requirements.
        </p>
        <Link href="/agents/new" className="mt-4 inline-flex btn-primary">
          Build Custom Agent
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
