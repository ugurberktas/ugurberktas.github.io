(function () {
  'use strict';

  var overlay = document.getElementById('terminal-overlay');
  var editor = document.getElementById('terminal-sequence-editor');
  var accessibleText = document.getElementById('terminal-sequence-accessible');

  if (!overlay || !editor || !accessibleText) return;

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var currentLang = localStorage.getItem('ub-lang') === 'en' ? 'en' : 'tr';
  var timerId = null;
  var runToken = 0;
  var running = false;
  var output = '';
  var activeStep = -1;
  var varianceIndex = 0;

  var CONTENT = {
    tr: {
      declaration: 'const identity = {\n',
      name: '  name: "Uğur Berktaş",\n',
      role: '  role: "Platform Mühendisi",\n',
      focusPrefix: '  focus: "',
      focusDraft: 'Uygulamalar',
      focusFinal: 'Altyapı',
      focusSuffix: '",\n',
      status: '  status: "İnşa ediliyor..."\n',
      ending: '};\n',
      echo: '\nidentity.status;'
    },
    en: {
      declaration: 'const identity = {\n',
      name: '  name: "Uğur Berktaş",\n',
      role: '  role: "Platform Engineer",\n',
      focusPrefix: '  focus: "',
      focusDraft: 'Applications',
      focusFinal: 'Infrastructure',
      focusSuffix: '",\n',
      status: '  status: "Building..."\n',
      ending: '};\n',
      echo: '\nidentity.status;'
    }
  };

  /* Content and timing stay centralised so the next sprint can replace the story cleanly. */
  var TIMELINE = [
    { action: 'wait', duration: 400 },
    { action: 'wait', duration: 350 },
    { action: 'type', field: 'declaration', speed: 48 },
    { action: 'type', field: 'name', speed: 38 },
    { action: 'wait', duration: 180 },
    { action: 'type', field: 'role', speed: 38 },
    { action: 'wait', duration: 220 },
    { action: 'type', field: 'focusPrefix', speed: 42 },
    { action: 'type', field: 'focusDraft', speed: 62 },
    { action: 'wait', duration: 1350 },
    { action: 'wait', duration: 380 },
    { action: 'delete', field: 'focusDraft', speed: 62 },
    { action: 'type', field: 'focusFinal', speed: 44, decisive: true },
    { action: 'type', field: 'focusSuffix', speed: 36, decisive: true },
    { action: 'wait', duration: 180 },
    { action: 'type', field: 'status', speed: 38 },
    { action: 'type', field: 'ending', speed: 48 },
    { action: 'wait', duration: 450 },
    { action: 'type', field: 'echo', speed: 42 },
    { action: 'wait', duration: 350 },
    { action: 'complete' },
    { action: 'wait', duration: 2600 },
    { action: 'close' }
  ];

  var SPEED_VARIANCE = [0.88, 1.04, 0.95, 1.12, 0.91, 1.06, 0.98, 1.09];
  var TYPE_SPEED_FACTOR = 1.08;

  function getFinalText(content) {
    return content.declaration
      + content.name
      + content.role
      + content.focusPrefix
      + content.focusFinal
      + content.focusSuffix
      + content.status
      + content.ending
      + content.echo;
  }

  function appendToken(parent, className, value) {
    var span = document.createElement('span');
    span.className = className;
    span.textContent = value;
    parent.appendChild(span);
  }

  function highlightLine(parent, line) {
    var index = 0;

    while (index < line.length) {
      var character = line.charAt(index);

      if (character === '/' && line.charAt(index + 1) === '/') {
        appendToken(parent, 'terminal-token-comment', line.slice(index));
        return;
      }

      if (character === '"') {
        var stringEnd = index + 1;
        while (stringEnd < line.length && line.charAt(stringEnd) !== '"') stringEnd += 1;
        if (stringEnd < line.length) stringEnd += 1;
        appendToken(parent, 'terminal-token-string', line.slice(index, stringEnd));
        index = stringEnd;
        continue;
      }

      if (/[A-Za-z_$]/.test(character)) {
        var wordEnd = index + 1;
        while (wordEnd < line.length && /[A-Za-z0-9_$]/.test(line.charAt(wordEnd))) wordEnd += 1;
        var word = line.slice(index, wordEnd);
        var rest = line.slice(wordEnd);
        var className = word === 'const' ? 'terminal-token-keyword' : 'terminal-token-plain';
        if (/^\s*:/.test(rest)) className = 'terminal-token-property';
        appendToken(parent, className, word);
        index = wordEnd;
        continue;
      }

      if (/\d/.test(character)) {
        var numberEnd = index + 1;
        while (numberEnd < line.length && /[\d.]/.test(line.charAt(numberEnd))) numberEnd += 1;
        appendToken(parent, 'terminal-token-number', line.slice(index, numberEnd));
        index = numberEnd;
        continue;
      }

      var plainEnd = index + 1;
      while (plainEnd < line.length && !/["A-Za-z_$\d]/.test(line.charAt(plainEnd))) plainEnd += 1;
      appendToken(parent, 'terminal-token-plain', line.slice(index, plainEnd));
      index = plainEnd;
    }
  }

  function render() {
    var lines = output.split('\n');
    var fragment = document.createDocumentFragment();

    lines.forEach(function (line, index) {
      var row = document.createElement('div');
      var code = document.createElement('span');

      row.className = 'terminal-sequence-line';
      code.className = 'terminal-sequence-code';
      highlightLine(code, line);

      if (index === lines.length - 1) {
        var cursor = document.createElement('span');
        cursor.className = 'terminal-sequence-cursor';
        code.appendChild(cursor);
      }

      row.appendChild(code);
      fragment.appendChild(row);
    });

    editor.replaceChildren(fragment);
    var body = overlay.querySelector('.terminal-overlay-body');
    if (body) body.scrollTop = body.scrollHeight;
  }

  function clearSequenceTimer() {
    if (timerId === null) return;
    window.clearTimeout(timerId);
    timerId = null;
  }

  function schedule(token, delay, callback) {
    clearSequenceTimer();
    timerId = window.setTimeout(function () {
      timerId = null;
      if (!running || token !== runToken) return;
      callback();
    }, delay);
  }

  function getCharacterDelay(base, character, decisive) {
    var variance = SPEED_VARIANCE[varianceIndex % SPEED_VARIANCE.length];
    varianceIndex += 1;
    var delay = base * variance * TYPE_SPEED_FACTOR;
    if (/[,;{}]/.test(character)) delay += decisive ? 8 : 18;
    if (/\s/.test(character)) delay *= 0.78;
    return Math.max(22, Math.round(delay));
  }

  function typeCharacter(character) {
    output += character;
    render();
  }

  function deleteCharacter() {
    output = output.slice(0, -1);
    render();
  }

  function typeText(token, value, speed, decisive, done) {
    var index = 0;
    overlay.classList.add('sequence-typing');

    function typeNext() {
      if (!running || token !== runToken) return;
      if (index >= value.length) {
        overlay.classList.remove('sequence-typing');
        done();
        return;
      }

      var character = value.charAt(index);
      typeCharacter(character);
      index += 1;
      schedule(token, getCharacterDelay(speed, character, decisive), typeNext);
    }

    typeNext();
  }

  function deleteText(token, count, speed, done) {
    var deleted = 0;
    overlay.classList.add('sequence-typing');

    function deleteNext() {
      if (!running || token !== runToken) return;
      if (deleted >= count) {
        overlay.classList.remove('sequence-typing');
        done();
        return;
      }

      deleteCharacter();
      deleted += 1;
      schedule(token, getCharacterDelay(speed, '', false), deleteNext);
    }

    deleteNext();
  }

  function runStep(token, index) {
    if (!running || token !== runToken) return;
    activeStep = index;
    overlay.dataset.sequenceStep = String(index);

    if (index >= TIMELINE.length) return;
    var step = TIMELINE[index];
    var content = CONTENT[currentLang];
    var next = function () { runStep(token, index + 1); };

    if (step.action === 'wait') {
      schedule(token, step.duration, next);
    } else if (step.action === 'type') {
      typeText(token, content[step.field], step.speed, Boolean(step.decisive), next);
    } else if (step.action === 'delete') {
      deleteText(token, content[step.field].length, step.speed, next);
    } else if (step.action === 'complete') {
      overlay.classList.add('sequence-complete');
      next();
    } else if (step.action === 'close') {
      stopSequence();
      document.dispatchEvent(new CustomEvent('ub:terminalrequestclose'));
    }
  }

  function stopSequence() {
    runToken += 1;
    running = false;
    activeStep = -1;
    clearSequenceTimer();
    overlay.classList.remove('sequence-running', 'sequence-typing', 'sequence-complete', 'sequence-reduced');
    overlay.dataset.sequenceState = 'idle';
    overlay.dataset.sequenceStep = '';
  }

  function startSequence() {
    stopSequence();
    running = true;
    runToken += 1;
    var token = runToken;
    output = '';
    varianceIndex = 0;
    overlay.classList.add('sequence-running');
    overlay.dataset.sequenceState = 'running';

    var content = CONTENT[currentLang];
    accessibleText.textContent = getFinalText(content);

    if (motionQuery.matches) {
      output = getFinalText(content);
      overlay.classList.add('sequence-reduced', 'sequence-complete');
      overlay.dataset.sequenceState = 'reduced';
      render();
      schedule(token, 14000, function () {
        stopSequence();
        document.dispatchEvent(new CustomEvent('ub:terminalrequestclose'));
      });
      return;
    }

    render();
    runStep(token, 0);
  }

  document.addEventListener('ub:terminalopened', startSequence);
  document.addEventListener('ub:terminalclosing', stopSequence);

  document.addEventListener('ub:langchange', function (event) {
    currentLang = event.detail && event.detail.lang === 'en' ? 'en' : 'tr';
    if (running) startSequence();
  });

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden || !running) return;
    stopSequence();
    document.dispatchEvent(new CustomEvent('ub:terminalrequestclose'));
  });

  function handleMotionChange() {
    if (running) startSequence();
  }

  if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', handleMotionChange);
  } else if (typeof motionQuery.addListener === 'function') {
    motionQuery.addListener(handleMotionChange);
  }

  accessibleText.textContent = getFinalText(CONTENT[currentLang]);
  render();
})();
