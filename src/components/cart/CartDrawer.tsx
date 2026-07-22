import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { settingsOptions } from "@/lib/api/queries";
import { useCart } from "@/lib/cart/store";
import { formatPrice } from "@/lib/utils/format";

/**
 * Slide-over bag. `add()` in the cart store flips `open`, so adding from the
 * PDP or a card pops this open without the caller doing anything.
 */
export function CartDrawer() {
  const open = useCart((s) => s.open);
  const setOpen = useCart((s) => s.setOpen);
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const { data: settings } = useQuery(settingsOptions());
  const currency = settings?.currency ?? "₹";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // `add()` leaves the drawer open; close it on any navigation so it can't
  // hang over the next page (in-drawer links close it themselves, but a
  // browser back/forward or a typed URL wouldn't).
  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-cream text-ink"
          >
            <header className="flex items-center justify-between border-b border-border px-6 py-5">
              <span className="eyebrow">Your bag ({lines.length})</span>
              <button onClick={() => setOpen(false)} aria-label="Close bag">
                <X className="h-5 w-5" />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
                <p className="text-sm text-warm-gray">Your bag is empty.</p>
                <Link
                  to="/shop"
                  search={{ sort: "newest" }}
                  onClick={() => setOpen(false)}
                  className="eyebrow bg-ink px-10 py-4 text-cream"
                >
                  Browse
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <ul className="space-y-6">
                    {lines.map((l) => (
                      <li
                        key={`${l.productId}-${l.color ?? ""}-${l.size ?? ""}`}
                        className="flex gap-4"
                      >
                        <Link
                          to="/product/$id"
                          params={{ id: l.productId }}
                          onClick={() => setOpen(false)}
                          className="block h-28 w-20 shrink-0 overflow-hidden bg-secondary"
                        >
                          {l.image && (
                            <img
                              src={l.image}
                              alt={l.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </Link>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm">{l.title}</h3>
                          <p className="eyebrow mt-1 text-warm-gray">
                            {[l.color, l.size].filter(Boolean).join(" · ") ||
                              "One size"}
                          </p>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="flex items-center border border-border">
                              <button
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  setQty(
                                    l.productId,
                                    l.quantity - 1,
                                    l.color,
                                    l.size,
                                  )
                                }
                                className="px-2 py-1.5"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="min-w-8 text-center text-sm">
                                {l.quantity}
                              </span>
                              <button
                                aria-label="Increase quantity"
                                onClick={() =>
                                  setQty(
                                    l.productId,
                                    l.quantity + 1,
                                    l.color,
                                    l.size,
                                  )
                                }
                                className="px-2 py-1.5"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="text-sm">
                              {formatPrice(l.price * l.quantity, currency)}
                            </span>
                          </div>
                          <button
                            onClick={() => remove(l.productId, l.color, l.size)}
                            className="eyebrow mt-2 text-warm-gray hover:text-ink"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <footer className="border-t border-border px-6 py-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="eyebrow text-warm-gray">Subtotal</span>
                    <span>{formatPrice(subtotal, currency)}</span>
                  </div>
                  <p className="mt-1 text-xs text-warm-gray">
                    Delivery and tax are calculated at checkout.
                  </p>
                  <Link
                    to="/checkout"
                    onClick={() => setOpen(false)}
                    className="eyebrow mt-5 block bg-ink py-4 text-center text-cream transition-opacity hover:opacity-90"
                  >
                    Checkout
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setOpen(false)}
                    className="eyebrow mt-3 block py-2 text-center text-warm-gray hover:text-ink"
                  >
                    View full bag
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
