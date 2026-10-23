/* Runs in the head, before any visible content. Explicit routes are deliberate URL choices. */
(function (root) {
  function choose({path, saved, country, languages}) {
    const explicit = path.match(/^\/(en|ja)(?:\/|$)/);
    if (explicit) return explicit[1];
    if (saved === 'en' || saved === 'ja') return saved;
    if (country) return country === 'JP' ? 'ja' : 'en';
    return (languages || []).some(l => /^ja(?:-|$)/i.test(l)) ? 'ja' : 'en';
  }
  root.chooseLocale = choose;
  if (typeof module !== 'undefined') module.exports = {chooseLocale: choose};
  if (!root.document) return;
  let saved; try { saved = localStorage.getItem('portfolio.locale'); } catch (_) {}
  const locale = choose({path: location.pathname, saved, country: root.HOST_COUNTRY, languages: navigator.languages || [navigator.language]});
  // A redirect is only needed on the auto-detected root; locale pages are fully prerendered.
  if (!/^\/(en|ja)(?:\/|$)/.test(location.pathname) && locale !== document.documentElement.lang) {
    location.replace('/' + locale + '/' + location.search + location.hash);
  }
})(typeof window === 'undefined' ? globalThis : window);
