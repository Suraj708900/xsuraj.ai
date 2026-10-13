(() => {
  const cards = Array.from(document.querySelectorAll('.scenario-card'));
  const filters = document.querySelector('.country-filters');
  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
  const loadMoreButton = document.getElementById('scenario-load-more');
  const status = document.getElementById('scenario-status');

  if (!cards.length || !filters || !loadMoreButton || !status) return;

  const pageSize = 6;
  let activeCountry = 'all';
  let visibleLimit = pageSize;

  function render() {
    const matchingCards = cards.filter(card => activeCountry === 'all' || card.dataset.country === activeCountry);
    const visibleCards = new Set(matchingCards.slice(0, visibleLimit));

    cards.forEach(card => {
      card.hidden = !visibleCards.has(card);
    });

    filterButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === activeCountry));
    });

    loadMoreButton.hidden = visibleCards.size >= matchingCards.length;
    const countryLabel = activeCountry === 'all' ? '' : ` from ${activeCountry}`;
    status.textContent = `Showing ${visibleCards.size} of ${matchingCards.length} fictional scenarios${countryLabel}. Ratings and dates are illustrative only.`;
    return matchingCards;
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeCountry = button.dataset.filter;
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
