import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsOptions } from "@/lib/api/queries";
import { productImage } from "@/lib/utils/product";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/types/api";

const AUTOPLAY_MS = 3200;
// Reference (Marc Jacobs SS19): active look anchored right, trailing blurred
// crowd receding to the left, nothing entering from the right.
const STAGE_SLOTS = [
  { offset: -4, x: "6%",  scale: 0.35, opacity: 0.18, blur: 26, saturate: 0.15, z: 1 },
  { offset: -3, x: "14%", scale: 0.45, opacity: 0.28, blur: 18, saturate: 0.2,  z: 2 },
  { offset: -2, x: "26%", scale: 0.6,  opacity: 0.45, blur: 10, saturate: 0.35, z: 3 },
  { offset: -1, x: "44%", scale: 0.85, opacity: 0.92, blur: 2,  saturate: 0.85, z: 5 },
  { offset:  0, x: "72%", scale: 1,    opacity: 1,    blur: 0,  saturate: 1,    z: 8 },
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
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || looks.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % looks.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduce, looks.length]);

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
      className="relative w-full bg-white overflow-hidden min-h-[780px] md:min-h-[880px] py-12 md:py-16"
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
                animate={{ width: reduce ? "0%" : "100%" }}
                transition={{ duration: reduce ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }}
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
                  const img = productImage(p);
                  return (
                    <motion.div
                      key={`${slot.offset}-${p.id}`}
                      initial={{
                        left: slot.offset === -4 ? "-6%" : slot.x,
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
                        left: "-8%",
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
    <div className="group relative border border-ink/15 bg-white">
      <button
        type="button"
        aria-label="Save to wishlist"
        className="absolute left-3 top-3 z-10 grid place-items-center h-7 w-7 rounded-full text-ink/60 hover:text-ink transition-colors"
        onClick={(e) => e.preventDefault()}
      >
        <Heart className="h-4 w-4" strokeWidth={1.25} />
      </button>
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-white">
          {img ? (
            <img
              src={img}
              alt={product.title}
              className="h-full w-full object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              draggable={false}
            />
          ) : null}
        </div>
        <div className="flex items-start justify-between gap-3 px-3 py-3 border-t border-ink/10">
          <div className="min-w-0">
            <div className="eyebrow text-[10px] tracking-[0.18em] text-ink/70 truncate uppercase">{product.title}</div>
            <div className="mt-1 text-sm text-ink/70">{formatPrice(product.price)}</div>
          </div>
          <span className="mt-0.5 grid place-items-center h-6 w-6 text-ink/50 group-hover:text-ink transition-colors">
            <Plus className="h-4 w-4" strokeWidth={1.25} />
          </span>
        </div>
      </Link>
    </div>
  );
}