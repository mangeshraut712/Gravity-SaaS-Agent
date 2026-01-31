"use client";



import React from 'react';
import dynamic from 'next/dynamic';
import { supabaseClient } from '@/lib';

// Dynamically import Recharts components to prevent SSR issues
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

interface DailyPoint {
  day: string;
  messages: number;
}

export default function AnalyticsPage() {
  const [mounted, setMounted] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [totalMessages, setTotalMessages] = React.useState(0);
  const [daily, setDaily] = React.useState<DailyPoint[]>([]);

  React.useEffect(() => {
    setMounted(true);
    void (async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const { data, error } = await supabaseClient
          .from('analytics_events')
          .select('created_at')
          .eq('event_type', 'message_sent')
          .gte('created_at', sevenDaysAgo.toISOString())
          .order('created_at', { ascending: true });

        if (error || !data) {
          setLoading(false);
          return;
        }

        setTotalMessages(data.length);

        const buckets = new Map<string, number>();
        for (const row of data) {
          const date = new Date(row.created_at);
          const key = date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          });
          buckets.set(key, (buckets.get(key) ?? 0) + 1);
        }

        const points: DailyPoint[] = [];
        for (let i = 6; i >= 0; i -= 1) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const label = d.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          });
          points.push({
            day: label,
            messages: buckets.get(label) ?? 0,
          });
        }

        setDaily(points);
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 animate-slide-up selection:bg-violet-500/30">
      <h1 className="text-2xl font-bold text-black sm:text-3xl tracking-tight">
        <span className="text-gradient-rainbow">Analytics</span>
      </h1>
      <p className="mt-1 text-sm text-black/60">
        Track conversations and agent performance across your workspace.
      </p>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
        <div className="card p-6 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-black/60 uppercase tracking-widest group-hover:text-black transition-colors">
                Messages in the last 7 days
              </p>
              <p className="mt-2 text-3xl font-bold text-gradient-violet-indigo tracking-tight">
                {totalMessages}
              </p>
            </div>
            {loading && (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                <p className="text-[11px] text-black/60 font-medium">Syncing data...</p>
              </div>
            )}
          </div>
          <div className="mt-8 h-64 w-full">
            {mounted && daily.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={daily}>
                  <defs>
                    <linearGradient id="messagesArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0,0,0,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: '#1f2937', fontWeight: 600 }}
                    axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#1f2937', fontWeight: 600 }}
                    axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 12,
                      border: '1px solid rgba(0,0,0,0.08)',
                      padding: 12,
                      fontSize: 12,
                      color: '#000000',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.12)'
                    }}
                    itemStyle={{ color: '#6d28d9', fontWeight: 'bold' }}
                    cursor={{ stroke: '#8B5CF6', strokeWidth: 2, strokeDasharray: '3 3' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="messages"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fill="url(#messagesArea)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : !loading ? (
              <div className="flex h-full flex-col items-center justify-center text-black/60 space-y-2">
                <div className="h-12 w-12 rounded-full bg-black/5 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-black/60" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">No activity data yet</p>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-violet-500/20 border-t-violet-500" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-6 border-black/10 hover:border-black/20 transition-all hover:bg-black/[0.03]">
            <p className="text-[10px] text-black/60 uppercase font-black tracking-[0.2em]">Avg response time</p>
            <p className="mt-1 text-2xl font-bold text-black tracking-tight">~1.2s</p>
            <div className="mt-3 h-1 w-full bg-black/10 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-emerald-500/50" />
            </div>
          </div>
          <div className="card p-6 border-black/10 hover:border-black/20 transition-all hover:bg-black/[0.03]">
            <p className="text-[10px] text-black/60 uppercase font-black tracking-[0.2em]">Resolution rate</p>
            <p className="mt-1 text-2xl font-bold text-gradient-teal-cyan tracking-tight">87%</p>
            <div className="mt-3 h-1 w-full bg-black/10 rounded-full overflow-hidden">
              <div className="h-full w-[87%] bg-teal-500/50" />
            </div>
          </div>
          <div className="card p-6 border-black/10 hover:border-black/20 transition-all hover:bg-black/[0.03]">
            <p className="text-[10px] text-black/60 uppercase font-black tracking-[0.2em]">Active agents</p>
            <p className="mt-1 text-2xl font-bold text-gradient-coral-violet tracking-tight">3</p>
          </div>
          <div className="card p-6 border-black/10 hover:border-black/20 transition-all hover:bg-black/[0.03]">
            <p className="text-[10px] text-black/60 uppercase font-black tracking-[0.2em]">Conversations today</p>
            <p className="mt-1 text-2xl font-bold text-black tracking-tight">142</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Minimal placeholder icons
const Activity = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
