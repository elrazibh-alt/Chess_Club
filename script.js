/* ══════════════════════════════════════════════════════════
   ChessClub_Pawn — script.js
   Modules: Loader · Nav · Particles · Canvas · Reveal
   ══════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────────────
   LOADER — cinematic pawn e4 entry animation
────────────────────────────────────────────────────────── */
(function initLoader() {
  const loader    = document.getElementById('loader');
  const board     = document.getElementById('loaderBoard');
  const pawn      = document.getElementById('loaderPawn');
  const notation  = document.getElementById('loaderNotation');

  if (!loader || !board) return;

  // Build 8×8 chessboard cells
  const fragment = document.createDocumentFragment();
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = document.createElement('div');
      cell.className = 'loader-cell ' + ((row + col) % 2 === 0 ? 'dark' : 'light');
      fragment.appendChild(cell);
    }
  }
  board.appendChild(fragment);

  // Timeline:
  //  0.9s → trigger pawn move (e2→e4)
  //  1.5s → show move notation
  //  2.8s → fade out loader and reveal site
  const MOVE_DELAY     = 900;
  const NOTATION_DELAY = 1500;
  const HIDE_DELAY     = 2800;

  setTimeout(() => {
    if (pawn) pawn.classList.add('moved');
  }, MOVE_DELAY);

  setTimeout(() => {
    if (notation) notation.classList.add('show');
  }, NOTATION_DELAY);

  setTimeout(() => {
    loader.classList.add('hide');
    // Unblock body scroll if somehow locked
    document.body.classList.remove('nav-open');
  }, HIDE_DELAY);
})();


/* ──────────────────────────────────────────────────────────
   ABOUT BOARD — build 6×6 decorative board
────────────────────────────────────────────────────────── */
(function buildAboutBoard() {
  const aboutBoard = document.getElementById('aboutBoard');
  if (!aboutBoard) return;

  const fragment = document.createDocumentFragment();
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const cell = document.createElement('div');
      cell.className = 'about-board-cell ' + ((row + col) % 2 === 0 ? 'dark' : 'light');
      fragment.appendChild(cell);
    }
  }
  // Prepend before the pawn center element
  const pawnCenter = aboutBoard.querySelector('.about-pawn-center');
  aboutBoard.insertBefore(fragment, pawnCenter);
})();


/* ──────────────────────────────────────────────────────────
   NAVIGATION — scroll shrink + mobile drawer
────────────────────────────────────────────────────────── */
(function initNav() {
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar) return;

  // Shrink navbar on scroll
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Auto-close mobile drawer when scrolled past threshold
    if (window.scrollY > 160 && navLinks && navLinks.classList.contains('active')) {
      closeMenu();
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu helpers
  function openMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('active');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('active');
    document.body.classList.remove('nav-open');
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks && navLinks.classList.contains('active');
      isOpen ? closeMenu() : openMenu();
    });
  }

  // Close menu when clicking any link
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Close on outside click (overlay)
  document.addEventListener('click', (e) => {
    if (
      navLinks &&
      navLinks.classList.contains('active') &&
      !navbar.contains(e.target)
    ) {
      closeMenu();
    }
  });
})();


/* ──────────────────────────────────────────────────────────
   FLOATING PARTICLES — chess pieces drifting up
────────────────────────────────────────────────────────── */
(function initParticles() {
  const pieces = ['♟', '♞', '♝', '♜', '♛', '♔'];
  const COUNT  = 18;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.className    = 'particle';
    el.textContent  = pieces[Math.floor(Math.random() * pieces.length)];
    el.style.left             = Math.random() * 100 + 'vw';
    el.style.bottom           = '-80px';
    el.style.fontSize         = (Math.random() * 1.1 + 0.75) + 'rem';
    el.style.animationDuration = (Math.random() * 20 + 14) + 's';
    el.style.animationDelay   = (Math.random() * -28) + 's';
    fragment.appendChild(el);
  }

  document.body.appendChild(fragment);
})();


/* ──────────────────────────────────────────────────────────
   BACKGROUND CANVAS — subtle drifting light rays
────────────────────────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // 5 soft light rays with randomised properties
  const rays = Array.from({ length: 5 }, () => ({
    x:     Math.random(),
    angle: Math.PI / 4 + (Math.random() * 0.5 - 0.25),
    speed: 0.00025 + Math.random() * 0.00015,
    phase: Math.random() * Math.PI * 2,
    width: 100 + Math.random() * 180,
    alpha: 0.018 + Math.random() * 0.015,
  }));

  let rafId;

  function draw(t) {
    ctx.clearRect(0, 0, w, h);

    rays.forEach(r => {
      const x   = (r.x + Math.sin(t * r.speed + r.phase) * 0.13) * w;
      const len = h * 2.2;
      const grd = ctx.createLinearGradient(
        x, 0,
        x + Math.cos(r.angle) * len,
        Math.sin(r.angle) * len
      );
      grd.addColorStop(0, `rgba(91,141,238,${r.alpha})`);
      grd.addColorStop(1, 'rgba(91,141,238,0)');

      ctx.save();
      ctx.translate(x, 0);
      ctx.rotate(r.angle - Math.PI / 2);
      ctx.fillStyle = grd;
      ctx.fillRect(-r.width / 2, 0, r.width, len);
      ctx.restore();
    });

    rafId = requestAnimationFrame(draw);
  }

  rafId = requestAnimationFrame(draw);

  // Pause canvas when tab is hidden (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(draw);
    }
  });
})();


/* ──────────────────────────────────────────────────────────
   SCROLL REVEAL — IntersectionObserver fade-in
────────────────────────────────────────────────────────── */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.13 }
  );

  reveals.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────────────────
   PIECE PARALLAX — subtle mouse-move depth effect
────────────────────────────────────────────────────────── */
(function initParallax() {
  const silhouettes = document.querySelectorAll('.piece-silhouette');
  if (!silhouettes.length) return;

  let rafId = null;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 14;
    targetY = (e.clientY / window.innerHeight - 0.5) * 14;

    if (!rafId) {
      rafId = requestAnimationFrame(updateParallax);
    }
  });

  function updateParallax() {
    // Smooth lerp towards target
    currentX += (targetX - currentX) * 0.07;
    currentY += (targetY - currentY) * 0.07;

    silhouettes.forEach((el, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      el.style.transform =
        `translate(${currentX * dir * 0.35}px, ${currentY * dir * 0.35}px)`;
    });

    // Continue if not converged
    if (
      Math.abs(targetX - currentX) > 0.01 ||
      Math.abs(targetY - currentY) > 0.01
    ) {
      rafId = requestAnimationFrame(updateParallax);
    } else {
      rafId = null;
    }
  }
})();
