/* =============================================
   CERTIFICATES.JS — Show More / Less Logic
   ============================================= */

(function () {
  'use strict';

  /* ── Translation labels ── */
  var LABELS = {
    tr: { more: 'Daha Fazla Göster', less: 'Daha Az Göster' },
    en: { more: 'Show More',        less: 'Show Less'  }
  };

  function getCurrentLang() {
    return localStorage.getItem('ub-lang') || 'tr';
  }

  function updateBtnText(btn, isExpanded) {
    var lang   = getCurrentLang();
    var labels = LABELS[lang] || LABELS.tr;
    var textEl = btn.querySelector('.cert-btn-text');
    if (textEl) {
      textEl.textContent = isExpanded ? labels.less : labels.more;
    }
    btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  }

  function initCertificates() {
    var hiddenCards = document.querySelectorAll('.cert-card.cert-hidden');
    var btn         = document.getElementById('cert-show-more-btn');

    if (!btn || hiddenCards.length === 0) return;

    var isExpanded = false;

    /* ── Toggle handler ── */
    btn.addEventListener('click', function () {
      isExpanded = !isExpanded;

      if (isExpanded) {
        /* Show hidden cards with staggered animation */
        hiddenCards.forEach(function (card, i) {
          card.classList.add('cert-visible');
          card.style.animationDelay = (i * 60) + 'ms';
        });
        btn.classList.add('expanded');
      } else {
        /* Hide cards again */
        hiddenCards.forEach(function (card) {
          card.classList.remove('cert-visible');
          card.style.animationDelay = '';
        });
        btn.classList.remove('expanded');

        /* Smooth scroll back to section */
        var section = document.getElementById('sertifikalar');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      updateBtnText(btn, isExpanded);
    });

    /* ── Keep button text in sync when lang changes ── */
    /* lang.js fires a custom event after applying translations */
    document.addEventListener('ub:langchange', function () {
      updateBtnText(btn, isExpanded);
    });

    /* ── Initial render ── */
    updateBtnText(btn, isExpanded);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCertificates);
  } else {
    initCertificates();
  }
})();
