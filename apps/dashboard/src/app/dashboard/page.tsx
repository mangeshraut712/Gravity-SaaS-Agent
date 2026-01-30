'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import React from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Activity,
  Users,
  TrendingUp,
  Zap,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

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
  return (
    <div className="p-6 lg:p-10 space-y-10">
      {/* Welcome + Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome back, <span className="gradient-text">Mangesh</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Your AI agents handled <span className="text-emerald-400 font-semibold px-1">234 conversations</span> this week.
          </p>
        </div>

        <div className="flex items-center gap-3 animate-slide-up stagger-1">
          <Link href="/templates" className="btn-secondary !px-5 !py-3 flex items-center gap-2 text-sm">
            <Search className="h-4 w-4" />
            Find Templates
          </Link>
          <Link href="/agents/new" className="btn-primary !px-5 !py-3 flex items-center gap-2 text-sm">
            <Plus className="h-4 w-4" />
            Create New Agent
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Agents', value: '3 / 5', icon: Zap, color: 'text-purple-400', progress: 60 },
          { label: 'Total Messages', value: '1,247', sub: '/ 5,000 monthly', icon: Users, color: 'text-blue-400', progress: 25 },
          { label: 'Revenue (MRR)', value: '$147', sub: '+$49 this week', icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Uptime', value: '99.8%', sub: 'All systems online', icon: Activity, color: 'text-orange-400' },
        ].map((stat, i) => (
          <div key={stat.label} className={`card p-6 animate-scale-in stagger-${i + 1}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            {stat.progress !== undefined ? (
              <div className="mt-6">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
                {stat.sub && <p className="text-[11px] text-gray-500 mt-2">{stat.sub}</p>}
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-[11px] text-gray-500">{stat.sub}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Agents Table */}
        <div className="lg:col-span-8 card overflow-hidden animate-slide-up stagger-2">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-400" />
              Recent Agents
            </h2>
            <Link href="/agents" className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
              Manage all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-white/5">
                  <th className="px-6 py-4">Agent Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Messages</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockAgents.map((agent) => (
                  <tr key={agent.name} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{agent.name}</div>
                      <div className="text-[11px] text-gray-500">Last active {agent.lastActive}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {agent.type}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${agent.status === 'Active' ? 'badge-success' : 'badge-warning'
                        }`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-100">
                      {agent.messagesToday}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 text-gray-500 hover:text-white transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-white/[0.01] border-t border-white/5 text-center">
            <Link href="/agents/new" className="text-sm font-medium text-purple-400 hover:text-purple-300">
              + Create another agent
            </Link>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 card animate-slide-up stagger-3">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" />
              Activity Feed
            </h2>
          </div>
          <div className="p-2">
            <div className="space-y-1">
              {mockActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-colors group">
                  <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${activity.type === 'success' ? 'bg-emerald-500' :
                    activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-200 group-hover:text-white transition-colors">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <ArrowUpRight className="h-3 w-3 text-gray-600 group-hover:text-gray-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 border-t border-white/5">
            <button className="w-full btn-secondary !py-2.5 text-xs font-semibold">
              View Full Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

