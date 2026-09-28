/**
 * ADMIN STUDIO & WEBMAIL LOGIC — HARDILAL.DEV
 * Handles authentication, full in-place content editing, reordering,
 * image uploading, contact inbox, and outbound email dispatch.
 */

// Default content state (if not customized yet in D1)
const defaultPortfolioContent = {
  hero: {
    status: "Tersedia untuk Proyek Baru & Freelance",
    title_prefix: "Membangun Pengalaman Web yang ",
    title_highlight: "Elegan",
    title_suffix: ", Cepat & Berdampak.",
    subtitle: "Halo! Saya Hardilal Danuarta, seorang Full-Stack & Frontend Developer yang berfokus menciptakan produk web modern dengan estetika minimalis, performa optimal, dan arsitektur kode yang terstruktur.",
    avatar_url: "assets/images/avatar.jpg",
    cv_url: "#",
    social_github: "https://github.com/hardilal97-eng",
    social_linkedin: "https://linkedin.com",
    social_email: "contact@hardilal.my.id",
    metrics: [
      { val: 4, suffix: "+", label: "Tahun Pengalaman" },
      { val: 28, suffix: "+", label: "Proyek Terselesaikan" },
      { val: 99, suffix: "%", label: "Kepuasan Klien" },
      { val: 15, suffix: "+", label: "Teknologi Dikuasai" }
    ]
  },
  about: {
    title: "Menggabungkan Logika Teknis & Rasa Estetika",
    desc: "Membantu startup dan bisnis mewujudkan antarmuka digital yang tidak hanya memukau dipandang, namun juga tangguh, aman, dan mudah diskalakan.",
    cards: [
      {
        index: "01 / ARCHITECTURE",
        title: "Clean Code & Architecture",
        text: "Menulis kode terstruktur, modular, dan mematuhi best practices (DRY, SOLID, semantic HTML) sehingga mudah dirawat dan dikembangkan oleh tim engineer."
      },
      {
        index: "02 / OPTIMIZATION",
        title: "Ultra-Fast Performance",
        text: "Optimasi performa halaman, efisiensi bundle, caching pintar, dan Core Web Vitals untuk memastikan kecepatan loading instan di jaringan mana pun."
      },
      {
        index: "03 / EXPERIENCE",
        title: "User-Centric Experience",
        text: "Memastikan setiap alur interaksi intuitif, ramah aksesibilitas (a11y), responsif di layar ponsel hingga monitor 4K, serta micro-interactions yang mulus."
      }
    ]
  },
  skills: {
    categories: [
      {
        name: "Frontend Engineering",
        tags: ["HTML5 / Semantic", "CSS3 / Modern CSS", "JavaScript (ES6+)", "TypeScript", "React.js", "Next.js", "Tailwind CSS", "Web Performance"]
      },
      {
        name: "Backend & Database",
        tags: ["Node.js", "Express.js", "RESTful API", "PostgreSQL", "Cloudflare D1", "MongoDB", "Prisma ORM", "Authentication / JWT"]
      },
      {
        name: "Tools & Alur Kerja",
        tags: ["Git & GitHub", "Cloudflare Workers", "Docker Basics", "Figma to Code", "Vercel / Netlify", "Postman / API Test", "Vite & Webpack", "Agile / Scrum"]
      }
    ]
  },
  projects: [
    {
      id: "proj-analytics",
      category: "dashboard",
      badge: "SaaS & Analytics",
      year: "2026",
      title: "Analytics Hub — Real-time Metric Platform",
      summary: "Dashboard visualisasi data interaktif untuk memonitor metrik konversi, tren pendapatan harian, dan demografi pengguna secara waktu-nyata.",
      image: "assets/images/project-analytics.jpg",
      tags: ["React", "Tailwind CSS", "Chart.js", "Node.js API"],
      github: "https://github.com/hardilal97-eng/hardilal-porto",
      demo: "https://hardilal.my.id",
      modal_category: "SaaS & Analytics Platform",
      modal_desc: "Platform dashboard yang dirancang untuk membantu tim operasional bisnis memantau pertumbuhan pengguna, konversi funnel, dan pendapatan harian secara real-time. Dilengkapi dengan grafik adaptif dan filter interaktif 30 hari.",
      modal_features: [
        "Sinkronisasi data real-time menggunakan WebSockets dan Redis cache.",
        "Grafik visualisasi responsif dengan Chart.js dan SVG adaptif.",
        "Dukungan tema resolusi tinggi dengan transisi visual mulus.",
        "Export laporan metrik otomatis ke format PDF & CSV."
      ],
      modal_tags: ["React.js", "TypeScript", "Tailwind CSS", "Chart.js", "Node.js / Express", "PostgreSQL"]
    },
    {
      id: "proj-fintech",
      category: "fintech",
      badge: "FinTech & Web App",
      year: "2025",
      title: "NeoBank — Next-Gen Smart Wallet",
      summary: "Platform pengelolaan kartu debit virtual, pelacakan riwayat transaksi otomatis, dan analisis arus kas belanja vs pendapatan bulanan.",
      image: "assets/images/project-fintech.jpg",
      tags: ["Next.js", "TypeScript", "Cloudflare D1", "Tailwind"],
      github: "https://github.com/hardilal97-eng/hardilal-porto",
      demo: "https://hardilal.my.id",
      modal_category: "FinTech & Web App",
      modal_desc: "Solusi perbankan digital modern yang menyederhanakan manajemen pengeluaran harian pengguna. Dilengkapi dengan fitur kartu virtual multi-mata uang, sistem transfer instan, dan visualisasi perbandingan belanja vs tabungan.",
      modal_features: [
        "Enkripsi data tingkat perbankan (AES-256) untuk keamanan transaksi.",
        "Kategorisasi transaksi otomatis dengan algoritma analisis pengeluaran.",
        "Desain antarmuka clean & intuitif yang mengedepankan kemudahan akses.",
        "Fitur freeze/unfreeze kartu instan dengan sekali klik."
      ],
      modal_tags: ["Next.js 14", "TypeScript", "Cloudflare D1", "Tailwind CSS", "Stripe API Mock"]
    },
    {
      id: "proj-ai",
      category: "ai",
      badge: "AI & Productivity",
      year: "2026",
      title: "Aurora — AI Workflow & Kanban Studio",
      summary: "Ruang kerja kolaboratif desainer & engineer berbasis AI prompt generator yang terhubung langsung dengan Kanban board task management.",
      image: "assets/images/project-ai.jpg",
      tags: ["Vue 3 / React", "WebSockets", "FastAPI", "Redis"],
      github: "https://github.com/hardilal97-eng/hardilal-porto",
      demo: "https://hardilal.my.id",
      modal_category: "AI & Productivity Workspace",
      modal_desc: "Aplikasi kolaborasi workspace yang menggabungkan generative AI prompt engineering dengan manajemen proyek papan Kanban. Membantu tim kreatif merancang ide dan melacak sprint desain tanpa berpindah aplikasi.",
      modal_features: [
        "Prompt builder modular dengan parameter style, aspect ratio, dan mood.",
        "Drag-and-drop Kanban sprint board dengan status live kolaboratif.",
        "Multi-user synchronization real-time menggunakan WebSockets.",
        "Estetika gelap berestetika tinggi dan nyaman di mata."
      ],
      modal_tags: ["React", "FastAPI (Python)", "WebSockets", "Redis", "Modern CSS"]
    }
  ],
  experience: [
    {
      period: "2024 — Sekarang",
      badge: "Full-time",
      role: "Senior Frontend Engineer",
      company: "Nusantara Digital Tech • Jakarta (Remote)",
      bullets: [
        "Memimpin perancangan ulang arsitektur frontend web app utama, meningkatkan Core Web Vitals sebesar 42%.",
        "Membangun internal design system berbasis komponen reusable yang mempercepat siklus delivery fitur baru hingga 35%.",
        "Bekerja sama dengan tim UI/UX dan backend engineer untuk mengintegrasikan RESTful & GraphQL endpoints yang aman."
      ]
    },
    {
      period: "2022 — 2024",
      badge: "Full-time",
      role: "Full-Stack Web Developer",
      company: "Creative Inovasi Solusi • Bandung",
      bullets: [
        "Mengembangkan lebih dari 15+ aplikasi web interaktif untuk klien enterprise dan startup lokal.",
        "Mengimplementasikan pipeline CI/CD otomatis menggunakan GitHub Actions, mengurangi downtime rilis hingga 80%.",
        "Melakukan refactoring database queries yang mengurangi response time rata-rata server dari 650ms ke 120ms."
      ]
    },
    {
      period: "2018 — 2022",
      badge: "Edukasi",
      role: "Sarjana Ilmu Komputer (S.Kom)",
      company: "Universitas Terkemuka • IPK 3.84 / 4.00",
      bullets: [
        "Fokus studi: Rekayasa Perangkat Lunak, Struktur Data & Algoritma, serta Interaksi Manusia dan Komputer (HCI).",
        "Juara 2 National University Hackathon untuk kategori Solusi Web Edukasi Digital."
      ]
    }
  ],
  testimonials: [
    {
      monogram: "BW",
      name: "Budi Wicaksono",
      title: "Product Manager, FinTech Global",
      text: "Hardilal memiliki kombinasi langka antara selera desain yang sangat teliti dan pemahaman teknis arsitektur web yang solid. Proyek dashboard kami selesai lebih cepat dari jadwal!"
    },
    {
      monogram: "ST",
      name: "Siti Triana",
      title: "CTO, EduTech Studio",
      text: "Kualitas kode sangat rapi dan dokumentasinya lengkap. Menyerahkan tugas development frontend ke Hardilal selalu memberikan rasa tenang karena hasilnya selalu melampaui ekspektasi."
    }
  ],
  contact: {
    email: "contact@hardilal.my.id",
    location: "Jakarta / Bandung (Remote Available)",
    phone: "+62 812-3456-7890"
  }
};

let currentContent = JSON.parse(JSON.stringify(defaultPortfolioContent));

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    showDashboard();
  } else {
    showLogin();
  }

  // 1. Login Handler
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.textContent = '';
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok && data.token) {
          localStorage.setItem('admin_token', data.token);
          showToast('Login berhasil! Selamat datang.');
          showDashboard();
        } else {
          loginError.textContent = data.error || 'Username atau password salah.';
        }
      } catch (err) {
        loginError.textContent = 'Gagal menghubungi server: ' + err.message;
      }
    });
  }

  // 2. Logout Handler
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      const curToken = localStorage.getItem('admin_token');
      if (curToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${curToken}` }
        }).catch(() => {});
      }
      localStorage.removeItem('admin_token');
      showToast('Anda telah logout.');
      showLogin();
    });
  }

  // 3. Tab Navigation
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // 4. Change Password Form
  const changePasswordForm = document.getElementById('change-password-form');
  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const p1 = document.getElementById('new-admin-password').value;
      const p2 = document.getElementById('confirm-admin-password').value;
      if (p1 !== p2) {
        showToast('Password konfirmasi tidak cocok!');
        return;
      }
      const curToken = localStorage.getItem('admin_token');
      try {
        const res = await fetch('/api/auth/password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${curToken}`
          },
          body: JSON.stringify({ newPassword: p1 })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast('Password berhasil diperbarui! 🔑');
          changePasswordForm.reset();
        } else {
          showToast(data.error || 'Gagal mengubah password');
        }
      } catch (err) {
        showToast(err.message);
      }
    });
  }

  // 5. Save Buttons (Top & Bottom)
  const btnSaveTop = document.getElementById('btn-save-content-top');
  const btnSaveBottom = document.getElementById('btn-save-content-bottom');
  if (btnSaveTop) btnSaveTop.addEventListener('click', savePortfolioContent);
  if (btnSaveBottom) btnSaveBottom.addEventListener('click', savePortfolioContent);

  // 6. Add Item Buttons
  document.getElementById('btn-add-project')?.addEventListener('click', () => {
    currentContent.projects.push({
      id: 'proj-' + Date.now(),
      category: 'dashboard',
      badge: 'Web Application',
      year: new Date().getFullYear().toString(),
      title: 'Judul Proyek Baru',
      summary: 'Deskripsi ringkas proyek ini dan solusi yang diberikan.',
      image: 'assets/images/project-analytics.jpg',
      tags: ['React', 'TypeScript', 'Tailwind'],
      github: 'https://github.com/hardilal97-eng/hardilal-porto',
      demo: 'https://hardilal.my.id',
      modal_category: 'Web App',
      modal_desc: 'Studi kasus lengkap proyek ini...',
      modal_features: ['Fitur utama 1', 'Fitur utama 2'],
      modal_tags: ['React', 'Node.js']
    });
    renderProjectsEditor();
    showToast('Proyek baru ditambahkan! Jangan lupa klik Simpan.');
  });

  document.getElementById('btn-add-timeline')?.addEventListener('click', () => {
    currentContent.experience.push({
      period: '2025 — Sekarang',
      badge: 'Full-time',
      role: 'Software Engineer',
      company: 'Nama Perusahaan / Organisasi',
      bullets: ['Deskripsi pencapaian atau tanggung jawab utama...']
    });
    renderTimelineEditor();
    showToast('Riwayat baru ditambahkan!');
  });

  document.getElementById('btn-add-testimonial')?.addEventListener('click', () => {
    currentContent.testimonials.push({
      monogram: 'CL',
      name: 'Nama Klien',
      title: 'CEO / Project Lead',
      text: 'Rekomendasi atau testimoni hasil kerja sama yang memuaskan.'
    });
    renderTestimonialsEditor();
    showToast('Testimoni baru ditambahkan!');
  });

  // 10. Avatar Upload File
  const uploadAvatarInput = document.getElementById('upload-avatar-file');
  if (uploadAvatarInput) {
    uploadAvatarInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        showToast('Ukuran gambar maksimal 2MB!');
        return;
      }

      showToast('Mengupload foto profil...');
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target.result;
        const curToken = localStorage.getItem('admin_token');
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${curToken}`
            },
            body: JSON.stringify({ dataUrl })
          });
          const data = await res.json();
          if (res.ok && data.url) {
            currentContent.hero.avatar_url = data.url;
            document.getElementById('avatar-preview').src = data.url;
            document.getElementById('edit-hero-avatar-url').value = data.url;
            document.getElementById('avatar-source-text').textContent = data.url;
            showToast('Foto profil berhasil diupload! Klik Simpan.');
          } else {
            showToast('Gagal upload: ' + (data.error || 'Server error'));
          }
        } catch (err) {
          showToast('Upload error: ' + err.message);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Avatar URL Manual Input
  const editAvatarUrlInput = document.getElementById('edit-hero-avatar-url');
  if (editAvatarUrlInput) {
    editAvatarUrlInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val) {
        document.getElementById('avatar-preview').src = val;
        document.getElementById('avatar-source-text').textContent = val;
        currentContent.hero.avatar_url = val;
      }
    });
  }
});

// UI Views Toggle
function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('dashboard-screen').style.display = 'none';
}

function showDashboard() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('dashboard-screen').style.display = 'block';
  loadPortfolioContent();
  loadInboxMessages();
}

// Fetch Content from D1
async function loadPortfolioContent() {
  try {
    const res = await fetch('/api/content');
    const data = await res.json();
    if (res.ok && data.content) {
      currentContent = Object.assign({}, defaultPortfolioContent, data.content);
    } else {
      currentContent = JSON.parse(JSON.stringify(defaultPortfolioContent));
    }
  } catch (err) {
    console.error('Error fetching content:', err);
    currentContent = JSON.parse(JSON.stringify(defaultPortfolioContent));
  }

  populateEditorFields();
}

// Populate Fields with Data
function populateEditorFields() {
  const h = currentContent.hero || {};
  document.getElementById('edit-hero-status').value = h.status || '';
  document.getElementById('edit-hero-title-prefix').value = h.title_prefix || '';
  document.getElementById('edit-hero-title-highlight').value = h.title_highlight || '';
  document.getElementById('edit-hero-title-suffix').value = h.title_suffix || '';
  document.getElementById('edit-hero-subtitle').value = h.subtitle || '';
  document.getElementById('edit-hero-avatar-url').value = h.avatar_url || '';
  document.getElementById('avatar-preview').src = h.avatar_url || 'assets/images/avatar.jpg';
  document.getElementById('avatar-source-text').textContent = h.avatar_url || 'assets/images/avatar.jpg';

  // Metrics
  const metricsBox = document.getElementById('metrics-editor-container');
  metricsBox.innerHTML = '';
  (h.metrics || []).forEach((m, idx) => {
    metricsBox.innerHTML += `
      <div class="card-editor-item">
        <div class="form-group mb-8">
          <label class="text-sm">Nilai Angka</label>
          <input type="text" value="${m.val}" onchange="currentContent.hero.metrics[${idx}].val = this.value">
        </div>
        <div class="form-group mb-8">
          <label class="text-sm">Suffix (+ atau %)</label>
          <input type="text" value="${m.suffix}" onchange="currentContent.hero.metrics[${idx}].suffix = this.value">
        </div>
        <div class="form-group">
          <label class="text-sm">Label</label>
          <input type="text" value="${m.label}" onchange="currentContent.hero.metrics[${idx}].label = this.value">
        </div>
      </div>
    `;
  });

  // About
  const ab = currentContent.about || {};
  document.getElementById('edit-about-title').value = ab.title || '';
  document.getElementById('edit-about-desc').value = ab.desc || '';

  const aboutCardsBox = document.getElementById('about-cards-container');
  aboutCardsBox.innerHTML = '';
  (ab.cards || []).forEach((c, idx) => {
    aboutCardsBox.innerHTML += `
      <div class="card-editor-item">
        <div class="form-group">
          <label>Indeks / Tag</label>
          <input type="text" value="${c.index}" onchange="currentContent.about.cards[${idx}].index = this.value">
        </div>
        <div class="form-group">
          <label>Judul Kartu</label>
          <input type="text" value="${c.title}" onchange="currentContent.about.cards[${idx}].title = this.value">
        </div>
        <div class="form-group">
          <label>Isi Penjelasan</label>
          <textarea rows="3" onchange="currentContent.about.cards[${idx}].text = this.value">${c.text}</textarea>
        </div>
      </div>
    `;
  });

  // Skills
  renderSkillsEditor();

  // Projects
  renderProjectsEditor();

  // Timeline
  renderTimelineEditor();

  // Testimonials
  renderTestimonialsEditor();

  // Contact
  const c = currentContent.contact || {};
  document.getElementById('edit-contact-email').value = c.email || '';
  document.getElementById('edit-contact-phone').value = c.phone || '';
  document.getElementById('edit-contact-location').value = c.location || '';
  document.getElementById('edit-social-github').value = h.social_github || '';
  document.getElementById('edit-social-linkedin').value = h.social_linkedin || '';
}

// Render Skills
function renderSkillsEditor() {
  const box = document.getElementById('skills-editor-container');
  box.innerHTML = '';
  (currentContent.skills.categories || []).forEach((cat, cIdx) => {
    let tagsHtml = (cat.tags || []).map((t, tIdx) => `
      <span class="tag-badge">
        <span>${t}</span>
        <button type="button" onclick="removeSkillTag(${cIdx}, ${tIdx})">×</button>
      </span>
    `).join('');

    box.innerHTML += `
      <div class="skill-cat-box">
        <div class="form-group">
          <label>Nama Kategori</label>
          <input type="text" value="${cat.name}" onchange="currentContent.skills.categories[${cIdx}].name = this.value">
        </div>
        <div class="form-group">
          <label>Daftar Tags:</label>
          <div class="skill-tags-editor">${tagsHtml}</div>
          <div class="flex gap-8">
            <input type="text" id="new-tag-${cIdx}" placeholder="Tambah tag..." onkeydown="if(event.key==='Enter'){event.preventDefault(); addSkillTag(${cIdx});}">
            <button type="button" class="btn btn-sm btn-outline mt-8" onclick="addSkillTag(${cIdx})">+ Tambah</button>
          </div>
        </div>
      </div>
    `;
  });
}

function addSkillTag(cIdx) {
  const input = document.getElementById(`new-tag-${cIdx}`);
  const val = input.value.trim();
  if (val) {
    currentContent.skills.categories[cIdx].tags.push(val);
    renderSkillsEditor();
  }
}

function removeSkillTag(cIdx, tIdx) {
  currentContent.skills.categories[cIdx].tags.splice(tIdx, 1);
  renderSkillsEditor();
}

// Render Projects Stack with Move Up, Move Down, Delete, and Edit
function renderProjectsEditor() {
  const box = document.getElementById('projects-editor-list');
  box.innerHTML = '';

  (currentContent.projects || []).forEach((proj, idx) => {
    box.innerHTML += `
      <div class="project-item-card" data-idx="${idx}">
        <div class="item-control-bar">
          <div>
            <strong>#${idx + 1} — ${proj.title}</strong>
            <span class="text-sm text-lime ml-8">[Kategori: ${proj.category}]</span>
          </div>
          <div class="item-order-actions">
            <button type="button" class="btn btn-sm btn-secondary" onclick="moveProject(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>▲ Geser Naik</button>
            <button type="button" class="btn btn-sm btn-secondary" onclick="moveProject(${idx}, 1)" ${idx === currentContent.projects.length - 1 ? 'disabled' : ''}>▼ Geser Turun</button>
            <button type="button" class="btn btn-sm btn-danger" onclick="deleteProject(${idx})">🗑️ Hapus</button>
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label>Judul Proyek</label>
            <input type="text" value="${proj.title}" onchange="currentContent.projects[${idx}].title = this.value">
          </div>
          <div class="form-group">
            <label>Kategori Filter</label>
            <select onchange="currentContent.projects[${idx}].category = this.value">
              <option value="dashboard" ${proj.category === 'dashboard' ? 'selected' : ''}>dashboard (SaaS & Analytics)</option>
              <option value="fintech" ${proj.category === 'fintech' ? 'selected' : ''}>fintech (FinTech & Web)</option>
              <option value="ai" ${proj.category === 'ai' ? 'selected' : ''}>ai (AI & Produktivitas)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Tahun</label>
            <input type="text" value="${proj.year}" onchange="currentContent.projects[${idx}].year = this.value">
          </div>
        </div>

        <div class="form-group">
          <label>Ringkasan Singkat (Summary)</label>
          <textarea rows="2" onchange="currentContent.projects[${idx}].summary = this.value">${proj.summary}</textarea>
        </div>

        <div class="form-grid-2 align-center">
          <div class="form-group">
            <label>Path / URL Screenshot Gambar</label>
            <input type="text" id="proj-img-input-${idx}" value="${proj.image}" onchange="currentContent.projects[${idx}].image = this.value; document.getElementById('proj-thumb-preview-${idx}').src = this.value;">
            <div class="mt-8">
              <label class="text-sm">Atau upload gambar baru:</label>
              <input type="file" accept="image/*" onchange="uploadProjectImage(event, ${idx})">
            </div>
          </div>
          <div class="avatar-preview-box">
            <img id="proj-thumb-preview-${idx}" src="${proj.image}" style="width: 100px; height: 60px; object-fit: cover;">
            <span class="text-sm text-muted">Preview Thumbnail</span>
          </div>
        </div>

        <div class="form-grid-2 mt-8">
          <div class="form-group">
            <label>Tech Tags (pisahkan dengan koma)</label>
            <input type="text" value="${(proj.tags || []).join(', ')}" onchange="currentContent.projects[${idx}].tags = this.value.split(',').map(s=>s.trim()).filter(Boolean)">
          </div>
          <div class="form-group">
            <label>Link Source Code GitHub</label>
            <input type="url" value="${proj.github || ''}" onchange="currentContent.projects[${idx}].github = this.value">
          </div>
        </div>
      </div>
    `;
  });
}

function moveProject(idx, dir) {
  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= currentContent.projects.length) return;
  const temp = currentContent.projects[idx];
  currentContent.projects[idx] = currentContent.projects[targetIdx];
  currentContent.projects[targetIdx] = temp;
  renderProjectsEditor();
  showToast('Urutan posisi proyek diubah.');
}

function deleteProject(idx) {
  if (confirm(`Yakin ingin menghapus proyek "${currentContent.projects[idx].title}"?`)) {
    currentContent.projects.splice(idx, 1);
    renderProjectsEditor();
    showToast('Proyek berhasil dihapus dari daftar.');
  }
}

async function uploadProjectImage(event, idx) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    showToast('Ukuran gambar maksimal 2MB!');
    return;
  }

  showToast('Mengupload screenshot proyek...');
  const reader = new FileReader();
  reader.onload = async (e) => {
    const dataUrl = e.target.result;
    const curToken = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${curToken}`
        },
        body: JSON.stringify({ dataUrl })
      });
      const data = await res.json();
      if (res.ok && data.url) {
        currentContent.projects[idx].image = data.url;
        document.getElementById(`proj-img-input-${idx}`).value = data.url;
        document.getElementById(`proj-thumb-preview-${idx}`).src = data.url;
        showToast('Gambar proyek berhasil diupdate!');
      } else {
        showToast('Gagal upload gambar: ' + (data.error || 'Server error'));
      }
    } catch (err) {
      showToast('Upload error: ' + err.message);
    }
  };
  reader.readAsDataURL(file);
}

// Render Timeline Editor
function renderTimelineEditor() {
  const box = document.getElementById('timeline-editor-list');
  box.innerHTML = '';

  (currentContent.experience || []).forEach((exp, idx) => {
    box.innerHTML += `
      <div class="timeline-item-card">
        <div class="item-control-bar">
          <strong>#${idx + 1} — ${exp.role} (${exp.company})</strong>
          <div class="item-order-actions">
            <button type="button" class="btn btn-sm btn-secondary" onclick="moveTimeline(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>▲ Naik</button>
            <button type="button" class="btn btn-sm btn-secondary" onclick="moveTimeline(${idx}, 1)" ${idx === currentContent.experience.length - 1 ? 'disabled' : ''}>▼ Turun</button>
            <button type="button" class="btn btn-sm btn-danger" onclick="deleteTimeline(${idx})">🗑️ Hapus</button>
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label>Periode Waktu</label>
            <input type="text" value="${exp.period}" onchange="currentContent.experience[${idx}].period = this.value">
          </div>
          <div class="form-group">
            <label>Tipe Badge (Full-time / Edukasi)</label>
            <input type="text" value="${exp.badge}" onchange="currentContent.experience[${idx}].badge = this.value">
          </div>
          <div class="form-group">
            <label>Jabatan / Gelar</label>
            <input type="text" value="${exp.role}" onchange="currentContent.experience[${idx}].role = this.value">
          </div>
        </div>

        <div class="form-group">
          <label>Nama Perusahaan / Institusi</label>
          <input type="text" value="${exp.company}" onchange="currentContent.experience[${idx}].company = this.value">
        </div>

        <div class="form-group">
          <label>Pencapaian (satu baris per poin)</label>
          <textarea rows="3" onchange="currentContent.experience[${idx}].bullets = this.value.split('\\n').map(s=>s.trim()).filter(Boolean)">${(exp.bullets || []).join('\n')}</textarea>
        </div>
      </div>
    `;
  });
}

function moveTimeline(idx, dir) {
  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= currentContent.experience.length) return;
  const temp = currentContent.experience[idx];
  currentContent.experience[idx] = currentContent.experience[targetIdx];
  currentContent.experience[targetIdx] = temp;
  renderTimelineEditor();
}

function deleteTimeline(idx) {
  currentContent.experience.splice(idx, 1);
  renderTimelineEditor();
}

// Render Testimonials
function renderTestimonialsEditor() {
  const box = document.getElementById('testimonials-editor-list');
  box.innerHTML = '';

  (currentContent.testimonials || []).forEach((t, idx) => {
    box.innerHTML += `
      <div class="testimonial-item-card">
        <div class="item-control-bar">
          <strong>Testimoni #${idx + 1} — ${t.name}</strong>
          <button type="button" class="btn btn-sm btn-danger" onclick="deleteTestimonial(${idx})">🗑️ Hapus</button>
        </div>
        <div class="form-grid-3">
          <div class="form-group">
            <label>Nama Klien</label>
            <input type="text" value="${t.name}" onchange="currentContent.testimonials[${idx}].name = this.value">
          </div>
          <div class="form-group">
            <label>Jabatan / Perusahaan</label>
            <input type="text" value="${t.title}" onchange="currentContent.testimonials[${idx}].title = this.value">
          </div>
          <div class="form-group">
            <label>Inisial Monogram (2 huruf)</label>
            <input type="text" value="${t.monogram}" maxlength="3" onchange="currentContent.testimonials[${idx}].monogram = this.value">
          </div>
        </div>
        <div class="form-group">
          <label>Kutipan Testimoni</label>
          <textarea rows="2" onchange="currentContent.testimonials[${idx}].text = this.value">${t.text}</textarea>
        </div>
      </div>
    `;
  });
}

function deleteTestimonial(idx) {
  currentContent.testimonials.splice(idx, 1);
  renderTestimonialsEditor();
}

// Save all content to Cloudflare D1
async function savePortfolioContent() {
  // Collect inputs from static hero & contact fields
  currentContent.hero.status = document.getElementById('edit-hero-status').value.trim();
  currentContent.hero.title_prefix = document.getElementById('edit-hero-title-prefix').value;
  currentContent.hero.title_highlight = document.getElementById('edit-hero-title-highlight').value;
  currentContent.hero.title_suffix = document.getElementById('edit-hero-title-suffix').value;
  currentContent.hero.subtitle = document.getElementById('edit-hero-subtitle').value;
  currentContent.hero.avatar_url = document.getElementById('edit-hero-avatar-url').value.trim() || currentContent.hero.avatar_url;
  currentContent.hero.social_github = document.getElementById('edit-social-github').value.trim();
  currentContent.hero.social_linkedin = document.getElementById('edit-social-linkedin').value.trim();

  currentContent.about.title = document.getElementById('edit-about-title').value.trim();
  currentContent.about.desc = document.getElementById('edit-about-desc').value.trim();

  currentContent.contact.email = document.getElementById('edit-contact-email').value.trim();
  currentContent.contact.phone = document.getElementById('edit-contact-phone').value.trim();
  currentContent.contact.location = document.getElementById('edit-contact-location').value.trim();

  const curToken = localStorage.getItem('admin_token');
  const statusText = document.getElementById('save-status-text');
  statusText.textContent = 'Menyimpan ke Cloudflare D1...';

  try {
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${curToken}`
      },
      body: JSON.stringify(currentContent)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      statusText.textContent = '✓ Semua perubahan tersimpan permanen di Cloudflare D1 (' + new Date().toLocaleTimeString() + ')';
      showToast('Perubahan berhasil disimpan dan langsung aktif di web! ✨');
    } else {
      statusText.textContent = 'Gagal menyimpan: ' + (data.error || 'Server error');
      showToast('Gagal menyimpan perubahan');
    }
  } catch (err) {
    statusText.textContent = 'Error: ' + err.message;
    showToast('Error koneksi: ' + err.message);
  }
}

// Toast Utility
function showToast(msg) {
  const toast = document.getElementById('admin-toast');
  const text = document.getElementById('admin-toast-text');
  if (!toast || !text) return;
  text.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
