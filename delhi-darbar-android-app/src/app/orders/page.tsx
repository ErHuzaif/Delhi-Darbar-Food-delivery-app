"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { CartProvider } from "@/components/CartProvider";
import { ReceiptIcon } from "@/components/icons";
import { Badge } from "@/components/ui";
import { fmtDate, inr, orderProgress } from "@/lib/utils";
import { readRecent, readUser, type ClientUser } from "@/lib/client";
import type { Order } from "@/lib/types";

const STAGE_TONE: Record<string, "gold" | "flame" | "leaf"> = {
  placed: "gold",
  preparing: "flame",
  out: "gold",
  delivered: "leaf",
};

export default function OrdersPage() {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const u = readUser();
    setUser(u);
    let alive = true;
    (async () => {
      if (u) {
        try {
          const res = await fetch(`/api/orders?phone=${u.phone}`);
          const data = (await res.json()) as { orders?: Order[] };
          if (alive) setOrders(data.orders ?? []);
        } catch {
          /* ignore */
        }
      } else {
        const recent = readRecent();
        const loaded = await Promise.all(
          recent.map(async (r) => {
            try {
              const res = await fetch(`/api/orders/${r.id}`);
              const data = (await res.json()) as { ok: boolean; order?: Order };
              return data.ok ? (data.order as Order) : null;
            } catch {
              return null;
            }
          }),
        );
        if (alive) setOrders(loaded.filter((o): o is Order => o !== null));
      }
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(t);
  }, []);

  return (
    <CartProvider>
      <AppShell active="orders">
        <div className="space-y-3 px-4 py-4">
          <div>
            <h2 className="font-display text-[22px] font-bold text-cream">My Orders</h2>
            <p className="text-[12px] font-semibold text-muted">
              {user ? `Signed in · +91 ${user.phone}` : "Recent orders on this device"}
            </p>
          </div>

          {!user && (
            <div className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-3.5">
              <p className="flex-1 text-[12px] font-semibold leading-snug text-gold">
                Sign in with your phone to see all your orders from any device.
              </p>
              <Link
                href="/account"
                className="shrink-0 rounded-xl bg-gold px-3.5 py-2 text-[11.5px] font-extrabold text-bg"
              >
                Sign in
              </Link>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-[12px] font-semibold text-muted">
              Loading your orders…
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-line bg-surface py-14 text-center">
              <ReceiptIcon className="h-12 w-12 text-gold/50" />
              <div>
                <p className="font-display text-lg font-bold text-cream">No orders yet</p>
                <p className="mt-1 text-[12px] text-muted">
                  Your next Wazwan is a few taps away.
                </p>
              </div>
              <Link
                href="/"
                className="rounded-2xl bg-flame px-6 py-3 text-[13px] font-extrabold text-bg"
              >
                Explore the menu
              </Link>
            </div>
          ) : (
            orders.map((o) => {
              const prog = orderProgress(new Date(o.placedAt).getTime(), now);
              const count = o.items.reduce((s, i) => s + i.qty, 0);
              return (
                <Link
                  key={o.id}
                  href={`/order/${o.id}`}
                  className="block rounded-2xl border border-line bg-surface p-4 transition active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[14px] font-extrabold text-cream">{o.code}</p>
                        <Badge tone={STAGE_TONE[prog.stage.key]}>
                          {prog.stage.label}
                        </Badge>
                      </div>
                      <p className="mt-1 text-[11.5px] font-semibold text-muted">
                        {fmtDate(new Date(o.placedAt).getTime())} · {count} item
                        {count > 1 ? "s" : ""} ·{" "}
                        {o.paymentMethod === "cod" ? "Cash on Delivery" : "Paid online"}
                      </p>
                      <p className="mt-1.5 truncate text-[11.5px] font-medium text-muted">
                        {o.items
                          .slice(0, 2)
                          .map((i) => i.name)
                          .join(", ")}
                        {o.items.length > 2 ? "…" : ""}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[15px] font-extrabold text-gold">{inr(o.total)}</p>
                      <p className="mt-1 text-[11px] font-bold text-flame">Track →</p>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </AppShell>
    </CartProvider>
  );
}
