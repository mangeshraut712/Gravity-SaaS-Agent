import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GravityMemory } from '@gravity/memory';

describe('GravityMemory', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('marks stable history for prompt caching', async () => {
        const memory = new GravityMemory('test-key');
        const history = Array.from({ length: 8 }, (_, index) => ({
            role: 'user',
            content: `message ${index}`,
        }));

        const context = await memory.getEffectiveContext(history, 'You are Gravity.');
        expect(context.system[0]).toMatchObject({
            text: 'You are Gravity.',
            cache_control: { type: 'ephemeral' },
        });
        expect(context.messages[0]).toMatchObject({ cache_control: { type: 'ephemeral' } });
        expect(context.messages[7]).toEqual(history[7]);
        expect(context.messages[4].cache_control).toBeUndefined();
    });

    it('summarizes history once the context budget is exceeded', async () => {
        const memory = new GravityMemory('test-key');
        const create = vi.fn().mockResolvedValue({
            content: [{ type: 'text', text: 'User likes short answers.' }],
        });
        (memory as unknown as { anthropic: { messages: { create: typeof create } } }).anthropic.messages.create = create;

        const history = [
            { role: 'user', content: 'x'.repeat(90_000) },
            ...Array.from({ length: 11 }, (_, index) => ({ role: 'user', content: `recent ${index}` })),
        ];

        const context = await memory.getEffectiveContext(history, 'system');
        expect(create).toHaveBeenCalledOnce();
        expect(context.messages[0].content).toContain('[COMPACTED HISTORY SUMMARY]');
        expect(context.messages[0].content).toContain('short answers');
        expect(context.messages).toHaveLength(11);
    });

    it('returns an empty summary when the model does not answer with text', async () => {
        const memory = new GravityMemory('test-key');
        const create = vi.fn().mockResolvedValue({
            content: [{ type: 'tool_use', id: 'tool-1' }],
        });
        (memory as unknown as { anthropic: { messages: { create: typeof create } } }).anthropic.messages.create = create;

        const history = [
            { role: 'user', content: 'y'.repeat(90_000) },
            ...Array.from({ length: 11 }, () => ({ role: 'user', content: 'recent' })),
        ];
        const context = await memory.getEffectiveContext(history, 'system');
        expect(context.messages[0].content).toContain('[COMPACTED HISTORY SUMMARY]: ');
        expect(context.messages[0].content.endsWith(': ')).toBe(true);
    });
});
