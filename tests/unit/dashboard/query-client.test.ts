import { describe, expect, it, vi } from 'vitest';
import { prefetchQueries, queryClient, queryKeys } from '../../../apps/dashboard/src/lib/queryClient.js';

describe('query client', () => {
    it('builds stable query keys', () => {
        expect(queryKeys.agents.list({ status: 'active' })).toEqual(['agents', 'list', { status: 'active' }]);
        expect(queryKeys.agents.detail('agent-1')).toEqual(['agents', 'detail', 'agent-1']);
        expect(queryKeys.conversations.list('agent-1')).toEqual(['conversations', 'list', 'agent-1']);
        expect(queryKeys.conversations.detail('conv-1')).toEqual(['conversations', 'detail', 'conv-1']);
        expect(queryKeys.analytics.stats('7d')).toEqual(['analytics', 'stats', '7d']);
        expect(queryKeys.analytics.dashboard()).toEqual(['analytics', 'dashboard']);
        expect(queryKeys.user.profile()).toEqual(['user', 'profile']);
        expect(queryKeys.user.billing()).toEqual(['user', 'billing']);
    });

    it('backs off retries and prefetches common queries', async () => {
        const retryDelay = queryClient.getDefaultOptions().queries?.retryDelay;
        if (typeof retryDelay !== 'function') throw new Error('retryDelay was not configured');
        expect(retryDelay(0, new Error('x'))).toBe(1000);
        expect(retryDelay(2, new Error('x'))).toBe(4000);
        expect(retryDelay(10, new Error('x'))).toBe(30000);
        expect(queryClient.getDefaultOptions().queries?.retry).toBe(3);
        expect(queryClient.getDefaultOptions().mutations?.retry).toBe(1);

        const cancel = vi.spyOn(queryClient, 'cancelQueries').mockResolvedValue();
        await queryClient.getDefaultOptions().mutations?.onMutate?.({} as never);
        expect(cancel).toHaveBeenCalled();

        const fetchMock = vi.fn(async () => ({ json: async () => ({ ok: true }) }));
        vi.stubGlobal('fetch', fetchMock);
        await prefetchQueries.agents();
        await prefetchQueries.analytics();
        expect(fetchMock).toHaveBeenCalledWith('/api/agents');
        expect(fetchMock).toHaveBeenCalledWith('/api/analytics/dashboard');
    });
});
