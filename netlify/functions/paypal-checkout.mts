export default async (request: Request): Promise<Response> => {
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  const wantsJson = request.headers.get('accept')?.includes('application/json');
  const fail = (message: string, status: number): Response => {
    if (wantsJson) return Response.json({ error: message }, { status, headers });
    return new Response(`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PayPal checkout unavailable | AI Suraj Teach</title><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/premium-dark.css"><link rel="stylesheet" href="/payment.css"></head><body><main class="section"><div class="container narrow"><h1>PayPal checkout unavailable</h1><div class="payment-card"><p>${message}</p><p>No payment has been taken by this website.</p><p><a class="btn btn-primary" href="/#payment">Return to payment</a></p><p><a href="mailto:kamdevsuraj03@gmail.com?subject=PayPal%20payment%20help">Contact Suraj for a PayPal payment link</a></p></div></div></main></body></html>`, {
      status,
      headers: {
        ...headers,
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': "default-src 'none'; style-src 'self'; base-uri 'none'; frame-ancestors 'none'",
      },
    });
  };

  if (request.method !== 'GET') {
    const response = fail('This checkout only accepts GET requests.', 405);
    response.headers.set('Allow', 'GET');
    return response;
  }

  const plan = new URL(request.url).searchParams.get('plan');
  const settings: Record<string, string> = {
    starter: 'PAYPAL_STARTER_PAYMENT_LINK',
    growth: 'PAYPAL_GROWTH_PAYMENT_LINK',
    pro: 'PAYPAL_PRO_PAYMENT_LINK',
  };
  if (!plan || !Object.hasOwn(settings, plan)) {
    return fail('Please select a valid AI receptionist plan.', 400);
  }

  const paymentLink = process.env[settings[plan]]?.trim();
  if (!paymentLink) {
    return fail('PayPal checkout is not configured for this plan yet. Please contact Suraj for a PayPal payment link.', 503);
  }

  let checkoutUrl: URL;
  try {
    checkoutUrl = new URL(paymentLink);
  } catch {
    return fail('PayPal checkout is temporarily unavailable. Please contact Suraj for a payment link.', 503);
  }

  const allowedHosts = ['www.paypal.com', 'paypal.com', 'paypal.me', 'www.paypal.me'];
  if (checkoutUrl.protocol !== 'https:' || !allowedHosts.includes(checkoutUrl.hostname) ||
      checkoutUrl.username || checkoutUrl.password || checkoutUrl.port || checkoutUrl.pathname === '/') {
    return fail('PayPal checkout is temporarily unavailable. Please contact Suraj for a payment link.', 503);
  }

  if (wantsJson) return Response.json({ url: checkoutUrl.href }, { headers });
  return new Response(null, { status: 303, headers: { ...headers, Location: checkoutUrl.href } });
};

export const config = { path: '/api/paypal-checkout' };
