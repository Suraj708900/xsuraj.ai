# Activate PayPal hosted checkout for AI Suraj Teach

The website now supports **six real PayPal-hosted checkout buttons**. A button appears **only after its actual public merchant checkout URL is configured**. Without a URL, the same button safely opens the request/invoice form. The website never simulates a payment or a success notification.

## Required: official payment URLs from your own PayPal Business dashboard

Go to [PayPal Payment Links & Buttons](https://www.paypal.com/in/business/accept-payments/payment-links) and create these **three one-time USD payment links**:

| JSON key | Item | USD one-time amount |
|---|---|---|
| `website-starter` | Website Starter | $399.00 |
| `website-growth` | Website Growth | $699.00 |
| `website-pro` | Website Pro | $999.00 |

For the three AI receptionist plans, use **PayPal Subscriptions**, if your PayPal Business account supports it; **ordinary one-time payment links DO NOT collect monthly recurring payments**:

| JSON key | Item | USD recurring amount |
|---|---|---|
| `voice-normal` | AI Normal | $499.00/month |
| `voice-pro` | AI Pro | $899.00/month |
| `voice-ultra-pro` | AI Ultra Pro | $1,599.00/month |

The existing advertised AI setup fee is **$497 one time, in addition to monthly pricing**. If you set this as a PayPal plan setup fee, PayPal itself must disclose it on the payment page. If you collect it separately by invoice, do **not** include it again in the subscription plan. Show all applicable charges, taxes and billing timing in the PayPal checkout before the payer approves.

## Add the links safely

1. Open [payment/paypal-links.json](./paypal-links.json) in the GitHub repository.
2. For each plan, replace its `paypal_url: null` with the **real** link copied from PayPal. Example **format only**, NOT a real link: `"paypal_url": "https://www.paypal.com/ncp/payment/<YOUR_ACTUAL_ID>"`.
3. Do not change `amount`, `currency`, or `billing` fields unless you also update the site's published pricing and tests.
4. Push to `main` and ensure Netlify deploys this repository and the new commit.
5. Visit `/payment/`. Connected plans will display **Pay ... with PayPal** or **Subscribe ... via PayPal**, and open **your real PayPal-hosted checkout** in a new tab.
6. On the PayPal page, verify that the merchant is YOUR business, the USD amount is correct, the recurring cycle is correct, and the setup fee is disclosed. Check actual received payments/subscription status in your **PayPal Business Dashboard** before delivering services.

**Never share passwords, OTP, PayPal Client Secret, or API tokens.** Public payment URLs can be shared for verification. Never fabricate a PayPal link from an email address. An email such as `kamdevsuraj03@gmail.com` is NOT a checkout ID.

This integration does not ask for card or bank details and does not declare a transaction successful. Any on-site form confirmation indicates only that an **inquiry** was submitted. PayPal processes actual payment on its own hosted page.

**Merchant setup and eligibility:** PayPal's India accounts support eligible international receipts, not domestic India-to-India transactions. Subscription availability depends on your merchant account. If subscriptions are unavailable, obtain recurring invoicing details from PayPal or use an appropriate alternative; do not label a one-time link as monthly automatic billing.

**Live deployment:** Ensure the Netlify site `xsurajteach.netlify.app` is built from `Suraj708900/xsuraj.ai` / `main`. A repository merge alone does not confirm deployment.

Official documentation: https://developer.paypal.com/payment-links-buttons/create-payment-link/ and https://www.paypal.com/in/smarthelp/article/merchant-subscription-faqs-faq4434
