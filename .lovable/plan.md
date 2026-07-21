## Replace the current "Signature Pieces" spotlight with a Runway Lookbook (Marc Jacobs-style)

The reference video is a Marc Jacobs "SPRING SUMMER 2019" runway look viewer. As it advances, a row of models slides horizontally to the left: earlier looks blur into the background, the current LOOK stands sharp in the foreground, and the next look enters from the right. The right rail shows the individual products that make up the current look and swaps with it. A big "LOOK 15 → 16 → 19" counter sits bottom-left with a "SHOP THE LOOK" link. Autoplays, on a light cream/mint background.

We'll build this 1:1, still driven entirely by the existing backend (no schema/admin changes).

### Placement
`src/routes/index.tsx` — remove `<SignaturePieces />` and render `<RunwayLookbook />` in the same slot (after `<VideoReel />`, before `<NewArrivalsRail />`).

### Files
- **New**: `src/components/home/RunwayLookbook.tsx` — the whole section.
- **Delete**: `src/components/home/SignaturePieces.tsx` and `src/components/home/signature-motifs.tsx` (they replace this exact slot; not used anywhere else).
- **Edit**: `src/routes/index.tsx` — swap the import + render.
- No changes to `src/lib/api/*`, `src/types/api.ts`, `src/styles.css` (all timing/motion is component-local via Framer Motion).

### Data (existing backend only)
- Looks come from `productsOptions({ limit: 12 })` — reuse the home loader's cached data, no new query.
- Each product with ≥1 image = one "LOOK". Take the first 6.
- Right-rail "Shop the Look" cards for the active look = the next 2–3 products from the same list (wrap around). Purely presentational — no new API, no cart writes.

### Section anatomy (light theme, `bg-[hsl(var(--secondary))]/50` with faint silk-grain, full-bleed, `min-h-[780px] md:min-h-[880px]`)

Three-column editorial layout on desktop, single column on mobile.

- **Top strip (spans the section)**: small `eyebrow` "The Runway" + tiny `RUNWAY / THE MAISON / LOOKBOOK` faux-nav row on the right (visual only, unlinked) — matches the header strip in the reference.

- **Left column** (`col-span-3`):
  - Eyebrow season code: "AUTUMN / WINTER 26" in tracked caps.
  - 2-line description pulled from settings/collection copy (fallback: "Picture-perfect and hand-finished. Each look opens the season's atelier in miniature.").
  - Pinned to bottom of column: big display-serif `LOOK 01` counter (animated flip on change) + underlined `SHOP THE LOOK` link → `/product/$id` of the active look.

- **Center stage** (`col-span-6`): the runway.
  - A horizontal row containing all 6 looks side by side.
  - The active look sits centered, full-height (~640px), sharp, with a subtle drop-shadow.
  - Looks to the left of active are blurred (`blur-md`), desaturated (`saturate-50`), and 60% opacity — they "recede".
  - Looks to the right of active are similarly blurred but slightly lifted, hinting they're coming.
  - On slide change, the whole strip animates its `x` transform leftwards using `motion` spring so the next look becomes the centered/sharp one. Blur/opacity animate per-card based on distance from active index.
  - Small round prev/next chevron buttons overlaid at mid-height (like the small circle in the reference frames).

- **Right column** (`col-span-3`) — "Shop the Look" rail:
  - 2 stacked white cards per active look, each with product thumb (aspect 3/4), title (uppercase small), price, and a `+` circular add link (routes to `/product/$id` — no cart writes).
  - Cards animate out (fade + slide up) and new ones stagger in on look change.
  - A third card can peek from the bottom edge, matching the reference.

- **Foreground details**:
  - Tiny `01 / 06` pagination indicator in the top-right of the stage.
  - Thin champagne progress rule under the counter that fills over the 6s autoplay interval.

### Motion / interaction
- Autoplay every 6s; pauses on hover or focus anywhere in the section; respects `prefers-reduced-motion` (no autoplay, no blur transitions — just crossfade).
- `AnimatePresence` for right-rail cards (`mode="popLayout"`, stagger 60ms).
- Framer `motion` spring (`stiffness: 120, damping: 22`) on the runway strip's `x`.
- Counter uses a `AnimatePresence` number flip (Y translate + fade).
- Keyboard: ←/→ navigate when the section is focused. Buttons have proper `aria-label`s. Decorative motifs `aria-hidden`.
- Lenis-friendly: no scroll hijacking, no `IntersectionObserver` pinning.

### Styling
- Uses only existing tokens (`ink`, `cream`, `champagne`, `warm-gray`, `border`, `secondary`). No hardcoded colors.
- Typography matches other home sections (`font-display` for LOOK counter, `eyebrow` utility for labels, warm-gray body).
- Editorial vertical rhythm matches `CategoriesBento` / `EditorialSplit` above and below.

### Backend-preservation guarantees
- Zero changes to `src/lib/api/*`, `src/types/api.ts`, or any query.
- No new endpoint calls. Consumes the already-cached `productsOptions({ limit: 12 })` from the home loader.
- No admin panel changes. No writes. Every CTA is a `<Link>` to existing routes (`/product/$id`, `/shop`).

### Out of scope
- No changes to Hero, CategoriesBento, VideoReel, NewArrivalsRail, or anything else on the home page.
- No new fonts, no new global CSS, no new tokens.
- No cart mutations from within the section — CTAs navigate to PDP.
