import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Product } from "@/types/api";
import { productImage, productHoverImage } from "@/lib/utils/product";
import { cn, discountPct, formatPrice } from "@/lib/utils/format";
import { useWishlist } from "@/hooks/use-wishlist";

export function ProductCard({
  product,
  index = 0,
  currency = "₹",
}: {
  product: Product;
  index?: number;
  currency?: string;
}) {
  const main = productImage(product);
  const hover = productHoverImage(product);
  const off = discountPct(product.mrp, product.price);
  const wishlist = useWishlist();
  const saved = wishlist.has(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      className="group relative"
    >
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block"
        aria-label={product.title}
      >
        <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
          {main ? (
            <>
              <img
                src={main}
                alt={product.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
              />
              {hover && (
                <img
                  src={hover}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center text-warm-gray">
              <span className="eyebrow">No image</span>
            </div>
          )}

          {off > 0 && (
            <span className="absolute left-4 top-4 eyebrow bg-cream/85 backdrop-blur px-2 py-1 text-ink">
              −{off}%
            </span>
          )}

          <button
            type="button"
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={saved}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              wishlist.toggle(product.id);
            }}
            className={cn(
              "absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition-colors",
              saved
                ? "bg-ink text-cream"
                : "bg-cream/85 text-ink hover:bg-ink hover:text-cream",
            )}
          >
            <Heart className={cn("h-4 w-4", saved && "fill-current")} />
          </button>

          <div className="absolute inset-x-4 bottom-4 flex translate-y-4 items-center justify-between gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="eyebrow bg-ink/90 px-3 py-2 text-cream">
              Quick view
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {product.brand && (
              <div className="eyebrow mb-1 truncate">{product.brand}</div>
            )}
            <h3 className="truncate text-sm text-ink">{product.title}</h3>
          </div>
          <div className="text-right text-sm">
            <div className="text-ink">{formatPrice(product.price, currency)}</div>
            {off > 0 && (
              <div className="text-xs text-warm-gray line-through">
                {formatPrice(product.mrp, currency)}
              </div>
            )}
          </div>
        </div>

        {(product.colors?.length ?? 0) > 1 && (
          <div className="mt-2 flex gap-1.5">
            {product.colors!.slice(0, 5).map((c) => (
              <span
                key={c.name + c.hex}
                aria-hidden
                className="h-3 w-3 rounded-full border border-border"
                style={{ background: c.hex }}
              />
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  );
}