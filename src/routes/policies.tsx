import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { settingsOptions } from "@/lib/api/queries";
import { formatPrice } from "@/lib/utils/format";

export const Route = createFileRoute("/policies")({
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsOptions()),
  component: PoliciesPage,
});

/** Every number on this page comes from admin Settings — nothing is hardcoded. */
function PoliciesPage() {
  const { data: settings } = useQuery(settingsOptions());
  const currency = settings?.currency ?? "₹";
  const shop = settings?.shop;
  const delivery = settings?.delivery;

  const cancelWindow = settings?.cancel_window_hours ?? 0;
  const returnWindow = settings?.return_window_days ?? 0;

  return (
    <SiteChrome>
      <section className="mx-auto max-w-[760px] px-6 py-32 md:px-10">
        <div className="eyebrow mb-3">Help</div>
        <h1 className="font-display text-4xl text-ink md:text-5xl">
          Policies
        </h1>

        <Block title="Returns &amp; exchanges">
          {returnWindow > 0 ? (
            <p>
              You can request a return or exchange within{" "}
              <strong className="text-ink">{formatDays(returnWindow)}</strong> of
              delivery, from the order page. Individual pieces may carry their
              own window or be marked non-returnable — we'll tell you at the
              moment you request one.
            </p>
          ) : (
            <p>Returns are currently not available.</p>
          )}
        </Block>

        <Block title="Cancellations">
          {cancelWindow > 0 ? (
            <p>
              An order can be cancelled within{" "}
              <strong className="text-ink">{formatHours(cancelWindow)}</strong> of
              being placed, as long as it hasn't shipped yet.
            </p>
          ) : (
            <p>Orders can't be self-cancelled. Contact us and we'll help.</p>
          )}
        </Block>

        <Block title="Refunds">
          <p>
            Refunds for online payments go back to the original payment method
            automatically once approved — banks typically credit within 5–7
            working days. For cash-on-delivery orders we collect your bank
            details when the return is approved.
          </p>
        </Block>

        <Block title="Delivery">
          {delivery ? (
            <ul className="space-y-2">
              {delivery.free_radius_km > 0 && (
                <li>
                  Free delivery within {delivery.free_radius_km} km of our store.
                </li>
              )}
              {delivery.free_above > 0 && (
                <li>
                  Free on orders above{" "}
                  {formatPrice(delivery.free_above, currency)}.
                </li>
              )}
              {delivery.max_service_km > 0 && (
                <li>
                  We currently deliver up to {delivery.max_service_km} km from
                  the store.
                </li>
              )}
              <li>
                Your exact delivery fee is calculated from your address at
                checkout.
              </li>
            </ul>
          ) : (
            <p>Delivery charges are calculated from your address at checkout.</p>
          )}
        </Block>

        <Block title="Payments">
          <p>
            We accept UPI, cards, netbanking and wallets through Razorpay.
            Cash on delivery is offered where available — you'll see it as an
            option at checkout when it is.
          </p>
        </Block>

        <Block title="Taxes">
          <p>
            Prices are exclusive of GST, which is itemised on your bill at
            checkout. Orders shipped outside{" "}
            {shop?.state ? `${shop.state} ` : "our state "}
            are charged IGST; within it, CGST and SGST.
          </p>
        </Block>

        {(shop?.email || shop?.phone || shop?.address) && (
          <Block title="Contact">
            <address className="not-italic leading-relaxed">
              {shop?.name && <div className="text-ink">{shop.name}</div>}
              {shop?.address && <div>{shop.address}</div>}
              {shop?.phone && <div>{shop.phone}</div>}
              {shop?.email && (
                <a
                  href={`mailto:${shop.email}`}
                  className="text-ink underline underline-offset-4"
                >
                  {shop.email}
                </a>
              )}
            </address>
          </Block>
        )}
      </section>
    </SiteChrome>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="eyebrow mb-4">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-warm-gray">
        {children}
      </div>
    </div>
  );
}

function formatDays(days: number) {
  const n = Number.isInteger(days) ? days : Math.round(days);
  return `${n} day${n === 1 ? "" : "s"}`;
}

function formatHours(hours: number) {
  if (hours >= 24 && hours % 24 === 0) {
    const d = hours / 24;
    return `${d} day${d === 1 ? "" : "s"}`;
  }
  const n = Number.isInteger(hours) ? hours : Math.round(hours);
  return `${n} hour${n === 1 ? "" : "s"}`;
}
