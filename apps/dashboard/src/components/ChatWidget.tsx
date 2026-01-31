'use client';

import React from 'react';

type MessageRole = 'user' | 'agent';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

interface ChatWidgetProps {
  agentId: string;
}

export function ChatWidget({ agentId }: ChatWidgetProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/chat/${agentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? 'Failed to get response from agent.');
      }

      const data = (await res.json()) as { data?: { response?: string } };
      const agentMessage: Message = {
        id: String(Date.now() + 1),
        role: 'agent',
        content: data.data?.response ?? 'I am ready to help, but something went wrong retrieving my response.',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unexpected error when talking to this agent.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-black/10 bg-white text-xs text-black">
      <div className="flex items-center justify-between border-b border-black/10 px-3 py-2">
        <p className="text-[11px] font-medium text-black">
          Test your agent
        </p>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-200">
          Live preview
        </span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
        {messages.length === 0 && (
          <p className="text-[11px] text-black/60">
            Try asking: <span className="text-black/80">What are your hours?</span>
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 ${m.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-gray-100 text-black'
                }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <p className="px-3 pb-1 text-[11px] text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="flex items-center gap-2 border-t border-black/10 px-3 py-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          className="h-8 flex-1 rounded-full border border-black/10 bg-white px-3 text-[11px] text-black outline-none ring-0 placeholder:text-black/50 focus:border-violet-400"
        />
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={loading || !input.trim()}
          className="h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-3 text-[11px] font-semibold text-white shadow shadow-purple-900/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Sending…' : 'Send'}
        </button>
      </div>
    </div>
  );
}
