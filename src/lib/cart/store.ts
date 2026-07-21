import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

interface CartState {
  lines: CartLine[];
  open: boolean;
  add: (line: CartLine) => void;
  remove: (productId: string, color?: string, size?: string) => void;
  clear: () => void;
  setOpen: (v: boolean) => void;
  count: () => number;
  subtotal: () => number;
}

const lineKey = (l: Pick<CartLine, "productId" | "color" | "size">) =>
  `${l.productId}::${l.color ?? ""}::${l.size ?? ""}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      open: false,
      add: (line) =>
        set((s) => {
          const key = lineKey(line);
          const idx = s.lines.findIndex((l) => lineKey(l) === key);
          if (idx >= 0) {
            const next = [...s.lines];
            next[idx] = {
              ...next[idx],
              quantity: next[idx].quantity + line.quantity,
            };
            return { lines: next, open: true };
          }
          return { lines: [...s.lines, line], open: true };
        }),
      remove: (productId, color, size) =>
        set((s) => ({
          lines: s.lines.filter(
            (l) => lineKey(l) !== lineKey({ productId, color, size }),
          ),
        })),
      clear: () => set({ lines: [] }),
      setOpen: (v) => set({ open: v }),
      count: () => get().lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: () =>
        get().lines.reduce((n, l) => n + l.price * l.quantity, 0),
    }),
    { name: "lux_cart_v1" },
  ),
);