# Luxury Clothing Store — Frontend (Phase 1)

Build a cinematic, editorial luxury storefront on the existing TanStack Start app. This phase covers the foundation and the three highest-value surfaces: Home, Product Listing, Product Detail. All content comes from the live backend at `https://clothingecommerce-backend.onrender.com`. No backend, no mocks.

## Design language

- Palette: near-black `#0B0B0B`, warm off-white `#F6F3EE`, warm gray, champagne gold `#B08D57` accent. Applied via oklch tokens in `src/styles.css` (light default, optional dark).
- Type: editorial serif display (Cormorant / Fraunces) + refined sans (Inter Tight) — loaded via `<link>` in `__root.tsx`.
- Feel: generous whitespace, hairline dividers, uppercase tracked labels, slow luxurious easings, image-first.
- Motion: Lenis smooth scroll, GSAP ScrollTrigger for mask/text reveals & parallax, Framer Motion for component transitions & page transitions, magnetic buttons, cursor follower (desktop only), skeleton shimmer.
- 3D: lightweight R3F hero accent (floating silk-like plane with subtle noise displacement + soft studio lighting), mouse parallax, disabled on mobile / `prefers-reduced-motion`.

## Foundation

- API layer: `src/lib/api/client.ts` axios instance with `baseURL`, `Authorization: Bearer` interceptor reading `localStorage.user_token`, 401 handler, error normalizer.
- Endpoint modules: `products.ts`, `categories.ts`, `banners.ts`, `home-sections.ts`, `reviews.ts`, `recommendations.ts`, `search.ts`, `settings.ts`, `wishlist.ts`, `auth.ts`. Each exports typed functions + `queryOptions` factories (TanStack Query).
- Types: `src/types/*` mirroring OpenAPI shapes (Product, Category, Banner, HomeSection, Review, Paginated<T>). Fetched from `/openapi.json` during implementation to lock shapes.
- Auth context: `src/lib/auth/AuthContext.tsx` — token in localStorage, `useAuth()` exposes user from `/auth/me`, `login/logout/register`. Client-only, gated with `useHydrated()`.
- Providers wired in `__root.tsx` inside `QueryClientProvider`: AuthProvider, Toaster (react-hot-toast), LenisProvider, CursorProvider.
- UI primitives in `src/components/ui/`: `Button` (magnetic variant), `IconButton`, `Link`, `Container`, `Section`, `Marquee`, `Reveal` (GSAP mask/fade wrappers), `Image` (blur-up + zoom), `Skeleton`, `Price`, `Tag`, `Rating`, `Modal`, `Drawer`, `Select`, `Chip`, `Accordion`.
- Layout: `SiteHeader` (transparent-over-hero → solid on scroll, animated mega menu driven by `/categories`, search trigger, wishlist, account, cart icons with count), `SiteFooter` (columns + newsletter), `PageTransition` wrapper, `LoadingScreen` (first paint), `SearchOverlay` (trending + live search — UI shell now, wired to `/search`).

## Home (`/`)

Fully data-driven; replace the placeholder in `src/routes/index.tsx`.

Loader (`ensureQueryData` in parallel): banners, home-sections, featured products, new arrivals, categories, settings.

Sections rendered in order returned by `/home-sections` when available, otherwise a curated fallback order using the other endpoints:

1. Cinematic hero — full-viewport banner (video if banner provides one, else image) with GSAP mask reveal headline, subtle R3F silk backdrop layer, magnetic CTA.
2. Editorial category grid — asymmetric bento from `/categories`, hover image reveal.
3. New Arrivals rail — Embla carousel, image parallax on scroll.
4. Featured collection — split-screen editorial block with pinned image + scrolling copy (ScrollTrigger).
5. Trending — masonry with staggered fade-up.
6. Editor's Choice — large product card with campaign copy.
7. Campaign video section — muted looping video, text reveal.
8. Reviews marquee — infinite scroll of top reviews.
9. Instagram-style gallery grid (from banners tagged accordingly or gracefully hidden).
10. Newsletter block, then footer.

Each section has skeletons and gracefully hides when its endpoint returns empty.

## Product Listing (`/shop` and `/shop/$category`)

- Search params via `validateSearch` (zod): `q`, `category`, `sort`, `page`, `minPrice`, `maxPrice`, `size[]`, `color[]`, `rating`, `discount`.
- Loader primes `/products` query using `loaderDeps` on search.
- Layout: sticky filter sidebar (desktop) / bottom-sheet drawer (mobile), luxury filter chips, sort dropdown, results count, editorial header image per category.
- Product card: aspect-[3/4] image with hover crossfade to secondary image, quick-view button (drawer), wishlist heart (optimistic), price + compare-at, color swatches.
- Infinite scroll via IntersectionObserver + `useInfiniteQuery`; URL still tracks `page` for shareability.
- Empty / loading / error states.

## Product Detail (`/product/$id`)

- Loader: `ensureQueryData` for product, reviews, recommendations in parallel; `errorComponent` + `notFoundComponent`.
- Layout: sticky gallery left (thumbnail rail + main image with pinch/scroll zoom, lightbox), info right (brand line, name in display serif, price, short desc, color selector, size selector with size-guide drawer, quantity, Add to Bag magnetic CTA, wishlist, share, delivery/returns accordions from `/settings`).
- Below fold: story block (parallax), fabric & care accordion, reviews section with rating summary + list, "You may also like" recommendations rail, "Recently viewed" (localStorage).
- Add-to-bag currently updates a client-side cart store (Zustand) — cart drawer UI included; checkout flow is Phase 2.
- SEO: dynamic `head()` with title/description/og:image from product images, JSON-LD Product schema.

## SEO / meta

- Update `__root.tsx` head defaults (brand name, description, og). Leaf routes set their own `head()` — Home, Shop, category, product all get bespoke title/description; PDP adds og:image + Product JSON-LD.

## Accessibility & performance

- Focus rings, aria-labels on icon buttons, keyboard-nav mega menu & drawers, `prefers-reduced-motion` disables Lenis/heavy GSAP/R3F.
- Route-level code splitting (TanStack default), lazy R3F, image `loading="lazy"` + `decoding="async"`, LCP hero preload link.

## Technical notes

- Packages to add: `framer-motion`, `gsap`, `@studio-freight/lenis`, `three`, `@react-three/fiber`, `@react-three/drei`, `embla-carousel-react`, `react-hook-form`, `zod` (present), `axios`, `@tanstack/react-query` (present), `lucide-react`, `react-hot-toast`, `lottie-react`, `zustand`, `react-helmet-async` not needed (TanStack head handles it), `@fontsource-variable/cormorant`/`inter-tight` OR CDN link.
- API base URL from `import.meta.env.VITE_API_BASE_URL` with default `https://clothingecommerce-backend.onrender.com`.
- Auth is client-side only; server functions unnecessary for Phase 1 (public browsing endpoints). All API calls run in the browser to leverage the JWT in localStorage. Loaders wrap fetches in a helper that skips execution during SSR prerender for auth-bearing calls to avoid empty renders — public data (products, banners, categories) is safe to SSR.
- CORS: assumed configured on backend per your confirmation.
- No hardcoded content — every list/section reads from the backend, hides empty states, and reflects admin changes on next React Query refetch (staleTime tuned per resource: products 30s, banners/home-sections 60s, categories 5min).

## Out of scope for Phase 1 (follow-ups)

Cart persistence & checkout (Razorpay/COD), full auth pages (login/register/OTP/Google/Facebook), profile, orders, returns, notifications, wishlist page, chat, sitemap generation. Cart drawer UI is in; checkout submit is not.

## Deliverable

Working Home, PLP, PDP driven by live backend, with the full luxury design system, motion system, and reusable component library ready for Phase 2.
