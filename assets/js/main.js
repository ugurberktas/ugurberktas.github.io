/* =============================================
   MAIN.JS — App Entry Point & Global Init
   ============================================= */

(function () {
  'use strict';

  var WRITE_DELAY = 100;
  var DELETE_DELAY = 65;
  var HOLD_DELAY = 2000;
  var RESTART_DELAY = 600;

  var terminal;
  var output;
  var visualText;
  var accessibleText;
  var motionQuery;
  var observer;

  var timerId = null;
  var timerDeadline = 0;
  var remainingDelay = null;
  var currentText = '';
  var characterIndex = 0;
  var phase = 'idle';
  var isTerminalVisible = false;

  function renderText(value) {
    visualText.textContent = value;
  }

  function clearTimer(preserveDelay) {
    if (timerId === null) {
      if (!preserveDelay) remainingDelay = null;
      return;
    }

    if (preserveDelay) {
      remainingDelay = Math.max(0, timerDeadline - Date.now());
    } else {
      remainingDelay = null;
    }

    window.clearTimeout(timerId);
    timerId = null;
    timerDeadline = 0;
  }

  function schedule(delay) {
    clearTimer(false);
    remainingDelay = delay;
    timerDeadline = Date.now() + delay;

    timerId = window.setTimeout(function () {
      timerId = null;
      timerDeadline = 0;
      remainingDelay = null;
      advanceAnimation();
    }, delay);
  }

  function canAnimate() {
    return !motionQuery.matches && isTerminalVisible && !document.hidden;
  }

  function getDefaultDelay() {
    if (phase === 'holding') return HOLD_DELAY;
    if (phase === 'deleting') return DELETE_DELAY;
    if (phase === 'restarting') return RESTART_DELAY;
    return WRITE_DELAY;
  }

  function syncPlayback() {
    var active = canAnimate();
    output.classList.toggle('is-paused', !active);

    if (motionQuery.matches) {
      clearTimer(false);
      phase = 'idle';
      characterIndex = currentText.length;
      renderText(currentText);
      return;
    }

    if (!active) {
      clearTimer(true);
      return;
    }

    if (phase === 'idle') {
      restartAnimation();
      return;
    }

    if (timerId === null) {
      schedule(remainingDelay === null ? getDefaultDelay() : remainingDelay);
    }
  }

  function restartAnimation() {
    clearTimer(false);
    phase = 'typing';
    characterIndex = 0;
    renderText('');

    if (motionQuery.matches) {
      phase = 'idle';
      characterIndex = currentText.length;
      renderText(currentText);
      output.classList.add('is-paused');
      return;
    }

    syncPlayback();
  }

  function advanceAnimation() {
    if (!canAnimate()) {
      syncPlayback();
      return;
    }

    if (phase === 'typing') {
      characterIndex += 1;
      renderText(currentText.slice(0, characterIndex));

      if (characterIndex >= currentText.length) {
        phase = 'holding';
        schedule(HOLD_DELAY);
      } else {
        schedule(WRITE_DELAY);
      }
      return;
    }

    if (phase === 'holding') {
      phase = 'deleting';
      characterIndex = Math.max(0, characterIndex - 1);
      renderText(currentText.slice(0, characterIndex));

      if (characterIndex === 0) {
        phase = 'restarting';
        schedule(RESTART_DELAY);
      } else {
        schedule(DELETE_DELAY);
      }
      return;
    }

    if (phase === 'deleting') {
      characterIndex = Math.max(0, characterIndex - 1);
      renderText(currentText.slice(0, characterIndex));

      if (characterIndex === 0) {
        phase = 'restarting';
        schedule(RESTART_DELAY);
      } else {
        schedule(DELETE_DELAY);
      }
      return;
    }

    if (phase === 'restarting') {
      phase = 'typing';
      characterIndex = Math.min(1, currentText.length);
      renderText(currentText.slice(0, characterIndex));

      if (characterIndex >= currentText.length) {
        phase = 'holding';
        schedule(HOLD_DELAY);
      } else {
        schedule(WRITE_DELAY);
      }
    }
  }

  function updateLanguageText() {
    var nextText = accessibleText.textContent.trim();
    if (!nextText) return;

    currentText = nextText;
    restartAnimation();
  }

  function handleMotionPreference() {
    restartAnimation();
  }

  function initTerminalTypewriter() {
    terminal = document.querySelector('.hero-terminal-preview');
    output = document.querySelector('.terminal-output');
    visualText = document.getElementById('terminal-output-visual');
    accessibleText = document.getElementById('terminal-output-accessible');

    if (!terminal || !output || !visualText || !accessibleText) return;

    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.addEventListener('ub:langchange', updateLanguageText);
    document.addEventListener('visibilitychange', syncPlayback);

    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', handleMotionPreference);
    } else if (typeof motionQuery.addListener === 'function') {
      motionQuery.addListener(handleMotionPreference);
    }

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var nextVisibility = entry.isIntersecting && entry.intersectionRatio > 0;
          if (nextVisibility === isTerminalVisible) return;

          isTerminalVisible = nextVisibility;
          syncPlayback();
        });
      }, { threshold: 0.1 });

      observer.observe(terminal);
    } else {
      isTerminalVisible = true;
    }

    updateLanguageText();
    syncPlayback();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTerminalTypewriter);
  } else {
    initTerminalTypewriter();
  }
})();
