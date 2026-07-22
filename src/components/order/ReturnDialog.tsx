import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { createReturn } from "@/lib/api/returns";
import { qk } from "@/lib/api/queries";
import { cn, formatPrice } from "@/lib/utils/format";
import type { Order } from "@/types/api";

const REASONS = [
  "Size or fit is wrong",
  "Item doesn't match the description",
  "Arrived damaged or defective",
  "Received the wrong item",
  "Changed my mind",
];

/**
 * Return/exchange request for a delivered order. The backend re-checks
 * eligibility per product (returnable flag, per-product window), so a request
 * can still be rejected here with a specific message.
 */
export function ReturnDialog({
  order,
  currency,
  onClose,
  onDone,
}: {
  order: Order;
  currency: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const queryClient = useQueryClient();
  const [type, setType] = useState<"refund" | "exchange">("refund");
  const [reason, setReason] = useState(REASONS[0]);
  const [note, setNote] = useState("");
  const [picked, setPicked] = useState<Record<number, boolean>>({});

  const selected = order.items.filter((_, i) => picked[i]);

  const submit = useMutation({
    mutationFn: () =>
      createReturn({
        order_id: order.id,
        type,
        reason,
        note,
        items: selected.map((it) => ({
          product_id: it.product_id,
          qty: it.qty,
          color: it.color ?? null,
          size: it.size ?? null,
        })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.returns });
      queryClient.invalidateQueries({ queryKey: qk.notifications });
      queryClient.invalidateQueries({ queryKey: qk.unreadCount });
      toast.success("Return request submitted");
      onDone();
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Could not submit"),
  });

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-cream p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl text-ink">Return or exchange</h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8">
          <div className="eyebrow mb-3 text-warm-gray">Type</div>
          <div className="flex gap-3">
            {(["refund", "exchange"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "eyebrow flex-1 border py-3 capitalize transition-colors",
                  type === t ? "border-ink bg-ink text-cream" : "border-border",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="eyebrow mb-3 text-warm-gray">Items</div>
          <ul className="space-y-2">
            {order.items.map((it, i) => (
              <li key={i}>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-4 border p-3 transition-colors",
                    picked[i] ? "border-ink" : "border-border",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(picked[i])}
                    onChange={(e) =>
                      setPicked({ ...picked, [i]: e.target.checked })
                    }
                    className="h-4 w-4 accent-black"
                  />
                  <div className="h-14 w-10 shrink-0 overflow-hidden bg-secondary">
                    {it.image && (
                      <img src={it.image} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">{it.title}</p>
                    <p className="eyebrow mt-0.5 text-warm-gray">
                      {[it.color, it.size].filter(Boolean).join(" · ") || "One size"}
                      {" · qty "}
                      {it.qty}
                    </p>
                  </div>
                  <span className="text-sm text-ink">
                    {formatPrice(it.price * it.qty, currency)}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <label className="mt-8 block">
          <span className="eyebrow text-warm-gray">Reason</span>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm text-ink outline-none focus:border-ink"
          >
            {REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>

        <label className="mt-6 block">
          <span className="eyebrow text-warm-gray">
            {type === "exchange" ? "Size / colour you'd like" : "Anything else"}
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="mt-2 w-full resize-none border border-border bg-transparent p-3 text-sm text-ink outline-none focus:border-ink"
          />
        </label>

        <button
          disabled={selected.length === 0 || submit.isPending}
          onClick={() => submit.mutate()}
          className="eyebrow mt-8 w-full bg-ink py-4 text-cream transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {submit.isPending
            ? "Submitting…"
            : selected.length === 0
              ? "Select at least one item"
              : `Request ${type}`}
        </button>
      </div>
    </div>
  );
}
