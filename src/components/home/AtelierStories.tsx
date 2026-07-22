import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/lib/motion/Reveal";
import { useSectionMedia } from "@/hooks/use-section-media";
import a1 from "@/assets/atelier-new-1.jpeg.asset.json";
import a2 from "@/assets/atelier-new-2.jpeg.asset.json";
import a3 from "@/assets/atelier-new-3.jpeg.asset.json";
import a4 from "@/assets/atelier-new-4.jpeg.asset.json";
import a5 from "@/assets/atelier-new-5.jpeg.asset.json";
import a6 from "@/assets/atelier-new-6.jpeg.asset.json";
import a7 from "@/assets/atelier-new-7.jpeg.asset.json";
import a8 from "@/assets/atelier-new-8.jpeg.asset.json";

/** Shipped artwork — admin uploads in the "atelier_stories" section override
    these slot by slot (see useSectionMedia). */
const FALLBACK: { src: string; alt: string }[] = [
  { src: a1.url, alt: "Peach sequined saree against a lattice screen" },
  { src: a2.url, alt: "Beige tailored suit, editorial menswear" },
  { src: a3.url, alt: "Linen shirt and chinos, coffee-hour ease" },
  { src: a4.url, alt: "Maroon velvet saree with heirloom jewellery" },
  { src: a5.url, alt: "Crimson peplum lehenga at a weathered door" },
  { src: a6.url, alt: "Bridal couple in maroon at a palace courtyard" },
  { src: a7.url, alt: "Ivory sherwani and Banarasi saree portrait" },
  { src: a8.url, alt: "Ivory sherwani with brocade dupatta" },
];

const TILTS = [-6, 4, -3, 5, -4, 6, -5, 3];

function ArrowSwirlLeft() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M6 18 C 30 6, 60 6, 96 26" />
      <path d="M96 26 l -10 -4 M96 26 l -4 -10" />
      <path d="M12 44 C 34 40, 54 46, 78 60" opacity="0.5" />
    </svg>
  );
}

function ArrowSwirlRight() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M114 18 C 90 6, 60 6, 24 26" />
      <path d="M24 26 l 10 -4 M24 26 l 4 -10" />
      <path d="M108 44 C 86 40, 66 46, 42 60" opacity="0.5" />
    </svg>
  );
}

export function AtelierStories() {
  const images = useSectionMedia("atelier_stories", FALLBACK);
  const strip = [...images, ...images];
  return (
    <section className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply silk-grain" />

      <div className="relative mx-auto max-w-[1100px] px-6 text-center">
        <Reveal>
          <div className="eyebrow mb-5 text-ink/60">The Atelier Journal</div>
        </Reveal>

        <div className="relative flex items-center justify-center">
          <motion.div
            aria-hidden
            className="hidden md:block absolute -left-4 lg:-left-10 top-1/2 -translate-y-1/2 w-28 lg:w-36 text-ink/70"
            animate={{ y: [0, -6, 0], rotate: [0, -2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowSwirlLeft />
          </motion.div>

          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.01em]">
              Threads of a<br className="md:hidden" /> Living Heritage
            </h2>
          </Reveal>

          <motion.div
            aria-hidden
            className="hidden md:block absolute -right-4 lg:-right-10 top-1/2 -translate-y-1/2 w-28 lg:w-36 text-ink/70"
            animate={{ y: [0, 6, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <ArrowSwirlRight />
          </motion.div>
        </div>

        <Reveal delay={1}>
          <p className="mt-6 mx-auto max-w-xl text-warm-gray leading-relaxed">
            Every stitch a memory, every drape a story — moments captured from
            the ateliers, the artisans, and the muses of the Maison.
          </p>
        </Reveal>

        <Reveal delay={2}>
          <div className="mt-8 flex justify-center">
            <Link
              to="/shop"
              search={{ sort: "newest" }}
              className="group inline-flex items-center gap-2 rounded-full bg-ink text-cream px-7 py-3.5 text-sm tracking-[0.18em] uppercase font-medium transition-all duration-500 hover:bg-champagne hover:text-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)]"
            >
              Explore the House
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>

      <div
        className="relative mt-16 md:mt-20 group"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div
          className="reel-marquee flex w-max gap-6 md:gap-8 group-hover:[animation-play-state:paused] motion-reduce:!animate-none"
          style={{ animationDuration: "55s" }}
        >
          {strip.map((img, i) => {
            const tilt = TILTS[i % TILTS.length];
            return (
              <div
                key={`atelier-${i}`}
                className="relative shrink-0 w-[220px] sm:w-[260px] md:w-[300px] lg:w-[340px] aspect-[3/4] rounded-2xl overflow-hidden bg-ink/5 border border-ink/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_40px_80px_-25px_rgba(200,163,105,0.45)] hover:!rotate-0"
                style={{ transform: `rotate(${tilt}deg)` }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.06]"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-cream/10" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AtelierStories;