// ============================================================
// DEFAULT DATA  — Firestore'da veri yoksa bu kullanılır ve
// otomatik olarak DB'ye yazılır.
// ============================================================

export const DEFAULT_DATA = {
    en: {
        meta: {
            name: "Umut Eren KAPLAN",
            title: "Computer Engineer | Software Developer",
            profileImageUrl: "",
            contact: {
                email: "kaplanumuteren@gmail.com",
                phone: "+90 532 159 4577",
                linkedin: "linkedin.com/in/umuterenkaplan",
                github: "github.com/kaeruishere",
                website: ""
            }
        },
        branding: {
            logoPrefix: "UK",
            logoSuffix: ".",
            resumeButtonLabel: "Resume",
            resumeDownloadUrl: "#"
        },
        hero: {
            greeting: "Hello World! i am",
            firstName: "Umut Eren",
            lastName: "KAPLAN",
            subtitle: "Computer Engineer | Software Developer",
            description: "Building elegant solutions to complex problems with modern technologies. Focused on immersive game development and scalable mobile experiences.",
            ctaPrimary: "Contact Me",
            ctaSecondary: "Projects"
        },
        terminal: {
            fileName: "developer_identity.ts",
            objectName: "developer",
            name: "Umut Eren Kaplan",
            titleField: "Computer Engineer",
            location: "İzmir",
            stack: ["Unity", "Flutter", "Java", "Python"],
            status: "Open for Opportunities",
            interests: ["3D Games", "Self-Hosting", "Mobile UX"]
        },
        nav: {
            about: "About",
            projects: "Projects",
            skills: "Skills",
            contact: "Contact"
        },
        sections: {
            aboutTitle: "About Me",
            bioTitle: "Bio",
            bioText: "Building elegant solutions to complex problems with modern technologies. Focused on immersive game development and scalable mobile experiences.",
            educationTitle: "Education",
            workTitle: "Work",
            projectsTitle: "Projects",
            projectsDescription: "Here are some of the projects I've worked on, showcasing my skills in various technologies and problem domains.",
            showMoreLabel: "Show More",
            showLessLabel: "Show Less",
            skillsTitle: "Skills",
            skillsDescription: "I've worked with a range of technologies in web, mobile, and game development."
        },
        footer: {
            title: "Get in touch",
            subtitle: "Available for remote and on-site opportunities",
            backToTopLabel: "Back to Top"
        },
        education: [
            { institution: "Manisa Celal Bayar University", degree: "Computer Engineering", period: "09.2022 – 01.2026", gpa: "3.38" },
            { institution: "Universiteti Publik Kadri Zeka", degree: "Erasmus Learning Mobility", period: "2024 – 2024", gpa: "" }
        ],
        experience: [
            {
                role: "Unity Developer Intern", company: "Room Games", period: "09.2025 - 12.2025", type: "Game Development Studio",
                description: ["Designed and developed a complete 3D game based on the 'Rage Room' concept using Unity.", "Managed the full development lifecycle from concept to final delivery.", "Enhanced proficiency in C# scripting and asset integration."]
            },
            {
                role: "Software Engineering Intern", company: "Frank Pfützenreuter", period: "07.2024 - 09.2024", type: "Software Engineering & Consultancy",
                description: ["Completed a competitive Erasmus+ internship in an international environment.", "Successfully delivered multiple projects within strict deadlines.", "Cultivated effective communication skills within a multicultural team."]
            },
            {
                role: "Android Developer Intern", company: "MASKI", period: "07.2023 - 08.2023", type: "Public Utility Administration",
                description: ["Developed functional mobile applications using Android Studio.", "Solidified core Java programming skills through practical application.", "Acquired foundational knowledge of mobile development lifecycle."]
            }
        ],
        projects: [
            { id: "1", title: "Medicine Tracker App", technologies: ["Flutter", "Firebase"], category: "Mobile", featured: true, githubUrl: "https://github.com/kaeruishere/medicine-tracker", imageUrl: "", description: ["Developed a cross-platform mobile app to track medication schedules.", "Implemented local push notifications and alarm services offline."], isHidden: false },
            { id: "2", title: "Scrap Yard Smash", technologies: ["Unity", "C#"], category: "Game Dev", featured: true, githubUrl: "https://github.com/kaeruishere/scrap-yard-smash", imageUrl: "", description: ["Designed a 3D environment with realistic physics and destructible objects.", "Optimized performance using object pooling and memory management."], isHidden: false },
            { id: "3", title: "Randevusu.Online", technologies: ["PHP", "HTML", "Firebase"], category: "Web", featured: false, githubUrl: "https://github.com/kaeruishere/randevusu-online", imageUrl: "", description: ["Built a responsive online reservation system with dynamic scheduling.", "Integrated Firebase for real-time data synchronization."], isHidden: false },
            { id: "4", title: "Workie", technologies: ["Java", "Firebase"], category: "Mobile", featured: false, githubUrl: "https://github.com/kaeruishere/workie-android", imageUrl: "", description: ["Developed a native Android app for personal task management.", "Utilized Firebase Realtime Database for instant synchronization."], isHidden: false },
            { id: "5", title: "Shut The Box", technologies: ["Flask", "Java", "MySQL"], category: "Web", featured: false, githubUrl: "https://github.com/kaeruishere/shut-the-box-api", imageUrl: "", description: ["Engineered a RESTful API using Python Flask for game logic.", "Designed relational MySQL database for profiles and match history."], isHidden: false }
        ],
        skills: [
            { category: "Programming Languages", icon: "terminal", items: ["Java", "Python", "C#", "Flutter (Dart)", "PHP", "HTML/CSS"] },
            { category: "Mobile & Game Dev", icon: "sports_esports", items: ["Unity 3D", "Android Studio", "Flutter", "Firebase", "C# Scripting"] },
            { category: "Frontend & Web", icon: "web", items: ["React", "Vite", "Tailwind CSS", "Framer Motion", "PHP", "HTML"] },
            { category: "Backend & Systems", icon: "dns", items: ["Flask", "RESTful APIs", "Node.js", "MySQL", "Python"] },
            { category: "DevOps & Self-Hosting", icon: "package_2", items: ["Linux", "Docker", "Coolify", "Cloudflare Tunnels", "Self-Hosting"] },
            { category: "Databases & Tools", icon: "storage", items: ["MySQL", "Firebase", "Git", "Android Studio", "Unity"] }
        ]
    },
    tr: {
        meta: {
            name: "Umut Eren KAPLAN",
            title: "Bilgisayar Mühendisi | Yazılım Geliştirici",
            profileImageUrl: "",
            contact: {
                email: "kaplanumuteren@gmail.com",
                phone: "+90 532 159 4577",
                linkedin: "linkedin.com/in/umuterenkaplan",
                github: "github.com/kaeruishere",
                website: ""
            }
        },
        branding: {
            logoPrefix: "UK",
            logoSuffix: ".",
            resumeButtonLabel: "CV İndir",
            resumeDownloadUrl: "#"
        },
        hero: {
            greeting: "Merhaba Dünya! ben",
            firstName: "Umut Eren",
            lastName: "KAPLAN",
            subtitle: "Bilgisayar Mühendisi | Yazılım Geliştirici",
            description: "Modern teknolojiler ile karmaşık problemlere zarif çözümler üretiyorum. Sürükleyici oyun geliştirme ve ölçeklenebilir mobil deneyimlere odaklanıyorum.",
            ctaPrimary: "İletişime Geç",
            ctaSecondary: "Projeler"
        },
        terminal: {
            fileName: "developer_kimligi.ts",
            objectName: "gelistirici",
            name: "Umut Eren Kaplan",
            titleField: "Bilgisayar Mühendisi",
            location: "İzmir",
            stack: ["Unity", "Flutter", "Java", "Python"],
            status: "Yeni Fırsatlara Açık",
            interests: ["3D Oyunlar", "Self-Hosting", "Mobil UX"]
        },
        nav: {
            about: "Hakkımda",
            projects: "Projeler",
            skills: "Yetenekler",
            contact: "İletişim"
        },
        sections: {
            aboutTitle: "Hakkımda",
            bioTitle: "Biyografi",
            bioText: "Modern teknolojiler ile karmaşık problemlere zarif çözümler üretiyorum.",
            educationTitle: "Eğitim",
            workTitle: "Deneyim",
            projectsTitle: "Projeler",
            projectsDescription: "İşte yeteneklerimi sergileyen bazı projelerim.",
            showMoreLabel: "Daha Fazla Göster",
            showLessLabel: "Daha Az Göster",
            skillsTitle: "Yetenekler",
            skillsDescription: "Frontend'ten backend'e, mobil ve oyun geliştirmeye kadar çeşitli teknolojilerde çalıştım."
        },
        footer: {
            title: "Benimle iletişime geç",
            subtitle: "Uzaktan ve ofisten çalışma fırsatlarına hazırım.",
            backToTopLabel: "Yukarı Çık"
        },
        education: [
            { institution: "Manisa Celal Bayar Üniversitesi", degree: "Bilgisayar Mühendisliği", period: "09.2022 – 01.2026", gpa: "3.38" },
            { institution: "Universiteti Publik Kadri Zeka", degree: "Erasmus Öğrenci Değişimi", period: "2024 – 2024", gpa: "" }
        ],
        experience: [
            {
                role: "Unity Geliştirici Stajyeri", company: "Room Games", period: "09.2025 - 12.2025", type: "Oyun Geliştirme Stüdyosu",
                description: ["'Rage Room' konseptine dayalı 3D bir oyunu Unity ile tasarladı.", "Tüm geliştirme sürecini tasarımdan teslimata kadar yönetti.", "C# scripting ve asset yönetiminde yeteneklerini artırdı."]
            },
            {
                role: "Yazılım Mühendisliği Stajyeri", company: "Frank Pfützenreuter", period: "07.2024 - 09.2024", type: "Yazılım Mühendisliği & Danışmanlık",
                description: ["Uluslararası ortamda Erasmus+ stajı tamamladı.", "Birden fazla projeyi hedef tarihlerde başarıyla teslim etti.", "Çok kültürlü bir takimda etkili iletişim yetenekleri geliştirdi."]
            },
            {
                role: "Android Geliştirici Stajyeri", company: "MASKİ", period: "07.2023 - 08.2023", type: "Kamu Yönetimi",
                description: ["Android Studio'da kullanıcı dostu mobil uygulamalar geliştirdi.", "Temel Java programlama yeteneklerini pratikte uyguladı.", "Mobil uygulama geliştirme süreçleri hakkında temel kazanımlar sağladı."]
            }
        ],
        projects: [
            { id: "1", title: "İlaç Takip Uygulaması", technologies: ["Flutter", "Firebase"], category: "Mobil", featured: true, githubUrl: "https://github.com/kaeruishere/medicine-tracker", imageUrl: "", description: ["Kullanıcıların ilaç alım zamanlarını takip etmesine yardımcı cross-platform uygulama.", "İnternet bağlantısı olmasa bile çalışan yerel bildirim servisleri."], isHidden: false },
            { id: "2", title: "Hurdalık Parçala", technologies: ["Unity", "C#"], category: "Oyun", featured: true, githubUrl: "https://github.com/kaeruishere/scrap-yard-smash", imageUrl: "", description: ["Gerçekçi fiziklere sahip tamamen yıkılabilir 3D ortam.", "Object pooling ile optimize edilmiş performans."], isHidden: false },
            { id: "3", title: "Randevusu.Online", technologies: ["PHP", "HTML", "Firebase"], category: "Web", featured: false, githubUrl: "https://github.com/kaeruishere/randevusu-online", imageUrl: "", description: ["Dinamik randevu planlamalı tam uyumlu rezervasyon sistemi.", "Firebase ile eşzamanlı veri senkronizasyonu."], isHidden: false },
            { id: "4", title: "Workie", technologies: ["Java", "Firebase"], category: "Mobil", featured: false, githubUrl: "https://github.com/kaeruishere/workie-android", imageUrl: "", description: ["Kişisel görev yönetimi için native Android uygulaması.", "Firebase Realtime Database ile anlık senkronizasyon."], isHidden: false },
            { id: "5", title: "Shut The Box", technologies: ["Flask", "Java", "MySQL"], category: "Web", featured: false, githubUrl: "https://github.com/kaeruishere/shut-the-box-api", imageUrl: "", description: ["Python Flask ile oyun mantığı için RESTful API.", "Profiller ve maç geçmişi için MySQL şeması."], isHidden: false }
        ],
        skills: [
            { category: "Programlama Dilleri", icon: "terminal", items: ["Java", "Python", "C#", "Flutter (Dart)", "PHP", "HTML/CSS"] },
            { category: "Mobil ve Oyun Geliştirme", icon: "sports_esports", items: ["Unity 3D", "Android Studio", "Flutter", "Firebase", "C# Scripting"] },
            { category: "Frontend ve Web", icon: "web", items: ["React", "Vite", "Tailwind CSS", "Framer Motion", "PHP", "HTML"] },
            { category: "Backend ve Sistemler", icon: "dns", items: ["Flask", "RESTful APIs", "Node.js", "MySQL", "Python"] },
            { category: "DevOps ve Self-Hosting", icon: "package_2", items: ["Linux", "Docker", "Coolify", "Cloudflare Tunnels", "Self-Hosting"] },
            { category: "Veritabanı ve Araçlar", icon: "storage", items: ["MySQL", "Firebase", "Git", "Android Studio", "Unity"] }
        ]
    }
};
