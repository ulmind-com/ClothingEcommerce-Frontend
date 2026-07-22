import { useEffect, useMemo, useState } from "react";
import { useReducedMotion, AnimatePresence, motion } from "framer-motion";
import { DiagonalCarousel, type DiagonalCarouselItem } from "@/components/ui/DiagonalCarousel";
import { LuxLink } from "@/components/ui/LuxButton";
import { MaskReveal, Reveal } from "@/lib/motion/Reveal";
import d1 from "@/assets/diagonal-1.jpeg.asset.json";
import d2 from "@/assets/diagonal-2.jpeg.asset.json";
import d3 from "@/assets/diagonal-3.jpeg.asset.json";
import d4 from "@/assets/diagonal-4.jpeg.asset.json";
import d5 from "@/assets/diagonal-5.jpeg.asset.json";
import d6 from "@/assets/diagonal-6.jpeg.asset.json";
import d7 from "@/assets/diagonal-7.jpeg.asset.json";

import { useSectionMedia } from "@/hooks/use-section-media";

const AUTOPLAY_MS = 2600;

/** Shipped artwork — the admin's "diagonal_edit" uploads override these. */
const FALLBACK: { src: string; title: string; caption: string; alt: string }[] = [
  { src: d1.url, title: "Mirror Bloom Lehenga", caption: "Hand-mirrored, garden-bloomed", alt: "Mirror Bloom Lehenga" },
  { src: d2.url, title: "Sage Reflection Saree", caption: "Organza, poured like water", alt: "Sage Reflection Saree" },
  { src: d3.url, title: "Gilded Corridor", caption: "Sequined dusk, twinned", alt: "Gilded Corridor" },
  { src: d4.url, title: "Nocturne Couture Gown", caption: "Salon-hour glimmer", alt: "Nocturne Couture Gown" },
  { src: d5.url, title: "Everyday Ivory", caption: "Casual, quietly composed", alt: "Everyday Ivory" },
  { src: d6.url, title: "Pattachitra Bridal", caption: "Painted heirloom, worn today", alt: "Pattachitra Bridal" },
  { src: d7.url, title: "Crimson Anarkali", caption: "Old doors, new silhouettes", alt: "Crimson Anarkali" },
];

export function DiagonalEdit() {
  const media = useSectionMedia("diagonal_edit", FALLBACK);
  const items = useMemo<DiagonalCarouselItem[]>(
    () =>
      media.map((m, i) => ({
        src: m.src,
        title: m.title ?? FALLBACK[i]?.title ?? "",
        alt: m.alt,
      })),
    [media],
  );

  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || items.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(id);
  }, [reduce, items.length]);

  // An uploaded slide carries its own caption; otherwise keep the shipped copy.
  const slot = media[index];
  const active = {
    title: slot?.title ?? FALLBACK[index]?.title ?? "",
    caption: slot?.subtitle ?? FALLBACK[index]?.caption ?? "",
  };

  return (
    <section
      aria-label="The Diagonal Edit"
      className="relative w-full overflow-hidden bg-cream text-ink py-24 md:py-32"
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
              Seven pieces from the season, tilted into perspective.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-16 md:mt-20 h-[560px] md:h-[720px]">
          <DiagonalCarousel
            items={items}
            activeIndex={index}
            onActiveIndexChange={(i) => setIndex(i)}
            loop
            slideSize={280}
            rotationStep={22}
            verticalStep={110}
            inactiveScale={0.62}
            aria-label="The Diagonal Edit"
          />
        </div>

        <div className="mt-10 flex flex-col items-center text-center min-h-[120px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
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
              <div className="text-ink/60 italic">{active.caption}</div>
              <LuxLink to="/shop" className="mt-2">
                Explore the edit
              </LuxLink>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default DiagonalEdit;