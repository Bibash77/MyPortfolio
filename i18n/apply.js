window.siteLocale = document.documentElement.lang;
window.translate = key => MESSAGES[siteLocale][key];
window.setLocale = function (locale) {
  if (!MESSAGES[locale]) return;
  window.siteLocale = locale;
  document.documentElement.lang = locale;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = MESSAGES[locale][el.dataset.i18n]; });
  ['alt','title','placeholder','aria-label','content'].forEach(attr => {
    document.querySelectorAll('[data-i18n-' + attr + ']').forEach(el => { el.setAttribute(attr, MESSAGES[locale][el.getAttribute('data-i18n-' + attr)]); });
  });
  document.querySelectorAll('[data-locale]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.locale === locale)));
  document.querySelector('.locale-switch').setAttribute('aria-label', locale === 'ja' ? '表示言語' : 'Display language');
  document.querySelector('link[rel="canonical"]').href = 'https://www.bibashbogati.com.np/' + locale + '/';
  document.querySelector('meta[property="og:url"]').content = 'https://www.bibashbogati.com.np/' + locale + '/';
  document.querySelector('meta[property="og:locale"]').content = locale === 'ja' ? 'ja_JP' : 'en_US';
  history.replaceState(null, '', '/' + locale + '/' + location.search + location.hash);
  try { localStorage.setItem('portfolio.locale', locale); } catch (_) {}
  document.dispatchEvent(new Event('localechange'));
};
document.querySelectorAll('[data-locale]').forEach(b => b.addEventListener('click', () => setLocale(b.dataset.locale)));
