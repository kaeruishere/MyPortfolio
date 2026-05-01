// ── i18n.js ──────────────────────────────────────────────────
// Aktif dili yönetir. Her element data-i18n-key="..." ile işaretlenir.
// Firestore verisi çekildikten sonra renderer.js bu modülü kullanır.

const LANG_KEY = 'portfolio_lang';

let currentLang = localStorage.getItem(LANG_KEY) || 'tr';
let onChangeFn = null;

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (lang !== 'tr' && lang !== 'en') return;
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.setAttribute('lang', lang);
  if (onChangeFn) onChangeFn(lang);
}

export function toggleLang() {
  setLang(currentLang === 'tr' ? 'en' : 'tr');
}

export function onLangChange(fn) {
  onChangeFn = fn;
}

// Bir objeden aktif dil değerini al
// { title_tr: "...", title_en: "..." } → aktif dile göre döner
export function t(obj, field) {
  if (!obj) return '';
  const key = `${field}_${currentLang}`;
  return obj[key] ?? obj[field] ?? '';
}

// Sadece string: { tr: "...", en: "..." } objesi için
export function tObj(obj) {
  if (!obj) return '';
  return obj[currentLang] ?? obj['tr'] ?? '';
}

// Nav linkleri ve static UI metinleri (Firestore'dan gelmiyor, bu dosyada)
export const UI_STRINGS = {
  tr: {
    nav_about: 'hakkımda',
    nav_skills: 'beceriler',
    nav_projects: 'projeler',
    nav_experience: 'deneyim',
    nav_education: 'eğitim',
    nav_contact: 'iletişim',
    hero_cta: 'projelerime bak',
    hero_cv: 'CV indir',
    hero_scroll: 'kaydır',
    about_label: 'hakkımda',
    skills_label: 'beceriler',
    projects_label: 'projeler',
    exp_label: 'deneyim',
    edu_label: 'eğitim',
    contact_label: 'iletişim',
    contact_cta: 'iletişime geç',
    project_live: 'canlı',
    project_code: 'kod',
    exp_current: 'devam ediyor',
    footer_made: 'ile yapıldı',
  },
  en: {
    nav_about: 'about',
    nav_skills: 'skills',
    nav_projects: 'projects',
    nav_experience: 'experience',
    nav_education: 'education',
    nav_contact: 'contact',
    hero_cta: 'see my projects',
    hero_cv: 'download cv',
    hero_scroll: 'scroll',
    about_label: 'about me',
    skills_label: 'skills',
    projects_label: 'projects',
    exp_label: 'experience',
    edu_label: 'education',
    contact_label: 'contact',
    contact_cta: 'contact me',
    project_live: 'live',
    project_code: 'code',
    exp_current: 'present',
    footer_made: 'made with',
  }
};

export function ui(key) {
  return UI_STRINGS[currentLang]?.[key] ?? UI_STRINGS['tr'][key] ?? key;
}
