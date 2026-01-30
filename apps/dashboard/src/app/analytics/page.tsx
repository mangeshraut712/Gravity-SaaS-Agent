'use client';

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
import { supabaseClient } from '../../lib/supabaseClient';

interface DailyPoint {
  day: string;
  messages: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = React.useState(true);
  const [totalMessages, setTotalMessages] = React.useState(0);
  const [daily, setDaily] = React.useState<DailyPoint[]>([]);

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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-semibold text-white sm:text-3xl">
        Analytics
      </h1>
      <p className="mt-1 text-sm text-gray-400">
        Track conversations and agent performance over time.
      </p>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-white/10 bg-gray-950/80 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">
                Messages in the last 7 days
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {totalMessages}
              </p>
            </div>
            {loading && (
              <p className="text-[11px] text-gray-500">
                Loading conversation data…
              </p>
            )}
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily}>
                <defs>
                  <linearGradient id="messagesArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1F2937"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  axisLine={{ stroke: '#374151' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  axisLine={{ stroke: '#374151' }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderRadius: 8,
                    border: '1px solid #4B5563',
                    padding: 8,
                    fontSize: 12,
                    color: '#E5E7EB',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="messages"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#messagesArea)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gray-950/80 p-5 text-xs text-gray-300">
          <p className="text-xs font-semibold text-gray-200">
            Key insights (beta)
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              • Peak days and hours will appear here as your agents receive more
              traffic.
            </li>
            <li>
              • Conversation outcomes (resolved vs escalated) can be tracked via
              additional analytics events.
            </li>
            <li>
              • Export options (CSV) and more detailed charts can be added as
              usage grows.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

