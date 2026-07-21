import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/lib/motion/Reveal";
import atelier1 from "@/assets/atelier-1.jpeg.asset.json";
import atelier2 from "@/assets/atelier-2.jpeg.asset.json";
import atelier3 from "@/assets/atelier-3.jpg";
import atelier4 from "@/assets/atelier-4.jpg";
import atelier5 from "@/assets/atelier-5.jpg";
import atelier6 from "@/assets/atelier-6.jpg";
import atelier7 from "@/assets/atelier-7.jpg";
import atelier8 from "@/assets/atelier-8.jpg";

const IMAGES: { src: string; alt: string }[] = [
  { src: atelier1.url, alt: "Bridal jewellery portrait" },
  { src: atelier3, alt: "Bride in ivory lehenga" },
  { src: atelier2.url, alt: "Bride in kanjivaram silk" },
  { src: atelier4, alt: "Groom in charcoal bandhgala" },
  { src: atelier5, alt: "Gold bangles detail" },
  { src: atelier6, alt: "Emerald saree gown" },
  { src: atelier7, alt: "Couple in pastel wedding wear" },
  { src: atelier8, alt: "Zardozi hand embroidery" },
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
  const strip = [...IMAGES, ...IMAGES];
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