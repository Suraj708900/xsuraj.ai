/* PayPal-hosted checkout for AI Suraj Teach.
 * Only real merchant-provided PayPal links are enabled. Never derive a merchant
 * link from an email address, invent an order, or claim successful payment.
 */
(() => {
  "use strict";
  const EXPECTED = Object.freeze({
    "website-starter": {amount:"399.00",billing:"one_time",text:"$399 one-time"},
    "website-growth": {amount:"699.00",billing:"one_time",text:"$699 one-time"},
    "website-pro": {amount:"999.00",billing:"one_time",text:"$999 one-time"},
    "voice-normal": {amount:"499.00",billing:"monthly_subscription",text:"$499/month"},
    "voice-pro": {amount:"899.00",billing:"monthly_subscription",text:"$899/month"},
    "voice-ultra-pro": {amount:"1599.00",billing:"monthly_subscription",text:"$1,599/month"}
  });

  function validPayPalLink(input) {
    if (typeof input !== "string" || input.length > 2000) return false;
    try {
      const url = new URL(input);
      const allowed = new Set(["www.paypal.com", "paypal.com", "www.paypal.me", "paypal.me"]);
      return url.protocol === "https:" &&
        allowed.has(url.hostname.toLowerCase()) &&
        !url.username && !url.password &&
        url.pathname !== "/" &&
        !url.pathname.startsWith("/signin") &&
        !url.pathname.startsWith("/login");
    } catch {
      return false;
    }
  }

  function upgradeCards(config) {
    let count = 0;
    for (const [plan, expected] of Object.entries(EXPECTED)) {
      const card = document.getElementById(plan);
      const link = card?.querySelector('a[data-plan]');
      const status = document.getElementById("checkout-status-" + plan);
      const definition = config?.plans?.[plan];
      const ready = config?.currency === "USD" &&
        definition?.amount === expected.amount &&
        definition?.billing === expected.billing &&
        validPayPalLink(definition?.paypal_url);

      if (!link) continue;
      if (ready) {
        // This is a PayPal-hosted checkout, not a local payment success screen.
        link.href = definition.paypal_url;
        link.textContent = expected.billing === "one_time"
          ? "Pay " + expected.text + " with PayPal ↗"
          : "Subscribe " + expected.text + " via PayPal ↗";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", "Continue to PayPal checkout for " + definition.label + " " + expected.text);
        link.dataset.paypalReady = "true";
        if (status) status.textContent = "Secure PayPal checkout available.";
        count++;
      } else {
        link.href = "#payment-request-form";
        link.textContent = "Request verified payment link ↗";
        link.removeAttribute("target");
        link.removeAttribute("rel");
        link.removeAttribute("aria-label");
        link.dataset.paypalReady = "false";
        if (status) status.textContent = "PayPal link pending merchant setup.";
      }
    }
    const notice = document.getElementById("paypal-checkout-status");
    if (notice) {
      notice.textContent = count === 6
        ? "All six checkout links are available. Review the plan, amount and billing cycle on PayPal before you pay."
        : count > 0
        ? count + " of 6 PayPal checkouts ready. For other plans, request a verified payment link below."
        : "PayPal checkout will open here after your business payment links are connected. Until then, request payment details using the form below.";
    }
  }

  async function setup() {
    try {
      const response = await fetch("/payment/paypal-links.json", {cache:"no-store"});
      if (!response.ok) throw new Error("Link configuration is unavailable");
      const configuration = await response.json();
      if (configuration.schema_version !== 1) throw new Error("Incorrect link configuration");
      upgradeCards(configuration);
    } catch {
      // Fail closed: checkout links remain on-page inquiry links, never a fake PayPal payment.
      upgradeCards(null);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup, {once:true});
  else setup();
})();