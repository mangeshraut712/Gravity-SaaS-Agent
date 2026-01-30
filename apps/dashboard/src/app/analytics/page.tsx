'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { supabaseClient } from '../../lib';

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
  }, []);

  React.useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 animate-slide-up">
      <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
        <span className="text-gradient-rainbow">Analytics</span>
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Track conversations and agent performance over time.
      </p>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                Messages in the last 7 days
              </p>
              <p className="mt-1 text-2xl font-bold text-gradient-violet-indigo">
                {totalMessages}
              </p>
            </div>
            {loading && (
              <p className="text-[11px] text-gray-400">
                Loading conversation data…
              </p>
            )}
          </div>
          <div className="mt-4 h-56">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={daily}>
                  <defs>
                    <linearGradient id="messagesArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 8,
                      border: '1px solid #E5E7EB',
                      padding: 8,
                      fontSize: 12,
                      color: '#374151',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="messages"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fill="url(#messagesArea)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="loading-dots">
                  <div /><div /><div />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="stat-card p-5">
            <p className="text-xs text-gray-500">Avg response time</p>
            <p className="mt-1 text-xl font-bold text-gray-900">~1.2s</p>
          </div>
          <div className="stat-card p-5">
            <p className="text-xs text-gray-500">Resolution rate</p>
            <p className="mt-1 text-xl font-bold text-gradient-teal-cyan">87%</p>
          </div>
          <div className="stat-card p-5">
            <p className="text-xs text-gray-500">Active agents</p>
            <p className="mt-1 text-xl font-bold text-gradient-coral-violet">3</p>
          </div>
          <div className="stat-card p-5">
            <p className="text-xs text-gray-500">Conversations today</p>
            <p className="mt-1 text-xl font-bold text-gray-900">142</p>
          </div>
        </div>
      </section>
    </div>
  );
}
