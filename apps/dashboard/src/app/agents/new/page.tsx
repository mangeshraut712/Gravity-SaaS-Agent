'use client';

import React from 'react';
import { supabaseClient } from '../../../lib/supabaseClient';
import { ChatWidget } from '../../../components/ChatWidget';
import { getUsageSnapshotForCurrentUser } from '../../../lib/usage';

export const dynamic = 'force-dynamic';

type Step = 1 | 2 | 3;

export default function NewAgentPage() {
  const [step, setStep] = React.useState<Step>(1);
  const [saving, setSaving] = React.useState(false);
  const [agentId, setAgentId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [usage, setUsage] = React.useState<{
    tier: string;
    agentsCount: number;
    maxAgents: number;
  } | null>(null);

  const [name, setName] = React.useState('');
  const [templateType, setTemplateType] = React.useState('customer_service');
  const [personality, setPersonality] = React.useState('friendly');
  const [customInstructions, setCustomInstructions] = React.useState('');

  React.useEffect(() => {
    void (async () => {
      const snapshot = await getUsageSnapshotForCurrentUser();
      if (!snapshot) return;
      setUsage({
        tier: snapshot.tier,
        agentsCount: snapshot.agentsCount,
        maxAgents: snapshot.limits.maxAgents,
      });
    })();
  }, []);

  const goToStep = (next: Step) => {
    setStep(next);
  };

  const handleSaveBasic = async () => {
    if (!name.trim()) {
      setError('Please give your agent a name.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      // Enforce per-plan agent limits
      const snapshot = await getUsageSnapshotForCurrentUser();
      if (snapshot && snapshot.agentsCount >= snapshot.limits.maxAgents) {
        setError(
          `You have reached the limit of ${snapshot.limits.maxAgents} agents on your ${snapshot.tier} plan. Upgrade in Billing to create more agents.`,
        );
        return;
      }

      const {
        data: { user },
        error: sessionError,
      } = await supabaseClient.auth.getUser();
      if (sessionError || !user) {
        throw new Error('You must be logged in to create an agent.');
      }

      const { data, error: insertError } = await supabaseClient
        .from('agents')
        .insert({
          user_id: user.id,
          name,
          template_type: templateType,
          personality,
          custom_instructions: customInstructions,
        })
        .select('id')
        .single();

      if (insertError) {
        throw insertError;
      }

      setAgentId(data.id);
      setStep(2);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save your agent. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Create a new agent
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Choose a template, customize its behavior, and deploy in minutes.
          </p>
        </div>
        <div className="flex gap-2 text-[11px] text-gray-300">
          <span
            className={`rounded-full px-3 py-1 ${
              step === 1 ? 'bg-white text-gray-900' : 'bg-gray-900/80'
            }`}
          >
            1. Setup
          </span>
          <span
            className={`rounded-full px-3 py-1 ${
              step === 2 ? 'bg-white text-gray-900' : 'bg-gray-900/80'
            }`}
          >
            2. Tone & knowledge
          </span>
          <span
            className={`rounded-full px-3 py-1 ${
              step === 3 ? 'bg-white text-gray-900' : 'bg-gray-900/80'
            }`}
          >
            3. Test & deploy
          </span>
        </div>
      </header>

      {error && (
        <p className="mt-3 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          {step === 1 && (
            <div className="rounded-2xl border border-white/10 bg-gray-950/80 p-5 text-sm text-gray-100">
              <h2 className="text-sm font-semibold text-white">
                1. Basic setup
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                Give your agent a name and choose the template that best matches
                your use case.
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-300">
                    Agent name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Customer Support Bot"
                    className="h-9 w-full rounded-lg border border-white/10 bg-gray-900/80 px-3 text-xs text-white outline-none ring-0 placeholder:text-gray-500 focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-300">
                    Template
                  </label>
                  <select
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                    className="h-9 w-full rounded-lg border border-white/10 bg-gray-900/80 px-3 text-xs text-white outline-none ring-0 focus:border-purple-400"
                  >
                    <option value="customer_service">Customer Service Bot</option>
                    <option value="sales_qualifier">Sales Qualifier</option>
                    <option value="appointment_scheduler">
                      Appointment Scheduler
                    </option>
                    <option value="faq_assistant">FAQ Assistant</option>
                    <option value="lead_capture">Lead Capture Bot</option>
                  </select>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => void handleSaveBasic()}
                  disabled={saving}
                  className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow shadow-purple-900/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save & continue'}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-2xl border border-white/10 bg-gray-950/80 p-5 text-sm text-gray-100">
              <h2 className="text-sm font-semibold text-white">
                2. Personality & tone
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                Choose how your agent should sound and add any custom
                instructions.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {[
                  { id: 'friendly', label: 'Friendly & Casual' },
                  { id: 'professional', label: 'Professional' },
                  { id: 'technical', label: 'Technical' },
                  { id: 'fun', label: 'Enthusiastic & Fun' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPersonality(p.id)}
                    className={`rounded-xl border px-3 py-2 text-[11px] ${
                      personality === p.id
                        ? 'border-purple-400 bg-purple-500/20 text-white'
                        : 'border-white/10 bg-gray-900/80 text-gray-200 hover:border-purple-300/50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-xs font-medium text-gray-300">
                  Custom instructions
                </label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  placeholder="Add specific instructions for your agent's behavior, escalation rules, and brand voice…"
                  className="w-full rounded-lg border border-white/10 bg-gray-900/80 px-3 py-2 text-xs text-white outline-none ring-0 placeholder:text-gray-500 focus:border-purple-400"
                />
                <p className="mt-1 text-[10px] text-gray-500">
                  {customInstructions.length}/2000 characters
                </p>
              </div>
              <div className="mt-5 flex justify-between text-xs">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="rounded-full border border-white/15 px-4 py-2 text-gray-100 hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 font-semibold text-white shadow shadow-purple-900/40 hover:brightness-110"
                >
                  Continue to testing
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rounded-2xl border border-white/10 bg-gray-950/80 p-5 text-sm text-gray-100">
              <h2 className="text-sm font-semibold text-white">3. Deploy</h2>
              <p className="mt-1 text-xs text-gray-400">
                When you&apos;re happy with testing, you can deploy your agent
                and connect channels like WhatsApp or web chat.
              </p>
              <div className="mt-4 rounded-xl border border-dashed border-white/15 bg-gray-950/60 p-4 text-xs text-gray-300">
                <p className="font-medium text-gray-100">
                  Coming next in this flow
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Configure channels (Web, WhatsApp, API)</li>
                  <li>Connect Polar.sh pricing and free trials</li>
                  <li>Generate embed code and API keys</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="h-80 lg:h-full">
          {agentId ? (
            <ChatWidget agentId={agentId} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-gray-950/80 px-4 text-center text-xs text-gray-400">
              <p className="font-medium text-gray-200">
                Save your agent to start testing
              </p>
              <p className="mt-1">
                Once you complete step 1, a live preview chat will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

