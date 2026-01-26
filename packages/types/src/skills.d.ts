export interface Skill {
    id: string;
    name: string;
    description: string;
    version: string;
    author: string;
    category: 'productivity' | 'automation' | 'communication' | 'development' | 'utility';
    permissions: string[];
    tools: string[];
    prompts: {
        system?: string;
        agents?: string;
        soul?: string;
        tools?: string;
    };
    config?: Record<string, any>;
}
export interface Workspace {
    id: string;
    userId: string;
    name: string;
    skills: string[];
    agents: {
        system: string;
        soul: string;
        tools: string;
    };
    settings: {
        sandbox: {
            enabled: boolean;
            mode: 'main' | 'non-main';
            allowlist: string[];
            denylist: string[];
        };
        model: {
            provider: 'anthropic' | 'openai';
            model: string;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface SkillExecution {
    id: string;
    skillId: string;
    workspaceId: string;
    userId: string;
    input: string;
    output?: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    error?: string;
    startTime: Date;
    endTime?: Date;
    metadata?: Record<string, any>;
}
