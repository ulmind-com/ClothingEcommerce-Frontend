import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MouseEvent } from "react";
import { categoriesOptions } from "@/lib/api/queries";
import { MaskReveal } from "@/lib/motion/Reveal";
import type { Category } from "@/types/api";

export function CuratedThisSeason() {
  const { data: categories = [] } = useQuery(categoriesOptions());
  const tiles = categories
    .filter((c: Category) => !c.parent_id && c.image)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 4);

  if (tiles.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 text-center">
        <MaskReveal>
          <h2 className="font-display text-3xl md:text-4xl tracking-[0.18em] uppercase">
            Curated This Season
          </h2>
        </MaskReveal>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-5 mx-auto max-w-md italic text-warm-gray text-sm md:text-base leading-relaxed"
        >
          A blend of classic silhouettes and our signature shine,
          <br className="hidden md:block" /> embodied by enigmatic sequins.
        </motion.p>
      </div>

      <div className="mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-[2px] px-[2px]">
        {tiles.map((c, i) => (
          <CuratedTile key={c.id} category={c} index={i} />
        ))}
      </div>

      <style>{`
        @keyframes curated-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}

function CuratedTile({ category, index }: { category: Category; index: number }) {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 120,
    damping: 14,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), {
    stiffness: 120,
    damping: 14,
  });
  const imgX = useTransform(mx, [-0.5, 0.5], ["3%", "-3%"]);
  const imgY = useTransform(my, [-0.5, 0.5], ["3%", "-3%"]);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
    >
      <Link
        to="/shop"
        search={{ category: category.id }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative block aspect-[3/4] overflow-hidden bg-secondary"
      >
        <motion.div
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          className="absolute inset-0"
        >
          <motion.img
            src={category.image!}
            alt={category.name}
            style={{ x: imgX, y: imgY, scale: category.image_scale ?? 1 }}
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:!scale-[1.08]"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.14) 50%, transparent 70%)",
              backgroundSize: "220% 220%",
              animation: "curated-shimmer 6s linear infinite",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        </motion.div>

        <div className="absolute inset-x-0 bottom-6 md:bottom-10 z-10 flex flex-col items-center text-cream">
          <span className="font-display uppercase tracking-[0.32em] text-sm md:text-base transition-transform duration-500 group-hover:-translate-y-1">
            {category.name}
          </span>
          <span className="mt-3 block h-px w-0 bg-champagne transition-all duration-700 group-hover:w-10" />
        </div>
      </Link>
    </motion.div>
  );
}