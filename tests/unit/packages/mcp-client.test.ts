import { describe, expect, it, vi } from 'vitest';
import { GravityMCPClient } from '@gravity/mcp-client';

describe('GravityMCPClient', () => {
    it('registers tools and filters them', async () => {
        const client = new GravityMCPClient();
        client.registerTool('shell', 'Run a shell', { cmd: { type: 'string' } }, 'system', true);

        const tools = await client.getTools();
        expect(tools.map((tool) => tool.name)).toEqual(expect.arrayContaining(['web_search', 'file_read', 'shell']));
        expect(client.getToolsByCategory('general').length).toBeGreaterThanOrEqual(2);
        expect(client.getDangerousTools().map((tool) => tool.name)).toEqual(['shell']);
    });

    it('executes known tools and reports failures', async () => {
        const client = new GravityMCPClient();
        await expect(client.callTool('missing', {})).rejects.toThrow(/not found/);

        const search = await client.callTool('web_search', { query: 'gravity' });
        expect(search.success).toBe(true);
        expect(search.result).toContain('gravity');

        const badSearch = await client.callTool('web_search', {});
        expect(badSearch.success).toBe(false);
        expect(badSearch.result).toContain('Search query is required');

        const file = await client.callTool('file_read', { path: '/tmp/notes.txt' });
        expect(file.result).toContain('/tmp/notes.txt');

        const badFile = await client.callTool('file_read', { path: 12 });
        expect(badFile.success).toBe(false);

        client.registerTool('echo', 'Echo', {}, 'general', false);
        const generic = await client.callTool('echo', { value: 1 });
        expect(generic).toEqual({ result: 'Executed echo successfully.', success: true });

        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        client.registerTool('danger', 'Danger', {}, 'system', true);
        await client.callTool('danger', {});
        expect(warn).toHaveBeenCalled();
    });
});
