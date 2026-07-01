/* =========================================================
   Deem Alqasir — Portfolio
   Main JavaScript
========================================================= */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    document.getElementById('year').textContent = new Date().getFullYear();

    initNavToggle();
    initActiveNavLink();
    initNavbarHideOnScroll();
    initScrollProgress();
    initScrollReveal();
    initThemeToggle();
    initContactForm();
  }

  /* ---------------------------------------------------------
     Mobile Navigation Toggle
  --------------------------------------------------------- */
  function initNavToggle() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    if (!navbarToggle || !navbarMenu) return;

    const navLinks = navbarMenu.querySelectorAll('a');

    navbarToggle.addEventListener('click', () => {
      const isActive = navbarMenu.classList.toggle('active');
      navbarToggle.classList.toggle('active');
      navbarToggle.setAttribute('aria-expanded', String(isActive));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
        navbarToggle.classList.remove('active');
        navbarToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------
     Active Navigation Link via IntersectionObserver
  --------------------------------------------------------- */
  function initActiveNavLink() {
    const navLinks = document.querySelectorAll('.navbar-menu a');
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    });

    function handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove('active'));
          const id = entry.target.getAttribute('id');
          const matchingLink = document.querySelector(`.navbar-menu a[href="#${id}"]`);
          if (matchingLink) matchingLink.classList.add('active');
        }
      });
    }

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------------------------------------------------------
     Navbar Hide/Reveal on Scroll
  --------------------------------------------------------- */
  function initNavbarHideOnScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollingDown = currentScrollY > lastScrollY;

          if (currentScrollY > 120 && scrollingDown) {
            navbar.classList.add('navbar--hidden');
          } else {
            navbar.classList.remove('navbar--hidden');
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ---------------------------------------------------------
     Scroll Progress Bar
  --------------------------------------------------------- */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${progress}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------------------------------------------------------
     Scroll Reveal (fade-up + staggered)
  --------------------------------------------------------- */
  function initScrollReveal() {
    const animatedEls = document.querySelectorAll('[data-animate]');
    if (!animatedEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, Number(delay));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    animatedEls.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------
     Theme Toggle (Dark / Light)
  --------------------------------------------------------- */
  function initThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    const icon = toggleBtn.querySelector('i');
    const storedTheme = localStorage.getItem('portfolio-theme');

    if (storedTheme === 'light') {
      document.body.classList.add('light-theme');
      updateIcon();
    }

    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
      updateIcon();
    });

function updateIcon() {
  const isLight = document.body.classList.contains('light-theme');
  icon.className = isLight ? 'fa-solid fa-sun' : 'fa-regular fa-moon';
}
  }

  /* ---------------------------------------------------------
     Contact Form (Formspree AJAX submit + inline status)
  --------------------------------------------------------- */
  function initContactForm() {
    const form = document.querySelector('.form-container form');
    const status = document.getElementById('formStatus');
    if (!form || !status) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitBtn = form.querySelector('.submit-btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
      status.textContent = '';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          status.textContent = 'Message sent successfully. Thank you!';
          form.reset();
        } else {
          status.textContent = 'Something went wrong. Please try again.';
        }
      } catch (error) {
        status.textContent = 'Network error. Please try again later.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
})();