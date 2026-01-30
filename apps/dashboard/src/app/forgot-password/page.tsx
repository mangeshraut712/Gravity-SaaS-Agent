'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { supabaseClient } from '../../lib';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/login`,
        },
      );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while sending the reset email.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute -top-24 right-12 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/60">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Password reset
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Reset your password
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Enter the email connected to your AgentFlow account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                placeholder="you@company.com"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700" role="alert">
                {error}
              </p>
            )}
            {sent && !error && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700" role="status">
                Reset link sent. Please check your inbox.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? 'Sending reset link…' : 'Send reset link'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Remembered your password?{' '}
            <Link
              href="/login"
              className="font-semibold text-slate-900 underline decoration-emerald-400/60 underline-offset-4 transition hover:text-emerald-700"
            >
              Go back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
