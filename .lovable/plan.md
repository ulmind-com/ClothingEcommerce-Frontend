## Add "Curated This Season" section after Hero

A new editorial category showcase inserted directly after the Hero on the Home page, matching the reference (4 tall portrait tiles with category name overlay, centered title + subtitle above). Fully backend-driven from the existing `/categories` endpoint — no backend or admin panel changes.

### Data source (read-only, existing endpoint)
- Uses `categoriesOptions()` → `GET /categories` (already loaded in the home route loader).
- Picks the first 4 root categories (`!parent_id`) that have an `image`, ordered by their existing `order` field.
- Uses each category's `image`, `name`, and `image_scale` exactly as the admin panel configures them.
- Clicking a tile navigates to `/shop?category=<id>` (same pattern as existing `CategoriesBento`).
- Graceful fallback: if fewer than 4 categories have images, renders whatever exists (min 1); returns null if none — so admin edits control the section fully.

### Layout & composition (match reference)
- Full-bleed 4-column row on desktop, 2-column on mobile, edge-to-edge with a small 2px gap between tiles (like the reference).
- Each tile: tall portrait aspect (~3/4), image `object-cover`, category name in uppercase serif tracked wide, centered at the bottom over a soft dark gradient.
- Header block above the grid: centered "CURATED THIS SEASON" eyebrow-serif, small italic subtitle below ("A blend of classic silhouettes and our signature shine, embodied by enigmatic sequins.").
- Placed immediately after `<Hero />` and before `<CategoriesBento />` in `src/routes/index.tsx`.

### Motion & "3D" feel (Framer Motion + CSS, no new deps)
- **Section entrance**: title + subtitle mask-reveal using existing `MaskReveal` / `Reveal` primitives.
- **Tile stagger-in**: each tile fades + rises with a 90ms stagger as it enters viewport (Framer Motion `whileInView`).
- **3D tilt on hover**: subtle perspective tilt (rotateX/rotateY up to ~6°) driven by mouse position via `useMotionValue` + `useTransform`, with `transform-style: preserve-3d` and `perspective: 1200px` on the tile wrapper. Resets smoothly on mouse leave.
- **Parallax image**: inside each tilted card, the image translates opposite the tilt (~z-depth illusion) and scales 1.06 on hover over a 1.4s cubic-bezier ease.
- **Caption lift**: category name translates up ~6px and a hairline gold underline (champagne token) draws in from center on hover.
- **Ambient shimmer**: a very slow (8s) diagonal light sweep across each tile on hover using a gradient mask — evokes silk/sequins without being flashy.
- **Reduced motion**: all tilt/parallax/shimmer disabled when `prefers-reduced-motion: reduce`, falling back to a simple opacity fade.

### Files touched
- `src/routes/index.tsx` — add a new `CuratedThisSeason` component, mount it right after `<Hero />` inside `Home()`. No other files change.
- No changes to API layer, types, admin panel, or backend.

### Out of scope
- No new endpoints, no new fields, no admin panel changes.
- No heavy 3D library (Three.js/R3F) — kept as CSS 3D + Framer Motion to preserve the tight bundle from Phase 1.
