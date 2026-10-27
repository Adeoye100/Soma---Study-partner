/* Theme initialiser – runs before React hydrates to prevent flash of wrong theme.
 * No module syntax; loaded as a plain <script src="/theme-init.js"> in index.html.
 * Kept tiny on purpose: no dependencies, no imports.
 * Storage key matches ThemeContext.tsx: 'soma-theme'. */
(function () {
  try {
    var stored = localStorage.getItem('soma-theme') || 'system';
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored === 'dark' || (stored === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  } catch (_) {
    // If localStorage is blocked, default to dark (the app's original default)
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }
})();
