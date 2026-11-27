import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { Webhook } from 'standardwebhooks';

const { admin, getSupabaseAdminClient, polarWebhookSecret } = vi.hoisted(() => {
    const polarWebhookSecret = 'whsec_c3ludGhldGljLXBvbGFyLXdlYmhvb2sta2V5';
    const admin = { from: vi.fn() };
    process.env.POLAR_WEBHOOK_SECRET = polarWebhookSecret;
    return {
        admin,
        getSupabaseAdminClient: vi.fn(() => admin),
        polarWebhookSecret,
    };
});

vi.mock('../../../apps/dashboard/src/lib/index.ts', async () => {
    const actual = await vi.importActual<typeof import('../../../apps/dashboard/src/lib/index.ts')>(
        '../../../apps/dashboard/src/lib/index.ts',
    );
    return {
        ...actual,
        getSupabaseAdminClient,
    };
});

import { POST as chat } from '../../../apps/dashboard/src/app/api/chat/[agentId]/route.js';
import { GET as health } from '../../../apps/dashboard/src/app/api/health/route.js';
import { POST as polar } from '../../../apps/dashboard/src/app/api/webhooks/polar/route.js';

function builder(result: { data?: unknown; error?: unknown; count?: number | null }) {
    const query = {
        select: () => query,
        eq: () => query,
        in: vi.fn(() => query),
        gte: () => query,
        lte: () => query,
        lt: () => query,
        or: () => query,
        limit: () => query,
        update: () => query,
        insert: vi.fn(() => ({
            select: () => ({ single: async () => ({ data: { id: 'evt-1', created_at: new Date().toISOString() }, error: null }) }),
            then: (resolve: (value: { error: null }) => void) => Promise.resolve({ error: null }).then(resolve),
        })),
        delete: () => query,
        single: async () => result,
        maybeSingle: async () => result,
        then: (resolve: (value: typeof result) => void) => Promise.resolve(result).then(resolve),
    };
    return query;
}

const agent = {
    id: 'agent-1',
    user_id: 'user-1',
    template_type: 'support',
    personality: 'calm',
    custom_instructions: 'Use the customer name.',
    knowledge_base: [{ title: 'Hours' }, { title: '' }, { type: 'note' }],
};

describe('dashboard health route', () => {
    it('returns an OK response without requiring application dependencies', async () => {
        const response = await health();

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ status: 'ok' });
    });
});

describe('dashboard chat route', () => {
    beforeEach(() => {
        admin.from.mockReset();
        vi.unstubAllGlobals();
    });

    function mockTables(overrides?: { messages?: number; agent?: unknown; owner?: unknown; ownerAgents?: Array<{ id: string }> }) {
        admin.from.mockImplementation((table: string) => {
            if (table === 'agents') {
                const query = builder({ data: overrides?.agent === undefined ? agent : overrides.agent, error: overrides?.agent === null ? { message: 'missing' } : null });
                // The owner's agent list is awaited directly rather than via single().
                query.then = (resolve) => Promise.resolve({ data: overrides?.ownerAgents ?? [{ id: 'agent-1' }], error: null }).then(resolve);
                return query;
            }
            if (table === 'users') return builder({ data: overrides?.owner === undefined ? { id: 'user-1', subscription_tier: 'free' } : overrides.owner, error: overrides?.owner === null ? { message: 'missing' } : null });
            return builder({ count: overrides?.messages ?? 0, error: null });
        });
    }

    it('rejects incomplete requests', async () => {
        mockTables();
        const missingId = await chat(new NextRequest('http://localhost/api/chat'), { params: {} });
        expect(missingId.status).toBe(400);

        const badJson = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', { method: 'POST', body: '{' }),
            { params: { agentId: 'agent-1' } },
        );
        expect(badJson.status).toBe(400);

        const empty = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', {
                method: 'POST',
                body: JSON.stringify({ message: '   ' }),
            }),
            { params: { agentId: 'agent-1' } },
        );
        expect(empty.status).toBe(400);
    });

    it('reads the agent id from the Promise params Next.js 16 passes', async () => {
        mockTables();
        vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ data: { response: 'Sure.' } }), { status: 200 })));
        const response = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', {
                method: 'POST',
                body: JSON.stringify({ message: 'Hi' }),
            }),
            { params: Promise.resolve({ agentId: 'agent-1' }) },
        );
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ reply: 'Sure.' });
    });

    it('does not answer for a paused agent', async () => {
        mockTables({ agent: { ...agent, status: 'paused' } });
        const fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        const response = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', {
                method: 'POST',
                body: JSON.stringify({ message: 'Hi' }),
            }),
            { params: { agentId: 'agent-1' } },
        );
        expect(response.status).toBe(403);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('counts the monthly quota across all of the owner\'s agents', async () => {
        let events: ReturnType<typeof builder> | undefined;
        mockTables({ messages: 100, ownerAgents: [{ id: 'agent-1' }, { id: 'agent-2' }] });
        const base = admin.from.getMockImplementation()!;
        admin.from.mockImplementation((table: string) => {
            const query = base(table);
            if (table === 'analytics_events') events = query;
            return query;
        });

        const limited = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', {
                method: 'POST',
                body: JSON.stringify({ message: 'Hi' }),
            }),
            { params: { agentId: 'agent-1' } },
        );

        expect(limited.status).toBe(429);
        expect(events?.in).toHaveBeenCalledWith('agent_id', ['agent-1', 'agent-2']);
    });

    it('enforces ownership, quotas, and gateway failures', async () => {
        mockTables({ agent: null });
        const missingAgent = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', {
                method: 'POST',
                body: JSON.stringify({ message: 'Hi' }),
            }),
            { params: { agentId: 'agent-1' } },
        );
        expect(missingAgent.status).toBe(404);

        mockTables({ owner: null });
        const missingOwner = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', {
                method: 'POST',
                body: JSON.stringify({ message: 'Hi' }),
            }),
            { params: { agentId: 'agent-1' } },
        );
        expect(missingOwner.status).toBe(404);

        mockTables({ messages: 100 });
        const limited = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', {
                method: 'POST',
                body: JSON.stringify({ message: 'Hi' }),
            }),
            { params: { agentId: 'agent-1' } },
        );
        expect(limited.status).toBe(429);

        mockTables();
        vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: 'busy' }), { status: 502 })));
        const gateway = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', {
                method: 'POST',
                body: JSON.stringify({ message: 'Hi' }),
            }),
            { params: { agentId: 'agent-1' } },
        );
        expect(gateway.status).toBe(502);

        vi.stubGlobal('fetch', vi.fn(async () => new Response('not-json', { status: 500 })));
        const unreadable = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', {
                method: 'POST',
                body: JSON.stringify({ message: 'Hi' }),
            }),
            { params: { agentId: 'agent-1' } },
        );
        expect(unreadable.status).toBe(502);
    });

    it('defaults to the local gateway port and honours GATEWAY_URL', async () => {
        const saved = { gateway: process.env.GATEWAY_URL, public: process.env.NEXT_PUBLIC_API_URL };
        delete process.env.GATEWAY_URL;
        delete process.env.NEXT_PUBLIC_API_URL;
        try {
            const fetchMock = vi.fn(async (_url: string) => new Response(JSON.stringify({ data: { response: 'ok' } }), { status: 200 }));
            vi.stubGlobal('fetch', fetchMock);
            const send = () => chat(
                new NextRequest('http://localhost/api/chat/agent-1', {
                    method: 'POST',
                    body: JSON.stringify({ message: 'Hi' }),
                }),
                { params: { agentId: 'agent-1' } },
            );

            mockTables();
            expect((await send()).status).toBe(200);
            expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:3003/api/v1/chat');

            process.env.NEXT_PUBLIC_API_URL = 'http://gateway:3001';
            mockTables();
            await send();
            expect(fetchMock.mock.calls[1][0]).toBe('http://gateway:3001/api/v1/chat');

            process.env.GATEWAY_URL = 'http://127.0.0.1:4000';
            mockTables();
            await send();
            expect(fetchMock.mock.calls[2][0]).toBe('http://127.0.0.1:4000/api/v1/chat');
        } finally {
            if (saved.gateway === undefined) delete process.env.GATEWAY_URL; else process.env.GATEWAY_URL = saved.gateway;
            if (saved.public === undefined) delete process.env.NEXT_PUBLIC_API_URL; else process.env.NEXT_PUBLIC_API_URL = saved.public;
        }
    });

    it('forwards the agent system prompt to the gateway', async () => {
        mockTables();
        const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => new Response(JSON.stringify({ data: { response: 'ok' } }), { status: 200 }));
        vi.stubGlobal('fetch', fetchMock);
        const response = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', {
                method: 'POST',
                body: JSON.stringify({ message: 'Hi' }),
            }),
            { params: { agentId: 'agent-1' } },
        );
        expect(response.status).toBe(200);
        const sent = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
        expect(sent.systemPrompt).toContain('You are a calm support agent');
        expect(sent.systemPrompt).toContain('Use the customer name.');
        expect(sent.systemPrompt).toContain('You have knowledge about: Hours.');
    });

    it('includes knowledge pasted in the launch wizard in the system prompt', async () => {
        const long = 'x'.repeat(5000);
        mockTables({
            agent: { ...agent, knowledge_base: [{ type: 'text', content: '  We open at 9am.  ' }, { type: 'text', content: long }, { type: 'text', content: 42 }] },
            owner: { id: 'user-1', subscription_tier: 'free' },
        });
        const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => new Response(JSON.stringify({ data: { response: 'ok' } }), { status: 200 }));
        vi.stubGlobal('fetch', fetchMock);
        const response = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', {
                method: 'POST',
                body: JSON.stringify({ message: 'When do you open?' }),
            }),
            { params: { agentId: 'agent-1' } },
        );
        expect(response.status).toBe(200);
        const sent = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
        expect(sent.systemPrompt).toContain("Context from the client's knowledge base:\nWe open at 9am.\n\nxxx");
        expect(sent.systemPrompt).not.toContain('You have knowledge about');
        expect(sent.systemPrompt).not.toContain('x'.repeat(4000));
        expect(sent.systemPrompt).not.toContain('42');
    });

    it('scopes the gateway conversation to the agent and visitor', async () => {
        const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => new Response(JSON.stringify({ data: { response: 'ok' } }), { status: 200 }));
        vi.stubGlobal('fetch', fetchMock);
        const send = async (body: Record<string, unknown>) => {
            mockTables();
            await chat(
                new NextRequest('http://localhost/api/chat/agent-1', { method: 'POST', body: JSON.stringify(body) }),
                { params: { agentId: 'agent-1' } },
            );
            return JSON.parse(String(fetchMock.mock.calls.at(-1)?.[1]?.body)).conversationId as string;
        };

        expect(await send({ message: 'Hi', visitorId: 'visitor_abc123' })).toBe('agent-1:visitor_abc123');
        // Missing or malformed ids never fall back to one shared agent-wide history.
        const anonA = await send({ message: 'Hi' });
        const anonB = await send({ message: 'Hi', visitorId: '../../x' });
        expect(anonA).toMatch(/^agent-1:[0-9a-f-]{36}$/);
        expect(anonB).toMatch(/^agent-1:[0-9a-f-]{36}$/);
        expect(anonA).not.toBe(anonB);
    });

    it('enforces a per-minute burst limit below the monthly quota', async () => {
        const fetchMock = vi.fn(async () => new Response(JSON.stringify({ data: { response: 'ok' } }), { status: 200 }));
        vi.stubGlobal('fetch', fetchMock);
        const send = () => chat(
            new NextRequest('http://localhost/api/chat/agent-1', { method: 'POST', body: JSON.stringify({ message: 'Hi' }) }),
            { params: { agentId: 'agent-1' } },
        );

        // Free plan: 100/month, 10/minute. The mocked count answers both windows and,
        // for the minute window, includes this request's own reservation.
        mockTables({ messages: 11 });
        const burst = await send();
        expect(burst.status).toBe(429);
        expect(burst.headers.get('Retry-After')).toBe('60');
        expect((await burst.json()).error).toMatch(/last minute/);
        expect(fetchMock).not.toHaveBeenCalled();

        mockTables({ messages: 10 });
        expect((await send()).status).toBe(200);
    });

    function fakeSlotStore(options: { countError?: boolean; cleanupThrows?: boolean } = {}) {
        const rows: Array<{ id: string; user_id: string; created_at: string }> = [];
        let nextId = 0;
        // Resolves when a stale-slot cleanup has finished (cleanup now runs in the background).
        let cleanupDone: (() => void) | undefined;
        const cleanupFinished = new Promise<void>((resolve) => { cleanupDone = resolve; });
        const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
        const table = () => {
            const filters: { id?: string; user_id?: string; upTo?: string; before?: string } = {};
            let mode: 'count' | 'delete' = 'count';
            const query: Record<string, unknown> = {
                insert: (row: { user_id: string }) => ({
                    select: () => ({
                        single: async () => {
                            await tick();
                            const id = `slot-${++nextId}`;
                            // Strictly increasing, like now() across separate inserts.
                            const created_at = new Date(Date.now() - 30_000 + nextId).toISOString();
                            rows.push({ ...row, id, created_at });
                            return { data: { id, created_at }, error: null };
                        },
                    }),
                }),
                select: () => query,
                gte: () => query,
                lte: (_column: string, value: string) => { filters.upTo = value; return query; },
                lt: (_column: string, value: string) => { filters.before = value; return query; },
                delete: () => { mode = 'delete'; return query; },
                eq: (column: 'id' | 'user_id', value: string) => { filters[column] = value; return query; },
                then: async (resolve: (value: unknown) => void) => {
                    await tick();
                    if (mode === 'delete') {
                        // The stale-slot cleanup is the only delete filtered by created_at.
                        // Like the real client, failures resolve with { error } rather than throwing.
                        if (options.cleanupThrows && filters.before) {
                            cleanupDone?.();
                            return resolve({ error: { message: 'cleanup connection reset' } });
                        }
                        for (let i = rows.length - 1; i >= 0; i -= 1) {
                            const row = rows[i];
                            if (filters.id && row.id !== filters.id) continue;
                            if (filters.user_id && row.user_id !== filters.user_id) continue;
                            if (filters.before && !(row.created_at < filters.before)) continue;
                            rows.splice(i, 1);
                        }
                        if (filters.before) cleanupDone?.();
                        return resolve({ error: null });
                    }
                    if (options.countError) return resolve({ count: null, error: { message: 'statement timeout' } });
                    return resolve({
                        count: rows.filter((row) => row.user_id === filters.user_id && (!filters.upTo || row.created_at <= filters.upTo)).length,
                        error: null,
                    });
                },
            };
            return query;
        };
        return { rows, table, cleanupFinished };
    }

    function routeWithSlots(store: ReturnType<typeof fakeSlotStore>) {
        mockTables();
        const base = admin.from.getMockImplementation()!;
        const analyticsInserts: unknown[] = [];
        admin.from.mockImplementation((name: string) => {
            if (name === 'chat_rate_reservations') return store.table();
            const query = base(name);
            if (name === 'analytics_events') {
                query.insert = vi.fn(async (row: unknown) => { analyticsInserts.push(row); return { error: null }; }) as never;
            }
            return query;
        });
        return analyticsInserts;
    }

    it('reserves burst capacity before calling the gateway so concurrent requests cannot overshoot', async () => {
        const store = fakeSlotStore();
        const analyticsInserts = routeWithSlots(store);
        let inFlight = 0;
        const fetchMock = vi.fn(async () => {
            inFlight += 1;
            await new Promise((resolve) => setTimeout(resolve, 5));
            inFlight -= 1;
            return new Response(JSON.stringify({ data: { response: 'ok', usage: { totalTokens: 3 } } }), { status: 200 });
        });
        vi.stubGlobal('fetch', fetchMock);

        const responses = await Promise.all(
            Array.from({ length: 20 }, () => chat(
                new NextRequest('http://localhost/api/chat/agent-1', { method: 'POST', body: JSON.stringify({ message: 'Hi' }) }),
                { params: { agentId: 'agent-1' } },
            )),
        );

        const admitted = responses.filter((response) => response.status === 200).length;
        expect(admitted).toBe(10); // free plan: 10/minute, no more and no fewer
        expect(fetchMock).toHaveBeenCalledTimes(admitted);
        expect(responses.every((response) => [200, 429].includes(response.status))).toBe(true);
        // Refused requests give their slot back; admitted ones keep it for the window.
        expect(store.rows).toHaveLength(admitted);
        expect(store.rows.every((row) => row.user_id === 'user-1')).toBe(true);
        // The analytics log only gets append-only rows for answered messages.
        expect(analyticsInserts).toHaveLength(admitted);
        expect(inFlight).toBe(0);
    });

    it('does not fail an admitted request when the stale-slot cleanup fails', async () => {
        const store = fakeSlotStore({ cleanupThrows: true });
        routeWithSlots(store);
        const fetchMock = vi.fn(async () => new Response(JSON.stringify({ data: { response: 'ok' } }), { status: 200 }));
        vi.stubGlobal('fetch', fetchMock);
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const response = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', { method: 'POST', body: JSON.stringify({ message: 'Hi' }) }),
            { params: { agentId: 'agent-1' } },
        );

        // The request passed every check before cleanup ran, so a cleanup failure
        // must not turn it into a 500.
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ reply: 'ok' });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        // The failure is logged rather than silently dropped. The mock signals when
        // the query settles; the route's continuation runs on the next microtask.
        await store.cleanupFinished;
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(warn).toHaveBeenCalledWith('[AgentFlow] Rate-limit slot cleanup failed', expect.objectContaining({ message: 'cleanup connection reset' }));
        warn.mockRestore();
    });

    it('refuses with 503 and frees the slot when the burst count cannot be read', async () => {
        const store = fakeSlotStore({ countError: true });
        const analyticsInserts = routeWithSlots(store);
        const fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        const response = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', { method: 'POST', body: JSON.stringify({ message: 'Hi' }) }),
            { params: { agentId: 'agent-1' } },
        );
        expect(response.status).toBe(503);
        expect(fetchMock).not.toHaveBeenCalled();
        expect(store.rows).toHaveLength(0);
        expect(analyticsInserts).toHaveLength(0);
    });

    it('does not record usage for a failed reply and prunes stale slots', async () => {
        const store = fakeSlotStore();
        store.rows.push({ id: 'old', user_id: 'user-1', created_at: new Date(Date.now() - 60 * 60_000).toISOString() });
        const analyticsInserts = routeWithSlots(store);
        vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: 'busy' }), { status: 502 })));
        const failed = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', { method: 'POST', body: JSON.stringify({ message: 'Hi' }) }),
            { params: { agentId: 'agent-1' } },
        );
        expect(failed.status).toBe(502);
        expect(analyticsInserts).toHaveLength(0);
        // Cleanup runs in the background, so wait for it rather than assume it has run.
        await store.cleanupFinished;
        expect(store.rows.map((row) => row.id)).toEqual(['slot-1']);
    });

    it('returns the gateway reply and records an analytics event', async () => {
        mockTables();
        const fetchMock = vi.fn(async () => new Response(JSON.stringify({
            data: { response: 'Sure.', usage: { totalTokens: 4 } },
        }), { status: 200 }));
        vi.stubGlobal('fetch', fetchMock);

        const variants = [
            agent,
            { ...agent, personality: '', template_type: '', custom_instructions: '   ', knowledge_base: 'A long note' },
            { ...agent, knowledge_base: [] },
            { ...agent, knowledge_base: null },
            { ...agent, knowledge_base: new Proxy({}, { get() { throw new Error('kb'); } }) },
            { ...agent, subscription_tier: undefined },
        ];

        for (const variant of variants) {
            mockTables({ agent: variant, owner: { id: 'user-1', subscription_tier: null } });
            const response = await chat(
                new NextRequest('http://localhost/api/chat/agent-1', {
                    method: 'POST',
                    body: JSON.stringify({ message: 'Hi there' }),
                }),
                { params: { agentId: 'agent-1' } },
            );
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({ reply: 'Sure.' });
        }

        mockTables();
        vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ data: {} }), { status: 200 })));
        const fallback = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', {
                method: 'POST',
                body: JSON.stringify({ message: 'Hi' }),
            }),
            { params: { agentId: 'agent-1' } },
        );
        expect(await fallback.json()).toEqual({
            reply: 'I am ready to help, but something went wrong retrieving my response.',
        });

        admin.from.mockImplementation(() => {
            throw new Error('db down');
        });
        const crashed = await chat(
            new NextRequest('http://localhost/api/chat/agent-1', {
                method: 'POST',
                body: JSON.stringify({ message: 'Hi' }),
            }),
            { params: { agentId: 'agent-1' } },
        );
        expect(crashed.status).toBe(500);
        expect(fetchMock).toHaveBeenCalled();
    });
});

describe('polar webhook route', () => {
    beforeEach(() => {
        admin.from.mockReset();
        getSupabaseAdminClient.mockClear();
        process.env.POLAR_PRO_PRODUCT_ID = 'pro-product';
        process.env.POLAR_BUSINESS_PRODUCT_ID = 'biz-product';
        process.env.POLAR_WEBHOOK_SECRET = polarWebhookSecret;
    });

    function request(body: string, headers: Record<string, string> = {}) {
        return polar(
            new NextRequest('http://localhost/api/webhooks/polar', { method: 'POST', headers, body }),
        );
    }

    function post(
        body: string,
        options: { secret?: string; signedBody?: string; timestamp?: Date } = {},
    ) {
        const timestamp = options.timestamp ?? new Date();
        const webhookId = 'msg_test_123';
        const signature = new Webhook(options.secret ?? polarWebhookSecret).sign(
            webhookId,
            timestamp,
            options.signedBody ?? body,
        );
        return request(body, {
            'webhook-id': webhookId,
            'webhook-timestamp': Math.floor(timestamp.getTime() / 1000).toString(),
            'webhook-signature': signature,
        });
    }

    function mockWebhookTables() {
        admin.from.mockImplementation(() =>
            builder({
                data: { id: 'user-1', subscription_tier: 'free' },
                error: null,
            }),
        );
    }

    it('rejects an unsigned entitlement update before querying Supabase', async () => {
        mockWebhookTables();
        const response = await request(
            JSON.stringify({
                type: 'subscription.updated',
                customer: { email: 'victim@example.test', id: 'attacker-chosen-customer' },
                subscription: { product_id: 'biz-product' },
            }),
        );

        expect(response.status).toBe(403);
        expect(getSupabaseAdminClient).not.toHaveBeenCalled();
        expect(admin.from).not.toHaveBeenCalled();
    });

    it('rejects an invalid signature before querying Supabase', async () => {
        mockWebhookTables();
        const response = await request(
            JSON.stringify({
                type: 'subscription.updated',
                customer: { email: 'victim@example.test', id: 'attacker-chosen-customer' },
                subscription: { product_id: 'biz-product' },
            }),
            {
                'webhook-id': 'msg_test_123',
                'webhook-timestamp': Math.floor(Date.now() / 1000).toString(),
                'webhook-signature': 'v1,not-a-valid-signature',
            },
        );

        expect(response.status).toBe(403);
        expect(getSupabaseAdminClient).not.toHaveBeenCalled();
        expect(admin.from).not.toHaveBeenCalled();
    });

    it('rejects a tampered payload before querying Supabase', async () => {
        mockWebhookTables();
        const signedBody = JSON.stringify({
            type: 'subscription.updated',
            customer: { email: 'victim@example.test', id: 'attacker-chosen-customer' },
            subscription: { product_id: 'pro-product' },
        });
        const response = await post(
            JSON.stringify({
                type: 'subscription.updated',
                customer: { email: 'victim@example.test', id: 'attacker-chosen-customer' },
                subscription: { product_id: 'biz-product' },
            }),
            { signedBody },
        );

        expect(response.status).toBe(403);
        expect(getSupabaseAdminClient).not.toHaveBeenCalled();
        expect(admin.from).not.toHaveBeenCalled();
    });

    it('rejects a stale signature before querying Supabase', async () => {
        mockWebhookTables();
        const response = await post(
            JSON.stringify({
                type: 'subscription.updated',
                customer: { email: 'victim@example.test', id: 'attacker-chosen-customer' },
                subscription: { product_id: 'biz-product' },
            }),
            { timestamp: new Date(Date.now() - 6 * 60 * 1000) },
        );

        expect(response.status).toBe(403);
        expect(getSupabaseAdminClient).not.toHaveBeenCalled();
        expect(admin.from).not.toHaveBeenCalled();
    });

    it('fails closed when the webhook secret is missing', async () => {
        mockWebhookTables();
        delete process.env.POLAR_WEBHOOK_SECRET;

        const response = await post(
            JSON.stringify({
                type: 'subscription.updated',
                customer: { email: 'victim@example.test', id: 'attacker-chosen-customer' },
                subscription: { product_id: 'biz-product' },
            }),
        );

        expect(response.status).toBe(500);
        expect(getSupabaseAdminClient).not.toHaveBeenCalled();
        expect(admin.from).not.toHaveBeenCalled();
    });

    it('accepts a valid legacy Polar signature', async () => {
        const legacySecret = 'whsec_legacy-polar-secret';
        process.env.POLAR_WEBHOOK_SECRET = legacySecret;
        mockWebhookTables();

        const response = await post(
            JSON.stringify({
                type: 'subscription.updated',
                customer: { email: 'customer@example.test', id: 'cus_legacy' },
                subscription: { product_id: 'biz-product' },
            }),
            {
                secret: 'whsec_' + Buffer.from(legacySecret, 'utf8').toString('base64'),
            },
        );

        expect(response.status).toBe(200);
        expect(getSupabaseAdminClient).toHaveBeenCalledOnce();
    });

    it('validates the payload and ignores unknown customers', async () => {
        const bad = await post('{');
        expect(bad.status).toBe(400);
        expect(getSupabaseAdminClient).not.toHaveBeenCalled();

        admin.from.mockReturnValue(builder({ data: null, error: null }));
        const missingCustomer = await post(JSON.stringify({ type: 'subscription.created' }));
        expect(missingCustomer.status).toBe(400);
        expect(getSupabaseAdminClient).not.toHaveBeenCalled();

        const unknown = await post(JSON.stringify({
            event: 'order.paid',
            data: { customer: { email: 'dev@gravity.ai', id: 'cus_1' }, product: { id: 'pro-product' } },
        }));
        expect(unknown.status).toBe(200);
    });

    it('updates the tier and appends a billing event', async () => {
        const inserted = vi.fn(async () => ({ error: null }));
        const tierUpdates: unknown[] = [];
        admin.from.mockImplementation((table: string) => {
            const query = builder({ data: { id: 'user-1', subscription_tier: 'free' }, error: null });
            const update = query.update;
            query.update = (value?: unknown) => {
                tierUpdates.push(value);
                return update();
            };
            if (table === 'billing_events') query.insert = inserted;
            return query;
        });

        const response = await post(JSON.stringify({
            type: 'subscription.updated',
            customer: { email: 'dev@gravity.ai', id: 'cus_1' },
            subscription: { product_id: 'biz-product' },
        }));
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ received: true });
        expect(tierUpdates).toContainEqual({
            subscription_tier: 'business',
            polar_customer_id: 'cus_1',
        });
        expect(inserted).toHaveBeenCalledOnce();

        const noTier = await post(JSON.stringify({
            type: 'order.created',
            customer: { email: 'dev@gravity.ai' },
            product: { id: 'unknown-product' },
        }));
        expect(noTier.status).toBe(200);

        admin.from.mockImplementation(() => {
            throw new Error('write failed');
        });
        const crashed = await post(JSON.stringify({
            type: 'order.created',
            customer: { id: 'cus_1' },
        }));
        expect(crashed.status).toBe(500);
    });

    it('does not acknowledge a failed customer lookup', async () => {
        admin.from.mockReturnValue(builder({
            data: null,
            error: { message: 'database unavailable' },
        }));

        const response = await post(JSON.stringify({
            type: 'order.paid',
            customer: { id: 'cus_1' },
            product: { id: 'unknown-product' },
        }));

        expect(response.status).toBe(500);
    });

    it('does not acknowledge a failed tier update', async () => {
        const inserted = vi.fn(async () => ({ error: null }));
        let userQueries = 0;
        admin.from.mockImplementation((table: string) => {
            if (table === 'users') {
                userQueries += 1;
                if (userQueries === 1) {
                    return builder({ data: { id: 'user-1', subscription_tier: 'free' }, error: null });
                }
                return {
                    update: () => ({
                        eq: async () => ({ error: { message: 'tier update failed' } }),
                    }),
                };
            }
            if (table === 'billing_events') return { insert: inserted };
            return builder({ data: null, error: null });
        });

        const response = await post(JSON.stringify({
            type: 'subscription.updated',
            customer: { id: 'cus_1' },
            subscription: { product_id: 'biz-product' },
        }));

        expect(response.status).toBe(500);
        expect(inserted).not.toHaveBeenCalled();
    });

    it('does not acknowledge a failed billing-event insert', async () => {
        const inserted = vi.fn(async () => ({ error: { message: 'event log write failed' } }));
        admin.from.mockImplementation((table: string) => {
            if (table === 'billing_events') return { insert: inserted };
            return builder({ data: { id: 'user-1', subscription_tier: 'free' }, error: null });
        });

        const response = await post(JSON.stringify({
            type: 'order.paid',
            customer: { id: 'cus_1' },
            product: { id: 'unknown-product' },
        }));

        expect(response.status).toBe(500);
        expect(inserted).toHaveBeenCalledOnce();
    });
});
