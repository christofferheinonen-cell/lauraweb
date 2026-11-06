// Nav background on scroll
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const links = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  links.classList.toggle('open', !open);
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  links.classList.remove('open');
}));

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Placeholder form handling (no backend yet)
const form = document.querySelector('.form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.querySelector('.form-note').textContent = 'Thank you — we will be in touch shortly.';
    form.reset();
  });
  // Pre-select the service when arriving from a service page (?service=slug#contact)
  const wanted = new URLSearchParams(location.search).get('service');
  const select = form.querySelector('select[name="service"]');
  if (wanted && select && select.querySelector(`option[value="${CSS.escape(wanted)}"]`)) select.value = wanted;
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Respect reduced-motion: keep background videos paused on their poster frame
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('video[autoplay]').forEach(v => { v.removeAttribute('autoplay'); v.pause(); });
}
