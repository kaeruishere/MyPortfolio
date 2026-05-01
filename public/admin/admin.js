// ── admin.js ─────────────────────────────────────────────────
// Firebase Auth korumalı admin CRUD paneli.

import { auth, db } from '../js/firebase.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  doc, getDoc, setDoc, collection,
  getDocs, addDoc, updateDoc, deleteDoc,
  orderBy, query
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { clearCache } from '../js/dataService.js';

// ── Auth ─────────────────────────────────────────────────────

const authGate = document.getElementById('auth-gate');
const adminPanel = document.getElementById('admin-panel');

onAuthStateChanged(auth, (user) => {
  if (user) {
    authGate.style.display = 'none';
    adminPanel.style.display = 'flex';
    loadAllData();
  } else {
    authGate.style.display = 'flex';
    adminPanel.style.display = 'none';
  }
});

document.getElementById('auth-login-btn').addEventListener('click', async () => {
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const errorEl = document.getElementById('auth-error');
  errorEl.style.display = 'none';

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    errorEl.textContent = authErrorMessage(err.code);
    errorEl.style.display = 'block';
  }
});

document.getElementById('auth-password').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('auth-login-btn').click();
});

document.getElementById('admin-logout-btn').addEventListener('click', () => {
  signOut(auth);
});

function authErrorMessage(code) {
  const map = {
    'auth/invalid-credential': 'E-posta veya şifre hatalı.',
    'auth/user-not-found': 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.',
    'auth/wrong-password': 'Şifre hatalı.',
    'auth/too-many-requests': 'Çok fazla deneme. Lütfen bekle.',
    'auth/network-request-failed': 'Bağlantı hatası.',
  };
  return map[code] || 'Giriş başarısız. Tekrar dene.';
}

// ── Tab Navigation ────────────────────────────────────────────

document.querySelectorAll('.sidebar-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// ── Toast ─────────────────────────────────────────────────────

function showToast(msg, type = 'success') {
  const toast = document.getElementById('admin-toast');
  toast.textContent = msg;
  toast.className = `admin-toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Load All ──────────────────────────────────────────────────

async function loadAllData() {
  await Promise.all([
    loadMeta(),
    loadAbout(),
    loadSkills(),
    loadProjects(),
    loadExperience(),
    loadEducation(),
    loadContact(),
  ]);
}

// ── META ─────────────────────────────────────────────────────

async function loadMeta() {
  const snap = await getDoc(doc(db, 'portfolio', 'meta'));
  if (!snap.exists()) return;
  const d = snap.data();
  document.getElementById('meta-name').value = d.name || '';
  document.getElementById('meta-nav-logo').value = d.nav_logo || '';
  document.getElementById('meta-eyebrow-tr').value = d.eyebrow_tr || '';
  document.getElementById('meta-eyebrow-en').value = d.eyebrow_en || '';
  document.getElementById('meta-title-tr').value = d.title_tr || '';
  document.getElementById('meta-title-en').value = d.title_en || '';
  document.getElementById('meta-desc-tr').value = d.desc_tr || '';
  document.getElementById('meta-desc-en').value = d.desc_en || '';
  document.getElementById('meta-cv-url-tr').value = d.cv_url_tr || '';
  document.getElementById('meta-cv-url-en').value = d.cv_url_en || '';
  document.getElementById('meta-github').value = d.socials?.github || '';
  document.getElementById('meta-linkedin').value = d.socials?.linkedin || '';
  document.getElementById('meta-twitter').value = d.socials?.twitter || '';
}

document.getElementById('save-meta').addEventListener('click', async () => {
  const data = {
    name: val('meta-name'),
    nav_logo: val('meta-nav-logo'),
    eyebrow_tr: val('meta-eyebrow-tr'),
    eyebrow_en: val('meta-eyebrow-en'),
    title_tr: val('meta-title-tr'),
    title_en: val('meta-title-en'),
    desc_tr: val('meta-desc-tr'),
    desc_en: val('meta-desc-en'),
    cv_url_tr: val('meta-cv-url-tr'),
    cv_url_en: val('meta-cv-url-en'),
    socials: {
      github: val('meta-github'),
      linkedin: val('meta-linkedin'),
      twitter: val('meta-twitter'),
    }
  };
  await saveDoc('portfolio', 'meta', data);
});

// ── ABOUT ─────────────────────────────────────────────────────

async function loadAbout() {
  const snap = await getDoc(doc(db, 'portfolio', 'about'));
  if (!snap.exists()) return;
  const d = snap.data();
  document.getElementById('about-photo-url').value = d.photo_url || '';
  document.getElementById('about-text-tr').value = d.text_tr || '';
  document.getElementById('about-text-en').value = d.text_en || '';
}

document.getElementById('save-about').addEventListener('click', async () => {
  const data = {
    photo_url: val('about-photo-url'),
    text_tr: val('about-text-tr'),
    text_en: val('about-text-en'),
  };
  await saveDoc('portfolio', 'about', data);
});

// ── SKILLS ───────────────────────────────────────────────────

let skillsData = [];

async function loadSkills() {
  const snap = await getDocs(query(collection(db, 'skills'), orderBy('order', 'asc')));
  skillsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderSkillsList();
}

function renderSkillsList() {
  const list = document.getElementById('skills-list');
  if (!skillsData.length) {
    list.innerHTML = '<p class="empty-state">Henüz beceri eklenmemiş.</p>';
    return;
  }
  list.innerHTML = skillsData.map(s => `
    <div class="list-item">
      <div class="list-item-info">
        <span class="list-item-title">${s.name_tr || s.name_en || s.name || 'İsimsiz Beceri'}</span>
        <span class="list-item-sub">${s.category_tr || s.category_en || s.category || ''}</span>
      </div>
      <div class="list-item-actions">
        <button class="btn-icon btn-edit" data-id="${s.id}">düzenle</button>
        <button class="btn-icon danger btn-delete" data-id="${s.id}">sil</button>
      </div>
    </div>
  `).join('');
}

// Event Delegation for Skills List
document.getElementById('skills-list').addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains('btn-edit')) {
    editSkill(id);
  } else if (e.target.classList.contains('btn-delete')) {
    deleteSkill(id);
  }
});

document.getElementById('add-skill-btn').addEventListener('click', () => openSkillModal());
document.getElementById('skill-modal-close').addEventListener('click', closeSkillModal);
document.getElementById('skill-modal-cancel').addEventListener('click', closeSkillModal);

function openSkillModal(skill = null) {
  document.getElementById('skill-modal-title').textContent = skill ? 'Beceri Düzenle' : 'Beceri Ekle';
  document.getElementById('skill-name-tr').value = skill?.name_tr || skill?.name || '';
  document.getElementById('skill-name-en').value = skill?.name_en || skill?.name || '';
  document.getElementById('skill-category-tr').value = skill?.category_tr || '';
  document.getElementById('skill-category-en').value = skill?.category_en || '';
  document.getElementById('skill-order').value = skill?.order ?? '';
  document.getElementById('skill-edit-id').value = skill?.id || '';
  document.getElementById('skill-modal').style.display = 'flex';
}

function closeSkillModal() {
  document.getElementById('skill-modal').style.display = 'none';
}

function editSkill(id) {
  const s = skillsData.find(x => x.id === id);
  if (s) openSkillModal(s);
}

async function deleteSkill(id) {
  if (!confirm('Bu beceriyi silmek istediğine emin misin?')) return;
  await deleteDoc(doc(db, 'skills', id));
  clearCache();
  showToast('Beceri silindi.');
  await loadSkills();
}

document.getElementById('skill-save-btn').addEventListener('click', async () => {
  const id = val('skill-edit-id');
  const data = {
    name_tr: val('skill-name-tr'),
    name_en: val('skill-name-en'),
    category_tr: val('skill-category-tr'),
    category_en: val('skill-category-en'),
    order: Number(val('skill-order')) || 0,
  };
  if (id) {
    await updateDoc(doc(db, 'skills', id), data);
  } else {
    await addDoc(collection(db, 'skills'), data);
  }
  clearCache();
  showToast('Beceri kaydedildi.');
  closeSkillModal();
  await loadSkills();
});

// ── PROJECTS ──────────────────────────────────────────────────

let projectsData = [];

async function loadProjects() {
  const snap = await getDocs(query(collection(db, 'projects'), orderBy('order', 'asc')));
  projectsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderProjectsList();
}

function renderProjectsList() {
  const list = document.getElementById('projects-list');
  if (!projectsData.length) {
    list.innerHTML = '<p class="empty-state">Henüz proje eklenmemiş.</p>';
    return;
  }
  list.innerHTML = projectsData.map(p => `
    <div class="list-item">
      <div class="list-item-info">
        <span class="list-item-title">${p.title_tr || p.title_en || '—'}</span>
        <span class="list-item-sub">${(p.tags || []).join(', ')}</span>
      </div>
      <div class="list-item-actions">
        <button class="btn-icon btn-edit" data-id="${p.id}">düzenle</button>
        <button class="btn-icon danger btn-delete" data-id="${p.id}">sil</button>
      </div>
    </div>
  `).join('');
}

// Event Delegation for Projects List
document.getElementById('projects-list').addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains('btn-edit')) {
    editProject(id);
  } else if (e.target.classList.contains('btn-delete')) {
    deleteProject(id);
  }
});

document.getElementById('add-project-btn').addEventListener('click', () => openProjectModal());
document.getElementById('project-modal-close').addEventListener('click', closeProjectModal);
document.getElementById('project-modal-cancel').addEventListener('click', closeProjectModal);

function openProjectModal(p = null) {
  document.getElementById('project-modal-title').textContent = p ? 'Proje Düzenle' : 'Proje Ekle';
  document.getElementById('project-title-tr').value = p?.title_tr || '';
  document.getElementById('project-title-en').value = p?.title_en || '';
  document.getElementById('project-desc-tr').value = p?.desc_tr || '';
  document.getElementById('project-desc-en').value = p?.desc_en || '';
  document.getElementById('project-image-url').value = p?.image_url || '';
  document.getElementById('project-live-url').value = p?.live_url || '';
  document.getElementById('project-github-url').value = p?.github_url || '';
  document.getElementById('project-tags').value = (p?.tags || []).join(', ');
  document.getElementById('project-order').value = p?.order ?? '';
  document.getElementById('project-featured').checked = p?.featured || false;
  document.getElementById('project-edit-id').value = p?.id || '';
  document.getElementById('project-modal').style.display = 'flex';
}

function closeProjectModal() {
  document.getElementById('project-modal').style.display = 'none';
}

function editProject(id) {
  const p = projectsData.find(x => x.id === id);
  if (p) openProjectModal(p);
}

async function deleteProject(id) {
  if (!confirm('Bu projeyi silmek istediğine emin misin?')) return;
  await deleteDoc(doc(db, 'projects', id));
  clearCache();
  showToast('Proje silindi.');
  await loadProjects();
}

document.getElementById('project-save-btn').addEventListener('click', async () => {
  const id = val('project-edit-id');
  const tags = val('project-tags').split(',').map(t => t.trim()).filter(Boolean);
  const data = {
    title_tr: val('project-title-tr'),
    title_en: val('project-title-en'),
    desc_tr: val('project-desc-tr'),
    desc_en: val('project-desc-en'),
    image_url: val('project-image-url'),
    live_url: val('project-live-url'),
    github_url: val('project-github-url'),
    tags,
    order: Number(val('project-order')) || 0,
    featured: document.getElementById('project-featured').checked,
  };
  if (id) {
    await updateDoc(doc(db, 'projects', id), data);
  } else {
    await addDoc(collection(db, 'projects'), data);
  }
  clearCache();
  showToast('Proje kaydedildi.');
  closeProjectModal();
  await loadProjects();
});

// ── GITHUB IMPORT ─────────────────────────────────────────────

const ghImporter = document.getElementById('github-importer');
const ghList = document.getElementById('github-repos-list');

document.getElementById('github-fetch-trigger').addEventListener('click', () => {
  ghImporter.style.display = ghImporter.style.display === 'none' ? 'block' : 'none';
  // Varsa meta'daki github kullanıcı adını otomatik doldur
  const ghUrl = document.getElementById('meta-github').value;
  if (ghUrl && !document.getElementById('github-username').value) {
    const user = ghUrl.split('/').pop();
    document.getElementById('github-username').value = user;
  }
});

document.getElementById('github-import-close').addEventListener('click', () => {
  ghImporter.style.display = 'none';
});

document.getElementById('github-fetch-btn').addEventListener('click', async () => {
  const user = document.getElementById('github-username').value.trim();
  if (!user) return showToast('Lütfen bir kullanıcı adı gir.', 'error');

  ghList.innerHTML = '<p style="padding:20px; text-align:center; opacity:0.5;">yükleniyor...</p>';

  try {
    const res = await fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=50`);
    if (!res.ok) throw new Error('Kullanıcı bulunamadı');
    const repos = await res.json();

    ghList.innerHTML = repos.map(r => `
      <div class="list-item">
        <div class="list-item-info">
          <span class="list-item-title">${r.name}</span>
          <span class="list-item-sub">${r.description || 'Açıklama yok'}</span>
        </div>
        <button class="btn btn-outline btn-sm" onclick="importRepo(${JSON.stringify({
          title: r.name,
          desc: r.description || '',
          url: r.html_url,
          lang: r.language
        }).replace(/"/g, '&quot;')})">aktar</button>
      </div>
    `).join('');
  } catch (err) {
    ghList.innerHTML = `<p style="padding:20px; text-align:center; color:#ff6b6b;">Hata: ${err.message}</p>`;
  }
});

window.importRepo = (data) => {
  openProjectModal();
  document.getElementById('project-title-tr').value = data.title;
  document.getElementById('project-title-en').value = data.title;
  document.getElementById('project-desc-tr').value  = data.desc;
  document.getElementById('project-desc-en').value  = data.desc;
  document.getElementById('project-github-url').value = data.url;
  document.getElementById('project-tags').value = data.lang || '';
  ghImporter.style.display = 'none';
  showToast('Repo bilgileri dolduruldu ✓');
};

// ── EXPERIENCE ──────────────────────────────────────────────────

let experienceData = [];

async function loadExperience() {
  const snap = await getDocs(query(collection(db, 'experience'), orderBy('start_date', 'desc')));
  experienceData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderExperienceList();
}

function renderExperienceList() {
  const list = document.getElementById('experience-list-admin');
  if (!experienceData.length) {
    list.innerHTML = '<p class="empty-state">Henüz deneyim eklenmemiş.</p>';
    return;
  }
  list.innerHTML = experienceData.map(e => `
    <div class="list-item">
      <div class="list-item-info">
        <span class="list-item-title">${e.role_tr || e.role_en || '—'}</span>
        <span class="list-item-sub">${e.company || ''} · ${e.start_date || ''}</span>
      </div>
      <div class="list-item-actions">
        <button class="btn-icon btn-edit" data-id="${e.id}">düzenle</button>
        <button class="btn-icon danger btn-delete" data-id="${e.id}">sil</button>
      </div>
    </div>
  `).join('');
}

// Event Delegation for Experience List
document.getElementById('experience-list-admin').addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains('btn-edit')) {
    editExp(id);
  } else if (e.target.classList.contains('btn-delete')) {
    deleteExp(id);
  }
});

document.getElementById('add-exp-btn').addEventListener('click', () => openExpModal());
document.getElementById('exp-modal-close').addEventListener('click', closeExpModal);
document.getElementById('exp-modal-cancel').addEventListener('click', closeExpModal);

function openExpModal(e = null) {
  document.getElementById('exp-modal-title').textContent = e ? 'Deneyim Düzenle' : 'Deneyim Ekle';
  document.getElementById('exp-company').value = e?.company || '';
  document.getElementById('exp-role-tr').value = e?.role_tr || '';
  document.getElementById('exp-role-en').value = e?.role_en || '';
  document.getElementById('exp-desc-tr').value = e?.desc_tr || '';
  document.getElementById('exp-desc-en').value = e?.desc_en || '';
  document.getElementById('exp-start-date').value = e?.start_date || '';
  document.getElementById('exp-end-date').value = e?.end_date || '';
  document.getElementById('exp-current').checked = e?.current || false;
  document.getElementById('exp-edit-id').value = e?.id || '';
  document.getElementById('exp-modal').style.display = 'flex';
}

function closeExpModal() {
  document.getElementById('exp-modal').style.display = 'none';
}

function editExp(id) {
  const e = experienceData.find(x => x.id === id);
  if (e) openExpModal(e);
}

async function deleteExp(id) {
  if (!confirm('Bu deneyimi silmek istediğine emin misin?')) return;
  await deleteDoc(doc(db, 'experience', id));
  clearCache();
  showToast('Deneyim silindi.');
  await loadExperience();
}

document.getElementById('exp-save-btn').addEventListener('click', async () => {
  const id = val('exp-edit-id');
  const data = {
    company: val('exp-company'),
    role_tr: val('exp-role-tr'),
    role_en: val('exp-role-en'),
    desc_tr: val('exp-desc-tr'),
    desc_en: val('exp-desc-en'),
    start_date: val('exp-start-date'),
    end_date: val('exp-end-date'),
    current: document.getElementById('exp-current').checked,
  };
  if (id) {
    await updateDoc(doc(db, 'experience', id), data);
  } else {
    await addDoc(collection(db, 'experience'), data);
  }
  clearCache();
  showToast('Deneyim kaydedildi.');
  closeExpModal();
  await loadExperience();
});

// ── EDUCATION ──────────────────────────────────────────────────

let educationData = [];

async function loadEducation() {
  const q = query(collection(db, 'education'), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  educationData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const list = document.getElementById('education-list-admin');
  list.innerHTML = educationData.map(e => `
    <div class="list-item">
      <div class="list-item-info">
        <span class="list-item-title">${e.school}</span>
        <span class="list-item-sub">${e.degree_tr || ''} · ${e.start_date || ''} - ${e.end_date || ''}</span>
      </div>
      <div class="list-item-actions">
        <button class="btn-icon btn-edit" data-id="${e.id}">düzenle</button>
        <button class="btn-icon danger btn-delete" data-id="${e.id}">sil</button>
      </div>
    </div>
  `).join('');
}

document.getElementById('education-list-admin').addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains('btn-edit')) {
    editEdu(id);
  } else if (e.target.classList.contains('btn-delete')) {
    deleteEdu(id);
  }
});

document.getElementById('add-edu-btn').addEventListener('click', () => openEduModal());
document.getElementById('edu-modal-close').addEventListener('click', closeEduModal);
document.getElementById('edu-modal-cancel').addEventListener('click', closeEduModal);

function openEduModal(e = null) {
  document.getElementById('edu-modal-title').textContent = e ? 'Eğitim Düzenle' : 'Eğitim Ekle';
  document.getElementById('edu-school').value     = e?.school     || '';
  document.getElementById('edu-degree-tr').value  = e?.degree_tr  || '';
  document.getElementById('edu-degree-en').value  = e?.degree_en  || '';
  document.getElementById('edu-start-date').value = e?.start_date || '';
  document.getElementById('edu-end-date').value   = e?.end_date   || '';
  document.getElementById('edu-grade').value      = e?.grade      || '';
  document.getElementById('edu-order').value      = e?.order ?? '';
  document.getElementById('edu-edit-id').value    = e?.id         || '';
  document.getElementById('edu-modal').style.display = 'flex';
}

function closeEduModal() {
  document.getElementById('edu-modal').style.display = 'none';
}

function editEdu(id) {
  const e = educationData.find(x => x.id === id);
  if (e) openEduModal(e);
}

async function deleteEdu(id) {
  if (!confirm('Bu eğitim bilgisini silmek istediğine emin misin?')) return;
  await deleteDoc(doc(db, 'education', id));
  clearCache();
  await loadEducation();
}

document.getElementById('edu-save-btn').addEventListener('click', async () => {
  const id = val('edu-edit-id');
  const data = {
    school:     val('edu-school'),
    degree_tr:  val('edu-degree-tr'),
    degree_en:  val('edu-degree-en'),
    start_date: val('edu-start-date'),
    end_date:   val('edu-end-date'),
    grade:      val('edu-grade'),
    order:      Number(val('edu-order')) || 0,
  };
  if (id) {
    await updateDoc(doc(db, 'education', id), data);
  } else {
    await addDoc(collection(db, 'education'), data);
  }
  clearCache();
  showToast('Eğitim kaydedildi.');
  closeEduModal();
  await loadEducation();
});

// ── CONTACT ───────────────────────────────────────────────────

async function loadContact() {
  const snap = await getDoc(doc(db, 'contact', 'info'));
  if (!snap.exists()) return;
  const d = snap.data();
  document.getElementById('contact-email').value = d.email || '';
  document.getElementById('contact-location-tr').value = d.location_tr || '';
  document.getElementById('contact-location-en').value = d.location_en || '';
  document.getElementById('contact-desc-tr').value = d.desc_tr || '';
  document.getElementById('contact-desc-en').value = d.desc_en || '';
}

document.getElementById('save-contact').addEventListener('click', async () => {
  const data = {
    email: val('contact-email'),
    location_tr: val('contact-location-tr'),
    location_en: val('contact-location-en'),
    desc_tr: val('contact-desc-tr'),
    desc_en: val('contact-desc-en'),
  };
  await saveDoc('contact', 'info', data);
});

// ── Helpers ───────────────────────────────────────────────────

function val(id) {
  return (document.getElementById(id)?.value || '').trim();
}

async function saveDoc(col, docId, data) {
  await setDoc(doc(db, col, docId), data, { merge: true });
  clearCache();
  showToast('Kaydedildi ✓');
}