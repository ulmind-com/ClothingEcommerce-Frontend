export function formatPrice(value: number, currency = "₹") {
  if (!Number.isFinite(value)) return `${currency}0`;
  return `${currency}${Math.round(value).toLocaleString("en-IN")}`;
}

export function discountPct(mrp: number, price: number) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}