/* ═══════════════════════════════════════════
   theme.js — OrganChain Dark Mode Toggle
   ═══════════════════════════════════════════ */

(function () {
  const html = document.documentElement;
  const key = 'organchain-theme';

  function getPreferred() {
    const saved = localStorage.getItem(key);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.classList.toggle('dark', theme === 'dark');
  }

  applyTheme(getPreferred());

  window.organChainTheme = {
    toggle() {
      const isDark = html.classList.contains('dark');
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(key, next);
    },
    getCurrent() {
      return html.classList.contains('dark') ? 'dark' : 'light';
    }
  };
})();
