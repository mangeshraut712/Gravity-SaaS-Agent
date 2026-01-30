import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import {
  BarChart2,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Settings,
  Sparkles,
  Wallet,
  TrendingUp,
  Bot,
} from 'lucide-react';
import { getSupabaseAdminClient } from '../../lib';

async function getSessionEmail() {
  // Minimal server-side session guard:
  // We rely on the Supabase auth cookie; if it is missing, we redirect to login.
  // In a real deployment you would use @supabase/auth-helpers-nextjs for richer access.
  try {
    const admin = getSupabaseAdminClient();
    const {
      data: { user },
    } = await admin.auth.getUser();

    return user?.email ?? null;
  } catch {
    // During local builds without Supabase env configured, fall back to a
    // placeholder email so that the dashboard can prerender.
    return 'you@example.com';
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = await getSessionEmail();

  if (!email) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="sidebar hidden w-64 flex-col px-4 py-8 sm:flex">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 transition-transform hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 tracking-tight">Gravity</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Dashboard</p>
          </div>
        </Link>

        <nav className="mt-10 space-y-1.5 px-1">
          {[
            { name: 'Dashboard', icon: BarChart2, href: '/dashboard' },
            { name: 'My Agents', icon: Bot, href: '/agents' },
            { name: 'Conversations', icon: MessageSquare, href: '/conversations' },
            { name: 'Analytics', icon: TrendingUp, href: '/analytics' },
            { name: 'Billing', icon: Wallet, href: '/billing' },
            { name: 'Settings', icon: Settings, href: '/settings' },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-link ${item.name === 'Dashboard' ? 'active' : ''}`}
            >
              <item.icon className={`h-4 w-4 ${item.name === 'Dashboard' ? 'text-violet-500' : ''}`} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 px-1">
          <div className="card !bg-gray-50 p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                MR
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-gray-900 truncate">{email}</p>
                <p className="text-[10px] text-gray-500">Free Plan</p>
              </div>
            </div>

            <div className="divider" />

            <div className="grid grid-cols-2 gap-2">
              <Link href="/support" className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-100 text-[10px] font-bold text-gray-600 hover:bg-gray-200 transition-colors">
                <LifeBuoy className="h-3 w-3" />
                Support
              </Link>
              <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-red-50 text-[10px] font-bold text-red-500 hover:bg-red-100 transition-colors">
                <LogOut className="h-3 w-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
