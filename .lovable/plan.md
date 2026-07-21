## Runway Lookbook — match reference exactly

Two fixes to `src/components/home/RunwayLookbook.tsx` (frontend only, no backend/admin touched):

### 1. Transparent model cutouts
Reference shows models on pure white with no photo background — floating cutouts, not framed cards.

- Remove the card frame around the active look: drop the rounded container, border, shadow, and any background fill on the hero image wrapper.
- Render the active model image as a bare `<img>` (or motion.img) with `object-contain`, no bg, no radius, no overlay tint.
- Same for the receding/incoming looks — no card chrome, just the image.
- Section background stays flat cream/white so the (already near-white) product photography reads as cut-out. We won't do real bg-removal on the images themselves; the frame removal is what creates the "transparent" look in the reference.

### 2. Stacked blurred looks behind the active one
Reference: the previous looks stay visible as a receding trail on the left — smaller, heavily blurred, desaturated, lower opacity, overlapping horizontally. Right side shows the next look coming in, lightly blurred.

Rebuild the strip so at any time we render ~5 looks positioned relative to the active index:
- offset −3: `scale 0.45`, `blur-2xl`, `opacity 0.25`, grayscale, far left
- offset −2: `scale 0.6`, `blur-xl`, `opacity 0.45`, grayscale
- offset −1: `scale 0.8`, `blur-md`, `opacity 0.7`, slight desat
- offset  0: `scale 1`, no blur, full color, centered, sharp — the hero
- offset +1: `scale 0.85`, `blur-sm`, `opacity 0.8`, entering from right

All positioned absolutely on a shared horizontal axis, aligned to the ground line (bottom-aligned) so the models "stand" together like the reference. Framer Motion `layout` + spring transition handles the slide when index advances; heights/blur/opacity animate via variants keyed to offset.

Left rail (SPRING SUMMER label + copy) and right rail (2 product cards restacking) stay as-is. The big `LOOK NN` counter and `SHOP THE LOOK` link stay bottom-left as in the reference.

### Notes
- No new dependencies, no backend calls changed — still driven by `productsOptions`.
- No admin panel changes.
