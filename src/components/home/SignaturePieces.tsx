import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { productsOptions } from "@/lib/api/queries";
import { productImage } from "@/lib/utils/product";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/types/api";
import { MaskReveal } from "@/lib/motion/Reveal";
import { Squiggle, Sparkle, Arc, Dot, Ring } from "./signature-motifs";

const EASE = [0.22, 1, 0.36, 1] as const;
const AUTOPLAY_MS = 6500;
const DEFAULT_SIZES = ["S", "M", "L"];

function pickImages(p: Product): string[] {
  const arr = [
    ...(p.images ?? []),
    ...((p.colors ?? []).flatMap((c) => c.images ?? [])),
  ].filter(Boolean);
  return Array.from(new Set(arr));
}

function haloColor(p: Product): string {
  const hex = p.colors?.[0]?.hex;
  if (hex && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return hex;
  return "hsl(var(--champagne, 40 45% 70%))";
}

export function SignaturePieces() {
  const { data: all = [] } = useQuery(productsOptions({ limit: 8 }));
  const products = useMemo(
    () => all.filter((p) => pickImages(p).length > 0).slice(0, 5),
    [all],
  );

  const [index, setIndex] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => setImgIdx(0), [index]);

  useEffect(() => {
    if (reduce || paused || products.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % products.length),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(id);
  }, [reduce, paused, products.length]);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const haloX = useTransform(sx, [-1, 1], [-14, 14]);
  const haloY = useTransform(sy, [-1, 1], [-10, 10]);
  const motifX = useTransform(sx, [-1, 1], [-24, 24]);
  const motifY = useTransform(sy, [-1, 1], [-18, 18]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const go = (dir: number) =>
    setIndex((i) => (i + dir + products.length) % products.length);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.matches(":hover") && document.activeElement !== el) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [products.length]);

  if (products.length === 0) return null;

  const active = products[index]!;
  const images = pickImages(active);
  const heroImg = images[imgIdx] ?? productImage(active);
  const cross = [
    products[(index + 1) % products.length]!,
    products[(index + 2) % products.length]!,
  ];
  const sizes =
    (active.sizes && active.sizes.length > 0 ? active.sizes : DEFAULT_SIZES).slice(0, 5);
  const halo = haloColor(active);

  return (
    <section
      ref={sectionRef}
      tabIndex={-1}
      className="relative overflow-hidden bg-secondary/40 py-24 md:py-32 outline-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseMove={onMouseMove}
      aria-label="The Signature Edit"
    >
      {/* Heading */}
      <div className="mx-auto max-w-[900px] px-6 text-center mb-16 md:mb-20">
        <div className="eyebrow mb-4">The Signature Edit</div>
        <MaskReveal>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">
            Pieces to be remembered in
          </h2>
        </MaskReveal>
        <p className="mt-6 font-display italic text-warm-gray text-lg md:text-xl leading-relaxed">
          A rotating spotlight on the season's most collectible silhouettes.
        </p>
      </div>

      {/* Stage */}
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 min-h-[720px] md:min-h-[780px]">
        {/* Vertical season label */}
        <div className="pointer-events-none absolute right-2 md:right-8 top-24 hidden md:block">
          <div
            className="font-display text-[7rem] lg:text-[9rem] leading-none tracking-[-0.04em] text-ink/5 select-none"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            AW · 26
          </div>
        </div>

        {/* Decorative motifs */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[1] text-champagne"
          style={{ x: motifX, y: motifY }}
          aria-hidden
        >
          <Squiggle className="absolute left-[6%] top-[8%] w-16 opacity-70" />
          <Sparkle className="absolute left-[42%] top-[4%] w-5 opacity-60" />
          <Arc className="absolute right-[10%] top-[14%] w-14 opacity-60 text-ink/40" />
          <Ring className="absolute left-[10%] bottom-[18%] w-10 opacity-50 text-ink/30" />
          <Squiggle className="absolute right-[16%] bottom-[10%] w-20 opacity-60" />
          <Dot className="absolute left-[38%] bottom-[8%] h-2 w-2 bg-champagne" />
          <Dot className="absolute right-[36%] top-[22%] h-1.5 w-1.5 bg-ink/40" />
        </motion.div>

        <div className="relative z-[2] grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          {/* LEFT — copy */}
          <div className="md:col-span-4 order-2 md:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`copy-${active.id}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <div className="eyebrow mb-4">N° {String(index + 1).padStart(2, "0")}</div>
                <h3 className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.01em]">
                  {active.title}
                </h3>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="font-display text-2xl md:text-3xl">
                    {formatPrice(active.price)}
                  </span>
                  {active.mrp > active.price && (
                    <span className="text-warm-gray line-through text-sm">
                      {formatPrice(active.mrp)}
                    </span>
                  )}
                </div>
                {active.description && (
                  <p className="mt-6 text-warm-gray leading-relaxed line-clamp-3 max-w-sm">
                    {active.description}
                  </p>
                )}

                <div className="mt-8">
                  <div className="eyebrow mb-3 text-xs">Select size</div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <span
                        key={s}
                        className="grid place-items-center h-10 w-10 rounded-full border border-border text-xs tracking-[0.15em] text-ink/70 hover:border-ink hover:text-ink transition-colors cursor-default"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-10 flex items-center gap-5">
                  <Link
                    to="/product/$id"
                    params={{ id: active.id }}
                    className="group relative inline-flex items-center gap-3 rounded-full bg-ink text-cream pl-6 pr-2 py-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] hover:bg-champagne hover:text-ink transition-colors duration-500"
                  >
                    <span className="eyebrow text-xs !text-cream group-hover:!text-ink transition-colors">
                      Add to bag
                    </span>
                    <span className="grid place-items-center h-10 w-10 rounded-full bg-cream text-ink group-hover:bg-ink group-hover:text-cream transition-colors">
                      <Plus className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    to="/product/$id"
                    params={{ id: active.id }}
                    className="eyebrow text-xs relative pb-1 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-ink hover:text-champagne hover:after:bg-champagne transition-colors"
                  >
                    View piece
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CENTER — image + halo */}
          <div className="md:col-span-5 order-1 md:order-2 relative">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px]">
              {/* Halo */}
              <motion.div
                className="absolute inset-0 -z-[1]"
                style={{ x: haloX, y: haloY }}
              >
                <AnimatePresence>
                  <motion.div
                    key={`halo-${active.id}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 1.2, ease: EASE }}
                    className="absolute inset-6 rounded-full blur-2xl"
                    style={{
                      background: `radial-gradient(closest-side, ${halo}55, transparent 70%)`,
                    }}
                  />
                </AnimatePresence>
                <div
                  className="absolute inset-8 rounded-full border border-ink/5"
                  aria-hidden
                />
              </motion.div>

              {/* Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${active.id}-${imgIdx}`}
                  initial={{ opacity: 0, x: 60, scale: 1.02 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: reduce ? 1 : 1.04,
                    transition: {
                      opacity: { duration: 0.9, ease: EASE },
                      x: { duration: 0.9, ease: EASE },
                      scale: { duration: 7, ease: "linear" as const },
                    },
                  }}
                  exit={{ opacity: 0, x: -40, transition: { duration: 0.6, ease: EASE } }}
                  className="absolute inset-0"
                >
                  <img
                    src={heroImg}
                    alt={active.title}
                    className="h-full w-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.25)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-8 flex justify-center gap-3">
                {images.slice(0, 4).map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setImgIdx(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`relative h-14 w-11 overflow-hidden border transition-all duration-300 ${
                      i === imgIdx
                        ? "border-ink scale-[1.05]"
                        : "border-border/60 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — counter + nav */}
          <div className="md:col-span-3 order-3 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-8 md:gap-16">
            {/* Counter */}
            <div className="flex md:flex-col items-center md:items-end gap-4">
              <div className="font-display text-5xl md:text-6xl leading-none overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`n-${index}`}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="inline-block"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="h-px w-16 md:w-px md:h-24 bg-border relative overflow-hidden">
                <motion.div
                  key={`prog-${index}`}
                  initial={{ scaleX: 0, scaleY: 0 }}
                  animate={
                    reduce || paused
                      ? { scaleX: 1, scaleY: 1 }
                      : { scaleX: 1, scaleY: 1 }
                  }
                  transition={{
                    duration: reduce || paused ? 0 : AUTOPLAY_MS / 1000,
                    ease: "linear" as const,
                  }}
                  className="absolute inset-0 bg-ink origin-left md:origin-top"
                  style={{
                    transformOrigin: "top left",
                  }}
                />
              </div>
              <div className="font-display text-sm text-warm-gray">
                / {String(products.length).padStart(2, "0")}
              </div>
            </div>

            {/* Nav */}
            <div className="flex md:flex-col gap-3">
              <button
                aria-label="Previous piece"
                onClick={() => go(-1)}
                className="grid place-items-center h-12 w-12 rounded-full border border-border text-ink/60 hover:text-ink hover:border-ink transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                aria-label="Next piece"
                onClick={() => go(1)}
                className="grid place-items-center h-12 w-12 rounded-full border border-ink bg-ink text-cream hover:bg-champagne hover:border-champagne hover:text-ink transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating cross-sell cards */}
        <div className="pointer-events-none absolute inset-0 z-[3] hidden lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={`cross-${active.id}`}
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              className="absolute left-[46%] top-[30%]"
            >
              <CrossCard product={cross[0]!} />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={`cross2-${active.id}`}
              initial={{ opacity: 0, y: 20, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
              className="absolute left-[48%] top-[58%]"
            >
              <CrossCard product={cross[1]!} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function CrossCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="pointer-events-auto group flex items-center gap-3 rounded-xl bg-cream/95 backdrop-blur border border-border/60 p-3 pr-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] hover:shadow-[0_30px_60px_-20px_rgba(180,140,80,0.35)] hover:border-champagne/60 transition-all duration-500"
    >
      <div className="h-14 w-14 overflow-hidden rounded-lg bg-secondary shrink-0">
        <img
          src={productImage(product)}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-warm-gray truncate max-w-[140px]">
          {product.title}
        </div>
        <div className="font-display text-base">{formatPrice(product.price)}</div>
      </div>
    </Link>
  );
}