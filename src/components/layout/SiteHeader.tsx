import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoriesOptions, unreadCountOptions } from "@/lib/api/queries";
import { useCart } from "@/lib/cart/store";
import { useAuth } from "@/lib/auth/store";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils/format";

export function SiteHeader({
  onOpenSearch,
  transparent = false,
}: {
  onOpenSearch: () => void;
  transparent?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { data: categories = [] } = useQuery(categoriesOptions());
  const cartCount = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const openCart = useCart((s) => s.setOpen);
  const signedIn = useAuth((s) => Boolean(s.token));
  const wishlistCount = useWishlist().ids.length;
  const { data: unread } = useQuery(unreadCountOptions(signedIn));
  const unreadCount = unread?.count ?? 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const roots = categories.filter((c) => !c.parent_id);

  const solid = scrolled || !transparent || hovered !== null || menuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color] duration-500",
        solid
          ? "bg-cream/95 text-ink backdrop-blur border-b border-border"
          : "bg-transparent text-cream border-b border-transparent",
      )}
      onMouseLeave={() => setHovered(null)}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:h-20 md:px-10">
        <div className="flex items-center gap-8">
          <button
            className="md:hidden"
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <nav className="hidden md:flex items-center gap-8">
            {roots.map((c) => (
              <div
                key={c.id}
                onMouseEnter={() => setHovered(c.id)}
                className="py-6"
              >
                <Link
                  to="/shop"
                  search={{ category: c.id, sort: "newest" }}
                  className="eyebrow hover:text-champagne transition-colors"
                >
                  {c.name}
                </Link>
              </div>
            ))}
            <Link
              to="/shop"
              search={{ sort: "newest" }}
              className="eyebrow hover:text-champagne transition-colors"
              onMouseEnter={() => setHovered(null)}
            >
              All
            </Link>
          </nav>
        </div>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2 select-none">
          <span className="font-display text-2xl md:text-3xl tracking-[0.35em] uppercase">
            Maison
          </span>
        </Link>

        <div className="flex items-center gap-3 md:gap-5">
          <button
            aria-label="Search"
            onClick={onOpenSearch}
            className="p-2 hover:text-champagne transition-colors"
          >
            <Search className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <Link
            to={signedIn ? "/account" : "/login"}
            search={signedIn ? undefined : { redirect: undefined }}
            aria-label={signedIn ? "Account" : "Sign in"}
            className="p-2 hover:text-champagne transition-colors hidden sm:inline-flex"
          >
            <User className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
          {signedIn && (
            <Link
              to="/notifications"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
              className="relative p-2 hover:text-champagne transition-colors hidden sm:inline-flex"
            >
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-champagne px-1 text-[10px] font-medium text-ink">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}
          <Link
            to="/wishlist"
            aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ""}`}
            className="relative p-2 hover:text-champagne transition-colors hidden sm:inline-flex"
          >
            <Heart className="h-4 w-4 md:h-5 md:w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-champagne px-1 text-[10px] font-medium text-ink">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button
            aria-label={`Bag (${cartCount})`}
            onClick={() => openCart(true)}
            className="relative p-2 hover:text-champagne transition-colors"
          >
            <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-champagne px-1 text-[10px] font-medium text-ink">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mega menu */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block border-t border-border bg-cream text-ink"
          >
            <div className="mx-auto grid max-w-[1400px] grid-cols-4 gap-10 px-10 py-10">
              <div className="col-span-1">
                <div className="eyebrow mb-4">
                  {roots.find((r) => r.id === hovered)?.name}
                </div>
                <ul className="space-y-3">
                  {categories
                    .filter((c) => c.parent_id === hovered)
                    .slice(0, 8)
                    .map((child) => (
                      <li key={child.id}>
                        <Link
                          to="/shop"
                          search={{ category: child.id, sort: "newest" }}
                          className="text-sm hover:text-champagne transition-colors"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="col-span-3 grid grid-cols-2 gap-6">
                {categories
                  .filter((c) => c.parent_id === hovered && c.image)
                  .slice(0, 2)
                  .map((c) => (
                    <Link
                      key={c.id}
                      to="/shop"
                      search={{ category: c.id, sort: "newest" }}
                      className="group relative aspect-[16/9] overflow-hidden bg-secondary"
                    >
                      <img
                        src={c.image!}
                        alt={c.name}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <span className="absolute bottom-4 left-4 eyebrow bg-cream/90 px-3 py-1.5">
                        {c.name}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-cream text-ink overflow-hidden"
          >
            <ul className="px-6 py-6 space-y-4">
              {roots.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/shop"
                    search={{ category: c.id, sort: "newest" }}
                    onClick={() => setMenuOpen(false)}
                    className="block text-lg font-display"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/shop"
                  search={{ sort: "newest" }}
                  onClick={() => setMenuOpen(false)}
                  className="block text-lg font-display"
                >
                  All
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}