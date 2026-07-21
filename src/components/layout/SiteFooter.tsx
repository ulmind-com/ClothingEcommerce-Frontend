import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsOptions } from "@/lib/api/queries";

export function SiteFooter() {
  const { data: settings } = useQuery(settingsOptions());
  const shop = settings?.shop;
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-cream mt-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-display text-3xl tracking-[0.32em] uppercase">
            Maison
          </div>
          <p className="mt-6 text-sm text-cream/70 leading-relaxed max-w-xs">
            Modern couture crafted in limited series. Each piece is finished by
            hand and shipped with care.
          </p>
        </div>

        <div>
          <div className="eyebrow text-cream/60 mb-5">Shop</div>
          <ul className="space-y-3 text-sm">
            <li><Link to="/shop" className="hover:text-champagne">New Arrivals</Link></li>
            <li><Link to="/shop" className="hover:text-champagne">Women</Link></li>
            <li><Link to="/shop" className="hover:text-champagne">Men</Link></li>
            <li><Link to="/shop" className="hover:text-champagne">Collections</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-cream/60 mb-5">Client Services</div>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-champagne">Shipping</Link></li>
            <li><Link to="/" className="hover:text-champagne">Returns</Link></li>
            <li><Link to="/" className="hover:text-champagne">Size Guide</Link></li>
            <li><Link to="/" className="hover:text-champagne">Care</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-cream/60 mb-5">Newsletter</div>
          <p className="text-sm text-cream/70 mb-4">
            Private invitations, campaigns and new arrivals.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center border-b border-cream/40 focus-within:border-champagne transition-colors"
          >
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-transparent py-3 text-sm placeholder:text-cream/50 focus:outline-none"
              aria-label="Email"
            />
            <button className="eyebrow text-cream hover:text-champagne">
              Join →
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/60">
          <div>© {year} {shop?.name || "Maison"} — All rights reserved.</div>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-champagne">Privacy</Link>
            <Link to="/" className="hover:text-champagne">Terms</Link>
            {shop?.email && <span>{shop.email}</span>}
          </div>
        </div>
      </div>
    </footer>
  );
}