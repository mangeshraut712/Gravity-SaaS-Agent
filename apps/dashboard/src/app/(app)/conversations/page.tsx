"use client";



import { Suspense, useEffect, useState } from "react";
import { MessageSquare, Search, Filter, ExternalLink, Calendar, Bot, Users } from "lucide-react";
import { cn, supabaseClient } from "@/lib";
import { useAuth } from "@/hooks";

interface Conversation {
    id: string;
    user_identifier: string;
    status: "active" | "resolved" | "escalated";
    started_at: string;
    last_message_at: string;
    agent_name: string;
}

function ConversationsContent() {
    const { user, loading: authLoading } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function loadConversations() {
            // Wait for auth to finalize
            if (authLoading) return;

            if (!user) {
                setLoading(false);
                return;
            }

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
    }, [user, authLoading]);

    const filtered = conversations.filter(c =>
        c.user_identifier.toLowerCase().includes(search.toLowerCase()) ||
        c.agent_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-slide-up min-h-screen selection:bg-violet-500/30 text-black">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="text-gradient-rainbow">Conversations</span>
                    </h1>
                    <p className="text-black/60 mt-1">
                        Monitor real-time interactions across all your deployed agents.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary gap-2 font-bold text-xs uppercase tracking-widest px-5 py-3">
                        <Filter className="h-4 w-4" /> Filter
                    </button>
                    <button className="btn-primary gap-2 font-bold text-xs uppercase tracking-widest px-5 py-3 shadow-lg shadow-violet-500/10">
                        <ExternalLink className="h-4 w-4" /> Export logs
                    </button>
                </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="card flex items-center gap-4 p-5 hover:!translate-y-0 border-black/10 bg-black/[0.03]">
                    <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600 shadow-inner">
                        <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-black/60 uppercase tracking-widest">Active Chats</p>
                        <p className="text-2xl font-bold text-black">{conversations.filter(c => c.status === 'active').length}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-4 p-5 hover:!translate-y-0 border-black/10 bg-black/[0.03]">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-inner">
                        <Bot className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-black/60 uppercase tracking-widest">Resolution Rate</p>
                        <p className="text-2xl font-bold text-gradient-teal-cyan tracking-tight">92%</p>
                    </div>
                </div>
                <div className="card flex items-center gap-4 p-5 hover:!translate-y-0 border-black/10 bg-black/[0.03]">
                    <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shadow-inner">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-black/60 uppercase tracking-widest">Unique Users</p>
                        <p className="text-2xl font-bold text-black tracking-tight">428</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md group">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/60 group-focus-within:text-violet-600 transition-colors" />
                <input
                    type="text"
                    placeholder="Search by user or agent..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field pl-10 text-sm h-12"
                />
            </div>

            {/* Table */}
            <div className="card overflow-hidden border-black/10 bg-black/[0.02]">
                {loading || authLoading ? (
                    <div className="p-24 text-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500 mx-auto" />
                        <p className="mt-4 text-black/60 text-sm font-medium animate-pulse">Syncing conversations...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state py-32">
                        <div className="empty-state-icon bg-black/5 flex items-center justify-center rounded-2xl mb-6 shadow-inner">
                            <MessageSquare className="h-10 w-10 text-black/50" />
                        </div>
                        <h3 className="empty-state-title text-black">No history found</h3>
                        <p className="empty-state-description">
                            Your agents haven&apos;t started any conversations yet. Deploy an agent to start receiving messages from your users.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-black/10 bg-black/[0.03]">
                                    <th className="text-left py-4 px-6 font-semibold text-black/60 text-[11px] uppercase tracking-widest">User</th>
                                    <th className="text-left py-4 px-6 font-semibold text-black/60 text-[11px] uppercase tracking-widest">Agent</th>
                                    <th className="text-left py-4 px-6 font-semibold text-black/60 text-[11px] uppercase tracking-widest">Status</th>
                                    <th className="text-left py-4 px-6 font-semibold text-black/60 text-[11px] uppercase tracking-widest">Started</th>
                                    <th className="text-left py-4 px-6 font-semibold text-black/60 text-[11px] uppercase tracking-widest">Last Activity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/10">
                                {filtered.map((c) => (
                                    <tr key={c.id} className="group hover:bg-black/5 transition-colors">
                                        <td className="py-4 px-6 font-semibold text-black group-hover:text-violet-600 transition-colors">
                                            {c.user_identifier}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="badge badge-violet !bg-violet-500/10 !border-violet-500/20 text-violet-600 font-bold text-[10px] px-2 py-0.5 uppercase tracking-tight">
                                                {c.agent_name}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase",
                                                c.status === "active"
                                                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                                    : c.status === "escalated"
                                                        ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                                                        : "bg-slate-100 text-black/60 border border-slate-200"
                                            )}>
                                                <span className={cn(
                                                    "h-1.5 w-1.5 rounded-full",
                                                    c.status === "active"
                                                        ? "bg-emerald-500 animate-pulse"
                                                        : c.status === "escalated"
                                                            ? "bg-rose-500"
                                                            : "bg-slate-400"
                                                )} />
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-black/60 text-[11px] flex items-center gap-1.5 font-medium">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(c.started_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                        </td>
                                        <td className="py-4 px-6 text-black/60 text-[10px] font-mono">
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
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
            </div>
        }>
            <ConversationsContent />
        </Suspense>
    );
}
