import { SecurityAuditResult } from '@gravity/types';

export class SecurityService {
    async audit(): Promise<SecurityAuditResult> {
        const vulnerabilities: string[] = [];
        const recommendations: string[] = [];
        let score = 100;

        // 1. Check if isolation is enabled
        const isolationEnabled = process.env.SANDBOX_MODE === 'true';
        if (!isolationEnabled) {
            vulnerabilities.push('CRITICAL: Sandbox Mode is DISABLED. Agent has root shell access.');
            recommendations.push('Enable SANDBOX_MODE=true in your environment configuration');
            score -= 40;
        }

        // 2. Check token permissions
        const tokenScope = process.env.GITHUB_TOKEN_SCOPE || 'full';
        if (tokenScope === 'full') {
            vulnerabilities.push('WARN: GitHub Token has excessively broad permissions.');
            recommendations.push('Limit GitHub token scope to read-only permissions');
            score -= 15;
        }

        // 3. Prompt Injection Defense Level
        const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
        if (!model.includes('opus') && !model.includes('sonnet')) {
            vulnerabilities.push('WARN: Model selection may not have optimal prompt injection resistance.');
            recommendations.push('Use Claude 3.5 Sonnet or Opus for better security');
            score -= 10;
        }

        // 4. Check API key security
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey || apiKey.length < 20) {
            vulnerabilities.push('CRITICAL: Invalid or missing Anthropic API key.');
            recommendations.push('Set a valid ANTHROPIC_API_KEY in your environment');
            score -= 30;
        }

        // 5. Check OpenRouter API key
        const openRouterKey = process.env.OPENROUTER_API_KEY;
        if (!openRouterKey || !openRouterKey.startsWith('sk-or-')) {
            vulnerabilities.push('WARN: Invalid or missing OpenRouter API key.');
            recommendations.push('Set a valid OPENROUTER_API_KEY in your environment');
            score -= 15;
        }

        // 6. Check rate limiting configuration
        const rateLimitEnabled = process.env.RATE_LIMIT_MAX_REQUESTS && parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) > 0;
        if (!rateLimitEnabled) {
            vulnerabilities.push('WARN: Rate limiting is not configured.');
            recommendations.push('Configure RATE_LIMIT_MAX_REQUESTS to prevent abuse');
            score -= 10;
        }

        console.log('[Security Audit] Scan complete.');
        return {
            passed: vulnerabilities.length === 0,
            vulnerabilities,
            recommendations,
            score: Math.max(0, score)
        };
    }

    validateCommand(command: string, whitelist: string[]): boolean {
        if (whitelist.includes('*')) {
            console.warn('[Security] Wildcard (*) detected in command whitelist - this is risky!');
            return true;
        }
        
        // Enhanced command validation
        const dangerousPatterns = [
            /rm\s+-rf/,
            /sudo\s+rm/,
            /chmod\s+777/,
            /dd\s+if=/,
            />\s*\/dev\/null/,
            /curl\s+.*\|\s*sh/,
            /wget\s+.*\|\s*bash/
        ];
        
        for (const pattern of dangerousPatterns) {
            if (pattern.test(command)) {
                console.error(`[Security] Dangerous command pattern detected: ${command}`);
                return false;
            }
        }
        
        return whitelist.some(allowed => command.startsWith(allowed));
    }

    sanitizeInput(input: string): string {
        return input
            .replace(/[<>"']/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    validateApiKey(key: string): boolean {
        return key.startsWith('sk-ant-') && key.length >= 40;
    }

    validateOpenRouterKey(key: string): boolean {
        return key.startsWith('sk-or-') && key.length >= 40;
    }
}

export const securityService = new SecurityService();
