import{o as e}from"./data-service-CGWFAI9x.js";var t={lang:localStorage.getItem(`siteLang`)||`en`,data:null,showAllProjects:!1,activeFilter:`all`,selectedProject:null};async function n(){i(),o(),await r()}async function r(){b(!0);try{t.data=await e(t.lang),c()}catch(e){console.error(`Data load error:`,e),x(`Firebase bağlantısı kurulamadı. firebase-config.js dosyasını kontrol edin.`)}finally{b(!1)}}function i(){let e=localStorage.getItem(`theme`),t=window.matchMedia(`(prefers-color-scheme: dark)`).matches,n=e===`dark`||e===null&&t;document.documentElement.classList.toggle(`dark`,n),a()}function a(){let e=document.getElementById(`theme-icon`);e&&(e.textContent=document.documentElement.classList.contains(`dark`)?`light_mode`:`dark_mode`)}function o(){document.getElementById(`theme-toggle`)?.addEventListener(`click`,()=>{document.documentElement.classList.toggle(`dark`),localStorage.setItem(`theme`,document.documentElement.classList.contains(`dark`)?`dark`:`light`),a()}),document.getElementById(`lang-toggle`)?.addEventListener(`click`,async()=>{t.lang=t.lang===`en`?`tr`:`en`,localStorage.setItem(`siteLang`,t.lang),s(),await r()});let e=document.getElementById(`mobile-menu`);document.getElementById(`mobile-menu-toggle`)?.addEventListener(`click`,()=>{e?.classList.toggle(`hidden`)}),document.querySelectorAll(`.mobile-link`).forEach(t=>{t.addEventListener(`click`,()=>e?.classList.add(`hidden`))}),window.addEventListener(`scroll`,()=>{let e=document.getElementById(`navbar-container`);e&&(e.classList.toggle(`shadow-xl`,window.scrollY>20),e.classList.toggle(`py-2`,window.scrollY>20));let t=document.getElementById(`scroll-to-top`);t&&(t.classList.toggle(`translate-y-20`,window.scrollY<=300),t.classList.toggle(`opacity-0`,window.scrollY<=300))}),document.getElementById(`scroll-to-top`)?.addEventListener(`click`,()=>{window.scrollTo({top:0,behavior:`smooth`})});let n=new IntersectionObserver(e=>e.forEach(e=>{e.isIntersecting&&e.target.classList.add(`visible`)}),{threshold:.1,rootMargin:`0px 0px -50px 0px`});document.querySelectorAll(`.fade-in-on-scroll`).forEach(e=>n.observe(e)),document.getElementById(`project-modal-backdrop`)?.addEventListener(`click`,h),document.getElementById(`project-modal-close`)?.addEventListener(`click`,h),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&h()})}function s(){let e=document.getElementById(`lang-toggle`);e&&(e.textContent=t.lang===`en`?`TR`:`EN`)}function c(){if(!t.data)return;let{meta:e,branding:n,hero:r,terminal:i,nav:a,sections:o,footer:c,education:p,experience:m,projects:h,skills:y}=t.data;s(),S(`nav-about-desktop`,a.about),S(`nav-projects-desktop`,a.projects),S(`nav-skills-desktop`,a.skills),S(`nav-contact-desktop`,a.contact),S(`nav-about-mobile`,a.about),S(`nav-projects-mobile`,a.projects),S(`nav-skills-mobile`,a.skills),S(`nav-contact-mobile`,a.contact),S(`logo-prefix`,n.logoPrefix),S(`logo-suffix`,n.logoSuffix),S(`resume-label-desktop`,n.resumeButtonLabel),S(`resume-label-mobile`,n.resumeButtonLabel),S(`profile-resume-label`,n.resumeButtonLabel),v(n),S(`hero-greeting`,r.greeting),S(`hero-firstname`,r.firstName),S(`hero-lastname`,r.lastName),S(`hero-subtitle`,r.subtitle),S(`hero-description`,r.description),S(`hero-cta-primary`,r.ctaPrimary),S(`hero-cta-secondary`,r.ctaSecondary),C(`hero-cta-primary`,`mailto:${e.contact.email}`),C(`hero-github-link`,`https://${e.contact.github}`),C(`hero-linkedin-link`,`https://${e.contact.linkedin}`),S(`terminal-filename`,i.fileName),l(i),S(`about-title`,o.aboutTitle),S(`about-bio-title`,o.bioTitle),S(`about-description`,o.bioText),S(`about-edu-title`,o.educationTitle),S(`about-work-title`,o.workTitle);let b=document.getElementById(`profile-image`);b&&(b.src=e.profileImageUrl||`assets/profile.jpg`),S(`profile-name`,e.name),S(`profile-role`,e.title.split(`|`)[0].trim()),u(p),d(m),S(`projects-title`,o.projectsTitle),S(`projects-description`,o.projectsDescription),f(h,o),S(`skills-title`,o.skillsTitle),S(`skills-description`,o.skillsDescription),g(y),S(`footer-title`,c.title),S(`footer-subtitle`,c.subtitle),S(`back-to-top-label`,c.backToTopLabel),S(`footer-name`,e.name),S(`current-year`,new Date().getFullYear()),_(e.contact)}function l(e){let t=e=>e.replace(/\/\/.*/g,`<span class="text-[#7f848e] italic opacity-80">$&</span>`).replace(/\b(const|let|var)\b/g,`<span class="text-[#C678DD] font-medium">$&</span>`).replace(/'[^']*'/g,`<span class="text-[#98C379]">$&</span>`).replace(/\b(true|false|null)\b/g,`<span class="text-[#D19A66]">$&</span>`),n=[`// ${e.fileName}`,`const ${e.objectName} = {`,`  name: '${e.name}',`,`  title: '${e.titleField}',`,`  location: '${e.location}',`,`  stack: [${(e.stack||[]).map(e=>`'${e}'`).join(`, `)}],`,`  status: '${e.status}',`,`  interests: [${(e.interests||[]).map(e=>`'${e}'`).join(`, `)}]`,`};`],r=document.getElementById(`terminal-content`);r&&(r.innerHTML=`
        <div class="space-y-0.5">
            ${n.map((e,n)=>`
              <div class="min-h-[1.25rem] sm:min-h-[1.5rem] whitespace-pre flex">
                <span class="w-5 sm:w-6 shrink-0 opacity-20 select-none text-right mr-3 sm:mr-4">${n+1}</span>
                <span class="block text-[rgb(var(--m3-on-surface))]/60">${t(e)}</span>
              </div>
            `).join(``)}
        </div>
        <div class="mt-6 flex items-center gap-2 pl-8 sm:pl-10">
            <span class="text-[rgb(var(--m3-primary))] font-bold opacity-40 select-none">$</span>
            <span class="w-1.5 sm:w-2 h-3.5 sm:h-4 bg-[rgb(var(--m3-primary))] shadow-[0_0_12px_rgba(var(--m3-primary),0.6)] animate-pulse rounded-sm"></span>
        </div>`)}function u(e){let t=document.getElementById(`education-list`);t&&(t.innerHTML=(e||[]).map(e=>`
        <div class="space-y-1 group/edu">
            <h4 class="font-bold text-xs sm:text-sm transition-colors group-hover/edu:text-[rgb(var(--m3-primary))] leading-tight">${e.institution}</h4>
            <p class="text-[10px] sm:text-xs text-[rgb(var(--m3-on-surface))]/50">${e.degree}</p>
            <div class="flex items-center justify-between pt-1">
                <span class="text-[9px] opacity-40 font-bold">${e.period}</span>
                ${e.gpa?`<span class="text-[9px] font-bold px-2 py-0.5 rounded bg-[rgb(var(--m3-primary))]/10 text-[rgb(var(--m3-primary))]">${e.gpa} GPA</span>`:``}
            </div>
        </div>`).join(``))}function d(e){let t=document.getElementById(`experience-list`);t&&(t.innerHTML=(e||[]).map(e=>`
        <div class="space-y-1 group/exp">
            <h4 class="font-bold text-xs sm:text-sm transition-colors group-hover/exp:text-[rgb(var(--m3-primary))] leading-tight">${e.role}</h4>
            <p class="text-[9px] font-bold text-[rgb(var(--m3-primary))]/70">${e.company}</p>
            <p class="text-[9px] opacity-40">${e.period}</p>
        </div>`).join(``))}function f(e,n){let r=(e||[]).filter(e=>!e.isHidden),i=[`all`,...new Set(r.map(e=>e.category).filter(Boolean))],a=document.getElementById(`project-filters`);a&&(a.innerHTML=i.map(e=>`
            <button
                data-filter="${e}"
                class="filter-btn px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border transition-all
                ${t.activeFilter===e?`bg-[rgb(var(--m3-primary))] text-[rgb(var(--m3-on-primary))] border-transparent`:`border-[rgb(var(--m3-outline))]/20 text-[rgb(var(--m3-on-surface))]/50 hover:border-[rgb(var(--m3-primary))]/40 hover:text-[rgb(var(--m3-primary))]`}"
            >${e===`all`?t.lang===`tr`?`Tümü`:`All`:e}</button>
        `).join(``),a.querySelectorAll(`.filter-btn`).forEach(r=>{r.addEventListener(`click`,()=>{t.activeFilter=r.dataset.filter,f(e,n)})}));let o=t.activeFilter===`all`?r:r.filter(e=>e.category===t.activeFilter),s=o.filter(e=>e.featured),c=o.filter(e=>!e.featured),l=document.getElementById(`projects-grid`);if(!l)return;let u=``;s.length>0&&t.activeFilter===`all`&&(u+=`<div class="col-span-full mb-2">
            <span class="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--m3-primary))]/60">
                <span class="material-symbols-outlined text-sm">star</span>
                ${t.lang===`tr`?`Öne Çıkan`:`Featured`}
            </span>
        </div>`,u+=s.map(e=>p(e,!0)).join(``));let d=t.showAllProjects||t.activeFilter!==`all`,h=(t.activeFilter===`all`?c:o).slice(0,d?999:3);u+=h.map(e=>p(e,!1)).join(``),l.innerHTML=u,l.querySelectorAll(`[data-project-id]`).forEach(t=>{t.addEventListener(`click`,n=>{if(n.target.closest(`a`))return;let r=e.find(e=>e._id===t.dataset.projectId||e.id===t.dataset.projectId);r&&m(r)})});let g=document.getElementById(`show-more-projects-btn`),_=g?.parentElement;if(_){let e=t.activeFilter===`all`&&c.length>3;_.style.display=e?`flex`:`none`,g&&(S(`show-more-label`,t.showAllProjects?n.showLessLabel:n.showMoreLabel),g.querySelector(`.material-symbols-outlined`).textContent=t.showAllProjects?`expand_less`:`expand_more`)}document.getElementById(`show-more-projects-btn`)?.addEventListener(`click`,()=>{t.showAllProjects=!t.showAllProjects,f(e,n)})}function p(e,n){let r=e._id||e.id||``,i=e.imageUrl||`https://picsum.photos/seed/${encodeURIComponent(e.title)}/800/500`,a=(e.technologies||[]).slice(0,4).map(e=>`<span class="px-2 py-0.5 rounded-lg bg-[rgb(var(--m3-surface-container-high))] text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[rgb(var(--m3-on-surface))]/40 border border-white/5">${e}</span>`).join(``);return`
    <div
        data-project-id="${r}"
        class="project-card ${n?`md:col-span-2 lg:col-span-1`:``} flex flex-col rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden card-modern group cursor-pointer relative"
    >
        ${n?`<div class="absolute top-4 left-4 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[rgb(var(--m3-primary))]/90 text-[rgb(var(--m3-on-primary))] text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm">
            <span class="material-symbols-outlined text-[12px]">star</span>
            ${t.lang===`tr`?`Öne Çıkan`:`Featured`}
        </div>`:``}

        <!-- Image -->
        <div class="aspect-[16/9] overflow-hidden bg-[rgb(var(--m3-surface-container-high))] relative">
            <img
                src="${i}"
                alt="${e.title}"
                class="w-full h-full object-cover grayscale-[50%] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                onerror="this.src='https://picsum.photos/seed/${encodeURIComponent(e.title)}/800/500'"
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
            ${e.category?`<span class="text-[9px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--m3-primary))]/60">${e.category}</span>`:``}
            <div class="space-y-1.5">
                <h3 class="text-base sm:text-lg font-bold group-hover:text-[rgb(var(--m3-primary))] transition-colors leading-tight">${e.title}</h3>
                <p class="text-[11px] sm:text-xs text-[rgb(var(--m3-on-surface))]/50 leading-relaxed line-clamp-2">${(e.description||[``])[0]}</p>
            </div>
            <div class="flex flex-wrap gap-1.5">${a}</div>
        </div>
    </div>`}function m(e){t.selectedProject=e;let n=document.getElementById(`project-modal`);if(!n)return;let r=e.imageUrl||`https://picsum.photos/seed/${encodeURIComponent(e.title)}/1200/600`,i=(e.technologies||[]).map(e=>`<span class="px-3 py-1 rounded-lg bg-[rgb(var(--m3-surface-container-high))] text-xs font-bold text-[rgb(var(--m3-on-surface))]/60 border border-white/5">${e}</span>`).join(``),a=(e.description||[]).map(e=>`<li class="flex gap-3 text-sm text-[rgb(var(--m3-on-surface))]/60 leading-relaxed">
            <span class="text-[rgb(var(--m3-primary))] mt-1 shrink-0">→</span>
            <span>${e}</span>
        </li>`).join(``);document.getElementById(`modal-content`).innerHTML=`
        <div class="w-full aspect-[21/9] overflow-hidden rounded-[1rem] mb-6">
            <img src="${r}" alt="${e.title}" class="w-full h-full object-cover" onerror="this.src='https://picsum.photos/seed/${encodeURIComponent(e.title)}/1200/600'" />
        </div>
        ${e.category?`<span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--m3-primary))]/60">${e.category}</span>`:``}
        <h2 class="text-2xl sm:text-3xl font-black mt-1 mb-3">${e.title}</h2>
        <div class="flex flex-wrap gap-2 mb-6">${i}</div>
        <ul class="space-y-3 mb-8">${a}</ul>
        <div class="flex gap-3">
            ${e.githubUrl?`
            <a href="${e.githubUrl}" target="_blank" rel="noopener noreferrer"
                class="flex-1 py-3 rounded-xl bg-[rgb(var(--m3-surface-container-high))] text-sm font-bold text-center hover:bg-[rgb(var(--m3-primary))] hover:text-white transition-all flex items-center justify-center gap-2 border border-white/5">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                View on GitHub
            </a>`:``}
            ${e.liveUrl?`
            <a href="${e.liveUrl}" target="_blank" rel="noopener noreferrer"
                class="flex-1 py-3 rounded-xl bg-[rgb(var(--m3-primary))] text-[rgb(var(--m3-on-primary))] text-sm font-bold text-center hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-base">launch</span>
                Live Demo
            </a>`:``}
        </div>`,n.classList.remove(`hidden`),document.body.style.overflow=`hidden`,requestAnimationFrame(()=>n.classList.add(`modal-visible`))}function h(){let e=document.getElementById(`project-modal`);e&&(e.classList.remove(`modal-visible`),document.body.style.overflow=``,setTimeout(()=>e.classList.add(`hidden`),300),t.selectedProject=null)}function g(e){let t=document.getElementById(`skills-grid`);t&&(t.innerHTML=(e||[]).map(e=>`
        <div class="p-8 rounded-[2rem] card-modern">
            <div class="flex items-center gap-4 mb-8">
                <div class="w-12 h-12 rounded-2xl bg-[rgb(var(--m3-surface-container-high))] flex items-center justify-center text-[rgb(var(--m3-primary))]/60 border border-white/5">
                    <span class="material-symbols-outlined text-2xl">${e.icon||`star`}</span>
                </div>
                <h3 class="text-base font-extrabold tracking-tight text-[rgb(var(--m3-on-surface))] opacity-80">${e.category}</h3>
            </div>
            <div class="flex flex-wrap gap-2.5">
                ${(e.items||[]).map(e=>`
                    <span class="px-4 py-2 rounded-2xl border border-white/5 bg-[rgb(var(--m3-surface-container-high))]/40 text-xs font-bold text-[rgb(var(--m3-on-surface))]/60 hover:text-[rgb(var(--m3-primary))] hover:border-[rgb(var(--m3-primary))]/20 hover:bg-[rgb(var(--m3-primary))]/5 transition-all cursor-default">${e}</span>
                `).join(``)}
            </div>
        </div>`).join(``))}function _(e){let t=[{icon:null,svg:`<span class="material-symbols-outlined text-[28px]">mail</span>`,url:`mailto:${e.email}`,label:`Email`,hover:`hover:bg-[#EA4335]`},{svg:`<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,url:`https://${e.linkedin}`,label:`LinkedIn`,hover:`hover:bg-[#0077B5]`},{svg:`<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,url:`https://${e.github}`,label:`GitHub`,hover:`hover:bg-[#181717]`}];e.website&&t.push({svg:`<span class="material-symbols-outlined text-[28px]">language</span>`,url:e.website,label:`Website`,hover:`hover:bg-[rgb(var(--m3-primary))]`});let n=document.getElementById(`social-links`);n&&(n.innerHTML=t.map(e=>`
        <a href="${e.url}" target="_blank" rel="noreferrer"
            class="w-14 h-14 rounded-2xl bg-[rgb(var(--m3-surface-container))] border border-[rgb(var(--m3-outline))]/10 flex items-center justify-center text-[rgb(var(--m3-on-surface))]/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:text-white ${e.hover}" title="${e.label}">
            ${e.svg}
        </a>`).join(``))}function v(e){[`resume-btn-desktop`,`resume-btn-mobile`,`profile-resume-btn`].forEach(n=>{let r=document.getElementById(n);r&&(localStorage.getItem(`cvBase64_${t.lang}`)?(r.href=`#`,r.onclick=e=>{e.preventDefault(),y()}):(r.href=e.resumeDownloadUrl||`#`,r.onclick=null))})}function y(){let e=localStorage.getItem(`cvBase64_${t.lang}`);if(e){let n=atob(e),r=new Uint8Array([...n].map(e=>e.charCodeAt(0))),i=new Blob([r],{type:`application/pdf`}),a=URL.createObjectURL(i);Object.assign(document.createElement(`a`),{href:a,download:localStorage.getItem(`cvFileName_${t.lang}`)||`CV.pdf`}).click(),URL.revokeObjectURL(a)}}function b(e){let t=document.getElementById(`page-skeleton`),n=document.querySelector(`main`);t&&(t.style.display=e?`flex`:`none`),n&&(n.style.opacity=e?`0`:`1`)}function x(e){let t=document.getElementById(`page-error`);t&&(t.textContent=e,t.style.display=`block`)}function S(e,t){let n=document.getElementById(e);n&&(n.textContent=t??``)}function C(e,t){let n=document.getElementById(e);n&&(n.href=t??`#`)}document.addEventListener(`DOMContentLoaded`,n);