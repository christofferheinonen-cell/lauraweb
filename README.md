# Laura — Luxury Home Organisation website

Static one-page site (`index.html`, `styles.css`, `script.js`). Open `index.html` in a browser.

To do before launch:
- Replace image placeholders (`.img` blocks) with real photography (set `background-image`).
- Confirm brand name, email, Instagram, location.
- Connect the enquiry form to a backend (e.g. Formspree/Netlify Forms); it currently only shows a thank-you message.

## Structure
- `index.html` — home page; the services section links to one page per service.
- `services/*.html` — one page per service (hero, what's included, investment, enquire, previous/next).
  The "Enquire about this service" link opens the home page form with that service pre-selected.

## Adding a service hero image
In `services/<service>.html`, replace
`<div class="hero-media img" data-label="Hero image — ..."></div>` with
`<div class="hero-media img photo" style="background-image:url(../images/YOUR-FILE.jpg)" role="img" aria-label="Short description"></div>`
- `services/index.html` — Services page: all services as cards (linked from the menu and each service page's "All services").

## Legal
- `privacy.html` (GDPR privacy policy) and `terms.html` (terms of use + company details), linked from every footer and from the enquiry forms.
- Fonts are self-hosted in `fonts/` (SIL OFL) so the site makes no third-party requests and sets no cookies — no cookie banner needed. If analytics or other third-party embeds are added later, the privacy policy and a consent banner must be updated.
- TODO before launch: add the registered address (highlighted placeholder on both pages).
