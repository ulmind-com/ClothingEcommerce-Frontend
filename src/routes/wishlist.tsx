import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ProductCard } from "@/components/product/ProductCard";
import { settingsOptions, wishlistOptions } from "@/lib/api/queries";

export const Route = createFileRoute("/wishlist")({
  component: () => (
    <RequireAuth>
      <WishlistPage />
    </RequireAuth>
  ),
});

function WishlistPage() {
  const { data, isLoading } = useQuery(wishlistOptions(true));
  const { data: settings } = useQuery(settingsOptions());
  const products = data?.products ?? [];

  return (
    <SiteChrome>
      <section className="mx-auto max-w-[1400px] px-5 pb-20 pt-24 md:px-10 md:pb-32 md:pt-32">
        <div className="eyebrow mb-3">Saved</div>
        <h1 className="font-display text-4xl text-ink md:text-5xl">Wishlist</h1>

        {isLoading ? (
          <p className="mt-12 text-sm text-warm-gray">Loading…</p>
        ) : products.length === 0 ? (
          <div className="mt-12">
            <p className="text-sm text-warm-gray">
              Nothing saved yet. Tap the heart on any piece to keep it here.
            </p>
            <Link
              to="/shop"
              search={{ sort: "newest" }}
              className="eyebrow mt-8 inline-block bg-ink px-10 py-4 text-cream transition-opacity hover:opacity-90"
            >
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                currency={settings?.currency ?? "₹"}
              />
            ))}
          </div>
        )}
      </section>
    </SiteChrome>
  );
}
