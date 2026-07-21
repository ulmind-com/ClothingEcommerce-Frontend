## Plan: "Maison Atelier" showcase section (Posh-style)

Add a new editorial section just above the footer on the homepage that recreates the uploaded reference 1:1 in structure — 4 tall portrait "boxes" with models sitting on the ledge, brand mark + tagline centered underneath — but rebranded to Maison. Footer stays exactly as it is today.

### Where it goes

`src/routes/index.tsx` — mount `<MaisonAtelierShowcase />` immediately after the existing `CampaignQuote` block and before `<SiteFooter />` (footer is already rendered by `SiteChrome`, so no footer changes).

### New file: `src/components/home/MaisonAtelierShowcase.tsx`

Layout, matching the reference:

```text
              [ warm champagne / sand background, soft radial glow ]

   ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐
   │ img │    │ img │    │ img │    │ img │     ← 4 tan rounded rectangles
   │  1  │    │  2  │    │  3  │    │  4  │       (aspect 3/4, tan #C9A87A-ish)
   └──▼──┘    └──▼──┘    └──▼──┘    └──▼──┘     ← models overflow bottom edge,
     sit         sit        sit        sit        casting a soft ground shadow

                        Maison            ← script/serif wordmark
                       — couture —         ← thin eyebrow under it

           Welcome to couture that doesn't
             just dress you, it defines you.
```

Key visual details to match the reference:
- Background: warm champagne gradient (reuses `--cream` / `--champagne` tokens) with a subtle radial vignette.
- 4 equal tiles, `aspect-[3/4]`, `rounded-[6px]`, solid tan fill (`bg-champagne/70`), thin inset shadow.
- Model images sit *inside* each tile but the figure extends ~15–20% below the tile's bottom edge (negative margin on the `<img>`, `object-cover object-top`, tile has `overflow-visible`).
- Each model gets a soft elliptical drop-shadow on the "floor" below the tile (blurred radial div) so they feel grounded.
- Row of tiles horizontally centered, gap-6, max-width ~1200px. On mobile: 2×2 grid.
- Below the tiles: centered "Maison" wordmark in `font-display` italic + a hairline `— couture —` eyebrow, then the two-line tagline in warm-gray.

### Motion (Framer Motion + Reveal)
- Each tile fades + rises in staggered (0.1s apart) on scroll-into-view via existing `<Reveal>`.
- Each model image has a very slow idle float (`y: [0, -4, 0]`, 6s, staggered) so the group feels alive but calm.
- Wordmark uses a mask reveal similar to other sections.

### Images

Need 4 editorial portraits where the subject is full-body and can visually "sit" on the tile edge. Reuse existing atelier assets that already show seated / relaxed full-body poses:
- `atelier-new-2.jpeg` (tailored beige suit)
- `atelier-new-3.jpeg` (linen shirt + chinos)
- `atelier-new-7.jpeg` (ivory sherwani portrait)
- `atelier-new-8.jpeg` (ivory sherwani + brocade)

If any of these don't crop convincingly as "seated on ledge", swap to another `atelier-new-*` asset — no new uploads or AI generation.

### Footer

No changes. The existing `SiteFooter` (rendered by `SiteChrome`) already contains the exact copy the user listed (Maison / Shop / Client Services / Newsletter / © 2026 / Privacy / Terms), so it stays as-is.

### Files touched
- Add: `src/components/home/MaisonAtelierShowcase.tsx`
- Edit: `src/routes/index.tsx` (import + mount above footer, after CampaignQuote)

No backend, styles.css, or footer changes.
