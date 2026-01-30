import Link from 'next/link';
import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck, Zap } from 'lucide-react';
import React from 'react';

const stats = [
  { label: 'Agents Deployed', value: '1,000+' },
  { label: 'Revenue Processed', value: '$500K+' },
  { label: 'Average Rating', value: '4.9★' },
];

const features = [
  {
    title: 'Deploy in Minutes',
    description: 'Choose a template, customize, and launch. No engineering team required.',
    icon: Zap,
  },
  {
    title: 'Built-in Monetization',
    description: 'Powered by Polar.sh so you can start charging from day one.',
    icon: CheckCircle2,
  },
  {
    title: 'Scale Effortlessly',
    description: 'Multi-tenant architecture that handles 1 or 10,000 conversations.',
    icon: ShieldCheck,
  },
  {
    title: 'WhatsApp Integration',
    description: 'Connect your WhatsApp Business API and chat where your customers already are.',
    icon: MessageCircle,
  },
];

const templates = [
  {
    name: 'Customer Service Bot',
    badge: 'Most Popular',
    description: 'Answer FAQs, resolve issues, and escalate to humans when needed.',
    emoji: '🛎️',
  },
  {
    name: 'Sales Qualifier',
    badge: 'High Converting',
    description: 'Qualify leads, book meetings, and push qualified leads into your CRM.',
    emoji: '💼',
  },
  {
    name: 'Appointment Scheduler',
    description: 'Book appointments, send reminders, and sync with your calendar.',
    emoji: '📅',
  },
  {
    name: 'FAQ Assistant',
    description: 'Answer common questions based on your existing knowledge base.',
    emoji: '❓',
  },
  {
    name: 'Lead Capture Bot',
    badge: 'New',
    description: 'Collect contact info, validate emails, and grow your mailing list.',
    emoji: '🎯',
  },
];

const pricing = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    highlight: false,
    description: 'Perfect to validate your first agent idea.',
    features: [
      '1 agent',
      '100 messages / month',
      'Web chat only',
      '"Powered by Gravity" branding',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    highlight: true,
    description: 'For solopreneurs and agencies launching serious agent businesses.',
    features: [
      '5 agents',
      '5,000 messages / month',
      'WhatsApp + Web + API',
      'Remove branding',
      'Custom domain',
      'Priority support',
      '14-day free trial',
    ],
  },
  {
    name: 'Business',
    price: '$199',
    period: '/month',
    highlight: false,
    description: 'For teams running multiple clients or high-volume agents.',
    features: [
      'Unlimited agents',
      '25,000 messages / month',
      'White-label everything',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-500/20">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              <span className="text-gradient-rainbow">Gravity</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-500 md:flex">
            <Link href="#features" className="transition-colors hover:text-violet-600">Features</Link>
            <Link href="#templates" className="transition-colors hover:text-violet-600">Templates</Link>
            <Link href="#pricing" className="transition-colors hover:text-violet-600">Pricing</Link>
            <Link href="#how-it-works" className="transition-colors hover:text-violet-600">How it works</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 md:block">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary flex items-center gap-2 !px-5 !py-2.5 text-sm">
              Start free trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="overflow-hidden px-6 pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-xs font-semibold text-violet-600 ring-1 ring-violet-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
                </span>
                Transform your business with AI
              </div>

              <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Launch your AI agent business{" "}
                <span className="text-gradient-rainbow">in under 5 minutes.</span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg text-gray-500 leading-relaxed">
                Gravity is the production-ready platform for agencies and creators
                to deploy high-performance AI agents to WhatsApp, Web, and API
                without writing a single line of code.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/signup" className="btn-primary !px-8 !py-4 text-base">
                  Get Started Free
                </Link>
                <Link href="#how-it-works" className="btn-secondary !px-8 !py-4 text-base">
                  Watch Demo
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8 border-t border-gray-100 pt-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-gradient-violet-indigo">{s.value}</p>
                    <p className="text-sm text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Mockup */}
            <div className="relative animate-scale-in">
              <div className="card relative p-2 shadow-2xl">
                <div className="rounded-2xl bg-gray-50 p-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Smart Concierge</p>
                        <p className="text-[11px] text-teal-500 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                          Online • WhatsApp Connected
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl bg-white border border-gray-100 px-4 py-3 text-sm text-gray-700">
                        Hi! I need to book a consultation for next Tuesday.
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 text-sm text-white shadow-lg shadow-violet-500/20">
                        I can help with that! We have 10 AM and 2 PM available. Which works best?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl bg-white border border-gray-100 px-4 py-3 text-sm text-gray-700">
                        10 AM sounds perfect.
                      </div>
                    </div>
                    <div className="animate-pulse flex justify-end">
                      <div className="max-w-[80%] rounded-2xl bg-gray-100 border border-gray-200 px-4 py-3 text-sm text-gray-500 italic">
                        Agent is confirming...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-5xl">
            Everything you need for <span className="text-gradient-rainbow">AI Automation</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Powerful tools to build, deploy, and scale your AI workforce.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, idx) => (
            <div key={f.title} className={`feature-card p-8 stagger-${(idx % 4) + 1} animate-slide-up`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 ring-1 ring-violet-200">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">{f.title}</h3>
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-5xl">
                Start with <span className="text-gradient-rainbow">Proven Templates</span>
              </h2>
              <p className="mt-4 text-gray-500 text-lg">
                Don&apos;t start from scratch. Use our battle-tested templates to launch faster.
              </p>
            </div>
            <Link href="/templates" className="btn-secondary whitespace-nowrap">
              Explore All <ArrowRight className="ml-2 h-4 w-4 inline" />
            </Link>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {templates.slice(0, 3).map((t) => (
              <div key={t.name} className="card group overflow-hidden">
                <div className="p-8">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{t.emoji}</span>
                    {t.badge && (
                      <span className="badge badge-violet">{t.badge}</span>
                    )}
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-gray-900">{t.name}</h3>
                  <p className="mt-4 text-gray-500 text-sm leading-relaxed">{t.description}</p>
                </div>
                <div className="border-t border-gray-100 p-6 bg-gray-50 transition-colors group-hover:bg-gray-100">
                  <Link href="/signup" className="flex items-center justify-center gap-2 text-sm font-bold text-gray-900">
                    Deploy Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-5xl">
            Simple, <span className="text-gradient-rainbow">Transparent</span> Pricing
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Scales with your business. No hidden fees.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {pricing.map((tier) => (
            <div key={tier.name} className={`relative flex flex-col p-8 rounded-3xl ${tier.highlight
              ? 'bg-gradient-to-b from-violet-50 to-indigo-50 ring-2 ring-violet-200 shadow-xl'
              : 'card'
              }`}>
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-[10px] font-bold uppercase tracking-wider text-white">
                  Best Value
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{tier.description}</p>

              <div className="mt-8 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-gray-900">{tier.price}</span>
                <span className="text-gray-500">{tier.period}</span>
              </div>

              <ul className="mt-10 space-y-4 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`mt-12 w-full text-center py-4 rounded-xl font-bold transition-all ${tier.highlight
                  ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:shadow-xl hover:shadow-violet-500/40'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
              >
                {tier.name === 'Free' ? 'Get Started' : 'Start Trial'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            How it <span className="text-gradient-violet-indigo">works</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Launch your AI agent in 4 simple steps. No coding required.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white font-bold text-xl shadow-lg shadow-violet-500/20 mb-6">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Choose a Template</h3>
            <p className="text-gray-600 leading-relaxed">
              Select from our library of proven templates: Customer Service, Sales Qualifier, Appointment Scheduler, and more.
            </p>
          </div>

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white font-bold text-xl shadow-lg shadow-indigo-500/20 mb-6">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Customize Your Agent</h3>
            <p className="text-gray-600 leading-relaxed">
              Configure personality, knowledge base, and responses. Upload your FAQs or connect to your existing docs.
            </p>
          </div>

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold text-xl shadow-lg shadow-blue-500/20 mb-6">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Connect Channels</h3>
            <p className="text-gray-600 leading-relaxed">
              Deploy to WhatsApp, embed on your website, or use our API. Multi-channel by default.
            </p>
          </div>

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white font-bold text-xl shadow-lg shadow-cyan-500/20 mb-6">
              4
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Launch & Monetize</h3>
            <p className="text-gray-600 leading-relaxed">
              Go live instantly. Set up pricing with Polar.sh integration and start earning from your AI agent.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 px-8 py-4 border border-violet-100">
            <svg className="h-6 w-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">
              Average setup time: <span className="text-violet-600">4 minutes 32 seconds</span>
            </span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-violet-100 via-indigo-100 to-teal-100 p-12 md:p-24 text-center border border-gray-100">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-6xl max-w-4xl mx-auto leading-tight">
            Ready to build your <span className="text-gradient-rainbow">AI Empire?</span>
          </h2>
          <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto">
            Join 1,000+ businesses automating their growth with Gravity.
            No credit card required to start.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/signup" className="btn-primary !px-10 !py-5 text-lg w-full sm:w-auto">
              Create Free Account
            </Link>
            <div className="flex -space-x-3 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gradient-to-br from-violet-400 to-indigo-400" />
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 ring-2 ring-white text-[10px] font-bold text-gray-700">
                +1k
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-violet-500" />
              <span className="text-xl font-bold text-gray-900 tracking-tight"><span className="text-gradient-violet-indigo">Gravity</span></span>
            </div>

            <div className="flex flex-wrap justify-center gap-10 text-sm font-medium text-gray-500">
              <a href="https://twitter.com/gravity_ai" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors">Twitter</a>
              <a href="https://github.com/mangeshraut712/Gravity-SaaS-Agent" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors">GitHub</a>
              <a href="https://discord.gg/gravity" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors">Discord</a>
              <Link href="/contact" className="hover:text-violet-600 transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
            © 2026 Gravity AI Inc. All rights reserved. Built with ❤️ for the AI community.
          </div>
        </div>
      </footer>
    </div>
  );
}
