/* =============================================
   CERTIFICATES.JS — Collapsible Certificate Showcase
   ============================================= */

(function () {
  'use strict';

  var LABELS = {
    tr: {
      more: 'Daha Fazla Sertifika Göster',
      less: 'Daha Az Sertifika Göster'
    },
    en: {
      more: 'Show More Certificates',
      less: 'Show Fewer Certificates'
    }
  };

  function getCurrentLang() {
    return localStorage.getItem('ub-lang') || 'tr';
  }

  function getVisibleCardCount() {
    if (window.innerWidth > 1024) return 6;
    if (window.innerWidth > 640) return 4;
    return 3;
  }

  function initCertificatesShowcase() {
    var section = document.getElementById('sertifikalar');
    var stage = document.getElementById('certificates-stage');
    var grid = document.getElementById('certificates-grid');
    var button = document.getElementById('cert-show-more-btn');
    var buttonWrapper = document.querySelector('.cert-show-more-wrapper');
    var buttonText = button ? button.querySelector('.cert-btn-text') : null;
    var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll('.cert-card')) : [];
    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var isExpanded = false;
    var resizeFrame = null;

    if (!section || !stage || !grid || !button || !buttonWrapper || !buttonText || cards.length < 7) {
      return;
    }

    function updateButton() {
      var lang = getCurrentLang();
      var labels = LABELS[lang] || LABELS.tr;
      buttonText.textContent = isExpanded ? labels.less : labels.more;
      button.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      button.classList.toggle('expanded', isExpanded);
    }

    function updateCardAccessibility() {
      var visibleCount = getVisibleCardCount();

      cards.forEach(function (card, index) {
        var isConcealed = !isExpanded && index >= visibleCount;
        card.inert = isConcealed;

        if (isConcealed) {
          card.setAttribute('aria-hidden', 'true');
        } else {
          card.removeAttribute('aria-hidden');
        }
      });
    }

    function updateMeasurements() {
      var visibleCount = getVisibleCardCount();
      var nextCard = cards[visibleCount];
      var gridRect = grid.getBoundingClientRect();
      var nextCardRect;
      var nextCardName;
      var nameBottom;
      var fadeHeight;
      var teaserHeight;
      var collapsedHeight;

      if (!nextCard) return;

      nextCardRect = nextCard.getBoundingClientRect();
      nextCardName = nextCard.querySelector('.cert-name');
      nameBottom = nextCardName
        ? nextCardName.getBoundingClientRect().bottom - nextCardRect.top
        : nextCardRect.height * 0.52;
      fadeHeight = window.innerWidth <= 640 ? 72 : 80;
      teaserHeight = Math.min(nextCardRect.height * 0.94, nameBottom + 52);
      collapsedHeight = Math.round(nextCardRect.top - gridRect.top + teaserHeight);

      stage.style.setProperty('--certificates-collapsed-height', collapsedHeight + 'px');
      stage.style.setProperty('--certificates-expanded-height', Math.ceil(grid.scrollHeight) + 'px');
      stage.style.setProperty('--certificates-fade-height', fadeHeight + 'px');
      updateCardAccessibility();
    }

    function scheduleMeasurement() {
      if (resizeFrame !== null) {
        window.cancelAnimationFrame(resizeFrame);
      }

      resizeFrame = window.requestAnimationFrame(function () {
        resizeFrame = null;
        updateMeasurements();
      });
    }

    function setExpanded(nextExpanded) {
      isExpanded = nextExpanded;
      updateMeasurements();
      stage.classList.toggle('is-expanded', isExpanded);
      updateButton();
      updateCardAccessibility();

      if (!isExpanded) {
        section.scrollIntoView({
          behavior: motionQuery.matches ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    }

    button.addEventListener('click', function () {
      setExpanded(!isExpanded);
    });

    document.addEventListener('ub:langchange', function () {
      updateButton();
      scheduleMeasurement();
    });

    window.addEventListener('resize', scheduleMeasurement, { passive: true });

    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(scheduleMeasurement).observe(grid);
    }

    stage.classList.add('is-collapsible');
    buttonWrapper.hidden = false;
    updateButton();
    updateMeasurements();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCertificatesShowcase);
  } else {
    initCertificatesShowcase();
  }
})();
