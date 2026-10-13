/* AI Suraj Teach — shared premium footer and transparent FAQ helper.
   Rendering and navigation work without third-party scripts or AI services. */
(() => {
  "use strict";
  if (window.__astFooterInstalled) return;
  window.__astFooterInstalled = true;

  const footerHTML = [
    '<section class="ast-start" aria-labelledby="ast-start-heading">',
      '<div class="ast-start-panel">',
        '<span class="ast-eyebrow">AI SURAJ TEACH &nbsp; / &nbsp; BUSINESS SOLUTIONS</span>',
        '<h2 id="ast-start-heading">Ready to get started?</h2>',
        '<p class="ast-start-copy">Choose your plan. We will confirm your project scope and send verified UPI or PayPal payment instructions before setup starts.</p>',
        '<div class="ast-start-actions">',
          '<a class="ast-pill ast-pill-primary" href="/payment/">Payment &amp; Get Started <span aria-hidden="true">↗</span></a>',
          '<a class="ast-pill ast-pill-outline" href="/#pricing">See pricing</a>',
        '</div>',
        '<p class="ast-small">Questions? <a href="/contact/?service=quote">Email us</a> or <a href="/contact/?service=quote">get a quote</a>.</p>',
        '<p class="ast-owner"><strong>Suraj Kamdev, founder</strong> <span aria-hidden="true">·</span> <a href="/contact/">kamdevsuraj03@gmail.com</a></p>',
      '</div>',
    '</section>',
    '<footer class="ast-footer" aria-label="AI Suraj Teach site footer">',
      '<div class="ast-footer-inner">',
        '<div class="ast-footer-col ast-footer-brand">',
          '<a class="ast-logo" href="/" aria-label="AI Suraj Teach home">',
            '<img src="/robot-logo.svg" alt="" width="42" height="48" loading="lazy">',
            '<span>AI SURAJ <em>TEACH</em></span>',
          '</a>',
          '<strong class="ast-tagline">Learn AI. Build With AI. Grow With AI.</strong>',
          '<p>AI receptionists, premium websites, practical AI tools and helpful business ideas for teams of every size, including dental clinics.</p>',
        '</div>',
        '<nav class="ast-footer-col" aria-label="Explore articles">',
          '<h3>Explore</h3>',
          '<a href="/blog/">All articles</a>',
          '<a href="/blog/#category-0">AI receptionists</a>',
          '<a href="/blog/#category-7">Tools &amp; automation</a>',
          '<a href="/blog/#category-9">AI business</a>',
          '<a href="/blog/#category-4">Growth &amp; SEO</a>',
          '<a href="/blog/#category-5">Customer experience</a>',
        '</nav>',
        '<nav class="ast-footer-col" aria-label="AI Suraj Teach pages">',
          '<h3>AI Suraj Teach</h3>',
          '<a href="/">Home</a>',
          '<a href="/#how">How it works</a>',
          '<a href="/#pricing">AI pricing</a>',
          '<a href="/#websites">Websites</a>',
          '<a href="/templates/">60 premium demos</a>',
          '<a href="/payment/">Payment</a>',
          '<a href="/contact/?service=quote">Contact</a>',
          '<a href="/privacy-policy/">Privacy policy</a>',
          '<a href="/feed.xml">RSS feed</a>',
        '</nav>',
        '<div class="ast-footer-col ast-footer-contact">',
          '<h3>Contact</h3>',
          '<p>Suraj Kamdev, founder</p>',
          '<a href="/contact/">kamdevsuraj03@gmail.com</a>',
          '<p>Mahadev Asthan Paijawa, Patna, Bihar 800007, India</p>',
          '<a class="ast-contact-cta" href="/contact/?service=quote">Request a quote ↗</a>',
          '<a href="/contact/?service=meet#quote-form">Google Meet appointment ↗</a>',
          '<a href="/contact/?service=chat#quote-form">Google Chat support ↗</a>',
          '<a href="https://calendar.google.com/calendar/u/0/r" target="_blank" rel="noopener noreferrer"><img src="/google-calendar-icon.svg" width="22" height="22" alt=""> Google Calendar ↗</a>',
          '<a href="https://chat.google.com/" target="_blank" rel="noopener noreferrer"><img src="/google-chat-icon.svg" width="22" height="22" alt=""> Google Chat ↗</a>',
        '</div>',
      '</div>',
      '<div class="ast-footer-bottom">',
        '<p>© 2026 AI Suraj Teach · AI receptionists · Premium websites · Blog</p>',
        '<p>AI · Technology · Online Business</p>',
      '</div>',
    '</footer>'
  ].join("");

  const helpHTML = [
    '<button class="ast-help-toggle" id="ast-help-toggle" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="ast-help-panel">',
      '<span aria-hidden="true">✦</span> AI Assistant',
    '</button>',
    '<section class="ast-help-panel" id="ast-help-panel" role="dialog" aria-modal="false" aria-labelledby="ast-help-heading" hidden>',
      '<header class="ast-help-header">',
        '<div><strong id="ast-help-heading">AI Suraj Teach Assistant</strong><small>Instant FAQ helper · not a live AI model</small></div>',
        '<button type="button" class="ast-help-close" aria-label="Close assistant">×</button>',
      '</header>',
      '<div class="ast-help-body">',
        '<p class="ast-help-intro">Hello! I can help you find pricing, website demos, payment information and our contact details.</p>',
        '<div class="ast-help-questions" role="group" aria-label="Quick questions">',
          '<button type="button" data-ast-question="AI receptionist pricing">AI pricing</button>',
          '<button type="button" data-ast-question="Website pricing">Website pricing</button>',
          '<button type="button" data-ast-question="60 templates">60 templates</button>',
          '<button type="button" data-ast-question="Payment options">Payment options</button>',
        '</div>',
        '<div class="ast-help-answer" id="ast-help-answer" role="status" aria-live="polite" aria-atomic="true">Pick a topic or type a short question below.</div>',
      '</div>',
      '<form class="ast-help-form" id="ast-help-form">',
        '<label for="ast-help-input">Ask a question</label>',
        '<div class="ast-help-input-row"><input id="ast-help-input" type="text" maxlength="180" autocomplete="off" placeholder="Ask about plans or services" required><button type="submit">Send</button></div>',
      '</form>',
    '</section>'
  ].join("");

  function answerFor(text) {
    const q = text.toLowerCase().trim();
    if (/payment|pay|paypal|upi|checkout|invoice/.test(q)) {
      return ['When enabled, plan buttons take you to a secure PayPal-hosted checkout. Otherwise request a verified link or invoice. Always check the amount and merchant on PayPal before you pay.', '/payment/', 'Payment information ↗'];
    }
    if (/price|pricing|cost|charge|plan|fee|subscription|monthly/.test(q) && /web|site|design|build|template/.test(q)) {
      return ['Website build packages: Starter $399, Growth $699 and Pro $999 (one-time). Optional hosting and care plans are quoted separately.', '/#websites', 'Website packages ↗'];
    }
    if (/voice|reception|call|ai pricing|missed|minute|dental/.test(q)) {
      return ['AI receptionist subscriptions: $499, $899 or $1,599 per month. The published one-time setup fee is $497, and usage above plan allowances is $0.25/min. Your team confirms appointments.', '/#pricing', 'AI pricing ↗'];
    }
    if (/template|portfolio|demo|preview|website|site|design/.test(q)) {
      return ['Explore 60 different business website concepts across 10 industries, including dental clinics, restaurants, salons, retail and professional services.', '/templates/', 'View templates ↗'];
    }
    if (/article|blog|tutorial|learn|seo|growth/.test(q)) {
      return ['Browse our 100 blog posts about local business websites, AI phone assistants, customer support, SEO and workflow automation.', '/blog/', 'Browse articles ↗'];
    }
    if (/contact|email|support|founder|quote|help/.test(q)) {
      return ['Contact the founder via kamdevsuraj03@gmail.com. Share your business type and preferred service to request a quote.', '/contact/?service=quote', 'Send an email ↗'];
    }
    if (/price|pricing|cost|charge|plan|fee/.test(q)) {
      return ['AI receptionist plans start at $499/month. Website builds start at $399 one-time. Choose a category on the pricing page for full details.', '/#pricing', 'Compare pricing ↗'];
    }
    return ['I am a quick FAQ helper, not a live AI model. I can answer questions about pricing, AI receptionists, website templates and contact details.', '/contact/', 'Contact our team ↗'];
  }

  function install() {
    if (document.getElementById("ast-global-footer")) return;
    const wrapper = document.createElement("div");
    wrapper.id = "ast-global-footer";
    wrapper.innerHTML = footerHTML;

    const existing = document.querySelector(".site-footer, .foot, .gallery-footer, .demo-footer, .preview-footer");
    if (existing) existing.replaceWith(wrapper);
    else document.body.appendChild(wrapper);

    const helper = document.createElement("div");
    helper.className = "ast-help-root";
    helper.innerHTML = helpHTML;
    document.body.appendChild(helper);

    const open = helper.querySelector("#ast-help-toggle");
    const panel = helper.querySelector("#ast-help-panel");
    const close = helper.querySelector(".ast-help-close");
    const input = helper.querySelector("#ast-help-input");
    const answer = helper.querySelector("#ast-help-answer");

    function toggle(force) {
      const show = Boolean(force);
      panel.hidden = !show;
      open.setAttribute("aria-expanded", String(show));
      if (show) input.focus();
      else open.focus();
    }
    open.addEventListener("click", () => toggle(panel.hidden));
    close.addEventListener("click", () => toggle(false));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !panel.hidden) toggle(false);
    });

    function respond(question) {
      const [message, href, label] = answerFor(question);
      answer.textContent = message;
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      answer.appendChild(document.createTextNode(" "));
      answer.appendChild(link);
    }
    helper.querySelectorAll("[data-ast-question]").forEach(btn => {
      btn.addEventListener("click", () => respond(btn.dataset.astQuestion));
    });
    helper.querySelector("#ast-help-form").addEventListener("submit", e => {
      e.preventDefault();
      if (!input.value.trim()) return;
      respond(input.value);
      input.value = "";
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, {once: true});
  else install();
})();