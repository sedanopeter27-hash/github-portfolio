(() => {
  const root = document.documentElement;
  const savedTheme = (() => { try { return localStorage.getItem('peter-portfolio-theme'); } catch { return null; } })();
  root.dataset.theme = savedTheme === 'light' ? 'light' : 'dark';
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    try { localStorage.setItem('peter-portfolio-theme', theme); } catch {}
  };
  const toggleTheme = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
  document.getElementById('portraitThemeToggle')?.addEventListener('click', toggleTheme);
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  menuButton?.addEventListener('click', () => {
    const open = navLinks?.classList.toggle('open') ?? false;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
