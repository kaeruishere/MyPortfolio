// ============================================================
// ADMIN.JS  — Admin panel logic (admin.html için)
// ============================================================

import {
    loadPortfolioData, saveSection, saveArrayItem,
    addArrayItem, deleteArrayItem, reorderArray,
    adminLogin, adminLogout, onAuthChange, fetchGithubRepos, db
} from './data-service.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ── State ─────────────────────────────────────────────────────
const state = {
    lang: localStorage.getItem('siteLang') || 'en',
    data: null,
    activeTab: 'branding',
    user: null,
};

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    bindStaticEvents();

    onAuthChange(user => {
        state.user = user;
        if (user) {
            showDashboard();
        } else {
            showLogin();
        }
    });
});

// ── Theme ─────────────────────────────────────────────────────
function initTheme() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', stored === 'dark' || (stored === null && prefersDark));
}

// ── Auth ──────────────────────────────────────────────────────
function showLogin() {
    document.getElementById('admin-login')?.classList.remove('hidden');
    document.getElementById('admin-dashboard')?.classList.add('hidden');
}

async function showDashboard() {
    document.getElementById('admin-login')?.classList.add('hidden');
    document.getElementById('admin-dashboard')?.classList.remove('hidden');
    await loadData();
}

// ── Static Events ─────────────────────────────────────────────
function bindStaticEvents() {
    // Login form
    document.getElementById('admin-login-form')?.addEventListener('submit', async e => {
        e.preventDefault();
        const email = document.getElementById('admin-email').value;
        const pwd = document.getElementById('admin-password').value;
        const btn = e.target.querySelector('button[type="submit"]');
        btn.textContent = 'Giriş yapılıyor...';
        btn.disabled = true;
        try {
            await adminLogin(email, pwd);
        } catch (err) {
            showAlert('Giriş başarısız: ' + (err.code === 'auth/invalid-credential' ? 'E-posta veya şifre hatalı.' : err.message), 'error');
        } finally {
            btn.textContent = 'Panele Gir';
            btn.disabled = false;
        }
    });

    // Logout
    document.getElementById('admin-logout-btn')?.addEventListener('click', async () => {
        await adminLogout();
    });

    // Language toggle
    document.getElementById('admin-lang-toggle')?.addEventListener('click', async () => {
        state.lang = state.lang === 'en' ? 'tr' : 'en';
        localStorage.setItem('siteLang', state.lang);
        document.getElementById('admin-lang-toggle').textContent = state.lang === 'en' ? 'TR' : 'EN';
        await loadData();
    });

    // Save button (manual)
    document.getElementById('admin-save-btn')?.addEventListener('click', () => {
        saveCurrentTab();
        showToast();
    });
}

// ── Data ─────────────────────────────────────────────────────
async function loadData() {
    const el = document.getElementById('admin-content');
    if (el) el.innerHTML = '<div class="p-8 text-center opacity-40">Yükleniyor...</div>';
    try {
        state.data = await loadPortfolioData(state.lang);
        renderTabs();
        renderContent();
    } catch (e) {
        console.error(e);
        showAlert('Veri yüklenemedi: ' + e.message, 'error');
    }
}

// ── Tabs ─────────────────────────────────────────────────────
const TABS = [
    { id: 'branding',   icon: 'auto_awesome',    label: 'Branding' },
    { id: 'hero',       icon: 'bolt',            label: 'Hero' },
    { id: 'terminal',   icon: 'terminal',        label: 'Terminal' },
    { id: 'contact',    icon: 'contact_mail',    label: 'İletişim' },
    { id: 'about',      icon: 'person',          label: 'Hakkında' },
    { id: 'education',  icon: 'school',          label: 'Eğitim' },
    { id: 'experience', icon: 'work',            label: 'Deneyim' },
    { id: 'projects',   icon: 'code',            label: 'Projeler' },
    { id: 'skills',     icon: 'data_object',     label: 'Yetenekler' },
    { id: 'cv',         icon: 'picture_as_pdf',  label: 'CV / Resume' },
];

function renderTabs() {
    const nav = document.getElementById('admin-nav');
    if (!nav) return;
    nav.innerHTML = TABS.map(tab => `
        <button data-tab="${tab.id}"
            class="tab-btn flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all
            ${state.activeTab === tab.id
                ? 'bg-[rgb(var(--m3-primary))] text-white shadow-lg'
                : 'hover:bg-[rgb(var(--m3-on-surface))]/5 opacity-60 hover:opacity-100'}">
            <span class="material-symbols-outlined text-lg">${tab.icon}</span>
            ${tab.label}
        </button>`).join('');

    nav.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.activeTab = btn.dataset.tab;
            renderTabs();
            renderContent();
            // update title
            const t = TABS.find(t => t.id === state.activeTab);
            const titleEl = document.getElementById('admin-tab-title');
            if (titleEl && t) titleEl.textContent = t.label;
        });
    });
}

// ── Content Renderer ─────────────────────────────────────────
function renderContent() {
    const c = document.getElementById('admin-content');
    if (!c || !state.data) return;

    const { branding, hero, terminal, meta, sections, education, experience, projects, skills } = state.data;

    const inp = (label, val, onChange, type = 'text') => `
        <div class="space-y-2">
            <label class="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">${label}</label>
            <input type="${type}" value="${esc(val)}"
                class="admin-input w-full px-5 py-3.5 rounded-2xl bg-[rgb(var(--m3-surface-container))] border border-transparent outline-none focus:ring-2 focus:ring-[rgb(var(--m3-primary))] transition-all font-medium text-sm"
                oninput="${onChange}"/>
        </div>`;

    const textarea = (label, val, onChange) => `
        <div class="space-y-2">
            <label class="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">${label}</label>
            <textarea rows="3"
                class="admin-input w-full px-5 py-3.5 rounded-2xl bg-[rgb(var(--m3-surface-container))] border border-transparent outline-none focus:ring-2 focus:ring-[rgb(var(--m3-primary))] transition-all font-medium text-sm resize-none"
                oninput="${onChange}">${escTxt(val)}</textarea>
        </div>`;

    const toggle = (label, val, onChange) => `
        <div class="flex items-center justify-between px-5 py-4 rounded-2xl bg-[rgb(var(--m3-surface-container))]">
            <label class="text-sm font-bold">${label}</label>
            <button onclick="${onChange}" class="w-12 h-6 rounded-full transition-all ${val ? 'bg-[rgb(var(--m3-primary))]' : 'bg-[rgb(var(--m3-outline))]/30'} relative">
                <span class="absolute top-1 ${val ? 'right-1' : 'left-1'} w-4 h-4 rounded-full bg-white transition-all shadow"></span>
            </button>
        </div>`;

    const card = (content) => `<div class="p-6 sm:p-8 rounded-[1.5rem] bg-[rgb(var(--m3-surface-container-high))] space-y-5 border border-white/5">${content}</div>`;

    switch (state.activeTab) {
        case 'branding':
            c.innerHTML = card(`
                <h3 class="font-black text-lg mb-2">Branding</h3>
                ${inp('Logo Prefix', branding.logoPrefix, `adminSet('branding','logoPrefix',this.value)`)}
                ${inp('Logo Suffix', branding.logoSuffix, `adminSet('branding','logoSuffix',this.value)`)}
                ${inp('Resume Button Label', branding.resumeButtonLabel, `adminSet('branding','resumeButtonLabel',this.value)`)}
                ${inp('Resume Download URL', branding.resumeDownloadUrl, `adminSet('branding','resumeDownloadUrl',this.value)`)}
            `);
            break;

        case 'hero':
            c.innerHTML = card(`
                <h3 class="font-black text-lg mb-2">Hero Bölümü</h3>
                ${inp('Greeting', hero.greeting, `adminSet('hero','greeting',this.value)`)}
                ${inp('First Name', hero.firstName, `adminSet('hero','firstName',this.value)`)}
                ${inp('Last Name', hero.lastName, `adminSet('hero','lastName',this.value)`)}
                ${inp('Subtitle', hero.subtitle, `adminSet('hero','subtitle',this.value)`)}
                ${textarea('Description', hero.description, `adminSet('hero','description',this.value)`)}
                ${inp('CTA Primary Text', hero.ctaPrimary, `adminSet('hero','ctaPrimary',this.value)`)}
                ${inp('CTA Secondary Text', hero.ctaSecondary, `adminSet('hero','ctaSecondary',this.value)`)}
            `);
            break;

        case 'terminal':
            c.innerHTML = card(`
                <h3 class="font-black text-lg mb-2">Terminal Widget</h3>
                ${inp('File Name', terminal.fileName, `adminSet('terminal','fileName',this.value)`)}
                ${inp('Object Name', terminal.objectName, `adminSet('terminal','objectName',this.value)`)}
                ${inp('Name', terminal.name, `adminSet('terminal','name',this.value)`)}
                ${inp('Title', terminal.titleField, `adminSet('terminal','titleField',this.value)`)}
                ${inp('Location', terminal.location, `adminSet('terminal','location',this.value)`)}
                ${inp('Stack (virgülle ayırın)', (terminal.stack||[]).join(', '), `adminSetArray('terminal','stack',this.value)`)}
                ${inp('Status', terminal.status, `adminSet('terminal','status',this.value)`)}
                ${inp('Interests (virgülle ayırın)', (terminal.interests||[]).join(', '), `adminSetArray('terminal','interests',this.value)`)}
            `);
            break;

        case 'contact':
            c.innerHTML = card(`
                <h3 class="font-black text-lg mb-2">Kişisel Bilgiler</h3>
                ${inp('Full Name', meta.name, `adminMetaSet('name',this.value)`)}
                ${inp('Title', meta.title, `adminMetaSet('title',this.value)`)}
                ${inp('Profil Fotoğrafı URL', meta.profileImageUrl||'', `adminMetaSet('profileImageUrl',this.value)`)}
                <p class="text-[11px] opacity-40 ml-1">Boş bırakırsanız assets/profile.jpg kullanılır.</p>
                <hr class="border-white/5 my-2"/>
                ${inp('Email', meta.contact.email, `adminContactSet('email',this.value)`)}
                ${inp('Phone', meta.contact.phone, `adminContactSet('phone',this.value)`)}
                ${inp('LinkedIn (linkedin.com/in/...)', meta.contact.linkedin, `adminContactSet('linkedin',this.value)`)}
                ${inp('GitHub (github.com/...)', meta.contact.github, `adminContactSet('github',this.value)`)}
                ${inp('Website (opsiyonel)', meta.contact.website||'', `adminContactSet('website',this.value)`)}
            `);
            break;

        case 'about':
            c.innerHTML = card(`
                <h3 class="font-black text-lg mb-2">Hakkında Bölümü</h3>
                ${inp('Section Title', sections.aboutTitle, `adminSectionSet('aboutTitle',this.value)`)}
                ${inp('Bio Card Title', sections.bioTitle, `adminSectionSet('bioTitle',this.value)`)}
                ${textarea('Bio Text', sections.bioText, `adminSectionSet('bioText',this.value)`)}
                ${inp('Education Title', sections.educationTitle, `adminSectionSet('educationTitle',this.value)`)}
                ${inp('Work Title', sections.workTitle, `adminSectionSet('workTitle',this.value)`)}
            `);
            break;

        case 'education':
            c.innerHTML = `<div class="space-y-6">
                <button onclick="adminAddItem('education',{institution:'',degree:'',period:'',gpa:'',_order:${(education||[]).length}})"
                    class="px-6 py-3 rounded-2xl bg-[rgb(var(--m3-primary))] text-white font-bold flex items-center gap-2 hover:opacity-90 transition-all">
                    <span class="material-symbols-outlined">add</span>Eğitim Ekle
                </button>
                ${(education||[]).map((e,i) => card(`
                    <div class="flex justify-between items-center mb-3">
                        <span class="font-black opacity-40 text-lg">#${i+1}</span>
                        <button onclick="adminDeleteItem('education','${e._id}')" class="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20">Sil</button>
                    </div>
                    ${inp('Kurum', e.institution, `adminItemSet('education','${e._id}','institution',this.value)`)}
                    ${inp('Bölüm', e.degree, `adminItemSet('education','${e._id}','degree',this.value)`)}
                    ${inp('Dönem', e.period, `adminItemSet('education','${e._id}','period',this.value)`)}
                    ${inp('GPA (opsiyonel)', e.gpa||'', `adminItemSet('education','${e._id}','gpa',this.value)`)}
                `)).join('')}
            </div>`;
            break;

        case 'experience':
            c.innerHTML = `<div class="space-y-6">
                <button onclick="adminAddItem('experience',{role:'',company:'',period:'',type:'',description:[],_order:${(experience||[]).length}})"
                    class="px-6 py-3 rounded-2xl bg-[rgb(var(--m3-primary))] text-white font-bold flex items-center gap-2 hover:opacity-90 transition-all">
                    <span class="material-symbols-outlined">add</span>Deneyim Ekle
                </button>
                ${(experience||[]).map((e,i) => card(`
                    <div class="flex justify-between items-center mb-3">
                        <span class="font-black opacity-40 text-lg">#${i+1}</span>
                        <button onclick="adminDeleteItem('experience','${e._id}')" class="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20">Sil</button>
                    </div>
                    ${inp('Pozisyon', e.role, `adminItemSet('experience','${e._id}','role',this.value)`)}
                    ${inp('Şirket', e.company, `adminItemSet('experience','${e._id}','company',this.value)`)}
                    ${inp('Dönem', e.period, `adminItemSet('experience','${e._id}','period',this.value)`)}
                    ${inp('Tür', e.type, `adminItemSet('experience','${e._id}','type',this.value)`)}
                    ${textarea('Açıklamalar (her satır bir madde)', (e.description||[]).join('\n'), `adminItemSetArray('experience','${e._id}','description',this.value)`)}
                `)).join('')}
            </div>`;
            break;

        case 'projects':
            c.innerHTML = `<div class="space-y-6">
                <div class="flex flex-wrap gap-3">
                    <button onclick="adminAddItem('projects',{title:'',technologies:[],category:'',featured:false,githubUrl:'',liveUrl:'',imageUrl:'',description:[],isHidden:true,_order:${(projects||[]).length}})"
                        class="px-6 py-3 rounded-2xl bg-[rgb(var(--m3-primary))] text-white font-bold flex items-center gap-2 hover:opacity-90 transition-all">
                        <span class="material-symbols-outlined">add</span>Proje Ekle
                    </button>
                    <button onclick="adminSyncGithub()"
                        class="px-6 py-3 rounded-2xl bg-[#24292e] dark:bg-white dark:text-black text-white font-bold flex items-center gap-2 hover:opacity-80 transition-all">
                        <span class="material-symbols-outlined">sync</span>GitHub'dan Getir
                    </button>
                </div>
                ${(projects||[]).map((p,i) => `
                    <div class="p-6 rounded-[1.5rem] border transition-all space-y-4
                        ${p.isHidden ? 'opacity-60 border-dashed border-white/10 bg-[rgb(var(--m3-surface-container))]' : 'border-white/5 bg-[rgb(var(--m3-surface-container-high))] shadow-md'}">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <span class="font-black opacity-40">#${i+1}</span>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${p.isHidden ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}">${p.isHidden ? 'GİZLİ' : 'GÖRÜNÜR'}</span>
                                ${p.featured ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400">★ Öne Çıkan</span>' : ''}
                            </div>
                            <div class="flex gap-2">
                                <button onclick="adminItemSet('projects','${p._id}','isHidden',${!p.isHidden})"
                                    class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${p.isHidden ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'}">
                                    ${p.isHidden ? 'Göster' : 'Gizle'}
                                </button>
                                <button onclick="adminItemSet('projects','${p._id}','featured',${!p.featured})"
                                    class="px-3 py-1.5 rounded-xl text-xs font-bold bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-all">
                                    ${p.featured ? '★ Öne Çıkarma' : '☆ Öne Çıkar'}
                                </button>
                                <button onclick="adminDeleteItem('projects','${p._id}')" class="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20">Sil</button>
                            </div>
                        </div>
                        ${inp('Başlık', p.title, `adminItemSet('projects','${p._id}','title',this.value)`)}
                        ${inp('Görsel URL (boş = otomatik)', p.imageUrl||'', `adminItemSet('projects','${p._id}','imageUrl',this.value)`)}
                        ${inp('Teknolojiler (virgülle)', (p.technologies||[]).join(', '), `adminItemSetArray('projects','${p._id}','technologies',this.value)`)}
                        ${inp('Kategori (Mobile, Web, Game Dev…)', p.category||'', `adminItemSet('projects','${p._id}','category',this.value)`)}
                        ${inp('GitHub URL', p.githubUrl||'', `adminItemSet('projects','${p._id}','githubUrl',this.value)`)}
                        ${inp('Live URL (opsiyonel)', p.liveUrl||'', `adminItemSet('projects','${p._id}','liveUrl',this.value)`)}
                        ${textarea('Açıklamalar (her satır bir madde)', (p.description||[]).join('\n'), `adminItemSetArray('projects','${p._id}','description',this.value)`)}
                    </div>`).join('')}
            </div>`;
            break;

        case 'skills':
            c.innerHTML = `<div class="space-y-6">
                <button onclick="adminAddItem('skills',{category:'',icon:'star',items:[],_order:${(skills||[]).length}})"
                    class="px-6 py-3 rounded-2xl bg-[rgb(var(--m3-primary))] text-white font-bold flex items-center gap-2 hover:opacity-90">
                    <span class="material-symbols-outlined">add</span>Kategori Ekle
                </button>
                ${(skills||[]).map((s,i) => card(`
                    <div class="flex justify-between items-center mb-3">
                        <span class="font-black opacity-40 text-lg">#${i+1}</span>
                        <button onclick="adminDeleteItem('skills','${s._id}')" class="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20">Sil</button>
                    </div>
                    ${inp('Kategori Adı', s.category, `adminItemSet('skills','${s._id}','category',this.value)`)}
                    ${inp('Icon (Material Symbol adı)', s.icon||'star', `adminItemSet('skills','${s._id}','icon',this.value)`)}
                    ${inp('Yetenekler (virgülle)', (s.items||[]).join(', '), `adminItemSetArray('skills','${s._id}','items',this.value)`)}
                `)).join('')}
            </div>`;
            break;

        case 'cv':
            const cvExists = !!localStorage.getItem(`cvBase64_${state.lang}`);
            c.innerHTML = card(`
                <h3 class="font-black text-lg mb-2">CV / Resume — ${state.lang.toUpperCase()}</h3>
                <p class="text-sm opacity-50 mb-4">Seçenek 1: Doğrudan PDF linki girin (Google Drive, Dropbox vs.)</p>
                ${inp('Resume Download URL', state.data.branding.resumeDownloadUrl||'', `adminSet('branding','resumeDownloadUrl',this.value)`)}
                <hr class="border-white/5 my-2"/>
                <p class="text-sm opacity-50">Seçenek 2: PDF dosyası yükleyin (max ~4MB, tarayıcıda saklanır)</p>
                <input type="file" accept=".pdf" onchange="adminHandleCVUpload(this)"
                    class="w-full px-5 py-3.5 rounded-2xl bg-[rgb(var(--m3-surface-container))] border border-dashed border-[rgb(var(--m3-outline))]/30 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[rgb(var(--m3-primary))] file:text-white file:font-bold file:text-xs cursor-pointer"/>
                ${cvExists
                    ? `<div class="flex items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <span class="text-sm text-green-400 font-bold">✓ PDF yüklü</span>
                        <button onclick="adminRemoveCV()" class="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold">Sil</button>
                       </div>`
                    : `<p class="text-sm opacity-40">Henüz PDF yüklenmedi.</p>`}
            `);
            break;

        default:
            c.innerHTML = `<div class="p-8 text-center opacity-40">Düzenlenecek bölümü seçin.</div>`;
    }
}

// ── Inline update helpers (called from oninput/onclick in HTML) ─
window.adminSet = (section, key, value) => {
    if (!state.data[section]) return;
    state.data[section][key] = value;
    debouncedSave(section, state.data[section]);
};

window.adminSetArray = (section, key, value) => {
    if (!state.data[section]) return;
    state.data[section][key] = value.split(',').map(v => v.trim()).filter(Boolean);
    debouncedSave(section, state.data[section]);
};

window.adminMetaSet = (key, value) => {
    state.data.meta[key] = value;
    debouncedSave('meta', state.data.meta);
};

window.adminContactSet = (key, value) => {
    state.data.meta.contact[key] = value;
    debouncedSave('meta', state.data.meta);
};

window.adminSectionSet = (key, value) => {
    state.data.sections[key] = value;
    debouncedSave('sections', state.data.sections);
};

window.adminItemSet = async (col, id, key, value) => {
    const item = state.data[col]?.find(i => i._id === id);
    if (item) { item[key] = value; }
    await saveArrayItem(state.lang, col, id, { [key]: value });
    // Re-render for toggles (boolean keys)
    if (typeof value === 'boolean') renderContent();
    showToast();
};

window.adminItemSetArray = async (col, id, key, value) => {
    const arr = value.split('\n').map(v => v.trim()).filter(Boolean);
    const item = state.data[col]?.find(i => i._id === id);
    if (item) item[key] = arr;
    await saveArrayItem(state.lang, col, id, { [key]: arr });
    showToast();
};

window.adminAddItem = async (col, item) => {
    const newItem = await addArrayItem(state.lang, col, item);
    if (!state.data[col]) state.data[col] = [];
    state.data[col].push(newItem);
    renderContent();
    showToast();
};

window.adminDeleteItem = async (col, id) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await deleteArrayItem(state.lang, col, id);
    if (state.data[col]) state.data[col] = state.data[col].filter(i => i._id !== id);
    renderContent();
    showToast();
};

window.adminHandleCVUpload = (input) => {
    const file = input.files[0];
    if (!file?.type?.includes('pdf')) return;
    const reader = new FileReader();
    reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        if (base64.length > 5e6) { showAlert('Dosya çok büyük (max ~4MB)', 'error'); return; }
        localStorage.setItem(`cvBase64_${state.lang}`, base64);
        localStorage.setItem(`cvFileName_${state.lang}`, file.name);
        renderContent();
        showToast();
    };
    reader.readAsDataURL(file);
    input.value = '';
};

window.adminRemoveCV = () => {
    localStorage.removeItem(`cvBase64_${state.lang}`);
    localStorage.removeItem(`cvFileName_${state.lang}`);
    renderContent();
};

window.adminSyncGithub = async () => {
    const github = state.data?.meta?.contact?.github;
    if (!github) { showAlert('Önce İletişim bölümüne GitHub adresinizi girin.', 'error'); return; }
    const username = github.replace(/^https?:\/\//, '').replace('github.com/', '').split('/')[0];
    if (!username) { showAlert('Geçersiz GitHub URL.', 'error'); return; }

    const btn = document.querySelector('[onclick="adminSyncGithub()"]');
    if (btn) { btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Syncing...'; btn.disabled = true; }

    try {
        const repos = await fetchGithubRepos(username);
        const existing = state.data.projects || [];
        let added = 0;
        for (const repo of repos) {
            if (repo.fork) continue;
            const dup = existing.find(p =>
                (p.githubUrl && p.githubUrl.toLowerCase().includes(repo.html_url.toLowerCase())) ||
                (p.title && p.title.toLowerCase() === repo.name.toLowerCase())
            );
            if (!dup) {
                await window.adminAddItem('projects', {
                    title: repo.name.replace(/[-_]/g, ' '),
                    technologies: repo.language ? [repo.language] : [],
                    category: 'GitHub',
                    featured: false,
                    githubUrl: repo.html_url,
                    liveUrl: '',
                    imageUrl: '',
                    description: repo.description ? [repo.description] : [],
                    isHidden: true,
                    _order: existing.length + added
                });
                added++;
            }
        }
        showAlert(`${repos.length} repo tarandı, ${added} yeni proje eklendi (varsayılan olarak gizli).`, 'success');
    } catch (e) {
        showAlert('GitHub sync hatası: ' + e.message, 'error');
    } finally {
        if (btn) { btn.innerHTML = '<span class="material-symbols-outlined">sync</span>GitHub\'dan Getir'; btn.disabled = false; }
    }
};

// ── Debounced Save ────────────────────────────────────────────
const saveTimers = {};
function debouncedSave(section, data) {
    clearTimeout(saveTimers[section]);
    saveTimers[section] = setTimeout(async () => {
        await saveSection(state.lang, section, data);
        showToast();
    }, 600);
}

async function saveCurrentTab() {
    if (!state.data) return;
    const sectionMap = {
        branding: 'branding', hero: 'hero', terminal: 'terminal',
        contact: 'meta', about: 'sections',
        footer: 'footer'
    };
    const section = sectionMap[state.activeTab];
    if (section) {
        await saveSection(state.lang, section, state.data[section]);
    }
}

// ── Toast / Alert ─────────────────────────────────────────────
function showToast() {
    const toast = document.getElementById('save-toast');
    if (!toast) return;
    toast.classList.remove('opacity-0', 'translate-y-4');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.add('opacity-0', 'translate-y-4'), 2000);
}

function showAlert(msg, type = 'success') {
    const el = document.getElementById('admin-alert');
    if (!el) { alert(msg); return; }
    el.textContent = msg;
    el.className = `fixed top-6 left-1/2 -translate-x-1/2 z-[120] px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all ${type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`;
    el.style.opacity = '1';
    clearTimeout(showAlert._t);
    showAlert._t = setTimeout(() => { el.style.opacity = '0'; }, 3000);
}

// ── Escape helpers ────────────────────────────────────────────
function esc(val) { return (val ?? '').toString().replace(/"/g, '&quot;').replace(/&/g, '&amp;'); }
function escTxt(val) { return (val ?? '').toString().replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
