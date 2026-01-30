import React from 'react';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-semibold text-white sm:text-3xl">
        Settings
      </h1>
      <p className="mt-1 text-sm text-gray-400">
        Update your profile, account security, and branding.
      </p>
      <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-gray-950/80 p-6 text-sm text-gray-300">
        Detailed settings (profile, notifications, branding, API keys) will
        live here as we wire up more of the AgentFlow experience.
      </div>
    </div>
  );
}

