## New section: "The Diagonal Edit" (above New Arrivals)

A cinematic diagonal-stacked carousel driven by live backend products, placed between `CoutureSimplicity` and `NewArrivalsRail` on the home route.

### Files

1. **`src/components/ui/DiagonalCarousel.tsx`** — new
   - Port the provided component to our stack (TanStack Start / React 19, no `"use client"` needed).
   - Fix the stripped JSX/props from the paste; keep the same API (`items`, `activeIndex`, `slideSize`, `rotationStep`, `verticalStep`, `inactiveScale`, `loop`, `showControls`, `showDots`, etc.).
   - Use existing `cn` from `@/lib/utils` (already present via shadcn setup — no new deps; `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge` are already installed).
   - Style controls/dots against our luxury tokens (ink/cream/champagne) instead of generic dark mode.

2. **`src/components/home/DiagonalEdit.tsx`** — new
   - `useQuery(productsOptions({ limit: 8 }))`; filter to items with `productImage(p)`; guard empty state (`return null`).
   - Map to `DiagonalCarouselItem[]` → `{ src: productImage(p), title: p.name }`.
   - Autoplay every ~4s (pause on hover / when tab hidden / `useReducedMotion`), controlled via `activeIndex` + `onActiveIndexChange`, `loop`.
   - Layout: full-bleed cream section, `py-24 md:py-32`, fixed viewport height (`h-[560px] md:h-[720px]`) so the carousel has stable height as required.
   - Header (centered, editorial):
     - Eyebrow: `The Edit`
     - Display heading: `Worn on a Diagonal.`
     - Sub: `Eight pieces from the season, tilted into perspective.`
   - Below carousel: active product name + price + `LuxLink` to `/product/$id` (updates as `activeIndex` changes).

3. **`src/routes/index.tsx`** — edit
   - Import `DiagonalEdit`.
   - Insert `<DiagonalEdit />` between `<CoutureSimplicity />` and `<NewArrivalsRail />`.

### Behaviour / motion

- Diagonal stack geometry: `slideSize=280`, `rotationStep=22`, `verticalStep=110`, `inactiveScale=0.62`.
- Spring transition preserved from source (`bounce: 0.16, duration: 0.85`).
- Keyboard: ArrowLeft/Right navigate (already in source).
- Click any inactive slide → becomes active.
- Autoplay stops on user interaction (hover, focus, click, key).

### Backend contract

- Reads existing `productsOptions({ limit: 8 })` — no admin panel or schema changes. No new endpoints, no writes.

### Out of scope

- No changes to existing sections, header, cart, or API layer.
- No new assets generated; images come from backend product responses.
