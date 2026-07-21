## What to change

Two focused frontend tweaks to the Home hero in `src/routes/index.tsx`. No backend, no other pages.

### 1. Hero → multi-image editorial slideshow

Currently the hero shows only the first active banner. Turn it into an auto-rotating, cinematic slideshow using **all active banners** from `/banners` (already fetched via `bannersOptions`).

- Use every `banner.active === true`, sorted by `order`.
- If backend returns <2 banners, fall back to composing slides from `categories` that have an `image` (couture / bridal / ethnic categories) so the hero always feels multi-image, matching the Manish Malhotra reference.
- Auto-advance every ~5.5s with a soft Ken Burns (scale 1 → 1.08) + crossfade using Framer Motion `AnimatePresence` (mode `wait` off, opacity 0→1, 1.2s ease `[0.22,1,0.36,1]`).
- Animate the eyebrow / headline / subtitle / CTAs per slide too (re-key on active index → MaskReveal re-plays) so each slide feels like its own campaign frame.
- Add subtle pagination dots bottom-right (mirroring the reference), plus keep the existing "Scroll" indicator.
- Add prev / next chevrons on hover at left/right edges (desktop only), thin `cream/40` strokes — luxury, not e-com.
- Pause auto-advance on hover; respect `prefers-reduced-motion` (no auto-advance, no Ken Burns).
- Keep the existing parallax `y` / `scale` scroll transform on the whole slide layer.

### 2. Fix "Discover the collection" button readability

The button currently uses `bg-cream text-ink` but the `LuxLink` `variant="solid"` base classes are overriding hover/typography such that the label is barely legible against the bright hero image (see screenshot). Fix by:

- Switching the primary CTA to a **solid ink pill** (`bg-ink text-cream hover:bg-champagne hover:text-ink`) — high contrast against any banner photo, matches editorial luxury pattern.
- Slightly increasing tracking + weight of the CTA label inside `LuxLink` (only if the shared component already exposes it; otherwise pass through `className` with `tracking-[0.2em] font-medium`).
- Secondary "Book an appointment" stays outlined cream, but darken border to `border-cream` (from `/70`) and add a soft `backdrop-blur-sm bg-ink/10` so it reads on bright frames too.
- Add a subtle bottom vignette (already exists via gradient) — bump the bottom stop from `ink/70` → `ink/85` under the CTA zone so buttons always sit on a legible base regardless of which slide is showing.

### Technical notes

- All changes live in `src/routes/index.tsx` (`Hero` function) plus, if needed, a tiny className tweak passed to `LuxLink`.
- No new deps. Framer Motion + existing MaskReveal cover crossfades and text re-reveals.
- No changes to data fetching — the `bannersOptions` query already returns the full list.

### Out of scope

Cart drawer, auth, checkout, other routes — untouched. Will pick those up next per the Phase 2 plan.