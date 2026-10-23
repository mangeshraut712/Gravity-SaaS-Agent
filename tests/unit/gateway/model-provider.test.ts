import { afterEach, describe, expect, it, vi } from 'vitest';
import { ModelProviderManager, OpenRouterProvider } from '../../../apps/gateway/src/services/model-provider.js';
import { openRouterBreaker } from '../../../apps/gateway/src/services/circuit-breaker.js';

const config = {
    apiKey: 'sk-or-test',
    models: ['openrouter/anthropic/claude-3.5-sonnet'],
    defaultModel: 'openrouter/anthropic/claude-3.5-sonnet',
    baseUrl: 'https://openrouter.test/api/v1',
};

function jsonResponse(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

describe('OpenRouterProvider', () => {
    const originalFetch = globalThis.fetch;

    afterEach(() => {
        globalThis.fetch = originalFetch;
        openRouterBreaker.reset();
        vi.useRealTimers();
    });

    it('completes a chat and estimates tokens', async () => {
        globalThis.fetch = vi.fn(async () => jsonResponse({
            id: 'cmpl',
            object: 'chat.completion',
            created: 1,
            model: 'openrouter/anthropic/claude-3.5-sonnet',
            choices: [{ index: 0, message: { role: 'assistant', content: 'hello' }, finish_reason: 'stop' }],
            usage: { prompt_tokens: 3, completion_tokens: 4, total_tokens: 7 },
        })) as typeof fetch;

        const provider = new OpenRouterProvider(config);
        const completion = await provider.chatCompletion({
            messages: [{ role: 'user', content: 'hi', timestamp: new Date() }],
        });
        expect(completion).toMatchObject({
            content: 'hello',
            provider: 'openrouter',
            usage: { totalTokens: 7 },
        });
        expect(await provider.estimateTokens('abcd')).toBe(1);
        expect(await provider.estimateTokens('abcde')).toBe(2);
        expect(provider.getModelInfo('openai/gpt-4-turbo')).toEqual({
            name: 'gpt-4-turbo',
            provider: 'openai',
            capabilities: ['chat', 'completion', 'streaming'],
        });
        expect(provider.getModelInfo('plain-model').provider).toBe('plain-model');
        await expect(provider.getUsageStats()).resolves.toMatchObject({ totalRequests: 0 });
    });

    it('retries failed completions and falls back when listing models', async () => {
        vi.useFakeTimers();
        globalThis.fetch = vi.fn(async () => jsonResponse({ error: 'nope' }, 500)) as typeof fetch;
        const provider = new OpenRouterProvider(config);
        const pending = provider.chatCompletion({ messages: [{ role: 'user', content: 'hi' }] });
        const assertion = expect(pending).rejects.toThrow(/OpenRouter API error/);
        await vi.runAllTimersAsync();
        await assertion;
        expect(globalThis.fetch).toHaveBeenCalledTimes(3);

        globalThis.fetch = vi.fn(async () => {
            throw new Error('offline');
        }) as typeof fetch;
        await expect(provider.listModels()).resolves.toEqual(config.models);
        await expect(provider.validateApiKey()).resolves.toBe(false);

        globalThis.fetch = vi.fn(async () => jsonResponse({ data: [{ id: 'm1' }, { id: 'm2' }] })) as typeof fetch;
        await expect(provider.listModels()).resolves.toEqual(['m1', 'm2']);
        await expect(provider.validateApiKey()).resolves.toBe(true);
    });
});

describe('ModelProviderManager', () => {
    const originalFetch = globalThis.fetch;
    const originalKey = process.env.OPENROUTER_API_KEY;
    const originalModel = process.env.OPENROUTER_MODEL;

    afterEach(() => {
        globalThis.fetch = originalFetch;
        if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY;
        else process.env.OPENROUTER_API_KEY = originalKey;
        if (originalModel === undefined) delete process.env.OPENROUTER_MODEL;
        else process.env.OPENROUTER_MODEL = originalModel;
        openRouterBreaker.reset();
    });

    it('initializes openrouter and routes completions', async () => {
        process.env.OPENROUTER_API_KEY = 'sk-or-live';
        process.env.OPENROUTER_MODEL = 'openrouter/openai/gpt-4';
        globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
            const url = String(input);
            if (url.endsWith('/models')) return jsonResponse({ data: [{ id: 'm1' }] });
            return jsonResponse({
                model: 'openrouter/openai/gpt-4',
                choices: [{ message: { content: 'routed' } }],
                usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
            });
        }) as typeof fetch;

        const manager = new ModelProviderManager();
        await manager.init();
        expect(manager.getAvailableProviders()).toEqual(['openrouter']);
        await expect(manager.validateAllProviders()).resolves.toEqual({ openrouter: true });
        const completion = await manager.chatCompletion({
            messages: [{ role: 'user', content: 'hi' }],
            provider: 'openrouter',
        });
        expect(completion.content).toBe('routed');
        await expect(manager.listModels()).resolves.toEqual(['m1']);
        await expect(manager.getProviderStats()).resolves.toMatchObject({
            openrouter: { totalRequests: 0 },
        });
        manager.setDefaultProvider('openrouter');
        expect(() => manager.setDefaultProvider('missing')).toThrow(/not found/);
        await expect(manager.chatCompletion({ messages: [], provider: 'missing' })).rejects.toThrow(/not found/);
        await expect(manager.listModels('missing')).rejects.toThrow(/not found/);
    });

    it('leaves the registry empty without an api key', async () => {
        delete process.env.OPENROUTER_API_KEY;
        const manager = new ModelProviderManager();
        await manager.init();
        expect(manager.getProvider()).toBeUndefined();
        expect(manager.getAvailableProviders()).toEqual([]);
        await expect(manager.getProviderStats()).resolves.toEqual({});
    });

    it('records a provider that does not expose usage stats', async () => {
        const manager = new ModelProviderManager();
        const provider = {
            name: 'static',
            apiKey: 'key',
            models: ['static'],
            chatCompletion: vi.fn(),
            listModels: vi.fn(async () => ['static']),
            validateApiKey: vi.fn(async () => true),
        };
        (manager as unknown as { providers: Map<string, typeof provider> }).providers.set('static', provider);
        await expect(manager.getProviderStats()).resolves.toEqual({ static: { status: 'available' } });
    });
});
