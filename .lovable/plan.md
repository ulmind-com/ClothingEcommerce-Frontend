## ShopGallery refinements

Two focused tweaks to `src/components/home/ShopGallery.tsx` + generated art for the pill portraits.

### 1. Pill portraits — always show an image
Every one of the 4 pill tiles ("Women Gallery", "Children Fashion", "Men's Fashion", "Women's Fashion") must show a circular portrait, even when the backend category has no `image`.

- Generate 4 new portrait assets (square 1024x1024, subject centered so the circular crop looks clean, matching the luxury editorial tone of the rest of the site):
  - `src/assets/pill-women-gallery.jpg`
  - `src/assets/pill-children-fashion.jpg`
  - `src/assets/pill-mens-fashion.jpg`
  - `src/assets/pill-womens-fashion.jpg`
- Import them in `ShopGallery.tsx` and use as a per-tile fallback: `tile.image ?? FALLBACK[i]`. Backend category images still win when present, so no admin/API impact.

### 2. Product grid — only 4 cards under the icon row
The grid currently shows up to 8 cards. Cap it at 4 so the icon filter row is followed by exactly one row of 4 (desktop) / 2x2 (mobile).

- Change both slice calls in `filtered` from `.slice(0, 8)` to `.slice(0, 4)`.
- Keep the middle-card highlight + hover Add to Cart behaviour (highlight index stays at `filtered[1]`, which still sits inside 4).
- Grid classes stay `grid-cols-2 lg:grid-cols-4` so 4 cards fill one row on desktop.

### Files touched
- `src/components/home/ShopGallery.tsx` — fallback images + slice(0, 4).
- `src/assets/pill-*.jpg` — 4 new generated portraits.

### Not touched
No backend, no admin, no schema, no other sections.
