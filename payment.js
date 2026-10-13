(() => {
  const form = document.getElementById('payment-form');
  const planSelect = document.getElementById('payment-plan');
  const submitButton = document.getElementById('paypal-submit');
  const status = document.getElementById('payment-status');
  if (!form || !planSelect || !submitButton || !status) return;

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
    submitButton.disabled = true;
    planSelect.disabled = true;
    submitButton.textContent = 'Opening PayPal…';
    form.setAttribute('aria-busy', 'true');
    status.hidden = false;
    status.dataset.error = 'false';
    status.textContent = 'Preparing your PayPal checkout…';

    try {
      const requestUrl = new URL(form.action);
      requestUrl.searchParams.set('plan', planSelect.value);
      const response = await fetch(requestUrl, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
      });
      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Checkout is unavailable. Please contact Suraj for a PayPal payment link.');
      }
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unable to open PayPal. Please try again.');
      }
      const checkoutUrl = new URL(result.url);
      if (checkoutUrl.protocol !== 'https:' || checkoutUrl.username || checkoutUrl.password || checkoutUrl.port ||
          !['www.paypal.com', 'paypal.com', 'paypal.me', 'www.paypal.me'].includes(checkoutUrl.hostname)) {
        throw new Error('The PayPal payment link is invalid. Please contact Suraj.');
      }
      status.textContent = 'Taking you to PayPal. Payment is not yet complete.';
      window.location.assign(checkoutUrl.href);
    } catch (error) {
      status.dataset.error = 'true';
      status.textContent = error.name === 'TimeoutError' || error.name === 'AbortError' || error instanceof TypeError
        ? 'Unable to connect to checkout. Check your connection and try again, or contact Suraj for a PayPal payment link.'
        : error.message;
    } finally {
      submitButton.disabled = false;
      planSelect.disabled = false;
      submitButton.textContent = 'Continue with PayPal';
      form.removeAttribute('aria-busy');
    }
  });
})();
