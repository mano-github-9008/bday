'use strict';

/* ============================================================
   2. FLOATING HEARTS (SVG-based, 3D glossy look)
============================================================ */
const heartsLayer = document.getElementById('hearts-layer');
const HEART_COLORS = [
  ['#ff80a8', '#e8185e', '#7a0028'],
  ['#ff99bb', '#ff3377', '#8b001f'],
  ['#ffc0d4', '#ff4d8b', '#6b0022'],
  ['#ffaac4', '#cc0044', '#5a0018'],
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
  if (activeHearts >= MAX_HEARTS || !heartsLayer) return;
  activeHearts++;

  const wrap = document.createElement('div');
  wrap.className = 'f-heart';

  const palette = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
  const id = 'hg' + Math.random().toString(36).slice(2, 8);
  const size = 36 + Math.random() * 54;
  const xPct = 3 + Math.random() * 94;
  const dur = 10 + Math.random() * 8;
  const delay = Math.random() * 2;

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
const balloonsLayer = document.getElementById('balloons-layer');
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
  if (activeBalloons >= MAX_BALLOONS || !balloonsLayer) return;
  activeBalloons++;

  const wrap = document.createElement('div');
  wrap.className = 'f-balloon';

  const p = BALLOON_PALETTES[Math.floor(Math.random() * BALLOON_PALETTES.length)];
  const bid = 'bg' + Math.random().toString(36).slice(2, 8);
  const w = 45 + Math.random() * 35;
  const h = w * 2.2;
  const xPct = 2 + Math.random() * 92;
  const dur = 14 + Math.random() * 10;

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
const pages = document.querySelectorAll('.poem-page');
const totalPages = pages.length;
let currentPage = 0;
let audioMuted = false;

// Build dots
const dotsWrap = document.getElementById('page-dots');
if (dotsWrap) {
  pages.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'page-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Page ${i + 1}`);
    d.addEventListener('click', () => goToPage(i));
    dotsWrap.appendChild(d);
  });
}

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
  if (idx < 0 || idx >= totalPages) return;
  pages[currentPage].classList.remove('active');
  currentPage = idx;
  void pages[currentPage].offsetWidth; // force reflow to retrigger animation
  pages[currentPage].classList.add('active');
  updateDots();
  stopAllAudio();
  playPageAudio(currentPage);
  updateNavBtns();
}


/* ============================================================
   5. LANDING <-> CARD TRANSITION
============================================================ */
const landing = document.getElementById('landing');
const cardWrapper = document.getElementById('card-wrapper');
const openBtn = document.getElementById('open-btn');

// Music player elements
const musicReveal = document.getElementById('music-reveal');
const playMusicBtn = document.getElementById('play-music-btn');
const audioPill = document.getElementById('audio-pill');
const audioBars = document.getElementById('audio-bars');
const audioLabel = document.getElementById('audio-label');
const playerCloseBtn = document.getElementById('player-close-btn');
const playerPlayBtn = document.getElementById('player-play-btn');
const eqBarsEl = document.getElementById('eq-bars');
const specialSong = document.getElementById('special-song');

function triggerMusicReveal() {
  cardWrapper.classList.add('card-closing');
  stopAllAudio();

  setTimeout(() => {
    cardWrapper.classList.remove('visible', 'card-closing');
    currentPage = 0;

    landing.classList.add('gone');

    if (audioPill) {
      audioPill.style.pointerEvents = 'none';
      audioPill.classList.remove('expanded');
    }
    if (musicReveal) musicReveal.classList.add('visible');
  }, 680);
}

function nextPage() { 
  if (currentPage < totalPages - 1) {
    goToPage(currentPage + 1);
  } else {
    triggerMusicReveal();
  }
}

function prevPage() { 
  if (currentPage > 0) goToPage(currentPage - 1); 
}

function updateNavBtns() {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if (prevBtn) prevBtn.style.opacity = currentPage === 0 ? '0.3' : '1';
  if (nextBtn) {
    nextBtn.style.opacity = '1';
    nextBtn.innerText = currentPage === totalPages - 1 ? 'Next' : 'Next';
  }
}
updateNavBtns();

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
if (prevBtn) prevBtn.addEventListener('click', prevPage);
if (nextBtn) nextBtn.addEventListener('click', nextPage);

if (openBtn) {
  openBtn.addEventListener('click', () => {
    landing.classList.add('fading-out');
    cardWrapper.classList.add('visible');
    goToPage(0);
    setTimeout(() => landing.classList.add('gone'), 900);
  });
}


/* ============================================================
   6. VIDEO SONG TOGGLE (pill click while not in special mode)
============================================================ */
let specialMode = false;
let specialPlaying = false;

if (audioPill) {
  audioPill.addEventListener('click', () => {
    if (specialMode) {
      if (!audioPill.classList.contains('expanded')) {
        audioPill.classList.add('expanded');
      }
    } else {
      audioMuted = !audioMuted;
      if (audioBars) audioBars.classList.toggle('paused', audioMuted);
      if (audioLabel) audioLabel.textContent = audioMuted ? 'Muted' : 'Video ♪';
      if (audioMuted) { stopAllAudio(); }
      else { playPageAudio(currentPage); }
    }
  });
}


/* ============================================================
   7. KEYBOARD + SWIPE NAVIGATION
============================================================ */
window.addEventListener('keydown', e => {
  if (!cardWrapper.classList.contains('visible')) return;
  if (e.key === 'ArrowRight') nextPage();
  if (e.key === 'ArrowLeft') prevPage();
  if (e.key === 'Escape') {
    const closeBtn = document.getElementById('close-btn');
    if (closeBtn) closeBtn.click();
  }
});

let swipeStartX = 0;
const mc = document.getElementById('main-card');
if (mc) {
  mc.addEventListener('touchstart', e => { swipeStartX = e.touches[0].clientX; }, { passive: true });
  mc.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - swipeStartX;
    if (Math.abs(dx) > 45) { dx < 0 ? nextPage() : prevPage(); }
  }, { passive: true });
}


/* ============================================================
   8. VIDEO SONG PLAYER
============================================================ */
const progressFill = document.getElementById('player-progress-fill');
const progressTrack = document.getElementById('vsp-progress-track');
const centerPlayBtn = document.getElementById('vsp-center-play');
const volBtn = document.getElementById('vsp-vol-btn');
const volSlider = document.getElementById('vsp-volume');
const fullscreenBtn = document.getElementById('vsp-fullscreen-btn');
const fsIcon = document.getElementById('vsp-fs-icon');

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateTotalTime() {
  const el = document.getElementById('time-total');
  if (el && specialSong && specialSong.duration) {
    el.textContent = formatTime(specialSong.duration);
  }
}

if (specialSong) {
  specialSong.addEventListener('loadedmetadata', updateTotalTime, { once: true });

  specialSong.addEventListener('timeupdate', () => {
    const cur = document.getElementById('time-current');
    if (cur) cur.textContent = formatTime(specialSong.currentTime);

    if (specialSong.duration && progressFill) {
      const pct = (specialSong.currentTime / specialSong.duration) * 100;
      progressFill.style.width = pct + '%';
    }
  });
}

if (progressTrack) {
  progressTrack.addEventListener('click', e => {
    const rect = progressTrack.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (specialSong && specialSong.duration) {
      specialSong.currentTime = ratio * specialSong.duration;
    }
  });
}

if (centerPlayBtn) {
  centerPlayBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (specialSong && specialSong.paused) {
      specialSong.play().catch(() => {});
    }
  });
}

function syncPlayState(playing) {
  specialPlaying = playing;
  const iconPause = playerPlayBtn ? playerPlayBtn.querySelector('.icon-pause') : null;
  const iconPlay = playerPlayBtn ? playerPlayBtn.querySelector('.icon-play') : null;

  if (playing) {
    if (iconPause) iconPause.style.display = '';
    if (iconPlay) iconPlay.style.display = 'none';
    if (centerPlayBtn) centerPlayBtn.classList.add('hidden');
    if (eqBarsEl) eqBarsEl.classList.remove('paused');
    if (audioBars) audioBars.classList.remove('paused');
    if (audioLabel) audioLabel.textContent = '♪ Playing…';
  } else {
    if (iconPause) iconPause.style.display = 'none';
    if (iconPlay) iconPlay.style.display = '';
    if (centerPlayBtn) centerPlayBtn.classList.remove('hidden');
    if (eqBarsEl) eqBarsEl.classList.add('paused');
    if (audioBars) audioBars.classList.add('paused');
    if (audioLabel) audioLabel.textContent = 'Paused';
  }
}

if (specialSong) {
  specialSong.addEventListener('play', () => syncPlayState(true));
  specialSong.addEventListener('pause', () => syncPlayState(false));
}

if (playMusicBtn) {
  playMusicBtn.addEventListener('click', () => {
    if (musicReveal) musicReveal.classList.remove('visible');
    specialMode = true;

    if (progressFill) progressFill.style.width = '0%';
    updateTotalTime();

    stopAllAudio();
    if (specialSong) {
      specialSong.play().catch(() => {
        if (centerPlayBtn) centerPlayBtn.classList.remove('hidden');
        console.info('Autoplay blocked. User can press Play.');
      });
    }

    setTimeout(() => {
      if (audioPill) {
        audioPill.style.pointerEvents = '';
        audioPill.classList.add('expanded');
      }
    }, 180);
  });
}

if (playerPlayBtn) {
  playerPlayBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (specialSong) {
      if (specialSong.paused) {
        specialSong.play().catch(() => {});
      } else {
        specialSong.pause();
      }
    }
  });
}

if (volSlider) {
  volSlider.addEventListener('input', () => {
    const v = parseFloat(volSlider.value);
    if (specialSong) {
      specialSong.volume = v;
      specialSong.muted = (v === 0);
    }
    volSlider.style.setProperty('--volume-pct', (v * 100) + '%');
    updateVolIcon(v);
  });
}

if (volBtn) {
  volBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (specialSong) {
      specialSong.muted = !specialSong.muted;
      const vol = specialSong.muted ? 0 : parseFloat(volSlider.value) || 1;
      updateVolIcon(specialSong.muted ? 0 : vol);
    }
  });
}

function updateVolIcon(vol) {
  const muted = (vol === 0);
  if (volBtn) volBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
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

const prevSeekBtn = document.getElementById('player-prev-btn');
if (prevSeekBtn) {
  prevSeekBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (specialSong) specialSong.currentTime = Math.max(0, specialSong.currentTime - 10);
  });
}

const nextSeekBtn = document.getElementById('player-next-btn');
if (nextSeekBtn) {
  nextSeekBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (specialSong) specialSong.currentTime = Math.min(specialSong.duration || 0, specialSong.currentTime + 10);
  });
}

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

if (fullscreenBtn && specialSong) {
  fullscreenBtn.addEventListener('click', e => {
    e.stopPropagation();
    const target = specialSong;
    if (!document.fullscreenElement) {
      (target.requestFullscreen || target.webkitRequestFullscreen || target.mozRequestFullScreen)
        .call(target).catch(() => {});
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen)
        .call(document).catch(() => {});
    }
  });
}

document.addEventListener('fullscreenchange', () => {
  if (!fsIcon || !fullscreenBtn) return;
  if (document.fullscreenElement) {
    fsIcon.innerHTML = FULLSCREEN_EXIT_SVG;
    fullscreenBtn.setAttribute('aria-label', 'Exit fullscreen');
    if (document.fullscreenElement === specialSong && specialSong) {
      specialSong.setAttribute('controls', 'true');
    }
  } else {
    fsIcon.innerHTML = FULLSCREEN_ENTER_SVG;
    fullscreenBtn.setAttribute('aria-label', 'Fullscreen');
    if (specialSong) specialSong.removeAttribute('controls');
  }
});


/* ============================================================
   9. SURPRISE FLOW LOGIC & WISHES CARD
============================================================ */
const surpriseReveal = document.getElementById('surprise-reveal');
const surpriseBtn = document.getElementById('surprise-btn');
const finalWishes = document.getElementById('final-wishes');
const wishesPages = document.querySelectorAll('.wishes-page');
const wishesDotsWrap = document.getElementById('wishes-dots');
const wishesPrevBtn = document.getElementById('wishes-prev-btn');
const wishesNextBtn = document.getElementById('wishes-next-btn');
const wishesCloseBtn = document.getElementById('wishes-close-btn');

let surpriseTriggered = false;
let wishesTriggered = false;
const totalWishesPages = wishesPages.length;
let currentWishPage = 0;

function triggerSurprise() {
  if (surpriseTriggered) return;
  surpriseTriggered = true;

  if (specialSong) {
    specialSong.pause();
  }
  specialPlaying = false;
  
  if (audioPill) {
    audioPill.classList.remove('expanded');
    audioPill.style.display = 'none';
  }

  if (surpriseReveal) surpriseReveal.classList.add('visible');
}

if (specialSong) {
  specialSong.addEventListener('ended', triggerSurprise);
}

if (playerCloseBtn) {
  playerCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audioPill) audioPill.classList.remove('expanded');
    if (specialPlaying || (specialSong && specialSong.currentTime > 0)) {
      triggerSurprise();
    }
  });
}

if (surpriseBtn) {
  surpriseBtn.addEventListener('click', () => {
    if (surpriseReveal) surpriseReveal.classList.remove('visible');
    triggerFinalWishes();
  });
}

function triggerFinalWishes() {
  if (wishesTriggered) return;
  wishesTriggered = true;
  if (finalWishes) finalWishes.classList.add('visible');
}

// Build Page Dots Automatically
if (wishesDotsWrap) {
  wishesDotsWrap.innerHTML = '';
  wishesPages.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'page-dot wishes-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Wish page ${i + 1}`);
    dot.addEventListener('click', () => goToWishPage(i));
    wishesDotsWrap.appendChild(dot);
  });
}

function updateWishesDots() {
  document.querySelectorAll('.wishes-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentWishPage);
  });
}

function updateWishesNavBtns() {
  if (wishesPrevBtn) wishesPrevBtn.disabled = currentWishPage === 0;
  if (wishesNextBtn) wishesNextBtn.disabled = currentWishPage === totalWishesPages - 1;
}

function goToWishPage(idx) {
  if (idx < 0 || idx >= totalWishesPages) return;

  if (wishesPages[currentWishPage]) {
    wishesPages[currentWishPage].classList.remove('active');
  }

  currentWishPage = idx;

  if (wishesPages[currentWishPage]) {
    void wishesPages[currentWishPage].offsetWidth;
    wishesPages[currentWishPage].classList.add('active');
  }

  updateWishesDots();
  updateWishesNavBtns();
}

if (wishesPrevBtn) {
  wishesPrevBtn.addEventListener('click', () => {
    if (currentWishPage > 0) goToWishPage(currentWishPage - 1);
  });
}

if (wishesNextBtn) {
  wishesNextBtn.addEventListener('click', () => {
    if (currentWishPage < totalWishesPages - 1) goToWishPage(currentWishPage + 1);
  });
}

if (wishesCloseBtn) {
  wishesCloseBtn.addEventListener('click', () => {
    if (finalWishes) finalWishes.classList.remove('visible');
  });
}

if (finalWishes) {
  new MutationObserver(() => {
    if (finalWishes.classList.contains('visible') && currentWishPage !== 0) {
      goToWishPage(0);
    }
  }).observe(finalWishes, { attributes: true, attributeFilter: ['class'] });
}

window.addEventListener('keydown', (e) => {
  if (!finalWishes || !finalWishes.classList.contains('visible')) return;
  
  if (e.key === 'ArrowRight') {
    if (currentWishPage < totalWishesPages - 1) goToWishPage(currentWishPage + 1);
  } else if (e.key === 'ArrowLeft') {
    if (currentWishPage > 0) goToWishPage(currentWishPage - 1);
  } else if (e.key === 'Escape') {
    if (wishesCloseBtn) wishesCloseBtn.click();
  }
});

updateWishesNavBtns();