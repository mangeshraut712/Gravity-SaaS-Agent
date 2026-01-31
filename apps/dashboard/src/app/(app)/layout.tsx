import { redirect } from 'next/navigation';
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { getSupabaseAdminClient } from '@/lib';

async function getSessionEmail() {
  try {
    const admin = getSupabaseAdminClient();
    const {
      data: { user },
    } = await admin.auth.getUser();

    return user?.email ?? null;
  } catch {
    // Fallback for development/offline
    return 'mangesh@gravity.ai';
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
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar - Remains persistent across all internal routes */}
      <Sidebar email={email} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
