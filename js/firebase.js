// ── firebase.js ──────────────────────────────────────────────
// Firebase yapılandırmasını buraya ekle
// Firebase console > Project Settings > Your apps > SDK setup

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyDlvocjw4o57Rq2REpIpysW9pwRyxbppeU",
  authDomain: "my-portfolio-kaeru.firebaseapp.com",
  databaseURL: "https://my-portfolio-kaeru-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "my-portfolio-kaeru",
  storageBucket: "my-portfolio-kaeru.firebasestorage.app",
  messagingSenderId: "1014890418465",
  appId: "1:1014890418465:web:d105aafa2088ca71dbee60"
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
