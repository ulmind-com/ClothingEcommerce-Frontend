## Next Section: "Sophisticated Comfort, Couture Simplicity"

Add a new playful editorial section after `AtelierStories` in `src/routes/index.tsx`, matching the uploaded CoutureNest reference 1:1 — same layout, same shapes, same composition.

### Layout (split-screen, asymmetric)

```text
┌──────────────────────────────────────────────────────────┐
│  [LEFT ~45%]              [RIGHT ~55%]                   │
│  ┌─────────────────┐      Sophisticated ●yellow          │
│  │ purple arch     │      comfort,      ●pink circle+model│
│  │  ┌───────────┐  │      couture                        │
│  │  │ model in  │  │      simplicity.  ●orange dot       │
│  │  │ pink fur  │  │                                     │
│  │  │ (portrait)│  │      Elevate your style with a      │
│  │  └───────────┘  │      touch of effortless...         │
│  │ ★pink sparkle   │                                     │
│  └─────────────────┘      [ Shop Now ]  [ Collections ]  │
│                                          ●yellow circle+ │
│                                           model + film    │
│                                           strip squiggle  │
└──────────────────────────────────────────────────────────┘
```

### SVG shapes (inline, hand-drawn, animated)

Build all decorative shapes as inline SVG components with subtle Framer Motion floats/rotations:
- Large **purple arch** framing the left model (rounded-top rectangle mask)
- **Pink 4-point sparkle/star** (top-left of arch)
- **Yellow half-circle** behind "So" of headline
- **Blue small circle** top-right of headline
- **Pink blob/circle** with small model portrait inset (mid-right of headline)
- **Orange donut** (small ring) beside "simplicity."
- **Yellow filled circle** bottom-right with model portrait inset
- **Purple half-moon** mid-right edge
- **Film-strip squiggle** (perforated wavy line) bottom-right

### Typography & copy

- Headline: massive serif display (Cormorant Garamond, ~7xl-9xl), tight leading, black weight. "Sophisticated" first word uses yellow-highlight behind "So".
- Body: 2-3 lines warm-gray sans, ~base size
- Two CTAs: solid champagne/yellow "Shop Now" pill + outlined "Collections" pill

### Data / backend

- Pull 3 product/model images from existing `productsOptions({ limit: 12 })` query for the 3 model insets (main left, small pink circle, bottom yellow circle) — no new endpoints, no admin changes.
- Fallback to existing generated portraits from `AtelierStories` assets if products lack images.

### Motion

- Reveal on scroll (Framer Motion + existing `Reveal` component)
- Each SVG shape idle-floats (y/rotate loop, staggered)
- Model images: subtle Ken Burns on the main portrait
- Headline: MaskReveal line-by-line

### Files

- **Create** `src/components/home/CoutureSimplicity.tsx` — the section
- **Create** `src/components/home/couture-shapes.tsx` — inline SVG shape primitives (Arch, Sparkle, HalfCircle, Donut, HalfMoon, FilmStrip, Blob)
- **Edit** `src/routes/index.tsx` — mount `<CoutureSimplicity />` after `<AtelierStories />`

Frontend only. No backend, no admin, no new API endpoints.
