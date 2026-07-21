import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
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
import type { Banner, Category, HomeSection, Product } from "@/types/api";

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
      <CategoriesBento />
      <NewArrivalsRail />
      <EditorialSplit />
      <HomeSections />
      <CampaignQuote />
      <RecommendedGrid />
    </SiteChrome>
  );
}

function Hero() {
  const { data: banners = [] } = useQuery(bannersOptions());
  const active = banners.filter((b: Banner) => b.active).sort((a, b) => a.order - b.order);
  const banner = active[0];

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden bg-ink text-cream">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        {banner?.image ? (
          <img
            src={banner.image}
            alt={banner.title || "Campaign"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full silk-grain" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/70" />
      </motion.div>

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-16 md:pb-24">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9 }}
            className="eyebrow text-cream/70 mb-6"
          >
            {banner?.code || "Autumn / Winter 26"}
          </motion.div>
          <MaskReveal>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[6.5rem] leading-[1.02] tracking-[-0.01em]">
              {banner?.title || "A quiet study in modern couture."}
            </h1>
          </MaskReveal>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-6 max-w-lg text-cream/75"
          >
            {banner?.subtitle ||
              "Ateliers in Milan, cutting rooms in Kolkata. A limited series shaped by hand for the season ahead."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <LuxLink to="/shop" variant="solid" className="bg-cream text-ink hover:bg-champagne">
              Discover the collection
            </LuxLink>
            <LuxLink to="/shop" variant="outline" className="border-cream/70 text-cream hover:bg-cream hover:text-ink">
              Book an appointment
            </LuxLink>
          </motion.div>
        </div>
      </div>

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
  const roots = categories.filter((c: Category) => !c.parent_id && c.image).slice(0, 4);
  if (roots.length === 0) return null;
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="eyebrow mb-3">The House</div>
            <h2 className="font-display text-4xl md:text-5xl">Explore the world of Maison</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex eyebrow items-center gap-2 hover:text-champagne transition-colors">
            All categories <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {roots.map((c, i) => (
            <Reveal key={c.id} delay={i}>
              <Link
                to="/shop"
                search={{ category: c.id }}
                className="group relative block aspect-[3/4] overflow-hidden bg-secondary"
              >
                <img
                  src={c.image!}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.08]"
                  style={{ transform: `scale(${c.image_scale ?? 1})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between text-cream">
                  <span className="font-display text-2xl">{c.name}</span>
                  <ArrowRight className="h-4 w-4 translate-y-1 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
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
