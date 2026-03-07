/* ============================================================
   PestControlNearMe – main.js
   Vanilla JS – No dependencies
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── MOBILE HAMBURGER ──────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

  // ── FAQ ACCORDION ─────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-question');
  faqItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = document.getElementById(btn.getAttribute('aria-controls'));
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Close all others
      faqItems.forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const a = document.getElementById(b.getAttribute('aria-controls'));
        if (a) a.hidden = true;
      });
      // Toggle clicked
      btn.setAttribute('aria-expanded', !isOpen);
      if (answer) answer.hidden = isOpen;
    });
  });

  // ── STICKY HEADER SHADOW ──────────────────────────────────
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.style.boxShadow = window.scrollY > 20
        ? '0 4px 20px rgba(14,165,233,.15)'
        : '0 1px 3px rgba(0,0,0,.08)';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── BACK TO TOP ───────────────────────────────────────────
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.hidden = window.scrollY < 400;
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── SMOOTH SCROLL for anchor links ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight + 16 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── CONTACT FORM VALIDATION ───────────────────────────────
  const forms = document.querySelectorAll('.contact-form');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      const phone = form.querySelector('[name="phone"]');
      const name = form.querySelector('[name="name"]');
      let valid = true;

      [name, phone].forEach(field => {
        if (field && !field.value.trim()) {
          field.style.borderColor = '#ef4444';
          valid = false;
        } else if (field) {
          field.style.borderColor = '';
        }
      });

      if (phone && phone.value && !/^[0-9]{10}$/.test(phone.value.replace(/\s/g, ''))) {
        phone.style.borderColor = '#ef4444';
        valid = false;
      }

      if (!valid) {
        e.preventDefault();
        const first = form.querySelector('[style*="borderColor"]:not([style*="none"])');
        if (first) first.focus();
      }
    });
  });

  // ── SUCCESS MESSAGE ───────────────────────────────────────
  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === '1') {
    const msg = document.createElement('div');
    msg.style.cssText = `
      position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
      background: #22c55e; color: white; padding: 1rem 2rem; border-radius: 12px;
      box-shadow: 0 4px 20px rgba(34,197,94,.4); font-weight: 600; z-index: 9999;
      animation: fadeInUp .4s ease;
    `;
    msg.textContent = '✅ Thank you! We will contact you within 30 minutes.';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 5000);
  }

  // ── INTERSECTION OBSERVER for animations ──────────────────
  if ('IntersectionObserver' in window) {
    const animEls = document.querySelectorAll('.service-card, .location-card, .review-card, .client-type-card, .process-step');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = `fadeInUp 0.5s ease ${i * 0.05}s both`;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    animEls.forEach(el => observer.observe(el));
  }

  // ── PHONE NUMBER CLICK TRACKING ───────────────────────────
  document.querySelectorAll('a[href^="tel:"]').forEach(el => {
    el.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'phone_call_click', { event_category: 'CTA', event_label: el.href });
      }
    });
  });

});
