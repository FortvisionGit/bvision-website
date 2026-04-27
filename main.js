/* BVision.AI — Main JS */

// ── Announce bar offset for fixed nav ────────────────────────
function getNavOffset() {
  const bar = document.querySelector('.announce-bar');
  return bar ? bar.offsetHeight : 0;
}

// ── Nav scroll behavior ──────────────────────────────────────
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const isHero = nav.classList.contains('on-hero');
  function update() {
    const scrollY = window.scrollY;
    const scrolled = scrollY > 10;
    if (isHero) {
      nav.classList.toggle('scrolled', scrolled);
    }
    // Position nav just below announce bar while it is visible,
    // then stick it to the very top once the bar has scrolled away.
    const barH = getNavOffset();
    const offset = Math.max(0, barH - scrollY);
    nav.style.top = offset + 'px';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

// ── Mobile menu ──────────────────────────────────────────────
(function initMobileMenu() {
  const btn = document.querySelector('.nav-hamburger');
  const menu = document.querySelector('.mobile-menu');
  const close = document.querySelector('.mobile-menu-close');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  const closeMenu = () => {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  };
  close && close.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
})();

// ── Scroll reveal ────────────────────────────────────────────
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
  els.forEach(el => io.observe(el));
})();

// ── Counter animation ────────────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const decimals = parseInt(el.dataset.decimals || '0');
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
(function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
})();

// ── Modal (case studies) ─────────────────────────────────────
window.openModal = function(id) {
  const el = document.getElementById('modal-' + id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
};
window.closeModal = function(id) {
  const el = document.getElementById('modal-' + id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
};
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// ── Industry tabs ────────────────────────────────────────────
(function initIndTabs() {
  const nav = document.getElementById('ind-tab-nav');
  if (!nav) return;
  nav.querySelectorAll('.ind-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      nav.querySelectorAll('.ind-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.ind-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('panel-' + btn.dataset.panel);
      if (panel) panel.classList.add('active');
    });
  });
  // Hash routing
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const matchBtn = nav.querySelector(`[data-panel="${hash}"]`);
    if (matchBtn) matchBtn.click();
  }
})();

// ── Active nav link ──────────────────────────────────────────
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0];
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });
})();

// ── Form submit feedback ──────────────────────────────────────
(function() {
  document.querySelectorAll('form[action*="formsubmit.co"]').forEach(form => {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      btn.textContent = 'Sending…';
      btn.disabled = true;
    });
  });
})();
