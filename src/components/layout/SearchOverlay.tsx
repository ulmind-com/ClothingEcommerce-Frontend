import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api/client";
import type { Product } from "@/types/api";
import { Link } from "@tanstack/react-router";
import { productImage } from "@/lib/utils/product";
import { formatPrice } from "@/lib/utils/format";

interface Trending { terms: string[] }

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");

  const { data: trending } = useQuery({
    queryKey: ["search", "trending"],
    queryFn: () => get<Trending>("/search/trending"),
    enabled: open,
  });

  const { data: results = [], isFetching } = useQuery({
    queryKey: ["search", "live", q],
    queryFn: () => get<Product[]>("/search", { q, limit: 6 }),
    enabled: open && q.trim().length > 1,
  });

  useEffect(() => {
    if (!open) setQ("");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-cream/95 backdrop-blur-md text-ink"
        >
          <div className="mx-auto max-w-[1200px] px-6 md:px-10 pt-24 pb-16">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Search</span>
              <button aria-label="Close" onClick={onClose} className="p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex items-center gap-4 border-b border-ink/30 pb-4">
              <Search className="h-5 w-5 text-warm-gray" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search dresses, brands, occasions…"
                className="w-full bg-transparent font-display text-3xl md:text-5xl placeholder:text-warm-gray/70 focus:outline-none"
              />
            </div>

            <div className="mt-10 grid gap-10 md:grid-cols-3">
              <div>
                <div className="eyebrow mb-4">Trending</div>
                <ul className="space-y-2">
                  {(trending?.terms ?? [
                    "Silk",
                    "Occasion",
                    "Linen",
                    "New Arrivals",
                  ]).slice(0, 8).map((t) => (
                    <li key={t}>
                      <button
                        onClick={() => setQ(t)}
                        className="text-lg hover:text-champagne transition-colors"
                      >
                        {t}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-2">
                <div className="eyebrow mb-4">
                  {q.length > 1
                    ? isFetching
                      ? "Searching…"
                      : `Results (${results.length})`
                    : "Suggestions"}
                </div>
                {q.length > 1 && results.length === 0 && !isFetching && (
                  <p className="text-warm-gray text-sm">Nothing found.</p>
                )}
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        to="/product/$id"
                        params={{ id: p.id }}
                        onClick={onClose}
                        className="group block"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-secondary">
                          {productImage(p) && (
                            <img
                              src={productImage(p)}
                              alt={p.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          )}
                        </div>
                        <div className="mt-3 text-sm truncate">{p.title}</div>
                        <div className="text-xs text-warm-gray">
                          {formatPrice(p.price)}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}