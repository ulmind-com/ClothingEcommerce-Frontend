## Atelier Stories — tilted photo marquee below Editorial Spotlight

A new editorial section styled after the BrandLyft reference, mounted directly under `EditorialSpotlight` in `src/routes/index.tsx`. Big serif headline, hand-drawn arrow motifs on either side, a small centered CTA pill, and a horizontal row of gently **tilted portrait photo cards** that auto-scroll left→right forever, smooth and premium.

### Layout (1:1 with reference vibe, tuned to Maison)

```text
                      ﹏ kicker: "The Atelier Journal"
       ~/          Threads of a Living Heritage          \~
                a short editorial line, 2 lines max
                          [ Explore the House ]

  ⤺  [img]  [img]  [img]  [img]  [img]  [img]  [img]  [img]  ⤻
        tilt -6°  +4°  -3°  +5°  -4°  +6°  -5°  +3°  (alternating)
```

- Backdrop: warm cream with subtle grain; soft radial vignette at edges so cards fade in/out of the marquee.
- Each card: portrait 3:4, rounded-2xl, hairline ink border, soft champagne shadow, small alternating tilt.
- Two hand-drawn SVG arrow/squiggle motifs flanking the headline (reuse existing `signature-motifs.tsx` primitives — no new asset system).
- Centered pill CTA below the copy: `Explore the House →` linking to `/shop`.

### Images (8 total)

- Use the 2 user uploads as-is via `lovable-assets create --file /mnt/user-uploads/... ` → JSON pointers in `src/assets/atelier-*.asset.json`:
  - `user-uploads://Jewellery.jpeg`
  - `user-uploads://Because_every_thread_tells_your_story_🧵💖_Unfold_your_fairytale_in_our_exclusive_bridal_designs.jpeg`
- Generate 6 more editorial portraits with `imagegen` (fast tier, 3:4 portrait, saved to `src/assets/atelier-3.jpg` … `atelier-8.jpg`), each a distinct Maison moment:
  1. Bride in ivory lehenga, temple light
  2. Groom in charcoal bandhgala, moody studio
  3. Detail: hands with gold bangles + embroidered dupatta
  4. Modern fusion — woman in sculpted saree gown, editorial pose
  5. Couple in coordinated pastel wedding wear, soft daylight
  6. Close-up of hand embroidery on silk, artisan hands in frame
- No text overlays on any card — pure imagery.

### Motion (ultra-premium)

- Infinite marquee via CSS keyframes (same pattern already proven in `src/styles.css` for `reel-marquee`, add new `atelier-marquee` at ~55s per full loop) — hardware-accelerated `translate3d`, seamless by rendering the card list twice back-to-back.
- Pause on hover of the strip; individual card hover: lifts (`y: -6px`), tilt straightens toward 0°, champagne glow intensifies, image scales 1.04 over 900ms ease-out.
- Headline + kicker + CTA: Framer Motion `Reveal` stagger on scroll-in (reuse existing `Reveal`).
- Motif arrows: slow idle float (existing motif animation pattern).
- Reduced-motion: marquee freezes, cards static at 0° tilt, no hover scale.

### Files

- Add `src/components/home/AtelierStories.tsx` — the whole section.
- Add `src/assets/atelier-1.jpeg.asset.json` … `atelier-2.jpeg.asset.json` (from uploads) and `atelier-3.jpg` … `atelier-8.jpg` (generated).
- Append `@keyframes atelier-marquee` + `.animate-atelier-marquee` utility to `src/styles.css`.
- Edit `src/routes/index.tsx` — import and mount `<AtelierStories />` directly under `<EditorialSpotlight />`.

### Not touched

- No backend, no admin panel, no schema, no new endpoints, no other sections. Purely a presentation-layer editorial strip using local assets.
