import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Field } from "./login";
import { fetchApplicableCoupons } from "@/lib/api/coupons";
import { createOrder, quoteOrder, verifyPayment } from "@/lib/api/orders";
import { codAvailabilityOptions, qk, settingsOptions } from "@/lib/api/queries";
import { useAuth } from "@/lib/auth/store";
import { useCart } from "@/lib/cart/store";
import { loadRazorpay, openRazorpay } from "@/lib/payments/razorpay";
import { cn, formatPrice } from "@/lib/utils/format";
import type { Address, ApplicableCoupons, Bill } from "@/types/api";

export const Route = createFileRoute("/checkout")({
  component: () => (
    <RequireAuth>
      <CheckoutPage />
    </RequireAuth>
  ),
});

const ADDRESS_KEY = "maison_address_v1";

const emptyAddress: Address = {
  tag: "Home",
  name: "",
  house: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
};

function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuth((s) => s.user);
  const lines = useCart((s) => s.lines);
  const clearCart = useCart((s) => s.clear);

  const { data: settings } = useQuery(settingsOptions());
  const { data: cod } = useQuery(codAvailabilityOptions(true));
  const currency = settings?.currency ?? "₹";

  const [address, setAddress] = useState<Address>(emptyAddress);
  const [payment, setPayment] = useState<"online" | "cod">("online");
  const [coupon, setCoupon] = useState("");
  const [bill, setBill] = useState<Bill | null>(null);
  const [offers, setOffers] = useState<ApplicableCoupons | null>(null);

  const subtotal = useMemo(
    () => lines.reduce((n, l) => n + l.price * l.quantity, 0),
    [lines],
  );

  const items = useMemo(
    () =>
      lines.map((l) => ({
        product_id: l.productId,
        qty: l.quantity,
        color: l.color ?? null,
        size: l.size ?? null,
      })),
    [lines],
  );

  // Reuse the last address they checked out with, and seed the name/phone from
  // their profile the first time.
  useEffect(() => {
    let saved: Partial<Address> = {};
    try {
      saved = JSON.parse(window.localStorage.getItem(ADDRESS_KEY) ?? "{}");
    } catch {
      /* ignore a corrupt entry */
    }
    setAddress((a) => ({
      ...a,
      ...saved,
      name: saved.name || user?.name || "",
      phone: saved.phone || user?.phone || "",
    }));
  }, [user]);

  // COD may be switched off globally, on a schedule, or for this customer.
  useEffect(() => {
    if (cod && !cod.available && payment === "cod") setPayment("online");
  }, [cod, payment]);

  const addressComplete =
    address.name.trim() !== "" &&
    address.house.trim() !== "" &&
    address.city.trim() !== "" &&
    address.state.trim() !== "" &&
    address.pincode.trim() !== "" &&
    address.phone.trim() !== "";

  const quote = useMutation({
    mutationFn: (code: string | null) =>
      quoteOrder({ items, address, payment_method: payment, coupon_code: code }),
    onSuccess: (b) => setBill(b),
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Could not price order"),
  });

  // Re-price whenever the parts of the bill the server cares about change.
  useEffect(() => {
    if (!addressComplete || items.length === 0) return;
    quote.mutate(coupon || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    address.state,
    address.pincode,
    address.city,
    coupon,
    payment,
    items.length,
    subtotal,
  ]);

  // Offers list is ranked for this subtotal, with locked ones shown greyed.
  useEffect(() => {
    if (subtotal <= 0) return;
    fetchApplicableCoupons(subtotal)
      .then(setOffers)
      .catch(() => setOffers(null));
  }, [subtotal]);

  const place = useMutation({
    mutationFn: () =>
      createOrder({
        items,
        address,
        payment_method: payment,
        coupon_code: coupon || null,
      }),
    onSuccess: async (res) => {
      window.localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));

      if (res.payment_method === "cod") {
        finish(res.order_id, "Order placed");
        return;
      }

      const ok = await loadRazorpay();
      if (!ok) {
        toast.error("Could not load the payment gateway. Please try again.");
        return;
      }

      openRazorpay({
        key: res.key_id!,
        amount: res.amount!,
        currency: res.currency ?? "INR",
        name: settings?.shop?.name ?? "Maison",
        description: `Order ${res.order_id.slice(-6).toUpperCase()}`,
        order_id: res.razorpay_order_id!,
        prefill: res.prefill,
        theme: { color: "#1c1613" },
        handler: (r) => {
          verify.mutate({
            order_id: res.order_id,
            razorpay_order_id: r.razorpay_order_id,
            razorpay_payment_id: r.razorpay_payment_id,
            razorpay_signature: r.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () =>
            toast(
              "Payment cancelled. Your order is saved but not confirmed.",
            ),
        },
      });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Could not place order"),
  });

  const verify = useMutation({
    mutationFn: verifyPayment,
    onSuccess: (res) => finish(res.order_id, "Payment successful"),
    onError: (err) =>
      toast.error(
        err instanceof Error ? err.message : "Payment verification failed",
      ),
  });

  function finish(orderId: string, message: string) {
    clearCart();
    queryClient.invalidateQueries({ queryKey: qk.orders });
    queryClient.invalidateQueries({ queryKey: qk.unreadCount });
    queryClient.invalidateQueries({ queryKey: qk.notifications });
    toast.success(message);
    navigate({ to: "/order/$id", params: { id: orderId } });
  }

  const busy = place.isPending || verify.isPending;

  if (lines.length === 0) {
    return (
      <SiteChrome>
        <section className="mx-auto max-w-md px-5 pb-20 pt-24 text-center md:py-32">
          <h1 className="font-display text-3xl text-ink">Your bag is empty</h1>
          <Link
            to="/shop"
            search={{ sort: "newest" }}
            className="eyebrow mt-8 inline-block bg-ink px-10 py-4 text-cream"
          >
            Browse the collection
          </Link>
        </section>
      </SiteChrome>
    );
  }

  return (
    <SiteChrome>
      <section className="mx-auto max-w-[1200px] px-5 pb-20 pt-24 md:px-10 md:pb-32 md:pt-32">
        <div className="eyebrow mb-3">Checkout</div>
        <h1 className="font-display text-4xl text-ink md:text-5xl">
          Complete your order
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px]">
          <div className="space-y-12">
            {/* Address */}
            <div>
              <h2 className="eyebrow mb-6">Delivery address</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Full name"
                  value={address.name}
                  onChange={(v) => setAddress({ ...address, name: v })}
                />
                <Field
                  label="Phone"
                  value={address.phone}
                  onChange={(v) => setAddress({ ...address, phone: v })}
                  inputMode="tel"
                />
                <Field
                  label="House / Flat"
                  value={address.house}
                  onChange={(v) => setAddress({ ...address, house: v })}
                />
                <Field
                  label="Area / Street"
                  value={address.area}
                  onChange={(v) => setAddress({ ...address, area: v })}
                />
                <Field
                  label="City"
                  value={address.city}
                  onChange={(v) => setAddress({ ...address, city: v })}
                />
                <Field
                  label="State"
                  value={address.state}
                  onChange={(v) => setAddress({ ...address, state: v })}
                />
                <Field
                  label="Pincode"
                  value={address.pincode}
                  onChange={(v) => setAddress({ ...address, pincode: v })}
                  inputMode="numeric"
                  maxLength={6}
                />
                <label className="block">
                  <span className="eyebrow text-warm-gray">Address type</span>
                  <select
                    value={address.tag}
                    onChange={(e) =>
                      setAddress({ ...address, tag: e.target.value })
                    }
                    className="mt-2 w-full border-b border-border bg-transparent min-h-11 py-3 text-base text-ink outline-none focus:border-ink md:text-sm"
                  >
                    <option>Home</option>
                    <option>Work</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>
              {!addressComplete && (
                <p className="mt-4 text-xs text-warm-gray">
                  Fill in name, phone, house, city, state and pincode to see
                  delivery and tax.
                </p>
              )}
            </div>

            {/* Offers */}
            <div>
              <h2 className="eyebrow mb-6">Offers</h2>
              <div className="flex gap-3">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="flex-1 border-b border-border bg-transparent min-h-11 py-3 text-base uppercase text-ink outline-none focus:border-ink md:text-sm"
                />
                {coupon && (
                  <button
                    onClick={() => setCoupon("")}
                    className="eyebrow text-warm-gray hover:text-ink"
                  >
                    Clear
                  </button>
                )}
              </div>

              {offers && offers.offers.length > 0 && (
                <ul className="mt-6 space-y-3">
                  {offers.offers.map((o) => (
                    <li key={o.code}>
                      <button
                        disabled={!o.applicable}
                        onClick={() => setCoupon(o.code)}
                        className={cn(
                          "flex w-full items-start justify-between gap-4 border p-4 text-left transition-colors",
                          coupon === o.code
                            ? "border-ink bg-ink/5"
                            : "border-border",
                          !o.applicable && "opacity-50",
                        )}
                      >
                        <div>
                          <div className="eyebrow text-ink">{o.code}</div>
                          <p className="mt-1 text-xs text-warm-gray">
                            {o.description ||
                              (o.type === "flat"
                                ? `${formatPrice(o.value, currency)} off`
                                : `${o.value}% off`)}
                            {o.first_order_only && " · first order only"}
                          </p>
                          {!o.applicable && o.needed_more > 0 && (
                            <p className="mt-1 text-xs text-warm-gray">
                              Add {formatPrice(o.needed_more, currency)} more to
                              unlock
                            </p>
                          )}
                        </div>
                        {o.applicable && (
                          <span className="whitespace-nowrap text-sm text-ink">
                            −{formatPrice(o.discount, currency)}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Payment */}
            <div>
              <h2 className="eyebrow mb-6">Payment</h2>
              <div className="space-y-3">
                <PaymentOption
                  active={payment === "online"}
                  onClick={() => setPayment("online")}
                  title="Pay online"
                  subtitle="UPI, cards, netbanking and wallets via Razorpay"
                />
                <PaymentOption
                  active={payment === "cod"}
                  onClick={() => cod?.available && setPayment("cod")}
                  disabled={!cod?.available}
                  title="Cash on delivery"
                  subtitle={
                    cod?.available
                      ? "Pay the courier when your order arrives"
                      : (cod?.reason ?? "Not available right now")
                  }
                />
              </div>
            </div>
          </div>

          {/* Bill */}
          <aside className="h-fit border border-border p-8 lg:sticky lg:top-28">
            <div className="eyebrow mb-6">Order summary</div>

            <ul className="mb-6 space-y-3 border-b border-border pb-6">
              {lines.map((l) => (
                <li
                  key={`${l.productId}-${l.color ?? ""}-${l.size ?? ""}`}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className="min-w-0 flex-1 truncate text-warm-gray">
                    {l.title}
                    <span className="text-warm-gray/70"> × {l.quantity}</span>
                  </span>
                  <span className="text-ink">
                    {formatPrice(l.price * l.quantity, currency)}
                  </span>
                </li>
              ))}
            </ul>

            <BillRow
              label="Subtotal"
              value={formatPrice(bill?.subtotal ?? subtotal, currency)}
            />
            {(bill?.discount ?? 0) > 0 && (
              <BillRow
                label={`Discount${coupon ? ` (${coupon})` : ""}`}
                value={`−${formatPrice(bill!.discount, currency)}`}
              />
            )}
            <BillRow
              label="Delivery"
              value={
                bill
                  ? bill.delivery_free
                    ? "Free"
                    : formatPrice(bill.delivery, currency)
                  : "—"
              }
            />
            <BillRow
              label="GST"
              value={bill ? formatPrice(bill.tax, currency) : "—"}
            />

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="eyebrow">Total</span>
              <span className="font-display text-2xl text-ink">
                {bill ? formatPrice(bill.total, currency) : "—"}
              </span>
            </div>

            {bill && !bill.deliverable && (
              <p className="mt-4 text-xs text-destructive">
                We don't deliver to this address yet.
              </p>
            )}

            <button
              disabled={
                busy ||
                !addressComplete ||
                !bill ||
                !bill.deliverable ||
                quote.isPending
              }
              onClick={() => place.mutate()}
              className="eyebrow mt-8 w-full bg-ink py-4 text-cream transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {busy
                ? "Processing…"
                : payment === "cod"
                  ? "Place order"
                  : "Pay now"}
            </button>

            <Link
              to="/policies"
              className="eyebrow mt-4 block text-center text-warm-gray hover:text-ink"
            >
              Refund &amp; return policy
            </Link>
          </aside>
        </div>
      </section>
    </SiteChrome>
  );
}

function BillRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-warm-gray">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}

function PaymentOption({
  active,
  onClick,
  disabled,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-start gap-4 border p-5 text-left transition-colors",
        active ? "border-ink bg-ink/5" : "border-border",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span
        className={cn(
          "mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border",
          active ? "border-ink" : "border-warm-gray",
        )}
      >
        {active && <span className="h-2 w-2 rounded-full bg-ink" />}
      </span>
      <span>
        <span className="block text-sm text-ink">{title}</span>
        <span className="mt-1 block text-xs text-warm-gray">{subtitle}</span>
      </span>
    </button>
  );
}
