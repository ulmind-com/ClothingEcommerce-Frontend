## Replace atelier images in "Threads of a Living Heritage"

Swap all 8 marquee images in `src/components/home/AtelierStories.tsx` with the 8 user-uploaded photos. Remove AI-generated atelier assets (`atelier-3` through `atelier-8`) from the codebase.

### Steps

1. **Upload 8 user images** via `lovable-assets` from `/mnt/user-uploads/` → new pointers in `src/assets/`:
   - `atelier-new-1.jpeg` — peach sequined saree (lattice wall)
   - `atelier-new-2.jpeg` — Shahid-style beige suit
   - `atelier-new-3.jpeg` — coffee date linen look
   - `atelier-new-4.jpeg` — maroon velvet saree portrait
   - `atelier-new-5.jpeg` — red peplum lehenga (blue door)
   - `atelier-new-6.jpeg` — maroon couple bridal (palace)
   - `atelier-new-7.jpeg` — ivory sherwani couple
   - `atelier-new-8.jpeg` — ivory sherwani + green dupatta

2. **Edit `src/components/home/AtelierStories.tsx`**
   - Remove imports for `atelier-1` … `atelier-8` (both existing `.asset.json` and `.jpg` imports).
   - Import the 8 new asset pointers.
   - Rebuild the `IMAGES` array with the new URLs + fresh, editorial alt text.
   - Keep the existing tilt array, marquee animation, header, and CTA untouched.

3. **Delete unused assets** via `lovable-assets delete` on the AI-generated files no longer referenced anywhere:
   - `src/assets/atelier-1.jpeg.asset.json`
   - `src/assets/atelier-2.jpeg.asset.json`
   - `src/assets/atelier-3.jpg` … `atelier-8.jpg` (rm — these are local files, not CDN pointers)
   - Only after confirming via `rg` they aren't referenced by any other component.

### Out of scope

No changes to layout, motion, typography, header copy, or the "Explore the House" CTA. No backend/API changes.
