import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  bannersOptions,
  categoriesOptions,
  homeSectionsOptions,
  productsOptions,
  recsHomeOptions,
  settingsOptions,
} from "@/lib/api/queries";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ProductCard } from "@/components/product/ProductCard";
import { LuxLink } from "@/components/ui/LuxButton";
import { MaskReveal, Reveal } from "@/lib/motion/Reveal";
import { productImage } from "@/lib/utils/product";
import type { Category, HomeSection, Product } from "@/types/api";
import heroBridal from "@/assets/hero-bridal.png.asset.json";
import heroRedBride from "@/assets/hero-red-bride.png.asset.json";
import heroCoupleBridal from "@/assets/hero-couple-bridal.png.asset.json";

import catLehenga from "@/assets/cat-lehenga.jpeg.asset.json";
import catFusion from "@/assets/cat-fusion.jpeg.asset.json";
import catSherwani from "@/assets/cat-sherwani.jpeg.asset.json";
import catSaree from "@/assets/cat-saree.jpeg.asset.json";
import { VideoReel } from "@/components/home/VideoReel";
import { RunwayLookbook } from "@/components/home/RunwayLookbook";
import { ShopGallery } from "@/components/home/ShopGallery";
import { EditorialSpotlight } from "@/components/home/EditorialSpotlight";
import { AtelierStories } from "@/components/home/AtelierStories";
import { CoutureSimplicity } from "@/components/home/CoutureSimplicity";
export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(bannersOptions()),
      context.queryClient.ensureQueryData(categoriesOptions()),
      context.queryClient.ensureQueryData(homeSectionsOptions()),
      context.queryClient.ensureQueryData(productsOptions({ limit: 12 })),
      context.queryClient.ensureQueryData(recsHomeOptions(12)),
      context.queryClient.ensureQueryData(settingsOptions()),
    ]);
  },
  component: Home,
});

function Home() {
  return (
    <SiteChrome transparentHeader>
      <Hero />
      <ShopGallery />
      <CategoriesBento />
      <VideoReel />
      <RunwayLookbook />
      <EditorialSpotlight />
      <AtelierStories />
      <CoutureSimplicity />
      <NewArrivalsRail />
      <EditorialSplit />
      <HomeSections />
      <CampaignQuote />
      <RecommendedGrid />
    </SiteChrome>
  );
}

function Hero() {
  type Slide = {
    image?: string;
    title: string;
    subtitle?: string;
    code?: string;
  };
  const slides: Slide[] = [
    {
      image: heroBridal.url,
      title: "A quiet study in modern couture.",
      subtitle:
        "Ateliers in Milan, cutting rooms in Kolkata. A limited series shaped by hand for the season ahead.",
      code: "Autumn / Winter 26",
    },
    {
      image: heroRedBride.url,
      title: "Crimson, worn with intention.",
      subtitle: "Sculpted silhouettes in vermillion and rose for the season's most memorable moments.",
      code: "Bridal Edit",
    },
    {
      image: heroCoupleBridal.url,
      title: "Two souls, one composition.",
      subtitle: "Hand-embroidered ensembles for the couple who writes their own traditions.",
      code: "The Wedding Journal",
    },
  ];


  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduce || paused || slides.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [reduce, paused, slides.length]);

  const go = (dir: number) =>
    setIndex((i) => (i + dir + slides.length) % slides.length);
  const slide = slides[index] ?? slides[0];

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] w-full overflow-hidden bg-ink text-cream"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={`slide-${index}`}
            initial={{ opacity: 0, scale: reduce ? 1 : 1.02 }}
            animate={{
              opacity: 1,
              scale: reduce ? 1 : 1.08,
              transition: {
                opacity: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 6.5, ease: "linear" },
              },
            }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
            className="absolute inset-0"
          >
            {slide?.image ? (
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full silk-grain" />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/25 to-ink/90" />
      </motion.div>

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-16 md:pb-24">
        <div className="max-w-3xl" key={`copy-${index}`}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="eyebrow text-cream/70 mb-6"
          >
            {slide?.code || "Autumn / Winter 26"}
          </motion.div>
          <MaskReveal>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[6.5rem] leading-[1.02] tracking-[-0.01em]">
              {slide?.title}
            </h1>
          </MaskReveal>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-6 max-w-lg text-cream/75"
          >
            {slide?.subtitle ||
              "Ateliers in Milan, cutting rooms in Kolkata. A limited series shaped by hand for the season ahead."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <LuxLink
              to="/shop"
              variant="solid"
              className="bg-ink text-cream border border-cream/20 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] hover:bg-champagne hover:text-ink hover:border-champagne"
            >
              Discover the collection
            </LuxLink>
            <LuxLink
              to="/shop"
              variant="outline"
              className="!bg-transparent !text-cream border-white/80 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-sm hover:bg-cream/10 hover:!text-cream hover:border-white"
            >
              Book an appointment
            </LuxLink>
          </motion.div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:grid place-items-center h-12 w-12 rounded-full border border-cream/30 text-cream/70 opacity-0 hover:opacity-100 hover:text-cream hover:border-cream/70 transition-all duration-500 group-hover:opacity-60"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => go(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:grid place-items-center h-12 w-12 rounded-full border border-cream/30 text-cream/70 opacity-0 hover:opacity-100 hover:text-cream hover:border-cream/70 transition-all duration-500"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-8 bg-cream" : "w-1.5 bg-cream/40 hover:bg-cream/70"
                }`}
              />
            ))}
          </div>
        </>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 right-8 hidden md:flex items-center gap-3 eyebrow text-cream/60"
      >
        <span>Scroll</span>
        <span className="block h-px w-16 bg-cream/40" />
      </motion.div>
    </section>
  );
}

function CategoriesBento() {
  const { data: categories = [] } = useQuery(categoriesOptions());
  const curatedTiles = [
    { label: "Lehenga", image: catLehenga.url, match: ["lehenga"] },
    { label: "Fusion Wear", image: catFusion.url, match: ["fusion"] },
    { label: "Sherwanis", image: catSherwani.url, match: ["sherwani", "men"] },
    { label: "Sarees", image: catSaree.url, match: ["saree", "sari"] },
  ].map((tile) => {
    const cat = categories.find((c: Category) =>
      tile.match.some((m) => c.name?.toLowerCase().includes(m))
    );
    return { ...tile, categoryId: cat?.id };
  });
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[900px] px-6 text-center mb-14 md:mb-20">
        <div className="eyebrow mb-4">The House</div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">
          Explore the world of Maison
        </h2>
        <p className="mt-6 font-display italic text-warm-gray text-lg md:text-xl leading-relaxed">
          A blend of classic silhouettes and our signature shine,
          <br className="hidden md:block" /> embodied by enigmatic sequins.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4 md:px-6">
        {curatedTiles.map((tile, i) => (
          <Reveal key={tile.label} delay={i}>
            <Link
              to="/shop"
              search={tile.categoryId ? { category: tile.categoryId } : {}}
              className="group relative block aspect-[3/5] overflow-hidden bg-secondary"
            >
              <img
                src={tile.image}
                alt={tile.label}
                className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-8 flex flex-col items-center text-cream">
                <span className="eyebrow text-sm tracking-[0.35em] !text-cream drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">{tile.label}</span>
                <span className="mt-3 block h-px w-0 bg-champagne transition-all duration-700 group-hover:w-10" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="mt-14 md:mt-20 flex justify-center">
        <Link
          to="/shop"
          className="eyebrow relative inline-block pb-1 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-ink hover:text-champagne hover:after:bg-champagne transition-colors"
        >
          View all
        </Link>
      </div>
    </section>
  );
}

function NewArrivalsRail() {
  const { data: products = [] } = useQuery(productsOptions({ limit: 12 }));
  if (products.length === 0) return null;
  return (
    <section className="py-16 md:py-24 border-t border-border">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="eyebrow mb-3">Just In</div>
            <h2 className="font-display text-4xl md:text-5xl">New arrivals</h2>
          </div>
          <Link to="/shop" className="eyebrow inline-flex items-center gap-2 hover:text-champagne">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-14">
          {products.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialSplit() {
  const { data: products = [] } = useQuery(productsOptions({ limit: 20 }));
  const feature = products.find((p) => (p.images?.length ?? 0) > 0 || (p.colors?.[0]?.images?.length ?? 0) > 0);
  if (!feature) return null;
  const img = productImage(feature);
  return (
    <section className="py-24 md:py-40 bg-secondary/60">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 px-6 md:px-10 items-center">
        <Reveal>
          <div className="relative aspect-[3/4] overflow-hidden">
            <img src={img} alt={feature.title} className="h-full w-full object-cover" />
          </div>
        </Reveal>
        <div>
          <div className="eyebrow mb-4">Featured Piece</div>
          <h3 className="font-display text-4xl md:text-6xl leading-[1.05]">{feature.title}</h3>
          <p className="mt-8 max-w-md text-warm-gray leading-relaxed">
            {feature.description ||
              "An investment silhouette cut from responsibly-sourced fabric and finished by hand in our atelier."}
          </p>
          <div className="mt-10">
            <LuxLink to="/product/$id" params={{ id: feature.id }} variant="outline">
              View the piece
            </LuxLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeSections() {
  const { data: sections = [] } = useQuery(homeSectionsOptions());
  const active = sections
    .filter((s: HomeSection) => s.active && (s.products?.length ?? 0) > 0)
    .sort((a, b) => a.order - b.order);
  if (active.length === 0) return null;
  return (
    <div>
      {active.map((s) => (
        <SectionBlock key={s.id} section={s} />
      ))}
    </div>
  );
}

function SectionBlock({ section }: { section: HomeSection }) {
  const products = section.products ?? [];
  if (products.length === 0) return null;
  return (
    <section className="py-16 md:py-24 border-t border-border">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="eyebrow mb-3">{section.type || "Curated"}</div>
            <h2 className="font-display text-4xl md:text-5xl">{section.title}</h2>
          </div>
          <Link to="/shop" className="eyebrow hover:text-champagne">
            Explore →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-14">
          {products.slice(0, 8).map((p: Product, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CampaignQuote() {
  return (
    <section className="py-32 md:py-48 bg-ink text-cream text-center overflow-hidden">
      <div className="mx-auto max-w-4xl px-6">
        <MaskReveal>
          <p className="font-display italic text-3xl md:text-5xl lg:text-6xl leading-[1.15]">
            "Luxury is the ease of a garment
            <br />that already knows who you are."
          </p>
        </MaskReveal>
        <div className="eyebrow text-cream/60 mt-10">— The Atelier Journal, N° 04</div>
      </div>
    </section>
  );
}

function RecommendedGrid() {
  const { data: recs = [] } = useQuery(recsHomeOptions(12));
  if (recs.length === 0) return null;
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="eyebrow mb-3">Editor's Choice</div>
            <h2 className="font-display text-4xl md:text-5xl">Made for you</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-14">
          {recs.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
