(function () {
  'use strict';
  const language = window.PortfolioLanguage;
  const filterGroup = document.querySelector('.project-filters');
  const projects = [...document.querySelectorAll('.projects > .project')];
  const results = document.querySelector('#project-results');
  let filter = 'all';
  function updateFilter() {
    const valid = ['all', 'website', 'application', 'wordpress'];
    if (!valid.includes(filter)) filter = 'all';
    projects.forEach(project => { project.hidden = filter !== 'all' && (filter === 'wordpress' ? project.dataset.platform !== 'wordpress' : project.dataset.category !== filter); });
    filterGroup.setAttribute('aria-label', language.text('filterLabel'));
    filterGroup.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
    const count = projects.filter(project => !project.hidden).length;
    results.textContent = language.text(count === 1 ? 'resultOne' : 'resultMany').replace('{count}', String(count));
  }
  filterGroup.querySelectorAll('button').forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; updateFilter(); }));
  const form = document.querySelector('#inquiry-form');
  const fields = ['name', 'email', 'service', 'message'];
  const services = { website: 'formWebsite', landing: 'formLanding', wordpress: 'formWordpress', application: 'formApplication', maintenance: 'formMaintenance', other: 'formOther' };
  const elements = Object.fromEntries(fields.map(key => [key, document.querySelector('#inquiry-' + key)]));
  const summary = document.querySelector('#inquiry-errors');
  const draftPanel = document.querySelector('#inquiry-draft');
  const draftField = document.querySelector('#draft-text');
  const draftLink = document.querySelector('#open-email');
  const status = document.querySelector('#inquiry-status');
  let showErrors = false;
  let draftReady = false;
  function values() { return Object.fromEntries(fields.map(key => [key, elements[key].value.trim()])); }
  function validate(data) {
    const errors = {};
    if (data.name.length < 2 || data.name.length > 100) errors.name = 'nameError';
    if (data.email.length > 254 || !/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(data.email)) errors.email = 'emailError';
    if (!Object.prototype.hasOwnProperty.call(services, data.service)) errors.service = 'serviceError';
    if (data.message.length < 20 || data.message.length > 1500) errors.message = 'messageError';
    return errors;
  }
  function composeDraft(data) {
    const label = key => language.text(key);
    return `${label('draftGreeting')}\n\n${label('formName')}: ${data.name}\n${label('formEmail')}: ${data.email}\n${label('formService')}: ${label(services[data.service])}\n\n${label('formMessage')}:\n${data.message}\n\n${label('draftClosing')}`;
  }
  function createMailto(body) {
    return 'mailto:sumaiya3373@gmail.com?subject=' + encodeURIComponent(language.text('emailSubject')) + '&body=' + encodeURIComponent(body);
  }
  function displayErrors(errors, focusFirst = false) {
    const keys = Object.keys(errors);
    fields.forEach(key => {
      const errorNode = document.querySelector('#error-' + key);
      errorNode.textContent = errors[key] ? language.text(errors[key]) : '';
      elements[key].setAttribute('aria-invalid', String(Boolean(errors[key])));
    });
    summary.hidden = keys.length === 0;
    summary.textContent = keys.length ? language.text('formErrorSummary') : '';
    if (focusFirst && keys.length) elements[keys[0]].focus();
    return keys.length === 0;
  }
  function buildDraft() {
    const data = values();
    const body = composeDraft(data);
    draftField.value = body;
    draftField.setAttribute('aria-label', language.text('draftLabel'));
    draftLink.setAttribute('href', createMailto(body));
    draftPanel.hidden = false;
    draftReady = true;
    status.textContent = language.text('draftReady');
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    showErrors = true;
    if (!displayErrors(validate(values()), true)) { draftReady = false; draftPanel.hidden = true; status.textContent = ''; return; }
    buildDraft();
    document.querySelector('#draft-heading').focus({ preventScroll: true });
    draftPanel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
  });
  form.addEventListener('input', () => {
    draftReady = false; draftPanel.hidden = true; draftField.value = ''; draftLink.removeAttribute('href'); status.textContent = '';
    if (showErrors) displayErrors(validate(values()));
  });
  form.addEventListener('change', () => { draftReady = false; draftPanel.hidden = true; draftLink.removeAttribute('href'); status.textContent = ''; if (showErrors) displayErrors(validate(values())); });
  form.addEventListener('reset', () => { showErrors = false; draftReady = false; draftPanel.hidden = true; draftField.value = ''; draftLink.removeAttribute('href'); status.textContent = ''; displayErrors({}); });
  document.querySelector('#copy-inquiry').addEventListener('click', async () => {
    if (!draftReady) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(draftField.value);
      status.textContent = language.text('draftCopied');
    } catch (_) {
      draftField.focus(); draftField.select(); status.textContent = language.text('copyFallback');
    }
  });
  document.addEventListener('portfolio:language', () => {
    updateFilter();
    if (showErrors) displayErrors(validate(values()));
    if (draftReady) buildDraft();
    draftField.setAttribute('aria-label', language.text('draftLabel'));
  });
  // Helpers are side-effect free: no HTTP calls, form storage or automatic mail launch.
  window.PortfolioInquiry = { validate, composeDraft, createMailto };
  form.noValidate = true;
  document.querySelector('.features').classList.add('ready');
  updateFilter();
}());
