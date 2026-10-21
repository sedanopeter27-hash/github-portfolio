(() => {
  const root = document.documentElement;
  const THEME_KEY = 'peter-portfolio-theme';
  const savedTheme = (() => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } })();
  root.dataset.theme = savedTheme === 'light' ? 'light' : 'dark';

  const syncPortrait = (theme) => {
    document.querySelectorAll('.portrait[data-dark-src][data-light-src]').forEach((portrait) => {
      const nextSrc = theme === 'light' ? portrait.dataset.lightSrc : portrait.dataset.darkSrc;
      portrait.onerror = () => {
        portrait.onerror = null;
        // If a portrait asset is unavailable, retain the working dark portrait as a safe fallback.
        portrait.src = portrait.dataset.darkSrc;
        portrait.classList.add('portrait-fallback');
      };
      portrait.classList.remove('portrait-fallback');
      if (portrait.getAttribute('src') !== nextSrc) portrait.src = nextSrc;
    });
  };
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    syncPortrait(theme);
    document.querySelectorAll('.theme-toggle').forEach((button) => {
      button.textContent = theme === 'dark' ? '☼' : '☾';
      button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      button.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    });
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  };
  syncPortrait(root.dataset.theme);
  setTheme(root.dataset.theme);
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


  // Compact technology marks on tags, using local CSS monograms (no external icon dependency).
  const techAliases = [
    [/\bHTML(?:5)?\b/i, 'HTML', 'html'], [/\bCSS(?:3)?\b/i, 'CSS', 'css'],
    [/JavaScript|\bJS\b/i, 'JS', 'js'], [/Firebase/i, 'FB', 'firebase'],
    [/Firestore/i, 'DB', 'firebase'], [/Arduino/i, 'A', 'arduino'],
    [/ESP32/i, '32', 'esp32'], [/GitHub|Git & GitHub/i, 'GH', 'github'],
    [/Node\.js/i, 'N', 'js'], [/Express\.js/i, 'EX', 'js'],
    [/SQL/i, 'SQL', 'firebase'], [/PWA|Service Worker/i, 'PWA', 'js'],
    [/Sensors?/i, 'S', 'esp32'], [/QR Attendance/i, 'QR', 'js'],
    [/Event Management/i, 'EV', 'js'], [/Hardware/i, 'HW', 'esp32']
  ];
  document.querySelectorAll('.tag').forEach((tag) => {
    if (tag.querySelector('.tech-mark')) return;
    const label = tag.textContent.trim();
    const match = techAliases.find(([pattern]) => pattern.test(label));
    if (!match) return;
    const mark = document.createElement('span');
    mark.className = 'tech-mark';
    mark.dataset.tech = match[2];
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = match[1];
    tag.classList.add('tech-tag');
    tag.prepend(mark);
  });

  // User-controllable, synthesized robotic UI tick. No sound is played until a visitor clicks.
  const SOUND_KEY = 'peter-portfolio-sounds';
  let soundsEnabled = true;
  try { soundsEnabled = localStorage.getItem(SOUND_KEY) !== 'off'; } catch {}
  let audioContext = null;
  const soundToggle = document.getElementById('soundToggle');
  const syncSoundButton = () => {
    if (!soundToggle) return;
    soundToggle.textContent = soundsEnabled ? '♪' : '♫̸';
    soundToggle.setAttribute('aria-pressed', String(soundsEnabled));
    soundToggle.setAttribute('aria-label', soundsEnabled ? 'Mute interface sounds' : 'Enable interface sounds');
    soundToggle.title = soundsEnabled ? 'Interface sounds on — click to mute' : 'Interface sounds off — click to enable';
  };
  const playInterfaceSound = () => {
    if (!soundsEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioContext ||= new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.055);
      filter.type = 'lowpass'; filter.frequency.value = 1800;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.045, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
      osc.connect(filter); filter.connect(gain); gain.connect(audioContext.destination);
      osc.start(now); osc.stop(now + 0.08);
    } catch {}
  };
  syncSoundButton();
  soundToggle?.addEventListener('click', (event) => {
    event.preventDefault(); event.stopPropagation();
    soundsEnabled = !soundsEnabled;
    try { localStorage.setItem(SOUND_KEY, soundsEnabled ? 'on' : 'off'); } catch {}
    syncSoundButton();
    if (soundsEnabled) playInterfaceSound();
  });
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('a, button, [role="button"]') : null;
    if (target && target !== soundToggle) playInterfaceSound();
  }, true);

})();
