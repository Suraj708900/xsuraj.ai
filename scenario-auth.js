(() => {
  'use strict';
  const cards = [...document.querySelectorAll('#scenario-grid .scenario-card')];
  const countryButtons = [...document.querySelectorAll('[data-country-filter]')];
  const service = document.getElementById('service-filter');
  const more = document.getElementById('scenario-load-more');
  const status = document.getElementById('scenario-status');
  let country = 'all', limit = 6;
  const render = () => {
    const matches = cards.filter(card => (country === 'all' || card.dataset.country === country) && (service.value === 'all' || card.querySelector('.service-tag')?.textContent.trim() === service.value));
    cards.forEach(card => { card.hidden = true; });
    matches.slice(0,limit).forEach(card => { card.hidden = false; });
    more.hidden = matches.length <= limit;
    status.textContent = 'Showing ' + Math.min(limit,matches.length) + ' of ' + matches.length + ' fictional scenarios.';
    countryButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.countryFilter === country)));
  };
  countryButtons.forEach(button => button.addEventListener('click',() => {country=button.dataset.countryFilter;limit=6;render();}));
  service.addEventListener('change',()=>{limit=6;render();});
  more.addEventListener('click',()=>{const old=limit;limit+=6;render();const next=cards.filter(card=>!card.hidden)[old];if(next){next.tabIndex=-1;next.focus({preventScroll:true});}});
  render();
  // Auth0 SPA public identifiers; no client secret is embedded in the website.
  const authStatus = document.getElementById('auth-status');
  const login = document.getElementById('auth-login');
  const signup = document.getElementById('auth-signup');
  const logout = document.getElementById('auth-logout');
  const user = document.getElementById('auth-user');
  let client;
  const setStatus = message => {authStatus.textContent=message;};
  const refresh = async () => {
    const signedIn = await client.isAuthenticated();
    login.hidden = signup.hidden = signedIn;
    logout.hidden = !signedIn;
    const profile = signedIn ? await client.getUser() : null;
    user.textContent = profile ? 'Signed in: ' + (profile.name || profile.email || 'Account') : '';
  };
  (async () => {
    try {
      if (!window.auth0?.createAuth0Client) throw new Error('Login library did not load');
      client = await window.auth0.createAuth0Client({
        domain: 'xsurajteach.us.auth0.com',
        clientId: 'koRdOI7mpuFJaSpvpbEzNBFQfABMdu3M',
        authorizationParams: {redirect_uri: window.location.origin + '/'},
        cacheLocation: 'memory',
        useRefreshTokens: false
      });
      if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
        await client.handleRedirectCallback();
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      }
      login.addEventListener('click',()=>client.loginWithRedirect());
      signup.addEventListener('click',()=>client.loginWithRedirect({authorizationParams:{screen_hint:'signup'}}));
      logout.addEventListener('click',()=>client.logout({logoutParams:{returnTo:window.location.origin + '/'}}));
      await refresh();
    } catch(error) {
      console.error('Auth0 setup:',error);
      setStatus('Login is not ready. The site owner must verify Auth0 application settings.');
      login.disabled = signup.disabled = true;
    }
  })();
})();