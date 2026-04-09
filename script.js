/* ═══════════════════════════════════════════════════════════════════════════
   SMR PORTFOLIO — Premium Animation System
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Terminal Loader ────────────────────────────────────────────────────── */
(function terminalLoader() {
  const line = document.getElementById('ll1');
  const ready = document.getElementById('ll4');
  const COMMAND = 'loading portfolio assets...';

  function typeInto(spanEl, text, cb) {
    let i = 0;
    const span = spanEl.querySelector('span:last-child');
    spanEl.classList.add('visible');
    function tick() {
      span.textContent += text[i++];
      if (i < text.length) setTimeout(tick, 28 + Math.random() * 22);
      else if (cb) setTimeout(cb, 220);
    }
    tick();
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      typeInto(line, COMMAND, () => {
        if (ready) ready.classList.add('visible');
        setTimeout(() => {
          const loader = document.getElementById('loader');
          if (loader) loader.classList.add('loader--hidden');
        }, 600);
      });
    }, 200);
  });
})();

/* ─── Sticky navbar ──────────────────────────────────────────────────────── */

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─── Mobile menu ────────────────────────────────────────────────────────── */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

/* ─── Smooth scroll ──────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10);
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

/* ─── Active nav link ────────────────────────────────────────────────────── */
const navLinks = document.querySelectorAll('.nav__links a');
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting)
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
  });
}, { rootMargin: '-40% 0% -55% 0%' }).observe(...document.querySelectorAll('section[id], footer[id]'));


/* ═══════════════════════════════════════════════════════════════════════════
   1. STAGGERED REVEAL — elements slide + fade in sequence
   ═══════════════════════════════════════════════════════════════════════════ */
const REVEAL_MAP = [
  { selector: '.section-title', type: 'slide-up', delay: 0 },
  { selector: '.label', type: 'slide-up', delay: 0 },
  { selector: '.hero__name', type: 'slide-up', delay: 0 },
  { selector: '.hero__role', type: 'slide-up', delay: 100 },
  { selector: '.hero__scroll', type: 'fade', delay: 400 },
  { selector: '.about__col--right p', type: 'slide-up', delay: 0, stagger: 80 },
  { selector: '.skill-chip', type: 'pop', delay: 0, stagger: 40 },
  { selector: '.project-card--featured', type: 'slide-up', delay: 0 },
  { selector: '.project-block', type: 'slide-up', delay: 0, stagger: 60 },
  { selector: '.tech-list span', type: 'pop', delay: 0, stagger: 30 },
  { selector: '.project-card--soon', type: 'slide-up', delay: 0, stagger: 120 },
  { selector: '.value-block', type: 'slide-up', delay: 0, stagger: 100 },
  { selector: '.footer__headline', type: 'slide-up', delay: 0 },
  { selector: '.footer__links', type: 'fade', delay: 200 },
  { selector: '.badge', type: 'pop', delay: 0, stagger: 60 },
  { selector: '.about__col--left', type: 'slide-right', delay: 0 },
];

function buildRevealStyle(type, delay) {
  const base = `opacity:0; transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1); transition-delay:${delay}ms;`;
  if (type === 'slide-up') return base + 'transform:translateY(40px);';
  if (type === 'slide-right') return base + 'transform:translateX(-40px);';
  if (type === 'pop') return base + 'transform:scale(0.85) translateY(10px);';
  return base; // fade
}

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.style.opacity = '1';
    el.style.transform = 'none';
    revealObs.unobserve(el);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

REVEAL_MAP.forEach(({ selector, type, delay, stagger }) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    const d = delay + (stagger ? i * stagger : 0);
    el.setAttribute('style', buildRevealStyle(type, d));
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      // Already in view: reveal quickly
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'none'; }, d);
    } else {
      revealObs.observe(el);
    }
  });
});


/* ═══════════════════════════════════════════════════════════════════════════
   2. PARALLAX HERO — role only (name handled by 3D effect below)
   ═══════════════════════════════════════════════════════════════════════════ */
const heroRole = document.querySelector('.hero__role');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight && heroRole) {
    heroRole.style.transform = `translateY(${y * 0.10}px)`;
  }
}, { passive: true });


/* ═══════════════════════════════════════════════════════════════════════════
   3. TYPED CURSOR — hero role text types in after load
   ═══════════════════════════════════════════════════════════════════════════ */
const typedEl = document.querySelector('.hero__role');
if (typedEl) {
  const fullText = typedEl.textContent.trim();
  typedEl.textContent = '';
  typedEl.style.borderRight = '2px solid var(--accent)';
  typedEl.style.display = 'inline-block';
  typedEl.style.whiteSpace = 'nowrap';
  typedEl.style.overflow = 'hidden';

  let i = 0;
  function typeChar() {
    if (i < fullText.length) {
      typedEl.textContent += fullText[i++];
      setTimeout(typeChar, 55 + Math.random() * 40);
    } else {
      // Remove cursor blink after done
      setTimeout(() => { typedEl.style.borderRight = '2px solid transparent'; }, 1200);
    }
  }
  setTimeout(typeChar, 1400); // starts after loader
}



/* ═══════════════════════════════════════════════════════════════════════════
   5. SECTION LABEL SCRAMBLE — Matrix-style on enter
   Letters scramble then resolve to final text
   ═══════════════════════════════════════════════════════════════════════════ */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·';

function scrambleText(el, finalText, duration = 700) {
  let start = null;
  const totalFrames = Math.floor(duration / 16);

  function tick(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const revealedCount = Math.floor(progress * finalText.length);

    el.textContent = finalText
      .split('')
      .map((ch, i) => {
        if (i < revealedCount) return ch;
        if (ch === ' ') return ' ';
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');

    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = finalText;
  }

  requestAnimationFrame(tick);
}

new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    scrambleText(el, el.dataset.text || el.textContent.trim());
    entry.target.dataset.scrambled = 'true';
  });
}, { threshold: 0.5 }).observe(...(() => {
  const labels = document.querySelectorAll('.label');
  labels.forEach(l => { l.dataset.text = l.textContent.trim(); });
  return labels;
})());


/* ═══════════════════════════════════════════════════════════════════════════
   6. SECTION DIVIDERS — line draws from left on scroll
   ═══════════════════════════════════════════════════════════════════════════ */
document.querySelectorAll('.divider').forEach(hr => {
  hr.style.transformOrigin = 'left center';
  hr.style.transform = 'scaleX(0)';
  hr.style.transition = 'transform 1.1s cubic-bezier(0.16,1,0.3,1)';

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      hr.style.transform = 'scaleX(1)';
    }
  }, { threshold: 0.5 }).observe(hr);
});


/* ═══════════════════════════════════════════════════════════════════════════
   7. CURSOR GLOW — neon accent follows mouse (desktop only)
   ═══════════════════════════════════════════════════════════════════════════ */
if (window.matchMedia('(pointer:fine)').matches) {
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  Object.assign(glow.style, {
    position: 'fixed',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
    transform: 'translate(-50%,-50%)',
    zIndex: '9998',
    transition: 'opacity 0.3s ease',
    opacity: '0',
    top: '0',
    left: '0',
  });
  document.body.appendChild(glow);

  let glowX = 0, glowY = 0, curX = 0, curY = 0;

  document.addEventListener('mousemove', e => {
    curX = e.clientX;
    curY = e.clientY;
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

  (function animateGlow() {
    glowX += (curX - glowX) * 0.1;
    glowY += (curY - glowY) * 0.1;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  })();
}


/* ═══════════════════════════════════════════════════════════════════════════
   8. FEATURED CARD — removed scan-line effect to prevent glitchy appearance
   ═══════════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════════
   9. HERO SCROLL INDICATOR — fade out on scroll
   ═══════════════════════════════════════════════════════════════════════════ */
const scrollIndicator = document.querySelector('.hero__scroll');
if (scrollIndicator) {
  window.addEventListener('scroll', () => {
    const opacity = Math.max(0, 1 - window.scrollY / 200);
    scrollIndicator.style.opacity = opacity;
  }, { passive: true });
}


/* ═══════════════════════════════════════════════════════════════════════════
   10. SOON CARDS — glitch number on hover
   ═══════════════════════════════════════════════════════════════════════════ */
document.querySelectorAll('.project-card--soon').forEach(card => {
  const numEl = card.querySelector('.project-card__soon-num');
  if (!numEl) return;
  const original = numEl.textContent;
  let glitching = null;

  card.addEventListener('mouseenter', () => {
    let ticks = 0;
    glitching = setInterval(() => {
      numEl.textContent = ticks < 8
        ? Math.floor(Math.random() * 89 + 10).toString()
        : original;
      if (++ticks > 14) { clearInterval(glitching); numEl.textContent = original; }
    }, 60);
  });
  card.addEventListener('mouseleave', () => {
    clearInterval(glitching);
    numEl.textContent = original;
  });
});


/* ═══════════════════════════════════════════════════════════════════════════
   11. 3D NAME — letter-split scroll rotation + mouse tilt
   ═══════════════════════════════════════════════════════════════════════════ */
(function init3DName() {
  const nameEl = document.querySelector('.hero__name');
  if (!nameEl) return;

  // ── Split innerHTML ('Iker<br>Augusto') into per-char spans ─────────────
  const rawHTML = nameEl.innerHTML;
  const lines = rawHTML.split(/<br\s*\/?>/i);
  let globalIdx = 0;

  nameEl.innerHTML = lines.map(line =>
    `<span class="name-line">${line.split('').map(ch =>
      ch === ' '
        ? '<span class="name-char">&nbsp;</span>'
        : `<span class="name-char" data-idx="${globalIdx++}">${ch}</span>`
    ).join('')
    }</span>`
  ).join('');

  const chars = nameEl.querySelectorAll('.name-char[data-idx]');
  const hero = document.getElementById('inicio');
  const STAGGER = 0.038;   // scroll-progress units between each letter start
  const EXIT = 0.62;    // hero scroll fraction at which anim finishes

  // ── Scroll-driven 3D rotation ────────────────────────────────────────────
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    if (y > vh) return; // only in hero
    const progress = Math.min(y / (vh * EXIT), 1); // 0 → 1

    chars.forEach(char => {
      const idx = parseInt(char.dataset.idx);
      const charStart = idx * STAGGER;
      const raw = (progress - charStart) / 0.38;          // 0.38 = width per char
      const p = Math.max(0, Math.min(raw, 1));

      const rotX = p * -115;
      const transZ = p * -300;
      const transY = p * -20;
      const opacity = 1 - p * 0.9;

      char.style.transform = `rotateX(${rotX}deg) translateZ(${transZ}px) translateY(${transY}px)`;
      char.style.opacity = opacity;
    });
  }, { passive: true });

  // ── Mouse tilt (desktop only) ────────────────────────────────────────────
  if (hero && window.matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const dx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const dy = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      nameEl.style.transition = 'transform 0.08s ease';
      nameEl.style.transform = `rotateY(${dx * 10}deg) rotateX(${-dy * 5}deg)`;
    });

    hero.addEventListener('mouseleave', () => {
      nameEl.style.transition = 'transform 0.8s cubic-bezier(0.16,1,0.3,1)';
      nameEl.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }
})();


/* ═══════════════════════════════════════════════════════════════════════════
   12. READ PROGRESS BAR
   ═══════════════════════════════════════════════════════════════════════════ */
(function readProgress() {
  const bar = document.getElementById('read-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });
})();


/* ═══════════════════════════════════════════════════════════════════════════
   13. PARALLAX DATA RAIN CANVAS — Cinematic hex drops (Optimized for 60FPS)
   ═══════════════════════════════════════════════════════════════════════════ */
(function parallaxRain() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let w, h;
  const chars = '0123456789ABCDEF@#%';
  let drops = [];
  
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    
    drops = [];
    const layers = [
       // Removed expensive blur filter, relying on opacity and size for 3D depth
       { count: Math.floor(w/7),  size: 9,  speed: 1.2, alpha: 0.15 },
       { count: Math.floor(w/15), size: 16, speed: 2.2, alpha: 0.35 },
       { count: Math.floor(w/35), size: 28, speed: 4.5, alpha: 0.8  }
    ];
    
    layers.forEach(l => {
       for(let i=0; i<l.count; i++) {
          drops.push({
             x: Math.random() * w,
             y: Math.random() * h,
             size: l.size,
             speed: l.speed * (0.8 + Math.random() * 0.4),
             alpha: l.alpha,
             char: chars.charAt(Math.floor(Math.random() * chars.length))
          });
       }
    });
  }
  
  window.addEventListener('resize', resize);
  resize();

  let mouse = { x: -999, y: -999 };
  const hero = document.getElementById('inicio');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
  }

  function loop() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.35)'; // darker trail
    ctx.fillRect(0, 0, w, h);
    
    drops.forEach(d => {
       if (Math.random() > 0.95) d.char = chars.charAt(Math.floor(Math.random() * chars.length));
       
       const dx = d.x - mouse.x;
       const dy = d.y - mouse.y;
       const dist = Math.sqrt(dx*dx + dy*dy);
       if (dist < 120) {
           d.x += dx * 0.03 * (1 / (d.size * 0.3)); 
       }

       d.y += d.speed;
       if (d.y > h + 50) {
          d.y = -50;
          d.x = Math.random() * w;
       }
       if (d.x < -50) d.x = w + 50;
       if (d.x > w + 50) d.x = -50;
       
       ctx.font = `bold ${d.size}px var(--ff)`;
       ctx.fillStyle = `rgba(0, 255, 136, ${d.alpha})`;
       ctx.fillText(d.char, d.x, d.y);
    });
    
    requestAnimationFrame(loop);
  }
  loop();
})();



/* ═══════════════════════════════════════════════════════════════════════════
   14. ANIMATED COUNTERS
   ═══════════════════════════════════════════════════════════════════════════ */
(function animateCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateOne(el, target) {
    const dur = 1400;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(easeOut(p) * target);
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      animateOne(el, parseInt(el.dataset.target));
      entry.target.dataset.animated = 'true';
    });
  }, { threshold: 0.5 }).observe(...counters);

  // Failsafe: use a forEach loop, observe works on each
  counters.forEach(el => {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !el.dataset.animated) {
        el.dataset.animated = 'true';
        animateOne(el, parseInt(el.dataset.target));
      }
    }, { threshold: 0.5 }).observe(el);
  });
})();


/* ═══════════════════════════════════════════════════════════════════════════
   15. 3D TILT ON "SOON" CARDS
   ═══════════════════════════════════════════════════════════════════════════ */
document.querySelectorAll('.project-card--soon').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const dx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const dy = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    card.style.transition = 'transform 0.08s ease';
    card.style.transform = `rotateY(${dx * 8}deg) rotateX(${-dy * 6}deg) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    card.style.transform = 'rotateY(0) rotateX(0) scale(1)';
  });
});


/* ═══════════════════════════════════════════════════════════════════════════
   16. DYNAMIC ACCENT COLOR PER SECTION
   ═══════════════════════════════════════════════════════════════════════════ */
(function dynamicAccent() {
  const ACCENT_MAP = {
    'inicio': '#00ff88',
    'sobre-mi': '#00e5cc',
    'proyectos': '#00ff88',
    'valor': '#a8ff3e',
    'contacto': '#00ff88',
  };
  const root = document.documentElement;

  Object.entries(ACCENT_MAP).forEach(([id, color]) => {
    const el = document.getElementById(id);
    if (!el) return;
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        root.style.setProperty('--accent', color);
      }
    }, { rootMargin: '-40% 0% -50% 0%' }).observe(el);
  });
})();


/* ═══════════════════════════════════════════════════════════════════════════
   17. TECH CHIP TOOLTIPS
   ═══════════════════════════════════════════════════════════════════════════ */
(function techTooltips() {
  const TIPS = {
    'Windows Server 2022': 'OS servidor de Microsoft — AD, DNS, GPOs',
    'Active Directory': 'Directorio centralizado de identidades y permisos',
    'Microsoft Azure': 'Plataforma cloud — VMs, Networking, Storage',
    'VMware ESXi': 'Hipervisor de tipo 1 para virtualización enterprise',
    'DNS / DHCP': 'Resolución de nombres y asignación dinámica de IPs',
    'SSL / TLS': 'Cifrado de tráfico web mediante certificados',
    'Duplicity + Cron': 'Backups cifrados automáticos programados',
    'PHP / MySQL': 'Backend web y base de datos relacional',
    'Apache': 'Servidor web HTTP open source',
    'hMailServer': 'Servidor de correo interno SMTP/POP3/IMAP',
    'CCProxy': 'Servidor proxy para filtrado de contenido',
    'LOPD / GDPR': 'Marco legal europeo de protección de datos',
  };

  document.querySelectorAll('.tech-list span').forEach(chip => {
    const key = chip.textContent.trim();
    if (TIPS[key]) chip.dataset.tip = TIPS[key];
  });
})();


/* ═══════════════════════════════════════════════════════════════════════════
   18. INTERACTIVE TERMINAL (Contacto)
   ═══════════════════════════════════════════════════════════════════════════ */
(function interactiveTerminal() {
  const consoleBody = document.getElementById('console-body');
  if (!consoleBody) return;

  const SCRIPT = [
    { type: 'prompt', text: 'ssh recruiter@iker-augusto.local' },
    { type: 'output', text: 'Connecting to Iker Augusto... [OK]\nEstablishing secure handshake... [DONE]' },
    { type: 'prompt', text: 'cat /etc/status' },
    { type: 'output', text: 'STATUS: Available for hire.\nROLE: Junior IT Technician.\nMOTIVATION: 100%' },
    { type: 'prompt', text: './initiate_contact.sh' },
    { type: 'output', text: 'Awaiting your email at: ikeraugusto2412@gmail.com\nOr connect via LinkedIn below.' }
  ];

  let currentLine = 0;
  let isTyping = false;

  function typeConsoleLine(entry, cb) {
    const p = document.createElement('p');
    p.className = `console-line console-line--${entry.type}`;
    consoleBody.appendChild(p);

    if (entry.type === 'output') {
      p.innerText = entry.text;
      setTimeout(cb, 600);
      return;
    }

    let i = 0;
    const blinker = document.createElement('span');
    blinker.className = 'console-cursor';
    p.appendChild(blinker);

    function tick() {
      if (i < entry.text.length) {
        blinker.insertAdjacentText('beforebegin', entry.text[i++]);
        setTimeout(tick, 30 + Math.random() * 40);
      } else {
        blinker.remove();
        setTimeout(cb, 200);
      }
    }
    tick();
  }

  function runScript() {
    if (currentLine >= SCRIPT.length) return;
    isTyping = true;
    typeConsoleLine(SCRIPT[currentLine++], () => {
      runScript();
    });
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !isTyping) {
      runScript();
    }
  }, { threshold: 0.2 });

  observer.observe(consoleBody);
})();


/* ═══════════════════════════════════════════════════════════════════════════
   19. WARPING GRID PARALLAX
   ═══════════════════════════════════════════════════════════════════════════ */
(function warpingGrid() {
  const grid = document.getElementById('warping-grid');
  if (!grid) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    // The grid moves backwards as you scroll down
    grid.style.backgroundPositionY = `${y * 0.5}px`;
    grid.style.transform = `perspective(600px) rotateX(${75 + y * 0.005}deg)`;
  }, { passive: true });
})();


/* ═══════════════════════════════════════════════════════════════════════════
   20. MAGNETIC CURSOR
   ═══════════════════════════════════════════════════════════════════════════ */
(function magneticCursor() {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  });

  (function loop() {
    ringX += (mouseX - ringX) * 0.15; // easing
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(calc(${Math.round(ringX)}px - 50%), calc(${Math.round(ringY)}px - 50%))`;
    requestAnimationFrame(loop);
  })();

  // Snap effect on interactables
  const interactables = document.querySelectorAll('a, button, .btn');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-ring--hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-ring--hover'));
  });
})();


/* ═══════════════════════════════════════════════════════════════════════════
   21. TECH CHIP DECRYPTION HOVER
   ═══════════════════════════════════════════════════════════════════════════ */
document.querySelectorAll('.tech-list span').forEach(chip => {
  const original = chip.textContent.trim();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let interval = null;

  chip.addEventListener('mouseenter', () => {
    clearInterval(interval);
    let iterations = 0;
    interval = setInterval(() => {
      chip.textContent = original.split('').map((char, index) => {
        if (index < iterations) return original[index];
        if (char === ' ') return ' ';
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      if (iterations >= original.length) {
        clearInterval(interval);
        chip.textContent = original;
      }
      iterations += 1/3;
    }, 20);
  });
});
