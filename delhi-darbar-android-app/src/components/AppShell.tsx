"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cx, inr, RESTAURANT } from "@/lib/utils";
import { useCart } from "./CartProvider";
import {
  ArrowRightIcon,
  ChefHatIcon,
  MinusIcon,
  PhoneIcon,
  PlusIcon,
  ReceiptIcon,
  UserIcon,
} from "./icons";

type Tab = "menu" | "orders" | "contact" | "account";

const TABS: Array<{ key: Tab; href: string; label: string; icon: (c: string) => React.ReactNode }> = [
  { key: "menu", href: "/", label: "Menu", icon: (c) => <ChefHatIcon className={c} /> },
  { key: "orders", href: "/orders", label: "Orders", icon: (c) => <ReceiptIcon className={c} /> },
  { key: "contact", href: "/contact", label: "Contact", icon: (c) => <PhoneIcon className={c} /> },
  { key: "account", href: "/account", label: "Account", icon: (c) => <UserIcon className={c} /> },
];

export function AppShell({ active, children }: { active: Tab; children: React.ReactNode }) {
  const router = useRouter();
  const { count, total, detail, add, dec, clear, drawerOpen, setDrawerOpen } = useCart();

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <header className="z-30 flex items-center gap-3 border-b border-line bg-bg px-4 py-3">
        <img
          src="/images/logo.png"
          alt="The Delhi Darbar chef mascot"
          className="h-10 w-10 rounded-xl border border-line object-cover"
        />
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-[17px] font-bold leading-tight text-gold">
            The Delhi Darbar
          </h1>
          <p className="truncate text-[11px] font-medium text-muted">
            Restaurant &amp; Fast Food · K.P. Road, Anantnag
          </p>
        </div>
        <a
          href={`tel:${RESTAURANT.tel[0]}`}
          className="grid h-10 w-10 place-items-center rounded-xl border border-flame/50 bg-flame/10 text-flame active:scale-95 transition"
          aria-label="Call the restaurant"
        >
          <PhoneIcon className="h-4.5 w-4.5" />
        </a>
      </header>

      {/* Scrollable content */}
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</main>

      {/* Floating cart summary */}
      {count > 0 && !drawerOpen && (
        <button
          onClick={() => setDrawerOpen(true)}
          className="dd-slide-up mx-4 mb-2 flex items-center justify-between rounded-2xl bg-flame px-4 py-3.5 text-bg shadow-[0_14px_34px_-10px_rgba(255,122,31,0.55)] active:scale-[0.99] transition"
        >
          <span className="text-[13px] font-extrabold">
            {count} item{count > 1 ? "s" : ""} · {inr(total)}
          </span>
          <span className="flex items-center gap-1.5 text-[13px] font-extrabold tracking-wide">
            View Cart <ArrowRightIcon className="h-4 w-4" />
          </span>
        </button>
      )}

      {/* Bottom navigation */}
      <nav className="grid grid-cols-4 border-t border-line bg-surface/80 px-1 pb-[max(env(safe-area-inset-bottom),6px)] pt-1">
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <Link
              key={t.key}
              href={t.href}
              className={cx(
                "flex flex-col items-center gap-0.5 rounded-xl py-2 transition",
                isActive ? "text-gold" : "text-muted",
              )}
            >
              {t.icon("h-[22px] w-[22px]")}
              <span className="text-[10px] font-bold tracking-wide">{t.label}</span>
              <span
                className={cx(
                  "h-1 w-1 rounded-full",
                  isActive ? "bg-gold" : "bg-transparent",
                )}
              />
            </Link>
          );
        })}
      </nav>

      {/* Cart drawer */}
      {drawerOpen && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end">
          <button
            className="dd-fade absolute inset-0 bg-black/70"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close cart"
          />
          <div className="dd-slide-up relative max-h-[82%] overflow-y-auto rounded-t-3xl border-t border-line bg-surface">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface px-4 py-3.5">
              <div>
                <h2 className="font-display text-[16px] font-bold text-gold">Your Cart</h2>
                <p className="text-[11px] text-muted">
                  {count} item{count > 1 ? "s" : ""} · freshly cooked in 20–30 min
                </p>
              </div>
              <div className="flex items-center gap-2">
                {count > 0 && (
                  <button
                    onClick={() => {
                      clear();
                      setDrawerOpen(false);
                    }}
                    className="text-[11px] font-bold text-chili"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-2.5 px-4 py-4">
              {detail.map((d) => (
                <div key={d.id} className="flex items-center gap-3">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="h-11 w-11 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-cream">{d.name}</p>
                    <p className="text-[12px] font-bold text-gold">
                      {inr(d.price)}
                      <span className="text-muted"> × {d.qty} = {inr(d.lineTotal)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-flame px-1 py-1 text-bg">
                    <button
                      onClick={() => dec(d.id)}
                      className="grid h-6 w-6 place-items-center active:scale-90 transition"
                      aria-label="Decrease"
                    >
                      <MinusIcon className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-4 text-center text-[12px] font-extrabold">{d.qty}</span>
                    <button
                      onClick={() => add(d.id)}
                      className="grid h-6 w-6 place-items-center active:scale-90 transition"
                      aria-label="Increase"
                    >
                      <PlusIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-4 space-y-1.5 rounded-2xl border border-line bg-raise p-3.5 text-[13px]">
                <div className="flex justify-between text-muted">
                  <span>Item total</span>
                  <span className="font-semibold text-cream">{inr(total)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Delivery</span>
                  <span className="font-semibold text-leaf">Free</span>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-[15px] font-extrabold">
                  <span className="text-cream">To pay</span>
                  <span className="text-gold">{inr(total)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  router.push("/checkout");
                }}
                className="w-full rounded-2xl bg-flame py-3.5 text-[14px] font-extrabold tracking-wide text-bg active:scale-[0.99] transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
