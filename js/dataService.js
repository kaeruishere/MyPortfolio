// ── dataService.js ───────────────────────────────────────────
// Tüm Firestore okuma işlemleri burada.
// Cache: sessionStorage ile sayfa yenilenmeden önce tekrar fetch yapmaz.

import { db } from './firebase.js';
import {
  doc, getDoc, collection, getDocs, orderBy, query
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const CACHE_KEY = 'portfolio_data';

// Cache'den yükle
function loadCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// Cache'e kaydet
function saveCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch { /* storage full, devam et */ }
}

// Tüm portfolio verisini çek
export async function fetchPortfolioData() {
  const cached = loadCache();
  if (cached) return cached;

  const [meta, about, contactDoc, skills, projects, experience, education] = await Promise.all([
    getDoc(doc(db, 'portfolio', 'meta')),
    getDoc(doc(db, 'portfolio', 'about')),
    getDoc(doc(db, 'contact', 'info')),
    getDocs(query(collection(db, 'skills'), orderBy('order', 'asc'))),
    getDocs(query(collection(db, 'projects'), orderBy('order', 'asc'))),
    getDocs(query(collection(db, 'experience'), orderBy('start_date', 'desc'))),
    getDocs(query(collection(db, 'education'), orderBy('order', 'asc')))
  ]);

  const data = {
    meta:       meta.exists()       ? meta.data()       : {},
    about:      about.exists()      ? about.data()      : {},
    contact:    contactDoc.exists() ? contactDoc.data() : {},
    skills:     skills.docs.map(d  => ({ id: d.id, ...d.data() })),
    projects:   projects.docs.map(d => ({ id: d.id, ...d.data() })),
    experience: experience.docs.map(d => ({ id: d.id, ...d.data() })),
    education:  education.docs.map(d => ({ id: d.id, ...d.data() }))
  };

  saveCache(data);
  return data;
}

// Cache'i temizle (admin paneli güncelleme sonrası çağırır)
export function clearCache() {
  sessionStorage.removeItem(CACHE_KEY);
}
