import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { productsOptions } from "@/lib/api/queries";
import { productImage } from "@/lib/utils/product";
import { MaskReveal, Reveal } from "@/lib/motion/Reveal";
import { LuxLink } from "@/components/ui/LuxButton";
import {
  Arch,
  Blob,
  Dot,
  Donut,
  FilmStrip,
  HalfCircle,
  HalfMoon,
  Sparkle,
} from "./couture-shapes";
import { useSectionMedia } from "@/hooks/use-section-media";
import atelier1 from "@/assets/atelier-1.jpeg.asset.json";
import atelier2 from "@/assets/atelier-2.jpeg.asset.json";

/** Shipped stills — the admin's "couture_simplicity" uploads override these. */
const ATELIER_FALLBACK = [
  { src: atelier1.url, alt: "Atelier detail" },
  { src: atelier2.url, alt: "Atelier detail" },
];

export function CoutureSimplicity() {
  const { data: products = [] } = useQuery(productsOptions({ limit: 12 }));
  // Admin uploads win, then the catalogue, then the shipped atelier stills.
  const media = useSectionMedia("couture_simplicity", ATELIER_FALLBACK);
  const main =
    (media[0].managed ? media[0].src : null) ??
    (products[0] && productImage(products[0])) ??
    media[0].src;
  const inset1 =
    (media[1].managed ? media[1].src : null) ??
    (products[1] && productImage(products[1])) ??
    media[1].src;
  const inset2 =
    (products[2] && productImage(products[2])) || media[0].src;

  return (
    <section className="relative overflow-hidden bg-[#F7F1E4] py-20 md:py-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 md:grid-cols-[45%_1fr] md:gap-14 md:px-10 lg:gap-20">
        {/* LEFT — arch + model + sparkle */}
        <div className="relative">
          <Reveal>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px]">
              <Arch color="#7C5CD6" className="absolute inset-0">
                <motion.img
                  src={main}
                  alt="Sophisticated couture"
                  className="h-full w-full object-cover"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.06 }}
                  transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
              </Arch>
              <Sparkle className="absolute -left-4 top-10 h-14 w-14 md:h-20 md:w-20" color="#EC4E9C" />
              <FilmStrip className="absolute -bottom-6 -right-4 h-10 w-40 md:w-56" />
            </div>
          </Reveal>
        </div>

        {/* RIGHT — headline + shapes + CTAs */}
        <div className="relative flex flex-col justify-center">
          <div className="relative">
            <HalfCircle className="absolute -left-2 -top-6 h-14 w-14 md:h-20 md:w-20" color="#F5C518" />
            <Dot className="absolute right-6 top-2 h-5 w-5 md:h-6 md:w-6" color="#4C7BF3" />
            <Donut className="absolute right-2 top-1/2 h-10 w-10 md:h-14 md:w-14" color="#F07A2E" />
            <HalfMoon className="absolute -right-6 top-1/3 h-16 w-16 hidden md:block" color="#7C5CD6" />

            <MaskReveal>
              <h2 className="font-display text-[3.25rem] leading-[0.95] tracking-[-0.02em] md:text-7xl lg:text-[6rem] font-black text-ink">
                <span className="relative inline-block">
                  <span className="relative z-10">So</span>
                </span>
                phisticated<br />
                comfort,<br />
                couture<br />
                simplicity.
              </h2>
            </MaskReveal>

            {/* Pink blob inset with small model */}
            <Blob
              className="absolute right-4 top-[26%] h-24 w-28 md:h-32 md:w-36 lg:h-40 lg:w-44"
              color="#F0A5B8"
            >
              <img src={inset1} alt="" className="h-full w-full object-cover mix-blend-multiply" />
            </Blob>
          </div>

          <Reveal delay={2}>
            <p className="mt-8 max-w-md text-warm-gray leading-relaxed md:text-base">
              Elevate your style with a touch of effortless sophistication,
              where comfort meets couture in every stitch.
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <LuxLink
                to="/shop"
                variant="solid"
                className="!bg-[#F5C518] !text-ink border !border-[#F5C518] rounded-full px-8 py-3 hover:!bg-[#e8b810]"
              >
                Shop Now
              </LuxLink>
              <LuxLink
                to="/shop"
                variant="outline"
                className="rounded-full !border-ink !text-ink px-8 py-3"
              >
                Collections
              </LuxLink>
            </div>
          </Reveal>

          {/* Bottom-right yellow circle with model */}
          <div className="relative mt-10 flex justify-end md:mt-16">
            <motion.div
              className="relative h-32 w-32 md:h-44 md:w-44 rounded-full overflow-hidden"
              style={{ backgroundColor: "#F5C518" }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={inset2}
                alt=""
                className="h-full w-full object-cover mix-blend-multiply"
              />
            </motion.div>
            <FilmStrip className="absolute -bottom-4 right-24 h-10 w-40 md:w-56" />
          </div>
        </div>
      </div>
    </section>
  );
}