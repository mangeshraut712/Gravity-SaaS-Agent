import Link from 'next/link';
import React from 'react';

export default function AgentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            My agents
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Create, manage, and monitor all of your AI agents.
          </p>
        </div>
        <Link
          href="/agents/new"
          className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow shadow-purple-900/40 hover:brightness-110"
        >
          New agent
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-gray-950/80 p-8 text-center text-sm text-gray-400">
        <p>You don&apos;t have any agents yet.</p>
        <p className="mt-1">
          Get started by creating your first agent from a template.
        </p>
        <div className="mt-4 flex justify-center gap-3 text-xs">
          <Link
            href="/templates"
            className="rounded-full border border-white/15 px-4 py-2 font-medium text-gray-100 hover:bg-white/5"
          >
            Browse templates
          </Link>
          <Link
            href="/agents/new"
            className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 font-semibold text-white shadow shadow-purple-900/40 hover:brightness-110"
          >
            Build from scratch
          </Link>
        </div>
      </div>
    </div>
  );
}

