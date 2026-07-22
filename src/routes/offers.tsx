import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { activeCouponsOptions, settingsOptions } from "@/lib/api/queries";
import { formatPrice } from "@/lib/utils/format";
import type { Coupon } from "@/types/api";

export const Route = createFileRoute("/offers")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(activeCouponsOptions()).catch(() => []),
  component: OffersPage,
});

function OffersPage() {
  const { data: coupons = [], isLoading } = useQuery(activeCouponsOptions());
  const { data: settings } = useQuery(settingsOptions());
  const currency = settings?.currency ?? "₹";

  return (
    <SiteChrome>
      <section className="mx-auto max-w-[1000px] px-6 py-32 md:px-10">
        <div className="eyebrow mb-3">Offers</div>
        <h1 className="font-display text-4xl text-ink md:text-5xl">
          Current offers
        </h1>
        <p className="mt-4 max-w-lg text-sm text-warm-gray">
          Apply any of these at checkout. First-order offers appear only while
          you're still on your first order.
        </p>

        {isLoading ? (
          <p className="mt-12 text-sm text-warm-gray">Loading…</p>
        ) : coupons.length === 0 ? (
          <div className="mt-12">
            <p className="text-sm text-warm-gray">
              No offers are running right now. Check back soon.
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
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {coupons.map((c) => (
              <OfferCard key={c.id} coupon={c} currency={currency} />
            ))}
          </div>
        )}
      </section>
    </SiteChrome>
  );
}

function OfferCard({
  coupon,
  currency,
}: {
  coupon: Coupon;
  currency: string;
}) {
  const [copied, setCopied] = useState(false);

  const headline =
    coupon.type === "flat"
      ? `${formatPrice(coupon.value, currency)} off`
      : `${coupon.value}% off`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast.success("Code copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy — the code is " + coupon.code);
    }
  };

  return (
    <div className="border border-border p-8">
      <div className="font-display text-3xl text-ink">{headline}</div>
      {coupon.description && (
        <p className="mt-2 text-sm text-warm-gray">{coupon.description}</p>
      )}

      <ul className="mt-6 space-y-1 text-xs text-warm-gray">
        {coupon.min_order > 0 && (
          <li>Minimum order {formatPrice(coupon.min_order, currency)}</li>
        )}
        {coupon.type === "percent" && coupon.max_discount > 0 && (
          <li>Up to {formatPrice(coupon.max_discount, currency)} off</li>
        )}
        {coupon.first_order_only && <li>Valid on your first order only</li>}
        {coupon.valid_until && (
          <li>
            Ends{" "}
            {new Date(coupon.valid_until).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
            })}
          </li>
        )}
      </ul>

      <button
        onClick={copy}
        className="eyebrow mt-8 flex w-full items-center justify-center gap-3 border border-dashed border-ink py-4 text-ink transition-colors hover:bg-ink hover:text-cream"
      >
        {coupon.code}
        <Copy className="h-3.5 w-3.5" />
        {copied && <span className="text-[10px]">Copied</span>}
      </button>
    </div>
  );
}
