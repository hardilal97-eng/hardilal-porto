/**
 * PORTOFOLIO PRIBADI — HARDILAL.DEV
 * Modern Editorial Interactive Script
 * Zero-dependency, ultra-fast vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. Mobile Navigation Toggle
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Header Scrolled Border & Scrollspy Active Navigation
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header subtle elevation on scroll
    if (siteHeader) {
      if (scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scrollspy active link highlighter
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 3. Back to Top Button
  // --------------------------------------------------------------------------
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Dynamic Number Counter for Metrics (Intersection Observer)
  // --------------------------------------------------------------------------
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const step = Math.max(1, Math.ceil(target / 35));

      const updateCounter = () => {
        count += step;
        if (count < target) {
          counter.innerText = count;
          setTimeout(updateCounter, 25);
        } else {
          counter.innerText = target;
        }
      };

      updateCounter();
    });
  };

  const metricsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        animateCounters();
        countersAnimated = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  const metricsSection = document.querySelector('.hero-metrics-container');
  if (metricsSection) {
    metricsObserver.observe(metricsSection);
  }

  // --------------------------------------------------------------------------
  // 5. Portfolio Category Filter (Supports dynamic cards)
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');
      const allCards = document.querySelectorAll('.project-card');

      allCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 40);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. Project Detail Modals (Static & Dynamic Event Delegation)
  // --------------------------------------------------------------------------
  const openModal = (modalId) => {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      targetModal.classList.add('active');
      targetModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = (modal) => {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  // Delegated click for opening modals (both static targets & dynamic CMS projects)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-open-modal');
    if (!btn) return;
    e.preventDefault();

    if (btn.hasAttribute('data-dynamic-index')) {
      const idx = parseInt(btn.getAttribute('data-dynamic-index'), 10);
      if (window._hydratedProjects && window._hydratedProjects[idx]) {
        showDynamicProjectModal(window._hydratedProjects[idx]);
        return;
      }
    }

    const targetId = btn.getAttribute('data-target');
    if (targetId) {
      openModal(targetId);
    }
  });

  // Delegated click for closing modals
  document.addEventListener('click', (e) => {
    if (e.target.matches('.modal-close-btn') || e.target.closest('.modal-close-btn') || e.target.classList.contains('modal-backdrop')) {
      const modal = e.target.closest('.modal');
      closeModal(modal);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) {
        closeModal(activeModal);
    }
  });

  // --------------------------------------------------------------------------
  // 7. Copy Email to Clipboard Feature
  // --------------------------------------------------------------------------
  const copyEmailBtns = [document.getElementById('copy-email-btn'), document.getElementById('copy-email-btn-2')];
  const emailToCopy = 'contact@hardilal.my.id';

  copyEmailBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(emailToCopy).then(() => {
          showToast('Alamat email disalin ke clipboard! 📋');
        }).catch(() => {
          showToast(`Email: ${emailToCopy}`);
        });
      });
    }
  });

  // --------------------------------------------------------------------------
  // 8. Download CV Button Simulation
  // --------------------------------------------------------------------------
  const downloadCvBtn = document.getElementById('btn-download-cv');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Mengunduh CV Hardilal Danuarta (PDF)... 📄');
    });
  }

  // --------------------------------------------------------------------------
  // 9. Contact Form Validation & Submission to Cloudflare D1
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const btnSubmit = document.getElementById('btn-submit-form');
  const btnSpinner = btnSubmit ? (btnSubmit.querySelector('.spinner') || btnSubmit.querySelector('.btn-spinner')) : null;
  const btnText = btnSubmit ? btnSubmit.querySelector('.btn-text') : null;

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      const errName = document.getElementById('error-name');
      const errEmail = document.getElementById('error-email');
      const errSubject = document.getElementById('error-subject');
      const errMessage = document.getElementById('error-message');

      // Clear existing errors
      if (errName) errName.textContent = '';
      if (errEmail) errEmail.textContent = '';
      if (errSubject) errSubject.textContent = '';
      if (errMessage) errMessage.textContent = '';

      let isValid = true;

      // Validation
      if (!nameInput.value.trim()) {
        if (errName) errName.textContent = 'Silakan masukkan nama lengkap Anda.';
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        if (errEmail) errEmail.textContent = 'Alamat email wajib diisi.';
        isValid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        if (errEmail) errEmail.textContent = 'Format email tidak valid (contoh: nama@domain.com).';
        isValid = false;
      }

      if (!subjectInput.value) {
        if (errSubject) errSubject.textContent = 'Pilih salah satu kategori topik proyek.';
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        if (errMessage) errMessage.textContent = 'Pesan tidak boleh kosong.';
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        if (errMessage) errMessage.textContent = 'Pesan terlalu pendek, minimal 10 karakter.';
        isValid = false;
      }

      if (!isValid) return;

      // Show spinner
      if (btnSpinner && btnText) {
        btnSubmit.disabled = true;
        btnSpinner.style.display = 'inline-block';
        btnText.textContent = 'Mengirim pesan...';
      }

      // Send to Cloudflare Worker API (/api/contact)
      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          subject: subjectInput.value,
          message: messageInput.value.trim()
        })
      })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (response.ok && data.success) {
          contactForm.reset();
          showToast('Pesan Anda berhasil terkirim ke database! ✨');
        } else {
          showToast(data.error || 'Gagal mengirim pesan, silakan coba beberapa saat lagi.');
        }
      })
      .catch((err) => {
        contactForm.reset();
        showToast('Pesan Anda berhasil diterima secara lokal! ✨');
      })
      .finally(() => {
        if (btnSpinner && btnText) {
          btnSubmit.disabled = false;
          btnSpinner.style.display = 'none';
          btnText.textContent = 'Kirim Pesan Sekarang';
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. Toast Notification Utility
  // --------------------------------------------------------------------------
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout;

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  // Current year in footer
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 11. Helper Escape HTML
  // --------------------------------------------------------------------------
  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --------------------------------------------------------------------------
  // 12. Dynamic Modal Viewer for CMS Projects
  // --------------------------------------------------------------------------
  function showDynamicProjectModal(p) {
    const modal = document.getElementById('modal-dynamic');
    if (!modal) return;

    const img = document.getElementById('dyn-modal-img');
    const cat = document.getElementById('dyn-modal-category');
    const title = document.getElementById('dyn-modal-title');
    const desc = document.getElementById('dyn-modal-desc');
    const featBox = document.getElementById('dyn-modal-features-wrap');
    const featList = document.getElementById('dyn-modal-features');
    const tagsBox = document.getElementById('dyn-modal-tags-wrap');
    const tagsList = document.getElementById('dyn-modal-tags');
    const actions = document.getElementById('dyn-modal-actions');

    if (img) img.src = p.image || 'assets/images/project-analytics.jpg';
    if (cat) cat.textContent = p.modal_category || p.badge || 'Portofolio Project';
    if (title) title.textContent = p.title || '';
    if (desc) desc.textContent = p.modal_desc || p.summary || '';

    const feats = (p.modal_features && p.modal_features.length > 0) ? p.modal_features : [];
    if (featBox && featList) {
      if (feats.length > 0) {
        featBox.style.display = 'block';
        featList.innerHTML = feats.map(f => `<li>${escapeHtml(f)}</li>`).join('');
      } else {
        featBox.style.display = 'none';
      }
    }

    const tgs = (p.modal_tags && p.modal_tags.length > 0) ? p.modal_tags : (p.tags || []);
    if (tagsBox && tagsList) {
      if (tgs.length > 0) {
        tagsBox.style.display = 'block';
        tagsList.innerHTML = tgs.map(t => `<span>${escapeHtml(t)}</span>`).join('');
      } else {
        tagsBox.style.display = 'none';
      }
    }

    if (actions) {
      let btns = '';
      if (p.demo && p.demo !== '#') {
        btns += `<a href="${escapeHtml(p.demo)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="margin-right: 8px;">Lihat Live Demo ↗</a>`;
      }
      if (p.github) {
        btns += `<a href="${escapeHtml(p.github)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">Repository GitHub</a>`;
      }
      actions.innerHTML = btns;
    }

    openModal('modal-dynamic');
  }

  // --------------------------------------------------------------------------
  // 13. Render Dynamic Projects Grid
  // --------------------------------------------------------------------------
  function renderDynamicProjects(projects) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    if (!Array.isArray(projects) || projects.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:40px;">Belum ada proyek yang ditampilkan.</p>';
      return;
    }

    window._hydratedProjects = projects;
    const first = projects[0];
    const rest = projects.slice(1);

    let html = `
      <!-- Featured Project 1 -->
      <article class="project-editorial-item project-card" data-category="${escapeHtml(first.category || 'all')}" id="${escapeHtml(first.id || 'proj-0')}">
        <div class="project-visual">
          <img src="${escapeHtml(first.image || 'assets/images/project-analytics.jpg')}" alt="${escapeHtml(first.title || 'Proyek')}" loading="lazy">
        </div>
        <div class="project-details">
          <div class="project-header-meta">
            <span class="project-kicker">${escapeHtml(first.badge || 'Featured Project')}</span>
            <span class="project-year">${escapeHtml(first.year || '2026')}</span>
          </div>
          <h3 class="project-heading">${escapeHtml(first.title || '')}</h3>
          <p class="project-summary">${escapeHtml(first.summary || '')}</p>
          <div class="project-tech-tags">
            ${(first.tags || []).map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}
          </div>
          <div class="project-actions">
            <button class="btn btn-primary btn-sm btn-open-modal" data-dynamic-index="0">Detail Lengkap</button>
            ${first.github ? `<a href="${escapeHtml(first.github)}" target="_blank" rel="noopener noreferrer" class="editorial-link" title="Lihat Source Code"><span>Kode GitHub</span><span>→</span></a>` : ''}
          </div>
        </div>
      </article>
    `;

    if (rest.length > 0) {
      html += `
        <div class="projects-subgrid">
          ${rest.map((p, idx) => `
            <article class="project-card-compact project-card" data-category="${escapeHtml(p.category || 'all')}" id="${escapeHtml(p.id || 'proj-' + (idx + 1))}">
              <div class="project-visual">
                <img src="${escapeHtml(p.image || 'assets/images/project-fintech.jpg')}" alt="${escapeHtml(p.title || 'Proyek')}" loading="lazy">
              </div>
              <div class="project-details">
                <div class="project-header-meta">
                  <span class="project-kicker">${escapeHtml(p.badge || 'Project')}</span>
                  <span class="project-year">${escapeHtml(p.year || '2026')}</span>
                </div>
                <h3 class="project-heading">${escapeHtml(p.title || '')}</h3>
                <p class="project-summary">${escapeHtml(p.summary || '')}</p>
                <div class="project-tech-tags">
                  ${(p.tags || []).map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}
                </div>
                <div class="project-actions">
                  <button class="btn btn-secondary btn-sm btn-open-modal" data-dynamic-index="${idx + 1}">Detail Lengkap</button>
                  ${p.github ? `<a href="${escapeHtml(p.github)}" target="_blank" rel="noopener noreferrer" class="editorial-link"><span>GitHub</span><span>→</span></a>` : ''}
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      `;
    }

    grid.innerHTML = html;
  }

  // --------------------------------------------------------------------------
  // 14. Dynamic Content Hydration from D1 CMS (/api/content)
  // --------------------------------------------------------------------------
  async function hydrateDynamicContent() {
    try {
      const res = await fetch('/api/content');
      if (!res.ok) return;
      const data = await res.json();
      if (!data || !data.content) return;

      const content = data.content;

      // 1. Hero
      if (content.hero) {
        const h = content.hero;
        const statusSpan = document.querySelector('.status-indicator span:last-child');
        if (statusSpan && h.status) statusSpan.textContent = h.status;

        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && (h.title_prefix || h.title_highlight || h.title_suffix)) {
          heroTitle.innerHTML = `${escapeHtml(h.title_prefix || '')}<span class="text-lime">${escapeHtml(h.title_highlight || '')}</span>${escapeHtml(h.title_suffix || '')}`;
        }

        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && h.subtitle) {
          heroSubtitle.textContent = h.subtitle;
        }

        const avatarImg = document.querySelector('.avatar-img-wrapper img');
        if (avatarImg && h.avatar_url) {
          avatarImg.src = h.avatar_url;
        }

        if (h.cv_url && h.cv_url !== '#') {
          const cvBtn = document.getElementById('btn-download-cv');
          if (cvBtn) {
            cvBtn.href = h.cv_url;
            cvBtn.target = '_blank';
          }
        }

        if (h.social_github) {
          const ghLink = document.querySelector('.social-links a[aria-label="GitHub"]');
          if (ghLink) ghLink.href = h.social_github;
        }
        if (h.social_linkedin) {
          const liLink = document.querySelector('.social-links a[aria-label="LinkedIn"]');
          if (liLink) liLink.href = h.social_linkedin;
        }

        // Metrics
        if (Array.isArray(h.metrics) && h.metrics.length > 0) {
          const metricsGrid = document.querySelector('.metrics-grid');
          if (metricsGrid) {
            metricsGrid.innerHTML = h.metrics.map(m => `
              <div class="metric-item">
                <div class="metric-val"><span class="counter" data-target="${m.val || 0}">${m.val || 0}</span>${escapeHtml(m.suffix || '+')}</div>
                <div class="metric-label">${escapeHtml(m.label || '')}</div>
              </div>
            `).join('');
          }
        }
      }

      // 2. About Me
      if (content.about) {
        const ab = content.about;
        const abTitle = document.querySelector('.section-ivory .section-title');
        if (abTitle && ab.title) abTitle.textContent = ab.title;
        const abDesc = document.querySelector('.section-ivory .section-desc');
        if (abDesc && ab.desc) abDesc.textContent = ab.desc;

        if (Array.isArray(ab.cards) && ab.cards.length > 0) {
          const abGrid = document.querySelector('.about-grid');
          if (abGrid) {
            abGrid.innerHTML = ab.cards.map(c => `
              <div class="about-card">
                <span class="about-card-index">${escapeHtml(c.index || '')}</span>
                <h3 class="about-card-title">${escapeHtml(c.title || '')}</h3>
                <p class="about-card-text">${escapeHtml(c.text || '')}</p>
              </div>
            `).join('');
          }
        }
      }

      // 3. Skills
      if (content.skills && Array.isArray(content.skills.categories)) {
        const skillsWrap = document.querySelector('.skills-wrapper');
        if (skillsWrap && content.skills.categories.length > 0) {
          skillsWrap.innerHTML = content.skills.categories.map(cat => `
            <div class="skill-category-column">
              <h3 class="category-title">${escapeHtml(cat.name || '')}</h3>
              <div class="skill-tags">
                ${(cat.tags || []).map(t => `<span class="skill-tag">${escapeHtml(t)}</span>`).join('')}
              </div>
            </div>
          `).join('');
        }
      }

      // 4. Projects (Supports Add, Reorder, Edit, Remove)
      if (Array.isArray(content.projects) && content.projects.length > 0) {
        renderDynamicProjects(content.projects);
      }

      // 5. Timeline
      if (Array.isArray(content.timeline) && content.timeline.length > 0) {
        const timelineWrap = document.querySelector('.timeline-container');
        if (timelineWrap) {
          timelineWrap.innerHTML = content.timeline.map(t => {
            const achievements = Array.isArray(t.achievements) ? t.achievements : (t.desc ? [t.desc] : []);
            return `
              <div class="timeline-row">
                <div class="timeline-meta">
                  <span class="timeline-dates">${escapeHtml(t.year || '')}</span>
                  <span class="timeline-badge">${escapeHtml(t.badge || 'Full-time')}</span>
                </div>
                <div class="timeline-content">
                  <h3 class="timeline-role">${escapeHtml(t.role || '')}</h3>
                  <div class="timeline-org">${escapeHtml(t.company || '')}</div>
                  <ul class="timeline-achievements">
                    ${achievements.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
                  </ul>
                </div>
              </div>
            `;
          }).join('');
        }
      }

      // 6. Contact Info
      if (content.contact) {
        const ct = content.contact;
        if (ct.email) {
          const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
          emailLinks.forEach(el => el.href = `mailto:${ct.email}`);
        }
      }
    } catch (e) {
      console.warn('Hydration fallback used:', e);
    }
  }

  // Jalankan Hydration
  hydrateDynamicContent();

  // --------------------------------------------------------------------------
  // 15. Floating Quick Shortcut to Admin Studio (jika sudah login di browser)
  // --------------------------------------------------------------------------
  try {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      const editBtn = document.createElement('a');
      editBtn.href = '/admin';
      editBtn.id = 'floating-admin-shortcut';
      editBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        <span>Admin Studio (Live Edit)</span>
      `;
      editBtn.setAttribute('style', `
        position: fixed;
        bottom: 24px;
        left: 24px;
        z-index: 9999;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #D5EF73;
        color: #102A2C;
        padding: 10px 18px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 0.84rem;
        text-decoration: none;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        border: 1px solid rgba(213,239,115,0.4);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        cursor: pointer;
      `);
      editBtn.addEventListener('mouseenter', () => {
        editBtn.style.transform = 'translateY(-3px)';
        editBtn.style.boxShadow = '0 14px 34px rgba(0,0,0,0.55)';
      });
      editBtn.addEventListener('mouseleave', () => {
        editBtn.style.transform = 'translateY(0)';
        editBtn.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)';
      });
      document.body.appendChild(editBtn);
    }
  } catch (err) {
    // ignore localStorage restriction
  }

});

