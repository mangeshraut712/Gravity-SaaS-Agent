import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'standardwebhooks';
import { getSupabaseAdminClient, resolveTierFromProductId } from '../../../../lib';

type PolarWebhookHeaders = {
  'webhook-id': string;
  'webhook-timestamp': string;
  'webhook-signature': string;
};

function hasValidPolarSignature(
  rawBody: string,
  headers: PolarWebhookHeaders,
  webhookSecret: string
): boolean {
  // Polar's current Standard Webhooks secrets can be passed directly. Older
  // Polar secrets use the full secret string as the HMAC key, which is encoded
  // here for the Standard Webhooks verifier.
  const secrets = [webhookSecret, `whsec_${Buffer.from(webhookSecret, 'utf8').toString('base64')}`];

  for (const secret of new Set(secrets)) {
    try {
      new Webhook(secret).verify(rawBody, headers, { jsonParse: false });
      return true;
    } catch {
      // Try the other documented Polar signing-key format before rejecting.
    }
  }

  return false;
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Polar webhook is not configured.' }, { status: 500 });
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: 'Invalid webhook payload.' }, { status: 400 });
  }

  const headers: PolarWebhookHeaders = {
    'webhook-id': req.headers.get('webhook-id') ?? '',
    'webhook-timestamp': req.headers.get('webhook-timestamp') ?? '',
    'webhook-signature': req.headers.get('webhook-signature') ?? '',
  };

  if (!hasValidPolarSignature(rawBody, headers, webhookSecret)) {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 403 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON webhook payload.' },
      { status: 400 },
    );
  }

  // The exact Polar schema may differ; we defensively read common fields.
  const eventType: string = payload?.type ?? payload?.event ?? 'unknown';
  const customerEmail: string | null =
    payload?.customer?.email ?? payload?.data?.customer?.email ?? null;
  const customerId: string | null =
    payload?.customer?.id ?? payload?.data?.customer?.id ?? null;
  const productId: string | null =
    payload?.product?.id ??
    payload?.data?.product?.id ??
    payload?.subscription?.product_id ??
    payload?.data?.subscription?.product_id ??
    null;

  // Map product to subscription tier
  const targetTier = resolveTierFromProductId(productId);

  if (!customerEmail && !customerId) {
    return NextResponse.json(
      { error: 'Missing customer identifier in webhook payload.' },
      { status: 400 },
    );
  }

  try {
    const admin = getSupabaseAdminClient();

    // Find the corresponding user by email or existing polar_customer_id
    const { data: user, error: userError } = await admin
      .from('users')
      .select('id, subscription_tier')
      .or(
        [
          customerEmail ? `email.eq.${customerEmail}` : '',
          customerId ? `polar_customer_id.eq.${customerId}` : '',
        ]
          .filter(Boolean)
          .join(','),
      )
      .limit(1)
      .maybeSingle();

    if (userError) {
      throw userError;
    }

    if (!user) {
      return NextResponse.json(
        { error: 'No matching user for this webhook.' },
        { status: 200 },
      );
    }

    if (targetTier) {
      const { error: updateError } = await admin
        .from('users')
        .update({
          subscription_tier: targetTier,
          polar_customer_id: customerId ?? undefined,
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }
    }

    const { error: billingEventError } = await admin.from('billing_events').insert({
      user_id: user.id,
      provider: 'polar',
      event_type: eventType,
      raw_payload: payload,
    });

    if (billingEventError) {
      throw billingEventError;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[AgentFlow] Polar webhook error', err);
    return NextResponse.json(
      { error: 'Failed to process webhook.' },
      { status: 500 },
    );
  }
}
