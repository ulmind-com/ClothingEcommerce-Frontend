## Runway Lookbook — match reference 1:1

Reference (Marc Jacobs SS19) shows:
- Pure white/near-white background, no cream tint, no grain
- Models are clean cutouts standing on a shared ground line — no card frames, no shadows, no colored halos
- Active look on the RIGHT (not centered), sharp and full-size
- 1 medium sharp look to its immediate left (previous look, still fairly crisp)
- 3–4 progressively smaller, heavily blurred figures further left forming a receding "crowd"
- Right rail: 2 product cards, minimal — thin border, heart icon top-left, `+` bottom-right, tiny uppercase title + price
- Bottom-left: giant thin "LOOK 15" + "SHOP THE LOOK" underline link
- Top-left: "SPRING SUMMER 2019" eyebrow + short paragraph

Current implementation has the active model centered with figures on both sides, uses a cream/grain background, `mix-blend-mode: multiply`, and rounded/bordered right-rail cards. That's why it doesn't read like the reference.

### Fixes to `src/components/home/RunwayLookbook.tsx`

**Background**
- Swap section bg from `bg-secondary/60 silk-grain` to pure `bg-white` (or `bg-cream` only if cream is already near-white — otherwise white). Remove grain texture on this section only.
- Drop `mix-blend-mode: multiply` on model images; on white bg the near-white product photos will already read as cutouts.

**Composition — active look on the right, trail on the left**
Reposition slots so nothing sits to the right of the active look:
- offset −4: far left, scale 0.35, blur 26px, opacity 0.18, grayscale
- offset −3: scale 0.45, blur 18px, opacity 0.28, grayscale
- offset −2: scale 0.6,  blur 10px, opacity 0.45, desaturated
- offset −1: scale 0.85, blur 2px,  opacity 0.9, near-sharp (the "previous" look, mid-stage)
- offset  0: scale 1, no blur, full color, anchored to the RIGHT side of the stage (~72% x), sharp
- Remove offset +1 entirely (reference has nothing entering from the right)

All figures stay bottom-aligned on a shared ground line with `transform-origin: bottom center`. Spring transition on `left` + `scale` + `filter` so on advance, everything slides one slot leftward and the previous active look becomes the new offset −1.

**Right rail — minimal product cards**
Rebuild `ShopCard`:
- Remove background fill, drop shadow, and rounded corners
- Thin 1px hairline border only (`border-ink/15`), square corners
- Heart (outline) icon top-left over the image
- `+` icon bottom-right of the info row (already there — keep, but lighten)
- Image bg = white, `object-contain` so the product floats like the reference (not `object-cover`)
- Uppercase tiny tracked title, price below in muted ink
- Keep 2-card stack with the existing 2-card swap AnimatePresence

**Left rail copy**
- Keep "Autumn / Winter 26" eyebrow + paragraph as-is (already matches reference structure)
- Keep giant LOOK NN counter + champagne progress rule + "Shop the Look" underline link

**No backend / admin / API changes.** Still driven by `productsOptions`. No new deps.

### Files touched
- `src/components/home/RunwayLookbook.tsx` — slot table, stage bg, remove multiply blend, rework `ShopCard`
