// Presenter Cockpit – small enhancements; the page works without JavaScript too.

// Download and project links, in one place. A channel set to false in READY is not out yet: its buttons
// show a "soon" badge and lead nowhere, and its icon is left out of the header and the footer.
const READY = { source: true, apk: true, issues: true, play: false, fdroid: false };
const LINKS = {
  source: 'https://github.com/presenter-cockpit/presenter-cockpit',
  apk: 'https://github.com/presenter-cockpit/presenter-cockpit/releases/latest',
  issues: 'https://github.com/presenter-cockpit/presenter-cockpit/issues',
  fdroid: 'https://f-droid.org/packages/it.presenter.app.fdroid/',
  play: 'https://play.google.com/store/apps/details?id=it.presenter.app.store',
};

document.querySelectorAll('[data-link]').forEach((a) => {
  const key = a.dataset.link;
  if (READY[key]) {
    a.href = LINKS[key];
  } else if (a.closest('.stores')) {
    a.hidden = true;
  } else {
    a.classList.add('soon');
    a.removeAttribute('href');
    a.setAttribute('aria-disabled', 'true');
  }
});

// Navigation: background once the page scrolls; menu on small screens.
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', (e) => { if (e.target.closest('a')) links.classList.remove('open'); });
}

// Elements fade in when they enter the screen, a little after each other within a group.
const reveal = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 70}ms`;
    el.classList.add('visible');
    reveal.unobserve(el);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

// Screenshots not added yet: a placeholder instead of a broken image.
document.querySelectorAll('.shot img').forEach((img) => {
  const missing = () => img.closest('.shot').classList.add('missing');
  if (img.complete && img.naturalWidth === 0) missing();
  img.addEventListener('error', missing);
});

// Screenshots open full size on a tap (or Enter); a tap, Esc or the back gesture closes them.
const viewer = document.createElement('div');
viewer.className = 'viewer';
viewer.setAttribute('role', 'dialog');
viewer.setAttribute('aria-modal', 'true');
viewer.innerHTML = '<img alt=""><p></p><button class="viewer-close" aria-label="Close">×</button>';
document.body.append(viewer);
let opener = null;
const closeViewer = () => {
  if (!viewer.classList.contains('open')) return;
  viewer.classList.remove('open');
  document.body.classList.remove('no-scroll');
  if (opener) opener.focus();
};
const openViewer = (img) => {
  opener = img;
  viewer.querySelector('img').src = img.currentSrc || img.src;
  viewer.querySelector('img').alt = img.alt;
  viewer.querySelector('p').textContent = img.alt;
  viewer.classList.add('open');
  document.body.classList.add('no-scroll');
  viewer.querySelector('.viewer-close').focus();
};
viewer.addEventListener('click', closeViewer);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeViewer(); });
document.querySelectorAll('.shot img').forEach((img) => {
  img.tabIndex = 0;
  img.setAttribute('role', 'button');
  img.setAttribute('aria-label', `${img.alt} (open full size)`);
  img.addEventListener('click', () => { if (!img.closest('.shot').classList.contains('missing')) openViewer(img); });
  img.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openViewer(img); }
  });
});

// The colored blobs of the hero follow the pointer a little.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const blobs = [...document.querySelectorAll('.blob')];
  window.addEventListener('pointermove', (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    blobs.forEach((b, i) => {
      const k = (i + 1) * 18;
      b.style.transform = `translate(${x * k}px, ${y * k}px)`;
    });
  }, { passive: true });
}
