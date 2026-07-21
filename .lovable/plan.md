## Shop Gallery Section — 1:1 with the reference

New section directly below the Hero (before "Explore the world of Maison"). Matches the uploaded reference exactly: pill category banners → icon filter row → product card grid with badges, wishlist heart, and an Add to Cart CTA on the active card.

Backend contract stays untouched — reads categories from `/categories` and products from `/products` via the existing `categoriesOptions` / `productsOptions` query factories. No admin/API changes.

### 1. Pill category banners (top row)
- 4 rounded pill tiles, edge-to-edge in a `grid-cols-4` on desktop, horizontal scroll snap on mobile.
- Each pill: alternating coral/pink gradient fill (`#F28B82 → #E91E63` style, coded as new tokens `--coral` / `--rose`), left-side circular portrait cutout, right-side big serif label ("Women Gallery", "Children Fashion", "Men's Fashion", "Women's Fashion"), trailing arrow (`lucide-react` `ArrowRight`) inside a subtle circle.
- Data source: first 4 items from `categoriesOptions()`. Portrait image = `category.image`. Label = `category.name`. Falls back to the reference labels only if backend returns fewer than 4.
- Whole pill is a `<Link to="/shop" search={{ category: id }}>` — clicking filters the shop route by that category (shop route already accepts `category_id`, wired via search param).

### 2. Icon filter row
- Horizontal row of 7 chips: `All`, `Dresses`, `T-shirts`, `Denim`, `Jackets`, `Coats`, `Shoes`. Each is a stacked icon (lucide: `LayoutGrid`, `Shirt`, `Shirt`, custom denim, `Shirt`, custom coat, `Footprints`) with a label underneath.
- The active chip renders inside a soft rose rounded rectangle exactly like the reference "All" state; inactive chips are icon-only on transparent bg.
- Clicking a chip sets a local `activeFilter` state and filters the visible products by matching category name (case-insensitive contains). "All" clears the filter. No route change — instant client-side filter over the loaded products.

### 3. Product card grid
- `grid-cols-2 md:grid-cols-4` responsive grid, pulled from `productsOptions({ limit: 8 })`.
- Card shape: rounded 2xl, soft pink/blush photo backdrop (`bg-rose-100/60`), image `object-contain` bottom-aligned so the model "stands" on the card floor — matches reference.
- Top-left stacked badges: `Hot` (coral pill) if `product.tags?.includes('hot')` or first card; `New` (green pill) if `product.tags?.includes('new')` or newest by `createdAt`. Both use existing tag field on `Product`; if missing, derived heuristically so it always shows something like the reference.
- Bottom of card: product title (charcoal), price in coral/rose, small outline heart icon at the right for wishlist (calls existing wishlist logic — no-op preventDefault for now, matches other cards in the app).
- One card is highlighted as "active" (the middle one, like the reference): shows a coral 2px ring around the card AND a full-width coral rounded `Add to Cart` button under the price with a bag icon. Clicking it uses the existing `useCartStore.addItem`. Other cards reveal the same button on hover with a soft fade-in.
- Whole card image area is a `Link to="/product/$id"`; only the Add to Cart button is a separate button (stopPropagation).

### 4. Styling & motion
- New CSS tokens in `src/styles.css`: `--coral: oklch(...)`, `--rose: oklch(...)`, `--blush: oklch(...)` for the pinks; register via `@theme` so Tailwind classes like `bg-coral`, `text-rose`, `bg-blush` work. No hardcoded hex in components.
- Entrance: pills stagger-fade-up on scroll (Reveal), icon row slides in from left, product grid stagger-fades (existing Reveal component). Card hover = subtle lift + image scale 1.03 over 700ms.
- Everything responsive: pills 4→2→1 col, icon row horizontal-scrolls on mobile, product grid 4→2 col.

### Files touched
- `src/styles.css` — add coral/rose/blush tokens.
- `src/components/home/ShopGallery.tsx` — new component containing all three subsections.
- `src/routes/index.tsx` — mount `<ShopGallery />` directly under the Hero.

### Not touched
- No backend, no admin panel, no new endpoints, no schema changes. Reads only from existing `/categories` and `/products`.
