import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ReturnStatusPill } from "@/components/order/OrderStatusPill";
import { returnsOptions, settingsOptions } from "@/lib/api/queries";
import { formatPrice } from "@/lib/utils/format";

export const Route = createFileRoute("/returns")({
  component: () => (
    <RequireAuth>
      <ReturnsPage />
    </RequireAuth>
  ),
});

function ReturnsPage() {
  const { data: returns = [], isLoading } = useQuery(returnsOptions(true));
  const { data: settings } = useQuery(settingsOptions());
  const currency = settings?.currency ?? "₹";

  return (
    <SiteChrome>
      <section className="mx-auto max-w-[1000px] px-6 py-32 md:px-10">
        <div className="eyebrow mb-3">Account</div>
        <h1 className="font-display text-4xl text-ink md:text-5xl">
          Returns &amp; refunds
        </h1>

        {isLoading ? (
          <p className="mt-12 text-sm text-warm-gray">Loading…</p>
        ) : returns.length === 0 ? (
          <div className="mt-12">
            <p className="text-sm text-warm-gray">
              You haven't requested a return yet. You can start one from any
              delivered order.
            </p>
            <Link
              to="/orders"
              className="eyebrow mt-8 inline-block bg-ink px-10 py-4 text-cream"
            >
              View orders
            </Link>
          </div>
        ) : (
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {returns.map((r) => (
              <li key={r.id} className="py-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="eyebrow text-ink">#{r.order_short}</span>
                  <ReturnStatusPill status={r.status} />
                  <span className="eyebrow capitalize text-warm-gray">
                    {r.type}
                  </span>
                </div>

                <ul className="mt-4 space-y-3">
                  {r.items.map((it, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <div className="h-16 w-11 shrink-0 overflow-hidden bg-secondary">
                        {it.image && (
                          <img
                            src={it.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-ink">{it.title}</p>
                        <p className="eyebrow mt-0.5 text-warm-gray">
                          {[it.color, it.size].filter(Boolean).join(" · ") ||
                            "One size"}
                          {" · qty "}
                          {it.qty}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="text-warm-gray">{r.reason}</span>
                  <span className="text-ink">
                    {formatPrice(r.amount, currency)}
                  </span>
                </div>

                {r.admin_note && (
                  <p className="mt-3 border-l-2 border-border pl-4 text-sm text-warm-gray">
                    {r.admin_note}
                  </p>
                )}

                <Link
                  to="/order/$id"
                  params={{ id: r.order_id }}
                  className="eyebrow mt-4 inline-block text-warm-gray hover:text-ink"
                >
                  View order →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteChrome>
  );
}
