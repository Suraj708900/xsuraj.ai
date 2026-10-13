const PAYPAL_RECIPIENT = 'kamdevsuraj03@gmail.com';

// amount: null lets the customer enter the amount on PayPal (custom invoices).
// env: optional override with a PayPal-hosted checkout link for that item.
const ITEMS: Record<string, { name: string; amount: string | null; env: string }> = {
  launch: { name: 'Launch offer - Website Growth setup + first year + 3 months AI chat receptionist', amount: '1587.00', env: 'PAYPAL_LAUNCH_PAYMENT_LINK' },
  'voice-setup': { name: 'AI voice receptionist setup fee', amount: '497.00', env: 'PAYPAL_VOICE_SETUP_PAYMENT_LINK' },
  starter: { name: 'AI receptionist Starter - setup + first month', amount: '794.00', env: 'PAYPAL_STARTER_PAYMENT_LINK' },
  growth: { name: 'AI receptionist Growth - setup + first month', amount: '1094.00', env: 'PAYPAL_GROWTH_PAYMENT_LINK' },
  pro: { name: 'AI receptionist Pro - setup + first month', amount: '1694.00', env: 'PAYPAL_PRO_PAYMENT_LINK' },
  'web-starter': { name: 'Website Starter setup (1 page)', amount: '297.00', env: 'PAYPAL_WEB_STARTER_PAYMENT_LINK' },
  'web-growth': { name: 'Website Growth setup (up to 5 pages + online booking)', amount: '597.00', env: 'PAYPAL_WEB_GROWTH_PAYMENT_LINK' },
  'web-pro': { name: 'Website Pro setup (up to 10 pages, 2 locations)', amount: '1197.00', env: 'PAYPAL_WEB_PRO_PAYMENT_LINK' },
  custom: { name: 'AI Suraj Teach - custom amount / invoice', amount: null, env: 'PAYPAL_CUSTOM_PAYMENT_LINK' },
};

const allowedHosts = ['www.paypal.com', 'paypal.com', 'paypal.me', 'www.paypal.me'];

const configuredLink = (envName: string): URL | null => {
  const value = process.env[envName]?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !allowedHosts.includes(url.hostname) ||
        url.username || url.password || url.port || url.pathname === '/') return null;
    return url;
  } catch {
    return null;
  }
};

export default async (request: Request): Promise<Response> => {
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  const wantsJson = request.headers.get('accept')?.includes('application/json');
  const fail = (message: string, status: number): Response => {
    if (wantsJson) return Response.json({ error: message }, { status, headers });
    return new Response(`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PayPal checkout unavailable | AI Suraj Teach</title><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/premium-dark.css"><link rel="stylesheet" href="/payment.css"></head><body><main class="section"><div class="container narrow"><h1>PayPal checkout unavailable</h1><div class="payment-card"><p>${message}</p><p>No payment has been taken by this website.</p><p><a class="btn btn-primary" href="/#payment">Return to payment</a></p><p><a href="mailto:${PAYPAL_RECIPIENT}?subject=PayPal%20payment%20help">Contact Suraj for help</a></p></div></div></main></body></html>`, {
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

  const requestUrl = new URL(request.url);
  const plan = requestUrl.searchParams.get('plan');
  if (!plan || !Object.hasOwn(ITEMS, plan)) {
    return fail('Please choose a valid item to pay for.', 400);
  }
  const item = ITEMS[plan];

  // Prefer an owner-configured hosted link; otherwise use PayPal's standard
  // checkout, paying the business account directly in USD.
  let checkoutUrl = configuredLink(item.env);
  if (!checkoutUrl) {
    checkoutUrl = new URL('https://www.paypal.com/cgi-bin/webscr');
    const params = checkoutUrl.searchParams;
    params.set('cmd', '_xclick');
    params.set('business', PAYPAL_RECIPIENT);
    params.set('item_name', item.name);
    params.set('currency_code', 'USD');
    params.set('no_shipping', '1');
    if (item.amount) {
      params.set('amount', item.amount);
      params.set('quantity', '1');
    }
    params.set('return', `${requestUrl.origin}/payment-thanks/`);
    params.set('cancel_return', `${requestUrl.origin}/#payment`);
  }

  if (wantsJson) return Response.json({ url: checkoutUrl.href }, { headers });
  return new Response(null, { status: 303, headers: { ...headers, Location: checkoutUrl.href } });
};

export const config = { path: '/api/paypal-checkout' };
