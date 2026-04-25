import{a as e,c as t,i as n,l as r,n as i,o as a,r as o,s,t as c}from"./data-service-CGWFAI9x.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";var l={lang:localStorage.getItem(`siteLang`)||`en`,data:null,activeTab:`branding`,user:null};document.addEventListener(`DOMContentLoaded`,()=>{u(),p(),s(e=>{l.user=e,e?f():d()})});function u(){let e=localStorage.getItem(`theme`),t=window.matchMedia(`(prefers-color-scheme: dark)`).matches;document.documentElement.classList.toggle(`dark`,e===`dark`||e===null&&t)}function d(){document.getElementById(`admin-login`)?.classList.remove(`hidden`),document.getElementById(`admin-dashboard`)?.classList.add(`hidden`)}async function f(){document.getElementById(`admin-login`)?.classList.add(`hidden`),document.getElementById(`admin-dashboard`)?.classList.remove(`hidden`),await m()}function p(){document.getElementById(`admin-login-form`)?.addEventListener(`submit`,async e=>{e.preventDefault();let t=document.getElementById(`admin-email`).value,n=document.getElementById(`admin-password`).value,r=e.target.querySelector(`button[type="submit"]`);r.textContent=`Giriş yapılıyor...`,r.disabled=!0;try{await i(t,n)}catch(e){S(`Giriş başarısız: `+(e.code===`auth/invalid-credential`?`E-posta veya şifre hatalı.`:e.message),`error`)}finally{r.textContent=`Panele Gir`,r.disabled=!1}}),document.getElementById(`admin-logout-btn`)?.addEventListener(`click`,async()=>{await o()}),document.getElementById(`admin-lang-toggle`)?.addEventListener(`click`,async()=>{l.lang=l.lang===`en`?`tr`:`en`,localStorage.setItem(`siteLang`,l.lang),document.getElementById(`admin-lang-toggle`).textContent=l.lang===`en`?`TR`:`EN`,await m()}),document.getElementById(`admin-save-btn`)?.addEventListener(`click`,()=>{b(),x()})}async function m(){let e=document.getElementById(`admin-content`);e&&(e.innerHTML=`<div class="p-8 text-center opacity-40">Yükleniyor...</div>`);try{l.data=await a(l.lang),g(),_()}catch(e){console.error(e),S(`Veri yüklenemedi: `+e.message,`error`)}}var h=[{id:`branding`,icon:`auto_awesome`,label:`Branding`},{id:`hero`,icon:`bolt`,label:`Hero`},{id:`terminal`,icon:`terminal`,label:`Terminal`},{id:`contact`,icon:`contact_mail`,label:`İletişim`},{id:`about`,icon:`person`,label:`Hakkında`},{id:`education`,icon:`school`,label:`Eğitim`},{id:`experience`,icon:`work`,label:`Deneyim`},{id:`projects`,icon:`code`,label:`Projeler`},{id:`skills`,icon:`data_object`,label:`Yetenekler`},{id:`cv`,icon:`picture_as_pdf`,label:`CV / Resume`}];function g(){let e=document.getElementById(`admin-nav`);e&&(e.innerHTML=h.map(e=>`
        <button data-tab="${e.id}"
            class="tab-btn flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all
            ${l.activeTab===e.id?`bg-[rgb(var(--m3-primary))] text-white shadow-lg`:`hover:bg-[rgb(var(--m3-on-surface))]/5 opacity-60 hover:opacity-100`}">
            <span class="material-symbols-outlined text-lg">${e.icon}</span>
            ${e.label}
        </button>`).join(``),e.querySelectorAll(`.tab-btn`).forEach(e=>{e.addEventListener(`click`,()=>{l.activeTab=e.dataset.tab,g(),_();let t=h.find(e=>e.id===l.activeTab),n=document.getElementById(`admin-tab-title`);n&&t&&(n.textContent=t.label)})}))}function _(){let e=document.getElementById(`admin-content`);if(!e||!l.data)return;let{branding:t,hero:n,terminal:r,meta:i,sections:a,education:o,experience:s,projects:c,skills:u}=l.data,d=(e,t,n,r=`text`)=>`
        <div class="space-y-2">
            <label class="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">${e}</label>
            <input type="${r}" value="${C(t)}"
                class="admin-input w-full px-5 py-3.5 rounded-2xl bg-[rgb(var(--m3-surface-container))] border border-transparent outline-none focus:ring-2 focus:ring-[rgb(var(--m3-primary))] transition-all font-medium text-sm"
                oninput="${n}"/>
        </div>`,f=(e,t,n)=>`
        <div class="space-y-2">
            <label class="text-[10px] uppercase font-bold tracking-widest opacity-40 ml-1">${e}</label>
            <textarea rows="3"
                class="admin-input w-full px-5 py-3.5 rounded-2xl bg-[rgb(var(--m3-surface-container))] border border-transparent outline-none focus:ring-2 focus:ring-[rgb(var(--m3-primary))] transition-all font-medium text-sm resize-none"
                oninput="${n}">${w(t)}</textarea>
        </div>`,p=e=>`<div class="p-6 sm:p-8 rounded-[1.5rem] bg-[rgb(var(--m3-surface-container-high))] space-y-5 border border-white/5">${e}</div>`;switch(l.activeTab){case`branding`:e.innerHTML=p(`
                <h3 class="font-black text-lg mb-2">Branding</h3>
                ${d(`Logo Prefix`,t.logoPrefix,`adminSet('branding','logoPrefix',this.value)`)}
                ${d(`Logo Suffix`,t.logoSuffix,`adminSet('branding','logoSuffix',this.value)`)}
                ${d(`Resume Button Label`,t.resumeButtonLabel,`adminSet('branding','resumeButtonLabel',this.value)`)}
                ${d(`Resume Download URL`,t.resumeDownloadUrl,`adminSet('branding','resumeDownloadUrl',this.value)`)}
            `);break;case`hero`:e.innerHTML=p(`
                <h3 class="font-black text-lg mb-2">Hero Bölümü</h3>
                ${d(`Greeting`,n.greeting,`adminSet('hero','greeting',this.value)`)}
                ${d(`First Name`,n.firstName,`adminSet('hero','firstName',this.value)`)}
                ${d(`Last Name`,n.lastName,`adminSet('hero','lastName',this.value)`)}
                ${d(`Subtitle`,n.subtitle,`adminSet('hero','subtitle',this.value)`)}
                ${f(`Description`,n.description,`adminSet('hero','description',this.value)`)}
                ${d(`CTA Primary Text`,n.ctaPrimary,`adminSet('hero','ctaPrimary',this.value)`)}
                ${d(`CTA Secondary Text`,n.ctaSecondary,`adminSet('hero','ctaSecondary',this.value)`)}
            `);break;case`terminal`:e.innerHTML=p(`
                <h3 class="font-black text-lg mb-2">Terminal Widget</h3>
                ${d(`File Name`,r.fileName,`adminSet('terminal','fileName',this.value)`)}
                ${d(`Object Name`,r.objectName,`adminSet('terminal','objectName',this.value)`)}
                ${d(`Name`,r.name,`adminSet('terminal','name',this.value)`)}
                ${d(`Title`,r.titleField,`adminSet('terminal','titleField',this.value)`)}
                ${d(`Location`,r.location,`adminSet('terminal','location',this.value)`)}
                ${d(`Stack (virgülle ayırın)`,(r.stack||[]).join(`, `),`adminSetArray('terminal','stack',this.value)`)}
                ${d(`Status`,r.status,`adminSet('terminal','status',this.value)`)}
                ${d(`Interests (virgülle ayırın)`,(r.interests||[]).join(`, `),`adminSetArray('terminal','interests',this.value)`)}
            `);break;case`contact`:e.innerHTML=p(`
                <h3 class="font-black text-lg mb-2">Kişisel Bilgiler</h3>
                ${d(`Full Name`,i.name,`adminMetaSet('name',this.value)`)}
                ${d(`Title`,i.title,`adminMetaSet('title',this.value)`)}
                ${d(`Profil Fotoğrafı URL`,i.profileImageUrl||``,`adminMetaSet('profileImageUrl',this.value)`)}
                <p class="text-[11px] opacity-40 ml-1">Boş bırakırsanız assets/profile.jpg kullanılır.</p>
                <hr class="border-white/5 my-2"/>
                ${d(`Email`,i.contact.email,`adminContactSet('email',this.value)`)}
                ${d(`Phone`,i.contact.phone,`adminContactSet('phone',this.value)`)}
                ${d(`LinkedIn (linkedin.com/in/...)`,i.contact.linkedin,`adminContactSet('linkedin',this.value)`)}
                ${d(`GitHub (github.com/...)`,i.contact.github,`adminContactSet('github',this.value)`)}
                ${d(`Website (opsiyonel)`,i.contact.website||``,`adminContactSet('website',this.value)`)}
            `);break;case`about`:e.innerHTML=p(`
                <h3 class="font-black text-lg mb-2">Hakkında Bölümü</h3>
                ${d(`Section Title`,a.aboutTitle,`adminSectionSet('aboutTitle',this.value)`)}
                ${d(`Bio Card Title`,a.bioTitle,`adminSectionSet('bioTitle',this.value)`)}
                ${f(`Bio Text`,a.bioText,`adminSectionSet('bioText',this.value)`)}
                ${d(`Education Title`,a.educationTitle,`adminSectionSet('educationTitle',this.value)`)}
                ${d(`Work Title`,a.workTitle,`adminSectionSet('workTitle',this.value)`)}
            `);break;case`education`:e.innerHTML=`<div class="space-y-6">
                <button onclick="adminAddItem('education',{institution:'',degree:'',period:'',gpa:'',_order:${(o||[]).length}})"
                    class="px-6 py-3 rounded-2xl bg-[rgb(var(--m3-primary))] text-white font-bold flex items-center gap-2 hover:opacity-90 transition-all">
                    <span class="material-symbols-outlined">add</span>Eğitim Ekle
                </button>
                ${(o||[]).map((e,t)=>p(`
                    <div class="flex justify-between items-center mb-3">
                        <span class="font-black opacity-40 text-lg">#${t+1}</span>
                        <button onclick="adminDeleteItem('education','${e._id}')" class="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20">Sil</button>
                    </div>
                    ${d(`Kurum`,e.institution,`adminItemSet('education','${e._id}','institution',this.value)`)}
                    ${d(`Bölüm`,e.degree,`adminItemSet('education','${e._id}','degree',this.value)`)}
                    ${d(`Dönem`,e.period,`adminItemSet('education','${e._id}','period',this.value)`)}
                    ${d(`GPA (opsiyonel)`,e.gpa||``,`adminItemSet('education','${e._id}','gpa',this.value)`)}
                `)).join(``)}
            </div>`;break;case`experience`:e.innerHTML=`<div class="space-y-6">
                <button onclick="adminAddItem('experience',{role:'',company:'',period:'',type:'',description:[],_order:${(s||[]).length}})"
                    class="px-6 py-3 rounded-2xl bg-[rgb(var(--m3-primary))] text-white font-bold flex items-center gap-2 hover:opacity-90 transition-all">
                    <span class="material-symbols-outlined">add</span>Deneyim Ekle
                </button>
                ${(s||[]).map((e,t)=>p(`
                    <div class="flex justify-between items-center mb-3">
                        <span class="font-black opacity-40 text-lg">#${t+1}</span>
                        <button onclick="adminDeleteItem('experience','${e._id}')" class="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20">Sil</button>
                    </div>
                    ${d(`Pozisyon`,e.role,`adminItemSet('experience','${e._id}','role',this.value)`)}
                    ${d(`Şirket`,e.company,`adminItemSet('experience','${e._id}','company',this.value)`)}
                    ${d(`Dönem`,e.period,`adminItemSet('experience','${e._id}','period',this.value)`)}
                    ${d(`Tür`,e.type,`adminItemSet('experience','${e._id}','type',this.value)`)}
                    ${f(`Açıklamalar (her satır bir madde)`,(e.description||[]).join(`
`),`adminItemSetArray('experience','${e._id}','description',this.value)`)}
                `)).join(``)}
            </div>`;break;case`projects`:e.innerHTML=`<div class="space-y-6">
                <div class="flex flex-wrap gap-3">
                    <button onclick="adminAddItem('projects',{title:'',technologies:[],category:'',featured:false,githubUrl:'',liveUrl:'',imageUrl:'',description:[],isHidden:true,_order:${(c||[]).length}})"
                        class="px-6 py-3 rounded-2xl bg-[rgb(var(--m3-primary))] text-white font-bold flex items-center gap-2 hover:opacity-90 transition-all">
                        <span class="material-symbols-outlined">add</span>Proje Ekle
                    </button>
                    <button onclick="adminSyncGithub()"
                        class="px-6 py-3 rounded-2xl bg-[#24292e] dark:bg-white dark:text-black text-white font-bold flex items-center gap-2 hover:opacity-80 transition-all">
                        <span class="material-symbols-outlined">sync</span>GitHub'dan Getir
                    </button>
                </div>
                ${(c||[]).map((e,t)=>`
                    <div class="p-6 rounded-[1.5rem] border transition-all space-y-4
                        ${e.isHidden?`opacity-60 border-dashed border-white/10 bg-[rgb(var(--m3-surface-container))]`:`border-white/5 bg-[rgb(var(--m3-surface-container-high))] shadow-md`}">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <span class="font-black opacity-40">#${t+1}</span>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${e.isHidden?`bg-red-500/20 text-red-400`:`bg-green-500/20 text-green-400`}">${e.isHidden?`GİZLİ`:`GÖRÜNÜR`}</span>
                                ${e.featured?`<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400">★ Öne Çıkan</span>`:``}
                            </div>
                            <div class="flex gap-2">
                                <button onclick="adminItemSet('projects','${e._id}','isHidden',${!e.isHidden})"
                                    class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${e.isHidden?`bg-green-500/20 text-green-400 hover:bg-green-500/30`:`bg-orange-500/20 text-orange-400 hover:bg-orange-500/30`}">
                                    ${e.isHidden?`Göster`:`Gizle`}
                                </button>
                                <button onclick="adminItemSet('projects','${e._id}','featured',${!e.featured})"
                                    class="px-3 py-1.5 rounded-xl text-xs font-bold bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-all">
                                    ${e.featured?`★ Öne Çıkarma`:`☆ Öne Çıkar`}
                                </button>
                                <button onclick="adminDeleteItem('projects','${e._id}')" class="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20">Sil</button>
                            </div>
                        </div>
                        ${d(`Başlık`,e.title,`adminItemSet('projects','${e._id}','title',this.value)`)}
                        ${d(`Görsel URL (boş = otomatik)`,e.imageUrl||``,`adminItemSet('projects','${e._id}','imageUrl',this.value)`)}
                        ${d(`Teknolojiler (virgülle)`,(e.technologies||[]).join(`, `),`adminItemSetArray('projects','${e._id}','technologies',this.value)`)}
                        ${d(`Kategori (Mobile, Web, Game Dev…)`,e.category||``,`adminItemSet('projects','${e._id}','category',this.value)`)}
                        ${d(`GitHub URL`,e.githubUrl||``,`adminItemSet('projects','${e._id}','githubUrl',this.value)`)}
                        ${d(`Live URL (opsiyonel)`,e.liveUrl||``,`adminItemSet('projects','${e._id}','liveUrl',this.value)`)}
                        ${f(`Açıklamalar (her satır bir madde)`,(e.description||[]).join(`
`),`adminItemSetArray('projects','${e._id}','description',this.value)`)}
                    </div>`).join(``)}
            </div>`;break;case`skills`:e.innerHTML=`<div class="space-y-6">
                <button onclick="adminAddItem('skills',{category:'',icon:'star',items:[],_order:${(u||[]).length}})"
                    class="px-6 py-3 rounded-2xl bg-[rgb(var(--m3-primary))] text-white font-bold flex items-center gap-2 hover:opacity-90">
                    <span class="material-symbols-outlined">add</span>Kategori Ekle
                </button>
                ${(u||[]).map((e,t)=>p(`
                    <div class="flex justify-between items-center mb-3">
                        <span class="font-black opacity-40 text-lg">#${t+1}</span>
                        <button onclick="adminDeleteItem('skills','${e._id}')" class="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20">Sil</button>
                    </div>
                    ${d(`Kategori Adı`,e.category,`adminItemSet('skills','${e._id}','category',this.value)`)}
                    ${d(`Icon (Material Symbol adı)`,e.icon||`star`,`adminItemSet('skills','${e._id}','icon',this.value)`)}
                    ${d(`Yetenekler (virgülle)`,(e.items||[]).join(`, `),`adminItemSetArray('skills','${e._id}','items',this.value)`)}
                `)).join(``)}
            </div>`;break;case`cv`:let m=!!localStorage.getItem(`cvBase64_${l.lang}`);e.innerHTML=p(`
                <h3 class="font-black text-lg mb-2">CV / Resume — ${l.lang.toUpperCase()}</h3>
                <p class="text-sm opacity-50 mb-4">Seçenek 1: Doğrudan PDF linki girin (Google Drive, Dropbox vs.)</p>
                ${d(`Resume Download URL`,l.data.branding.resumeDownloadUrl||``,`adminSet('branding','resumeDownloadUrl',this.value)`)}
                <hr class="border-white/5 my-2"/>
                <p class="text-sm opacity-50">Seçenek 2: PDF dosyası yükleyin (max ~4MB, tarayıcıda saklanır)</p>
                <input type="file" accept=".pdf" onchange="adminHandleCVUpload(this)"
                    class="w-full px-5 py-3.5 rounded-2xl bg-[rgb(var(--m3-surface-container))] border border-dashed border-[rgb(var(--m3-outline))]/30 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[rgb(var(--m3-primary))] file:text-white file:font-bold file:text-xs cursor-pointer"/>
                ${m?`<div class="flex items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <span class="text-sm text-green-400 font-bold">✓ PDF yüklü</span>
                        <button onclick="adminRemoveCV()" class="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold">Sil</button>
                       </div>`:`<p class="text-sm opacity-40">Henüz PDF yüklenmedi.</p>`}
            `);break;default:e.innerHTML=`<div class="p-8 text-center opacity-40">Düzenlenecek bölümü seçin.</div>`}}window.adminSet=(e,t,n)=>{l.data[e]&&(l.data[e][t]=n,y(e,l.data[e]))},window.adminSetArray=(e,t,n)=>{l.data[e]&&(l.data[e][t]=n.split(`,`).map(e=>e.trim()).filter(Boolean),y(e,l.data[e]))},window.adminMetaSet=(e,t)=>{l.data.meta[e]=t,y(`meta`,l.data.meta)},window.adminContactSet=(e,t)=>{l.data.meta.contact[e]=t,y(`meta`,l.data.meta)},window.adminSectionSet=(e,t)=>{l.data.sections[e]=t,y(`sections`,l.data.sections)},window.adminItemSet=async(e,n,r,i)=>{let a=l.data[e]?.find(e=>e._id===n);a&&(a[r]=i),await t(l.lang,e,n,{[r]:i}),typeof i==`boolean`&&_(),x()},window.adminItemSetArray=async(e,n,r,i)=>{let a=i.split(`
`).map(e=>e.trim()).filter(Boolean),o=l.data[e]?.find(e=>e._id===n);o&&(o[r]=a),await t(l.lang,e,n,{[r]:a}),x()},window.adminAddItem=async(e,t)=>{let n=await c(l.lang,e,t);l.data[e]||(l.data[e]=[]),l.data[e].push(n),_(),x()},window.adminDeleteItem=async(e,t)=>{confirm(`Silmek istediğinize emin misiniz?`)&&(await n(l.lang,e,t),l.data[e]&&(l.data[e]=l.data[e].filter(e=>e._id!==t)),_(),x())},window.adminHandleCVUpload=e=>{let t=e.files[0];if(!t?.type?.includes(`pdf`))return;let n=new FileReader;n.onload=()=>{let e=n.result.split(`,`)[1];if(e.length>5e6){S(`Dosya çok büyük (max ~4MB)`,`error`);return}localStorage.setItem(`cvBase64_${l.lang}`,e),localStorage.setItem(`cvFileName_${l.lang}`,t.name),_(),x()},n.readAsDataURL(t),e.value=``},window.adminRemoveCV=()=>{localStorage.removeItem(`cvBase64_${l.lang}`),localStorage.removeItem(`cvFileName_${l.lang}`),_()},window.adminSyncGithub=async()=>{let t=l.data?.meta?.contact?.github;if(!t){S(`Önce İletişim bölümüne GitHub adresinizi girin.`,`error`);return}let n=t.replace(/^https?:\/\//,``).replace(`github.com/`,``).split(`/`)[0];if(!n){S(`Geçersiz GitHub URL.`,`error`);return}let r=document.querySelector(`[onclick="adminSyncGithub()"]`);r&&(r.innerHTML=`<span class="material-symbols-outlined animate-spin">sync</span> Syncing...`,r.disabled=!0);try{let t=await e(n),r=l.data.projects||[],i=0;for(let e of t)e.fork||r.find(t=>t.githubUrl&&t.githubUrl.toLowerCase().includes(e.html_url.toLowerCase())||t.title&&t.title.toLowerCase()===e.name.toLowerCase())||(await window.adminAddItem(`projects`,{title:e.name.replace(/[-_]/g,` `),technologies:e.language?[e.language]:[],category:`GitHub`,featured:!1,githubUrl:e.html_url,liveUrl:``,imageUrl:``,description:e.description?[e.description]:[],isHidden:!0,_order:r.length+i}),i++);S(`${t.length} repo tarandı, ${i} yeni proje eklendi (varsayılan olarak gizli).`,`success`)}catch(e){S(`GitHub sync hatası: `+e.message,`error`)}finally{r&&(r.innerHTML=`<span class="material-symbols-outlined">sync</span>GitHub'dan Getir`,r.disabled=!1)}};var v={};function y(e,t){clearTimeout(v[e]),v[e]=setTimeout(async()=>{await r(l.lang,e,t),x()},600)}async function b(){if(!l.data)return;let e={branding:`branding`,hero:`hero`,terminal:`terminal`,contact:`meta`,about:`sections`,footer:`footer`}[l.activeTab];e&&await r(l.lang,e,l.data[e])}function x(){let e=document.getElementById(`save-toast`);e&&(e.classList.remove(`opacity-0`,`translate-y-4`),clearTimeout(x._t),x._t=setTimeout(()=>e.classList.add(`opacity-0`,`translate-y-4`),2e3))}function S(e,t=`success`){let n=document.getElementById(`admin-alert`);if(!n){alert(e);return}n.textContent=e,n.className=`fixed top-6 left-1/2 -translate-x-1/2 z-[120] px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all ${t===`error`?`bg-red-600 text-white`:`bg-green-600 text-white`}`,n.style.opacity=`1`,clearTimeout(S._t),S._t=setTimeout(()=>{n.style.opacity=`0`},3e3)}function C(e){return(e??``).toString().replace(/"/g,`&quot;`).replace(/&/g,`&amp;`)}function w(e){return(e??``).toString().replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}