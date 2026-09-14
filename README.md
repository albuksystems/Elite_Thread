# ELITE THREAD — Website

A static, mobile-first website for ELITE THREAD (Casual & Official Wear),
Mlolongo, Kenya. Pure HTML/CSS/vanilla JS — no build step, no framework,
no backend. Deploys directly to GitHub Pages or any static host.

## File structure

```
elite-thread/
├── index.html              Homepage
├── shop.html                Full catalogue with search/filter/sort
├── about.html                Brand story
├── contact.html               Location, phone, WhatsApp, map placeholder
├── product.html                 Reusable product detail page (?id=et-001)
├── 404.html                       Branded not-found page
├── categories/
│   ├── casual-wear.html
│   ├── official-wear.html
│   ├── footwear.html
│   ├── mens-clothing.html
│   ├── mens-footwear.html
│   └── accessories.html
├── css/style.css            All styles (design tokens at the top)
├── js/
│   ├── products.js          ⭐ THE ONLY FILE YOU NEED TO EDIT PRODUCTS
│   └── app.js                Nav, search, filters, product rendering, WhatsApp links
└── images/
    ├── logo/                 Logo files (SVG placeholder included)
    ├── products/              Product photos
    ├── categories/             Category cover photos
    └── banners/                 Hero / brand imagery
```

## Adding a product (the only thing you'll do regularly)

1. Add your image(s) to `images/products/`, named e.g. `et-007-1.jpg`,
   `et-007-2.jpg` (first image is the cover photo).
2. Open `js/products.js` and copy one of the existing product objects
   inside the `PRODUCTS` array. Give it a new unique `id`.
3. Fill in `name`, `category` (must match a slug in `CATEGORIES` at the
   top of the same file), `type`, `price`, `color`, `images`, a short
   `description`, and a few `keywords` people might search for.
4. Set `featured: true` to show it on the homepage's Featured section,
   and/or `newArrival: true` for New Arrivals.
5. Save. It will automatically appear in Shop, its category page,
   search results, and related products — no other file needs editing.

To mark something sold out, set `available: false` — the site will show
"Currently Unavailable" and disable the WhatsApp order button for it.

## Adding a new category

Add an entry to the `CATEGORIES` array in `js/products.js`, then copy
one of the files in `/categories/` as a starting point for the new
page, updating its `data-category` attribute and text.

## Editing the logo

Drop your real logo files into `images/logo/`. The header currently
references `images/logo/et-mark-dark.svg` — a placeholder monogram is
included so the layout works before you supply the real asset. If the
file at that path is missing or fails to load, the layout gracefully
hides the image and shows the wordmark instead.

## WhatsApp number

The WhatsApp number lives in one place: the `WHATSAPP_NUMBER` constant
near the top of `js/app.js`. Update it there if it ever changes.

## Business details currently hard-coded in the HTML

- Address: ABC Biashara Street, Mlolongo, Kenya
- Phone / WhatsApp: +254 758 575 588
- Delivery: Nairobi and surrounding areas
- Opening hours: intentionally left as "to be confirmed" on the Contact
  page — update once you have fixed hours.
- Social links in the footer are placeholders (`href="#"`) — replace
  with real profile URLs once available.
- The Contact page map is a placeholder — swap it for a Google Maps
  embed (`<iframe>`) once you have the exact map link for the shop.

## Deploying

This is a static site — push the contents of this folder to a GitHub
repository and enable GitHub Pages (Settings → Pages → deploy from the
`main` branch, root folder). No build step is required.

## Browser support / accessibility notes

- Built mobile-first; tested down to 360px wide.
- Respects `prefers-reduced-motion`.
- All interactive elements are keyboard-reachable with visible focus
  states.
- Search and filtering require JavaScript; all other content and
  navigation degrade gracefully without it.
