import { NextRequest, NextResponse } from 'next/server';
import { getPlanLimits, getSupabaseAdminClient } from '../../../../lib';

// `npm run dev:gateway` listens on 3003 (apps/gateway/src/index.ts); Docker Compose
// sets NEXT_PUBLIC_API_URL=http://gateway:3001 explicitly. Read per request so the
// server-only GATEWAY_URL from .env.example also works.
function gatewayUrl(): string {
  return process.env.GATEWAY_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
}

// Keeps pasted knowledge from crowding out the conversation in the model context.
const KNOWLEDGE_CHAR_LIMIT = 4000;

// Visitor ids come from the browser (see ChatWidget); anything else gets a fresh id,
// i.e. no shared history.
const VISITOR_ID = /^[A-Za-z0-9_-]{8,64}$/;

export async function POST(req: NextRequest, context: any) {
  // Next.js 15+ passes route params as a Promise; awaiting a plain object is a no-op.
  const agentId: string | undefined = (await context?.params)?.agentId;

  if (!agentId) {
    return NextResponse.json(
      { error: 'Agent id is required.' },
      { status: 400 },
    );
  }

  let body: { message?: string; userId?: string; visitorId?: unknown } = {};
  try {
    body = (await req.json()) as { message?: string; userId?: string; visitorId?: unknown };
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload.' },
      { status: 400 },
    );
  }

  const userMessage = (body.message ?? '').trim();
  if (!userMessage) {
    return NextResponse.json(
      { error: 'Message is required.' },
      { status: 400 },
    );
  }

  try {
    const admin = getSupabaseAdminClient();
    // Fetch the agent and its owner profile
    const { data: agent, error: agentError } = await admin
      .from('agents')
      .select(
        'id, user_id, template_type, personality, custom_instructions, knowledge_base, status',
      )
      .eq('id', agentId)
      .single();

    if (agentError || !agent) {
      return NextResponse.json(
        { error: 'Agent not found.' },
        { status: 404 },
      );
    }

    if (agent.status === 'paused') {
      return NextResponse.json(
        { error: 'This agent is paused.' },
        { status: 403 },
      );
    }

    const { data: owner, error: ownerError } = await admin
      .from('users')
      .select('id, subscription_tier')
      .eq('id', agent.user_id)
      .single();

    if (ownerError || !owner) {
      return NextResponse.json(
        { error: 'Agent owner not found.' },
        { status: 404 },
      );
    }

    // Enforce per-plan message quotas (per month across all agents)
    const limits = getPlanLimits(
      (owner.subscription_tier as 'free' | 'pro' | 'business') ?? 'free',
    );

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // The plan limit is per account, so count across every agent the owner has.
    const { data: ownerAgents } = await admin
      .from('agents')
      .select('id')
      .eq('user_id', owner.id);
    const ownerAgentIds = Array.from(
      new Set([agent.id, ...(ownerAgents ?? []).map((row: { id: string }) => row.id)]),
    );

    const { count: messagesThisMonth } = await admin
      .from('analytics_events')
      .select('id', { head: true, count: 'exact' })
      .eq('event_type', 'message_sent')
      .in('agent_id', ownerAgentIds)
      .gte('created_at', monthStart.toISOString());

    if ((messagesThisMonth ?? 0) >= limits.maxMessagesPerMonth) {
      return NextResponse.json(
        {
          error:
            'You have reached your monthly message limit for this plan. Please upgrade in Billing to continue processing conversations.',
        },
        { status: 429 },
      );
    }

    // Burst limit: monthly quotas alone let one script spend a plan's whole month
    // (and the owner's model budget) in seconds. Each request first takes a slot in
    // chat_rate_reservations, then counts the owner's slots in the last minute up to
    // and including its own, so in-flight requests hold capacity and a concurrent
    // burst can't all slip under the cap. Slots live outside the append-only
    // analytics log and never count toward the monthly quota; an abandoned slot only
    // occupies the one-minute window.
    const { data: slot, error: slotError } = await admin
      .from('chat_rate_reservations')
      .insert({ user_id: owner.id })
      .select('id, created_at')
      .single();
    if (slotError || !slot) {
      throw slotError ?? new Error('Could not reserve a message slot.');
    }

    const minuteAgo = new Date(Date.now() - 60_000);
    const { count: messagesLastMinute, error: burstError } = await admin
      .from('chat_rate_reservations')
      .select('id', { head: true, count: 'exact' })
      .eq('user_id', owner.id)
      .gte('created_at', minuteAgo.toISOString())
      .lte('created_at', slot.created_at as string);

    // The count includes this request's own slot. An unknown count is not admitted.
    if (burstError || (messagesLastMinute ?? 0) > limits.maxMessagesPerMinute) {
      await admin.from('chat_rate_reservations').delete().eq('id', slot.id);
      if (burstError) {
        return NextResponse.json(
          { error: 'Could not check the message rate. Please try again.' },
          { status: 503, headers: { 'Retry-After': '5' } },
        );
      }
      return NextResponse.json(
        { error: 'Too many messages in the last minute. Please wait a moment and try again.' },
        { status: 429, headers: { 'Retry-After': '60' } },
      );
    }

    // Best effort: slots older than the window no longer matter.
    await admin
      .from('chat_rate_reservations')
      .delete()
      .eq('user_id', owner.id)
      .lt('created_at', new Date(Date.now() - 10 * 60_000).toISOString());

    const visitorId =
      typeof body.visitorId === 'string' && VISITOR_ID.test(body.visitorId)
        ? body.visitorId
        : crypto.randomUUID();

    // Build system prompt from agent configuration
    const systemPrompt = buildSystemPrompt(agent);

    // Call the gateway's OpenRouter chat endpoint
    const gatewayRes = await fetch(`${gatewayUrl()}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        systemPrompt,
        userId: owner.id,
        conversationId: `${agentId}:${visitorId}`,
        model: process.env.OPENROUTER_MODEL || 'openrouter/anthropic/claude-3.5-sonnet',
        temperature: 0.7,
        maxTokens: 512,
      }),
    });

    if (!gatewayRes.ok) {
      const errorPayload = await gatewayRes
        .json()
        .catch(() => ({ error: 'Gateway error' }));
      console.error('[AgentFlow] Gateway error', errorPayload);
      return NextResponse.json(
        { error: errorPayload.error || 'Agent failed to respond. Please try again.' },
        { status: 502 },
      );
    }

    const data = (await gatewayRes.json()) as { data?: { response?: string; usage?: any } };
    const reply = data.data?.response ?? 'I am ready to help, but something went wrong retrieving my response.';

    // Record analytics event
    await admin.from('analytics_events').insert({
      agent_id: agent.id,
      event_type: 'message_sent',
      metadata: {
        source: 'web_chat',
        usage: data.data?.usage
      },
    });

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[AgentFlow] Chat handler error', err);
    return NextResponse.json(
      { error: 'Unexpected error while processing message.' },
      { status: 500 },
    );
  }
}

function buildSystemPrompt(agent: {
  user_id?: string | null;
  template_type: string | null;
  personality: string | null;
  custom_instructions: string | null;
  knowledge_base: unknown;
}) {
  const personality =
    agent.personality && agent.personality !== ''
      ? agent.personality
      : 'friendly';
  const template =
    agent.template_type && agent.template_type !== ''
      ? agent.template_type
      : 'customer_service';

  const kbSummary = (() => {
    if (!agent.knowledge_base) return '';
    try {
      const parsed = agent.knowledge_base as
        | { type?: string; title?: string; content?: unknown }[]
        | string;
      if (typeof parsed === 'string') {
        return parsed.slice(0, KNOWLEDGE_CHAR_LIMIT);
      }
      if (Array.isArray(parsed) && parsed.length > 0) {
        const titles = parsed
          .map((item) => item?.title)
          .filter(Boolean)
          .join(', ');
        // The launch wizard stores pasted knowledge as { type: 'text', content }.
        const pasted = parsed
          .map((item) => (typeof item?.content === 'string' ? item.content.trim() : ''))
          .filter(Boolean)
          .join('\n\n')
          .slice(0, KNOWLEDGE_CHAR_LIMIT);
        const parts = [
          titles ? `You have knowledge about: ${titles}.` : '',
          pasted,
        ].filter(Boolean);
        return parts.join('\n\n');
      }
      return '';
    } catch {
      return '';
    }
  })();

  const base = `You are a ${personality} ${template} agent built for the AgentFlow platform. Always respond clearly, concisely, and helpfully, and maintain a professional tone aligned with small business customers.`;

  const custom =
    agent.custom_instructions && agent.custom_instructions.trim().length > 0
      ? `\n\nClient-specific instructions:\n${agent.custom_instructions}`
      : '';

  const kb = kbSummary ? `\n\nContext from the client's knowledge base:\n${kbSummary}` : '';

  return base + custom + kb;
}
