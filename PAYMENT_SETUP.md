# PayPal payment setup

## Current mode: payment link requests

Until the PayPal links below are ready, the payment section on the home page is a Netlify Forms request form named `payment-request`. Customers choose a plan and leave their name, email, business name, and optional phone and message. Submissions appear under **Forms** in the Netlify project dashboard (turn on email notifications there). Reply to each request with the PayPal payment link for the chosen plan.

To switch to direct online checkout later, set the environment variables below and point the payment form back to `/api/paypal-checkout`. The checkout function is still in `netlify/functions/paypal-checkout.mts`.

## Direct checkout (for later)

The AI receptionist pricing buttons open the payment section and select the chosen plan. The checkout endpoint redirects customers to a PayPal payment link configured by the site owner. It does not guess the receiving account from the contact email.

## Enable live payments

Create a separate hosted payment link for each plan in the receiving business's PayPal account. Use USD and include the $497 setup fee plus the first month:

| Plan | First payment | Netlify environment variable |
| --- | --- | --- |
| Starter | $794 | `PAYPAL_STARTER_PAYMENT_LINK` |
| Growth | $1,094 | `PAYPAL_GROWTH_PAYMENT_LINK` |
| Pro | $1,694 | `PAYPAL_PRO_PAYMENT_LINK` |

In Netlify's project environment variable settings, set each variable to the corresponding PayPal-hosted checkout link, with Functions scope in the deployment contexts where payments should be available. Redeploy after changing the configuration. Do not paste passwords, API secrets, or access tokens into these settings or the repository; these variables need only the shareable checkout URLs.

Use fixed-price links with the correct recipient, USD currency, and a quantity of one. Ensure the final total matches the table, including any checkout settings that could change it. The function accepts HTTPS links on `paypal.com`, `www.paypal.com`, `paypal.me`, and `www.paypal.me` only. Prefer fixed-price hosted checkout links over editable PayPal.Me requests.

When a link is missing or invalid, checkout displays an actionable error instead of sending customers to an unknown account. This checkout covers an initial payment only, not recurring subscriptions. Arrange subsequent monthly payments separately. Website plans remain quote-based and are not included in this payment flow.

## Verification

For each pricing card, check that clicking Pay with PayPal selects the correct plan. Continue to checkout and confirm the recipient and final total on PayPal before approving any payment. Repeat on mobile and with JavaScript disabled. Before configuration, check that the unavailable message and contact link appear and that the button can be retried.

No payment is marked successful or service activated simply because the customer visits or returns from PayPal. Confirm receipt in the receiving PayPal account before providing service. Automatic payment verification, subscription billing, and order storage are not part of this hosted-link integration.
