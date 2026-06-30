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


const counters = document.querySelectorAll(".counter");

function animateCounter(counter) {
    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || "";

    let current = 0;

    const duration = 1000;
    const increment = target / (duration / 16);

    function update() {
        current += increment;

        if (current >= target) {
            current = target;
        }

        counter.textContent =
            Math.floor(current).toLocaleString() + suffix;

        if (current < target) {
            requestAnimationFrame(update);
        }
    }

    update();
}

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.4,
    }
);

counters.forEach((counter) => observer.observe(counter));