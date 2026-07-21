## Goal

Replace the current "Poise, tailored in daylight." showcase and the existing site footer with a single new footer section that matches the uploaded reference image (4 seated models in recessed beige niches) and carries the footer text underneath.

## Changes

1. **Remove `MaisonAtelierShowcase` ("Poise, tailored in daylight.")**
   - Delete `src/components/home/MaisonAtelierShowcase.tsx`.
   - Remove its import and usage from `src/routes/index.tsx`.

2. **Upload the reference image as an asset**
   - Upload `user-uploads://ChatGPT_Image_Jul_22_2026_12_11_15_AM-2.png` via `lovable-assets` → `src/assets/atelier-footer.png.asset.json`.
   - Use it as a single full-bleed image (same-to-same look — 4 niches with seated models on the beige wall). No re-creation with SVG niches; the image itself becomes the footer visual.

3. **Create `src/components/layout/SiteFooter.tsx` (new editorial footer)**
   - Top: full-bleed reference image (`w-full h-auto`, `object-cover`, no crop distortion; preserves the empty beige lower area for text).
   - Below the image (on matching beige `#ecd6a6`-ish background so it blends):
     - Brand block: **Maison** + tagline "Modern couture crafted in limited series. Each piece is finished by hand and shipped with care."
     - **Shop**: New Arrivals · Women · Men · Collections
     - **Client Services**: Shipping · Returns · Size Guide · Care
     - **Newsletter**: "Private invitations, campaigns and new arrivals." + email input with "Join →"
     - Bottom bar: "© 2026 Clothing Store — All rights reserved." · Privacy · Terms
   - Serif headings (Cormorant), thin hairline dividers, ink-on-cream palette tuned to the beige image so the transition is seamless.

4. **Wire the new footer**
   - In `src/components/layout/SiteChrome.tsx` (or wherever the current footer renders), replace the existing footer JSX with `<SiteFooter />`.
   - Remove the previous footer markup entirely so only the new one remains.

5. **Verify**
   - Home page flows: Hero → … → New Arrivals → CampaignQuote → **new footer (image + text)**.
   - No leftover "Poise" section, no duplicate footer.

## Technical notes

- Image is used as-is (no SVG re-build), matching the user's "same to same" request.
- No backend changes; purely presentational.
- Keep existing links/routes the footer already used; only visuals + copy structure change.
