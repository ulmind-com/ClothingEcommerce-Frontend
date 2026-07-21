## Replace MaisonAtelierShowcase with exact reference layout + footer

The previous attempt didn't match. Rebuild the "above footer" section to mirror the uploaded reference 1:1, then keep the footer text below it.

### 1. Rebuild `src/components/home/MaisonAtelierShowcase.tsx`

Recreate the reference exactly:
- **Background**: full-bleed warm beige/sand wall (`#E8D4A8`-ish tone), tall section (~85vh).
- **4 recessed niches**: darker tan rectangles (`#B8894A`-ish), portrait 3:5 ratio, evenly spaced across the top ~55% of the section, with soft inner shadow to feel recessed into the wall.
- **Models sit/lean out of niches**: each model image is a transparent-background PNG positioned so legs/arms overflow *below* the niche's bottom edge onto the beige wall — not contained inside. Use `overflow-visible` on the niche wrapper; model `<img>` extends past the frame with `translate-y` so heels/shadow land on the wall.
- **Cast shadows**: subtle soft drop-shadow on the wall beneath each model (CSS `filter: drop-shadow`) to sell the 3D depth.
- **No captions inside the niches** — reference has none.
- **Below the niches** (on the empty lower wall), place small editorial text centered: eyebrow "Maison — N° 04" + line "Poise, tailored in daylight." in serif italic, muted ink.
- Subtle entrance: niches fade+rise on scroll (Reveal), models stagger in after with a slight y-lift using Framer Motion.

Model images: reuse 4 existing atelier assets (transparent cut-outs aren't available, so use the current portraits inside the niches — accept that they'll be framed within rather than overflowing, unless suitable cut-out assets already exist). Verify what's in `src/assets/` first; if no transparent cut-outs exist, render the portraits fully inside the niches (still matches the "4 vertical frames on a beige wall" reading, just without overflow).

### 2. Footer text under the section

Below MaisonAtelierShowcase (still above the existing site footer if any, or replacing it), render only the plain footer copy the user pasted earlier — no fancy layout, just the text blocks:

```
Maison
Modern couture crafted in limited series...

Shop: New Arrivals / Women / Men / Collections
Client Services: Shipping / Returns / Size Guide / Care
Newsletter: Private invitations... [Join →]

© 2026 Clothing Store — All rights reserved.  Privacy  Terms
```

Keep it minimal, serif headings, hairline dividers, cream background — matching the site's existing luxury tone.

### 3. Mount

In `src/routes/index.tsx`, ensure the order stays: … → CampaignQuote → MaisonAtelierShowcase → Footer.

### Technical notes

- Tailwind arbitrary color values for the beige/tan wall tones (or add tokens to `styles.css` if reused).
- `filter: drop-shadow(0 30px 20px rgba(0,0,0,0.25))` on model images for the wall shadow.
- Niches use `box-shadow: inset` for recessed depth.
- Responsive: stack niches 2×2 on mobile.
