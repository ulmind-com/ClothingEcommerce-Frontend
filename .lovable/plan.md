## Plan: make the runway lookbook match the reference video

### What I’ll change
- Rework only `RunwayLookbook` after the video reel.
- Keep it powered by the existing product data (`productsOptions`) and existing product routes.
- Do not touch backend, admin panel, schema, API files, or product data logic.

### Reference behavior to match
- The active look stands center-right, sharp and full-height.
- Previous looks stay grouped on the left as blurred/desaturated background figures.
- The right side shows exactly 2 product cards for the active look.
- When the next look arrives, those 2 cards animate out and a different pair animates in for that look.
- The whole composition slides like the video: left cluster recedes, active model enters/stays sharp, right-rail product cards swap in sync.

### Implementation details
- Replace the current equal-width carousel strip with a staged composition:
  - left ghost cluster: 2–3 previous/nearby looks, small + blurred + low opacity;
  - active look: large portrait model/product image, sharp, higher z-index;
  - incoming look: faint partial figure on the right, blurred, hinting the next transition.
- Rebuild the right rail so each look deterministically gets its own 2-card set:
  - look 01 → products 02/03;
  - look 02 → products 03/04;
  - etc., wrapping around;
  - the cards will use `AnimatePresence` keys tied to the active look so they visibly swap on every look change.
- Tighten the animation timing to feel like the video:
  - stage slide/scale/blur transition on every advance;
  - 2-card rail exits upward/fades, then next two stagger in;
  - progress and LOOK counter remain synced with autoplay.
- Improve layout proportions closer to the reference:
  - pale blue/mint editorial canvas;
  - top faux navigation line;
  - big LOOK counter bottom-left;
  - right cards slimmer, clean white, stacked with spacing.

### Validation
- Check the section in the live preview at the current mobile-ish viewport and desktop sizing.
- Confirm the rail changes 2 cards per look and the active look remains sharp while background figures blur.