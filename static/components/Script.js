/* ============================================
   Ramesh Chandra Sahoo — Portfolio interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Remove loader from DOM after animation ---------- */
  const loader = document.getElementById('loader');
  setTimeout(() => { if (loader) loader.remove(); }, 2200);

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ---------- Cursor spark (desktop only) ---------- */
  const spark = document.getElementById('cursorSpark');
  const isTouch = matchMedia('(pointer: coarse)').matches;
  if (!isTouch) {
    window.addEventListener('mousemove', e => {
      spark.style.left = e.clientX + 'px';
      spark.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .work-card, .field input, .field textarea')
      .forEach(el => {
        el.addEventListener('mouseenter', () => spark.classList.add('active'));
        el.addEventListener('mouseleave', () => spark.classList.remove('active'));
      });
  } else {
    spark.style.display = 'none';
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-line');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Stagger the hero lines / cta manually on load ---------- */
  document.querySelectorAll('.hero .reveal-line').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 1500 + i * 160);
  });

  /* ---------- Animated stat counters ---------- */
  const statEls = document.querySelectorAll('.stat-num');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = Math.max(1, Math.round(target / 40));
      const tick = () => {
        current = Math.min(target, current + step);
        el.textContent = current;
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => countIO.observe(el));

  /* ---------- Skill bars fill on view ---------- */
  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) {
    const skillIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          skillIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skillIO.observe(skillsGrid);
  }

  /* ---------- Contact form (front-end only demo) ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      btn.style.transform = 'scale(.96)';
      setTimeout(() => { btn.style.transform = ''; }, 180);
      note.textContent = 'Thanks! Your message has been noted — connect a backend or form service to actually receive it.';
      form.reset();
    });
  }

  /* ---------- Canvas lightning background ---------- */
  const canvas = document.getElementById('bolt-canvas');
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* Drifting glow particles */
  const PARTICLE_COUNT = 46;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => spawnParticle());

  function spawnParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.25 + 0.05),
      vx: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.15,
      hue: Math.random() > 0.5 ? '96,165,250' : '34,211,238'
    };
  }

  /* Occasional lightning bolt strike */
  let bolts = [];
  function makeBolt() {
    const startX = Math.random() * w;
    let x = startX, y = 0;
    const points = [[x, y]];
    while (y < h * (0.35 + Math.random() * 0.3)) {
      x += (Math.random() - 0.5) * 60;
      y += Math.random() * 40 + 20;
      points.push([x, y]);
    }
    bolts.push({ points, life: 1 });
  }
  setInterval(() => {
    if (Math.random() < 0.55) makeBolt();
  }, 3200);

  function drawBolt(points, alpha) {
    ctx.save();
    ctx.strokeStyle = `rgba(147,197,253,${alpha})`;
    ctx.lineWidth = 1.4;
    ctx.shadowColor = 'rgba(96,165,250,0.9)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    points.forEach(([px, py], i) => {
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);

    /* particles */
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { Object.assign(p, spawnParticle(), { y: h + 10 }); }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue},${p.alpha})`;
      ctx.fill();
    });

    /* bolts */
    bolts = bolts.filter(b => b.life > 0);
    bolts.forEach(b => {
      drawBolt(b.points, b.life * 0.8);
      b.life -= 0.045;
    });

    requestAnimationFrame(frame);
  }
  frame();

  /* ---------- Button ripple effect for every .btn ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 1.4;
      ripple.style.cssText = `
        position:absolute; left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        width:${size}px; height:${size}px; border-radius:50%;
        background:rgba(255,255,255,0.35); pointer-events:none;
        transform:scale(0); opacity:1; z-index:3;
        animation:rippleFx .6s ease-out forwards;`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `@keyframes rippleFx{to{transform:scale(1); opacity:0;}}`;
  document.head.appendChild(rippleStyle);
});