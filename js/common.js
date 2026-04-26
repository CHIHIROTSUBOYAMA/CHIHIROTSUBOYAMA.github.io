/* ============================================================
   LinPlan 共通スクリプト
   - ナビのスクロール追従 / body.at-top トグル
   - モバイルメニュー開閉
   - .reveal の IntersectionObserver
   - フッターパネルの展開制御
   ============================================================ */

(() => {
  // ========== NAV / AT-TOP ==========
  const nav = document.getElementById('nav');
  if (nav) {
    const updateScrollState = () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
      document.body.classList.toggle('at-top', window.scrollY <= 0);
    };
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
  }

  // ========== MOBILE MENU ==========
  window.toggleMenu = function () {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.getElementById('hamburger');
    if (!menu) return;
    const isOpen = menu.classList.toggle('open');
    if (hamburger) hamburger.setAttribute('aria-expanded', isOpen);
  };

  // ========== REVEAL ==========
  const revealTargets = document.querySelectorAll('.reveal');
  if (revealTargets.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => observer.observe(el));
  }


  // ========== FOOTER EXPANDING PANEL ==========
  const wrapper = document.getElementById('footerWrapper');
  const toggle = document.getElementById('footerToggle');
  const backdrop = document.getElementById('footerBackdrop');
  if (wrapper && toggle && backdrop) {
    let isManualOpen = false;
    let lastScrollY = window.scrollY;

    const openFooter = (manual) => {
      wrapper.classList.remove('auto_open');
      if (manual) {
        wrapper.classList.add('open');
        backdrop.classList.add('active');
        isManualOpen = true;
      } else {
        wrapper.classList.add('auto_open');
      }
    };

    const closeFooter = () => {
      wrapper.classList.remove('open', 'auto_open');
      backdrop.classList.remove('active');
      isManualOpen = false;
    };

    toggle.addEventListener('click', () => {
      if (wrapper.classList.contains('open') || wrapper.classList.contains('auto_open')) {
        closeFooter();
      } else {
        openFooter(true);
      }
    });

    backdrop.addEventListener('click', closeFooter);

    window.addEventListener('scroll', () => {
      if (isManualOpen) return;
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;

      if (scrollPercent > 0.98 && scrollY > lastScrollY) {
        if (!wrapper.classList.contains('auto_open')) openFooter(false);
      }
      if (scrollY < lastScrollY && wrapper.classList.contains('auto_open')) {
        wrapper.classList.remove('auto_open');
      }

      lastScrollY = scrollY;
    }, { passive: true });
  }
})();
