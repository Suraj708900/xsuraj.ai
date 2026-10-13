/* Payment request form: choose a plan without relying on mailto: handlers.
 * Safe progressive enhancement; the native HTML form still works without JS.
 */
(() => {
  "use strict";
  const form = document.getElementById("secure-payment-request-form");
  const selection = document.getElementById("requested-plan");
  const summary = document.getElementById("payment-selected");
  if (!form || !selection || !summary) return;
  const address = "kamdevsuraj03@gmail.com";
  const gmail = document.getElementById("payment-gmail-link");
  const outlook = document.getElementById("payment-outlook-link");

  function updatePlan(plan) {
    if (plan && Array.from(selection.options).some(option => option.value === plan)) {
      selection.value = plan;
    }
    const option = selection.selectedOptions[0];
    const title = option && option.value ? option.textContent.trim() : "";
    summary.textContent = title ? "Selected: " + title + " · We will confirm the final invoice before any payment." : "Choose a plan above or select one here.";
    const subject = encodeURIComponent(title ? "Payment details request — " + title : "Payment details request — AI Suraj Teach");
    if (gmail) gmail.href = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(address) + "&su=" + subject;
    if (outlook) outlook.href = "https://outlook.live.com/mail/0/deeplink/compose?to=" + encodeURIComponent(address) + "&subject=" + subject;
  }

  document.querySelectorAll('a[data-plan][href="#payment-request-form"]').forEach(link => {
    link.addEventListener("click", () => updatePlan(link.dataset.plan));
  });
  selection.addEventListener("change", () => updatePlan());
  updatePlan("");

  const copy = document.getElementById("copy-payment-email");
  const result = document.getElementById("copy-payment-result");
  if (copy && result) {
    copy.addEventListener("click", async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(address);
        result.textContent = "Email copied: " + address;
      } catch {
        result.textContent = "Copy this address manually: " + address;
      }
    });
  }

  // Native Netlify Forms handles submission and redirects. We never mark
  // a payment complete, store card data, or display an unverified success.
})();