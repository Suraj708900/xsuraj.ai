/* Quote form enhancement: browser-based Gmail and Outlook drafts, with no mailto dependency.
 * Netlify native form submission continues to work without JavaScript.
 */
(() => {
  "use strict";
  const form = document.getElementById("quote-request-form");
  const service = document.getElementById("quote-service");
  const gmail = document.getElementById("quote-gmail-link");
  const outlook = document.getElementById("quote-outlook-link");
  if (!form || !service || !gmail || !outlook) return;

  const recipient = "kamdevsuraj03@gmail.com";
  const allowedServices = {
    quote: "General business quote",
    ai: "AI voice receptionist",
    website: "Business website design",
    demo: "60-second demo request",
    meet: "Google Meet consultation request",
    chat: "Google Chat support request"
  };

  try {
    const requested = new URLSearchParams(window.location.search).get("service");
    if (Object.prototype.hasOwnProperty.call(allowedServices, requested)) {
      service.value = requested;
    }
    const templateId = Number(new URLSearchParams(window.location.search).get("template"));
    if (Number.isInteger(templateId) && templateId >= 1 && templateId <= 60) {
      const message = document.getElementById("quote-message");
      if (message && !message.value.trim()) message.value = "I am interested in website template #" + templateId + ". Please send me a quote and next steps.";
      service.value = "website";
    }
  } catch {
    // The contact form remains usable without URL search support.
  }

  function field(id) {
    const element = document.getElementById(id);
    return element && typeof element.value === "string" ? element.value.trim() : "";
  }

  function updateDrafts() {
    const type = service.value;
    const subject = type === "meet" ? "Google Meet appointment request - AI Suraj Teach"
      : type === "chat" ? "Google Chat support request - AI Suraj Teach"
      : type === "demo" ? "Demo request - AI Suraj Teach"
      : type === "ai" ? "Quote request - AI receptionist"
      : type === "website" ? "Quote request - business website"
      : "Quote request - AI Suraj Teach";
    const lines = [
      "Hello AI Suraj Teach,",
      "",
      "I would like to request a quote or demo.",
      "Service: " + (allowedServices[type] || "Not yet selected"),
      "Name: " + field("quote-name"),
      "Email: " + field("quote-email"),
      "Business: " + field("quote-business"),
      "Address: " + field("quote-address"),
      "",
      "My requirements:",
      field("quote-message"),
      "",
      "Please reply with the next steps. Thank you."
    ];
    const body = lines.join("\n");
    const gmailParams = new URLSearchParams({view:"cm",fs:"1",to:recipient,su:subject,body});
    const outlookParams = new URLSearchParams({to:recipient,subject,body});
    gmail.href = "https://mail.google.com/mail/?" + gmailParams;
    outlook.href = "https://outlook.live.com/mail/0/deeplink/compose?" + outlookParams;
  }

  form.addEventListener("input", updateDrafts);
  form.addEventListener("change", updateDrafts);
  updateDrafts();

  const copy = document.getElementById("quote-copy-email");
  const result = document.getElementById("quote-copy-result");
  if (copy && result) {
    copy.addEventListener("click", async () => {
      try {
        if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") throw new Error("Clipboard not supported");
        await navigator.clipboard.writeText(recipient);
        result.textContent = "Email copied: " + recipient;
      } catch {
        result.textContent = "Select and copy this email manually: " + recipient;
      }
    });
  }
})();