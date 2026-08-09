// =========================================================
// Divyansh Chaurasia — Portfolio
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initThemeToggle();
  initSmoothScroll();
  initConsoleTyping();
  initContactForm();
  initScrollReveal();
});

/* ---------- Light / dark theme toggle ---------- */
function initThemeToggle() {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeToggleIcon');
  const text = document.getElementById('themeToggleText');
  if (!btn || !icon || !text) return;

  // The button label shows the mode you'll switch TO on click.
  function syncLabel() {
    const isDark = root.getAttribute('data-theme') === 'dark';
    icon.textContent = isDark ? '☀️' : '🌙';
    text.textContent = isDark ? 'Light' : 'Dark';
    btn.setAttribute('aria-pressed', String(isDark));
  }
  syncLabel();

  btn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', 'dark');
    }
    try { localStorage.setItem('theme', isDark ? 'light' : 'dark'); } catch (e) {}
    syncLabel();
  });
}

/* ---------- Mobile nav toggle ---------- */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Smooth scroll for in-page anchors ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}

/* ---------- Hero terminal "typing" effect ---------- */
function initConsoleTyping() {
  const output = document.getElementById('consoleOutput');
  if (!output) return;

  const response = {
    name: "Divyansh Chaurasia",
    role: "Backend Engineer / SDE",
    location: "Lucknow, India",
    status: "open_to_work",
    stack: ["Python", "FastAPI", "SQL", "Docker"]
  };
  const text = JSON.stringify(response, null, 2);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    output.textContent = text;
    return;
  }

  let i = 0;
  const speed = 14; // ms per character
  function typeNext() {
    if (i <= text.length) {
      output.textContent = text.slice(0, i);
      i++;
      setTimeout(typeNext, speed);
    }
  }
  typeNext();
}

/* ---------- Contact form validation (static — no backend) ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');

  const fields = {
    name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
    message: { input: document.getElementById('message'), error: document.getElementById('messageError') },
  };

  function setError(field, msg) {
    field.input.closest('.form-row').classList.toggle('has-error', Boolean(msg));
    field.error.textContent = msg || '';
  }

  function validate() {
    let valid = true;

    if (!fields.name.input.value.trim()) {
      setError(fields.name, 'Please enter your name.');
      valid = false;
    } else {
      setError(fields.name, '');
    }

    const emailVal = fields.email.input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailPattern.test(emailVal)) {
      setError(fields.email, 'Please enter a valid email address.');
      valid = false;
    } else {
      setError(fields.email, '');
    }

    if (!fields.message.input.value.trim()) {
      setError(fields.message, 'Please enter a message.');
      valid = false;
    } else {
      setError(fields.message, '');
    }

    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';

    if (!validate()) {
      status.style.color = '#C0392B';
      status.textContent = 'Please fix the highlighted fields.';
      return;
    }

    // Static site placeholder: no backend is wired up.
    // Replace this block with a fetch() call to your form endpoint
    // (e.g. Formspree, EmailJS, or your own API) when ready.
    status.style.color = '';
    status.textContent = 'Thanks! This form is a placeholder — connect it to an endpoint to receive messages.';
    form.reset();
  });
}

/* ---------- Simple scroll-reveal for cards/sections ---------- */
function initScrollReveal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll(
    '.project-card, .skill-card, .stat, .cert-item, .timeline-content, .achievement-card'
  );
  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Content is always visible (opacity stays at 1) so nothing depends on
  // JS or the observer firing in time — this only adds a subtle lift-in.
  targets.forEach((el) => {
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'transform 0.5s ease';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}
