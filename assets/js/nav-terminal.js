(function () {
  'use strict';

  var button = document.getElementById('nav-terminal-btn');
  var text = document.getElementById('nav-terminal-text');
  var triggers = document.querySelectorAll('.terminal-overlay-trigger');
  var overlay = document.getElementById('terminal-overlay');
  var closeButton = document.getElementById('terminal-overlay-close');

  if (!button || !text || !triggers.length || !overlay || !closeButton) return;

  var labels = {
    tr: { base: 'Terminal', alternate: 'Ben Kimim?' },
    en: { base: 'Terminal', alternate: 'Who Am I?' }
  };
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var currentLang = localStorage.getItem('ub-lang') === 'en' ? 'en' : 'tr';
  var phase = 'idle';
  var completedCycles = 0;
  var timerId = null;
  var deadline = 0;
  var remainingDelay = null;
  var hovered = false;
  var lastTrigger = null;
  var lockedScrollY = 0;
  var bodyTopBeforeOpen = '';
  var bodyPaddingBeforeOpen = '';
  var backgroundState = [];
  var modalState = 'closed';
  var transitionToken = 0;
  var transitionTimer = null;
  var openingRect = null;
  var expansionStarted = false;

  var INITIAL_DELAY = 900;
  var DELETE_DELAY = 55;
  var TYPE_DELAY = 75;
  var EMPTY_DELAY = 120;
  var ALTERNATE_HOLD = 1100;
  var BASE_HOLD = 850;
  var MAX_CYCLES = 2;
  var OVERLAY_TRANSITION_DURATION = 460;

  function isPaused() {
    return hovered || document.hidden;
  }

  function clearTimer(preserveDelay) {
    if (timerId === null) {
      if (!preserveDelay) remainingDelay = null;
      return;
    }

    if (preserveDelay) {
      remainingDelay = Math.max(0, deadline - Date.now());
    } else {
      remainingDelay = null;
    }

    window.clearTimeout(timerId);
    timerId = null;
  }

  function schedule(delay) {
    remainingDelay = delay;
    if (isPaused() || motionQuery.matches || phase === 'complete') return;

    deadline = Date.now() + delay;
    timerId = window.setTimeout(function () {
      timerId = null;
      remainingDelay = null;
      advance();
    }, delay);
  }

  function finish() {
    clearTimer(false);
    phase = 'complete';
    text.textContent = labels[currentLang].base;
    button.classList.remove('is-animating', 'is-paused');
    button.classList.add('is-complete');
  }

  function advance() {
    var current = labels[currentLang];

    if (phase === 'waiting') {
      phase = 'deleting-base';
    }

    if (phase === 'deleting-base') {
      if (text.textContent.length > 0) {
        text.textContent = text.textContent.slice(0, -1);
        schedule(DELETE_DELAY);
      } else {
        phase = 'typing-alternate';
        schedule(EMPTY_DELAY);
      }
      return;
    }

    if (phase === 'typing-alternate') {
      if (text.textContent.length < current.alternate.length) {
        text.textContent = current.alternate.slice(0, text.textContent.length + 1);
      }

      if (text.textContent === current.alternate) {
        phase = 'holding-alternate';
        schedule(ALTERNATE_HOLD);
      } else {
        schedule(TYPE_DELAY);
      }
      return;
    }

    if (phase === 'holding-alternate') {
      phase = 'deleting-alternate';
    }

    if (phase === 'deleting-alternate') {
      if (text.textContent.length > 0) {
        text.textContent = text.textContent.slice(0, -1);
        schedule(DELETE_DELAY);
      } else {
        phase = 'typing-base';
        schedule(EMPTY_DELAY);
      }
      return;
    }

    if (phase === 'typing-base') {
      if (text.textContent.length < current.base.length) {
        text.textContent = current.base.slice(0, text.textContent.length + 1);
      }

      if (text.textContent === current.base) {
        completedCycles += 1;
        if (completedCycles >= MAX_CYCLES) {
          finish();
        } else {
          phase = 'waiting';
          schedule(BASE_HOLD);
        }
      } else {
        schedule(TYPE_DELAY);
      }
    }
  }

  function showStaticText() {
    clearTimer(false);
    phase = 'idle';
    completedCycles = 0;
    text.textContent = labels[currentLang].base;
    button.classList.remove('is-animating', 'is-paused', 'is-complete');
  }

  function start() {
    clearTimer(false);
    text.textContent = labels[currentLang].base;
    completedCycles = 0;
    button.classList.remove('is-complete', 'is-paused');

    if (motionQuery.matches) {
      showStaticText();
      return;
    }

    phase = 'waiting';
    button.classList.add('is-animating');
    button.classList.toggle('is-paused', isPaused());
    schedule(INITIAL_DELAY);
  }

  function pause() {
    if (phase === 'complete' || motionQuery.matches) return;
    clearTimer(true);
    button.classList.add('is-paused');
  }

  function resume() {
    if (phase === 'complete' || motionQuery.matches || isPaused()) return;
    button.classList.remove('is-paused');
    schedule(remainingDelay === null ? 0 : remainingDelay);
  }

  function setBackgroundInert(inert) {
    if (inert) {
      backgroundState = Array.from(document.body.children)
        .filter(function (element) {
          return element !== overlay && element.tagName !== 'SCRIPT';
        })
        .map(function (element) {
          var state = { element: element, inert: element.inert };
          element.inert = true;
          return state;
        });
      return;
    }

    backgroundState.forEach(function (state) {
      state.element.inert = state.inert;
    });
    backgroundState = [];
  }

  function isElementVisible(element) {
    if (!element || !element.isConnected) return false;
    var rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function getTriggerRect(trigger) {
    if (isElementVisible(trigger)) {
      var rect = trigger.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        borderRadius: window.getComputedStyle(trigger).borderRadius || '10px'
      };
    }

    if (openingRect) return openingRect;

    return {
      left: window.innerWidth / 2 - 1,
      top: window.innerHeight / 2 - 1,
      width: 2,
      height: 2,
      borderRadius: '10px'
    };
  }

  function setOverlayOrigin(rect) {
    var viewportWidth = Math.max(window.innerWidth, 1);
    var viewportHeight = Math.max(window.innerHeight, 1);
    var width = Math.max(2, Math.min(rect.width, viewportWidth));
    var height = Math.max(2, Math.min(rect.height, viewportHeight));
    var left = Math.max(0, Math.min(rect.left, viewportWidth - width));
    var top = Math.max(0, Math.min(rect.top, viewportHeight - height));

    overlay.style.setProperty('--terminal-origin-x', left + 'px');
    overlay.style.setProperty('--terminal-origin-y', top + 'px');
    overlay.style.setProperty('--terminal-origin-scale-x', String(width / viewportWidth));
    overlay.style.setProperty('--terminal-origin-scale-y', String(height / viewportHeight));
    overlay.style.setProperty('--terminal-origin-radius', rect.borderRadius || '10px');
  }

  function clearTransitionTimer() {
    if (transitionTimer === null) return;
    window.clearTimeout(transitionTimer);
    transitionTimer = null;
  }

  function scheduleTransitionFallback(token) {
    clearTransitionTimer();
    transitionTimer = window.setTimeout(function () {
      if (token !== transitionToken) return;
      settleOverlayTransition();
    }, OVERLAY_TRANSITION_DURATION + 100);
  }

  function finishOpen() {
    clearTransitionTimer();
    expansionStarted = false;
    modalState = 'open';
    overlay.classList.remove('is-transitioning');
    document.dispatchEvent(new CustomEvent('ub:terminalopened'));
  }

  function getFocusReturnTarget() {
    var hamburger = document.getElementById('nav-hamburger');
    if (lastTrigger && lastTrigger.classList.contains('nav-mobile-terminal') && isElementVisible(hamburger)) {
      return hamburger;
    }

    if (isElementVisible(lastTrigger)) return lastTrigger;

    var visibleTrigger = Array.from(triggers).find(isElementVisible);
    if (visibleTrigger) return visibleTrigger;

    return isElementVisible(hamburger) ? hamburger : null;
  }

  function closeMobileNavigation(trigger) {
    if (!trigger.classList.contains('nav-mobile-terminal')) return;
    var mobileMenu = document.getElementById('nav-mobile');
    var hamburger = document.getElementById('nav-hamburger');
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      mobileMenu.inert = true;
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
    if (hamburger) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  }

  function focusWithoutScroll(element) {
    if (!element) return;
    try {
      element.focus({ preventScroll: true });
    } catch (error) {
      element.focus();
    }
  }

  function finishClose() {
    clearTransitionTimer();
    expansionStarted = false;
    modalState = 'closed';
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-open', 'is-closing', 'is-transitioning');
    triggers.forEach(function (item) {
      item.setAttribute('aria-expanded', 'false');
    });
    setBackgroundInert(false);

    document.body.classList.remove('terminal-overlay-open');
    document.body.style.top = bodyTopBeforeOpen;
    document.body.style.paddingRight = bodyPaddingBeforeOpen;

    var previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, lockedScrollY);
    document.documentElement.style.scrollBehavior = previousScrollBehavior;

    var focusTarget = getFocusReturnTarget();
    focusWithoutScroll(focusTarget);
    document.dispatchEvent(new CustomEvent('ub:terminalclosed'));
  }

  function settleOverlayTransition() {
    if (modalState === 'opening') {
      finishOpen();
    } else if (modalState === 'closing') {
      finishClose();
    }
  }

  function openOverlay(trigger) {
    if (modalState !== 'closed') return;

    modalState = 'opening';
    expansionStarted = false;
    transitionToken += 1;
    var token = transitionToken;
    lastTrigger = trigger;
    openingRect = getTriggerRect(trigger);
    setOverlayOrigin(openingRect);
    lockedScrollY = window.scrollY;
    bodyTopBeforeOpen = document.body.style.top;
    bodyPaddingBeforeOpen = document.body.style.paddingRight;

    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = scrollbarWidth + 'px';
    }
    document.body.style.top = '-' + lockedScrollY + 'px';
    document.body.classList.add('terminal-overlay-open');

    setBackgroundInert(true);
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.remove('is-open', 'is-closing');
    overlay.classList.add('is-transitioning');
    triggers.forEach(function (item) {
      item.setAttribute('aria-expanded', 'true');
    });

    focusWithoutScroll(closeButton);

    if (motionQuery.matches) {
      overlay.classList.add('is-open');
      finishOpen();
      return;
    }

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if (modalState !== 'opening' || token !== transitionToken) return;
        expansionStarted = true;
        overlay.classList.add('is-open');
        scheduleTransitionFallback(token);
      });
    });
  }

  function activateTrigger(trigger) {
    if (modalState !== 'closed') return;
    document.dispatchEvent(new CustomEvent('ub:terminalgesture'));
    closeMobileNavigation(trigger);
    openOverlay(trigger);
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      activateTrigger(trigger);
    });

    if (trigger.tagName !== 'BUTTON') {
      trigger.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        activateTrigger(trigger);
      });
    }
  });

  function closeOverlay() {
    if (modalState === 'closed' || modalState === 'closing') return;

    document.dispatchEvent(new CustomEvent('ub:terminalclosing'));

    if (modalState === 'opening' && !expansionStarted) {
      transitionToken += 1;
      finishClose();
      return;
    }

    modalState = 'closing';
    transitionToken += 1;
    var token = transitionToken;
    setOverlayOrigin(getTriggerRect(lastTrigger));
    overlay.classList.add('is-closing', 'is-transitioning');

    if (motionQuery.matches) {
      finishClose();
      return;
    }

    overlay.classList.remove('is-open');
    scheduleTransitionFallback(token);
  }

  closeButton.addEventListener('click', closeOverlay);
  document.addEventListener('ub:terminalrequestclose', closeOverlay);

  overlay.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeOverlay();
      return;
    }

    if (event.key !== 'Tab') return;

    var focusable = Array.from(overlay.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function (element) {
      return !element.hidden && element.getAttribute('aria-hidden') !== 'true';
    });

    if (!focusable.length) {
      event.preventDefault();
      overlay.focus();
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  overlay.addEventListener('transitionend', function (event) {
    if (event.target !== overlay || event.propertyName !== 'transform') return;
    settleOverlayTransition();
  });

  button.addEventListener('mouseenter', function () {
    hovered = true;
    pause();
  });

  button.addEventListener('mouseleave', function () {
    hovered = false;
    resume();
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      pause();
    } else {
      resume();
    }
  });

  document.addEventListener('ub:langchange', function (event) {
    currentLang = event.detail && event.detail.lang === 'en' ? 'en' : 'tr';
    start();
  });

  function handleMotionChange() {
    if (motionQuery.matches) {
      showStaticText();
      if (modalState === 'opening') {
        overlay.classList.add('is-open');
        finishOpen();
      } else if (modalState === 'closing') {
        finishClose();
      }
    } else {
      start();
    }
  }

  if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', handleMotionChange);
  } else if (typeof motionQuery.addListener === 'function') {
    motionQuery.addListener(handleMotionChange);
  }

  start();
})();
