## Add "Signature Pieces" interactive product spotlight (after VideoReel)

A cinematic, animated product showcase inspired by the reference video: one hero product at a time, framed by a soft colored halo, with a vertical season label, floating decorative motifs, add-to-cart CTA, size chips, gallery thumbnails, cross-sell mini cards, and an animated 01/N slide counter. Auto-advances and can be navigated manually. All content is pulled from the existing backend — no new admin work, no schema changes.

### Placement
`src/routes/index.tsx` → insert `<SignaturePieces />` directly after `<VideoReel />`, before `<NewArrivalsRail />`.

### Data (existing backend only)
- Featured slides: `productsOptions({ limit: 8 })` — take the first 5 products with at least one image. Reuse cached data from the home loader; no new query, no new endpoint.
- Cross-sell mini cards inside each slide: the next 2 products from the same list (wraps around). Purely presentational — no new API.
- No admin-panel changes. No new tables. `videosOptions()` and every other query stay untouched.

### Section anatomy (per slide)
- Left column: eyebrow ("The Signature Edit"), display-serif product title with mask-reveal, price, 2-line description (from `product.description`), size chips (from `product.sizes` or defaults S/M/L), a round champagne "Add" magnetic button linking to `/product/$id`.
- Center: product image on a large soft colored halo (radial gradient using the product's dominant color when available via `product.colors[0]`, else champagne). Ken Burns-style slow zoom while active.
- Right column: vertical rotated season label ("AUTUMN / WINTER 26"), animated 01 / 0N slide counter with a thin progress rule, prev/next chevrons.
- Foreground motifs: 4–6 SVG squiggles / sparkles / dots that drift with `motion` (parallax on mouse-move + gentle infinite float). Purely decorative, `aria-hidden`.
- Floating cross-sell cards (2): small white cards with product thumb + title + price, absolutely positioned, entering with stagger.
- Bottom-left: gallery thumbnails (up to 4) from `product.images` — click to swap the hero image within the slide.

### Motion / interaction
- Framer Motion `AnimatePresence mode="wait"` between slides: image slides+fades from right, copy mask-reveals, counter number flips, halo color crossfades, cross-sell cards stagger in.
- Autoplay every 6s; pauses on hover or focus; respects `prefers-reduced-motion` (no autoplay, no float, no parallax).
- Mouse parallax on halo + motifs using `useMotionValue` + `useSpring` — subtle (~12px max).
- Keyboard: ←/→ to navigate when section is focused.
- Lenis-friendly (no scroll hijacking).

### Styling
- Full-bleed section, `bg-secondary/40` with faint silk-grain, tall `min-h-[720px] md:min-h-[820px]`.
- Uses existing tokens only (`ink`, `cream`, `champagne`, `warm-gray`, `border`, `secondary`). No hardcoded colors.
- Editorial spacing matches existing home sections; heading block above the stage uses the same `eyebrow` + `font-display` treatment as `CategoriesBento`.

### Files
- New: `src/components/home/SignaturePieces.tsx` — the whole section (slide state, motion, motifs).
- New: `src/components/home/signature-motifs.tsx` — small inline SVG decorative shapes (squiggles, sparkles, arcs) as React components.
- Edit: `src/routes/index.tsx` — import and render `<SignaturePieces />` after `<VideoReel />`.
- No changes to `src/lib/api/*`, `src/types/api.ts`, `src/styles.css` (all animation is component-local via Framer Motion).

### Out of scope
- No backend/admin/schema changes.
- No changes to Hero, CategoriesBento, VideoReel, or any other existing section.
- No new fonts, no new global CSS tokens.
