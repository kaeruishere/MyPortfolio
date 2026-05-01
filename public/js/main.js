// ── main.js ──────────────────────────────────────────────────
// Uygulama başlangıç noktası.
// Firebase'den veri çeker, render eder, event'leri bağlar.

import { initTheme, toggleTheme } from './theme.js';
import { getLang, setLang, toggleLang, onLangChange, ui } from './i18n.js';
import { fetchPortfolioData } from './dataService.js';
import { renderAll } from './renderer.js';
import { initChat } from './chat.js';

// ── Init ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initChat();
});

async function init() {
  // 1. Temayı uygula (flash'ı önlemek için erken)
  initTheme();

  // 2. HTML lang attribute'u ayarla
  document.documentElement.setAttribute('lang', getLang());

  try {
    // 3. Firestore'dan veri çek
    const data = await fetchPortfolioData();

    // 4. DOM'a render et
    renderAll(data);

    // 5. Event listener'ları bağla
    bindEvents(data);

    // 6. Scroll observer başlat
    initRevealObserver();

    // 7. Nav scroll davranışı
    initNavScroll();

    // 8. Active nav link takibi
    initNavActive();

  } catch (err) {
    console.error('Veri yüklenirken hata:', err);
    showError();
  } finally {
    // 9. Loader'ı kaldır
    hideLoader();
  }
}

// ── Loader ───────────────────────────────────────────────────

function hideLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  loader.classList.add('hidden');
  setTimeout(() => loader.remove(), 600);
}

function showError() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.innerHTML = `
      <div style="text-align:center; font-family: var(--font-mono); color: var(--text-secondary);">
        <p style="margin-bottom:8px; font-size:0.8rem; letter-spacing:0.1em;">veri yüklenemedi</p>
        <p style="font-size:0.7rem; color: var(--text-muted);">firebase bağlantını kontrol et</p>
      </div>`;
  }
}

// ── Events ───────────────────────────────────────────────────

function bindEvents(data) {
  // Tema toggle
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Dil toggle
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      toggleLang();
      langBtn.textContent = getLang() === 'tr' ? 'EN' : 'TR';
    });
  }

  // Dil değişince yeniden render
  onLangChange(() => {
    renderAll(data);
    initRevealObserver(); // yeni DOM elemanları için
  });

  // Hamburger menü
  const hamburger = document.getElementById('nav-hamburger');
  const navList = document.getElementById('nav-list');
  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('mobile-open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Menü linkine tıklayınca kapat
    navList.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navList.classList.remove('mobile-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Dışarı tıklayınca kapat
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navList.contains(e.target)) {
        navList.classList.remove('mobile-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// ── Scroll Reveal Observer ────────────────────────────────────

function initRevealObserver() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

// ── Nav Scroll Behavior ───────────────────────────────────────

function initNavScroll() {
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  if (!navbar) return;

  const onScroll = () => {
    const scrollY = window.scrollY;

    // Navbar scroll effect
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (backToTop) {
      if (scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  };

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check
}

// ── Active Nav Link ───────────────────────────────────────────

function initNavActive() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#nav-list a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => observer.observe(section));
}

// ── Start ─────────────────────────────────────────────────────

init();
