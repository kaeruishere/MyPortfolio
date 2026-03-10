// ============================================================
// MAIN.JS  — Portfolio entry point
// State, render ve event listener'lar burada.
// ============================================================

import { loadPortfolioData } from './data-service.js';

// ── State ───────────────────────────────────────────────────
export const state = {
    lang: localStorage.getItem('siteLang') || 'en',
    data: null,
    showAllProjects: false,
    activeFilter: 'all',
    selectedProject: null,
};

// ── Boot ────────────────────────────────────────────────────
async function boot() {
    initTheme();
    bindStaticEvents();
    await loadAndRender();
}

async function loadAndRender() {
    showSkeleton(true);
    try {
        state.data = await loadPortfolioData(state.lang);
        render();
    } catch (e) {
        console.error('Data load error:', e);
        showError('Firebase bağlantısı kurulamadı. firebase-config.js dosyasını kontrol edin.');
    } finally {
        showSkeleton(false);
    }
}

// ── Theme ────────────────────────────────────────────────────
function initTheme() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (stored === null && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = document.documentElement.classList.contains('dark') ? 'light_mode' : 'dark_mode';
}

// ── Static Events ─────────────────────────────────────────────
function bindStaticEvents() {
    // Theme
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        updateThemeIcon();
    });

    // Language
    document.getElementById('lang-toggle')?.addEventListener('click', async () => {
        state.lang = state.lang === 'en' ? 'tr' : 'en';
        localStorage.setItem('siteLang', state.lang);
        updateLangBtn();
        await loadAndRender();
    });

    // Mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('hidden');
    });
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => mobileMenu?.classList.add('hidden'));
    });

    // Scroll → navbar shrink + scroll-to-top
    window.addEventListener('scroll', () => {
        const nb = document.getElementById('navbar-container');
        if (nb) {
            nb.classList.toggle('shadow-xl', window.scrollY > 20);
            nb.classList.toggle('py-2', window.scrollY > 20);
        }
        const stt = document.getElementById('scroll-to-top');
        if (stt) {
            stt.classList.toggle('translate-y-20', window.scrollY <= 300);
            stt.classList.toggle('opacity-0', window.scrollY <= 300);
        }
    });
    document.getElementById('scroll-to-top')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Intersection observer for fade-in
    const observer = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.fade-in-on-scroll').forEach(el => observer.observe(el));

    // Admin via hash
    if (window.location.hash === '#admin') {
        document.getElementById('admin-panel')?.classList.remove('hidden');
    }
    document.getElementById('admin-close-btn-login')?.addEventListener('click', () => {
        document.getElementById('admin-panel')?.classList.add('hidden');
        window.location.hash = '';
    });
    document.getElementById('admin-close-btn-sidebar')?.addEventListener('click', () => {
        document.getElementById('admin-panel')?.classList.add('hidden');
        window.location.hash = '';
    });

    // Project modal close
    document.getElementById('project-modal-backdrop')?.addEventListener('click', closeProjectModal);
    document.getElementById('project-modal-close')?.addEventListener('click', closeProjectModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProjectModal(); });
}

function updateLangBtn() {
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = state.lang === 'en' ? 'TR' : 'EN';
}

// ── Render ────────────────────────────────────────────────────
function render() {
    if (!state.data) return;
    const { meta, branding, hero, terminal, nav, sections, footer, education, experience, projects, skills } = state.data;

    // Lang btn
    updateLangBtn();

    // Nav
    setText('nav-about-desktop', nav.about);
    setText('nav-projects-desktop', nav.projects);
    setText('nav-skills-desktop', nav.skills);
    setText('nav-contact-desktop', nav.contact);
    setText('nav-about-mobile', nav.about);
    setText('nav-projects-mobile', nav.projects);
    setText('nav-skills-mobile', nav.skills);
    setText('nav-contact-mobile', nav.contact);

    // Branding
    setText('logo-prefix', branding.logoPrefix);
    setText('logo-suffix', branding.logoSuffix);
    setText('resume-label-desktop', branding.resumeButtonLabel);
    setText('resume-label-mobile', branding.resumeButtonLabel);
    setText('profile-resume-label', branding.resumeButtonLabel);
    bindResumeButtons(branding);

    // Hero
    setText('hero-greeting', hero.greeting);
    setText('hero-firstname', hero.firstName);
    setText('hero-lastname', hero.lastName);
    setText('hero-subtitle', hero.subtitle);
    setText('hero-description', hero.description);
    setText('hero-cta-primary', hero.ctaPrimary);
    setText('hero-cta-secondary', hero.ctaSecondary);
    setHref('hero-cta-primary', `mailto:${meta.contact.email}`);
    setHref('hero-github-link', `https://${meta.contact.github}`);
    setHref('hero-linkedin-link', `https://${meta.contact.linkedin}`);

    // Terminal
    setText('terminal-filename', terminal.fileName);
    renderTerminal(terminal);

    // About
    setText('about-title', sections.aboutTitle);
    setText('about-bio-title', sections.bioTitle);
    setText('about-description', sections.bioText);
    setText('about-edu-title', sections.educationTitle);
    setText('about-work-title', sections.workTitle);

    // Profile card
    const img = document.getElementById('profile-image');
    if (img) img.src = meta.profileImageUrl || 'assets/profile.jpg';
    setText('profile-name', meta.name);
    setText('profile-role', meta.title.split('|')[0].trim());

    // Education & Experience
    renderEducation(education);
    renderExperience(experience);

    // Projects
    setText('projects-title', sections.projectsTitle);
    setText('projects-description', sections.projectsDescription);
    renderProjects(projects, sections);

    // Skills
    setText('skills-title', sections.skillsTitle);
    setText('skills-description', sections.skillsDescription);
    renderSkills(skills);

    // Footer
    setText('footer-title', footer.title);
    setText('footer-subtitle', footer.subtitle);
    setText('back-to-top-label', footer.backToTopLabel);
    setText('footer-name', meta.name);
    setText('current-year', new Date().getFullYear());
    renderSocialLinks(meta.contact);
}

// ── Terminal ─────────────────────────────────────────────────
function renderTerminal(t) {
    const highlight = line =>
        line
            .replace(/\/\/.*/g, '<span class="text-[#7f848e] italic opacity-80">$&</span>')
            .replace(/\b(const|let|var)\b/g, '<span class="text-[#C678DD] font-medium">$&</span>')
            .replace(/'[^']*'/g, '<span class="text-[#98C379]">$&</span>')
            .replace(/\b(true|false|null)\b/g, '<span class="text-[#D19A66]">$&</span>');

    const lines = [
        `// ${t.fileName}`,
        `const ${t.objectName} = {`,
        `  name: '${t.name}',`,
        `  title: '${t.titleField}',`,
        `  location: '${t.location}',`,
        `  stack: [${(t.stack || []).map(s => `'${s}'`).join(', ')}],`,
        `  status: '${t.status}',`,
        `  interests: [${(t.interests || []).map(i => `'${i}'`).join(', ')}]`,
        `};`,
    ];

    const content = document.getElementById('terminal-content');
    if (!content) return;
    content.innerHTML = `
        <div class="space-y-0.5">
            ${lines.map((line, idx) => `
              <div class="min-h-[1.25rem] sm:min-h-[1.5rem] whitespace-pre flex">
                <span class="w-5 sm:w-6 shrink-0 opacity-20 select-none text-right mr-3 sm:mr-4">${idx + 1}</span>
                <span class="block text-[rgb(var(--m3-on-surface))]/60">${highlight(line)}</span>
              </div>
            `).join('')}
        </div>
        <div class="mt-6 flex items-center gap-2 pl-8 sm:pl-10">
            <span class="text-[rgb(var(--m3-primary))] font-bold opacity-40 select-none">$</span>
            <span class="w-1.5 sm:w-2 h-3.5 sm:h-4 bg-[rgb(var(--m3-primary))] shadow-[0_0_12px_rgba(var(--m3-primary),0.6)] animate-pulse rounded-sm"></span>
        </div>`;
}

// ── Education ─────────────────────────────────────────────────
function renderEducation(list) {
    const el = document.getElementById('education-list');
    if (!el) return;
    el.innerHTML = (list || []).map(edu => `
        <div class="space-y-1 group/edu">
            <h4 class="font-bold text-xs sm:text-sm transition-colors group-hover/edu:text-[rgb(var(--m3-primary))] leading-tight">${edu.institution}</h4>
            <p class="text-[10px] sm:text-xs text-[rgb(var(--m3-on-surface))]/50">${edu.degree}</p>
            <div class="flex items-center justify-between pt-1">
                <span class="text-[9px] opacity-40 font-bold">${edu.period}</span>
                ${edu.gpa ? `<span class="text-[9px] font-bold px-2 py-0.5 rounded bg-[rgb(var(--m3-primary))]/10 text-[rgb(var(--m3-primary))]">${edu.gpa} GPA</span>` : ''}
            </div>
        </div>`).join('');
}

// ── Experience ────────────────────────────────────────────────
function renderExperience(list) {
    const el = document.getElementById('experience-list');
    if (!el) return;
    el.innerHTML = (list || []).map(exp => `
        <div class="space-y-1 group/exp">
            <h4 class="font-bold text-xs sm:text-sm transition-colors group-hover/exp:text-[rgb(var(--m3-primary))] leading-tight">${exp.role}</h4>
            <p class="text-[9px] font-bold text-[rgb(var(--m3-primary))]/70">${exp.company}</p>
            <p class="text-[9px] opacity-40">${exp.period}</p>
        </div>`).join('');
}

// ── Projects ─────────────────────────────────────────────────
function renderProjects(allProjects, sections) {
    const visible = (allProjects || []).filter(p => !p.isHidden);

    // Build filter tags
    const categories = ['all', ...new Set(visible.map(p => p.category).filter(Boolean))];
    const filterBar = document.getElementById('project-filters');
    if (filterBar) {
        filterBar.innerHTML = categories.map(cat => `
            <button
                data-filter="${cat}"
                class="filter-btn px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border transition-all
                ${state.activeFilter === cat
                    ? 'bg-[rgb(var(--m3-primary))] text-[rgb(var(--m3-on-primary))] border-transparent'
                    : 'border-[rgb(var(--m3-outline))]/20 text-[rgb(var(--m3-on-surface))]/50 hover:border-[rgb(var(--m3-primary))]/40 hover:text-[rgb(var(--m3-primary))]'}"
            >${cat === 'all' ? (state.lang === 'tr' ? 'Tümü' : 'All') : cat}</button>
        `).join('');
        filterBar.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.activeFilter = btn.dataset.filter;
                renderProjects(allProjects, sections);
            });
        });
    }

    // Filter + slice
    let filtered = state.activeFilter === 'all' ? visible : visible.filter(p => p.category === state.activeFilter);
    const featured = filtered.filter(p => p.featured);
    const rest = filtered.filter(p => !p.featured);

    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    // Featured row
    let html = '';
    if (featured.length > 0 && state.activeFilter === 'all') {
        html += `<div class="col-span-full mb-2">
            <span class="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--m3-primary))]/60">
                <span class="material-symbols-outlined text-sm">star</span>
                ${state.lang === 'tr' ? 'Öne Çıkan' : 'Featured'}
            </span>
        </div>`;
        html += featured.map(p => projectCard(p, true)).join('');
    }

    // Regular projects
    const showAll = state.showAllProjects || state.activeFilter !== 'all';
    const toShow = (state.activeFilter === 'all' ? rest : filtered).slice(0, showAll ? 999 : 3);
    html += toShow.map(p => projectCard(p, false)).join('');
    grid.innerHTML = html;

    // Bind card click → modal
    grid.querySelectorAll('[data-project-id]').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return; // don't intercept link clicks
            const project = allProjects.find(p => p._id === card.dataset.projectId || p.id === card.dataset.projectId);
            if (project) openProjectModal(project);
        });
    });

    // Show more button
    const btn = document.getElementById('show-more-projects-btn');
    const btnWrap = btn?.parentElement;
    if (btnWrap) {
        const hasMore = state.activeFilter === 'all' && rest.length > 3;
        btnWrap.style.display = hasMore ? 'flex' : 'none';
        if (btn) {
            setText('show-more-label', state.showAllProjects ? sections.showLessLabel : sections.showMoreLabel);
            btn.querySelector('.material-symbols-outlined').textContent = state.showAllProjects ? 'expand_less' : 'expand_more';
        }
    }

    // Bind show more
    document.getElementById('show-more-projects-btn')?.addEventListener('click', () => {
        state.showAllProjects = !state.showAllProjects;
        renderProjects(allProjects, sections);
    });
}

function projectCard(project, featured) {
    const id = project._id || project.id || '';
    const imgSrc = project.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(project.title)}/800/500`;
    const techBadges = (project.technologies || []).slice(0, 4).map(t =>
        `<span class="px-2 py-0.5 rounded-lg bg-[rgb(var(--m3-surface-container-high))] text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[rgb(var(--m3-on-surface))]/40 border border-white/5">${t}</span>`
    ).join('');

    const featuredClass = featured
        ? 'md:col-span-2 lg:col-span-1'   // featured takes more space on md
        : '';

    return `
    <div
        data-project-id="${id}"
        class="project-card ${featuredClass} flex flex-col rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden card-modern group cursor-pointer relative"
    >
        ${featured ? `<div class="absolute top-4 left-4 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[rgb(var(--m3-primary))]/90 text-[rgb(var(--m3-on-primary))] text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm">
            <span class="material-symbols-outlined text-[12px]">star</span>
            ${state.lang === 'tr' ? 'Öne Çıkan' : 'Featured'}
        </div>` : ''}

        <!-- Image -->
        <div class="aspect-[16/9] overflow-hidden bg-[rgb(var(--m3-surface-container-high))] relative">
            <img
                src="${imgSrc}"
                alt="${project.title}"
                class="w-full h-full object-cover grayscale-[50%] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                onerror="this.src='https://picsum.photos/seed/${encodeURIComponent(project.title)}/800/500'"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[rgb(var(--m3-surface-container))] via-transparent to-transparent opacity-70"></div>

            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-[rgb(var(--m3-primary))]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span class="material-symbols-outlined text-white text-xl">open_in_new</span>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="p-5 sm:p-7 space-y-3 sm:space-y-4 flex flex-col flex-grow">
            ${project.category ? `<span class="text-[9px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--m3-primary))]/60">${project.category}</span>` : ''}
            <div class="space-y-1.5">
                <h3 class="text-base sm:text-lg font-bold group-hover:text-[rgb(var(--m3-primary))] transition-colors leading-tight">${project.title}</h3>
                <p class="text-[11px] sm:text-xs text-[rgb(var(--m3-on-surface))]/50 leading-relaxed line-clamp-2">${(project.description || [''])[0]}</p>
            </div>
            <div class="flex flex-wrap gap-1.5">${techBadges}</div>
        </div>
    </div>`;
}

// ── Project Modal ─────────────────────────────────────────────
function openProjectModal(project) {
    state.selectedProject = project;
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const imgSrc = project.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(project.title)}/1200/600`;
    const techBadges = (project.technologies || []).map(t =>
        `<span class="px-3 py-1 rounded-lg bg-[rgb(var(--m3-surface-container-high))] text-xs font-bold text-[rgb(var(--m3-on-surface))]/60 border border-white/5">${t}</span>`
    ).join('');
    const descList = (project.description || []).map(d =>
        `<li class="flex gap-3 text-sm text-[rgb(var(--m3-on-surface))]/60 leading-relaxed">
            <span class="text-[rgb(var(--m3-primary))] mt-1 shrink-0">→</span>
            <span>${d}</span>
        </li>`
    ).join('');

    document.getElementById('modal-content').innerHTML = `
        <div class="w-full aspect-[21/9] overflow-hidden rounded-[1rem] mb-6">
            <img src="${imgSrc}" alt="${project.title}" class="w-full h-full object-cover" onerror="this.src='https://picsum.photos/seed/${encodeURIComponent(project.title)}/1200/600'" />
        </div>
        ${project.category ? `<span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--m3-primary))]/60">${project.category}</span>` : ''}
        <h2 class="text-2xl sm:text-3xl font-black mt-1 mb-3">${project.title}</h2>
        <div class="flex flex-wrap gap-2 mb-6">${techBadges}</div>
        <ul class="space-y-3 mb-8">${descList}</ul>
        <div class="flex gap-3">
            ${project.githubUrl ? `
            <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer"
                class="flex-1 py-3 rounded-xl bg-[rgb(var(--m3-surface-container-high))] text-sm font-bold text-center hover:bg-[rgb(var(--m3-primary))] hover:text-white transition-all flex items-center justify-center gap-2 border border-white/5">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                View on GitHub
            </a>` : ''}
            ${project.liveUrl ? `
            <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer"
                class="flex-1 py-3 rounded-xl bg-[rgb(var(--m3-primary))] text-[rgb(var(--m3-on-primary))] text-sm font-bold text-center hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-base">launch</span>
                Live Demo
            </a>` : ''}
        </div>`;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.classList.add('modal-visible'));
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    modal.classList.remove('modal-visible');
    document.body.style.overflow = '';
    setTimeout(() => modal.classList.add('hidden'), 300);
    state.selectedProject = null;
}

// ── Skills ────────────────────────────────────────────────────
function renderSkills(list) {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;
    grid.innerHTML = (list || []).map(group => `
        <div class="p-8 rounded-[2rem] card-modern">
            <div class="flex items-center gap-4 mb-8">
                <div class="w-12 h-12 rounded-2xl bg-[rgb(var(--m3-surface-container-high))] flex items-center justify-center text-[rgb(var(--m3-primary))]/60 border border-white/5">
                    <span class="material-symbols-outlined text-2xl">${group.icon || 'star'}</span>
                </div>
                <h3 class="text-base font-extrabold tracking-tight text-[rgb(var(--m3-on-surface))] opacity-80">${group.category}</h3>
            </div>
            <div class="flex flex-wrap gap-2.5">
                ${(group.items || []).map(skill => `
                    <span class="px-4 py-2 rounded-2xl border border-white/5 bg-[rgb(var(--m3-surface-container-high))]/40 text-xs font-bold text-[rgb(var(--m3-on-surface))]/60 hover:text-[rgb(var(--m3-primary))] hover:border-[rgb(var(--m3-primary))]/20 hover:bg-[rgb(var(--m3-primary))]/5 transition-all cursor-default">${skill}</span>
                `).join('')}
            </div>
        </div>`).join('');
}

// ── Social Links ──────────────────────────────────────────────
function renderSocialLinks(contact) {
    const githubSvg = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
    const linkedinSvg = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;

    const links = [
        { icon: null, svg: `<span class="material-symbols-outlined text-[28px]">mail</span>`, url: `mailto:${contact.email}`, label: 'Email', hover: 'hover:bg-[#EA4335]' },
        { svg: linkedinSvg, url: `https://${contact.linkedin}`, label: 'LinkedIn', hover: 'hover:bg-[#0077B5]' },
        { svg: githubSvg, url: `https://${contact.github}`, label: 'GitHub', hover: 'hover:bg-[#181717]' },
    ];
    if (contact.website) {
        links.push({ svg: `<span class="material-symbols-outlined text-[28px]">language</span>`, url: contact.website, label: 'Website', hover: 'hover:bg-[rgb(var(--m3-primary))]' });
    }

    const el = document.getElementById('social-links');
    if (el) el.innerHTML = links.map(s => `
        <a href="${s.url}" target="_blank" rel="noreferrer"
            class="w-14 h-14 rounded-2xl bg-[rgb(var(--m3-surface-container))] border border-[rgb(var(--m3-outline))]/10 flex items-center justify-center text-[rgb(var(--m3-on-surface))]/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:text-white ${s.hover}" title="${s.label}">
            ${s.svg}
        </a>`).join('');
}

// ── Resume ────────────────────────────────────────────────────
function bindResumeButtons(branding) {
    const ids = ['resume-btn-desktop', 'resume-btn-mobile', 'profile-resume-btn'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const cvBase64 = localStorage.getItem(`cvBase64_${state.lang}`);
        if (cvBase64) {
            el.href = '#';
            el.onclick = e => { e.preventDefault(); downloadCV(); };
        } else {
            el.href = branding.resumeDownloadUrl || '#';
            el.onclick = null;
        }
    });
}

function downloadCV() {
    const cvBase64 = localStorage.getItem(`cvBase64_${state.lang}`);
    if (cvBase64) {
        const byteChars = atob(cvBase64);
        const byteArr = new Uint8Array([...byteChars].map(c => c.charCodeAt(0)));
        const blob = new Blob([byteArr], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement('a'), {
            href: url,
            download: localStorage.getItem(`cvFileName_${state.lang}`) || 'CV.pdf'
        });
        a.click();
        URL.revokeObjectURL(url);
    }
}

// ── Skeleton ─────────────────────────────────────────────────
function showSkeleton(show) {
    const sk = document.getElementById('page-skeleton');
    const main = document.querySelector('main');
    if (sk) sk.style.display = show ? 'flex' : 'none';
    if (main) main.style.opacity = show ? '0' : '1';
}

function showError(msg) {
    const el = document.getElementById('page-error');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
}

// ── Utils ─────────────────────────────────────────────────────
function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val ?? '';
}
function setHref(id, val) {
    const el = document.getElementById(id);
    if (el) el.href = val ?? '#';
}

// ── Start ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', boot);
