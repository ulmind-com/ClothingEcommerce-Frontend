import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  Heart,
  Package,
  RotateCcw,
  ScrollText,
  Tag,
} from "lucide-react";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { LuxButton, LuxField } from "@/components/auth/AuthLayout";
import { updateMe } from "@/lib/api/auth";
import {
  ordersOptions,
  qk,
  returnsOptions,
  unreadCountOptions,
  wishlistIdsOptions,
} from "@/lib/api/queries";
import { useAuth } from "@/lib/auth/store";

export const Route = createFileRoute("/account")({
  component: () => (
    <RequireAuth>
      <AccountPage />
    </RequireAuth>
  ),
});

const EASE = [0.22, 1, 0.36, 1] as const;

function AccountPage() {
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const signOut = useAuth((s) => s.signOut);
  const queryClient = useQueryClient();

  // Counts turn the nav tiles into a real dashboard rather than a link list.
  const { data: orders = [] } = useQuery(ordersOptions(true));
  const { data: returns = [] } = useQuery(returnsOptions(true));
  const { data: wishlist } = useQuery(wishlistIdsOptions(true));
  const { data: unread } = useQuery(unreadCountOptions(true));

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user]);

  const save = useMutation({
    mutationFn: () => updateMe({ name: name.trim(), phone: phone.trim() }),
    onSuccess: (me) => {
      setUser(me);
      queryClient.setQueryData(qk.me, me);
      toast.success("Profile updated");
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Could not save"),
  });

  const dirty =
    name.trim() !== (user?.name ?? "") || phone.trim() !== (user?.phone ?? "");

  const initials = (user?.name ?? "?")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const activeOrders = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled",
  ).length;

  const tiles = [
    {
      to: "/orders",
      label: "Orders",
      icon: Package,
      meta: activeOrders > 0 ? `${activeOrders} in progress` : `${orders.length} total`,
    },
    {
      to: "/returns",
      label: "Returns & refunds",
      icon: RotateCcw,
      meta: returns.length > 0 ? `${returns.length} open` : "None yet",
    },
    {
      to: "/wishlist",
      label: "Wishlist",
      icon: Heart,
      meta: `${wishlist?.ids.length ?? 0} saved`,
    },
    {
      to: "/notifications",
      label: "Notifications",
      icon: Bell,
      meta: (unread?.count ?? 0) > 0 ? `${unread!.count} unread` : "All read",
    },
    { to: "/offers", label: "Offers", icon: Tag, meta: "Current codes" },
    { to: "/policies", label: "Policies", icon: ScrollText, meta: "Returns, delivery, tax" },
  ] as const;

  return (
    <SiteChrome>
      <section className="mx-auto max-w-[1100px] px-6 pb-32 pt-32 md:px-10">
        {/* Identity */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col items-start gap-8 border-b border-border pb-12 sm:flex-row sm:items-center"
        >
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-ink">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="font-display text-3xl text-cream">
                {initials}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="eyebrow mb-3">Account</div>
            <h1 className="font-display text-4xl leading-none text-ink md:text-5xl">
              {user?.name ?? "Your account"}
            </h1>
            <p className="mt-3 text-sm text-warm-gray">{user?.email}</p>
          </div>
        </motion.header>

        {/* Dashboard tiles */}
        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t, i) => (
            <motion.div
              key={t.to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 * i, ease: EASE }}
            >
              <Link
                to={t.to}
                className="group flex h-full flex-col justify-between gap-10 bg-cream p-8 transition-colors hover:bg-ink"
              >
                <t.icon className="h-5 w-5 text-champagne" />
                <div>
                  <div className="eyebrow text-ink transition-colors group-hover:text-cream">
                    {t.label}
                  </div>
                  <p className="mt-2 text-sm text-warm-gray transition-colors group-hover:text-cream/60">
                    {t.meta}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Profile */}
        <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="eyebrow mb-8">Your details</div>
            <form
              className="max-w-md space-y-8"
              onSubmit={(e) => {
                e.preventDefault();
                save.mutate();
              }}
            >
              <LuxField
                label="Full name"
                value={name}
                onChange={setName}
                autoComplete="name"
              />
              <LuxField
                label="Phone"
                value={phone}
                onChange={setPhone}
                inputMode="tel"
                autoComplete="tel"
              />
              <div>
                <span className="eyebrow text-[0.65rem] text-warm-gray">
                  Email
                </span>
                <p className="mt-2 border-b border-border pb-3 pt-1 text-[0.95rem] text-warm-gray">
                  {user?.email}
                </p>
                <p className="mt-2 text-xs text-warm-gray">
                  Your email is fixed to the account and can't be changed here.
                </p>
              </div>
              <div className="pt-2">
                <LuxButton disabled={!dirty || save.isPending}>
                  {save.isPending
                    ? "Saving…"
                    : dirty
                      ? "Save changes"
                      : "Saved"}
                </LuxButton>
              </div>
            </form>
          </div>

          <aside className="h-fit border border-border p-8">
            <div className="eyebrow mb-4">Session</div>
            <p className="text-sm leading-relaxed text-warm-gray">
              Signing out clears your saved session on this device. Your bag
              stays where it is.
            </p>
            <button
              onClick={() => {
                signOut();
                queryClient.clear();
                toast.success("Signed out");
              }}
              className="eyebrow mt-8 w-full border border-border py-3.5 text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              Sign out
            </button>
          </aside>
        </div>
      </section>
    </SiteChrome>
  );
}
