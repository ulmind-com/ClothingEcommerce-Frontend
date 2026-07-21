import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsOptions } from "@/lib/api/queries";
import atelierFooter from "@/assets/atelier-footer.png.asset.json";

export function SiteFooter() {
  const { data: settings } = useQuery(settingsOptions());
  const shop = settings?.shop;
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24" style={{ backgroundColor: "#d9bc8b" }}>
      <div className="w-full">
        <img
          src={atelierFooter.url}
          alt="Maison atelier — four models in recessed niches"
          className="block w-full h-auto select-none -mb-px"
          draggable={false}
        />
      </div>
      <div className="text-ink" style={{ backgroundColor: "#d9bc8b" }}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-2 pb-10 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="font-display text-3xl tracking-[0.32em] uppercase text-ink">
              Maison
            </div>
            <p className="mt-6 text-sm text-ink/70 leading-relaxed max-w-xs">
              Modern couture crafted in limited series. Each piece is finished by
              hand and shipped with care.
            </p>
          </div>

          <div>
            <div className="eyebrow text-ink/60 mb-5">Shop</div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop" className="text-ink/80 hover:text-ink">New Arrivals</Link></li>
              <li><Link to="/shop" className="text-ink/80 hover:text-ink">Women</Link></li>
              <li><Link to="/shop" className="text-ink/80 hover:text-ink">Men</Link></li>
              <li><Link to="/shop" className="text-ink/80 hover:text-ink">Collections</Link></li>
            </ul>
          </div>
          <div>
            <div className="eyebrow text-ink/60 mb-5">Client Services</div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-ink/80 hover:text-ink">Shipping</Link></li>
              <li><Link to="/" className="text-ink/80 hover:text-ink">Returns</Link></li>
              <li><Link to="/" className="text-ink/80 hover:text-ink">Size Guide</Link></li>
              <li><Link to="/" className="text-ink/80 hover:text-ink">Care</Link></li>
            </ul>
          </div>

          <div>
            <div className="eyebrow text-ink/60 mb-5">Newsletter</div>
            <p className="text-sm text-ink/70 mb-4">
              Private invitations, campaigns and new arrivals.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center border-b border-ink/40 focus-within:border-ink transition-colors"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent py-3 text-sm text-ink placeholder:text-ink/50 focus:outline-none"
                aria-label="Email"
              />
              <button className="eyebrow text-ink hover:text-ink/70">
                Join →
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-ink/15">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink/70">
            <div>© {year} {shop?.name || "Clothing Store"} — All rights reserved.</div>
            <div className="flex gap-6">
              <Link to="/" className="hover:text-ink">Privacy</Link>
              <Link to="/" className="hover:text-ink">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}