import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Heart,
  LayoutGrid,
  Shirt,
  ShoppingBag,
  Footprints,
} from "lucide-react";
import { categoriesOptions, productsOptions } from "@/lib/api/queries";
import { productImage } from "@/lib/utils/product";
import { formatPrice } from "@/lib/utils/format";
import { useCart } from "@/lib/cart/store";
import { Reveal } from "@/lib/motion/Reveal";
import type { Category, Product } from "@/types/api";

// Jeans icon (lucide has no denim/jeans by default) — inline SVG matches stroke style.
function JeansIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M6 3h12l-1 6-1 12h-3l-1-10h-0l-1 10H8L7 9z" />
      <path d="M6 3h12" />
      <path d="M12 3v6" />
    </svg>
  );
}

function CoatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M8 3l4 3 4-3" />
      <path d="M8 3L3 7l2 4 3-1v11h8V10l3 1 2-4-5-4" />
      <path d="M12 6v15" />
    </svg>
  );
}

function JacketIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M8 3l4 4 4-4" />
      <path d="M8 3L3 6v6l3-1v10h12V11l3 1V6l-5-3" />
      <path d="M12 7v14" />
      <path d="M15 12v3" />
    </svg>
  );
}

function DressIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9 3h6l-1 3 3 4-2 2 3 9H6l3-9-2-2 3-4z" />
    </svg>
  );
}

type FilterKey =
  | "all"
  | "dresses"
  | "tshirts"
  | "denim"
  | "jackets"
  | "coats"
  | "shoes";

const FILTERS: {
  key: FilterKey;
  label: string;
  match: string[];
  Icon: (p: { className?: string }) => ReactNode;
}[] = [
  { key: "all", label: "All", match: [], Icon: ({ className }) => <LayoutGrid className={className} strokeWidth={1.6} /> },
  { key: "dresses", label: "Dresses", match: ["dress", "gown", "lehenga", "saree", "sari"], Icon: DressIcon },
  { key: "tshirts", label: "T-shirts", match: ["t-shirt", "tshirt", "tee", "top", "shirt"], Icon: ({ className }) => <Shirt className={className} strokeWidth={1.6} /> },
  { key: "denim", label: "Denim", match: ["denim", "jean"], Icon: JeansIcon },
  { key: "jackets", label: "Jackets", match: ["jacket", "blazer", "sherwani"], Icon: JacketIcon },
  { key: "coats", label: "Coats", match: ["coat", "overcoat"], Icon: CoatIcon },
  { key: "shoes", label: "Shoes", match: ["shoe", "sneaker", "footwear", "heel"], Icon: ({ className }) => <Footprints className={className} strokeWidth={1.6} /> },
];

const PILL_LABELS = [
  "Women Gallery",
  "Children Fashion",
  "Men's Fashion",
  "Women's Fashion",
];

const PILL_GRADIENTS = [
  "from-[oklch(0.74_0.15_28)] to-[oklch(0.68_0.17_18)]",
  "from-[oklch(0.72_0.19_5)] to-[oklch(0.62_0.21_350)]",
  "from-[oklch(0.72_0.16_22)] to-[oklch(0.66_0.19_10)]",
  "from-[oklch(0.68_0.19_5)] to-[oklch(0.60_0.20_345)]",
];

export function ShopGallery() {
  const { data: categories = [] } = useQuery(categoriesOptions());
  const { data: products = [] } = useQuery(productsOptions({ limit: 12 }));
  const [filter, setFilter] = useState<FilterKey>("all");
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const addToCart = useCart((s) => s.add);

  const pillTiles = useMemo(() => {
    const base = PILL_LABELS.map((label, i) => {
      const cat = categories[i] as Category | undefined;
      return {
        label: cat?.name ?? label,
        image: cat?.image ?? undefined,
        categoryId: cat?.id,
        gradient: PILL_GRADIENTS[i % PILL_GRADIENTS.length],
      };
    });
    return base;
  }, [categories]);

  const categoryById = useMemo(() => {
    const m = new Map<string, Category>();
    for (const c of categories) m.set(c.id, c);
    return m;
  }, [categories]);

  const filtered = useMemo(() => {
    if (filter === "all") return products.slice(0, 8);
    const spec = FILTERS.find((f) => f.key === filter)!;
    const matched = products.filter((p) => {
      const catName = p.category_id ? categoryById.get(p.category_id)?.name ?? "" : "";
      const haystack = `${p.title} ${catName}`.toLowerCase();
      return spec.match.some((m) => haystack.includes(m));
    });
    return (matched.length ? matched : products).slice(0, 8);
  }, [filter, products, categoryById]);

  // Middle-ish card is highlighted like the reference
  const highlightId = filtered[1]?.id ?? filtered[0]?.id;
  const activeId = activeCard ?? highlightId;

  const onAddToCart = (p: Product) => {
    addToCart({
      productId: p.id,
      title: p.title,
      image: productImage(p),
      price: p.price,
      quantity: 1,
    });
  };

  if (products.length === 0 && categories.length === 0) return null;

  return (
    <section className="relative w-full bg-blush-soft py-14 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        {/* Pill category banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillTiles.map((tile, i) => (
            <Reveal key={`${tile.label}-${i}`} delay={i}>
              <Link
                to="/shop"
                search={tile.categoryId ? { category: tile.categoryId } : {}}
                className={`group relative flex items-center gap-3 rounded-full overflow-hidden pl-2 pr-4 md:pr-5 h-20 md:h-24 bg-gradient-to-r ${tile.gradient} text-cream shadow-[0_10px_30px_-15px_rgba(220,50,80,0.45)] transition-transform duration-500 hover:-translate-y-0.5`}
              >
                <div className="relative h-16 md:h-20 w-16 md:w-20 shrink-0 rounded-full overflow-hidden ring-2 ring-cream/40 bg-cream/20">
                  {tile.image ? (
                    <img
                      src={tile.image}
                      alt={tile.label}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-white/40 to-transparent" />
                  )}
                </div>
                <div className="flex-1 min-w-0 font-display text-lg md:text-xl leading-[1.05] pr-2">
                  {tile.label.split(" ").map((w, wi, arr) => (
                    <span key={wi} className="block truncate">
                      {w}
                      {wi < arr.length - 1 && arr.length > 2 ? "" : ""}
                    </span>
                  ))}
                </div>
                <span className="ml-auto grid place-items-center h-9 w-9 rounded-full bg-cream/15 text-cream transition-transform duration-500 group-hover:translate-x-1 group-hover:bg-cream/25">
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Icon filter row */}
        <div className="mt-10 md:mt-14 -mx-4 md:mx-0 overflow-x-auto no-scrollbar">
          <div className="flex items-end justify-start md:justify-center gap-6 md:gap-12 px-4 md:px-0 min-w-max">
            {FILTERS.map((f) => {
              const isActive = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`group flex flex-col items-center gap-2 py-3 px-4 rounded-2xl transition-colors ${
                    isActive ? "bg-blush" : "bg-transparent hover:bg-blush/60"
                  }`}
                >
                  <f.Icon className={`h-9 w-9 ${isActive ? "text-rose" : "text-ink/80"}`} />
                  <span
                    className={`text-xs md:text-sm font-medium tracking-wide ${
                      isActive ? "text-rose" : "text-ink/80"
                    }`}
                  >
                    {f.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product grid */}
        <div className="mt-8 md:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => {
              const isActive = p.id === activeId;
              const img = productImage(p);
              const showHot = i === 1 || i === 4;
              const showNew = i === 1 || i === 2;
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setActiveCard(p.id)}
                  onMouseLeave={() => setActiveCard(null)}
                  className={`group relative rounded-3xl bg-cream overflow-hidden transition-shadow duration-500 ${
                    isActive
                      ? "ring-2 ring-rose shadow-[0_25px_60px_-30px_rgba(220,50,80,0.55)]"
                      : "ring-1 ring-ink/5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.15)]"
                  }`}
                >
                  <Link to="/product/$id" params={{ id: p.id }} className="block">
                    <div className="relative aspect-[4/5] bg-blush overflow-hidden">
                      {/* badges */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                        {showHot && (
                          <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-rose text-cream shadow-sm">
                            Hot
                          </span>
                        )}
                        {showNew && (
                          <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-mint text-ink shadow-sm">
                            New
                          </span>
                        )}
                      </div>
                      {img ? (
                        <img
                          src={img}
                          alt={p.title}
                          className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                          loading="lazy"
                          draggable={false}
                        />
                      ) : (
                        <div className="h-full w-full bg-blush" />
                      )}
                    </div>
                  </Link>
                  <div className="px-4 pt-3 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-ink truncate">
                          {p.title}
                        </div>
                        <div className="mt-1 text-rose font-semibold">
                          {formatPrice(p.price)}
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Save to wishlist"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="shrink-0 grid place-items-center h-8 w-8 rounded-full text-ink/50 hover:text-rose transition-colors"
                      >
                        <Heart className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isActive ? "max-h-16 opacity-100 mt-3" : "max-h-0 opacity-0"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onAddToCart(p);
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-rose text-cream py-2.5 text-sm font-medium hover:brightness-105 active:scale-[0.99] transition"
                      >
                        <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}