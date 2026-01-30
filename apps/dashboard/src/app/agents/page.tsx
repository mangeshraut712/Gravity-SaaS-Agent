'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Bot, Search, MoreVertical, ExternalLink, Play, Pause, Trash2 } from "lucide-react";
import { supabaseClient } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

interface Agent {
  id: string;
  name: string;
  template_type: string;
  status: "active" | "paused" | "draft";
  created_at: string;
  personality: string;
}

export default function AgentsPage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Agents</h1>
          <p className="text-gray-400 mt-1">
            Manage and monitor your AI workforce in one place.
          </p>
        </div>
        <Link href="/agents/new">
          <Button variant="premium" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Agent
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search by agent name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Bot className="h-4 w-4" />
        </Button>
      </div>

      {/* Agents Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto" />
            <p className="mt-4 text-gray-400 text-sm">Loading your agents...</p>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="p-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5">
              <Bot className="h-10 w-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {search ? "No agents found" : "No agents yet"}
            </h3>
            <p className="text-gray-400 max-w-xs mx-auto mb-8">
              {search
                ? "We couldn't find any agents matching your search. Try a different term."
                : "Your AI workforce is empty. Start by creating your first specialized agent."}
            </p>
            {!search && (
              <Link href="/agents/new">
                <Button variant="premium">Build Your First Agent</Button>
              </Link>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Personality</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id} className="group">
                  <TableCell className="font-semibold text-white">
                    <Link
                      href={`/agents/${agent.id}`}
                      className="hover:text-purple-400 transition-colors flex items-center gap-2"
                    >
                      {agent.name}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </TableCell>
                  <TableCell className="capitalize text-gray-400">
                    {agent.template_type.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell className="capitalize text-gray-400">{agent.personality}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        agent.status === "active"
                          ? "success"
                          : agent.status === "paused"
                            ? "warning"
                            : "outline"
                      }
                    >
                      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${agent.status === "active" ? "bg-emerald-500" : agent.status === "paused" ? "bg-amber-500" : "bg-gray-500"
                        }`} />
                      {agent.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(agent.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem asChild>
                            <Link href={`/agents/${agent.id}`} className="flex items-center gap-2 cursor-pointer">
                              <Bot className="h-4 w-4" /> View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(agent)} className="flex items-center gap-2 cursor-pointer">
                            {agent.status === 'active' ? (
                              <><Pause className="h-4 w-4" /> Pause Agent</>
                            ) : (
                              <><Play className="h-4 w-4" /> Resume Agent</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-red-400 focus:text-red-400 cursor-pointer">
                            <Trash2 className="h-4 w-4" /> Delete Agent
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
