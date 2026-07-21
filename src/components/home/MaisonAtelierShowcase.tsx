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
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #ecd6a6 0%, #e8cf9c 55%, #e2c68d 100%)",
      }}
    >
      {/* soft directional light from top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 20% 10%, rgba(255,240,200,0.55), transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply silk-grain" />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 pt-24 md:pt-32 pb-28 md:pb-40">
        {/* 4 recessed niches */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {TILES.map((tile, i) => (
            <Reveal key={i} delay={i}>
              <motion.div
                className="relative aspect-[3/5] overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, #a87a3f 0%, #8a5f2c 100%)",
                  boxShadow:
                    "inset 12px 0 24px -12px rgba(0,0,0,0.45), inset -12px 0 24px -12px rgba(255,220,160,0.25), inset 0 24px 32px -20px rgba(0,0,0,0.55), inset 0 -24px 32px -20px rgba(0,0,0,0.35)",
                }}
                animate={{ y: [0, -3, 0] }}
                transition={{
                  duration: 7 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
              >
                <img
                  src={tile.src}
                  alt={tile.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* inner vignette to sell the recess */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    boxShadow: "inset 0 0 60px 10px rgba(60,35,10,0.55)",
                  }}
                />
              </motion.div>
              {/* cast shadow on the wall below the niche */}
              <div
                aria-hidden
                className="mx-auto mt-3 h-6 w-[75%] rounded-[50%] blur-lg"
                style={{ background: "rgba(120,80,35,0.28)" }}
              />
            </Reveal>
          ))}
        </div>

        {/* Editorial text on the empty lower wall */}
        <div className="text-center mt-20 md:mt-28">
          <Reveal>
            <div className="eyebrow tracking-[0.45em] text-[11px] text-ink/55">
              Maison — N° 04
            </div>
          </Reveal>
          <MaskReveal>
            <div className="mt-4 font-display italic text-4xl md:text-5xl lg:text-6xl text-ink/85 leading-[1.1]">
              Poise, tailored in daylight.
            </div>
          </MaskReveal>
        </div>
      </div>
    </section>
  );
}
