import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Minus, Instagram, Facebook, Twitter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsOptions } from "@/lib/api/queries";
import { productImage } from "@/lib/utils/product";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/types/api";

const AUTOPLAY_MS = 7000;
const EXPAND_MS = 5200;
const HALO_PALETTE = ["#D7E8B8", "#F4D6D6", "#E5DCC8", "#CDE3DA", "#EADAF0", "#F1E0C7"];

function hasImage(p: Product) {
  return !!productImage(p);
}

export function EditorialSpotlight() {
  const { data: all = [] } = useQuery(productsOptions({ limit: 12 }));
  const items = useMemo(() => all.filter(hasImage).slice(0, 5), [all]);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [altIdx, setAltIdx] = useState(0);
  const reduce = useReducedMotion();

  // Autoplay: rotate products; also auto-collapse expanded after EXPAND_MS
  useEffect(() => {
    if (reduce || paused || items.length < 2) return;
    const duration = expanded ? EXPAND_MS : AUTOPLAY_MS;
    const id = window.setTimeout(() => {
      if (expanded) {
        setExpanded(false);
        setAltIdx(0);
      } else {
        setIndex((i) => (i + 1) % items.length);
      }
    }, duration);
    return () => window.clearTimeout(id);
  }, [reduce, paused, items.length, expanded, index]);

  useEffect(() => {
    setAltIdx(0);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % Math.max(items.length, 1));
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1));
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length]);

  if (items.length === 0) return null;

  const active = items[index];
  const cross = [items[(index + 1) % items.length], items[(index + 2) % items.length]];
  const sister = items[(index + 3) % items.length];
  const halo = active.colors?.[0]?.hex || HALO_PALETTE[index % HALO_PALETTE.length];
  const modelImg = productImage(active, expanded ? altIdx : 0) || productImage(active);
  const alts = Array.from({ length: 4 }, (_, i) => productImage(active, i) || productImage(active));
  const sizes =
    active.colors?.[0]?.sizes?.map((s) => s.size).slice(0, 4) ??
    active.sizes?.slice(0, 4) ??
    ["S", "M", "L"];

  const lookNumber = String(index + 1).padStart(2, "0");
  const totalNumber = String(items.length).padStart(2, "0");

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative w-full bg-cream text-ink overflow-hidden py-16 md:py-24"
      aria-label="Editorial spotlight"
    >
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="eyebrow text-ink/70">Signature Piece</div>
          <div className="hidden md:flex items-center gap-6 eyebrow text-ink/40">
            <button onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)} className="grid place-items-center h-9 w-9 rounded-full border border-ink/20 hover:border-ink hover:text-ink transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setIndex((i) => (i + 1) % items.length)} className="grid place-items-center h-9 w-9 rounded-full border border-ink/20 hover:border-ink hover:text-ink transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 min-h-[620px] md:min-h-[720px]">
          {/* LEFT COLUMN */}
          <div className="md:col-span-4 relative flex flex-col justify-between z-10">
            <AnimatePresence mode="wait">
              {!expanded ? (
                <motion.div
                  key="title-only"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className="font-display text-5xl md:text-6xl xl:text-7xl leading-[0.95] uppercase tracking-tight">
                    {active.title}
                  </h2>
                </motion.div>
              ) : (
                <motion.div
                  key="title-meta"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className="font-display text-4xl md:text-5xl leading-[0.95] uppercase tracking-tight">
                    {active.title}
                  </h2>
                  <div className="mt-4 text-3xl md:text-4xl font-display">{formatPrice(active.price)}</div>
                  <p className="mt-4 text-sm text-warm-gray leading-relaxed max-w-xs">
                    {active.description?.slice(0, 130) ||
                      "Cut and finished by hand in our atelier. A quiet study in modern couture."}
                  </p>
                  <div className="mt-6">
                    <div className="eyebrow text-ink/60 mb-3">Select Size</div>
                    <div className="flex items-center gap-2">
                      {sizes.map((s) => (
                        <button
                          key={s}
                          className="grid place-items-center h-9 w-9 rounded-full border border-ink/25 text-xs uppercase hover:border-ink hover:bg-ink hover:text-cream transition-all"
                        >
                          {s}
                        </button>
                      ))}
                      <span className="ml-3 eyebrow text-[10px] underline decoration-champagne underline-offset-4 text-ink/60">Size Guide</span>
                    </div>
                  </div>
                  {/* thumbnail row */}
                  <div className="mt-8 flex items-center gap-3">
                    {alts.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setAltIdx(i)}
                        className={`relative h-16 w-14 overflow-hidden border transition-all ${
                          altIdx === i ? "border-ink" : "border-ink/15 hover:border-ink/40"
                        }`}
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                    <button className="grid place-items-center h-16 w-8 text-ink/50 hover:text-ink transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* socials pinned bottom */}
            <div className="flex items-center gap-3 text-ink/50 mt-10">
              <a href="#" className="grid place-items-center h-8 w-8 rounded-full border border-ink/15 hover:text-ink hover:border-ink transition-colors">
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a href="#" className="grid place-items-center h-8 w-8 rounded-full border border-ink/15 hover:text-ink hover:border-ink transition-colors">
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a href="#" className="grid place-items-center h-8 w-8 rounded-full border border-ink/15 hover:text-ink hover:border-ink transition-colors">
                <Twitter className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* CENTER STAGE */}
          <div className="md:col-span-5 relative">
            <div className="relative h-[500px] md:h-[680px] flex items-end justify-center">
              {/* halo */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: halo }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={
                  reduce
                    ? { scale: 1, opacity: 0.6, width: 460, height: 460 }
                    : {
                        scale: expanded ? 1.05 : [1, 1.03, 1],
                        opacity: 0.55,
                        width: 460,
                        height: 460,
                        rotate: [0, 360],
                      }
                }
                transition={{
                  scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 60, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 1 },
                }}
                aria-hidden
              />
              <SignatureMotifs />

              {/* Model */}
              <div className="relative z-10 h-full w-full">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`${active.id}-${altIdx}`}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex items-end justify-center"
                  >
                    <img
                      src={modelImg}
                      alt={active.title}
                      draggable={false}
                      className="h-full w-auto object-contain object-bottom select-none"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ADD / minus center button */}
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? "Close details" : "Show details"}
                className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 grid place-items-center h-16 w-16 rounded-full bg-[hsl(348,72%,52%)] text-cream shadow-[0_18px_50px_-10px_rgba(200,40,60,0.55)] transition-transform hover:scale-105"
              >
                <AnimatePresence mode="wait">
                  {expanded ? (
                    <motion.span key="m" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <Minus className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span key="a" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }} className="eyebrow text-[10px] tracking-[0.2em]">
                      ADD
                    </motion.span>
                  )}
                </AnimatePresence>
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-cream/60"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </button>

              {/* Cross-sell floating cards — only in collapsed state */}
              <AnimatePresence>
                {!expanded && (
                  <>
                    <motion.div
                      key="cs-1"
                      initial={{ opacity: 0, x: 30, y: -10 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-2 top-[22%] z-20"
                    >
                      <CrossCard product={cross[0]} />
                    </motion.div>
                    <motion.div
                      key="cs-2"
                      initial={{ opacity: 0, x: 30, y: 10 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-4 top-[46%] z-20"
                    >
                      <CrossCard product={cross[1]} />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="md:col-span-3 relative flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {!expanded ? (
                <motion.div
                  key="sister"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-4 h-full"
                >
                  <div className="eyebrow font-display text-4xl md:text-5xl text-ink/15 tracking-[0.2em]" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                    AW · 2026
                  </div>
                  <div className="flex-1 relative overflow-hidden aspect-[3/5] bg-ink/5">
                    {sister && productImage(sister) ? (
                      <img
                        src={productImage(sister)}
                        alt={sister.title}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="counter"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-end h-full justify-center pr-2"
                >
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={lookNumber}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -30, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="font-display text-6xl md:text-7xl text-ink"
                    >
                      {lookNumber}
                    </motion.div>
                  </AnimatePresence>
                  <div className="mt-4 h-32 w-px bg-ink/15 overflow-hidden">
                    <motion.div
                      key={`bar-${index}`}
                      initial={{ height: "0%" }}
                      animate={{ height: "100%" }}
                      transition={{ duration: EXPAND_MS / 1000, ease: "linear" }}
                      className="w-full bg-champagne origin-top"
                    />
                  </div>
                  <div className="mt-4 font-display text-2xl text-ink/40">{totalNumber}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="hidden md:flex justify-end mt-6">
              <button className="eyebrow text-ink/60 hover:text-ink transition-colors inline-flex items-center gap-2">
                Size Guide <span className="text-champagne">˄</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CrossCard({ product }: { product?: Product }) {
  if (!product) return null;
  const img = productImage(product);
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="flex items-center gap-3 bg-white rounded-xl p-2.5 pr-4 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.25)] border border-ink/5 hover:shadow-[0_18px_50px_-15px_rgba(0,0,0,0.35)] transition-shadow w-[190px]"
    >
      <div className="h-14 w-14 rounded-lg overflow-hidden bg-cream shrink-0">
        {img ? <img src={img} alt={product.title} className="h-full w-full object-cover" /> : null}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-medium text-ink truncate leading-tight">{product.title}</div>
        <div className="mt-1 text-xs text-ink/60">{formatPrice(product.price)}</div>
      </div>
    </Link>
  );
}

function SignatureMotifs() {
  const items = [
    { x: "8%", y: "14%", d: 0, el: <Squiggle /> },
    { x: "82%", y: "10%", d: 0.6, el: <Sparkle /> },
    { x: "12%", y: "72%", d: 1.1, el: <Dots /> },
    { x: "88%", y: "78%", d: 0.3, el: <ArcSwoop /> },
    { x: "4%", y: "42%", d: 1.4, el: <Sparkle small /> },
    { x: "92%", y: "44%", d: 0.9, el: <Ring /> },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {items.map((m, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: m.x, top: m.y }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0.5, 1, 0.6], y: [0, -8, 0], rotate: [0, 6, -3, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, delay: m.d, ease: "easeInOut" }}
        >
          {m.el}
        </motion.div>
      ))}
    </div>
  );
}

function Squiggle() {
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
      <path d="M2 10 Q 10 2, 18 10 T 34 10 T 50 10 T 66 10" stroke="hsl(45,60%,55%)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function Sparkle({ small }: { small?: boolean }) {
  const s = small ? 16 : 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" fill="hsl(348,72%,52%)" />
    </svg>
  );
}
function Dots() {
  return (
    <svg width="50" height="14" viewBox="0 0 50 14" fill="none">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={5 + i * 8} cy="7" r="1.6" fill="hsl(45,60%,55%)" />
      ))}
    </svg>
  );
}
function ArcSwoop() {
  return (
    <svg width="70" height="40" viewBox="0 0 70 40" fill="none">
      <path d="M2 30 Q 35 2, 68 30" stroke="hsl(160,30%,45%)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M60 22 L 68 30 L 60 34" stroke="hsl(160,30%,45%)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Ring() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="10" stroke="hsl(348,72%,52%)" strokeWidth="1.3" fill="none" />
    </svg>
  );
}