import { describe, expect, it, vi } from 'vitest';
import { SkillsPlatform } from '../../../apps/gateway/src/services/skills-platform.js';
import { GravityMemory } from '@gravity/memory';
import { GravityMCPClient } from '@gravity/mcp-client';
import type { Skill } from '@gravity/types';

function platform() {
    const memory = new GravityMemory('test-key');
    vi.spyOn(memory, 'getEffectiveContext').mockResolvedValue({
        system: [],
        messages: [{ role: 'user', content: 'hi' }],
    });
    const mcp = new GravityMCPClient();
    return { skills: new SkillsPlatform(memory, mcp), memory, mcp };
}

describe('SkillsPlatform', () => {
    it('registers built-in skills and creates a workspace', async () => {
        const { skills } = platform();
        expect(skills.getAvailableSkills().map((skill) => skill.id)).toEqual([
            'web-search',
            'file-manager',
            'automation',
            'communication',
        ]);
        expect(skills.getSkillsByCategory('utility')).toHaveLength(1);

        const workspace = await skills.createWorkspace('user-1', 'Support', ['web-search']);
        expect(skills.getWorkspace('user-1')?.id).toBe(workspace.id);
        expect(skills.getWorkspace('missing')).toBeUndefined();
        expect(skills.getStats()).toMatchObject({
            totalSkills: 4,
            totalWorkspaces: 1,
            totalExecutions: 0,
        });
    });

    it('keeps executions started in the same millisecond', async () => {
        const { skills } = platform();
        const workspace = await skills.createWorkspace('user-1', 'Ops');
        const dateNow = vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

        try {
            const first = await skills.executeSkill('automation', workspace.id, 'user-1', 'first');
            const second = await skills.executeSkill('communication', workspace.id, 'user-1', 'second');
            const history = skills.getExecutionHistory('user-1', 10);

            expect(first.id).not.toBe(second.id);
            expect(history).toHaveLength(2);
            expect(history.map((execution) => execution.id)).toEqual(
                expect.arrayContaining([first.id, second.id]),
            );
        } finally {
            dateNow.mockRestore();
        }
    });

    it('executes each skill category', async () => {
        const { skills } = platform();
        const workspace = await skills.createWorkspace('user-1', 'Ops');

        const search = await skills.executeSkill('web-search', workspace.id, 'user-1', 'gravity news');
        expect(search.status).toBe('completed');
        expect(search.output).toContain('gravity news');

        const files = await skills.executeSkill('file-manager', workspace.id, 'user-1', 'read /tmp/a.txt');
        expect(files.output).toContain('/tmp/a.txt');
        const other = await skills.executeSkill('file-manager', workspace.id, 'user-1', 'list files');
        expect(other.output).toContain('Productivity skill');

        const automation = await skills.executeSkill('automation', workspace.id, 'user-1', 'nightly report');
        expect(automation.output).toContain('Automation setup');
        const communication = await skills.executeSkill('communication', workspace.id, 'user-1', 'ping the team');
        expect(communication.output).toContain('Communication handled');

        const custom: Skill = {
            id: 'notes',
            name: 'Notes',
            description: 'Take notes',
            version: '1.0.0',
            author: 'test',
            category: 'development',
            permissions: [],
            tools: [],
            prompts: {},
        };
        skills.registerSkill(custom);
        const generic = await skills.executeSkill('notes', workspace.id, 'user-1', 'remember this');
        expect(generic.output).toContain('Notes');

        const plainUtility: Skill = {
            ...custom,
            id: 'clock',
            name: 'Clock',
            category: 'utility',
            tools: [],
            prompts: { system: 'tell time' },
        };
        skills.registerSkill(plainUtility);
        const utility = await skills.executeSkill('clock', workspace.id, 'user-1', 'time');
        expect(utility.output).toContain('Utility skill');

        const history = skills.getExecutionHistory('user-1', 2);
        expect(history).toHaveLength(2);
        expect(history[0].startTime.getTime()).toBeGreaterThanOrEqual(history[1].startTime.getTime());
        expect(skills.getStats().executionsByStatus.completed).toBeGreaterThan(0);
    });

    it('records failed executions and missing records', async () => {
        const { skills, memory } = platform();
        const workspace = await skills.createWorkspace('user-1', 'Ops');
        await expect(skills.executeSkill('missing', workspace.id, 'user-1', 'x')).rejects.toThrow(/Skill not found/);
        await expect(skills.executeSkill('web-search', 'missing', 'user-1', 'x')).rejects.toThrow(/Workspace not found/);

        vi.mocked(memory.getEffectiveContext).mockRejectedValueOnce(new Error('memory down'));
        const failed = await skills.executeSkill('web-search', workspace.id, 'user-1', 'query');
        expect(failed.status).toBe('failed');
        expect(failed.error).toBe('memory down');

        const fileSkill = skills.getAvailableSkills().find((skill) => skill.id === 'file-manager');
        if (!fileSkill) throw new Error('missing file skill');
        fileSkill.prompts = { system: undefined, agents: undefined, tools: undefined };
        const stillRuns = await skills.executeSkill('file-manager', workspace.id, 'user-1', 'list');
        expect(stillRuns.status).toBe('completed');
    });
});
