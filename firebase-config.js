// ============================================================
// FIREBASE CONFIGURATION
// ============================================================
// 1. Go to https://console.firebase.google.com
// 2. Create a project → Add Web App
// 3. Copy your config object here
// 4. Enable Firestore Database + Authentication (Email/Password)
// ============================================================

export const firebaseConfig = {
  apiKey: "AIzaSyARU7Dj4-rmlOrYOtHIHfSutc3m19OA1jQ",
  authDomain: "my-portfolio-kaeru.firebaseapp.com",
  projectId: "my-portfolio-kaeru",
  storageBucket: "my-portfolio-kaeru.firebasestorage.app",
  messagingSenderId: "1014890418465",
  appId: "1:1014890418465:web:d105aafa2088ca71dbee60"
};

// ============================================================
// FIRESTORE SECURITY RULES (paste into Firebase Console)
// ============================================================
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /portfolio/{lang}/{document=**} {
//       allow read: if true;
//       allow write: if request.auth != null;
//     }
//   }
// }
