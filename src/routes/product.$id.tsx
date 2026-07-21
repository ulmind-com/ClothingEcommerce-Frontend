import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Heart, Minus, Plus, Share2, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import {
  productOptions,
  recsSimilarOptions,
  reviewSummaryOptions,
  reviewsOptions,
  settingsOptions,
} from "@/lib/api/queries";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ProductCard } from "@/components/product/ProductCard";
import { LuxButton } from "@/components/ui/LuxButton";
import { MaskReveal, Reveal } from "@/lib/motion/Reveal";
import { discountPct, formatPrice } from "@/lib/utils/format";
import { productImage } from "@/lib/utils/product";
import { useCart } from "@/lib/cart/store";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient
      .ensureQueryData(productOptions(params.id))
      .catch(() => null);
    if (!product) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(reviewsOptions(params.id)).catch(() => []),
      context.queryClient.ensureQueryData(reviewSummaryOptions(params.id)).catch(() => null),
      context.queryClient.ensureQueryData(recsSimilarOptions(params.id, 8)).catch(() => []),
      context.queryClient.ensureQueryData(settingsOptions()),
    ]);
  },
  head: ({ params, loaderData: _l }) => {
    return {
      meta: [
        { title: `Product — Maison` },
        { name: "description", content: "Modern couture from the Maison collection." },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${params.id}` },
      ],
      links: [{ rel: "canonical", href: `/product/${params.id}` }],
    };
  },
  notFoundComponent: () => (
    <SiteChrome>
      <div className="pt-40 pb-40 text-center">
        <div className="eyebrow mb-4">Not Found</div>
        <h1 className="font-display text-5xl">This piece is no longer available</h1>
      </div>
    </SiteChrome>
  ),
  errorComponent: () => (
    <SiteChrome>
      <div className="pt-40 pb-40 text-center">
        <h1 className="font-display text-4xl">Something went wrong</h1>
      </div>
    </SiteChrome>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data: product } = useQuery(productOptions(id));
  const { data: settings } = useQuery(settingsOptions());
  const { data: reviews = [] } = useQuery(reviewsOptions(id));
  const { data: summary } = useQuery(reviewSummaryOptions(id));
  const { data: similar = [] } = useQuery(recsSimilarOptions(id, 8));
  const add = useCart((s) => s.add);

  const currency = settings?.currency ?? "₹";

  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  const color = product?.colors?.[colorIdx];
  const galleryImages = useMemo(() => {
    if (!product) return [];
    const imgs = color?.images?.length ? color.images : product.images ?? [];
    return imgs.filter(Boolean);
  }, [product, color]);

  const sizeList = useMemo(() => {
    if (color?.sizes?.length) return color.sizes.map((s) => ({ label: s.size, stock: s.stock, price: s.price }));
    return (product?.sizes ?? []).map((s) => ({ label: s, stock: 1, price: null as number | null }));
  }, [color, product]);

  if (!product) return null;

  const price = color?.price ?? product.price;
  const mrp = color?.mrp ?? product.mrp;
  const off = discountPct(mrp, price);

  const onAdd = () => {
    if (sizeList.length > 0 && !size) {
      toast("Choose a size");
      return;
    }
    add({
      productId: product.id,
      title: product.title,
      image: productImage(product),
      price,
      quantity: qty,
      color: color?.name,
      size,
    });
    toast.success("Added to bag");
  };

  return (
    <SiteChrome>
      <div className="pt-24 md:pt-28">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          {/* Gallery */}
          <div className="grid grid-cols-[70px_1fr] gap-4">
            <div className="hidden md:flex flex-col gap-3 overflow-y-auto max-h-[80svh] pr-1">
              {galleryImages.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setImgIdx(i)}
                  className={`aspect-[3/4] w-full overflow-hidden border ${i === imgIdx ? "border-ink" : "border-transparent"}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="col-start-1 md:col-start-2">
              <MaskReveal className="relative aspect-[3/4] overflow-hidden bg-secondary">
                {galleryImages[imgIdx] && (
                  <motion.img
                    key={galleryImages[imgIdx]}
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    src={galleryImages[imgIdx]}
                    alt={product.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </MaskReveal>
              <div className="mt-3 flex md:hidden gap-2 overflow-x-auto">
                {galleryImages.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setImgIdx(i)}
                    className={`aspect-[3/4] w-16 shrink-0 border ${i === imgIdx ? "border-ink" : "border-transparent"}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="lg:sticky lg:top-28 self-start">
            {product.brand && <div className="eyebrow mb-4">{product.brand}</div>}
            <h1 className="font-display text-4xl md:text-5xl leading-[1.05]">{product.title}</h1>
            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-2xl">{formatPrice(price, currency)}</span>
              {off > 0 && (
                <>
                  <span className="text-warm-gray line-through">{formatPrice(mrp, currency)}</span>
                  <span className="eyebrow text-champagne">−{off}%</span>
                </>
              )}
            </div>
            {summary && summary.count > 0 && (
              <div className="mt-3 text-sm text-warm-gray">
                ★ {summary.average?.toFixed(1)} · {summary.count} reviews
              </div>
            )}

            {product.description && (
              <p className="mt-8 text-warm-gray leading-relaxed max-w-md">{product.description}</p>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="mt-10">
                <div className="eyebrow mb-3">
                  Colour — <span className="text-ink">{color?.name}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((c, i) => (
                    <button
                      key={c.name + i}
                      onClick={() => { setColorIdx(i); setImgIdx(0); setSize(undefined); }}
                      aria-label={c.name}
                      className={`h-9 w-9 rounded-full border transition ${i === colorIdx ? "ring-1 ring-ink ring-offset-2 ring-offset-background" : "border-border"}`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {sizeList.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="eyebrow">Size</div>
                  <button className="eyebrow hover:text-champagne">Size guide</button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {sizeList.map((s) => {
                    const disabled = s.stock <= 0;
                    return (
                      <button
                        key={s.label}
                        onClick={() => !disabled && setSize(s.label)}
                        disabled={disabled}
                        className={`h-11 border text-sm transition-colors ${
                          size === s.label
                            ? "border-ink bg-ink text-cream"
                            : disabled
                              ? "border-border text-warm-gray/60 line-through cursor-not-allowed"
                              : "border-border hover:border-ink"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-10 flex items-center gap-4">
              <div className="flex items-center border border-ink">
                <button
                  aria-label="Decrease"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-3 hover:bg-ink hover:text-cream transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button
                  aria-label="Increase"
                  onClick={() => setQty((q) => q + 1)}
                  className="p-3 hover:bg-ink hover:text-cream transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <LuxButton className="flex-1" onClick={onAdd}>Add to bag</LuxButton>
              <button aria-label="Wishlist" className="border border-ink p-4 hover:bg-ink hover:text-cream transition-colors">
                <Heart className="h-4 w-4" />
              </button>
              <button aria-label="Share" className="border border-ink p-4 hover:bg-ink hover:text-cream transition-colors hidden sm:inline-flex">
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 text-xs text-warm-gray">
              <div className="flex items-start gap-2"><Truck className="h-4 w-4 mt-0.5" /><span>Complimentary shipping over {formatPrice(1500, currency)}</span></div>
              <div className="flex items-start gap-2"><RotateCcw className="h-4 w-4 mt-0.5" /><span>{settings?.return_window_days ?? 7} days returns</span></div>
              <div className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 mt-0.5" /><span>Secure checkout</span></div>
            </div>

            <div className="mt-14 space-y-1 border-t border-border">
              <Details title="Fabric & Care">Dry clean only. Store on a padded hanger to preserve the silhouette.</Details>
              <Details title="Fit">Model wears a size S and is 178 cm tall. Runs true to size.</Details>
              <Details title="Shipping & Returns">Complimentary shipping within India. Returns accepted within {settings?.return_window_days ?? 7} days of receipt.</Details>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-24 md:mt-32 border-t border-border">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
              <div className="eyebrow mb-3">Client Journal</div>
              <h2 className="font-display text-4xl md:text-5xl">Reviews</h2>
              <div className="mt-10 grid gap-8 md:grid-cols-2">
                {reviews.slice(0, 6).map((r) => (
                  <Reveal key={r.id}>
                    <article className="border-t border-border pt-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">{r.user_name || "Client"}</div>
                        <div className="eyebrow text-champagne">{"★".repeat(Math.round(r.rating))}</div>
                      </div>
                      {r.title && <div className="mt-2 font-display text-xl">{r.title}</div>}
                      {r.text && <p className="mt-3 text-sm text-warm-gray leading-relaxed">{r.text}</p>}
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <section className="mt-16 md:mt-24 border-t border-border">
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
              <div className="mb-10 flex items-end justify-between">
                <div>
                  <div className="eyebrow mb-3">Continue Exploring</div>
                  <h2 className="font-display text-4xl md:text-5xl">You may also like</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-14">
                {similar.slice(0, 8).map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} currency={currency} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </SiteChrome>
  );
}

function Details({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="eyebrow">{title}</span>
        <span className="text-warm-gray">{open ? "−" : "+"}</span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden text-sm text-warm-gray"
      >
        <div className="pb-5">{children}</div>
      </motion.div>
    </div>
  );
}