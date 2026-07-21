import type { Product } from "@/types/api";

export function productImage(p: Product, index = 0): string {
  const fromColor = p.colors?.[0]?.images?.[index];
  return (
    fromColor ||
    p.images?.[index] ||
    p.colors?.[0]?.images?.[0] ||
    p.images?.[0] ||
    ""
  );
}

export function productHoverImage(p: Product): string | null {
  const hover =
    p.images?.[1] ||
    p.colors?.[0]?.images?.[1] ||
    p.colors?.[1]?.images?.[0] ||
    null;
  return hover;
}

export function productInStock(p: Product): boolean {
  if (typeof p.stock === "number" && p.stock > 0) return true;
  return (p.colors ?? []).some((c) =>
    c.stock > 0 || (c.sizes ?? []).some((s) => s.stock > 0),
  );
}