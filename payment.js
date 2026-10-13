(() => {
  const form = document.getElementById('payment-form');
  const planSelect = document.getElementById('payment-plan');
  const submitButton = document.getElementById('paypal-submit');
  const status = document.getElementById('payment-status');
  if (!form || !planSelect || !submitButton || !status) return;

  const buttonLabel = submitButton.textContent;
  const clearStatus = () => {
    status.hidden = true;
    status.textContent = '';
    delete status.dataset.error;
  };

  document.querySelectorAll('[data-payment-plan]').forEach((link) => {
    link.addEventListener('click', () => {
      planSelect.value = link.dataset.paymentPlan;
      clearStatus();
      planSelect.focus({ preventScroll: true });
    });
  });
  planSelect.addEventListener('change', clearStatus);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton.disabled) return;
    const body = new URLSearchParams(new FormData(form)).toString();
    submitButton.disabled = true;
    submitButton.textContent = 'Sending request…';
    form.setAttribute('aria-busy', 'true');
    status.hidden = false;
    status.dataset.error = 'false';
    status.textContent = 'Sending your payment link request…';

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error('Request failed');
      const plan = planSelect.options[planSelect.selectedIndex].text.split(' — ')[0];
      form.reset();
      status.textContent = `Thanks! Your ${plan} request was sent. Suraj will email your PayPal payment link, usually within one business day. No payment has been taken yet.`;
    } catch {
      status.dataset.error = 'true';
      status.textContent = 'Your request could not be sent. Check your connection and try again, or email kamdevsuraj03@gmail.com.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = buttonLabel;
      form.removeAttribute('aria-busy');
    }
  });
})();
