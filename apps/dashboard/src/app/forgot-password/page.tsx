'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { supabaseClient } from '@/lib';

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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to login
        </Link>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-10">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-black text-black tracking-tight">Gravity</span>
            <span className="text-[10px] text-violet-600 block uppercase tracking-[0.2em] font-bold -mt-1">AI Agents</span>
          </div>
        </Link>

        {/* Reset Card */}
        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-xl">
          {sent && !error ? (
            <div className="text-center py-6">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold text-black mb-3">Check your inbox</h1>
              <p className="text-gray-600 mb-8">
                We&apos;ve sent a password reset link to<br />
                <span className="text-black font-medium">{email}</span>
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-gray-100 border border-gray-200 text-black font-medium hover:bg-gray-200 transition-all"
              >
                Return to login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-black">Reset your password</h1>
                <p className="text-gray-600 mt-2">Enter the email connected to your Gravity account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Remember your password?{' '}
          <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
