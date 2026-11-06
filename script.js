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
  select.dispatchEvent(new Event('change'));
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

// ---------- Custom dropdown for the service picker (desktop only) ----------
// Browsers don't allow styling the open list of a native <select>, so on devices with a mouse
// we show a site-styled list instead. The native <select> stays in the form (hidden) and holds
// the value; phones and tablets keep their native picker, which is easier to use by touch.
function enhanceSelect(select) {
  const wrap = document.createElement('div');
  wrap.className = 'cselect';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'cselect-button';
  button.setAttribute('aria-haspopup', 'listbox');
  button.setAttribute('aria-expanded', 'false');
  const list = document.createElement('ul');
  list.className = 'cselect-list';
  list.setAttribute('role', 'listbox');
  const id = 'cselect-' + Math.random().toString(36).slice(2, 8);
  list.id = id;
  button.setAttribute('aria-controls', id);
  const opts = [...select.options].map((o, i) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.id = `${id}-${i}`;
    li.className = 'cselect-option' + (o.value === '' ? ' is-placeholder' : '');
    li.textContent = o.textContent;
    li.addEventListener('mousedown', e => e.preventDefault());
    li.addEventListener('click', () => { choose(i); close(); button.focus(); });
    li.addEventListener('mousemove', () => setActive(i));
    list.appendChild(li);
    return li;
  });
  let active = -1;
  function setActive(i) {
    active = i;
    opts.forEach((li, k) => li.classList.toggle('is-active', k === i));
    if (i >= 0) { button.setAttribute('aria-activedescendant', opts[i].id); opts[i].scrollIntoView({ block: 'nearest' }); }
  }
  function sync() {
    const i = select.selectedIndex;
    button.textContent = select.options[i] ? select.options[i].textContent : '';
    button.classList.toggle('is-placeholder', !select.value);
    opts.forEach((li, k) => li.setAttribute('aria-selected', String(k === i)));
  }
  function choose(i) { select.selectedIndex = i; select.dispatchEvent(new Event('change', { bubbles: true })); }
  function open() {
    // Open upwards when there isn't room below (e.g. near the bottom of the popup)
    // Inside the popup: let the list hang outside the popup's edge when the popup isn't scrolling
    const dlg = wrap.closest('dialog');
    list.style.display = 'none';   // measure the popup without the (hidden) list itself
    const clipped = dlg && dlg.scrollHeight > dlg.clientHeight + 1;
    list.style.display = '';
    if (dlg && !clipped) dlg.classList.add('cselect-overflow');
    const box = (clipped ? dlg : document.documentElement).getBoundingClientRect();
    const r = button.getBoundingClientRect();
    const bottomEdge = Math.min(box.bottom, window.innerHeight), topEdge = Math.max(box.top, 0);
    const need = Math.min(list.scrollHeight, 320) + 16;
    const up = bottomEdge - r.bottom < need && r.top - topEdge > bottomEdge - r.bottom;
    wrap.classList.toggle('up', up);
    // never taller than the space available, so no option is cut off
    list.style.maxHeight = Math.max(160, Math.min(320, (up ? r.top - topEdge : bottomEdge - r.bottom) - 16)) + 'px';
    wrap.classList.add('open'); button.setAttribute('aria-expanded', 'true');
    setActive(Math.max(0, select.selectedIndex));
  }
  function close() {
    wrap.classList.remove('open'); button.setAttribute('aria-expanded', 'false');
    const dlg = wrap.closest('dialog'); if (dlg) dlg.classList.remove('cselect-overflow');
  }
  button.addEventListener('click', () => (wrap.classList.contains('open') ? close() : open()));
  // Focus stays on the button; arrow keys move the highlight (aria-activedescendant pattern)
  button.addEventListener('keydown', e => {
    const isOpen = wrap.classList.contains('open');
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); open(); }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(opts.length - 1, active + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(0, active - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(opts.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(active); close(); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === 'Tab') { close(); }
  });
  button.addEventListener('blur', () => close());
  // In the popup, Esc closes an open list first, not the whole popup
  const dlg0 = select.closest('dialog');
  if (dlg0) dlg0.addEventListener('cancel', e => { if (wrap.classList.contains('open')) { e.preventDefault(); close(); } });
  document.addEventListener('click', e => { if (!wrap.contains(e.target)) close(); });
  select.addEventListener('change', sync);
  select.form && select.form.addEventListener('reset', () => setTimeout(sync, 0));
  wrap.append(button, list);
  select.classList.add('cselect-native');
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');
  select.before(wrap);   // first in the label, so clicking the label text opens it
  sync();
}
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.form select[name="service"]').forEach(enhanceSelect);
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Respect reduced-motion: keep background videos paused on their poster frame
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('video[autoplay]').forEach(v => { v.removeAttribute('autoplay'); v.pause(); });
}
