(function () {
  'use strict';

  var navbar      = document.getElementById('navbar');
  var hamburger   = document.getElementById('nav-hamburger');
  var mobileMenu  = document.getElementById('nav-mobile');
  var mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  var desktopLinks = document.querySelectorAll('.nav-links a');

  /* ════════════════════════════════════════════
     DARK MODE
  ════════════════════════════════════════════ */
  var html        = document.documentElement;
  var themeBtn    = document.getElementById('nav-theme-btn');
  var isDark      = localStorage.getItem('ub-theme') === 'dark';

  function getThemeLabel(dark) {
    var lang = localStorage.getItem('ub-lang') === 'en' ? 'en' : 'tr';
    if (lang === 'en') return dark ? 'Switch to light mode' : 'Switch to dark mode';
    return dark ? 'Açık moda geç' : 'Karanlık moda geç';
  }

  function updateThemeButtons(dark) {
    document.querySelectorAll('.nav-theme-btn').forEach(function (btn) {
      btn.textContent = dark ? '☀️' : '🌙';
      btn.setAttribute('aria-label', getThemeLabel(dark));
    });
  }

  function applyTheme(dark) {
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    /* Update all theme buttons (desktop + mobile) */
    updateThemeButtons(dark);
    isDark = dark;
    localStorage.setItem('ub-theme', dark ? 'dark' : 'light');
  }

  /* Restore saved preference immediately */
  applyTheme(isDark);

  /* Bind all theme buttons */
  document.querySelectorAll('.nav-theme-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(!isDark);
    });
  });

  document.addEventListener('ub:langchange', function () {
    updateThemeButtons(isDark);
  });

  /* ════════════════════════════════════════════
     SCROLL — .scrolled shadow
  ════════════════════════════════════════════ */
  function onScroll() {
    if (window.scrollY > 12) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ════════════════════════════════════════════
     HAMBURGER — mobile drawer
  ════════════════════════════════════════════ */
  function getMenuLabel(open) {
    var lang = localStorage.getItem('ub-lang') === 'en' ? 'en' : 'tr';
    if (lang === 'en') return open ? 'Close menu' : 'Open menu';
    return open ? 'Menüyü kapat' : 'Menüyü aç';
  }

  function setMobileMenuOpen(open, restoreFocus) {
    if (!hamburger || !mobileMenu) return;

    mobileMenu.classList.toggle('open', open);
    mobileMenu.inert = !open;
    mobileMenu.setAttribute('aria-hidden', String(!open));
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', getMenuLabel(open));

    if (restoreFocus) {
      try {
        hamburger.focus({ preventScroll: true });
      } catch (error) {
        hamburger.focus();
      }
    }
  }

  if (hamburger && mobileMenu) {
    setMobileMenuOpen(false, false);

    hamburger.addEventListener('click', function () {
      setMobileMenuOpen(!mobileMenu.classList.contains('open'), false);
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        setMobileMenuOpen(false, true);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !mobileMenu.classList.contains('open')) return;
      event.preventDefault();
      setMobileMenuOpen(false, true);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && mobileMenu.classList.contains('open')) {
        setMobileMenuOpen(false, false);
      }
    });

    document.addEventListener('ub:langchange', function () {
      hamburger.setAttribute('aria-label', getMenuLabel(mobileMenu.classList.contains('open')));
    });
  }

  /* Close drawer on outside click */
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && mobileMenu && mobileMenu.classList.contains('open')) {
      setMobileMenuOpen(false, false);
    }
  });

  /* ════════════════════════════════════════════
     ACTIVE LINK — IntersectionObserver
  ════════════════════════════════════════════ */
  var sectionIds     = ['hero', 'hakkimda', 'yetenekler', 'deneyim', 'projeler', 'sertifikalar', 'egitim', 'iletisim'];
  var sectionMap     = {};
  var activeSectionId = 'hero';

  sectionIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) sectionMap[id] = el;
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          activeSectionId = entry.target.id;
          highlightActive(activeSectionId);
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  Object.values(sectionMap).forEach(function (el) {
    observer.observe(el);
  });

  function updateActiveLink() {
    highlightActive(activeSectionId);
  }

  function highlightActive(id) {
    var allLinks = Array.from(desktopLinks).concat(Array.from(mobileLinks));
    allLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === '#' + id || (id === 'hero' && (href === '#' || href === '#hero'))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }
})();
