import { GravityDB, UserTier } from '@gravity/db';

export class SubscriptionService {
    constructor(private db: GravityDB) { }

    async validateAccess(userId: string): Promise<{ allowed: boolean; reason?: string }> {
        const user = await this.db.getUser(userId);

        if (!user) {
            return { allowed: false, reason: 'USER_NOT_FOUND' };
        }

        const canExec = await this.db.canExecute(userId);
        if (!canExec) {
            return { allowed: false, reason: 'USAGE_LIMIT_EXCEEDED' };
        }

        return { allowed: true };
    }

    getTierConfig(tier: UserTier) {
        return {
            allowProactiveHeartbeat: tier !== 'FREE',
            mcpCap: tier === 'FREE' ? 2 : 50,
            priority: tier === 'ENTERPRISE' ? 1 : 0
        };
    }
}
