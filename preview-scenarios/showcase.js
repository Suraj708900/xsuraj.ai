(() => {
  const cards = Array.from(document.querySelectorAll('.scenario-card'));
  const filters = document.querySelector('.scenario-filters');
  const countrySelect = document.getElementById('filter-country');
  const serviceSelect = document.getElementById('filter-service');
  const loadMoreButton = document.getElementById('scenario-load-more');
  const status = document.getElementById('scenario-status');

  if (!cards.length || !filters || !countrySelect || !serviceSelect || !loadMoreButton || !status) return;

  const pageSize = 6;
  let visibleLimit = pageSize;

  cards.forEach(card => {
    card.dataset.service = card.querySelector('.service-tag')?.textContent.trim() || '';
  });
  [...new Set(cards.map(card => card.dataset.service).filter(Boolean))].sort().forEach(service => {
    serviceSelect.add(new Option(service, service));
  });

  function render() {
    const country = countrySelect.value;
    const service = serviceSelect.value;
    const matchingCards = cards.filter(card =>
      (country === 'all' || card.dataset.country === country) &&
      (service === 'all' || card.dataset.service === service));
    const visibleCards = new Set(matchingCards.slice(0, visibleLimit));

    cards.forEach(card => {
      card.hidden = !visibleCards.has(card);
    });

    const remaining = matchingCards.length - visibleCards.size;
    loadMoreButton.hidden = remaining <= 0;
    loadMoreButton.firstChild.textContent = `Load more (${remaining}) `;
    const filterLabel = [country !== 'all' && `from ${country}`, service !== 'all' && `for ${service}`].filter(Boolean).join(' ');
    status.textContent = matchingCards.length
      ? `Showing ${visibleCards.size} of ${matchingCards.length} fictional scenarios${filterLabel ? ` ${filterLabel}` : ''}. Ratings and dates are illustrative only.`
      : 'No fictional scenarios match these filters. Try another country or service.';
    return matchingCards;
  }

  [countrySelect, serviceSelect].forEach(select => {
    select.addEventListener('change', () => {
      visibleLimit = pageSize;
      render();
    });
  });

  loadMoreButton.addEventListener('click', () => {
    const previousLimit = visibleLimit;
    visibleLimit += pageSize;
    const matchingCards = render();
    const firstNewCard = matchingCards[previousLimit];
    if (firstNewCard) {
      firstNewCard.setAttribute('tabindex', '-1');
      firstNewCard.focus({ preventScroll: true });
    }
  });

  render();
  filters.hidden = false;
})();
