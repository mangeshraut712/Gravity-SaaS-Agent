'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useState } from "react";
import { MessageSquare, Search, Filter, ExternalLink, Calendar, Bot, Users } from "lucide-react";
import { cn, supabaseClient } from "../../lib";
import { useAuth } from "../../hooks";

interface Conversation {
    id: string;
    user_identifier: string;
    status: "active" | "resolved" | "escalated";
    started_at: string;
    last_message_at: string;
    agent_name: string;
}

function ConversationsContent() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function loadConversations() {
            if (!user) return;

            try {
                const { data, error } = await supabaseClient
                    .from("conversations")
                    .select(`
            id, 
            user_identifier, 
            status, 
            started_at, 
            last_message_at,
            agents (
              name
            )
          `)
                    .order("last_message_at", { ascending: false });

                if (error) throw error;

                if (data) {
                    const formatted = data.map((c: any) => ({
                        id: c.id,
                        user_identifier: c.user_identifier || "Anonymous",
                        status: c.status,
                        started_at: c.started_at,
                        last_message_at: c.last_message_at,
                        agent_name: c.agents?.name || "Unknown Agent"
                    }));
                    setConversations(formatted);
                }
            } catch (error) {
                console.error("Error loading conversations:", error);
            } finally {
                setLoading(false);
            }
        }

        loadConversations();
    }, [user]);

    const filtered = conversations.filter(c =>
        c.user_identifier.toLowerCase().includes(search.toLowerCase()) ||
        c.agent_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-slide-up bg-white min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        <span className="text-gradient-rainbow">Conversations</span>
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Monitor real-time interactions across all your deployed agents.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </button>
                    <button className="btn-primary gap-2">
                        <ExternalLink className="h-4 w-4" /> Export logs
                    </button>
                </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="stat-card flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                        <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Chats</p>
                        <p className="text-2xl font-bold text-gray-900">{conversations.filter(c => c.status === 'active').length}</p>
                    </div>
                </div>
                <div className="stat-card flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
                        <Bot className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resolution Rate</p>
                        <p className="text-2xl font-bold text-gradient-teal-cyan">92%</p>
                    </div>
                </div>
                <div className="stat-card flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unique Users</p>
                        <p className="text-2xl font-bold text-gray-900">428</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by user or agent..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field pl-10"
                />
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent mx-auto" />
                        <p className="mt-4 text-gray-500">Syncing conversations...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-20 text-center space-y-4">
                        <div className="h-20 w-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-300">
                            <MessageSquare className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No history found</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">
                            Your agents haven&apos;t started any conversations yet. Deploy an agent to start receiving messages.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-500">User</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-500">Agent</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-500">Status</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-500">Started</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-500">Last Activity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((c) => (
                                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                        <td className="py-4 px-6 font-semibold text-gray-900">
                                            {c.user_identifier}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="badge badge-violet">
                                                {c.agent_name}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                                                c.status === "active"
                                                    ? "bg-teal-100 text-teal-700"
                                                    : c.status === "escalated"
                                                        ? "bg-coral-100 text-coral-700"
                                                        : "bg-gray-100 text-gray-600"
                                            )}>
                                                <span className={cn(
                                                    "h-1.5 w-1.5 rounded-full",
                                                    c.status === "active"
                                                        ? "bg-teal-500"
                                                        : c.status === "escalated"
                                                            ? "bg-coral-500"
                                                            : "bg-gray-400"
                                                )} />
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-500 text-xs flex items-center gap-1.5">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(c.started_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                        </td>
                                        <td className="py-4 px-6 text-gray-400 text-xs">
                                            {new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ConversationsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            </div>
        }>
            <ConversationsContent />
        </Suspense>
    );
}
