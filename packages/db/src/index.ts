export type UserTier = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface UserProfle {
    id: string;
    email: string;
    tier: UserTier;
    tokenLimit: number;
    tokensUsed: number;
    lastActive: Date;
}

export class GravityDB {
    private users: Map<string, UserProfle> = new Map();

    constructor() {
        // Seed some demo users
        this.createUser('demo-user', 'mangesh@example.com', 'PRO');
        this.createUser('1234567890', 'user@example.com', 'FREE');
        this.createUser('dashboard-user', 'dashboard@example.com', 'PRO');
    }

    async getUser(id: string): Promise<UserProfle | undefined> {
        return this.users.get(id);
    }

    async createUser(id: string, email: string, tier: UserTier = 'FREE'): Promise<UserProfle> {
        const limits = {
            FREE: 50000,
            PRO: 1000000,
            ENTERPRISE: 10000000
        };

        const user: UserProfle = {
            id,
            email,
            tier,
            tokenLimit: limits[tier],
            tokensUsed: 0,
            lastActive: new Date()
        };
        this.users.set(id, user);
        return user;
    }

    async incrementUsage(id: string, count: number): Promise<boolean> {
        const user = this.users.get(id);
        if (!user) return false;

        user.tokensUsed += count;
        user.lastActive = new Date();
        return user.tokensUsed <= user.tokenLimit;
    }

    async canExecute(id: string): Promise<boolean> {
        const user = this.users.get(id);
        if (!user) return false;
        return user.tokensUsed < user.tokenLimit;
    }
}
