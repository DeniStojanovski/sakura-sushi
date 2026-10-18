# Sakura Sushi

A static multi-page website for a fictional sushi restaurant in Skopje, North Macedonia,
built as a university web development assignment (Business Practice 2025/2026). There is
no backend: all state lives in the browser. No build step is required.

## Pages and features

**Home** (`index.html`) — noren curtain intro animation, hero with ember particle canvas
and hanging lanterns, brand story with animated count-up statistics, featured menu teaser
pulled live from the menu data, testimonials, and a call-to-action.

**Menu** (`menu.html`) — dishes across six categories (nigiri, rolls, sets, drinks,
vegetarian, spicy). Supports live category filtering, free-text search, allergen tags,
per-item quantity steppers, per-item favourites (heart button), and Add to cart.

**Our Chefs** (`team.html`) — six chef profiles rendered from `js/data.js`, each as a
flip card: portrait, role and years of experience on the front; bio and specialties on
the back. Click or press Enter to flip.

**Journal** (`blog.html`) — posts rendered from `js/data.js`, with a featured post,
thumbnail list, category labels, read-more modal, and a newsletter sign-up form.

**Contact** (`contact.html`) — contact details, OpenStreetMap embed, contact form with
client-side validation, and a three-item FAQ accordion.

**Sign in / Register** (`login.html`) — two-tab form with client-side password hashing
via `crypto.subtle` (falls back to djb2 on plain HTTP), password-strength meter, and
field validation.

**My Account** (`account.html`) — profile tab (edit name, phone, password, delete
account), order history tab, favourites tab, and reservations tab.

**Reserve a seat** (`reservation.html`) — date/time slot picker that marks full slots,
party-size selector, guest notes, saves to localStorage, and generates a downloadable
`.ics` calendar file after confirmation.

**Cart and checkout** — receipt-style slide-in drawer, delivery/pickup toggle, tip
selector (0 / 10 / 15%), promo code field (codes: `SAKURA10` and `SUSHI10`, both 10%
off), order summary, and a confirmation modal with a generated Order ID.

**Cross-cutting:**

- EN/MK bilingual interface — all strings translated, language persisted in localStorage,
  swaps instantly without a page reload.
- Light/dark theme toggle — dark ("Izakaya After Dark") is the default; light ("Daylight
  Washi") is toggled with the moon/sun button in the header; choice is persisted.
- Cookie consent banner with preference controls (necessary, analytics, marketing).
- Sticky header that shrinks on scroll; hamburger mobile nav below 1150 px.

## No backend — important

There is no server, database or authentication service. Accounts, sessions, orders,
favourites and reservations are simulated entirely in `localStorage`/`sessionStorage`
and exist only in the browser they were created in. Clearing site data removes everything.

A demo account is seeded automatically on first visit:

```
Email:    demo@sakurasushi.mk
Password: Demo1234
```

## Design

**Concept:** "Izakaya After Dark" — a dark-first cinematic palette with a cream washi
light counterpart.

**Dark palette (default):**
- Background: `#0d0b0f` (void), `#1a1620` (charcoal), `#2a1508` (ember)
- Accent: `#ff4d8f` (sakura pink), `#e8a030` (amber), `#e03a2a` (torii red)
- Text: `#f0e8d8` (washi), `#c8bca8` (washi-dim)

**Light palette:**
- Background: `#f6efe3` (cream), Text: `#1c1614` (warm ink)
- Accent: `#c1547a` (dusty sakura), `#a05c08` (amber)

**Fonts** (Google Fonts): Yeseva One (display headings), Rubik (body), Noto Serif JP
(kanji watermarks).

**Signature effects** (all in `js/ui.js`, all disabled under `prefers-reduced-motion`):
- Noren curtain — split-panel wipe on every home page load
- Hanging lanterns — CSS sway animation in the hero
- Ember particles — canvas-based floating embers, theme-aware colours
- 3D tilt — perspective tilt on dish cards (mouse only, event-delegated)
- Chef flip cards — CSS 3D flip on click or Enter
- Marquee ribbon — infinitely scrolling text strip below the header
- Custom cursor — dot and lagging ring (pointer devices only)
- Magnetic buttons — subtle translate on primary buttons on hover
- Scroll reveal — `IntersectionObserver` fade-in on `[data-reveal]` elements

**Accessibility:** skip-to-content link, `aria-` attributes on interactive elements,
visible focus states in both themes, `prefers-reduced-motion` disables all animations
and transitions, WCAG AA colour contrast in both themes.

## Tech stack

- Static HTML (8 pages)
- Custom CSS (`css/style.css`, no preprocessor)
- Vanilla JavaScript (15 files in `js/`, no frameworks)
- Tailwind CSS v3 via CDN (utility spacing and layout only)
- Google Fonts via CDN
- OpenStreetMap iframe embed (no API key required)

## Running locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Do not open the files via `file://` — the
`crypto.subtle` password-hashing API requires a secure context (localhost qualifies;
`file://` does not), and some CDN resources may be blocked by CORS.

## Deployment

```
Dockerfile          nginx:alpine, copies the site to /usr/share/nginx/html
docker-compose.yml  single web service, 0.25 CPU, 128 MB memory limit
stack.yml           RepoRun ingress on port 80, CAS access
```

Deployed on **RepoRun**. To update: push to `main`, then press **Redeploy** in the
RepoRun dashboard.

## Project structure

```
.
├── index.html
├── menu.html
├── team.html
├── blog.html
├── contact.html
├── reservation.html
├── login.html
├── account.html
├── css/
│   └── style.css
├── js/
│   ├── translations.js   bilingual string table (EN + MK)
│   ├── data.js           menu items, blog posts, chef profiles
│   ├── main.js           nav, language switch, cookie consent, panel engine
│   ├── auth.js           client-side auth (localStorage, crypto.subtle)
│   ├── cart.js           cart state, checkout, order confirmation
│   ├── ui.js             visual effects (curtain, embers, tilt, flip, etc.)
│   ├── theme.js          light/dark toggle and persistence
│   ├── home.js           featured menu teaser, stat counters
│   ├── menu.js           filter, search, favourites, add-to-cart
│   ├── team.js           chef card renderer
│   ├── blog.js           post renderer and read-more modal
│   ├── contact.js        contact form validation
│   ├── reservation.js    slot picker, .ics download
│   ├── account.js        profile/order/favourites/reservations tabs
│   └── login.js          sign-in / register tabs
├── images/               SVG illustrations and icons
├── Dockerfile
├── docker-compose.yml
└── stack.yml
```

## Notes

- `tests/`, `screenshots/` and `.claude/` are listed in `.gitignore` and
  `.dockerignore` and are not included in the repository or the Docker image.
- All data entered (accounts, orders, reservations) is lost when localStorage is
  cleared or when a different browser or device is used.
- `crypto.subtle` requires HTTPS or localhost. On plain HTTP the site falls back to a
  client-side djb2 hash; this is noted as insecure in the code comments.
- Prices are shown in `$`. All content is original writing for this assignment.
