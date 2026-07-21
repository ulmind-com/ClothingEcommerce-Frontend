import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ProductCard } from "@/components/product/ProductCard";
import {
  categoriesOptions,
  productsInfiniteOptions,
  settingsOptions,
} from "@/lib/api/queries";
import { productInStock } from "@/lib/utils/product";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  sort: z
    .enum(["newest", "price_asc", "price_desc", "discount"])
    .optional()
    .default("newest"),
  inStock: z.boolean().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search: { category, q } }) => ({ category, q }),
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesOptions()),
      context.queryClient.ensureQueryData(settingsOptions()),
      context.queryClient.ensureInfiniteQueryData(
        productsInfiniteOptions({
          category_id: deps.category,
          q: deps.q,
          pageSize: 24,
        }),
      ),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Shop — Maison" },
      { name: "description", content: "The full Maison collection — new arrivals, editorial pieces, and archive." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: categories = [] } = useQuery(categoriesOptions());
  const { data: settings } = useQuery(settingsOptions());
  const currency = settings?.currency ?? "₹";

  const activeCat = categories.find((c) => c.id === search.category);

  const infinite = useInfiniteQuery(
    productsInfiniteOptions({
      category_id: search.category,
      q: search.q,
      pageSize: 24,
    }),
  );

  const flat = useMemo(() => {
    const all = infinite.data?.pages.flat() ?? [];
    let arr = search.inStock ? all.filter(productInStock) : all;
    arr = [...arr];
    switch (search.sort) {
      case "price_asc": arr.sort((a, b) => a.price - b.price); break;
      case "price_desc": arr.sort((a, b) => b.price - a.price); break;
      case "discount": arr.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp); break;
      default: break;
    }
    return arr;
  }, [infinite.data, search.sort, search.inStock]);

  const roots = categories.filter((c) => !c.parent_id);

  return (
    <SiteChrome>
      <div className="pt-28 md:pt-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 md:mb-16"
          >
            <div className="eyebrow mb-4">The Collection</div>
            <h1 className="font-display text-5xl md:text-7xl">
              {activeCat?.name ?? (search.q ? `“${search.q}”` : "All Pieces")}
            </h1>
          </motion.div>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigate({ to: ".", search: (p) => ({ ...p, category: undefined }) })}
                className={`eyebrow px-3 py-1.5 transition-colors ${!search.category ? "bg-ink text-cream" : "hover:text-champagne"}`}
              >
                All
              </button>
              {roots.map((c) => (
                <button
                  key={c.id}
                  onClick={() =>
                    navigate({ to: ".", search: (p) => ({ ...p, category: c.id }) })
                  }
                  className={`eyebrow px-3 py-1.5 transition-colors ${search.category === c.id ? "bg-ink text-cream" : "hover:text-champagne"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <label className="eyebrow flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!search.inStock}
                  onChange={(e) =>
                    navigate({
                      to: ".",
                      search: (p) => ({
                        ...p,
                        inStock: e.target.checked || undefined,
                      }),
                    })
                  }
                  className="accent-ink"
                />
                In stock
              </label>
              <select
                value={search.sort}
                onChange={(e) =>
                  navigate({
                    to: ".",
                    search: (p) => ({
                      ...p,
                      sort: e.target.value as typeof search.sort,
                    }),
                  })
                }
                className="eyebrow bg-transparent border-b border-border py-1 focus:outline-none focus:border-ink"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
                <option value="discount">Discount</option>
              </select>
            </div>
          </div>

          {infinite.isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-14">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-secondary" />
                  <div className="mt-4 h-3 w-1/2 bg-secondary" />
                  <div className="mt-2 h-3 w-1/3 bg-secondary" />
                </div>
              ))}
            </div>
          ) : flat.length === 0 ? (
            <div className="py-24 text-center text-warm-gray">
              <div className="eyebrow mb-3">No results</div>
              <p>Try another category or search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-14">
              {flat.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} currency={currency} />
              ))}
            </div>
          )}

          {infinite.hasNextPage && (
            <div className="mt-16 flex justify-center">
              <button
                onClick={() => infinite.fetchNextPage()}
                disabled={infinite.isFetchingNextPage}
                className="eyebrow border-b border-ink hover:text-champagne hover:border-champagne pb-1 disabled:opacity-50"
              >
                {infinite.isFetchingNextPage ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </div>
      </div>
    </SiteChrome>
  );
}