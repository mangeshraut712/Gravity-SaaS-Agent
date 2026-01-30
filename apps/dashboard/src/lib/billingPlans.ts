export type SubscriptionTier = 'free' | 'pro' | 'business';

export interface PlanLimits {
  maxAgents: number;
  maxMessagesPerMonth: number;
}

export function getPlanLimits(tier: SubscriptionTier): PlanLimits {
  switch (tier) {
    case 'pro':
      return { maxAgents: 5, maxMessagesPerMonth: 5000 };
    case 'business':
      return { maxAgents: 10_000, maxMessagesPerMonth: 1_000_000 };
    case 'free':
    default:
      return { maxAgents: 1, maxMessagesPerMonth: 100 };
  }
}

export function resolveTierFromProductId(productId: string | null): SubscriptionTier | null {
  if (!productId) return null;
  const proId = process.env.POLAR_PRO_PRODUCT_ID;
  const businessId = process.env.POLAR_BUSINESS_PRODUCT_ID;

  if (businessId && productId === businessId) return 'business';
  if (proId && productId === proId) return 'pro';
  return null;
}

export function buildPolarCheckoutUrl(
  targetTier: SubscriptionTier,
  customerEmail: string | null,
): string | null {
  const appUrl = process.env.APP_URL;
  const proId = process.env.POLAR_PRO_PRODUCT_ID;
  const businessId = process.env.POLAR_BUSINESS_PRODUCT_ID;

  const productId =
    targetTier === 'pro' ? proId : targetTier === 'business' ? businessId : null;

  if (!appUrl || !productId) {
    return null;
  }

  const base = 'https://polar.sh/checkout';
  const params = new URLSearchParams({
    product_id: productId,
    success_url: `${appUrl}/billing?status=success`,
    cancel_url: `${appUrl}/billing?status=cancelled`,
  });

  if (customerEmail) {
    params.set('customer_email', customerEmail);
  }

  return `${base}?${params.toString()}`;
}

