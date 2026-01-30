'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { supabaseClient } from '../../lib';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabaseClient.auth.signInWithPassword(
        {
          email,
          password,
        },
      );

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while logging in.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left side - Branding */}
          <div className="hidden flex-col justify-center gap-8 lg:flex animate-slide-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-coral-500 to-violet-500" />
              <span className="text-gradient-rainbow font-bold">Gravity</span>
            </div>

            <div>
              <h1 className="text-4xl font-semibold leading-tight text-gray-900">
                Welcome back to the <span className="text-gradient-rainbow">workspace</span>.
              </h1>
              <p className="mt-4 text-base text-gray-500">
                Manage agents, monitor conversations, and ship updates faster than ever.
              </p>
            </div>

            <div className="feature-card p-5">
              <p className="text-sm font-semibold text-gray-900">Today&apos;s focus</p>
              <p className="mt-2 text-sm text-gray-500">
                24 active agents · 3k conversations · 97% resolution rate
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="badge badge-teal">Live</span>
                <span className="text-gray-400">Last synced 2 minutes ago</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="stat-card">
                <p className="text-2xl font-bold text-gradient-violet-indigo">4.9★</p>
                <p className="text-xs text-gray-500">Customer rating</p>
              </div>
              <div className="stat-card">
                <p className="text-2xl font-bold text-gradient-coral-violet">8 min</p>
                <p className="text-xs text-gray-500">Avg response time</p>
              </div>
              <div className="stat-card">
                <p className="text-2xl font-bold text-gradient-teal-cyan">99.2%</p>
                <p className="text-xs text-gray-500">Uptime</p>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="mx-auto w-full max-w-md animate-scale-in">
            <div className="card p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Welcome back
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                    Sign in to <span className="text-gradient-rainbow">Gravity</span>
                  </h2>
                </div>
                <div className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Use your workspace credentials to continue.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-600">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-gray-500 hover:text-violet-600 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-2xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm text-coral-700">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex h-12 w-full items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="loading-dots">
                        <div /><div /><div />
                      </span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
                <div className="h-px flex-1 bg-gray-200" />
                Or continue with
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="btn-secondary flex h-11 items-center justify-center gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button className="btn-secondary flex h-11 items-center justify-center gap-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="font-semibold text-gray-900 hover:text-violet-600 transition-colors"
                >
                  Create one free
                </Link>
              </p>
            </div>

            <p className="mt-5 text-center text-xs text-gray-400">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-gray-500 hover:text-violet-600">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-gray-500 hover:text-violet-600">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
