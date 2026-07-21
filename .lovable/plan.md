## Problem

Two sections on the home page currently show the same root categories back-to-back:

1. `CuratedThisSeason` — "Curated This Season" (recently added, 3D tilt tiles)
2. `CategoriesBento` — "The House / Explore the world of Maison" (bento grid tiles)

Both pull from `/categories` and render the same 4 root categories, so the page reads as a duplicate.

## Fix

**1. Remove the duplicate**
- Delete `CuratedThisSeason` from `src/routes/index.tsx` (import + JSX usage).
- Delete the component file `src/components/home/CuratedThisSeason.tsx`.

**2. Restyle `CategoriesBento` to match the reference**

Keep the section header text ("The House" eyebrow + "Explore the world of Maison" heading) but move it to **centered** alignment like the reference. Replace the current bento with a clean 4-up row of tall portrait tiles:

- Layout: 4 columns on desktop (`md:grid-cols-4`), 2 on mobile, **no gaps** between tiles (edge-to-edge like the reference), full-bleed width.
- Tile aspect: `aspect-[3/5]` tall portraits (taller than current `3/4`).
- Image: full-cover, subtle slow zoom on hover, no dark gradient overlay.
- Label: category name centered at the bottom in cream serif caps with wide tracking (e.g. `LEHENGA`, `FUSION WEAR`), no arrow icon, no card border.
- Subtitle under the heading: a short italic line ("A blend of classic silhouettes and our signature shine, embodied by enigmatic sequins.") — pulled from settings if available, otherwise a static tagline.
- Bottom of section: centered "VIEW ALL" link with a thin underline, linking to `/shop`.
- Motion: gentle stagger-in on scroll (reuse existing `Reveal`), champagne underline sweep on hover of the label.

**3. Backend contract stays untouched**
- Still calls `categoriesOptions()` (`GET /categories`) — no admin panel or backend changes.
- Uses `image` and `image_scale` fields already on the Category type.
- Falls back gracefully when fewer than 4 root categories have images.

## Files touched

- `src/routes/index.tsx` — remove `CuratedThisSeason` import + usage; rewrite the `CategoriesBento` function.
- `src/components/home/CuratedThisSeason.tsx` — delete.

No new dependencies, no backend changes.
