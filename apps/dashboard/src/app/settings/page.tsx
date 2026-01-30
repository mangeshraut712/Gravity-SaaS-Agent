'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { User, Bell, Shield, CreditCard, Palette, Key } from 'lucide-react';

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
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 animate-slide-up">
      <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
        <span className="text-gradient-rainbow">Settings</span>
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage your account, preferences, and workspace settings.
      </p>

      <div className="mt-8 grid gap-4">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className="card p-6 flex items-start gap-4 hover:border-violet-200 transition-colors cursor-pointer group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 group-hover:bg-violet-200 transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{section.description}</p>
              </div>
              <div className="flex items-center text-gray-400 group-hover:text-violet-500 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-r from-violet-100 to-indigo-100 p-6 border border-violet-200">
        <h3 className="text-lg font-semibold text-gray-900">Need help?</h3>
        <p className="mt-2 text-sm text-gray-600">
          Our support team is here to help you with any questions or issues.
        </p>
        <button className="mt-4 btn-primary text-sm">
          Contact Support
        </button>
      </div>
    </div>
  );
}
