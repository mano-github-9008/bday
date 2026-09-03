'use strict';

  /* ============================================================
     2. FLOATING HEARTS (SVG-based, 3D glossy look)
  ============================================================ */
  const heartsLayer   = document.getElementById('hearts-layer');
  const HEART_COLORS  = [
    ['#ff80a8','#e8185e','#7a0028'],
    ['#ff99bb','#ff3377','#8b001f'],
    ['#ffc0d4','#ff4d8b','#6b0022'],
    ['#ffaac4','#cc0044','#5a0018'],
  ];
  let activeHearts = 0;
  const MAX_HEARTS = 10;

  function makeHeartSVG(c1, c2, c3, id) {
    return `<svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <radialGradient id="${id}" cx="35%" cy="28%" r="68%">
          <stop offset="0%"   stop-color="${c1}"/>
          <stop offset="38%"  stop-color="${c2}"/>
          <stop offset="80%"  stop-color="${c3}"/>
          <stop offset="100%" stop-color="${c3}cc"/>
        </radialGradient>
        <filter id="fs${id}">
          <feGaussianBlur stdDeviation="0.8"/>
        </filter>
      </defs>
      <path d="M50,80 C50,80 5,52 5,26 C5,11 17,3 27,5 C37,7 50,20 50,20
               C50,20 63,7 73,5 C83,3 95,11 95,26 C95,52 50,80 50,80 Z"
            fill="url(#${id})"/>
      <ellipse cx="31" cy="22" rx="13" ry="8" fill="rgba(255,255,255,0.42)"
               transform="rotate(-28 31 22)" filter="url(#fs${id})"/>
    </svg>`;
  }

  function spawnHeart() {
    if (activeHearts >= MAX_HEARTS) return;
    activeHearts++;

    const wrap    = document.createElement('div');
    wrap.className = 'f-heart';

    const palette  = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    const id       = 'hg' + Math.random().toString(36).slice(2,8);
    const size     = 36 + Math.random() * 54;
    const xPct     = 3 + Math.random() * 94;
    const dur      = 10 + Math.random() * 8;
    const delay    = Math.random() * 2;

    wrap.style.cssText = `
      left: ${xPct}%;
      width: ${size}px;
      height: ${size * 0.9}px;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      filter: drop-shadow(0 6px 18px ${palette[1]}88);
    `;
    wrap.innerHTML = makeHeartSVG(palette[0], palette[1], palette[2], id);

    wrap.addEventListener('animationend', () => {
      wrap.remove();
      activeHearts = Math.max(0, activeHearts - 1);
    });

    heartsLayer.appendChild(wrap);
  }

  setInterval(spawnHeart, 1800);
  setTimeout(spawnHeart, 200);
  setTimeout(spawnHeart, 800);
  setTimeout(spawnHeart, 1400);


  /* ============================================================
     3. FLOATING BALLOONS (SVG-based)
  ============================================================ */
  const balloonsLayer   = document.getElementById('balloons-layer');
  const BALLOON_PALETTES = [
    { body: '#ff1a6b', light: '#ff99bb', shadow: '#8b0030' },
    { body: '#e8185e', light: '#ffaac5', shadow: '#7a0028' },
    { body: '#cc0044', light: '#ff80a8', shadow: '#6b001f' },
    { body: '#ff4d8b', light: '#ffc0d4', shadow: '#990033' },
  ];
  let activeBalloons = 0;
  const MAX_BALLOONS = 6;

  function makeBalloonSVG(p, bid) {
    return `<svg viewBox="0 0 70 150" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <radialGradient id="${bid}" cx="33%" cy="28%" r="65%">
          <stop offset="0%"   stop-color="${p.light}"/>
          <stop offset="45%"  stop-color="${p.body}"/>
          <stop offset="100%" stop-color="${p.shadow}"/>
        </radialGradient>
        <filter id="sf${bid}"><feGaussianBlur stdDeviation="0.7"/></filter>
      </defs>
      <!-- Balloon body -->
      <ellipse cx="35" cy="40" rx="30" ry="37" fill="url(#${bid})"/>
      <!-- Highlight gleam -->
      <ellipse cx="24" cy="23" rx="9" ry="6" fill="rgba(255,255,255,0.38)"
               transform="rotate(-22 24 23)" filter="url(#sf${bid})"/>
      <!-- Knot -->
      <path d="M30,77 Q35,85 40,77" stroke="${p.body}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- String -->
      <path d="M35,86 Q28,100 35,114 Q42,128 35,148"
            stroke="rgba(255,200,215,0.55)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  function spawnBalloon() {
    if (activeBalloons >= MAX_BALLOONS) return;
    activeBalloons++;

    const wrap    = document.createElement('div');
    wrap.className = 'f-balloon';

    const p       = BALLOON_PALETTES[Math.floor(Math.random() * BALLOON_PALETTES.length)];
    const bid     = 'bg' + Math.random().toString(36).slice(2,8);
    const w       = 45 + Math.random() * 35;
    const h       = w * 2.2;
    const xPct    = 2 + Math.random() * 92;
    const dur     = 14 + Math.random() * 10;

    wrap.style.cssText = `
      left: ${xPct}%;
      width: ${w}px;
      height: ${h}px;
      animation-duration: ${dur}s;
      filter: drop-shadow(0 4px 14px ${p.body}77);
    `;
    wrap.innerHTML = makeBalloonSVG(p, bid);

    wrap.addEventListener('animationend', () => {
      wrap.remove();
      activeBalloons = Math.max(0, activeBalloons - 1);
    });

    balloonsLayer.appendChild(wrap);
  }

  setInterval(spawnBalloon, 3000);
  setTimeout(spawnBalloon, 500);
  setTimeout(spawnBalloon, 2000);


  /* ============================================================
     4. PAGE SYSTEM
  ============================================================ */
  const pages      = document.querySelectorAll('.poem-page');
  const totalPages = pages.length;
  let   currentPage = 0;
  let   audioMuted  = false;

  // Build dots
  const dotsWrap = document.getElementById('page-dots');
  pages.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'page-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Page ${i + 1}`);
    d.addEventListener('click', () => goToPage(i));
    dotsWrap.appendChild(d);
  });

  function updateDots() {
    document.querySelectorAll('.page-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentPage);
    });
  }

  function stopAllAudio() {
    for (let i = 0; i < totalPages; i++) {
      const a = document.getElementById('audio' + i);
      if (a) { a.pause(); a.currentTime = 0; }
    }
  }

  function playPageAudio(idx) {
    if (audioMuted) return;
    const a = document.getElementById('audio' + idx);
    if (a) a.play().catch(() => {});
  }

  function goToPage(idx) {
    pages[currentPage].classList.remove('active');
    currentPage = Math.max(0, Math.min(idx, totalPages - 1));
    pages[currentPage].classList.remove('active');
    void pages[currentPage].offsetWidth; // reflow to retrigger animation
    pages[currentPage].classList.add('active');
    updateDots();
    stopAllAudio();
    playPageAudio(currentPage);
    updateNavBtns();
  }

  function nextPage() { if (currentPage < totalPages - 1) goToPage(currentPage + 1); }
  function prevPage() { if (currentPage > 0)              goToPage(currentPage - 1); }

  function updateNavBtns() {
    document.getElementById('prev-btn').style.opacity = currentPage === 0 ? '0.3' : '1';
    document.getElementById('next-btn').style.opacity = currentPage === totalPages - 1 ? '0.3' : '1';
  }
  updateNavBtns();

  document.getElementById('prev-btn').addEventListener('click', prevPage);
  document.getElementById('next-btn').addEventListener('click', nextPage);


  /* ============================================================
     5. LANDING <-> CARD TRANSITION
  ============================================================ */
  const landing          = document.getElementById('landing');
  const cardWrapper      = document.getElementById('card-wrapper');
  const openBtn          = document.getElementById('open-btn');
  const closeBtn         = document.getElementById('close-btn');

  // Music player elements
  const musicReveal      = document.getElementById('music-reveal');
  const playMusicBtn     = document.getElementById('play-music-btn');
  const audioPill        = document.getElementById('audio-pill');
  const audioBars        = document.getElementById('audio-bars');
  const audioLabel       = document.getElementById('audio-label');
  const playerCloseBtn   = document.getElementById('player-close-btn');
  const playerPlayBtn    = document.getElementById('player-play-btn');
  const eqBarsEl         = document.getElementById('eq-bars');
  const specialSong      = document.getElementById('special-song');

  openBtn.addEventListener('click', () => {
    landing.classList.add('fading-out');
    cardWrapper.classList.add('visible');
    goToPage(0);
    setTimeout(() => landing.classList.add('gone'), 900);
  });

  closeBtn.addEventListener('click', () => {
    cardWrapper.classList.add('card-closing');
    stopAllAudio();

    setTimeout(() => {
      cardWrapper.classList.remove('visible');
      cardWrapper.classList.remove('card-closing');
      currentPage = 0;

      landing.classList.remove('gone');
      landing.classList.add('gone');

      musicReveal.classList.add('visible');
    }, 680);
  });


  /* ============================================================
     6. VIDEO SONG TOGGLE (pill click while not in special mode)
  ============================================================ */
  let specialMode = false;
  let specialPlaying = false;

  audioPill.addEventListener('click', () => {
    if (specialMode) {
      if (!audioPill.classList.contains('expanded')) {
        audioPill.classList.add('expanded');
      }
    } else {
      audioMuted = !audioMuted;
      audioBars.classList.toggle('paused', audioMuted);
      audioLabel.textContent = audioMuted ? 'Muted' : 'Video ♪';
      if (audioMuted) { stopAllAudio(); }
      else            { playPageAudio(currentPage); }
    }
  });


  /* ============================================================
     7. KEYBOARD + SWIPE NAVIGATION
  ============================================================ */
  window.addEventListener('keydown', e => {
    if (!cardWrapper.classList.contains('visible')) return;
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft')  prevPage();
    if (e.key === 'Escape')     closeBtn.click();
  });

  let swipeStartX = 0;
  const mc = document.getElementById('main-card');
  mc.addEventListener('touchstart', e => { swipeStartX = e.touches[0].clientX; }, { passive: true });
  mc.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - swipeStartX;
    if (Math.abs(dx) > 45) { dx < 0 ? nextPage() : prevPage(); }
  }, { passive: true });


  /* ============================================================
     8. VIDEO SONG PLAYER
  ============================================================ */
  const progressFill     = document.getElementById('player-progress-fill');
  const progressTrack    = document.getElementById('vsp-progress-track');
  const centerPlayBtn    = document.getElementById('vsp-center-play');
  const volBtn           = document.getElementById('vsp-vol-btn');
  const volSlider        = document.getElementById('vsp-volume');
  const fullscreenBtn    = document.getElementById('vsp-fullscreen-btn');
  const fsIcon           = document.getElementById('vsp-fs-icon');

  /* ── Helper: format seconds → m:ss ── */
  function formatTime(secs) {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  /* ── Update total duration label once metadata loads ── */
  function updateTotalTime() {
    const el = document.getElementById('time-total');
    if (el && specialSong.duration) el.textContent = formatTime(specialSong.duration);
  }
  specialSong.addEventListener('loadedmetadata', updateTotalTime, { once: true });

  /* ── Progress bar: update fill + timestamp while playing ── */
  specialSong.addEventListener('timeupdate', () => {
    const cur = document.getElementById('time-current');
    if (cur) cur.textContent = formatTime(specialSong.currentTime);

    if (specialSong.duration) {
      const pct = (specialSong.currentTime / specialSong.duration) * 100;
      progressFill.style.width = pct + '%';
    }
  });

  /* ── Seek: click anywhere on the progress track ── */
  progressTrack.addEventListener('click', e => {
    const rect = progressTrack.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (specialSong.duration) {
      specialSong.currentTime = ratio * specialSong.duration;
    }
  });

  /* ── Centre play button: click to play (also syncs bottom controls) ── */
  centerPlayBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (specialSong.paused) {
      specialSong.play().catch(() => {});
    }
  });

  /* ── Sync UI state whenever video actually plays or pauses ── */
  function syncPlayState(playing) {
    specialPlaying = playing;
    const iconPause = playerPlayBtn.querySelector('.icon-pause');
    const iconPlay  = playerPlayBtn.querySelector('.icon-play');

    if (playing) {
      if (iconPause) iconPause.style.display = '';
      if (iconPlay)  iconPlay.style.display = 'none';
      centerPlayBtn.classList.add('hidden');
      eqBarsEl.classList.remove('paused');
      audioBars.classList.remove('paused');
      audioLabel.textContent = '♪ Playing…';
    } else {
      if (iconPause) iconPause.style.display = 'none';
      if (iconPlay)  iconPlay.style.display = '';
      centerPlayBtn.classList.remove('hidden');
      eqBarsEl.classList.add('paused');
      audioBars.classList.add('paused');
      audioLabel.textContent = 'Paused';
    }
  }

  specialSong.addEventListener('play',  () => syncPlayState(true));
  specialSong.addEventListener('pause', () => syncPlayState(false));

  /* ── Trigger: "Play Music" button opens video player ── */
  playMusicBtn.addEventListener('click', () => {
    musicReveal.classList.remove('visible');
    specialMode = true;

    // Reset UI
    progressFill.style.width = '0%';
    updateTotalTime();

    stopAllAudio();
    specialSong.play().catch(() => {
      // Autoplay blocked — show centre play button for user to tap
      centerPlayBtn.classList.remove('hidden');
      console.info('Autoplay blocked. User can press Play.');
    });

    setTimeout(() => {
      audioPill.classList.add('expanded');
    }, 180);
  });

  /* ── Bottom play/pause button ── */
  playerPlayBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (specialSong.paused) {
      specialSong.play().catch(() => {});
    } else {
      specialSong.pause();
    }
  });

  /* ── Volume slider ── */
  volSlider.addEventListener('input', () => {
    const v = parseFloat(volSlider.value);
    specialSong.volume = v;
    specialSong.muted  = (v === 0);
    // Drive custom track fill colour via CSS variable
    volSlider.style.setProperty('--volume-pct', (v * 100) + '%');
    updateVolIcon(v);
  });

  /* ── Mute toggle button ── */
  volBtn.addEventListener('click', e => {
    e.stopPropagation();
    specialSong.muted = !specialSong.muted;
    const vol = specialSong.muted ? 0 : parseFloat(volSlider.value) || 1;
    updateVolIcon(specialSong.muted ? 0 : vol);
  });

  function updateVolIcon(vol) {
    // Switch between speaker-with-waves vs muted (X) icon
    const muted = (vol === 0);
    fsIcon; // keep reference lint quiet
    volBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    const svg = document.getElementById('vsp-vol-icon');
    if (!svg) return;
    if (muted) {
      svg.innerHTML = `
        <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
        <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    } else if (vol < 0.5) {
      svg.innerHTML = `
        <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    } else {
      svg.innerHTML = `
        <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    }
  }

  /* ── Rewind 10s ── */
  document.getElementById('player-prev-btn').addEventListener('click', e => {
    e.stopPropagation();
    specialSong.currentTime = Math.max(0, specialSong.currentTime - 10);
  });

  /* ── Forward 10s ── */
  document.getElementById('player-next-btn').addEventListener('click', e => {
    e.stopPropagation();
    specialSong.currentTime = Math.min(specialSong.duration || 0, specialSong.currentTime + 10);
  });

  /* ── Fullscreen ── */
  const FULLSCREEN_EXIT_SVG = `
    <polyline points="4 14 10 14 10 20"></polyline>
    <polyline points="20 10 14 10 14 4"></polyline>
    <line x1="10" y1="14" x2="3" y2="21"></line>
    <line x1="21" y1="3" x2="14" y2="10"></line>`;
  const FULLSCREEN_ENTER_SVG = `
    <polyline points="15 3 21 3 21 9"></polyline>
    <polyline points="9 21 3 21 3 15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>`;

  fullscreenBtn.addEventListener('click', e => {
    e.stopPropagation();
    const target = specialSong; // fullscreen the video itself
    if (!document.fullscreenElement) {
      (target.requestFullscreen || target.webkitRequestFullscreen || target.mozRequestFullScreen)
        .call(target).catch(() => {});
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen)
        .call(document).catch(() => {});
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      fsIcon.innerHTML = FULLSCREEN_EXIT_SVG;
      fullscreenBtn.setAttribute('aria-label', 'Exit fullscreen');
      if (document.fullscreenElement === specialSong) {
        specialSong.setAttribute('controls', 'true');
      }
    } else {
      fsIcon.innerHTML = FULLSCREEN_ENTER_SVG;
      fullscreenBtn.setAttribute('aria-label', 'Fullscreen');
      specialSong.removeAttribute('controls');
    }
  });



  /* ============================================================
     9. SURPRISE FLOW LOGIC (States 5, 6, 7)
  ============================================================ */
  const surpriseReveal = document.getElementById('surprise-reveal');
  const surpriseBtn = document.getElementById('surprise-btn');
  const videoOverlay = document.getElementById('video-overlay');
  const surpriseVideo = document.getElementById('surprise-video');
  const videoCloseBtn = document.getElementById('video-close-btn');
  const finalWishes = document.getElementById('final-wishes');

  let surpriseTriggered = false;

  function triggerSurprise() {
    if (surpriseTriggered) return;
    surpriseTriggered = true;
    
    // Stop audio player
    specialSong.pause();
    specialPlaying = false;
    audioPill.classList.remove('expanded');
    audioPill.style.display = 'none'; // hide pill entirely for the finale
    
    // Show surprise button state
    surpriseReveal.classList.add('visible');
  }

  // Trigger surprise when audio ends naturally
  specialSong.addEventListener('ended', triggerSurprise);

  // Or trigger when player is manually closed
  playerCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    audioPill.classList.remove('expanded');
    // If they close it after it has started playing, trigger the surprise
    if (specialPlaying || specialSong.currentTime > 0) {
      triggerSurprise();
    }
  });

  // When surprise button is clicked, show video overlay
  surpriseBtn.addEventListener('click', () => {
    surpriseReveal.classList.remove('visible');
    videoOverlay.classList.add('visible');
    
    surpriseVideo.play().catch(e => console.info("Video autoplay blocked", e));
  });

  let wishesTriggered = false;

  function triggerFinalWishes() {
    if (wishesTriggered) return;
    wishesTriggered = true;

    // Stop video
    surpriseVideo.pause();
    videoOverlay.classList.remove('visible');

    // Show final wishes
    finalWishes.classList.add('visible');
  }

  // Trigger wishes when video ends
  surpriseVideo.addEventListener('ended', triggerFinalWishes);

  // Or trigger when video is closed manually
  videoCloseBtn.addEventListener('click', triggerFinalWishes);

  // Close button on final wishes card
  const wishesCloseBtn = document.getElementById('wishes-close-btn');
  if (wishesCloseBtn) {
    wishesCloseBtn.addEventListener('click', () => {
      finalWishes.classList.remove('visible');
    });
  }

