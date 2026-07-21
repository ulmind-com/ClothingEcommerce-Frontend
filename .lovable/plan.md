## Replace VideoReel with a horizontal auto-scrolling video marquee

Current `VideoReel` (single big cinematic player) will be removed. New section: an editorial heading + a row of 6 compact 9:16 video cards that drift left-to-right continuously. Every card autoplays muted-looped video (all playing at once, no audio). Each card links to `/shop`. No text on the cards. Admin panel–driven backend contract (`GET /videos`) stays intact — fallback shows only when backend returns nothing.

### Uploaded videos → Lovable Assets
Upload all 6 user-provided mp4s via `lovable-assets` and store pointers in `src/assets/reel-*.mp4.asset.json`. These become the fallback set used until admin uploads real videos.

### New `VideoReel` component
- Heading block above the marquee:
  - Eyebrow: "The Reel"
  - Title: "Moments from the Maison" (font-display, editorial)
  - No card labels/captions anywhere.
- Marquee row:
  - Duplicate the list twice for a seamless infinite loop.
  - Framer Motion `animate={{ x: [0, -listWidth] }}` with linear easing, ~40s per loop, `repeat: Infinity`.
  - Pause on hover (whole strip) for premium feel.
  - `prefers-reduced-motion` → no auto-scroll (static row, user can horizontal-scroll).
- Card:
  - `Link to="/shop"`, aspect-[9/16], width ~`w-[200px] md:w-[240px]` (small, not big), rounded-none luxury edge, subtle 1px `border-border`, soft champagne glow on hover, gentle scale `1.02`.
  - `<video autoPlay muted loop playsInline preload="metadata" poster={...}>` — muted is required for autoplay.
  - Subtle inner vignette on hover only; no overlay text.
- Data source: keep `videosOptions()` (`GET /videos`). If backend returns items, use them; otherwise fall back to the 6 uploaded assets. Admin panel remains the source of truth.

### Files
- `src/components/home/VideoReel.tsx` — full rewrite (marquee + card).
- `src/assets/reel-1.mp4.asset.json` … `reel-6.mp4.asset.json` — new pointers.
- `src/routes/index.tsx` — no change (already renders `<VideoReel />`).
- `src/types/api.ts` / `src/lib/api/queries.ts` — untouched (contract preserved).

### Out of scope
- No backend/admin work.
- No text overlays on cards.
- No audio.
- No changes to other home sections.
