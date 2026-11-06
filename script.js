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

// ---------- Enquiry popup ----------
const PHONE = '+358509183710';
const PHONE_DISPLAY = '+358 50 918 3710';
const SERVICES = [
  ['wardrobe-organisation', 'Wardrobe Organisation'],
  ['kitchen-pantry-organisation', 'Kitchen &amp; Pantry Organisation'],
  ['home-organisation', 'Home Organisation'],
  ['move-in-home-setup', 'Move-In &amp; Home Setup'],
  ['villa-organisation', 'Complete Villa Organisation'],
];
const dialog = document.createElement('dialog');
dialog.className = 'enquire-modal';
dialog.setAttribute('aria-labelledby', 'enquire-title');
dialog.innerHTML = `
  <button class="modal-close" type="button" aria-label="Close">
    <span></span><span></span>
  </button>
  <div class="modal-grid">
    <aside class="modal-call">
      <p class="eyebrow">Prefer to talk?</p>
      <p class="modal-call-text">Call us directly and we'll arrange a consultation.</p>
      <a class="btn btn-call" href="tel:${PHONE}">Call ${PHONE_DISPLAY}</a>
    </aside>
    <div class="modal-form">
      <p class="eyebrow">Enquiries</p>
      <h2 id="enquire-title">Begin your <em>project.</em></h2>
      <form class="form" action="#" method="post">
        <label><span>Name</span><input type="text" name="name" required autocomplete="name"></label>
        <label><span>Email</span><input type="email" name="email" required autocomplete="email"></label>
        <label><span>Location</span><input type="text" name="location"></label>
        <label><span>Service of interest</span>
          <select name="service">
            <option value="">Select</option>
            ${SERVICES.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}
            <option>Not sure yet</option>
          </select>
        </label>
        <label class="full"><span>Message</span><textarea name="message" rows="3"></textarea></label>
        <button type="submit" class="btn">Send enquiry</button>
        <p class="form-note" role="status" aria-live="polite"></p>
      </form>
    </div>
  </div>`;
document.body.appendChild(dialog);

function openEnquiry(service) {
  const select = dialog.querySelector('select[name="service"]');
  select.value = service && select.querySelector(`option[value="${CSS.escape(service)}"]`) ? service : '';
  dialog.querySelector('.form-note').textContent = '';
  dialog.showModal();
  document.documentElement.classList.add('modal-open');
}
dialog.addEventListener('close', () => document.documentElement.classList.remove('modal-open'));
dialog.querySelector('.modal-close').addEventListener('click', () => dialog.close());
// Click on the dimmed backdrop closes the popup
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

document.querySelectorAll('[data-enquire]').forEach(el => el.addEventListener('click', e => {
  e.preventDefault();
  openEnquiry(el.dataset.enquire);
}));

// Placeholder form handling (no backend yet) — applies to the page form and the popup form
document.querySelectorAll('.form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.querySelector('.form-note').textContent = 'Thank you — we will be in touch shortly.';
    form.reset();
  });
});

// Pre-select the service on the home page form (?service=slug#contact)
const wanted = new URLSearchParams(location.search).get('service');
const homeSelect = document.querySelector('#contact select[name="service"]');
if (wanted && homeSelect && homeSelect.querySelector(`option[value="${CSS.escape(wanted)}"]`)) homeSelect.value = wanted;

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Respect reduced-motion: keep background videos paused on their poster frame
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('video[autoplay]').forEach(v => { v.removeAttribute('autoplay'); v.pause(); });
}
