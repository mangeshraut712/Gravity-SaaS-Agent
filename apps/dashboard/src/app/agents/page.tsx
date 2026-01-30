'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Bot, Search, MoreVertical, ExternalLink, Play, Pause, Trash2 } from "lucide-react";
import { supabaseClient } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

interface Agent {
  id: string;
  name: string;
  template_type: string;
  status: "active" | "paused" | "draft";
  created_at: string;
  personality: string;
}

function AgentsContent() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  useEffect(() => {
    async function loadAgents() {
      if (!user) return;

      try {
        const { data, error } = await supabaseClient
          .from("agents")
          .select("id, name, template_type, status, created_at, personality")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) {
          setAgents(data as Agent[]);
        }
      } catch (error) {
        console.error("Error loading agents:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAgents();
  }, [user]);

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (agent: Agent) => {
    const newStatus = agent.status === 'active' ? 'paused' : 'active';
    try {
      const { error } = await supabaseClient
        .from('agents')
        .update({ status: newStatus })
        .eq('id', agent.id);

      if (error) throw error;

      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: newStatus } : a));
      setShowDropdown(null);
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Agents</h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor your AI workforce in one place.
          </p>
        </div>
        <Link href="/agents/new">
          <button className="btn-primary gap-2">
            <Plus className="h-4 w-4" />
            Create New Agent
          </button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by agent name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <button className="btn-secondary p-3">
          <Bot className="h-4 w-4" />
        </button>
      </div>

      {/* Agents Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent mx-auto" />
            <p className="mt-4 text-gray-500 text-sm">Loading your agents...</p>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="p-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
              <Bot className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {search ? "No agents found" : "No agents yet"}
            </h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8">
              {search
                ? "We couldn't find any agents matching your search. Try a different term."
                : "Your AI workforce is empty. Start by creating your first specialized agent."}
            </p>
            {!search && (
              <Link href="/agents/new">
                <button className="btn-primary">Build Your First Agent</button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 px-6 font-semibold text-gray-500">Agent Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-500">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-500">Personality</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-500">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-500">Created</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="group table-row border-b border-gray-50">
                    <td className="py-4 px-6">
                      <Link
                        href={`/agents/${agent.id}`}
                        className="font-semibold text-gray-900 hover:text-violet-600 transition-colors flex items-center gap-2"
                      >
                        {agent.name}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="py-4 px-6 capitalize text-gray-500">
                      {agent.template_type.replace(/_/g, " ")}
                    </td>
                    <td className="py-4 px-6 capitalize text-gray-500">{agent.personality}</td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                        agent.status === "active"
                          ? "bg-teal-100 text-teal-700"
                          : agent.status === "paused"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                      )}>
                        <span className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          agent.status === "active"
                            ? "bg-teal-500"
                            : agent.status === "paused"
                              ? "bg-amber-500"
                              : "bg-gray-400"
                        )} />
                        {agent.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      {new Date(agent.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === agent.id ? null : agent.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {showDropdown === agent.id && (
                        <div className="absolute right-6 top-12 z-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                          <Link href={`/agents/${agent.id}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                            <Bot className="h-4 w-4" /> View Details
                          </Link>
                          <button
                            onClick={() => toggleStatus(agent)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 w-full text-left"
                          >
                            {agent.status === 'active' ? (
                              <><Pause className="h-4 w-4" /> Pause Agent</>
                            ) : (
                              <><Play className="h-4 w-4" /> Resume Agent</>
                            )}
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left">
                            <Trash2 className="h-4 w-4" /> Delete Agent
                          </button>
                        </div>
                      )}
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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    }>
      <AgentsContent />
    </Suspense>
  );
}
