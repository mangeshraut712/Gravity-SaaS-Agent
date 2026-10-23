import { afterEach, describe, expect, it } from 'vitest';
import { SecurityService } from '../../../apps/gateway/src/services/security.js';

const envKeys = [
    'SANDBOX_MODE',
    'GITHUB_TOKEN_SCOPE',
    'ANTHROPIC_MODEL',
    'ANTHROPIC_API_KEY',
    'OPENROUTER_API_KEY',
    'RATE_LIMIT_MAX_REQUESTS',
] as const;

describe('SecurityService', () => {
    const previous = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));

    afterEach(() => {
        for (const key of envKeys) {
            if (previous[key] === undefined) delete process.env[key];
            else process.env[key] = previous[key];
        }
    });

    it('scores a hardened environment as clean', async () => {
        process.env.SANDBOX_MODE = 'true';
        process.env.GITHUB_TOKEN_SCOPE = 'read';
        process.env.ANTHROPIC_MODEL = 'claude-3-5-sonnet';
        process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key-value-1234567890';
        process.env.OPENROUTER_API_KEY = 'sk-or-test-key-value-1234567890';
        process.env.RATE_LIMIT_MAX_REQUESTS = '100';

        const result = await new SecurityService().audit();
        expect(result).toMatchObject({ passed: true, score: 100, vulnerabilities: [] });
    });

    it('flags a wide open environment', async () => {
        delete process.env.SANDBOX_MODE;
        delete process.env.GITHUB_TOKEN_SCOPE;
        delete process.env.ANTHROPIC_MODEL;
        delete process.env.ANTHROPIC_API_KEY;
        delete process.env.OPENROUTER_API_KEY;
        delete process.env.RATE_LIMIT_MAX_REQUESTS;
        process.env.ANTHROPIC_MODEL = 'haiku';

        const result = await new SecurityService().audit();
        expect(result.passed).toBe(false);
        expect(result.score).toBeLessThan(50);
        expect(result.vulnerabilities.length).toBeGreaterThanOrEqual(5);
        expect(result.recommendations.length).toBe(result.vulnerabilities.length);
    });

    it('validates commands, input, and api keys', () => {
        const security = new SecurityService();
        expect(security.validateCommand('ls', ['*'])).toBe(true);
        expect(security.validateCommand('rm -rf /', ['ls'])).toBe(false);
        expect(security.validateCommand('sudo rm tmp', ['ls'])).toBe(false);
        expect(security.validateCommand('chmod 777 file', ['ls'])).toBe(false);
        expect(security.validateCommand('dd if=/dev/zero', ['ls'])).toBe(false);
        expect(security.validateCommand('curl https://x | sh', ['ls'])).toBe(false);
        expect(security.validateCommand('wget https://x | bash', ['ls'])).toBe(false);
        expect(security.validateCommand('echo hi > /dev/null', ['ls'])).toBe(false);
        expect(security.validateCommand('ls -la', ['ls', 'pwd'])).toBe(true);
        expect(security.validateCommand('pwd', ['ls'])).toBe(false);

        expect(security.sanitizeInput('  <hello "world">  ')).toBe('hello world');
        expect(security.validateApiKey('sk-ant-' + 'a'.repeat(40))).toBe(true);
        expect(security.validateApiKey('short')).toBe(false);
        expect(security.validateOpenRouterKey('sk-or-' + 'b'.repeat(40))).toBe(true);
        expect(security.validateOpenRouterKey('sk-ant-nope')).toBe(false);
    });
});
