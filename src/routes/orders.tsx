import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ordersOptions, settingsOptions } from "@/lib/api/queries";
import { formatPrice } from "@/lib/utils/format";
import { OrderStatusPill, shortId } from "@/components/order/OrderStatusPill";

export const Route = createFileRoute("/orders")({
  component: () => (
    <RequireAuth>
      <OrdersPage />
    </RequireAuth>
  ),
});

function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery(ordersOptions(true));
  const { data: settings } = useQuery(settingsOptions());
  const currency = settings?.currency ?? "₹";

  return (
    <SiteChrome>
      <section className="mx-auto max-w-[1000px] px-5 pb-20 pt-24 md:px-10 md:pb-32 md:pt-32">
        <div className="eyebrow mb-3">Account</div>
        <h1 className="font-display text-4xl text-ink md:text-5xl">Orders</h1>

        {isLoading ? (
          <p className="mt-12 text-sm text-warm-gray">Loading…</p>
        ) : orders.length === 0 ? (
          <div className="mt-12">
            <p className="text-sm text-warm-gray">
              You haven't placed an order yet.
            </p>
            <Link
              to="/shop"
              search={{ sort: "newest" }}
              className="eyebrow mt-8 inline-block bg-ink px-10 py-4 text-cream"
            >
              Browse the collection
            </Link>
          </div>
        ) : (
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  to="/order/$id"
                  params={{ id: o.id }}
                  className="flex items-center gap-4 py-5 transition-opacity hover:opacity-70 md:gap-6 md:py-6"
                >
                  <div className="flex -space-x-4">
                    {o.items.slice(0, 3).map((it, i) => (
                      <div
                        key={i}
                        className="h-16 w-11 shrink-0 overflow-hidden border border-cream bg-secondary md:h-20 md:w-14"
                      >
                        {it.image && (
                          <img
                            src={it.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="eyebrow text-ink">#{shortId(o.id)}</span>
                      <OrderStatusPill status={o.status} />
                    </div>
                    <p className="mt-2 truncate text-sm text-warm-gray">
                      {o.items.map((i) => i.title).join(", ")}
                    </p>
                    <p className="mt-1 text-xs text-warm-gray">
                      {o.created_at
                        ? new Date(o.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : ""}
                      {" · "}
                      {o.payment_method === "cod"
                        ? "Cash on delivery"
                        : o.razorpay_payment_id
                          ? "Paid online"
                          : "Payment pending"}
                    </p>
                  </div>

                  <div className="text-right text-sm text-ink">
                    {formatPrice(o.amount, currency)}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-2">
          <Link to="/returns" className="eyebrow text-ink hover:text-champagne">
            Returns &amp; refunds →
          </Link>
          <Link to="/policies" className="eyebrow text-warm-gray hover:text-ink">
            Policies
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
