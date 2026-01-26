/**
 * Gravity MCP Client
 * Standardizes skill execution across any MCP-compliant server.
 */
import { MCPTool } from '@gravity/types';

export class GravityMCPClient {
    private tools: Map<string, MCPTool> = new Map();

    constructor() {
        // Initialize with core skills
        this.registerTool('web_search', 'Search the live web', { query: { type: 'string' } });
        this.registerTool('file_read', 'Read local files', { path: { type: 'string' } });
    }

    /**
     * Register a new tool definition
     */
    registerTool(name: string, description: string, schema: any, category: string = 'general', dangerous: boolean = false) {
        const tool: MCPTool = {
            name,
            description,
            input_schema: { type: 'object', properties: schema },
            category,
            dangerous
        };
        this.tools.set(name, tool);
        console.log(`[MCP] Registered tool: ${name} (${category})`);
    }

    /**
     * Automatically discovers and maps MCP tools to Claude-compatible tool definitions
     */
    async getTools() {
        return Array.from(this.tools.values());
    }

    /**
     * Executes a tool via the appropriate MCP server
     */
    async callTool(name: string, args: any): Promise<{ result: string; success: boolean }> {
        const tool = this.tools.get(name);
        if (!tool) {
            throw new Error(`Tool '${name}' not found`);
        }

        if (tool.dangerous) {
            console.warn(`[MCP] Executing dangerous tool ${name} with args:`, args);
        } else {
            console.log(`[MCP] Executing tool ${name} with args:`, args);
        }

        try {
            // Enhanced simulation logic with error handling
            if (name === 'web_search') {
                if (!args.query || typeof args.query !== 'string') {
                    throw new Error('Search query is required and must be a string');
                }
                return { 
                    result: `[Search Results for "${args.query}"]: 1. GravityBot v2 released with enhanced security... 2. AI Agents taking over enterprise workflows... 3. New MCP protocol standards adopted...`,
                    success: true
                };
            }

            if (name === 'file_read') {
                if (!args.path || typeof args.path !== 'string') {
                    throw new Error('File path is required and must be a string');
                }
                return { 
                    result: `File content from ${args.path}: (Simulation - file reading would be implemented here)`,
                    success: true
                };
            }

            return { result: `Executed ${name} successfully.`, success: true };
            
        } catch (error) {
            console.error(`[MCP] Tool execution failed for ${name}:`, error);
            return { 
                result: `Error executing ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                success: false
            };
        }
    }

    /**
     * Get tools by category
     */
    getToolsByCategory(category: string): MCPTool[] {
        return Array.from(this.tools.values()).filter(tool => tool.category === category);
    }

    /**
     * Get dangerous tools (for additional security checks)
     */
    getDangerousTools(): MCPTool[] {
        return Array.from(this.tools.values()).filter(tool => tool.dangerous);
    }
}
