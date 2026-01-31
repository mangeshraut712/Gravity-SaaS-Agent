"use client";

import React from 'react';
import { User, Bell, Shield, CreditCard, Palette, Key, ChevronRight } from 'lucide-react';

const settingsSections = [
  {
    id: 'profile',
    title: 'Profile',
    description: 'Manage your personal information and account details',
    icon: User,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure email and push notification preferences',
    icon: Bell,
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Update password and enable two-factor authentication',
    icon: Shield,
  },
  {
    id: 'billing',
    title: 'Billing',
    description: 'Manage payment methods and subscription details',
    icon: CreditCard,
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize the look and feel of your dashboard',
    icon: Palette,
  },
  {
    id: 'api',
    title: 'API Keys',
    description: 'Generate and manage API keys for integrations',
    icon: Key,
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 animate-slide-up selection:bg-violet-500/30 text-black">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-gradient-rainbow">Settings</span>
        </h1>
        <p className="mt-2 text-black/60">
          Manage your account, preferences, and workspace settings.
        </p>
      </div>

      <div className="grid gap-4">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className="card p-6 flex items-start gap-5 hover:border-violet-500/30 hover:bg-black/5 transition-all cursor-pointer group border-black/10 bg-black/[0.02]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 group-hover:bg-violet-500/20 group-hover:scale-110 transition-all shadow-inner border border-violet-500/10">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-black group-hover:text-violet-600 transition-colors">{section.title}</h3>
                <p className="mt-1 text-sm text-black/60 leading-relaxed font-medium">{section.description}</p>
              </div>
              <div className="flex items-center self-center text-black/50 group-hover:text-violet-600 group-hover:translate-x-1 transition-all">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 rounded-2xl bg-black/[0.03] p-10 border border-black/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-black">Need expert assistance?</h3>
            <p className="mt-2 text-black/60 font-medium">
              Our support engineers are available 24/7 to help you optimize your agents.
            </p>
          </div>
          <button className="btn-primary !h-12 !px-8 font-bold uppercase tracking-widest text-xs whitespace-nowrap shadow-lg shadow-violet-500/10">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
