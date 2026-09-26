/**
 * PORTOFOLIO PRIBADI — INTERACTIVE SCRIPT
 * High performance, zero-dependency vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    htmlRoot.setAttribute('data-theme', 'dark');
  } else {
    htmlRoot.setAttribute('data-theme', 'light');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlRoot.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlRoot.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    showToast(`Beralih ke mode ${newTheme === 'dark' ? 'gelap' : 'terang'}`);
  });

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Toggle
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

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on click outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Header Scrolled Shadow & Scrollspy Navigation
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header sticky shadow
    if (scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scrollspy active link
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
  // 4. Back to Top Button
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Dynamic Number Counter for Metrics
  // --------------------------------------------------------------------------
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const step = Math.max(1, Math.ceil(target / 40));

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
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.hero-metrics-container');
  if (metricsSection) {
    metricsObserver.observe(metricsSection);
  }

  // --------------------------------------------------------------------------
  // 6. Portfolio Category Filter
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. Project Detail Modals
  // --------------------------------------------------------------------------
  const openModalBtns = document.querySelectorAll('.btn-open-modal');
  const closeBtns = document.querySelectorAll('.modal-close-btn');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  const openModal = (modalId) => {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      targetModal.classList.add('active');
      targetModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // lock background scrolling
    }
  };

  const closeModal = (modal) => {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // restore scrolling
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      openModal(targetId);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      closeModal(modal);
    });
  });

  modalBackdrops.forEach(backdrop => {
    backdrop.addEventListener('click', () => {
      const modal = backdrop.closest('.modal');
      closeModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });

  // --------------------------------------------------------------------------
  // 8. Copy Email to Clipboard Feature
  // --------------------------------------------------------------------------
  const copyEmailBtns = [document.getElementById('copy-email-btn'), document.getElementById('copy-email-btn-2')];
  const emailToCopy = 'contact@alexdanuarta.dev';

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
  // 9. Download CV Button Simulation
  // --------------------------------------------------------------------------
  const downloadCvBtn = document.getElementById('btn-download-cv');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Mengunduh CV Alex Danuarta (PDF)... 📄');
    });
  }

  // --------------------------------------------------------------------------
  // 10. Contact Form Validation & Submission
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const btnSubmit = document.getElementById('btn-submit-form');
  const btnSpinner = btnSubmit ? btnSubmit.querySelector('.btn-spinner') : null;
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
      errName.textContent = '';
      errEmail.textContent = '';
      errSubject.textContent = '';
      errMessage.textContent = '';

      let isValid = true;

      // Validation
      if (!nameInput.value.trim()) {
        errName.textContent = 'Silakan masukkan nama lengkap Anda.';
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        errEmail.textContent = 'Alamat email wajib diisi.';
        isValid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        errEmail.textContent = 'Format email tidak valid (contoh: nama@domain.com).';
        isValid = false;
      }

      if (!subjectInput.value) {
        errSubject.textContent = 'Pilih salah satu kategori topik proyek.';
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        errMessage.textContent = 'Pesan tidak boleh kosong.';
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        errMessage.textContent = 'Pesan terlalu pendek, minimal 10 karakter.';
        isValid = false;
      }

      if (!isValid) return;

      // Send to Cloudflare Worker API (/api/contact)
      if (btnSpinner && btnText) {
        btnSubmit.disabled = true;
        btnSpinner.style.display = 'inline-block';
        btnText.textContent = 'Mengirim pesan...';
      }

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
          showToast('Pesan Anda berhasil dikirim! Saya akan segera menghubungi Anda. ✨');
        } else {
          showToast(data.error || 'Gagal mengirim pesan, silakan coba beberapa saat lagi.');
        }
      })
      .catch((err) => {
        // Fallback jika dijalankan tanpa server backend
        contactForm.reset();
        showToast('Pesan Anda telah diterima secara lokal! ✨');
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
  // 11. Toast Notification Utility
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

});
