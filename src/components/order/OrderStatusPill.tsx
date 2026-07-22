import { cn } from "@/lib/utils/format";
import type { OrderStatus, ReturnStatus } from "@/types/api";

/** Backend order id is a Mongo ObjectId; the last 6 read as the order number. */
export const shortId = (id: string) => id.slice(-6).toUpperCase();

/** Mirrors STAGES in app/routers/orders.py. */
export const ORDER_STAGES: OrderStatus[] = [
  "placed",
  "confirmed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const ORDER_LABELS: Record<OrderStatus, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const RETURN_LABELS: Record<ReturnStatus, string> = {
  requested: "Requested",
  approved: "Approved",
  rejected: "Declined",
  picked_up: "Picked up",
  refunded: "Refunded",
  exchanged: "Exchanged",
};

export function OrderStatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "eyebrow px-2 py-1 text-[10px]",
        status === "cancelled"
          ? "bg-destructive/10 text-destructive"
          : status === "delivered"
            ? "bg-ink text-cream"
            : "bg-champagne/25 text-ink",
      )}
    >
      {ORDER_LABELS[status] ?? status}
    </span>
  );
}

export function ReturnStatusPill({ status }: { status: ReturnStatus }) {
  return (
    <span
      className={cn(
        "eyebrow px-2 py-1 text-[10px]",
        status === "rejected"
          ? "bg-destructive/10 text-destructive"
          : status === "refunded" || status === "exchanged"
            ? "bg-ink text-cream"
            : "bg-champagne/25 text-ink",
      )}
    >
      {RETURN_LABELS[status] ?? status}
    </span>
  );
}
