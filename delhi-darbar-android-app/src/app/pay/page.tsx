"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BackHeader, Field, inputCls, Spinner } from "@/components/ui";
import { ArrowRightIcon, CardIcon, CheckIcon, ShieldIcon } from "@/components/icons";
import { cx, inr } from "@/lib/utils";
import type { Order } from "@/lib/types";

function formatCardNumber(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 16);
  return d.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + "/" + d.slice(2);
}

function PayInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const id = Number(sp.get("order"));
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upi" | "card">("upi");
  const [vpa, setVpa] = useState("");
  const [num, setNum] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = (await res.json()) as { ok: boolean; order?: Order };
      setOrder(data.order ?? null);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const paid = done || order?.paymentStatus === "paid";

  const pay = async () => {
    setErr("");
    if (tab === "upi") {
      if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(vpa.trim())) {
        setErr("Enter a valid UPI ID, e.g. name@bank");
        return;
      }
    } else {
      const digits = num.replace(/\s/g, "");
      if (digits.length < 16) return setErr("Enter the 16-digit card number");
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) return setErr("Enter a valid expiry (MM/YY)");
      if (!/^\d{3,4}$/.test(cvv)) return setErr("Enter the CVV");
    }
    setPaying(true);
    try {
      await fetch(`/api/orders/${id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: tab }),
      });
      // Simulate gateway round-trip for realism
      await new Promise((r) => setTimeout(r, 600));
      await load();
      setDone(true);
    } catch {
      setErr("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (!id) {
    return (
      <div className="flex flex-1 flex-col">
        <BackHeader title="Pay Online" href="/" />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <p className="font-display text-lg text-cream">No order selected</p>
          <Link href="/" className="text-[13px] font-bold text-flame">
            ← Back to menu
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <BackHeader title="Pay Online" href="/checkout" />
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="h-6 w-6" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-1 flex-col">
        <BackHeader title="Pay Online" href="/" />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <p className="font-display text-lg text-cream">Order not found</p>
          <Link href="/" className="text-[13px] font-bold text-flame">
            ← Back to menu
          </Link>
        </div>
      </div>
    );
  }

  if (paid) {
    return (
      <div className="flex flex-1 flex-col">
        <BackHeader title="Payment successful" sub={order.code} href={`/order/${order.id}`} />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <span className="dd-pulse grid h-20 w-20 place-items-center rounded-full bg-leaf/15 text-leaf">
            <CheckIcon className="h-10 w-10" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold text-cream">Payment successful</h2>
            <p className="mt-1 text-[13px] text-muted">
              {inr(order.total)} paid {tab === "card" ? "by card" : "via UPI"} · test mode
            </p>
          </div>
          <Link
            href={`/order/${order.id}`}
            className="flex items-center gap-2 rounded-2xl bg-flame px-8 py-3.5 text-[14px] font-extrabold text-bg"
          >
            Track my order <ArrowRightIcon className="h-4.5 w-4.5" />
          </Link>
          <p className="text-[11px] text-muted">
            Your kitchen has started the clock — 20–30 minutes of fresh cooking.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BackHeader title="Pay Online" sub={order.code} href="/checkout" />
      <main className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 pb-32">
        {/* Amount card */}
        <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-raise via-surface to-bg p-5 text-center">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gold/15 blur-3xl" />
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            The Delhi Darbar
          </p>
          <p className="mt-2 font-display text-4xl font-bold text-gold">{inr(order.total)}</p>
          <p className="mt-1 text-[12px] font-semibold text-muted">
            {order.items.reduce((s, i) => s + i.qty, 0)} items · order {order.code}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-3 py-2.5">
          <ShieldIcon className="h-4 w-4 shrink-0 text-gold" />
          <p className="text-[11px] font-semibold leading-snug text-gold">
            Test checkout — no money moves. Add your Razorpay keys to accept real UPI &amp; card
            payments.
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-line bg-surface p-1.5">
          {(["upi", "card"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cx(
                "flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-extrabold transition",
                tab === t ? "bg-gold text-bg" : "text-muted",
              )}
            >
              {t === "upi" ? (
                <>
                  <ShieldIcon className="h-4 w-4" /> UPI
                </>
              ) : (
                <>
                  <CardIcon className="h-4 w-4" /> Card
                </>
              )}
            </button>
          ))}
        </div>

        {/* Payment fields */}
        <section className="space-y-3.5 rounded-2xl border border-line bg-surface p-4">
          {tab === "upi" ? (
            <Field label="Your UPI ID">
              <input
                className={inputCls}
                value={vpa}
                onChange={(e) => setVpa(e.target.value)}
                placeholder="name@okbank"
                autoCapitalize="none"
              />
            </Field>
          ) : (
            <>
              <Field label="Card number">
                <input
                  className={inputCls}
                  inputMode="numeric"
                  value={num}
                  onChange={(e) => setNum(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Expiry">
                  <input
                    className={inputCls}
                    inputMode="numeric"
                    value={exp}
                    onChange={(e) => setExp(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                  />
                </Field>
                <Field label="CVV">
                  <input
                    className={inputCls}
                    type="password"
                    inputMode="numeric"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="•••"
                  />
                </Field>
              </div>
            </>
          )}
          {err && <p className="text-[11.5px] font-bold text-chili">{err}</p>}
        </section>
      </main>

      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-4 pb-[max(env(safe-area-inset-bottom),14px)] pt-3 backdrop-blur">
        <button
          onClick={pay}
          disabled={paying}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gold py-4 text-[14px] font-extrabold tracking-wide text-bg transition active:scale-[0.99] disabled:opacity-60"
        >
          {paying ? (
            <>
              <Spinner className="border-bg/40 border-t-bg" /> Processing securely…
            </>
          ) : (
            <>Pay {inr(order.total)}</>
          )}
        </button>
        <p className="mt-2 text-center text-[10.5px] font-semibold text-muted">
          Secured &amp; encrypted · Razorpay-ready flow
        </p>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="h-6 w-6" />
        </div>
      }
    >
      <PayInner />
    </Suspense>
  );
}
