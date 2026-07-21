import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsOptions } from "@/lib/api/queries";
import { productImage } from "@/lib/utils/product";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/types/api";

const AUTOPLAY_MS = 6000;

function hasImage(p: Product) {
  return !!productImage(p);
}

export function RunwayLookbook() {
  const { data: all = [] } = useQuery(productsOptions({ limit: 12 }));
  const looks = useMemo(() => all.filter(hasImage).slice(0, 6), [all]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || paused || looks.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % looks.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduce, paused, looks.length]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement) && document.activeElement !== el) return;
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % Math.max(looks.length, 1));
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + Math.max(looks.length, 1)) % Math.max(looks.length, 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [looks.length]);

  if (looks.length === 0) return null;

  const active = looks[index];
  const shopTheLook = [1, 2, 3].map((o) => looks[(index + o) % looks.length]);
  const go = (dir: number) =>
    setIndex((i) => (i + dir + looks.length) % looks.length);

  const lookNumber = String(index + 1).padStart(2, "0");
  const totalNumber = String(looks.length).padStart(2, "0");

  return (
    <section
      ref={rootRef}
      tabIndex={-1}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative w-full bg-secondary/50 silk-grain overflow-hidden min-h-[780px] md:min-h-[880px] py-16 md:py-24"
      aria-label="Runway lookbook"
    >
      {/* Top strip */}
      <div className="mx-auto max-w-[1500px] px-6 md:px-10 flex items-center justify-between">
        <div className="eyebrow text-ink/70">The Runway</div>
        <div className="hidden md:flex items-center gap-8 eyebrow text-ink/40">
          <span className="text-ink/80">Runway</span>
          <span>The Maison</span>
          <span>Lookbook</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="relative mx-auto max-w-[1500px] px-6 md:px-10 mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 items-stretch">
        {/* LEFT */}
        <div className="md:col-span-3 flex flex-col justify-between min-h-[220px] md:min-h-[640px] relative">
          <div>
            <div className="eyebrow text-ink/70 mb-4">Autumn / Winter 26</div>
            <p className="text-sm text-warm-gray leading-relaxed max-w-xs">
              Picture-perfect and hand-finished. Each look opens the season&apos;s
              atelier in miniature — the cut, the cloth, the finishings.
            </p>
          </div>
          <div className="mt-10 md:mt-0">
            <div className="relative h-[92px] md:h-[110px] overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={lookNumber}
                  initial={{ y: reduce ? 0 : 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: reduce ? 0 : -40, opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-[64px] md:text-[92px] leading-none tracking-[-0.02em] text-ink"
                >
                  LOOK {lookNumber}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-3 h-px w-full bg-ink/10 overflow-hidden">
              <motion.div
                key={`bar-${index}`}
                initial={{ width: "0%" }}
                animate={{ width: paused || reduce ? "0%" : "100%" }}
                transition={{ duration: paused || reduce ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }}
                className="h-full bg-champagne"
              />
            </div>
            <Link
              to="/product/$id"
              params={{ id: active.id }}
              className="mt-6 inline-block eyebrow relative pb-1 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-ink hover:text-champagne hover:after:bg-champagne transition-colors"
            >
              Shop the Look
            </Link>
          </div>
        </div>

        {/* CENTER STAGE */}
        <div className="md:col-span-6 relative">
          <div className="relative h-[520px] md:h-[680px] overflow-hidden">
            {/* pagination badge */}
            <div className="absolute top-3 right-3 z-20 eyebrow text-ink/50">
              {lookNumber} <span className="text-ink/25">/ {totalNumber}</span>
            </div>

            {/* runway strip */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="flex items-end gap-6 md:gap-10 will-change-transform"
                animate={{ x: `calc(50% - ${index * (260 + 40)}px - 130px)` }}
                transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.9 }}
              >
                {looks.map((p, i) => {
                  const dist = i - index;
                  const isActive = dist === 0;
                  const blur = isActive ? 0 : Math.min(Math.abs(dist) * 6, 14);
                  return (
                    <motion.div
                      key={p.id}
                      animate={{
                        opacity: isActive ? 1 : 0.35,
                        filter: reduce ? "none" : `blur(${blur}px) saturate(${isActive ? 1 : 0.5})`,
                        scale: isActive ? 1 : 0.88,
                        y: isActive ? 0 : 20,
                      }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className="relative shrink-0"
                      style={{ width: 260 }}
                    >
                      <Link
                        to="/product/$id"
                        params={{ id: p.id }}
                        aria-label={p.title}
                        className="block relative"
                      >
                        <div className="relative w-[260px] h-[560px] md:h-[620px] overflow-hidden">
                          <img
                            src={productImage(p)}
                            alt={p.title}
                            className="h-full w-full object-cover"
                            draggable={false}
                          />
                          {isActive && (
                            <div className="absolute inset-0 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)] pointer-events-none" />
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* prev / next */}
            <button
              type="button"
              aria-label="Previous look"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 grid place-items-center h-10 w-10 rounded-full border border-ink/25 text-ink/70 bg-cream/70 backdrop-blur-sm hover:bg-cream hover:text-ink hover:border-ink transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next look"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 grid place-items-center h-10 w-10 rounded-full border border-ink/25 text-ink/70 bg-cream/70 backdrop-blur-sm hover:bg-cream hover:text-ink hover:border-ink transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* RIGHT — Shop the Look */}
        <div className="md:col-span-3 relative">
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {shopTheLook.slice(0, 2).map((p, i) => (
                <motion.div
                  key={`${index}-${p.id}`}
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -16 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ShopCard product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
            {shopTheLook[2] && (
              <motion.div
                key={`peek-${index}-${shopTheLook[2].id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.55, y: 0 }}
                transition={{ duration: 0.6, delay: 0.24 }}
                className="pointer-events-none -mt-1"
                aria-hidden
              >
                <ShopCard product={shopTheLook[2]} peek />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ShopCard({ product, peek = false }: { product: Product; peek?: boolean }) {
  const img = productImage(product);
  return (
    <div className="group relative bg-cream border border-border/60">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block"
        tabIndex={peek ? -1 : 0}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          {img ? (
            <img
              src={img}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              draggable={false}
            />
          ) : null}
        </div>
        <div className="flex items-start justify-between gap-3 p-3">
          <div className="min-w-0">
            <div className="eyebrow text-[10px] text-ink/80 truncate">{product.title}</div>
            <div className="mt-1 text-sm text-ink/80">{formatPrice(product.price)}</div>
          </div>
          <span className="mt-0.5 grid place-items-center h-7 w-7 rounded-full border border-ink/20 text-ink/60 group-hover:border-champagne group-hover:text-champagne transition-colors">
            <Plus className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </div>
  );
}