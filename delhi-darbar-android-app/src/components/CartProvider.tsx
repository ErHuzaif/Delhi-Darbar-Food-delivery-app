"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { menuItemById, type FlatItem } from "@/data/menu";
import { CART_KEY } from "@/lib/client";

export type CartLine = { id: string; qty: number };
export type CartDetail = FlatItem & { qty: number; lineTotal: number };

type CartCtx = {
  lines: CartLine[];
  detail: CartDetail[];
  count: number;
  total: number;
  add: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const add = useCallback((id: string) => {
    setLines((prev) => {
      const found = prev.find((l) => l.id === id);
      if (!found) return [...prev, { id, qty: 1 }];
      return prev.map((l) => (l.id === id ? { ...l, qty: Math.min(20, l.qty + 1) } : l));
    });
  }, []);

  const dec = useCallback((id: string) => {
    setLines((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const detail = useMemo<CartDetail[]>(
    () =>
      lines
        .map((l) => {
          const item = menuItemById(l.id);
          return item ? { ...item, qty: l.qty, lineTotal: item.price * l.qty } : null;
        })
        .filter((x): x is CartDetail => x !== null),
    [lines],
  );

  const count = useMemo(() => detail.reduce((s, d) => s + d.qty, 0), [detail]);
  const total = useMemo(() => detail.reduce((s, d) => s + d.lineTotal, 0), [detail]);

  const value = useMemo(
    () => ({ lines, detail, count, total, add, dec, clear, drawerOpen, setDrawerOpen }),
    [lines, detail, count, total, add, dec, clear, drawerOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
