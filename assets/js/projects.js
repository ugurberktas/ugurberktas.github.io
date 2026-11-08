/* =============================================
   PROJECTS.JS — Collapsible Project Showcase
   ============================================= */

(function () {
  'use strict';

  var LABELS = {
    tr: {
      more: 'Daha Fazla Proje Göster',
      less: 'Daha Az Proje Göster'
    },
    en: {
      more: 'Show More Projects',
      less: 'Show Fewer Projects'
    }
  };

  function getCurrentLang() {
    return localStorage.getItem('ub-lang') || 'tr';
  }

  function getVisibleCardCount() {
    return window.innerWidth > 1024 ? 3 : 2;
  }

  function initProjectsShowcase() {
    var section = document.getElementById('projeler');
    var stage = document.getElementById('projects-stage');
    var grid = document.getElementById('projects-grid');
    var button = document.getElementById('projects-toggle-btn');
    var buttonWrapper = document.querySelector('.projects-toggle-wrapper');
    var buttonText = button ? button.querySelector('.projects-toggle-text') : null;
    var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll('.project-card')) : [];
    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var isExpanded = false;
    var resizeFrame = null;

    if (!section || !stage || !grid || !button || !buttonWrapper || !buttonText || cards.length < 4) {
      return;
    }

    function updateButton() {
      var lang = getCurrentLang();
      var labels = LABELS[lang] || LABELS.tr;
      buttonText.textContent = isExpanded ? labels.less : labels.more;
      button.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
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
      var teaserHeight;
      var collapsedHeight;

      if (!nextCard) return;

      teaserHeight = window.innerWidth <= 640
        ? Math.min(170, nextCard.getBoundingClientRect().height * 0.32)
        : Math.min(210, nextCard.getBoundingClientRect().height * 0.46);

      collapsedHeight = Math.round(nextCard.getBoundingClientRect().top - gridRect.top + teaserHeight);

      stage.style.setProperty('--projects-collapsed-height', collapsedHeight + 'px');
      stage.style.setProperty('--projects-expanded-height', Math.ceil(grid.scrollHeight) + 'px');
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
    document.addEventListener('DOMContentLoaded', initProjectsShowcase);
  } else {
    initProjectsShowcase();
  }
})();
