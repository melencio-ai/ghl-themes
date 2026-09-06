(() => {
  'use strict';

  const defaults = {
    themeName: 'My Agency',
    locationId: '',
    logoUrl: '',
    sidebarColor: '#111827',
    accentColor: '#2563eb',
    navTextColor: '#f8fafc',
    fontFamily: 'Inter',
    radius: '10',
    sidebarFinish: 'solid',
    iconStyle: 'default',
    hiddenIds: ['sb_launchpad', 'sb_location-mobile-app', 'sb_app-marketplace'],
    customHiddenIds: ''
  };

  let state = loadState();

  const $ = (id) => document.getElementById(id);
  const controls = {
    themeName: $('themeName'),
    locationId: $('locationId'),
    logoUrl: $('logoUrl'),
    sidebarColor: $('sidebarColor'),
    sidebarColorText: $('sidebarColorText'),
    accentColor: $('accentColor'),
    accentColorText: $('accentColorText'),
    navTextColor: $('navTextColor'),
    navTextColorText: $('navTextColorText'),
    fontFamily: $('fontFamily'),
    radius: $('radius'),
    customHiddenIds: $('customHiddenIds')
  };

  function loadState() {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem('ghl-theme-builder') || '{}') };
    } catch (_) {
      return { ...defaults };
    }
  }

  function saveState() {
    localStorage.setItem('ghl-theme-builder', JSON.stringify(state));
  }

  function normalizeHex(value, fallback) {
    const v = String(value || '').trim();
    if (/^#[0-9a-f]{6}$/i.test(v)) return v.toLowerCase();
    if (/^[0-9a-f]{6}$/i.test(v)) return '#' + v.toLowerCase();
    return fallback;
  }

  function syncInputs() {
    controls.themeName.value = state.themeName;
    controls.locationId.value = state.locationId;
    controls.logoUrl.value = state.logoUrl;
    controls.sidebarColor.value = state.sidebarColor;
    controls.sidebarColorText.value = state.sidebarColor;
    controls.accentColor.value = state.accentColor;
    controls.accentColorText.value = state.accentColor;
    controls.navTextColor.value = state.navTextColor;
    controls.navTextColorText.value = state.navTextColor;
    controls.fontFamily.value = state.fontFamily;
    controls.radius.value = state.radius;
    controls.customHiddenIds.value = state.customHiddenIds;

    document.querySelectorAll('#sidebarFinish button').forEach(btn => btn.classList.toggle('active', btn.dataset.value === state.sidebarFinish));
    document.querySelectorAll('#iconStyle button').forEach(btn => btn.classList.toggle('active', btn.dataset.value === state.iconStyle));
    document.querySelectorAll('#menuChecklist input').forEach(box => box.checked = state.hiddenIds.includes(box.value));
  }

  function bindText(id, key) {
    controls[id].addEventListener('input', () => {
      state[key] = controls[id].value;
      changed();
    });
  }

  bindText('themeName', 'themeName');
  bindText('locationId', 'locationId');
  bindText('logoUrl', 'logoUrl');
  bindText('customHiddenIds', 'customHiddenIds');

  controls.fontFamily.addEventListener('change', () => { state.fontFamily = controls.fontFamily.value; changed(); });
  controls.radius.addEventListener('change', () => { state.radius = controls.radius.value; changed(); });

  function bindColor(colorId, textId, key) {
    controls[colorId].addEventListener('input', () => {
      state[key] = controls[colorId].value.toLowerCase();
      controls[textId].value = state[key];
      changed();
    });
    controls[textId].addEventListener('change', () => {
      state[key] = normalizeHex(controls[textId].value, state[key]);
      controls[colorId].value = state[key];
      controls[textId].value = state[key];
      changed();
    });
  }

  bindColor('sidebarColor', 'sidebarColorText', 'sidebarColor');
  bindColor('accentColor', 'accentColorText', 'accentColor');
  bindColor('navTextColor', 'navTextColorText', 'navTextColor');

  document.querySelectorAll('#sidebarFinish button').forEach(btn => btn.addEventListener('click', () => {
    state.sidebarFinish = btn.dataset.value;
    document.querySelectorAll('#sidebarFinish button').forEach(x => x.classList.toggle('active', x === btn));
    changed();
  }));

  document.querySelectorAll('#iconStyle button').forEach(btn => btn.addEventListener('click', () => {
    state.iconStyle = btn.dataset.value;
    document.querySelectorAll('#iconStyle button').forEach(x => x.classList.toggle('active', x === btn));
    changed();
  }));

  document.querySelectorAll('#menuChecklist input').forEach(box => box.addEventListener('change', () => {
    state.hiddenIds = Array.from(document.querySelectorAll('#menuChecklist input:checked')).map(x => x.value);
    changed();
  }));

  document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => switchPanel(btn.dataset.section)));

  function switchPanel(section) {
    document.querySelectorAll('.nav-item').forEach(x => x.classList.toggle('active', x.dataset.section === section));
    document.querySelectorAll('.section-panel').forEach(x => x.classList.toggle('active', x.dataset.panel === section));
    closeMobileNav();
  }

  function changed() {
    saveState();
    renderPreview();
    renderCode();
  }

  function shade(hex, percent) {
    const n = parseInt(hex.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const r = Math.max(0, Math.min(255, (n >> 16) + amt));
    const g = Math.max(0, Math.min(255, ((n >> 8) & 0x00ff) + amt));
    const b = Math.max(0, Math.min(255, (n & 0x0000ff) + amt));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
  }

  function renderPreview() {
    const sidebar = $('mockSidebar');
    const gradientEnd = shade(state.sidebarColor, -20);
    sidebar.style.background = state.sidebarFinish === 'gradient'
      ? `linear-gradient(155deg, ${state.sidebarColor}, ${gradientEnd})`
      : state.sidebarColor;
    sidebar.style.color = state.navTextColor;
    sidebar.style.fontFamily = state.fontFamily === 'system-ui' ? 'system-ui, sans-serif' : `'${state.fontFamily}', sans-serif`;

    document.querySelectorAll('.mock-nav-item').forEach(item => item.style.borderRadius = `${state.radius}px`);
    document.querySelectorAll('.metric, .mock-panel').forEach(item => item.style.borderRadius = `${state.radius}px`);
    document.querySelectorAll('.activity i').forEach(item => item.style.background = state.accentColor);

    const icons = document.querySelectorAll('.mock-icon');
    icons.forEach(icon => {
      icon.style.transform = state.iconStyle === 'compact' ? 'scale(.84)' : 'none';
      icon.style.background = state.iconStyle === 'accent' ? state.accentColor : 'transparent';
      icon.style.color = state.iconStyle === 'accent' ? '#fff' : 'inherit';
    });

    $('previewThemeName').textContent = state.themeName || 'Untitled theme';
    const logo = $('mockLogo');
    const img = logo.querySelector('img');
    const fallback = logo.querySelector('span');
    if (state.logoUrl.trim()) {
      img.src = state.logoUrl.trim();
      img.style.display = 'block';
      fallback.style.display = 'none';
      img.onerror = () => { img.style.display = 'none'; fallback.style.display = 'grid'; };
    } else {
      img.removeAttribute('src');
      img.style.display = 'none';
      fallback.style.display = 'grid';
      fallback.textContent = initials(state.themeName);
    }

    document.querySelector('.optional-launchpad').style.display = isHidden('sb_launchpad') ? 'none' : 'flex';
    document.querySelector('.optional-payments').style.display = isHidden('sb_payments') ? 'none' : 'flex';
  }

  function initials(name) {
    const words = String(name || 'My Agency').trim().split(/\s+/).slice(0,2);
    return words.map(w => w[0] || '').join('').toUpperCase() || 'MA';
  }

  function allHiddenIds() {
    const custom = state.customHiddenIds.split(/\r?\n|,/).map(x => x.trim().replace(/^#/, '')).filter(Boolean);
    return Array.from(new Set([...state.hiddenIds, ...custom]));
  }

  function isHidden(id) { return allHiddenIds().includes(id); }

  function buildCode() {
    const config = {
      name: state.themeName.trim() || 'My Agency',
      locationId: state.locationId.trim(),
      logoUrl: state.logoUrl.trim(),
      sidebarColor: state.sidebarColor,
      accentColor: state.accentColor,
      navTextColor: state.navTextColor,
      fontFamily: state.fontFamily,
      radius: Number(state.radius),
      sidebarFinish: state.sidebarFinish,
      iconStyle: state.iconStyle,
      hiddenMenuIds: allHiddenIds()
    };

    const json = JSON.stringify(config, null, 2);
    return `<script>\n(() => {\n  'use strict';\n\n  const CONFIG = ${json};\n  const STYLE_ID = 'ghl-generated-agency-theme';\n  const FONT_ID = 'ghl-generated-agency-font';\n\n  const escapeCss = (value) => {\n    if (window.CSS && CSS.escape) return CSS.escape(value);\n    return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\\\$&');\n  };\n\n  const activeScope = () => {\n    if (!CONFIG.locationId) return '';\n    return '.' + escapeCss(CONFIG.locationId) + ' ';\n  };\n\n  const colorShade = (hex, percent) => {\n    const n = parseInt(hex.slice(1), 16);\n    const amt = Math.round(2.55 * percent);\n    const r = Math.max(0, Math.min(255, (n >> 16) + amt));\n    const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));\n    const b = Math.max(0, Math.min(255, (n & 255) + amt));\n    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);\n  };\n\n  const addFont = () => {\n    if (CONFIG.fontFamily === 'system-ui' || document.getElementById(FONT_ID)) return;\n    const link = document.createElement('link');\n    link.id = FONT_ID;\n    link.rel = 'stylesheet';\n    link.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(CONFIG.fontFamily).replace(/%20/g, '+') + ':wght@400;500;600;700&display=swap';\n    (document.head || document.documentElement).appendChild(link);\n  };\n\n  const buildCss = () => {\n    const s = activeScope();\n    const sidebarBackground = CONFIG.sidebarFinish === 'gradient'\n      ? 'linear-gradient(155deg, ' + CONFIG.sidebarColor + ', ' + colorShade(CONFIG.sidebarColor, -20) + ')'\n      : CONFIG.sidebarColor;\n    const font = CONFIG.fontFamily === 'system-ui' ? 'system-ui, sans-serif' : '"' + CONFIG.fontFamily + '", sans-serif';\n    const hidden = CONFIG.hiddenMenuIds.map(id => s + '#' + escapeCss(id)).join(',\\n');\n    const logo = CONFIG.logoUrl ? s + '.agency-logo { content: url("' + CONFIG.logoUrl.replace(/"/g, '%22') + '") !important; }' : '';\n    const iconRules = CONFIG.iconStyle === 'compact'\n      ? s + 'nav svg { width: 16px !important; height: 16px !important; }'\n      : CONFIG.iconStyle === 'accent'\n        ? s + 'nav svg { color: ' + CONFIG.accentColor + ' !important; }'\n        : '';\n\n    return [\n      s + '.transition-slowest .flex-col > .overflow-hidden { background: ' + sidebarBackground + ' !important; font-family: ' + font + ' !important; }',\n      s + '.transition-slowest .overflow-x-hidden nav { color: ' + CONFIG.navTextColor + '; }',\n      s + '.transition-slowest .overflow-x-hidden nav a, ' + s + '.transition-slowest .overflow-x-hidden nav button { border-radius: ' + CONFIG.radius + 'px; }',\n      s + '.transition-slowest .overflow-x-hidden nav .nav-title { color: ' + CONFIG.navTextColor + '; }',\n      hidden ? hidden + ' { display: none !important; }' : '',\n      logo,\n      iconRules\n    ].filter(Boolean).join('\\n\\n');\n  };\n\n  const apply = () => {\n    try {\n      addFont();\n      let style = document.getElementById(STYLE_ID);\n      if (!style) {\n        style = document.createElement('style');\n        style.id = STYLE_ID;\n        (document.head || document.documentElement).appendChild(style);\n      }\n      style.textContent = buildCss();\n    } catch (_) {}\n  };\n\n  apply();\n  new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true });\n})();\n<\/script>`;
  }

  function renderCode() {
    $('codeOutput').querySelector('code').textContent = buildCode();
  }

  async function copyCode() {
    const code = buildCode();
    try {
      await navigator.clipboard.writeText(code);
      showToast('Copied to clipboard');
    } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Copied to clipboard');
    }
  }

  function showToast(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  $('copyCodeBtn').addEventListener('click', copyCode);
  $('copyTopBtn').addEventListener('click', () => { switchPanel('code'); copyCode(); });
  $('resetBtn').addEventListener('click', () => {
    state = { ...defaults };
    saveState();
    syncInputs();
    changed();
    showToast('Theme reset');
  });

  const appNav = $('appNav');
  const backdrop = $('navBackdrop');
  $('mobileMenu').addEventListener('click', () => { appNav.classList.add('open'); backdrop.classList.add('show'); });
  backdrop.addEventListener('click', closeMobileNav);
  function closeMobileNav() { appNav.classList.remove('open'); backdrop.classList.remove('show'); }

  syncInputs();
  renderPreview();
  renderCode();
})();
