import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient, resolveTierFromProductId } from '../../../../lib';

export async function POST(req: NextRequest) {
  let payload: any;
  const admin = getSupabaseAdminClient();
  try {
    payload = await req.json();
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
      .single();

    if (!user || userError) {
      return NextResponse.json(
        { error: 'No matching user for this webhook.' },
        { status: 200 },
      );
    }

    if (targetTier) {
      await admin
        .from('users')
        .update({
          subscription_tier: targetTier,
          polar_customer_id: customerId ?? undefined,
        })
        .eq('id', user.id);
    }

    await admin.from('billing_events').insert({
      user_id: user.id,
      provider: 'polar',
      event_type: eventType,
      raw_payload: payload,
    });

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
