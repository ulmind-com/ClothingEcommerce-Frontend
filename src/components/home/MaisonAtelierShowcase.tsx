import { motion } from "framer-motion";
import { MaskReveal, Reveal } from "@/lib/motion/Reveal";
import a2 from "@/assets/atelier-new-2.jpeg.asset.json";
import a3 from "@/assets/atelier-new-3.jpeg.asset.json";
import a7 from "@/assets/atelier-new-7.jpeg.asset.json";
import a8 from "@/assets/atelier-new-8.jpeg.asset.json";

const TILES: { src: string; alt: string }[] = [
  { src: a2.url, alt: "Tailored beige suit portrait" },
  { src: a3.url, alt: "Linen shirt and chinos, at ease" },
  { src: a7.url, alt: "Ivory sherwani editorial portrait" },
  { src: a8.url, alt: "Ivory sherwani with brocade dupatta" },
];

export function MaisonAtelierShowcase() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Warm champagne backdrop */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.champagne)/40,theme(colors.cream)_60%)]" />
      <div className="absolute inset-0 -z-10 bg-cream" style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(200,163,105,0.28), transparent 70%), linear-gradient(180deg, #f6ecd9 0%, #f1e4cb 100%)",
      }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply silk-grain -z-10" />

      <div className="relative mx-auto max-w-[1200px] px-6">
        {/* 4 tan tiles with models sitting on the edge */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pb-24 md:pb-32">
          {TILES.map((tile, i) => (
            <Reveal key={i} delay={i}>
              <div className="relative aspect-[3/4]">
                {/* Tan box */}
                <div
                  className="absolute inset-0 rounded-[6px] shadow-[inset_0_-40px_60px_-30px_rgba(0,0,0,0.25),0_30px_60px_-30px_rgba(140,100,50,0.35)]"
                  style={{
                    background:
                      "linear-gradient(180deg, #c9a87a 0%, #b8935e 100%)",
                  }}
                />
                {/* Model image overflowing bottom */}
                <motion.div
                  className="absolute inset-x-0 top-0 bottom-[-18%] overflow-visible"
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 6 + i * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                >
                  <img
                    src={tile.src}
                    alt={tile.alt}
                    loading="lazy"
                    className="h-full w-full object-cover object-top drop-shadow-[0_25px_20px_rgba(90,60,30,0.35)]"
                  />
                </motion.div>
                {/* Ground shadow beneath the tile */}
                <div
                  aria-hidden
                  className="absolute left-1/2 -translate-x-1/2 -bottom-[26%] w-[80%] h-6 rounded-[50%] blur-lg"
                  style={{ background: "rgba(90,60,30,0.28)" }}
                />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Wordmark + tagline */}
        <div className="text-center">
          <MaskReveal>
            <div className="font-display italic text-6xl md:text-7xl lg:text-8xl text-ink/85 leading-none">
              Maison
            </div>
          </MaskReveal>
          <Reveal delay={1}>
            <div className="mt-3 flex items-center justify-center gap-3 text-ink/60">
              <span className="h-px w-6 bg-ink/40" />
              <span className="eyebrow tracking-[0.4em] text-xs">couture</span>
              <span className="h-px w-6 bg-ink/40" />
            </div>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-8 mx-auto max-w-xl text-warm-gray leading-relaxed text-lg">
              Welcome to couture that doesn't just dress you,
              <br className="hidden md:block" /> it defines you.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default MaisonAtelierShowcase;