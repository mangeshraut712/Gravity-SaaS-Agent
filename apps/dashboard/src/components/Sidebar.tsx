"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    Bot
} from 'lucide-react';
import { cn } from '@/lib';

interface SidebarProps {
    email: string;
}

const navItems = [
    { name: 'Dashboard', icon: BarChart2, href: '/dashboard' },
    { name: 'My Agents', icon: Bot, href: '/agents' },
    { name: 'Conversations', icon: MessageSquare, href: '/conversations' },
    { name: 'Analytics', icon: TrendingUp, href: '/analytics' },
    { name: 'Billing', icon: Wallet, href: '/billing' },
    { name: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar({ email }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(path);
    };

    return (
        <aside className="hidden w-72 flex-col px-6 py-8 sm:flex h-screen sticky top-0 bg-white border-r border-gray-200 z-20">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
                    <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                    <p className="text-xl font-black text-black tracking-tighter">Gravity</p>
                    <p className="text-[10px] text-violet-600 uppercase tracking-[0.2em] font-black">2026 Edition</p>
                </div>
            </Link>

            <nav className="mt-12 space-y-1.5 px-1">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative",
                                active
                                    ? "bg-violet-50 text-violet-700 border border-violet-200"
                                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                            )}
                        >
                            {active && (
                                <div className="absolute left-[-24px] w-1.5 h-6 bg-violet-600 rounded-r-full" />
                            )}
                            <item.icon className={cn(
                                "h-5 w-5 transition-all duration-200",
                                active ? "text-violet-600" : "group-hover:text-violet-600"
                            )} />
                            <span className="text-sm font-bold tracking-tight">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-4">
                <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-lg">
                            {email.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="truncate flex-1">
                            <p className="text-sm font-bold text-black truncate">{email}</p>
                            <p className="text-[10px] text-violet-600 font-black tracking-widest uppercase mt-0.5">Enterprise Plan</p>
                        </div>
                    </div>

                    <div className="h-px w-full bg-gray-200 my-4" />

                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/settings" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white text-[10px] font-black text-gray-600 hover:text-black hover:bg-gray-100 transition-all border border-gray-200 uppercase tracking-widest">
                            <LifeBuoy className="h-4 w-4" />
                            Support
                        </Link>
                        <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-[10px] font-black text-red-600 hover:text-red-700 hover:bg-red-100 transition-all border border-red-200 uppercase tracking-widest">
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
