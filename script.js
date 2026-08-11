const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('ixa-theme');

if (savedTheme) root.dataset.theme = savedTheme;

function updateThemeLabel() {
  const isDark = root.dataset.theme === 'dark';
  toggle.setAttribute('aria-label', isDark ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren');
}

toggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('ixa-theme', root.dataset.theme);
  updateThemeLabel();
});

document.querySelector('#year').textContent = new Date().getFullYear();
updateThemeLabel();

document.querySelectorAll('[data-link]').forEach((link) => {
  link.addEventListener('click', () => {
    const event = new CustomEvent('ixa:link-click', { detail: { link: link.dataset.link } });
    window.dispatchEvent(event);
  });
});
