/* ============================================
   PRATHMESH JAIN — Portfolio JS
   Dark mode toggle + adaptive + interactions
   ============================================ */

// ── Dark Mode (runs immediately, before paint) ──
(function() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

// ── Page load ──
document.body.style.opacity = '0';
window.addEventListener('load', () => {
  document.body.style.transition = 'opacity 0.4s ease';
  document.body.style.opacity = '1';
});

// ── Theme toggle ──
const themeToggle = document.getElementById('themeToggle');

function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });
}

// Adapt to OS preference changes (when no manual override stored)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});

// ── Header scroll ──
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile menu ──
const burger        = document.getElementById('burger');
const drawer        = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
  burger.classList.add('active');
  drawer.classList.add('open');
  drawerOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  burger.classList.remove('active');
  drawer.classList.remove('open');
  drawerOverlay.classList.remove('show');
  document.body.style.overflow = '';
}
if (burger) burger.addEventListener('click', () =>
  drawer.classList.contains('open') ? closeDrawer() : openDrawer()
);
if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', closeDrawer));

// ── Scroll-reveal ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Counter animation ──
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCount(el, target, duration = 1600) {
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(easeOutCubic(t) * target);
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        animateCount(el, parseInt(el.dataset.count));
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.about-numbers').forEach(el => counterObserver.observe(el));

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAs.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => navObserver.observe(s));

// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ── Hero role rotator ──
const roles = [
  'Software Development Engineer',
  'Full Stack Developer',
  'Cloud & DevOps Enthusiast',
  'Competitive Programmer · 1748'
];
const roleEl = document.querySelector('.hcard-role');
if (roleEl) {
  roleEl.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
  let i = 0;
  setInterval(() => {
    roleEl.style.opacity = '0';
    roleEl.style.transform = 'translateY(6px)';
    setTimeout(() => {
      i = (i + 1) % roles.length;
      roleEl.textContent = roles[i];
      roleEl.style.opacity = '1';
      roleEl.style.transform = 'translateY(0)';
    }, 300);
  }, 3000);
}

// ── Subtle card tilt on hover ──
document.querySelectorAll('.hero-card, .proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-5px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
    card.style.transition = 'transform 0.08s linear, box-shadow 0.3s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.45s ease, box-shadow 0.3s ease';
    card.style.transform = '';
  });
});
