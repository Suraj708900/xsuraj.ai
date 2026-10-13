# PayPal payment setup

## How payments work

The **Pay & get started** section on the home page (`#payment`) lists every item with a **Pay with PayPal** button. Each button opens `/api/paypal-checkout?plan=<item>` (`netlify/functions/paypal-checkout.mts`), which redirects the customer straight to PayPal checkout. Payments go to the PayPal account `kamdevsuraj03@gmail.com` in USD. Customers can pay with a PayPal account or a card.

| Button | `plan` | Amount (USD) | Optional override variable |
| --- | --- | --- | --- |
| Launch offer (until 14 Oct 2026) | `launch` | $1,587 | `PAYPAL_LAUNCH_PAYMENT_LINK` |
| AI voice receptionist setup fee | `voice-setup` | $497 | `PAYPAL_VOICE_SETUP_PAYMENT_LINK` |
| Website Starter setup | `web-starter` | $297 | `PAYPAL_WEB_STARTER_PAYMENT_LINK` |
| Website Growth setup | `web-growth` | $597 | `PAYPAL_WEB_GROWTH_PAYMENT_LINK` |
| Website Pro setup | `web-pro` | $1,197 | `PAYPAL_WEB_PRO_PAYMENT_LINK` |
| Custom amount / invoice | `custom` | Customer enters the amount | `PAYPAL_CUSTOM_PAYMENT_LINK` |
| AI receptionist Starter, setup + first month | `starter` | $794 | `PAYPAL_STARTER_PAYMENT_LINK` |
| AI receptionist Growth, setup + first month | `growth` | $1,094 | `PAYPAL_GROWTH_PAYMENT_LINK` |
| AI receptionist Pro, setup + first month | `pro` | $1,694 | `PAYPAL_PRO_PAYMENT_LINK` |

The last three are not shown as buttons on the site, but the endpoint still supports them for direct links in emails.

After paying, PayPal sends the customer back to `/payment-thanks/`. If they cancel, they return to `/#payment`.

## Optional: use your own PayPal-hosted links

By default, the function builds a standard PayPal checkout link from the recipient email and amount. To use a PayPal-hosted checkout link you create instead, set the matching variable above in the Netlify environment variable settings, with Functions scope, then redeploy. Only HTTPS links on `paypal.com`, `www.paypal.com`, `paypal.me`, and `www.paypal.me` are accepted. Invalid values fall back to the default checkout. Never paste passwords, API secrets, or access tokens into these settings.

## Before going live

- Make sure the PayPal account `kamdevsuraj03@gmail.com` exists and can receive payments. If the email has no PayPal account, PayPal holds the money until an account is created with that email.
- Click each button and check the recipient, item name, and amount on PayPal before approving a test payment.

Visiting or returning from PayPal does not prove a payment was made. Confirm each payment in your PayPal account before starting work. Monthly plan fees are billed separately; this flow handles one-time payments only.
