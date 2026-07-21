## Editorial Spotlight (below Maison Runway) — 1:1 with the reference video

Mount a new backend-driven section right under `RunwayLookbook` in `src/routes/index.tsx`. Same interaction beats and same on-screen elements as the video: a compact "hero product" state that expands into a full product detail state when the ADD button is pressed, then collapses back — with auto-play through products.

### The two states (exactly like the video)

State A — Collapsed hero card
- Left column: bold display title of the product ("TIED GREEN V-NECK SHIRT" in the ref), socials row pinned bottom-left.
- Center: model cutout on a large pastel circular halo; small hand-drawn motifs (squiggles, sparkles, arcs, dotted lines) floating around with parallax + idle drift.
- Floating cross-sell mini-cards over the model (image + name + price), same as the bag/sandals in the ref.
- Right column: vertical rotated season label ("SUMMER 2026") next to a slim sister-look image strip; `SIZE GUIDE ˄` pinned bottom-right.
- Big circular ADD/`+` button dead-center over the model.

State B — Expanded product detail (after clicking ADD)
- Cross-sell cards + right sister strip fade out.
- Left column morphs to: title, price, short description, `SELECT SIZE` row (S / M / L chips), `SIZE GUIDE` link, then a horizontal row of 4 alt-image thumbnails with a `›` next arrow.
- Right column morphs to a vertical `01 / 05` counter with the thin progress rule.
- Model image swaps to the next look (in the ref the model turns around) — we cycle `productImage(p, i)` alt shots.
- A `close/back` affordance (the same center button becomes `−`) collapses back to State A.

Auto behavior
- Autoplay: cycles through products every ~7s; pauses on hover/focus/expand.
- Expanded state auto-collapses after ~5s if the user doesn't interact, then advances.
- Prev/next arrows on the sides for manual control; keyboard ←/→ supported.
- Reduced-motion: no halo pulse, no motif drift, instant state swaps.

### Motion (Framer Motion + a light GSAP timeline)

- State transition: shared-layout morph. Left column uses `AnimatePresence mode="wait"` between `TitleOnly` and `TitleWithMeta` variants; cross-sell cards use `layout` + `y/opacity` exit; right sister strip slides out to the right, counter fades in from the right.
- Halo: continuous slow rotation + scale breathing; on state-change it briefly pulses (scale 1 → 1.04 → 1) and shifts hue to the active product's dominant color.
- Motifs (`signature-motifs.tsx` reused): each SVG has its own float loop (`y`, `rotate`, `opacity`), staggered.
- Model: `AnimatePresence` crossfade between alt images; subtle mouse-parallax translate on the wrapper (disabled on touch).
- ADD button: hover magnetic pull + inner label crossfade (`ADD` ⇄ `−`); click ripples a champagne ring outward.
- Counter: numbers flip with `y` slide; progress bar animates from 0→100% over the autoplay interval.

### Data (uses existing backend only)

- Reuses `productsOptions({ limit: 8 })` from `src/lib/api/queries.ts` — no schema, no new endpoints, no admin change.
- `productImage(p, i)` gives the model + alt shots; `p.colors[0]` supplies the halo tint; cross-sell picks the next 2 products in the list; sister strip picks `products[index+3]`.
- Sizes come from `p.colors[0].sizes` when present, otherwise fall back to `["S","M","L"]` (display only, no cart writes here).

### Files

- Add `src/components/home/EditorialSpotlight.tsx` — the whole section.
- Reuse `src/components/home/signature-motifs.tsx` (already in project) for the floating SVGs.
- Edit `src/routes/index.tsx` — import and mount `<EditorialSpotlight />` directly under `<RunwayLookbook />`.
- No CSS token changes required; uses existing `cream / ink / champagne / rose / mint` tokens for the halo palette.

### Not touched

- No backend, no admin, no schema, no other sections, no cart mutations.
