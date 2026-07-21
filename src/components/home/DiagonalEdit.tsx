import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReducedMotion, AnimatePresence, motion } from "framer-motion";
import { productsOptions } from "@/lib/api/queries";
import { productImage } from "@/lib/utils/product";
import { formatPrice } from "@/lib/utils/format";
import { DiagonalCarousel, type DiagonalCarouselItem } from "@/components/ui/DiagonalCarousel";
import { LuxLink } from "@/components/ui/LuxButton";
import { MaskReveal, Reveal } from "@/lib/motion/Reveal";

const AUTOPLAY_MS = 4000;

export function DiagonalEdit() {
  const { data: all = [] } = useQuery(productsOptions({ limit: 8 }));
  const products = useMemo(
    () => all.filter((p) => !!productImage(p)).slice(0, 8),
    [all],
  );
  const items = useMemo<DiagonalCarouselItem[]>(
    () => products.map((p) => ({ src: productImage(p), title: p.title })),
    [products],
  );

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || paused || items.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(id);
  }, [reduce, paused, items.length]);

  useEffect(() => {
    if (index >= items.length) setIndex(0);
  }, [items.length, index]);

  if (items.length === 0) return null;

  const active = products[Math.min(index, products.length - 1)];

  return (
    <section
      aria-label="The Diagonal Edit"
      className="relative w-full overflow-hidden bg-cream text-ink py-24 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <div className="eyebrow text-ink/60">The Edit</div>
          </Reveal>
          <MaskReveal>
            <h2 className="mt-4 font-display text-[2.75rem] leading-[0.98] tracking-[-0.02em] md:text-6xl lg:text-7xl">
              Worn on a Diagonal.
            </h2>
          </MaskReveal>
          <Reveal delay={1}>
            <p className="mt-5 max-w-xl text-sm md:text-base text-ink/60 leading-relaxed">
              Eight pieces from the season, tilted into perspective.
            </p>
          </Reveal>
        </div>

        <div
          className="relative mt-16 md:mt-20 h-[560px] md:h-[720px]"
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <DiagonalCarousel
            items={items}
            activeIndex={Math.min(index, items.length - 1)}
            onActiveIndexChange={(i) => {
              setPaused(true);
              setIndex(i);
            }}
            loop
            slideSize={280}
            rotationStep={22}
            verticalStep={110}
            inactiveScale={0.62}
            aria-label="Featured products, diagonal carousel"
          />
        </div>

        <div className="mt-10 flex flex-col items-center text-center min-h-[120px]">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-3"
              >
                <div className="eyebrow text-ink/40">
                  Look {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </div>
                <div className="font-display text-2xl md:text-3xl tracking-tight">
                  {active.title}
                </div>
                <div className="text-ink/70">{formatPrice(active.price)}</div>
                <LuxLink to="/product/$id" params={{ id: active.id }} className="mt-2">
                  View the piece
                </LuxLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default DiagonalEdit;