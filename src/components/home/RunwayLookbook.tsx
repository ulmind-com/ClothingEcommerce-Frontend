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
// Bottom-aligned runway. All figures share the same ground line; scale +
// transform-origin: bottom makes them stand together like the reference.
const STAGE_SLOTS = [
  { offset: -3, x: "2%",  scale: 0.45, opacity: 0.22, blur: 22, saturate: 0.2, z: 1 },
  { offset: -2, x: "12%", scale: 0.6,  opacity: 0.4,  blur: 14, saturate: 0.35, z: 2 },
  { offset: -1, x: "26%", scale: 0.8,  opacity: 0.7,  blur: 6,  saturate: 0.6, z: 3 },
  { offset:  0, x: "50%", scale: 1,    opacity: 1,    blur: 0,  saturate: 1,   z: 8 },
  { offset:  1, x: "84%", scale: 0.85, opacity: 0.75, blur: 4,  saturate: 0.7, z: 2 },
] as const;

const FIGURE_WIDTH = 320;   // base width of the sharp centered look
const FIGURE_HEIGHT = 620;  // base height of the sharp centered look

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
  const stagedLooks = STAGE_SLOTS.map((slot) => ({
    slot,
    product: looks[(index + slot.offset + looks.length) % looks.length],
  }));
  const shopTheLook = [1, 2].map((o) => looks[(index + o) % looks.length]);
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
      className="relative w-full bg-secondary/60 silk-grain overflow-hidden min-h-[780px] md:min-h-[880px] py-12 md:py-16"
      aria-label="Runway lookbook"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-ink/10" aria-hidden />
      {/* Top strip */}
      <div className="mx-auto max-w-[1500px] px-5 md:px-10 flex items-center justify-between">
        <div className="eyebrow text-ink/70">Maison Runway</div>
        <div className="hidden md:flex items-center gap-8 eyebrow text-ink/40" aria-hidden>
          <span className="text-ink/80">Runway</span>
          <span>The Maison</span>
          <span>Lookbook</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10 mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-12 gap-7 md:gap-5 items-stretch">
        {/* LEFT */}
        <div className="md:col-span-3 flex flex-col justify-between min-h-[200px] md:min-h-[660px] relative z-20">
          <div>
            <div className="eyebrow text-ink/70 mb-4">Autumn / Winter 26</div>
            <p className="text-sm text-warm-gray leading-relaxed max-w-[18rem]">
              Picture-perfect and hand-finished. Each look opens the season&apos;s
              atelier in miniature — the cut, the cloth, the finishings.
            </p>
          </div>
          <div className="mt-10 md:mt-0">
            <div className="relative h-[92px] md:h-[110px] overflow-visible">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={lookNumber}
                  initial={{ y: reduce ? 0 : 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: reduce ? 0 : -40, opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-[54px] md:text-[68px] xl:text-[78px] leading-none text-ink whitespace-nowrap"
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
          <div className="relative h-[500px] md:h-[660px] overflow-hidden">
            {/* pagination badge */}
            <div className="absolute top-3 right-3 z-30 eyebrow text-ink/50">
              {lookNumber} <span className="text-ink/25">/ {totalNumber}</span>
            </div>

            {/* staged runway composition */}
            <div className="absolute inset-0">
              <AnimatePresence initial={false} mode="popLayout">
                {stagedLooks.map(({ product: p, slot }) => {
                  const isActive = slot.offset === 0;
                  const isIncoming = slot.offset === 1;
                  const img = productImage(p);
                  return (
                    <motion.div
                      key={`${slot.offset}-${p.id}`}
                      initial={{
                        left: isIncoming ? "96%" : slot.x,
                        opacity: 0,
                        scale: slot.scale * 0.96,
                        filter: reduce
                          ? "none"
                          : `blur(${slot.blur + 4}px) saturate(${slot.saturate})`,
                      }}
                      animate={{
                        left: slot.x,
                        opacity: slot.opacity,
                        scale: slot.scale,
                        filter: reduce
                          ? "none"
                          : `blur(${slot.blur}px) saturate(${slot.saturate})`,
                      }}
                      exit={{
                        left: slot.offset < 0 ? "-4%" : "48%",
                        opacity: 0,
                        scale: slot.scale * 0.9,
                        filter: reduce ? "none" : "blur(20px) saturate(0.2)",
                      }}
                      transition={{ type: "spring", stiffness: 112, damping: 24, mass: 0.9 }}
                      className="absolute bottom-0 will-change-transform"
                      style={{
                        width: FIGURE_WIDTH,
                        height: FIGURE_HEIGHT,
                        marginLeft: -FIGURE_WIDTH / 2,
                        transformOrigin: "bottom center",
                        zIndex: slot.z,
                      }}
                    >
                      <Link
                        to="/product/$id"
                        params={{ id: p.id }}
                        aria-label={p.title}
                        className="block relative h-full w-full"
                        tabIndex={isActive ? 0 : -1}
                      >
                        {img ? (
                          <img
                            src={img}
                            alt={p.title}
                            className="h-full w-full object-contain object-bottom select-none"
                            style={{ mixBlendMode: "multiply" }}
                            draggable={false}
                            loading={isActive ? "eager" : "lazy"}
                          />
                        ) : null}
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* prev / next */}
            <button
              type="button"
              aria-label="Previous look"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 grid place-items-center h-10 w-10 rounded-full border border-ink/25 text-ink/70 bg-cream/75 backdrop-blur-sm hover:bg-cream hover:text-ink hover:border-ink transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next look"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 grid place-items-center h-10 w-10 rounded-full border border-ink/25 text-ink/70 bg-cream/75 backdrop-blur-sm hover:bg-cream hover:text-ink hover:border-ink transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* RIGHT — Shop the Look */}
        <div className="md:col-span-3 relative z-20">
          <div className="flex flex-col gap-4 md:pt-12">
            <AnimatePresence mode="popLayout" initial={false}>
              {shopTheLook.map((p, i) => (
                <motion.div
                  key={`${index}-${p.id}`}
                  initial={{ opacity: 0, y: reduce ? 0 : 28, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -28, scale: 0.98 }}
                  transition={{ duration: 0.62, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  layout
                >
                  <ShopCard product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShopCard({ product }: { product: Product }) {
  const img = productImage(product);
  return (
    <div className="group relative bg-cream border border-border/70 shadow-[0_24px_60px_-44px_color-mix(in_oklab,var(--ink)_45%,transparent)]">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block"
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