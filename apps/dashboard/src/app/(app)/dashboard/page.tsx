"use client";



import Link from 'next/link';
import React from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Activity,
  Users,
  TrendingUp,
  Zap,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/hooks';

const mockAgents = [
  {
    name: 'Customer Support Bot',
    status: 'Active',
    messagesToday: 87,
    lastActive: '5 min ago',
    type: 'WhatsApp',
  },
  {
    name: 'Lead Qualifier – Landing Page',
    status: 'Active',
    messagesToday: 42,
    lastActive: '18 min ago',
    type: 'Web Widget',
  },
  {
    name: 'Appointment Scheduler – Studio',
    status: 'Paused',
    messagesToday: 0,
    lastActive: 'Yesterday',
    type: 'API',
  },
];

const mockActivity = [
  { text: 'New conversation started on WhatsApp', time: 'Just now', type: 'info' },
  { text: 'Payment received – Pro plan', time: '12 min ago', type: 'success' },
  { text: 'Agent “Lead Qualifier” deployed', time: '1 hour ago', type: 'info' },
  { text: 'Conversation escalated to human', time: '3 hours ago', type: 'warning' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.email?.split('@')[0] || 'Explorer';

  return (
    <div className="p-6 lg:p-10 space-y-10 selection:bg-violet-500/30">
      {/* Welcome + Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold text-black tracking-tight">
            Welcome back, <span className="text-gradient-rainbow capitalize">{displayName}</span>
          </h1>
          <p className="text-black/60 mt-2 text-lg">
            Your AI agents handled <span className="text-emerald-600 font-bold px-1 tracking-tight">234 conversations</span> this week.
          </p>
        </div>

        <div className="flex items-center gap-3 animate-slide-up stagger-1">
          <Link href="/templates" className="btn-secondary !px-5 !py-3 flex items-center gap-2 text-sm">
            <Search className="h-4 w-4" />
            Find Templates
          </Link>
          <Link href="/agents/new" className="btn-primary !px-5 !py-3 flex items-center gap-2 text-sm shadow-lg shadow-violet-500/20">
            <Plus className="h-4 w-4" />
            Create New Agent
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Agents', value: '3 / 5', icon: Zap, color: 'text-violet-600', progress: 60 },
          { label: 'Total Messages', value: '1,247', sub: '/ 5,000 monthly', icon: Users, color: 'text-indigo-600', progress: 25 },
          { label: 'Revenue (MRR)', value: '$147', sub: '+$49 this week', icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Uptime', value: '99.8%', sub: 'All systems online', icon: Activity, color: 'text-cyan-600' },
        ].map((stat, i) => (
          <div key={stat.label} className={`card p-6 animate-scale-in stagger-${i + 1} hover:border-black/10 transition-all group`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-black/60 group-hover:text-black transition-colors uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-bold text-black mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-xl bg-black/5 ${stat.color} group-hover:scale-110 transition-transform shadow-inner`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            {stat.progress !== undefined ? (
              <div className="mt-6">
                <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
                {stat.sub && <p className="text-[11px] text-black/60 mt-2 font-medium">{stat.sub}</p>}
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-[11px] text-black/60 font-medium">{stat.sub}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Agents Table */}
        <div className="lg:col-span-8 card overflow-hidden animate-slide-up stagger-2 border-black/10">
          <div className="p-6 border-b border-black/10 flex items-center justify-between bg-black/[0.02]">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <Zap className="h-5 w-5 text-violet-600" />
              Recent Agents
            </h2>
            <Link href="/agents" className="text-sm text-black/60 hover:text-black flex items-center gap-1 transition-colors group">
              Manage all <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-black/60 border-b border-black/10">
                  <th className="px-6 py-4">Agent Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Messages</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {mockAgents.map((agent) => (
                  <tr key={agent.name} className="group hover:bg-black/5 transition-colors relative">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-black group-hover:text-violet-600 transition-colors">{agent.name}</div>
                      <div className="text-[11px] text-black/60">Last active {agent.lastActive}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-black/60">
                      {agent.type}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${agent.status === 'Active' ? 'badge-teal' : 'badge-amber'
                        } !py-1 !px-3 font-bold uppercase tracking-tighter text-[10px]`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-black font-mono">
                      {agent.messagesToday}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 text-black/50 hover:text-black transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-black/[0.02] border-t border-black/10 text-center">
            <Link href="/agents/new" className="text-sm font-bold text-violet-700 hover:text-violet-800 transition-colors">
              + Create another agent
            </Link>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 card animate-slide-up stagger-3 border-black/10">
          <div className="p-6 border-b border-black/10 bg-black/[0.02]">
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-600" />
              Activity Feed
            </h2>
          </div>
          <div className="p-2">
            <div className="space-y-1">
              {mockActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-black/5 transition-colors group">
                  <div className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${activity.type === 'success' ? 'bg-emerald-500' :
                    activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                    } shadow-[0_0_8px_rgba(0,0,0,0.2)]`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-black/80 group-hover:text-black transition-colors leading-snug">{activity.text}</p>
                    <p className="text-[10px] text-black/60 uppercase font-bold tracking-tight">{activity.time}</p>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-black/60 group-hover:text-black/60 transition-colors" />
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 border-t border-black/10 bg-black/[0.02]">
            <button className="w-full btn-secondary !py-3 text-[11px] font-bold transition-all uppercase tracking-widest">
              View Full Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
