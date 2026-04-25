// ============================================================
// FIREBASE CONFIGURATION
// ============================================================
// 1. Go to https://console.firebase.google.com
// 2. Create a project → Add Web App
// 3. Copy your config object here
// 4. Enable Firestore Database + Authentication (Email/Password)
// ============================================================

export const firebaseConfig = {
    apiKey: "%%FIREBASE_API_KEY%%",
    authDomain: "%%FIREBASE_AUTH_DOMAIN%%",
    projectId: "%%FIREBASE_PROJECT_ID%%",
    storageBucket: "%%FIREBASE_STORAGE_BUCKET%%",
    messagingSenderId: "%%FIREBASE_MESSAGING_ID%%",
    appId: "%%FIREBASE_APP_ID%%"
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
