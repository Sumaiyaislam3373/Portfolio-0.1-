/* Dictionaries load as ordinary scripts so language switching also works offline. */
(function () {
  'use strict';
  const allowed = new Set(['en', 'bn']);
  const elements = [...document.querySelectorAll('[data-t]')];
  let language = 'en';
  function preferredLanguage() {
    const query = new URL(location.href).searchParams.get('lang');
    if (allowed.has(query)) return query;
    try { const stored = localStorage.getItem('jebin-language'); if (allowed.has(stored)) return stored; } catch (_) {}
    return 'en';
  }
  function setLanguage(value, announce = false, updateURL = false) {
    const next = allowed.has(value) ? value : 'en';
    const dictionary = window.PortfolioCopy?.[next];
    if (!dictionary) return;
    language = next;
    // Only trusted, bundled translation files are rendered as HTML.
    elements.forEach(element => {
      const text = dictionary[element.dataset.t];
      if (typeof text === 'string') element.innerHTML = text;
    });
    document.querySelectorAll('[data-placeholder]').forEach(element => { const text = dictionary[element.dataset.placeholder]; if (typeof text === 'string') element.placeholder = text; });
    document.documentElement.lang = next;
    document.querySelector('.site').classList.toggle('bn', next === 'bn');
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === next)));
    document.title = dictionary.pageTitle;
    document.querySelector('meta[name="description"]').content = dictionary.pageDescription;
    document.querySelector('meta[property="og:title"]').content = dictionary.pageTitle;
    document.querySelector('meta[property="og:description"]').content = dictionary.pageDescription;
    document.querySelector('meta[name="twitter:title"]').content = dictionary.pageTitle;
    document.querySelector('meta[name="twitter:description"]').content = dictionary.pageDescription;
    document.querySelector('#navigation').setAttribute('aria-label', dictionary.navLabel);
    document.querySelector('.language-switch').setAttribute('aria-label', dictionary.languageLabel);
    try { localStorage.setItem('jebin-language', next); } catch (_) {}
    if (updateURL) {
      try { const url = new URL(location.href); url.searchParams.set('lang', next); history.replaceState(null, '', url); } catch (_) {}
    }
    if (announce) document.querySelector('#language-status').textContent = dictionary.languageChanged;
    document.dispatchEvent(new CustomEvent('portfolio:language', { detail: { language: next } }));
  }
  window.PortfolioLanguage = { get: () => language, text: key => window.PortfolioCopy?.[language]?.[key] || window.PortfolioCopy?.en?.[key] || key, set: setLanguage };
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language, true, true)));
  window.addEventListener('storage', event => { if (event.key === 'jebin-language' && allowed.has(event.newValue)) setLanguage(event.newValue); });
  window.addEventListener('popstate', () => setLanguage(preferredLanguage()));
  setLanguage(preferredLanguage());
}());
