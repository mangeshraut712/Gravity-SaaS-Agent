import { afterEach, describe, expect, it, vi } from 'vitest';

describe('supabase admin client', () => {
    const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    afterEach(() => {
        vi.resetModules();
        if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
        else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
        if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
        else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
    });

    it('refuses to build a client without credentials', async () => {
        vi.resetModules();
        delete process.env.NEXT_PUBLIC_SUPABASE_URL;
        delete process.env.SUPABASE_SERVICE_ROLE_KEY;
        const { getSupabaseAdminClient } = await import('../../../apps/dashboard/src/lib/supabaseAdmin.js');
        expect(() => getSupabaseAdminClient()).toThrow(/SUPABASE_SERVICE_ROLE_KEY/);
    });

    it('reuses one client after the credentials are present', async () => {
        vi.resetModules();
        process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
        process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role';
        const { getSupabaseAdminClient } = await import('../../../apps/dashboard/src/lib/supabaseAdmin.js');
        const first = getSupabaseAdminClient();
        const second = getSupabaseAdminClient();
        expect(second).toBe(first);
    });
});
