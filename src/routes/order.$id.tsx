import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import {
  ORDER_STAGES,
  OrderStatusPill,
  shortId,
} from "@/components/order/OrderStatusPill";
import { ReturnDialog } from "@/components/order/ReturnDialog";
import { cancelOrder } from "@/lib/api/orders";
import { orderOptions, qk, settingsOptions } from "@/lib/api/queries";
import { cn, formatPrice } from "@/lib/utils/format";
import type { Order } from "@/types/api";

export const Route = createFileRoute("/order/$id")({
  component: () => (
    <RequireAuth>
      <OrderDetailPage />
    </RequireAuth>
  ),
});

/** Self-cancel is allowed only before shipping — mirrors CANCELLABLE. */
const CANCELLABLE = ["placed", "confirmed"];

/**
 * An online order sits at "placed" with no payment id until Razorpay's handler
 * verifies — calling that "Paid online" would be a lie.
 */
function paymentLabel(order: Order) {
  if (order.payment_method === "cod") return "Cash on delivery";
  return order.razorpay_payment_id ? "Paid online" : "Payment pending";
}

function OrderDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useQuery(orderOptions(id, true));
  const { data: settings } = useQuery(settingsOptions());
  const currency = settings?.currency ?? "₹";
  const [returnOpen, setReturnOpen] = useState(false);

  const cancel = useMutation({
    mutationFn: () => cancelOrder(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: qk.order(id) });
      queryClient.invalidateQueries({ queryKey: qk.orders });
      toast.success(
        res.refund
          ? "Order cancelled — refund initiated"
          : "Order cancelled",
      );
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Could not cancel"),
  });

  if (isLoading) {
    return (
      <SiteChrome>
        <div className="grid min-h-screen place-items-center">
          <span className="eyebrow text-warm-gray">Loading…</span>
        </div>
      </SiteChrome>
    );
  }

  if (!order) {
    return (
      <SiteChrome>
        <section className="mx-auto max-w-md px-5 pb-20 pt-24 text-center md:py-32">
          <h1 className="font-display text-3xl text-ink">Order not found</h1>
          <Link to="/orders" className="eyebrow mt-8 inline-block bg-ink px-10 py-4 text-cream">
            All orders
          </Link>
        </section>
      </SiteChrome>
    );
  }

  const canCancel =
    CANCELLABLE.includes(order.status) &&
    (settings?.cancel_window_hours ?? 0) > 0;
  const canReturn =
    order.status === "delivered" && (settings?.return_window_days ?? 0) > 0;

  return (
    <SiteChrome>
      <section className="mx-auto max-w-[900px] px-5 pb-20 pt-24 md:px-10 md:pb-32 md:pt-32">
        <Link to="/orders" className="eyebrow text-warm-gray hover:text-ink">
          ← All orders
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <h1 className="font-display text-4xl text-ink">
            Order #{shortId(order.id)}
          </h1>
          <OrderStatusPill status={order.status} />
        </div>
        <p className="mt-2 text-sm text-warm-gray">
          Placed{" "}
          {order.created_at
            ? new Date(order.created_at).toLocaleString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "—"}
          {" · "}
          {paymentLabel(order)}
        </p>

        {order.status !== "cancelled" && (
          <Timeline
            status={order.status}
            deliveredAt={order.delivered_at}
          />
        )}

        {order.status === "cancelled" && order.refund_status && (
          <div className="mt-8 border border-border p-5">
            <div className="eyebrow mb-2">Refund</div>
            <p className="text-sm text-warm-gray">
              {order.refund_status === "initiated"
                ? "Your refund has been initiated. Banks usually credit it within 5–7 working days."
                : "We couldn't process the refund automatically. Our team will reach out."}
            </p>
          </div>
        )}

        {/* Items */}
        <div className="mt-12">
          <h2 className="eyebrow mb-6">Items</h2>
          <ul className="divide-y divide-border border-y border-border">
            {order.items.map((it, i) => (
              <li key={i} className="flex gap-6 py-5">
                <Link
                  to="/product/$id"
                  params={{ id: it.product_id }}
                  className="block h-28 w-20 shrink-0 overflow-hidden bg-secondary"
                >
                  {it.image && (
                    <img src={it.image} alt="" className="h-full w-full object-cover" />
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink">{it.title}</p>
                  <p className="eyebrow mt-1 text-warm-gray">
                    {[it.color, it.size].filter(Boolean).join(" · ") || "One size"}
                    {" · qty "}
                    {it.qty}
                  </p>
                </div>
                <div className="text-sm text-ink">
                  {formatPrice(it.price * it.qty, currency)}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          {/* Bill */}
          <div>
            <h2 className="eyebrow mb-6">Bill</h2>
            <Row label="Subtotal" value={formatPrice(order.subtotal ?? 0, currency)} />
            {(order.discount ?? 0) > 0 && (
              <Row
                label={`Discount${order.coupon_code ? ` (${order.coupon_code})` : ""}`}
                value={`−${formatPrice(order.discount!, currency)}`}
              />
            )}
            <Row
              label="Delivery"
              value={
                order.delivery_free
                  ? "Free"
                  : formatPrice(order.delivery ?? 0, currency)
              }
            />
            <Row label="GST" value={formatPrice(order.tax ?? 0, currency)} />
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="eyebrow">Total</span>
              <span className="font-display text-xl text-ink">
                {formatPrice(order.amount, currency)}
              </span>
            </div>
            {order.razorpay_payment_id && (
              <p className="mt-4 break-all text-xs text-warm-gray">
                Payment ID: {order.razorpay_payment_id}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <h2 className="eyebrow mb-6">Delivery address</h2>
            <address className="text-sm not-italic leading-relaxed text-warm-gray">
              <span className="text-ink">{order.address.name}</span>
              <br />
              {order.address.house}
              {order.address.area && `, ${order.address.area}`}
              <br />
              {order.address.city}, {order.address.state} {order.address.pincode}
              <br />
              {order.address.phone}
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          {canCancel && (
            <button
              disabled={cancel.isPending}
              onClick={() => cancel.mutate()}
              className="eyebrow border border-border px-8 py-4 text-ink transition-colors hover:bg-ink hover:text-cream disabled:opacity-50"
            >
              {cancel.isPending ? "Cancelling…" : "Cancel order"}
            </button>
          )}
          {canReturn && (
            <button
              onClick={() => setReturnOpen(true)}
              className="eyebrow bg-ink px-8 py-4 text-cream transition-opacity hover:opacity-90"
            >
              Return or exchange
            </button>
          )}
          <Link
            to="/policies"
            className="eyebrow self-center text-warm-gray hover:text-ink"
          >
            Policies
          </Link>
        </div>

        {returnOpen && (
          <ReturnDialog
            order={order as Order}
            currency={currency}
            onClose={() => setReturnOpen(false)}
            onDone={() => {
              setReturnOpen(false);
              navigate({ to: "/returns" });
            }}
          />
        )}
      </section>
    </SiteChrome>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-warm-gray">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}

const STAGE_COPY: Record<string, { label: string; note: string }> = {
  placed: { label: "Placed", note: "We've received your order." },
  confirmed: { label: "Confirmed", note: "Payment settled — your pieces are being packed." },
  shipped: { label: "Shipped", note: "Handed to the courier." },
  out_for_delivery: { label: "Out for delivery", note: "Arriving today." },
  delivered: { label: "Delivered", note: "Enjoy — returns open from here." },
};

function Timeline({
  status,
  deliveredAt,
}: {
  status: Order["status"];
  deliveredAt?: string;
}) {
  const current = ORDER_STAGES.indexOf(status);

  return (
    <ol className="mt-12">
      {ORDER_STAGES.map((stage, i) => {
        const done = i < current;
        const active = i === current;
        const copy = STAGE_COPY[stage];
        const last = i === ORDER_STAGES.length - 1;

        return (
          <li key={stage} className="relative flex gap-6 pb-10 last:pb-0">
            {/* Rail */}
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[13px] top-7 h-full w-px",
                  done ? "bg-ink" : "bg-border",
                )}
              />
            )}

            <span
              className={cn(
                "relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors",
                done || active
                  ? "border-ink bg-ink text-cream"
                  : "border-border bg-cream text-warm-gray",
              )}
            >
              {done ? (
                <Check className="h-3.5 w-3.5" />
              ) : active ? (
                <motion.span
                  animate={{ scale: [1, 1.35, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="h-2 w-2 rounded-full bg-champagne"
                />
              ) : (
                <span className="text-[10px]">{i + 1}</span>
              )}
            </span>

            <div className={cn("pt-0.5", !done && !active && "opacity-45")}>
              <div
                className={cn(
                  "eyebrow text-[0.65rem]",
                  active ? "text-ink" : "text-warm-gray",
                )}
              >
                {copy.label}
              </div>
              <p className="mt-1.5 text-sm text-warm-gray">{copy.note}</p>
              {stage === "delivered" && deliveredAt && done && (
                <p className="mt-1 text-xs text-warm-gray">
                  {new Date(deliveredAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "long",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
