// ============================================================
// DATA SERVICE  —  Tüm Firebase/Firestore işlemleri buradadır.
// Render ve UI kodları bu dosyaya import etmez.
// ============================================================

import { firebaseConfig } from './firebase-config.js';
import { DEFAULT_DATA } from './default-data.js';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
    getFirestore, doc, getDoc, setDoc, updateDoc, collection,
    getDocs, addDoc, deleteDoc, onSnapshot, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ── Init ────────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ── Helpers ─────────────────────────────────────────────────

/** Firestore'daki bir dile ait tüm veriyi tek seferde çeker */
export async function loadPortfolioData(lang = 'en') {
    const sections = ['meta', 'branding', 'hero', 'terminal', 'nav', 'sections', 'footer'];
    const arrayCollections = ['education', 'experience', 'projects', 'skills'];

    const data = {};

    // Scalar documents
    await Promise.all(sections.map(async (section) => {
        const ref = doc(db, 'portfolio', lang, 'content', section);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            data[section] = snap.data();
        } else {
            // Seed from default
            data[section] = DEFAULT_DATA[lang][section];
            await setDoc(ref, data[section]);
        }
    }));

    // Array collections
    await Promise.all(arrayCollections.map(async (col) => {
        const colRef = collection(db, 'portfolio', lang, col);
        const snap = await getDocs(colRef);
        if (snap.empty) {
            // Seed
            const defaults = DEFAULT_DATA[lang][col] || [];
            data[col] = [];
            for (const item of defaults) {
                const docRef = await addDoc(colRef, { ...item, _order: defaults.indexOf(item) });
                data[col].push({ ...item, _id: docRef.id });
            }
        } else {
            data[col] = snap.docs
                .map(d => ({ ...d.data(), _id: d.id }))
                .sort((a, b) => (a._order ?? 0) - (b._order ?? 0));
        }
    }));

    return data;
}

/** Tek bir scalar document'ı günceller */
export async function saveSection(lang, section, data) {
    const ref = doc(db, 'portfolio', lang, 'content', section);
    await setDoc(ref, data, { merge: true });
}

/** Bir koleksiyondaki tek bir item'ı günceller */
export async function saveArrayItem(lang, colName, id, data) {
    const ref = doc(db, 'portfolio', lang, colName, id);
    await setDoc(ref, data, { merge: true });
}

/** Koleksiyona yeni item ekler */
export async function addArrayItem(lang, colName, item) {
    const colRef = collection(db, 'portfolio', lang, colName);
    const snap = await getDocs(colRef);
    const order = snap.size;
    const docRef = await addDoc(colRef, { ...item, _order: order });
    return { ...item, _id: docRef.id, _order: order };
}

/** Koleksiyondan item siler */
export async function deleteArrayItem(lang, colName, id) {
    const ref = doc(db, 'portfolio', lang, colName, id);
    await deleteDoc(ref);
}

/** Koleksiyondaki tüm item'ların sırasını günceller */
export async function reorderArray(lang, colName, orderedIds) {
    await Promise.all(orderedIds.map((id, idx) => {
        const ref = doc(db, 'portfolio', lang, colName, id);
        return updateDoc(ref, { _order: idx });
    }));
}

// ── Auth ────────────────────────────────────────────────────
export async function adminLogin(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

export async function adminLogout() {
    return signOut(auth);
}

export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

// ── GitHub Sync ─────────────────────────────────────────────
export async function fetchGithubRepos(username) {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    return res.json();
}
