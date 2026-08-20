"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AddressMap, type Picked } from "@/components/AddressMap";
import { CartProvider, useCart } from "@/components/CartProvider";
import {
  ArrowRightIcon,
  CakeIcon,
  CashIcon,
  CardIcon,
  CheckIcon,
  ChefHatIcon,
  PinIcon,
} from "@/components/icons";
import { BackHeader, Field, inputCls, Spinner, VegDot } from "@/components/ui";
import { inr, isValidPhone, normalizePhone } from "@/lib/utils";
import { readUser, type ClientUser } from "@/lib/client";
import type { Order, SavedAddress } from "@/lib/types";

function CheckoutInner() {
  const router = useRouter();
  const { detail, total, clear } = useCart();
  const [user] = useState<ClientUser | null>(() => readUser());
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [method, setMethod] = useState<"cod" | "online">("cod");
  const [picked, setPicked] = useState<Picked | null>(null);
  const [ext, setExt] = useState<Picked | null>(null);
  const [saved, setSaved] = useState<SavedAddress[]>([]);
  const [saveAddr, setSaveAddr] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const loadAddresses = useCallback(async (p: string) => {
    try {
      const res = await fetch(`/api/addresses?phone=${p}`);
      const data = (await res.json()) as { addresses?: SavedAddress[] };
      setSaved(data.addresses ?? []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (isValidPhone(phone)) loadAddresses(phone);
  }, [phone, loadAddresses]);

  const applySaved = (a: SavedAddress) => {
    if (a.lat != null && a.lng != null) {
      const p = { lat: a.lat, lng: a.lng, label: a.line };
      setPicked(p);
      setExt(p);
    }
  };

  const placeOrder = async () => {
    setError("");
    if (name.trim().length < 2) return setError("Please enter your name");
    if (!isValidPhone(phone)) return setError("Enter a valid 10-digit mobile number");
    if (!picked) return setError("Search for your address and drop the pin on the map");
    setPlacing(true);
    try {
      if (saveAddr && picked) {
        await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: normalizePhone(phone),
            label: "Home",
            line: picked.label,
            lat: picked.lat,
            lng: picked.lng,
          }),
        });
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizePhone(phone),
          name: name.trim(),
          addressLine: picked!.label,
          lat: picked!.lat,
          lng: picked!.lng,
          items: detail.map((d) => ({ id: d.id, qty: d.qty })),
          subtotal: total,
          total,
          paymentMethod: method,
        }),
      });
      const data = (await res.json()) as { ok: boolean; order?: Order; error?: string };
      if (!data.ok || !data.order) {
        setError(data.error ?? "Could not place your order. Please try again.");
        setPlacing(false);
        return;
      }
      const order = data.order;
      const recent = JSON.parse(localStorage.getItem("ddd_recent_v1") ?? "[]") as Array<{
        id: number;
        code: string;
      }>;
      recent.unshift({ id: order.id, code: order.code });
      localStorage.setItem("ddd_recent_v1", JSON.stringify(recent.slice(0, 12)));
      clear();
      router.replace(method === "online" ? `/pay?order=${order.id}` : `/order/${order.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setPlacing(false);
    }
  };

  if (detail.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        <ChefHatIcon className="h-14 w-14 text-gold/60" />
        <div>
          <h2 className="font-display text-xl font-bold text-cream">Your cart is empty</h2>
          <p className="mt-1 text-[13px] text-muted">
            Add something delicious from the menu first.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-2xl bg-flame px-6 py-3 text-[13px] font-extrabold text-bg"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BackHeader title="Checkout" sub="Fresh from our kitchen · 20–30 min prep" href="/" />

      <main className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-36 pt-4">
        {/* Details */}
        <section className="space-y-3 rounded-2xl border border-line bg-surface p-4">
          <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">
            Your details
          </h3>
          {user && (
            <p className="text-[11.5px] font-semibold text-muted">
              Signed in as <span className="text-cream">{user.name}</span> ·{" "}
              {user.phone}
            </p>
          )}
          <Field label="Full name">
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarif Bhat"
            />
          </Field>
          <Field label="Mobile number">
            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-line bg-raise px-3 py-3 text-[14px] font-bold text-gold">
                +91
              </span>
              <input
                className={inputCls}
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(normalizePhone(e.target.value))}
                placeholder="10-digit number"
                maxLength={10}
              />
            </div>
          </Field>
        </section>

        {/* Address */}
        <section className="space-y-3 rounded-2xl border border-line bg-surface p-4">
          <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">
            Delivery address
          </h3>

          {saved.length > 0 && (
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
              {saved.map((a) => (
                <button
                  key={a.id}
                  onClick={() => applySaved(a)}
                  className="whitespace-nowrap rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-[11px] font-bold text-gold transition active:scale-95"
                >
                  {a.label} · {a.line.split(",").slice(0, 2).join(",").slice(0, 34)}…
                </button>
              ))}
            </div>
          )}

          <AddressMap initial={picked} external={ext} onPick={setPicked} className="h-72" />

          {picked ? (
            <div className="flex items-start gap-2 rounded-xl border border-leaf/30 bg-leaf/10 px-3 py-2.5">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
              <p className="line-clamp-2 text-[12px] font-semibold text-cream">{picked.label}</p>
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-xl border border-gold/30 bg-gold/10 px-3 py-2.5">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <p className="text-[12px] font-semibold text-gold">
                Search for your address above, or drag the pin to your exact spot on the map.
              </p>
            </div>
          )}

          <label className="flex items-center gap-2.5 pt-1 text-[12.5px] font-semibold text-cream">
            <input
              type="checkbox"
              checked={saveAddr}
              onChange={(e) => setSaveAddr(e.target.checked)}
              className="h-4 w-4 accent-[#F2B84B]"
            />
            Save this address for faster reordering
          </label>
        </section>

        {/* Payment */}
        <section className="space-y-2.5 rounded-2xl border border-line bg-surface p-4">
          <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">
            Payment method
          </h3>

          <button
            onClick={() => setMethod("cod")}
            className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
              method === "cod"
                ? "border-flame bg-flame/10"
                : "border-line bg-raise"
            }`}
          >
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                method === "cod" ? "bg-flame text-bg" : "bg-surface text-gold"
              }`}
            >
              <CashIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 text-[13.5px] font-extrabold text-cream">
                Cash on Delivery
                <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-gold">
                  MOST POPULAR
                </span>
              </span>
              <span className="mt-0.5 block text-[11.5px] font-medium text-muted">
                Pay in cash when your food arrives. No online payment needed.
              </span>
            </span>
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                method === "cod" ? "border-flame" : "border-line"
              }`}
            >
              {method === "cod" && <span className="h-2.5 w-2.5 rounded-full bg-flame" />}
            </span>
          </button>

          <button
            onClick={() => setMethod("online")}
            className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
              method === "online"
                ? "border-gold bg-gold/10"
                : "border-line bg-raise"
            }`}
          >
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                method === "online" ? "bg-gold text-bg" : "bg-surface text-gold"
              }`}
            >
              <CardIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="text-[13.5px] font-extrabold text-cream">Pay Online</span>
              <span className="mt-0.5 block text-[11.5px] font-medium text-muted">
                Pay securely by UPI or card before we start cooking.
              </span>
            </span>
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                method === "online" ? "border-gold" : "border-line"
              }`}
            >
              {method === "online" && <span className="h-2.5 w-2.5 rounded-full bg-gold" />}
            </span>
          </button>
        </section>

        {/* Summary */}
        <section className="rounded-2xl border border-line bg-surface p-4">
          <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">
            Order summary
          </h3>
          <div className="mt-3 space-y-2.5">
            {detail.map((d) => (
              <div key={d.id} className="flex items-center gap-2.5">
                <VegDot veg={d.veg} />
                <p className="min-w-0 flex-1 truncate text-[13px] font-semibold text-cream">
                  {d.name} <span className="text-muted">× {d.qty}</span>
                </p>
                <p className="text-[13px] font-bold text-cream">{inr(d.lineTotal)}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1.5 border-t border-line pt-3 text-[13px]">
            <div className="flex justify-between text-muted">
              <span>Item total</span>
              <span className="font-semibold text-cream">{inr(total)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Delivery</span>
              <span className="font-semibold text-leaf">Free</span>
            </div>
            <div className="flex justify-between pt-1 text-[15px] font-extrabold">
              <span className="text-cream">To pay</span>
              <span className="text-gold">{inr(total)}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky CTA */}
      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-4 pb-[max(env(safe-area-inset-bottom),14px)] pt-3 backdrop-blur">
        {error && (
          <p className="mb-2 text-center text-[11.5px] font-bold text-chili">{error}</p>
        )}
        <button
          onClick={placeOrder}
          disabled={placing}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-flame py-4 text-[14px] font-extrabold tracking-wide text-bg transition active:scale-[0.99] disabled:opacity-60"
        >
          {placing ? (
            <>
              <Spinner className="border-bg/40 border-t-bg" /> Placing your order…
            </>
          ) : (
            <>
              {method === "cod" ? "Place order · Pay on delivery" : "Place order · Pay online"}{" "}
              {inr(total)}
              <ArrowRightIcon className="h-4.5 w-4.5" />
            </>
          )}
        </button>
        <p className="mt-2 flex items-center justify-center gap-1 text-center text-[10.5px] font-semibold text-muted">
          <CakeIcon className="h-3.5 w-3.5" />
          Planning a party or catering? Call us — we'd love to help.
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutInner />
    </CartProvider>
  );
}
