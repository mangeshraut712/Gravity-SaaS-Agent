"use client";



import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Bot, Search, MoreVertical, ExternalLink, Play, Pause, Trash2 } from "lucide-react";
import { cn, supabaseClient } from "@/lib";
import { useAuth } from "@/hooks";

interface Agent {
  id: string;
  name: string;
  template_type: string;
  status: string;
  created_at: string;
  personality: string;
}

function AgentsContent() {
  const { user, loading: authLoading } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  useEffect(() => {
    async function loadAgents() {
      if (authLoading) return;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabaseClient
          .from("agents")
          .select("id, name, template_type, status, created_at, personality")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAgents(data || []);
      } catch (error) {
        console.error("Error loading agents:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAgents();
  }, [user, authLoading]);

  const toggleStatus = async (agent: Agent) => {
    const newStatus = agent.status === "active" ? "paused" : "active";
    try {
      const { error } = await supabaseClient
        .from("agents")
        .update({ status: newStatus })
        .eq("id", agent.id);

      if (error) throw error;
      setAgents(agents.map((a) => (a.id === agent.id ? { ...a, status: newStatus } : a)));
    } catch (error) {
      console.error("Error updating agent status:", error);
    }
    setShowDropdown(null);
  };

  const deleteAgent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent? This action cannot be undone.")) return;
    try {
      const { error } = await supabaseClient.from("agents").delete().eq("id", id);
      if (error) throw error;
      setAgents(agents.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error deleting agent:", error);
    }
    setShowDropdown(null);
  };

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.template_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 space-y-10 selection:bg-violet-500/30 text-black animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-gradient-rainbow">My Agents</span>
          </h1>
          <p className="text-black/60 mt-2 text-lg">
            Manage and monitor your specialized AI workforce in one place.
          </p>
        </div>
        <Link href="/agents/new">
          <button className="btn-primary flex items-center gap-2 font-bold uppercase tracking-widest text-[11px] px-6 py-4 shadow-xl shadow-violet-500/10 hover:shadow-violet-500/20 transition-all">
            <Plus className="h-4 w-4" /> Create New Agent
          </button>
        </Link>
      </div>

      {/* Filters & Seaarch */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/60 group-focus-within:text-violet-600 transition-colors" />
          <input
            type="text"
            placeholder="Search agents by name or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-12 h-12 transition-all"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden border-black/10 bg-black/[0.02]">
        {loading || authLoading ? (
          <div className="p-32 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500 mx-auto" />
            <p className="mt-6 text-black/60 text-sm font-medium animate-pulse">Initializing workforce...</p>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="empty-state py-32">
            <div className="empty-state-icon bg-violet-500/10 flex items-center justify-center rounded-3xl mb-8 shadow-inner border border-violet-500/20">
              <Bot className="h-12 w-12 text-violet-600" />
            </div>
            <h3 className="empty-state-title text-black text-2xl mb-4">
              {search ? "No matches found" : "Your AI workforce is empty"}
            </h3>
            <p className="empty-state-description max-w-sm mb-10">
              {search
                ? "We couldn't find any agents matching your query. Try a different search term or clear the filter."
                : "Build your first specialized agent powered by Gravity and start automating your workflows today."}
            </p>
            {!search && (
              <Link href="/agents/new">
                <button className="btn-primary !h-14 font-black uppercase tracking-[0.2em] px-10">Deploy Agent</button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/10 bg-black/[0.03]">
                  <th className="text-left py-5 px-8 font-bold text-black/60 text-[10px] uppercase tracking-[0.2em]">Agent Identity</th>
                  <th className="text-left py-5 px-8 font-bold text-black/60 text-[10px] uppercase tracking-[0.2em]">Framework</th>
                  <th className="text-left py-5 px-8 font-bold text-black/60 text-[10px] uppercase tracking-[0.2em]">DNA Profile</th>
                  <th className="text-left py-5 px-8 font-bold text-black/60 text-[10px] uppercase tracking-[0.2em]">Live Status</th>
                  <th className="text-left py-5 px-8 font-bold text-black/60 text-[10px] uppercase tracking-[0.2em]">Created</th>
                  <th className="text-right py-5 px-8 font-bold text-black/60 text-[10px] uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="group hover:bg-black/5 transition-all relative">
                    <td className="py-5 px-8">
                      <Link
                        href={`/agents/${agent.id}`}
                        className="font-bold text-lg text-black group-hover:text-violet-600 transition-colors flex items-center gap-2"
                      >
                        {agent.name}
                        <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-2px]" />
                      </Link>
                    </td>
                    <td className="py-5 px-8">
                      <span className="text-sm font-semibold text-black/60 capitalize bg-black/5 px-3 py-1 rounded-lg border border-black/10">
                        {agent.template_type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-5 px-8 capitalize text-black/60 text-sm font-medium">{agent.personality}</td>
                    <td className="py-5 px-8">
                      <span className={cn(
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em]",
                        agent.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : agent.status === "paused"
                            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            : "bg-slate-100 text-black/60 border border-slate-200"
                      )}>
                        <span className={cn(
                          "h-2 w-2 rounded-full",
                          agent.status === "active"
                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"
                            : agent.status === "paused"
                              ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                              : "bg-slate-400"
                        )} />
                        {agent.status}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-black/60 text-xs font-mono">
                      {new Date(agent.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-8 text-right relative">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(agent)}
                          className="p-2.5 rounded-xl bg-black/5 text-black/60 hover:text-black hover:bg-black/10 transition-all border border-transparent hover:border-black/10"
                          title={agent.status === 'active' ? 'Pause Agent' : 'Activate Agent'}
                        >
                          {agent.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => deleteAgent(agent.id)}
                          className="p-2.5 rounded-xl bg-black/5 text-black/60 hover:text-rose-600 hover:bg-rose-400/10 transition-all border border-transparent hover:border-rose-400/10"
                          title="Delete Agent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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

export default function AgentsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
      </div>
    }>
      <AgentsContent />
    </Suspense>
  );
}
