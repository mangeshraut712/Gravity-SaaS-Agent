'use client';

import { useEffect, useState } from "react";
import { MessageSquare, Search, Filter, MoreVertical, ExternalLink, Calendar, Bot, Users } from "lucide-react";
import { supabaseClient } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

interface Conversation {
    id: string;
    user_identifier: string;
    status: "active" | "resolved" | "escalated";
    started_at: string;
    last_message_at: string;
    agent_name: string;
}

export default function ConversationsPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function loadConversations() {
            if (!user) return;

            try {
                // Complex query to get conversations with agent name
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
        <div className="p-6 lg:p-10 space-y-8 animate-slide-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Conversations</h1>
                    <p className="text-gray-400 mt-1">
                        Monitor real-time interactions across all your deployed agents.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                    <Button variant="premium" className="gap-2">
                        <ExternalLink className="h-4 w-4" /> Export logs
                    </Button>
                </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="card p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Chats</p>
                        <p className="text-2xl font-bold text-white">{conversations.filter(c => c.status === 'active').length}</p>
                    </div>
                </div>
                <div className="card p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Bot className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Resolution Rate</p>
                        <p className="text-2xl font-bold text-white">92%</p>
                    </div>
                </div>
                <div className="card p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Unique Users</p>
                        <p className="text-2xl font-bold text-white">428</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                    placeholder="Search by user or agent..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto" />
                        <p className="mt-4 text-gray-400">Syncing conversations...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-20 text-center space-y-4">
                        <div className="h-20 w-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-gray-600">
                            <MessageSquare className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold text-white">No history found</h3>
                        <p className="text-gray-400 max-w-xs mx-auto">
                            Your agents haven't started any conversations yet. Deploy an agent to start receiving messages.
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Agent</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Started</TableHead>
                                <TableHead>Last Activity</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-semibold text-white">
                                        {c.user_identifier}
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        <Badge variant="outline" className="font-medium bg-white/5 border-white/5">
                                            {c.agent_name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                c.status === "active"
                                                    ? "success"
                                                    : c.status === "escalated"
                                                        ? "destructive"
                                                        : "secondary"
                                            }
                                        >
                                            {c.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-500 text-xs flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(c.started_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                    </TableCell>
                                    <TableCell className="text-gray-400 text-xs">
                                        {new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
