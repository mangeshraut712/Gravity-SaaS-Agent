export declare class SecurityService {
    audit(): Promise<{
        passed: boolean;
        vulnerability: string[];
    }>;
    validateCommand(command: string, whitelist: string[]): boolean;
}
