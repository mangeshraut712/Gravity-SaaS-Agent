import { describe, expect, it } from 'vitest';
import { GravityDB } from '@gravity/db';

describe('GravityDB', () => {
    it('seeds demo users and creates new ones with tier limits', async () => {
        const db = new GravityDB();
        const demo = await db.getUser('demo-user');
        expect(demo).toMatchObject({ email: 'mangesh@example.com', tier: 'PRO', tokenLimit: 1_000_000 });

        const created = await db.createUser('new-user', 'new@example.com');
        expect(created.tokenLimit).toBe(50_000);
        const enterprise = await db.createUser('ent', 'ent@example.com', 'ENTERPRISE');
        expect(enterprise.tokenLimit).toBe(10_000_000);
        expect(await db.getUser('missing')).toBeUndefined();
    });

    it('tracks usage against the token limit', async () => {
        const db = new GravityDB();
        expect(await db.incrementUsage('missing', 1)).toBe(false);
        expect(await db.canExecute('missing')).toBe(false);

        await db.createUser('limited', 'limited@example.com', 'FREE');
        expect(await db.canExecute('limited')).toBe(true);
        expect(await db.incrementUsage('limited', 50_000)).toBe(true);
        expect(await db.canExecute('limited')).toBe(false);
        expect(await db.incrementUsage('limited', 1)).toBe(false);
    });
});
