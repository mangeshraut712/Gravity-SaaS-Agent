import { Skill, Workspace, SkillExecution } from '@gravity/types';
import { GravityMemory } from '@gravity/memory';
import { GravityMCPClient } from '@gravity/mcp-client';

/**
 * Skills Platform - Clawdbot-inspired workspace and skill management
 */
export class SkillsPlatform {
  private skills: Map<string, Skill> = new Map();
  private workspaces: Map<string, Workspace> = new Map();
  private executions: Map<string, SkillExecution> = new Map();
  private memory: GravityMemory;
  private mcp: GravityMCPClient;

  constructor(memory: GravityMemory, mcp: GravityMCPClient) {
    this.memory = memory;
    this.mcp = mcp;
    this.initializeBuiltinSkills();
  }

  /**
   * Initialize built-in skills inspired by Clawdbot
   */
  private initializeBuiltinSkills(): void {
    // Web Search Skill
    this.registerSkill({
      id: 'web-search',
      name: 'Web Search',
      description: 'Search the web for information',
      version: '1.0.0',
      author: 'GravityOS',
      category: 'utility',
      permissions: ['network'],
      tools: ['web_search'],
      prompts: {
        system: 'You are a web search assistant. Find accurate, up-to-date information.',
        agents: 'When users ask for current information, use the web_search tool to find relevant results.',
        tools: 'Use web_search to find information. Always cite sources and provide multiple perspectives.'
      }
    });

    // File Management Skill
    this.registerSkill({
      id: 'file-manager',
      name: 'File Manager',
      description: 'Read, write, and manage files',
      version: '1.0.0',
      author: 'GravityOS',
      category: 'productivity',
      permissions: ['filesystem'],
      tools: ['file_read', 'file_write', 'file_list'],
      prompts: {
        system: 'You are a file management assistant. Help users organize and manage their files.',
        agents: 'When users need file operations, use the file tools to read, write, or list files.',
        tools: 'Use file_read to read files, file_write to write files, and file_list to list directories.'
      }
    });

    // Automation Skill
    this.registerSkill({
      id: 'automation',
      name: 'Automation Assistant',
      description: 'Create and manage automated workflows',
      version: '1.0.0',
      author: 'GravityOS',
      category: 'automation',
      permissions: ['process', 'cron'],
      tools: ['process_run', 'cron_schedule'],
      prompts: {
        system: 'You are an automation expert. Help users create efficient workflows.',
        agents: 'When users want to automate tasks, help them create schedules and processes.',
        tools: 'Use process_run to execute commands and cron_schedule to set up recurring tasks.'
      }
    });

    // Communication Skill
    this.registerSkill({
      id: 'communication',
      name: 'Communication Hub',
      description: 'Manage communications across channels',
      version: '1.0.0',
      author: 'GravityOS',
      category: 'communication',
      permissions: ['channels'],
      tools: ['message_send', 'channel_list'],
      prompts: {
        system: 'You are a communication assistant. Help users manage their messages and channels.',
        agents: 'When users need to communicate, use the channel tools to send messages.',
        tools: 'Use message_send to send messages and channel_list to see available channels.'
      }
    });

    console.log(`[SkillsPlatform] ✅ Initialized ${this.skills.size} built-in skills`);
  }

  /**
   * Register a new skill
   */
  registerSkill(skill: Skill): void {
    this.skills.set(skill.id, skill);
    console.log(`[SkillsPlatform] 📦 Registered skill: ${skill.name} (${skill.id})`);
  }

  /**
   * Create or update a workspace
   */
  async createWorkspace(userId: string, name: string, skillIds: string[] = []): Promise<Workspace> {
    const workspace: Workspace = {
      id: `workspace-${Date.now()}`,
      userId,
      name,
      skills: skillIds,
      agents: {
        system: `You are GravityBot, a personal AI assistant for ${name}.`,
        soul: 'You are helpful, efficient, and focused on providing value.',
        tools: 'You have access to various tools to help users accomplish their tasks.'
      },
      settings: {
        sandbox: {
          enabled: true,
          mode: 'non-main',
          allowlist: ['web_search', 'file_read', 'file_write'],
          denylist: ['system_rm', 'system_chmod']
        },
        model: {
          provider: 'anthropic',
          model: 'claude-3-5-sonnet-20241022'
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.workspaces.set(workspace.id, workspace);
    console.log(`[SkillsPlatform] 🏢 Created workspace: ${name} for user ${userId}`);
    
    return workspace;
  }

  /**
   * Get user's workspace
   */
  getWorkspace(userId: string): Workspace | undefined {
    return Array.from(this.workspaces.values())
      .find(workspace => workspace.userId === userId);
  }

  /**
   * Execute a skill
   */
  async executeSkill(
    skillId: string, 
    workspaceId: string, 
    userId: string, 
    input: string
  ): Promise<SkillExecution> {
    const skill = this.skills.get(skillId);
    const workspace = this.workspaces.get(workspaceId);
    
    if (!skill) {
      throw new Error(`Skill not found: ${skillId}`);
    }
    
    if (!workspace) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const execution: SkillExecution = {
      id: `exec-${Date.now()}`,
      skillId,
      workspaceId,
      userId,
      input,
      status: 'running',
      startTime: new Date()
    };

    this.executions.set(execution.id, execution);

    try {
      // Build context from workspace and skill
      const systemPrompt = [
        skill.prompts.system || workspace.agents.system,
        skill.prompts.agents || '',
        skill.prompts.tools || ''
      ].filter(Boolean).join('\n\n');

      // Get memory context
      const { messages } = await this.memory.getEffectiveContext(
        [{ role: 'user', content: input }],
        systemPrompt
      );

      // Execute skill logic based on category
      let output = '';
      
      switch (skill.category) {
        case 'utility':
          output = await this.executeUtilitySkill(skill, input);
          break;
        case 'productivity':
          output = await this.executeProductivitySkill(skill, input);
          break;
        case 'automation':
          output = await this.executeAutomationSkill(skill, input);
          break;
        case 'communication':
          output = await this.executeCommunicationSkill(skill, input);
          break;
        default:
          output = await this.executeGenericSkill(skill, input);
      }

      execution.output = output;
      execution.status = 'completed';
      execution.endTime = new Date();
      
      console.log(`[SkillsPlatform] ✅ Executed skill ${skillId} in ${execution.endTime.getTime() - execution.startTime.getTime()}ms`);
      
    } catch (error) {
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.status = 'failed';
      execution.endTime = new Date();
      
      console.error(`[SkillsPlatform] ❌ Skill execution failed:`, error);
    }

    this.executions.set(execution.id, execution);
    return execution;
  }

  /**
   * Execute utility skill
   */
  private async executeUtilitySkill(skill: Skill, input: string): Promise<string> {
    if (skill.tools.includes('web_search')) {
      const result = await this.mcp.callTool('web_search', { query: input });
      return result.success ? result.result : `Search failed: ${result.result}`;
    }
    return `Utility skill executed for: ${input}`;
  }

  /**
   * Execute productivity skill
   */
  private async executeProductivitySkill(skill: Skill, input: string): Promise<string> {
    if (skill.tools.includes('file_read') && input.toLowerCase().includes('read')) {
      const filePath = input.replace(/.*read\s+/i, '').trim();
      const result = await this.mcp.callTool('file_read', { path: filePath });
      return result.success ? result.result : `File read failed: ${result.result}`;
    }
    return `Productivity skill executed for: ${input}`;
  }

  /**
   * Execute automation skill
   */
  private async executeAutomationSkill(skill: Skill, input: string): Promise<string> {
    return `Automation setup for: ${input}. (Simulation - would create schedules/processes)`;
  }

  /**
   * Execute communication skill
   */
  private async executeCommunicationSkill(skill: Skill, input: string): Promise<string> {
    return `Communication handled for: ${input}. (Simulation - would send messages)`;
  }

  /**
   * Execute generic skill
   */
  private async executeGenericSkill(skill: Skill, input: string): Promise<string> {
    return `Skill "${skill.name}" executed for: ${input}`;
  }

  /**
   * Get available skills
   */
  getAvailableSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  /**
   * Get skills by category
   */
  getSkillsByCategory(category: string): Skill[] {
    return Array.from(this.skills.values())
      .filter(skill => skill.category === category);
  }

  /**
   * Get execution history
   */
  getExecutionHistory(userId: string, limit: number = 10): SkillExecution[] {
    return Array.from(this.executions.values())
      .filter(exec => exec.userId === userId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  /**
   * Get platform statistics
   */
  getStats(): {
    totalSkills: number;
    totalWorkspaces: number;
    totalExecutions: number;
    executionsByStatus: Record<string, number>;
    skillsByCategory: Record<string, number>;
  } {
    const executions = Array.from(this.executions.values());
    
    return {
      totalSkills: this.skills.size,
      totalWorkspaces: this.workspaces.size,
      totalExecutions: executions.length,
      executionsByStatus: executions.reduce((acc, exec) => {
        acc[exec.status] = (acc[exec.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      skillsByCategory: Array.from(this.skills.values()).reduce((acc, skill) => {
        acc[skill.category] = (acc[skill.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}
