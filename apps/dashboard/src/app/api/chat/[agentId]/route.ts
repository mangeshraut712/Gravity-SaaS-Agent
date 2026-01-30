import { NextRequest, NextResponse } from 'next/server';
import { getPlanLimits, getSupabaseAdminClient } from '../../../../lib';

const GATEWAY_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(req: NextRequest, context: any) {
  const agentId: string | undefined = context?.params?.agentId;

  if (!agentId) {
    return NextResponse.json(
      { error: 'Agent id is required.' },
      { status: 400 },
    );
  }

  let body: { message?: string; userId?: string } = {};
  try {
    body = (await req.json()) as { message?: string; userId?: string };
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
        'id, user_id, template_type, personality, custom_instructions, knowledge_base',
      )
      .eq('id', agentId)
      .single();

    if (agentError || !agent) {
      return NextResponse.json(
        { error: 'Agent not found.' },
        { status: 404 },
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

    const { count: messagesThisMonth } = await admin
      .from('analytics_events')
      .select('id', { head: true, count: 'exact' })
      .eq('event_type', 'message_sent')
      .eq('agent_id', agent.id)
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

    // Build system prompt from agent configuration
    const systemPrompt = buildSystemPrompt(agent);

    // Call the gateway's OpenRouter chat endpoint
    const gatewayRes = await fetch(`${GATEWAY_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        userId: owner.id,
        conversationId: agentId,
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
        | { type?: string; title?: string }[]
        | string;
      if (typeof parsed === 'string') {
        return parsed.slice(0, 400);
      }
      if (Array.isArray(parsed) && parsed.length > 0) {
        const titles = parsed
          .map((item) => item.title)
          .filter(Boolean)
          .join(', ');
        return titles ? `You have knowledge about: ${titles}.` : '';
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
