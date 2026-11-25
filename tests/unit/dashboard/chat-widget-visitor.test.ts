import { afterEach, describe, expect, it, vi } from 'vitest';
import { visitorIdFor } from '../../../apps/dashboard/src/components/ChatWidget';

describe('visitorIdFor', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('persists one ID per agent in localStorage', () => {
        const store = new Map<string, string>();
        vi.stubGlobal('window', {
            localStorage: {
                getItem: (k: string) => store.get(k) ?? null,
                setItem: (k: string, v: string) => void store.set(k, v),
            },
        });
        const first = visitorIdFor('agent-ls');
        expect(visitorIdFor('agent-ls')).toBe(first);
        expect(store.get('agentflow:visitor:agent-ls')).toBe(first);
        expect(visitorIdFor('agent-ls-other')).not.toBe(first);
    });

    it('keeps a stable in-memory ID when storage is blocked', () => {
        vi.stubGlobal('window', {
            localStorage: {
                getItem: () => { throw new Error('SecurityError'); },
                setItem: () => { throw new Error('SecurityError'); },
            },
        });
        const first = visitorIdFor('agent-blocked');
        expect(first).toMatch(/^[0-9a-f-]{36}$/);
        expect(visitorIdFor('agent-blocked')).toBe(first);
    });

    it('keeps the same ID when setItem fails after a read', () => {
        vi.stubGlobal('window', {
            localStorage: {
                getItem: () => null,
                setItem: () => { throw new Error('QuotaExceededError'); },
            },
        });
        const first = visitorIdFor('agent-quota');
        expect(visitorIdFor('agent-quota')).toBe(first);
    });
});
