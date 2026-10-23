import { beforeEach, describe, expect, it, vi } from 'vitest';

const { auth, from } = vi.hoisted(() => ({
    auth: { getUser: vi.fn() },
    from: vi.fn(),
}));

vi.mock('../../../apps/dashboard/src/lib/supabaseClient.js', () => ({
    supabaseClient: { auth, from },
}));

import { getUsageSnapshotForCurrentUser } from '../../../apps/dashboard/src/lib/usage.js';

function query(result: { data?: unknown; error?: unknown; count?: number | null }) {
    const builder = {
        select: () => builder,
        eq: () => builder,
        gte: () => builder,
        single: async () => result,
        then: (resolve: (value: typeof result) => void) => Promise.resolve(result).then(resolve),
    };
    return builder;
}

describe('usage snapshot', () => {
    beforeEach(() => {
        auth.getUser.mockReset();
        from.mockReset();
    });

    it('returns null when the user or profile is missing', async () => {
        auth.getUser.mockResolvedValue({ data: { user: null }, error: new Error('signed out') });
        expect(await getUsageSnapshotForCurrentUser()).toBeNull();

        auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
        from.mockReturnValue(query({ data: null, error: { message: 'missing' } }));
        expect(await getUsageSnapshotForCurrentUser()).toBeNull();
    });

    it('counts agents and messages for the current month', async () => {
        auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
        from.mockImplementation((table: string) => {
            if (table === 'users') {
                return query({ data: { id: 'user-1', subscription_tier: 'pro' }, error: null });
            }
            if (table === 'agents') return query({ count: 2, error: null });
            return query({ count: null, error: null });
        });

        const snapshot = await getUsageSnapshotForCurrentUser();
        expect(snapshot).toMatchObject({
            tier: 'pro',
            agentsCount: 2,
            messagesThisMonth: 0,
            limits: { maxAgents: 5, maxMessagesPerMonth: 5000 },
        });
    });
});
