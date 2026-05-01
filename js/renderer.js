// ── renderer.js ──────────────────────────────────────────────
// Firestore'dan gelen data objesini DOM'a render eder.

import { getLang, t, tObj, ui } from './i18n.js';

// ── Helpers ──────────────────────────────────────────────────

function el(id) { return document.getElementById(id); }

function svg(path, size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    ${path}</svg>`;
}

const ICONS = {
  arrow:    '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  github:   '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  mail:     '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  location: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  link:     '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  user:     '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const lang = getLang();
    return d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

// ── Nav ──────────────────────────────────────────────────────

export function renderNav(data) {
  const logo = el('nav-logo');
  if (logo) logo.textContent = data.meta?.nav_logo || '~';

  const links = [
    { href: '#about',      key: 'nav_about' },
    { href: '#skills',     key: 'nav_skills' },
    { href: '#projects',   key: 'nav_projects' },
    { href: '#education',  key: 'nav_education' },
    { href: '#experience', key: 'nav_experience' },
    { href: '#contact',    key: 'nav_contact' },
  ];

  const navList = el('nav-list');
  if (navList) {
    navList.innerHTML = links.map(l =>
      `<li><a href="${l.href}">${ui(l.key)}</a></li>`
    ).join('');
  }

  const langBtn = el('lang-toggle');
  if (langBtn) langBtn.textContent = getLang() === 'tr' ? 'EN' : 'TR';
}

// ── Hero ─────────────────────────────────────────────────────

export function renderHero(data) {
  const m = data.meta || {};

  const eyebrow = el('hero-eyebrow');
  if (eyebrow) eyebrow.textContent = t(m, 'eyebrow') || (getLang() === 'tr' ? 'merhaba, ben' : 'hello, I\'m');

  const name = el('hero-name');
  if (name) name.textContent = m.name || '';

  const title = el('hero-title');
  if (title) title.textContent = t(m, 'title') || '';

  const desc = el('hero-desc');
  if (desc) desc.textContent = t(m, 'desc') || '';

  const ctaProjects = el('hero-cta-projects');
  if (ctaProjects) {
    ctaProjects.innerHTML = `${ui('hero_cta')} ${svg(ICONS.arrow)}`;
    ctaProjects.href = '#projects';
  }

  const ctaCv = el('hero-cta-cv');
  if (ctaCv && m.cv_url) {
    ctaCv.innerHTML = `${svg(ICONS.download)} ${ui('hero_cv')}`;
    ctaCv.href = m.cv_url;
    ctaCv.target = '_blank';
    ctaCv.style.display = '';
  } else if (ctaCv) {
    ctaCv.style.display = 'none';
  }

  const scrollLabel = el('hero-scroll-label');
  if (scrollLabel) scrollLabel.textContent = ui('hero_scroll');
}

// ── About ────────────────────────────────────────────────────

export function renderAbout(data) {
  const a = data.about || {};

  const label = el('about-label');
  if (label) label.textContent = ui('about_label');

  const photo = el('about-photo');
  if (photo) {
    if (a.photo_url) {
      photo.innerHTML = `<img class="about-photo" src="${a.photo_url}" alt="${data.meta?.name || ''}" loading="lazy">`;
    } else {
      photo.innerHTML = `<div class="about-photo-placeholder">${svg(ICONS.user, 64)}</div>`;
    }
  }

  const text = el('about-text-content');
  if (text) text.textContent = t(a, 'text') || '';

  // CV Butonu
  const cvBtn = el('about-cv-btn');
  const cvUrl = t(data.meta || {}, 'cv_url');
  if (cvBtn && cvUrl) {
    cvBtn.innerHTML = `${svg(ICONS.download)} ${ui('hero_cv')}`;
    cvBtn.href = cvUrl;
    cvBtn.target = '_blank';
    cvBtn.style.display = 'inline-flex';
  } else if (cvBtn) {
    cvBtn.style.display = 'none';
  }
}

// ── Skills ───────────────────────────────────────────────────

export function renderSkills(data) {
  const label = el('skills-label');
  if (label) label.textContent = ui('skills_label');

  const grid = el('skills-grid');
  if (!grid) return;

  // Kategoriye göre grupla
  const categories = {};
  (data.skills || []).forEach(s => {
    const cat = t(s, 'category') || s.category || 'Diğer';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(s);
  });

  grid.innerHTML = Object.entries(categories).map(([cat, items]) => `
    <div class="skill-category reveal">
      <div class="skill-category-name">${cat}</div>
      <div class="skill-items">
        ${items.map(s => `<div class="skill-item">${s.name}</div>`).join('')}
      </div>
    </div>
  `).join('');
}

// ── Projects ─────────────────────────────────────────────────

export function renderProjects(data) {
  const label = el('projects-label');
  if (label) label.textContent = ui('projects_label');

  const grid = el('projects-grid');
  if (!grid) return;

  grid.innerHTML = (data.projects || []).map(p => {
    const isFeatured = p.featured ? 'featured' : '';
    const thumbnail = p.image_url
      ? `<img class="project-thumbnail" src="${p.image_url}" alt="${t(p, 'title')}" loading="lazy">`
      : `<div class="project-thumbnail-placeholder">${svg(ICONS.link, 32)}</div>`;

    const tags = (p.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');
    const liveLink = p.live_url ? `<a class="project-link" href="${p.live_url}" target="_blank">${svg(ICONS.external, 13)} ${ui('project_live')}</a>` : '';
    const codeLink = p.github_url ? `<a class="project-link" href="${p.github_url}" target="_blank">${svg(ICONS.github, 13)} ${ui('project_code')}</a>` : '';

    return `
      <article class="project-card ${isFeatured} reveal">
        ${thumbnail}
        <div class="project-body">
          <div class="project-tags">${tags}</div>
          <h3>${t(p, 'title')}</h3>
          <p>${t(p, 'desc')}</p>
          <div class="project-links">${liveLink}${codeLink}</div>
        </div>
      </article>
    `;
  }).join('');
}

// ── Experience ───────────────────────────────────────────────

export function renderExperience(data) {
  const label = el('experience-label');
  if (label) label.textContent = ui('exp_label');

  const list = el('experience-list');
  if (!list) return;

  list.innerHTML = (data.experience || []).map(e => {
    const endDate = e.current
      ? ui('exp_current')
      : formatDate(e.end_date);
    const startDate = formatDate(e.start_date);
    const dotClass = e.current ? 'exp-dot current' : 'exp-dot';

    return `
      <div class="exp-item reveal">
        <div class="${dotClass}"></div>
        <div class="exp-content">
          <div class="exp-header">
            <div class="exp-role">${t(e, 'role')}</div>
            <div class="exp-date">${startDate} — ${endDate}</div>
          </div>
          <div class="exp-company">${e.company}</div>
          <p class="exp-desc">${t(e, 'desc')}</p>
        </div>
      </div>
    `;
  }).join('');
}

// ── Education ────────────────────────────────────────────────

export function renderEducation(data) {
  const label = el('education-label');
  if (label) label.textContent = ui('edu_label');

  const list = el('education-list');
  if (!list) return;

  list.innerHTML = (data.education || []).map(e => {
    return `
      <div class="exp-item reveal">
        <div class="exp-dot"></div>
        <div class="exp-content">
          <div class="exp-header">
            <div class="exp-role">${e.school}</div>
            <div class="exp-date">${e.start_date || ''} — ${e.end_date || ''}</div>
          </div>
          <div class="exp-company">${t(e, 'degree')}</div>
          ${e.grade ? `<p class="exp-desc" style="margin-top:4px; font-family:var(--font-mono); font-size:0.75rem; color:var(--accent);">GANO: ${e.grade}</p>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ── Contact ──────────────────────────────────────────────────

export function renderContact(data) {
  const c = data.contact || {};
  const m = data.meta || {};

  const label = el('contact-label');
  if (label) label.textContent = ui('contact_label');

  const cta = el('contact-cta-title');
  if (cta) cta.textContent = ui('contact_cta');

  const desc = el('contact-desc');
  if (desc) desc.textContent = t(c, 'desc') || '';

  const details = el('contact-details');
  if (details) {
    const email = c.email ? `
      <div class="contact-detail-item">
        <div class="contact-detail-icon">${svg(ICONS.mail, 15)}</div>
        <a href="mailto:${c.email}">${c.email}</a>
      </div>` : '';

    const loc = t(c, 'location') ? `
      <div class="contact-detail-item">
        <div class="contact-detail-icon">${svg(ICONS.location, 15)}</div>
        <span>${t(c, 'location')}</span>
      </div>` : '';

    details.innerHTML = email + loc;
  }

  // Sosyal linkler
  const socials = el('contact-socials');
  if (socials && m.socials) {
    const socialDefs = [
      { key: 'github',   icon: ICONS.github,   label: 'GitHub' },
      { key: 'linkedin', icon: ICONS.link,      label: 'LinkedIn' },
      { key: 'twitter',  icon: ICONS.external,  label: 'Twitter' },
    ];
    socials.innerHTML = socialDefs
      .filter(s => m.socials[s.key])
      .map(s => `<a class="social-link" href="${m.socials[s.key]}" target="_blank" aria-label="${s.label}">${svg(s.icon, 16)}</a>`)
      .join('');
  }
}

// ── Footer ───────────────────────────────────────────────────

export function renderFooter(data) {
  const copy = el('footer-copy');
  if (copy) {
    const name = data.meta?.name || '';
    const year = new Date().getFullYear();
    copy.innerHTML = `© ${year} <span>${name}</span>`;
  }
}

// ── Full render ──────────────────────────────────────────────

export function renderAll(data) {
  renderNav(data);
  renderHero(data);
  renderAbout(data);
  renderSkills(data);
  renderProjects(data);
  renderEducation(data);
  renderExperience(data);
  renderContact(data);
  renderFooter(data);
}
