'use client';

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Bot,
    MessageSquare,
    BarChart3,
    Settings,
    Trash2,
    Copy,
    Check,
    Zap,
    MoreVertical,
    Activity,
    ChevronRight
} from "lucide-react";
import { supabaseClient } from "../../../lib/supabaseClient";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Switch } from "../../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { StatsCard } from "../../../components/ui/stats-card";

interface Agent {
    id: string;
    name: string;
    template_type: string;
    status: "active" | "paused" | "draft";
    personality: string;
    api_key: string;
    created_at: string;
    channels: { web: boolean; whatsapp: boolean; api: boolean };
}

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();
    const router = useRouter();

    const [agent, setAgent] = useState<Agent | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function loadAgent() {
            if (!user || !id) return;

            try {
                const { data, error } = await supabaseClient
                    .from("agents")
                    .select("*")
                    .eq("id", id)
                    .eq("user_id", user.id)
                    .maybeSingle();

                if (error) throw error;
                if (data) {
                    setAgent({
                        ...data,
                        channels: data.channels as { web: boolean; whatsapp: boolean; api: boolean },
                    });
                }
            } catch (error) {
                console.error("Error loading agent:", error);
            } finally {
                setLoading(false);
            }
        }

        loadAgent();
    }, [user, id]);

    const toggleStatus = async () => {
        if (!agent) return;

        const newStatus = agent.status === "active" ? "paused" : "active";

        try {
            const { error } = await supabaseClient
                .from("agents")
                .update({ status: newStatus })
                .eq("id", agent.id);

            if (error) throw error;

            setAgent({ ...agent, status: newStatus });
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const deleteAgent = async () => {
        if (!agent) return;

        if (!confirm(`Are you sure you want to delete ${agent.name}?`)) return;

        try {
            const { error } = await supabaseClient.from("agents").delete().eq("id", agent.id);

            if (error) throw error;

            router.push("/agents");
        } catch (error) {
            console.error("Error deleting agent:", error);
        }
    };

    const copyApiKey = () => {
        if (agent?.api_key) {
            navigator.clipboard.writeText(agent.api_key);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="p-10 text-center space-y-4">
                <Bot className="h-16 w-16 mx-auto text-gray-600" />
                <h2 className="text-2xl font-bold text-white">Agent not found</h2>
                <p className="text-gray-400">This agent doesn't exist or you don't have access.</p>
                <Link href="/agents">
                    <Button variant="outline">Back to Agents</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-10 space-y-10 animate-slide-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <Button variant="ghost" onClick={() => router.back()} className="-ml-4 text-gray-500 hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to workforce
                    </Button>
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-xl shadow-purple-500/20">
                            <Bot className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-white tracking-tight">{agent.name}</h1>
                                <Badge variant={agent.status === 'active' ? 'success' : 'warning'}>
                                    {agent.status}
                                </Badge>
                            </div>
                            <p className="text-gray-400 mt-1 font-medium capitalize">
                                {agent.template_type.replace(/_/g, " ")} • {agent.personality}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                            {agent.status === 'active' ? 'Agent Live' : 'Agent Paused'}
                        </span>
                        <Switch checked={agent.status === 'active'} onCheckedChange={toggleStatus} />
                    </div>
                    <Button variant="outline" size="icon" onClick={deleteAgent} className="text-red-400 hover:bg-red-500/10 hover:border-red-500/20">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-8">
                <TabsList className="bg-transparent border-b border-white/5 rounded-none p-0 h-auto gap-4">
                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent px-2 pb-3">Overview</TabsTrigger>
                    <TabsTrigger value="conversations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent px-2 pb-3">Conversations</TabsTrigger>
                    <TabsTrigger value="analytics" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent px-2 pb-3">Analytics</TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent px-2 pb-3">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-10 animate-slide-up">
                    <div className="grid gap-6 md:grid-cols-4">
                        <StatsCard title="Peak Concurrency" value="12" icon={Activity} description="Active right now" />
                        <StatsCard title="Total Volume" value="1,248" icon={MessageSquare} description="All-time messages" />
                        <StatsCard title="Avg Latency" value="0.8s" icon={Zap} description="Inference speed" />
                        <StatsCard title="Uptime" value="99.9%" icon={Activity} description="System stability" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* API Integration */}
                        <div className="card p-8 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">API Integration</h3>
                                <p className="text-sm text-gray-500">Use this key to integrate this agent into your own applications.</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/5 px-4 h-12 flex items-center font-mono text-sm text-gray-300">
                                    {agent.api_key ? (copied ? "Copied!" : "••••••••••••••••••••••••••••••••") : "Not Generated"}
                                </div>
                                <Button variant="outline" size="icon" className="h-12 w-12" onClick={copyApiKey}>
                                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <Link href="/docs/api" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 uppercase tracking-widest">
                                    View Documentation <ChevronRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Deployment Mode */}
                        <div className="card p-8 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Deployment Status</h3>
                                <p className="text-sm text-gray-500">Current active channels for this agent.</p>
                            </div>

                            <div className="space-y-3">
                                {Object.entries(agent.channels).map(([k, v]) => (
                                    <div key={k} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                        <span className="text-sm font-medium text-gray-300 capitalize">{k} Channel</span>
                                        <Badge variant={v ? 'success' : 'outline'}>{v ? 'Enabled' : 'Disabled'}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="conversations" className="animate-slide-up">
                    <div className="card p-20 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No active conversations</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">
                            Once users start interacting with your agent across any channel, their chat history will appear here.
                        </p>
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="animate-slide-up">
                    <div className="card p-20 text-center">
                        <BarChart3 className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Analytics gathering data</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">
                            Fine-grained performance charts and user sentiment analysis will be available once your agent has handled at least 50 messages.
                        </p>
                    </div>
                </TabsContent>

                <TabsContent value="settings" className="animate-slide-up">
                    <div className="card p-8">
                        <h3 className="text-lg font-bold text-white mb-4">Core Model Settings</h3>
                        <div className="space-y-6 max-w-xl">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">System Instructions</label>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-gray-300 leading-relaxed italic">
                                    {agent.personality === 'friendly' ? "Be warm and welcoming..." : "Be efficient and professional..."}
                                </div>
                            </div>
                            <Link href={`/agents/new?id=${agent.id}`}>
                                <Button variant="outline">
                                    <Settings className="mr-2 h-4 w-4" /> Edit Configuration
                                </Button>
                            </Link>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
