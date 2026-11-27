import express from 'express';
import { describe, expect, it } from 'vitest';
import { MiddlewareFactory } from '../../../apps/gateway/src/middleware/index.js';
import type { AuthenticatedRequest } from '../../../apps/gateway/src/middleware/index.js';
import { withServer } from '../../helpers/http.js';

describe('MiddlewareFactory.tierBasedRateLimit', () => {
    it('accumulates hits per tier so the FREE cap is actually enforced', async () => {
        const app = express();

        app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
            (req as AuthenticatedRequest).user = { id: 'rate-test-user', tier: 'FREE', permissions: [] };
            next();
        });
        app.use(MiddlewareFactory.tierBasedRateLimit());
        app.get('/ping', (_req, res) => {
            res.json({ ok: true });
        });

        await withServer(app, async (baseUrl) => {
            for (let i = 0; i < 30; i++) {
                const response = await fetch(`${baseUrl}/ping`);
                expect(response.status).toBe(200);
            }

            const blocked = await fetch(`${baseUrl}/ping`);
            expect(blocked.status).toBe(429);
        });
    });

    it('applies the higher PRO cap instead of the FREE one', async () => {
        const app = express();

        app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
            (req as AuthenticatedRequest).user = { id: 'rate-test-pro', tier: 'PRO', permissions: [] };
            next();
        });
        app.use(MiddlewareFactory.tierBasedRateLimit());
        app.get('/ping', (_req, res) => {
            res.json({ ok: true });
        });

        await withServer(app, async (baseUrl) => {
            for (let i = 0; i < 31; i++) {
                const response = await fetch(`${baseUrl}/ping`);
                expect(response.status).toBe(200);
            }
            expect(Number((await fetch(`${baseUrl}/ping`)).headers.get('ratelimit-limit'))).toBe(100);
        });
    });
});
