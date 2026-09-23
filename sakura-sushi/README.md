# Sakura Sushi — Restaurant Website

A complete, static multi-page website for a fictional sushi restaurant ("Sakura Sushi",
Skopje, North Macedonia), built for the *Business Practice 2025/2026* course assignment.

No build step, no framework, no server-side code — five plain HTML pages, custom CSS,
and vanilla JavaScript. Tailwind CSS is loaded from its CDN for utility spacing/layout
classes; all bespoke visual design (colors, type, components, animation) lives in
`css/style.css`.

## Features

- **Home** (`index.html`) — hero with animated cherry-blossom petals, brand story,
  four value-proposition cards, an auto-updating "chef's picks" teaser pulled live
  from the menu data, animated count-up statistics, testimonials, and a call to action.
- **Menu** (`menu.html`) — 21 dishes across 4 categories, live category / vegetarian /
  spicy filtering, free-text search, allergen tags, per-item quantity stepper, and
  "Add to cart".
- **Our Master Chefs** (`team.html`) — six chef profiles with portrait illustrations,
  roles, years of experience and bios.
- **Journal** (`blog.html`) — a blog/news grid (6 posts) with a featured post, a
  read-more modal showing the full article, and a newsletter sign-up form.
- **Contact** (`contact.html`) — address / phone / email / hours, an embedded
  OpenStreetMap map, a validated contact form, and an FAQ accordion.
- **Cart & checkout**, available from every page — a slide-in cart drawer, a
  checkout form (name, phone, email, address, city, payment method) with client-side
  validation, and an order-confirmation modal that generates a unique Order ID
  (e.g. `SKR-260922-7EFD`) and itemized receipt (with a print button).
- **EN / MK language switcher** — every string on every page (including page titles,
  menu items, chef bios, blog posts and form validation messages) is fully translated
  and swaps instantly without a page reload; the choice is remembered between pages.
- **Cookie consent banner** with an "Accept all" option and a "Preferences" modal
  (Necessary / Analytics / Marketing toggles).
- Semantic HTML5 landmarks, a skip-to-content link, visible keyboard focus states,
  ARIA labels/roles on interactive controls, and `prefers-reduced-motion` support
  (petals and count-up animations are disabled for users who request it).
- No external image hosting: every illustration, icon, and portrait is an
  original, hand-authored inline SVG file in `images/`.

## Running it locally

Because the pages load Tailwind from a CDN `<script>` tag and reference other files
by relative path, **open them through a local web server rather than double-clicking
the HTML files** (a bare `file://` URL will block the CDN script in some browsers and
break relative asset loading).

From this folder, pick one:

```bash
# Option A — Python (built into most systems)
python3 -m http.server 8000

# Option B — Node
npx serve .
```

Then open `http://localhost:8000/index.html` (or whatever port/URL it prints).

## Deploying

The site is fully static. To deploy (e.g. to the FCSE hosting), just upload the
entire contents of this folder — `index.html`, `menu.html`, `team.html`, `blog.html`,
`contact.html`, `css/`, `js/`, and `images/` — keeping the folder structure intact.
`index.html` is the entry point. There is nothing to compile or build.

## Project structure

```
├── index.html / menu.html / team.html / blog.html / contact.html
├── css/
│   └── style.css          — design tokens, layout, and every component style
├── js/
│   ├── translations.js    — EN/MK dictionary + i18n engine
│   ├── data.js             — menu, team and blog content (bilingual)
│   ├── main.js              — nav, modals/drawer engine, petals, cookie consent, toasts
│   ├── cart.js               — cart state, checkout validation, order placement
│   ├── menu.js / team.js / blog.js / contact.js / home.js — per-page rendering
└── images/                 — hand-authored SVG illustrations, icons and portraits
```

## Notes

- Prices are shown in `$` for simplicity; all menu, team and blog content is
  original writing for this assignment (not copied from any real restaurant).
- The map on the Contact page is a no-API-key OpenStreetMap embed centered on
  Skopje; it needs an internet connection to load its tiles.
