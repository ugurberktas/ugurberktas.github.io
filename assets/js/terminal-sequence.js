(function () {
  'use strict';

  var overlay = document.getElementById('terminal-overlay');
  var editor = document.getElementById('terminal-sequence-editor');
  var accessibleText = document.getElementById('terminal-sequence-accessible');
  if (!overlay || !editor || !accessibleText) return;

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var currentLang = localStorage.getItem('ub-lang') === 'en' ? 'en' : 'tr';
  var soundEnabled = true;
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

  /* The complete cinematic flow lives here so timing/content can be revised in one place. */
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

  function createAudioEngine() {
    var SAMPLE_URLS = {
      keys: [
        'assets/audio/terminal/key-1.wav',
        'assets/audio/terminal/key-2.wav',
        'assets/audio/terminal/key-3.wav',
        'assets/audio/terminal/key-4.wav',
        'assets/audio/terminal/key-5.wav'
      ],
      space: 'assets/audio/terminal/space.wav',
      enter: 'assets/audio/terminal/enter.wav',
      backspace: 'assets/audio/terminal/backspace.wav'
    };
    var SAMPLE_MANIFEST = SAMPLE_URLS.keys.map(function (url, index) {
      return { id: 'key-' + index, url: url };
    }).concat([
      { id: 'space', url: SAMPLE_URLS.space },
      { id: 'enter', url: SAMPLE_URLS.enter },
      { id: 'backspace', url: SAMPLE_URLS.backspace }
    ]);
    var BACKGROUND_URL = 'assets/audio/terminal/sespeak.m4a';
    var context = null;
    var master = null;
    var musicGain = null;
    var compressor = null;
    var suspendTimer = null;
    var musicTimer = null;
    var musicNextStartTime = 0;
    var musicRunning = false;
    var experienceActive = false;
    var musicStartToken = 0;
    var backgroundBuffer = null;
    var backgroundBufferPromise = null;
    var activeMusicSources = [];
    var mediaPools = {};
    var mediaPoolIndexes = {};
    var mediaUnlocked = false;
    var MEDIA_POOL_SIZE = 4;
    var MUSIC_LEVEL = 0.35;
    var MUSIC_SCHEDULE_AHEAD = 0.65;
    var MUSIC_SCHEDULER_INTERVAL = 200;
    var backgroundDataPromise = typeof window.fetch === 'function'
      ? window.fetch(BACKGROUND_URL, { cache: 'force-cache' }).then(function (response) {
          if (!response.ok) throw new Error('Background audio could not be loaded');
          return response.arrayBuffer();
        }).catch(function () { return null; })
      : Promise.resolve(null);

    function configureMedia(media) {
      media.preload = 'auto';
      media.playsInline = true;
      return media;
    }

    function expandMediaPool(id, primary) {
      var pool = mediaPools[id];
      if (!pool || pool.length >= MEDIA_POOL_SIZE) return;

      while (pool.length < MEDIA_POOL_SIZE) {
        var media = typeof primary.cloneNode === 'function'
          ? primary.cloneNode(true)
          : new window.Audio(primary.src);
        configureMedia(media);
        pool.push(media);
      }
    }

    function buildMediaPools() {
      if (typeof window.Audio !== 'function') return;
      SAMPLE_MANIFEST.forEach(function (sample) {
        var primary = configureMedia(new window.Audio(sample.url));
        mediaPools[sample.id] = [primary];
        mediaPoolIndexes[sample.id] = 0;

        /* Load each unique WAV once before cloning playback voices. This keeps
           overlap support without issuing four simultaneous requests per file. */
        var expand = function () { expandMediaPool(sample.id, primary); };
        primary.addEventListener('loadeddata', expand, { once: true });
        primary.addEventListener('error', expand, { once: true });
        primary.load();
      });
    }

    buildMediaPools();

    function clearSuspendTimer() {
      if (suspendTimer === null) return;
      window.clearTimeout(suspendTimer);
      suspendTimer = null;
    }

    function clearMusicTimer() {
      if (musicTimer === null) return;
      window.clearTimeout(musicTimer);
      musicTimer = null;
    }

    function unlockMediaSamples() {
      if (mediaUnlocked) return;
      mediaUnlocked = true;

      Object.keys(mediaPools).forEach(function (id) {
        mediaPools[id].forEach(function (media) {
          media.muted = true;
          media.volume = 0;
          var playResult = media.play();
          if (!playResult || typeof playResult.then !== 'function') {
            media.pause();
            media.currentTime = 0;
            media.muted = false;
            return;
          }
          playResult.then(function () {
            media.pause();
            media.currentTime = 0;
            media.muted = false;
          }).catch(function () {
            media.muted = false;
          });
        });
      });
    }

    function configureAudioGraph() {
      master = context.createGain();
      musicGain = context.createGain();
      musicGain.gain.setValueAtTime(MUSIC_LEVEL, context.currentTime);
      master.gain.setValueAtTime(0.0001, context.currentTime);

      if (typeof context.createDynamicsCompressor === 'function') {
        compressor = context.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-12, context.currentTime);
        compressor.knee.setValueAtTime(8, context.currentTime);
        compressor.ratio.setValueAtTime(3, context.currentTime);
        compressor.attack.setValueAtTime(0.008, context.currentTime);
        compressor.release.setValueAtTime(0.16, context.currentTime);
        musicGain.connect(compressor);
        compressor.connect(master);
      } else {
        musicGain.connect(master);
      }

      master.connect(context.destination);
    }

    function decodeBackgroundData(data) {
      return new Promise(function (resolve) {
        var settled = false;
        var finish = function (buffer) {
          if (settled) return;
          settled = true;
          resolve(buffer || null);
        };

        try {
          var decodeResult = context.decodeAudioData(data.slice(0), finish, function () { finish(null); });
          if (decodeResult && typeof decodeResult.then === 'function') {
            decodeResult.then(finish).catch(function () { finish(null); });
          }
        } catch (error) {
          finish(null);
        }
      });
    }

    function ensureBackgroundBuffer() {
      if (backgroundBuffer) return Promise.resolve(backgroundBuffer);
      if (backgroundBufferPromise) return backgroundBufferPromise;
      if (!context) return Promise.resolve(null);

      backgroundBufferPromise = backgroundDataPromise.then(function (data) {
        if (!data) return null;
        return decodeBackgroundData(data);
      }).then(function (buffer) {
        if (!buffer || !isFinite(buffer.duration) || buffer.duration <= 0.1) return null;
        backgroundBuffer = buffer;
        return backgroundBuffer;
      }).catch(function () { return null; });

      return backgroundBufferPromise;
    }

    function prepare() {
      if (!soundEnabled) return;
      experienceActive = true;
      clearSuspendTimer();
      unlockMediaSamples();

      try {
        if (!context) {
          var AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (!AudioContextClass) return;
          context = new AudioContextClass();
          configureAudioGraph();
          ensureBackgroundBuffer();
        }

        var resumeResult = context.resume();
        if (resumeResult && typeof resumeResult.catch === 'function') {
          resumeResult.then(function () {
            if (experienceActive && soundEnabled) {
              fadeTo(1, 0.12);
              startMusic();
            }
          }).catch(function () {});
        }
      } catch (error) {
        context = null;
      }
    }

    function canPlayAudio() {
      return soundEnabled && context && master && context.state === 'running';
    }

    function fadeTo(value, duration) {
      if (!context || !master) return;
      var now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(0.0001, master.gain.value || 0.0001), now);
      master.gain.exponentialRampToValueAtTime(Math.max(0.0001, value), now + duration);
    }

    function start() {
      experienceActive = true;
      clearSuspendTimer();
      if (!canPlayAudio()) return;
      fadeTo(1, 0.12);
      startMusic();
    }

    function stopMediaSamples() {
      Object.keys(mediaPools).forEach(function (id) {
        mediaPools[id].forEach(function (media) {
          media.pause();
          try { media.currentTime = 0; } catch (error) {}
        });
      });
    }

    function removeMusicSource(entry) {
      activeMusicSources = activeMusicSources.filter(function (item) { return item !== entry; });
      try { entry.source.disconnect(); } catch (error) {}
      try { entry.gain.disconnect(); } catch (error) {}
    }

    function stopMusic(delay) {
      musicStartToken += 1;
      musicRunning = false;
      musicNextStartTime = 0;
      clearMusicTimer();
      if (!context) {
        activeMusicSources = [];
        return;
      }

      var stopTime = context.currentTime + (delay || 0);
      activeMusicSources.slice().forEach(function (entry) {
        try { entry.source.stop(stopTime); } catch (error) {}
      });
      activeMusicSources = [];
    }

    function stop() {
      experienceActive = false;
      stopMediaSamples();
      stopMusic(0.04);
      if (!context || !master) return;
      clearSuspendTimer();
      fadeTo(0.0001, 0.035);
      var activeContext = context;
      suspendTimer = window.setTimeout(function () {
        suspendTimer = null;
        if (activeContext.state === 'running') {
          var suspendResult = activeContext.suspend();
          if (suspendResult && typeof suspendResult.catch === 'function') {
            suspendResult.catch(function () {});
          }
        }
      }, 70);
    }

    function playMediaSample(id, volume, playbackRate) {
      var pool = mediaPools[id];
      if (!soundEnabled || !pool || !pool.length) return;
      var index = mediaPoolIndexes[id] % pool.length;
      var media = pool[index];
      mediaPoolIndexes[id] = index + 1;
      media.pause();
      try { media.currentTime = 0; } catch (error) {}
      media.muted = false;
      media.volume = Math.min(1, volume * 0.78);
      media.playbackRate = playbackRate;
      var playResult = media.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {});
      }
    }

    function playSample(id, volume, playbackRate) {
      playMediaSample(id, volume, playbackRate);
    }

    function character(value, index) {
      if (value === '\n') {
        playSample('enter', 0.76, 0.98);
      } else if (value === ' ') {
        playSample('space', 0.66, 0.97);
      } else {
        playSample('key-' + (index % SAMPLE_URLS.keys.length), 0.68, 0.98 + (index % 3) * 0.012);
      }
    }

    function backspace(index) {
      playSample('backspace', 0.78, 0.94 + (index % 2) * 0.015);
    }

    function scheduleMusicSegment(startTime) {
      if (!backgroundBuffer || !musicGain || !musicRunning) return startTime;
      var duration = backgroundBuffer.duration;
      var crossfade = Math.min(0.09, Math.max(0.035, duration * 0.02));
      var endTime = startTime + duration;
      var source = context.createBufferSource();
      var voiceGain = context.createGain();
      var entry = { source: source, gain: voiceGain };

      source.buffer = backgroundBuffer;
      voiceGain.gain.setValueAtTime(0.0001, startTime);
      voiceGain.gain.linearRampToValueAtTime(1, startTime + crossfade);
      voiceGain.gain.setValueAtTime(1, endTime - crossfade);
      voiceGain.gain.linearRampToValueAtTime(0.0001, endTime);
      source.connect(voiceGain);
      voiceGain.connect(musicGain);
      source.onended = function () { removeMusicSource(entry); };
      activeMusicSources.push(entry);
      source.start(startTime, 0);
      source.stop(endTime + 0.02);

      return endTime - crossfade;
    }

    function scheduleMusicWindow() {
      musicTimer = null;
      if (!musicRunning || !soundEnabled || !context || !backgroundBuffer) return;

      if (context.state !== 'running') {
        musicTimer = window.setTimeout(scheduleMusicWindow, 120);
        return;
      }

      var horizon = context.currentTime + MUSIC_SCHEDULE_AHEAD;
      while (musicNextStartTime < horizon) {
        musicNextStartTime = scheduleMusicSegment(musicNextStartTime);
      }

      musicTimer = window.setTimeout(scheduleMusicWindow, MUSIC_SCHEDULER_INTERVAL);
    }

    function startMusic() {
      if (musicRunning || !canPlayAudio()) return;
      var token = musicStartToken;

      ensureBackgroundBuffer().then(function (buffer) {
        if (!buffer || token !== musicStartToken || musicRunning || !experienceActive || !canPlayAudio()) return;
        musicRunning = true;
        musicNextStartTime = context.currentTime + 0.03;
        scheduleMusicWindow();
      }).catch(function () {});
    }

    return {
      prepare: prepare,
      start: start,
      stop: stop,
      character: character,
      backspace: backspace
    };
  }

  var audio = createAudioEngine();

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
    audio.character(character, varianceIndex);
  }

  function deleteCharacter(index) {
    output = output.slice(0, -1);
    render();
    audio.backspace(index);
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

      deleteCharacter(deleted);
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

  function stopSequence(keepAudio) {
    runToken += 1;
    running = false;
    activeStep = -1;
    clearSequenceTimer();
    overlay.classList.remove('sequence-running', 'sequence-typing', 'sequence-complete', 'sequence-reduced');
    overlay.dataset.sequenceState = 'idle';
    overlay.dataset.sequenceStep = '';
    if (!keepAudio) audio.stop();
  }

  function startSequence() {
    var keepOpeningAudio = !running;
    stopSequence(keepOpeningAudio);
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
    audio.start();
    runStep(token, 0);
  }


  document.addEventListener('ub:terminalgesture', function () {
    audio.prepare();
  });

  document.addEventListener('ub:terminalopened', startSequence);
  document.addEventListener('ub:terminalclosing', function () {
    stopSequence();
  });

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
