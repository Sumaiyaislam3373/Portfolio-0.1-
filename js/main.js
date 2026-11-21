(function () {
  'use strict';
  const site = document.querySelector('.site');
  const navigation = document.querySelector('#navigation');
  const menu = document.querySelector('.menu-toggle');
  const navRow = document.querySelector('.nav');
  const language = window.PortfolioLanguage;
  const dialog = document.querySelector('#project-dialog');
  let selectedProject = null;
  let previousFocus = null;
  function updateMenuLabel() { menu.textContent = language.text(menu.getAttribute('aria-expanded') === 'true' ? 'closeMenu' : 'menu'); }
  function closeMenu(restoreFocus = false) { menu.setAttribute('aria-expanded', 'false'); navRow.classList.remove('menu-open'); updateMenuLabel(); if (restoreFocus) menu.focus(); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navRow.classList.toggle('menu-open', open); updateMenuLabel(); });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    const wasOpen = menu.getAttribute('aria-expanded') === 'true';
    closeMenu();
    if (!wasOpen) return;
    const section = document.querySelector(link.hash);
    if (section) {
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
      section.addEventListener('blur', () => section.removeAttribute('tabindex'), { once: true });
    }
  }));
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true); });
  const desktop = matchMedia('(min-width: 641px)');
  desktop.addEventListener('change', event => { if (event.matches) closeMenu(); });
  function renderProject() {
    if (!selectedProject) return;
    const copy = window.PortfolioProjects[selectedProject][language.get()];
    document.querySelector('#project-title').textContent = copy.title;
    document.querySelector('#project-category').textContent = copy.category;
    document.querySelector('#project-purpose').textContent = copy.purpose;
    document.querySelector('#project-note').textContent = copy.note;
    const features = document.querySelector('#project-features');
    features.replaceChildren(...copy.features.map(text => { const item = document.createElement('li'); item.textContent = text; return item; }));
    const tech = document.querySelector('#project-tech');
    tech.replaceChildren(...copy.tech.map(text => { const item = document.createElement('span'); item.textContent = text; return item; }));
  }
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    selectedProject = button.dataset.project;
    previousFocus = button;
    renderProject();
    dialog.showModal();
    document.body.classList.add('modal-open');
  }));
  document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); previousFocus?.focus({ preventScroll: true }); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  document.querySelector('#project-contact').addEventListener('click', event => {
    event.preventDefault(); dialog.close(); closeMenu();
    const contact = document.querySelector('#contact');
    contact.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    const link = contact.querySelector('a'); link.focus({ preventScroll: true });
    try { history.replaceState(null, '', '#contact'); } catch (_) {}
  });
  document.addEventListener('portfolio:language', () => { renderProject(); updateMenuLabel(); });
  document.querySelectorAll('[data-year]').forEach(node => node.textContent = new Date().getFullYear());
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const entry = entries.filter(item => item.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (!entry) return;
      navigation.querySelectorAll('a').forEach(link => { if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
  // Only reveal controls once their handlers and dictionaries are ready.
  site.classList.add('js');
  updateMenuLabel();
}());
