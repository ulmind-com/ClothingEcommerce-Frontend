import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { settingsOptions } from "@/lib/api/queries";
import { useCart } from "@/lib/cart/store";
import { formatPrice } from "@/lib/utils/format";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const { data: settings } = useQuery(settingsOptions());
  const currency = settings?.currency ?? "₹";

  const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);

  return (
    <SiteChrome>
      <section className="mx-auto max-w-[1200px] px-5 pb-20 pt-24 md:px-10 md:pb-32 md:pt-32">
        <div className="eyebrow mb-3">Bag</div>
        <h1 className="font-display text-4xl text-ink md:text-5xl">
          Your selection
        </h1>

        {lines.length === 0 ? (
          <div className="mt-12">
            <p className="text-sm text-warm-gray">Your bag is empty.</p>
            <Link
              to="/shop"
              search={{ sort: "newest" }}
              className="eyebrow mt-8 inline-block bg-ink px-10 py-4 text-cream transition-opacity hover:opacity-90"
            >
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
            <ul className="divide-y divide-border border-y border-border">
              {lines.map((l) => (
                <li
                  key={`${l.productId}-${l.color ?? ""}-${l.size ?? ""}`}
                  className="flex gap-4 py-6 md:gap-6"
                >
                  <Link
                    to="/product/$id"
                    params={{ id: l.productId }}
                    className="block h-28 w-20 shrink-0 overflow-hidden bg-secondary md:h-36 md:w-24"
                  >
                    {l.image && (
                      <img
                        src={l.image}
                        alt={l.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <Link
                        to="/product/$id"
                        params={{ id: l.productId }}
                        className="text-sm text-ink hover:text-champagne"
                      >
                        {l.title}
                      </Link>
                      <p className="eyebrow mt-1 text-warm-gray">
                        {[l.color, l.size].filter(Boolean).join(" · ") ||
                          "One size"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center border border-border">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() =>
                            setQty(l.productId, l.quantity - 1, l.color, l.size)
                          }
                          className="grid h-11 w-11 place-items-center"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-8 text-center text-sm">
                          {l.quantity}
                        </span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() =>
                            setQty(l.productId, l.quantity + 1, l.color, l.size)
                          }
                          className="grid h-11 w-11 place-items-center"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-ink">
                          {formatPrice(l.price * l.quantity, currency)}
                        </div>
                        <button
                          onClick={() => remove(l.productId, l.color, l.size)}
                          className="eyebrow mt-1 min-h-11 text-warm-gray hover:text-ink md:min-h-0"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit border border-border p-6 md:p-8">
              <div className="eyebrow mb-6">Summary</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-warm-gray">Subtotal</span>
                <span className="text-ink">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>
              <p className="mt-4 text-xs text-warm-gray">
                Delivery, GST and any coupon are applied at checkout.
              </p>
              <Link
                to="/checkout"
                className="eyebrow mt-8 block bg-ink py-4 text-center text-cream transition-opacity hover:opacity-90"
              >
                Proceed to checkout
              </Link>
              <Link
                to="/offers"
                className="eyebrow mt-4 block py-2 text-center text-warm-gray hover:text-ink"
              >
                View offers
              </Link>
            </aside>
          </div>
        )}
      </section>
    </SiteChrome>
  );
}
