import { afterEach, describe, expect, it } from 'vitest';
import {
    buildPolarCheckoutUrl,
    getPlanLimits,
    resolveTierFromProductId,
    type SubscriptionTier,
} from '../../../apps/dashboard/src/lib/billingPlans.js';

describe('billing plans', () => {
    const previous = {
        APP_URL: process.env.APP_URL,
        POLAR_PRO_PRODUCT_ID: process.env.POLAR_PRO_PRODUCT_ID,
        POLAR_BUSINESS_PRODUCT_ID: process.env.POLAR_BUSINESS_PRODUCT_ID,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID: process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID,
        NEXT_PUBLIC_POLAR_BUSINESS_PRODUCT_ID: process.env.NEXT_PUBLIC_POLAR_BUSINESS_PRODUCT_ID,
    };

    afterEach(() => {
        for (const [key, value] of Object.entries(previous)) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    });

    it('returns limits for every tier', () => {
        expect(getPlanLimits('free')).toEqual({ maxAgents: 1, maxMessagesPerMonth: 100 });
        expect(getPlanLimits('pro')).toEqual({ maxAgents: 5, maxMessagesPerMonth: 5000 });
        expect(getPlanLimits('business')).toEqual({ maxAgents: 10_000, maxMessagesPerMonth: 1_000_000 });
        expect(getPlanLimits('enterprise' as SubscriptionTier)).toBe('enterprise');
    });

    it('maps product ids and builds checkout urls', () => {
        expect(resolveTierFromProductId(null)).toBeNull();
        expect(resolveTierFromProductId('pro-product')).toBeNull();

        process.env.POLAR_PRO_PRODUCT_ID = 'pro-product';
        process.env.POLAR_BUSINESS_PRODUCT_ID = 'biz-product';
        expect(resolveTierFromProductId('biz-product')).toBe('business');
        expect(resolveTierFromProductId('pro-product')).toBe('pro');
        expect(resolveTierFromProductId('other')).toBeNull();

        expect(buildPolarCheckoutUrl('free', 'dev@gravity.ai')).toBeNull();
        delete process.env.APP_URL;
        expect(buildPolarCheckoutUrl('pro', 'dev@gravity.ai')).toBeNull();

        process.env.APP_URL = 'https://app.example';
        const url = buildPolarCheckoutUrl('pro', 'dev@gravity.ai');
        expect(url).toContain('https://polar.sh/checkout?');
        expect(url).toContain('product_id=pro-product');
        expect(url).toContain('customer_email=dev%40gravity.ai');
        expect(url).toContain('success_url=https%3A%2F%2Fapp.example%2Fbilling%3Fstatus%3Dsuccess');

        const business = buildPolarCheckoutUrl('business', null);
        expect(business).toContain('product_id=biz-product');
        expect(business).not.toContain('customer_email');
    });

    it('uses browser-safe public configuration for checkout URLs', () => {
        delete process.env.APP_URL;
        delete process.env.POLAR_PRO_PRODUCT_ID;
        delete process.env.POLAR_BUSINESS_PRODUCT_ID;
        process.env.NEXT_PUBLIC_APP_URL = 'https://app.example';
        process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID = 'public-pro-product';
        process.env.NEXT_PUBLIC_POLAR_BUSINESS_PRODUCT_ID = 'public-business-product';

        const url = buildPolarCheckoutUrl('pro', 'dev@gravity.ai');

        expect(url).toContain('product_id=public-pro-product');
        expect(url).toContain('success_url=https%3A%2F%2Fapp.example%2Fbilling%3Fstatus%3Dsuccess');
    });
});
