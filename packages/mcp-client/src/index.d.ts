/**
 * Gravity MCP Client
 * Standardizes skill execution across any MCP-compliant server.
 */
export declare class GravityMCPClient {
    private servers;
    /**
     * Register an MCP server (e.g., Google Search, Local Files, GitHub)
     */
    connectServer(name: string, endpoint: string): Promise<void>;
    /**
     * Automatically discovers and maps MCP tools to Claude-compatible tool definitions
     */
    getTools(): Promise<({
        name: string;
        description: string;
        input_schema: {
            type: string;
            properties: {
                query: {
                    type: string;
                };
                path?: undefined;
                repo?: undefined;
            };
        };
    } | {
        name: string;
        description: string;
        input_schema: {
            type: string;
            properties: {
                path: {
                    type: string;
                };
                repo: {
                    type: string;
                };
                query?: undefined;
            };
        };
    })[]>;
    /**
     * Executes a tool via the appropriate MCP server
     */
    callTool(name: string, args: any): Promise<{
        result: string;
    }>;
}
