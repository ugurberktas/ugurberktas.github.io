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

  function applyTheme(dark) {
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    /* Update all theme buttons (desktop + mobile) */
    document.querySelectorAll('.nav-theme-btn').forEach(function (btn) {
      btn.textContent = dark ? '☀️' : '🌙';
      btn.setAttribute('aria-label', dark ? 'Açık moda geç' : 'Karanlık moda geç');
    });
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
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Close drawer on outside click */
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
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
      } else {
        link.classList.remove('active');
      }
    });
  }
})();
