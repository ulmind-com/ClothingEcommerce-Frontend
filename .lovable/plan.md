## Change

In `src/routes/index.tsx` → `CategoriesBento`:

1. **Add small gaps between the 4 tiles** — replace the current edge-to-edge grid with `gap-3 md:gap-4` and add horizontal padding (`px-4 md:px-6`) so the tiles sit as a 4-up row with breathing room, matching the reference screenshot.

2. **Strengthen the dark shadow behind labels** — the current gradient (`from-ink/70`) is too soft. Increase it to `from-ink/90 via-ink/40 to-transparent`, make it taller (`h-1/2`), and keep it always visible (remove `opacity-90` conditional feel) so `LEHENGA`, `FUSION WEAR`, etc. remain crisply legible over any image — exactly like the reference.

3. Keep the label styling (cream serif caps, wide tracking, champagne underline sweep on hover) and the centered "View all" link unchanged.

No backend changes. No new components. Still uses `/categories` (top 4 roots with images) so the admin panel stays in full control.

## Files touched

- `src/routes/index.tsx` — only the `CategoriesBento` function's grid + overlay classes.
