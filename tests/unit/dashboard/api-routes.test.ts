import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { admin } = vi.hoisted(() => ({
    admin: { from: vi.fn() },
}));

vi.mock('../../../apps/dashboard/src/lib/index.ts', async () => {
    const actual = await vi.importActual<typeof import('../../../apps/dashboard/src/lib/index.ts')>(
        '../../../apps/dashboard/src/lib/index.ts',
    );
    return {
        ...actual,
        getSupabaseAdminClient: () => admin,
    };
});

import { POST as chat } from '../../../apps/dashboard/src/app/api/chat/[agentId]/route.js';
import { POST as polar } from '../../../apps/dashboard/src/app/api/webhooks/polar/route.js';

function builder(result: { data?: unknown; error?: unknown; count?: number | null }) {
    const query = {
        select: () => query,
        eq: () => query,
        gte: () => query,
        or: () => query,
        limit: () => query,
        update: () => query,
        insert: vi.fn(async () => ({ error: null })),
        single: async () => result,
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

describe('dashboard chat route', () => {
    beforeEach(() => {
        admin.from.mockReset();
        vi.unstubAllGlobals();
    });

    function mockTables(overrides?: { messages?: number; agent?: unknown; owner?: unknown }) {
        admin.from.mockImplementation((table: string) => {
            if (table === 'agents') return builder({ data: overrides?.agent === undefined ? agent : overrides.agent, error: overrides?.agent === null ? { message: 'missing' } : null });
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
        process.env.POLAR_PRO_PRODUCT_ID = 'pro-product';
        process.env.POLAR_BUSINESS_PRODUCT_ID = 'biz-product';
    });

    function post(body: string) {
        return polar(new NextRequest('http://localhost/api/webhooks/polar', { method: 'POST', body }));
    }

    it('validates the payload and ignores unknown customers', async () => {
        const bad = await post('{');
        expect(bad.status).toBe(400);

        admin.from.mockReturnValue(builder({ data: null, error: null }));
        const missingCustomer = await post(JSON.stringify({ type: 'subscription.created' }));
        expect(missingCustomer.status).toBe(400);

        const unknown = await post(JSON.stringify({
            event: 'order.paid',
            data: { customer: { email: 'dev@gravity.ai', id: 'cus_1' }, product: { id: 'pro-product' } },
        }));
        expect(unknown.status).toBe(200);
    });

    it('updates the tier and appends a billing event', async () => {
        const inserted = vi.fn(async () => ({ error: null }));
        admin.from.mockImplementation((table: string) => {
            const query = builder({ data: { id: 'user-1', subscription_tier: 'free' }, error: null });
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
});
