# 🚀 Portfolio Template — Firebase + Admin Panel

Modern, Firebase destekli, admin panelli kişisel portföy şablonu.

## ✨ Özellikler

- 🌙 Dark / Light tema
- 🌍 TR / EN dil desteği
- 🔥 Firebase Firestore ile dinamik içerik
- 🔐 Firebase Auth ile güvenli admin paneli
- 📂 Proje kategorisi filtresi
- 🪟 Proje detay modal
- ⭐ Öne çıkan proje desteği
- 📱 Tam responsive
- 🐙 GitHub repo senkronizasyonu

## 🛠️ Kurulum

### 1. Firebase Projesi Oluştur

1. [Firebase Console](https://console.firebase.google.com)'a git
2. **New Project** → proje adını gir
3. **Web App** ekle → config'i kopyala
4. **Firestore Database** → Create database → **Production mode**
5. **Authentication** → Sign-in method → **Email/Password** → Enable
6. Authentication → Users → **Add user** (senin admin hesabın)

### 2. Firestore Security Rules

Firebase Console → Firestore → Rules → şunu yapıştır:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portfolio/{lang}/content/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /portfolio/{lang}/{collection}/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. firebase-config.js Düzenle

```js
// firebase-config.js
export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",           // Firebase Console'dan kopyala
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 4. Profil Fotoğrafı

`assets/profile.jpg` olarak ekle.  
Ya da Admin Panel → İletişim → Profil Fotoğrafı URL alanına link gir.

### 5. Çalıştır

Herhangi bir static server ile çalışır:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .

# VS Code Live Server eklentisi
```

> ⚠️ **`file://` protokolüyle açma**, Firebase ES Module import'ları CORS hatası verir. Mutlaka local server kullan.

## 📁 Dosya Yapısı

```
portfolio/
├── index.html          → Ana sayfa
├── admin.html          → Standalone admin panel (opsiyonel)
├── styles.css          → Tüm stiller
├── firebase-config.js  → 🔑 Senin Firebase config'in
├── default-data.js     → Başlangıç verileri (ilk seed)
├── data-service.js     → Firebase CRUD işlemleri
├── main.js             → Portfolio render + events
├── admin.js            → Admin panel logic
└── assets/
    └── profile.jpg     → Profil fotoğrafı
```

## 🔒 Admin Panel

- `yourdomain.com/#admin` → Admin panelini aç (index.html içinde)
- `yourdomain.com/admin.html` → Standalone admin sayfa
- Firebase Auth ile güvenli giriş
- Tüm değişiklikler Firestore'a otomatik kaydedilir

## 🐙 GitHub Senkronizasyonu

Admin Panel → Projeler → **GitHub'dan Getir**

GitHub API'den tüm public repo'larını çeker ve Firestore'a ekler.  
Yeni eklenen projeler varsayılan olarak **gizlidir** — manuel olarak "Göster" diyebilirsin.

## 📦 Deploy

Herhangi bir static hosting destekler:

- [Firebase Hosting](https://firebase.google.com/docs/hosting) ← Önerilen (aynı proje)
- Netlify
- Vercel
- GitHub Pages

### Firebase Hosting ile Deploy

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## ⚙️ Özelleştirme

Tüm içerik Admin Panel üzerinden değiştirilebilir:

| Sekme | İçerik |
|-------|--------|
| Branding | Logo, resume button |
| Hero | İsim, başlık, açıklama |
| Terminal | Kod widget içeriği |
| İletişim | Email, GitHub, LinkedIn |
| Hakkında | Bio, section başlıkları |
| Eğitim | Okul, bölüm, dönem, GPA |
| Deneyim | Pozisyon, şirket, açıklama |
| Projeler | Proje kartları, featured, gizle/göster |
| Yetenekler | Skill kategorileri |
| CV/Resume | PDF yükle veya link ver |

---

Made with ❤️ — Fork it, make it yours.
