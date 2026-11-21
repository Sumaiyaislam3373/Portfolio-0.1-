(function () {
  'use strict';
  const site = document.querySelector('.site');
  const language = window.PortfolioLanguage;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  const motionButton = document.querySelector('.motion-toggle');
  let userReduced = false;
  try { userReduced = localStorage.getItem('jebin-reduced-motion') === 'true'; } catch (_) {}
  const enabled = () => !reduced.matches && !userReduced;
  function updateMotion() {
    const on = enabled();
    site.classList.toggle('motion-enabled', on);
    document.documentElement.classList.toggle('motion-disabled', !on);
    motionButton.setAttribute('aria-pressed', String(!on));
    motionButton.textContent = language.text(on ? 'reduceMotion' : 'motionReduced');
    document.querySelector('.scene-tabs').setAttribute('aria-label', language.text('sceneLabel'));
    if (!on) {
      document.querySelectorAll('.project-art').forEach(art => art.style.setProperty('--art-offset', '0px'));
      document.querySelector('.process-track').style.setProperty('--progress', '1');
      document.querySelector('.contact-section').style.setProperty('--glow-x', '0px');
      document.querySelector('.contact-section').style.setProperty('--glow-y', '0px');
    }
  }
  motionButton.addEventListener('click', () => {
    // An operating-system reduced-motion preference always takes precedence.
    userReduced = !userReduced;
    try { localStorage.setItem('jebin-reduced-motion', String(userReduced)); } catch (_) {}
    updateMotion(); schedule();
  });
  reduced.addEventListener('change', () => { updateMotion(); schedule(); });
  document.addEventListener('portfolio:language', updateMotion);
  const scene = document.querySelector('.hero-visual');
  document.querySelectorAll('[data-scene-button]').forEach(button => button.addEventListener('click', () => {
    scene.dataset.scene = button.dataset.sceneButton;
    document.querySelectorAll('[data-scene-button]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
  const revealElements = [...document.querySelectorAll('.reveal')];
  document.querySelectorAll('.projects,.process-track').forEach(group => {
    [...group.children].filter(item => item.classList.contains('reveal')).forEach((item, index) => item.style.setProperty('--reveal-delay', Math.min(index * 90, 180) + 'ms'));
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
    revealElements.forEach(element => observer.observe(element));
  } else revealElements.forEach(element => element.classList.add('is-visible'));
  const services = [...document.querySelectorAll('.service')];
  services.forEach(item => item.addEventListener('toggle', () => { if (item.open) services.forEach(other => { if (other !== item) other.open = false; }); }));
  const process = document.querySelector('.process-track');
  const artwork = [...document.querySelectorAll('.project-art')];
  let frame = null;
  function updateScroll() {
    frame = null;
    if (!enabled()) return;
    const height = window.innerHeight;
    const rect = process.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (height * 0.82 - rect.top) / Math.max(200, height * 0.55)));
    process.style.setProperty('--progress', progress.toFixed(3));
    if (finePointer.matches && window.innerWidth > 800) artwork.forEach(art => {
      const bounds = art.getBoundingClientRect();
      if (bounds.top < height && bounds.bottom > 0) art.style.setProperty('--art-offset', (Math.max(-9, Math.min(9, (height / 2 - bounds.top - bounds.height / 2) * .025))).toFixed(1) + 'px');
    });
  }
  function schedule() { if (frame === null) frame = requestAnimationFrame(updateScroll); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  const contact = document.querySelector('.contact-section');
  contact.addEventListener('pointermove', event => {
    if (!enabled() || !finePointer.matches) return;
    const bounds = contact.getBoundingClientRect();
    contact.style.setProperty('--glow-x', ((event.clientX - bounds.left) / bounds.width - .5) * 100 + 'px');
    contact.style.setProperty('--glow-y', ((event.clientY - bounds.top) / bounds.height - .5) * 65 + 'px');
  });
  contact.addEventListener('pointerleave', () => { contact.style.setProperty('--glow-x', '0px'); contact.style.setProperty('--glow-y', '0px'); });
  updateMotion(); schedule();
}());
