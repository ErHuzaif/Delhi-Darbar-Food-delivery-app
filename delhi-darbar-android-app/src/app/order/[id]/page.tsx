"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AddressMap } from "@/components/AddressMap";
import { BackHeader, Spinner } from "@/components/ui";
import {
  CardIcon,
  CashIcon,
  CheckIcon,
  ClockIcon,
  PinIcon,
  PotIcon,
  TruckIcon,
} from "@/components/icons";
import { cx, fmtClock, inr, orderProgress, ORDER_STAGES, RESTAURANT } from "@/lib/utils";
import type { Order } from "@/lib/types";

const STAGE_ICONS = [CheckIcon, PotIcon, TruckIcon, CheckIcon];

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = (await res.json()) as { ok: boolean; order?: Order };
      if (data.ok && data.order) setOrder(data.order);
      else setNotFound(true);
    } catch {
      setNotFound(true);
    }
  }, [id]);

  useEffect(() => {
    load();
    const t = setInterval(() => {
      setNow(Date.now());
      load();
    }, 10000);
    return () => clearInterval(t);
  }, [load]);

  if (notFound) {
    return (
      <div className="flex flex-1 flex-col">
        <BackHeader title="Track Order" href="/" />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <p className="font-display text-lg text-cream">Order not found</p>
          <Link href="/" className="text-[13px] font-bold text-flame">
            ← Back to menu
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-1 flex-col">
        <BackHeader title="Track Order" href="/" />
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="h-6 w-6" />
        </div>
      </div>
    );
  }

  const prog = orderProgress(new Date(order.placedAt).getTime(), now);
  const itemCount = order.items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BackHeader title="Track Order" sub={`Order ${order.code} · ${fmtClock(new Date(order.placedAt).getTime())}`} href="/" />

      <main className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {/* Progress */}
        <section className="rounded-3xl border border-line bg-gradient-to-b from-raise to-surface p-5">
          <div className="mb-5 flex items-center gap-2.5">
            <span
              className={cx(
                "grid h-11 w-11 place-items-center rounded-2xl",
                prog.delivered ? "bg-leaf/20 text-leaf" : "dd-pulse bg-gold/20 text-gold",
              )}
            >
              <ClockIcon className="h-5.5 w-5.5" />
            </span>
            <div>
              {prog.delivered ? (
                <>
                  <p className="font-display text-[18px] font-bold text-leaf">Delivered</p>
                  <p className="text-[12px] font-semibold text-muted">Enjoy your meal!</p>
                </>
              ) : (
                <>
                  <p className="font-display text-[18px] font-bold text-gold">
                    Arriving around {fmtClock(prog.etaMs)}
                  </p>
                  <p className="text-[12px] font-semibold text-muted">
                    {prog.minsRemaining} min left · {itemCount} item{itemCount > 1 ? "s" : ""}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-start">
            {ORDER_STAGES.map((s, i) => {
              const Icon = STAGE_ICONS[i];
              const done = i < prog.index;
              const current = i === prog.index;
              return (
                <Fragment key={s.key}>
                  {i > 0 && (
                    <div
                      className={cx(
                        "mt-[19px] h-[3px] flex-1 rounded-full",
                        i <= prog.index ? "bg-gold" : "bg-line",
                      )}
                    />
                  )}
                  <div className="flex w-[64px] flex-col items-center gap-1.5">
                    <span
                      className={cx(
                        "grid h-10 w-10 place-items-center rounded-full border-2 transition",
                        done && "border-gold bg-gold text-bg",
                        current && !prog.delivered && "dd-pulse border-gold bg-gold/15 text-gold",
                        current && prog.delivered && "border-leaf bg-leaf text-bg",
                        !done && !current && "border-line bg-surface text-muted/50",
                      )}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span
                      className={cx(
                        "text-center text-[9px] font-extrabold leading-tight",
                        done || current ? "text-cream" : "text-muted/50",
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                </Fragment>
              );
            })}
          </div>

          <p
            className={cx(
              "mt-4 rounded-xl border px-3 py-2 text-center text-[11.5px] font-bold",
              prog.delivered
                ? "border-leaf/30 bg-leaf/10 text-leaf"
                : "border-gold/30 bg-gold/10 text-gold",
            )}
          >
            {prog.stage.note}
          </p>
        </section>

        {/* Address */}
        <section className="rounded-2xl border border-line bg-surface p-4">
          <h3 className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">
            <PinIcon className="h-3.5 w-3.5" /> Delivering to
          </h3>
          <p className="mt-2 text-[13px] font-semibold leading-snug text-cream">
            {order.addressLine}
          </p>
          <p className="mt-1 text-[11px] font-semibold text-muted">
            {order.name} · +91 {order.phone}
          </p>
          {order.lat != null && order.lng != null && (
            <div className="mt-3">
              <AddressMap
                readOnly
                initial={{ lat: order.lat, lng: order.lng, label: order.addressLine }}
                className="h-36"
              />
            </div>
          )}
        </section>

        {/* Payment */}
        <section className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
          <span
            className={cx(
              "grid h-11 w-11 shrink-0 place-items-center rounded-xl",
              order.paymentMethod === "cod"
                ? "bg-flame/15 text-flame"
                : order.paymentStatus === "paid"
                  ? "bg-leaf/15 text-leaf"
                  : "bg-gold/15 text-gold",
            )}
          >
            {order.paymentMethod === "cod" ? (
              <CashIcon className="h-5 w-5" />
            ) : order.paymentStatus === "paid" ? (
              <CheckIcon className="h-5 w-5" />
            ) : (
              <CardIcon className="h-5 w-5" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            {order.paymentMethod === "cod" ? (
              <>
                <p className="text-[13px] font-extrabold text-cream">Cash on Delivery</p>
                <p className="text-[11.5px] font-semibold text-muted">
                  Pay {inr(order.total)} in cash on arrival
                </p>
              </>
            ) : order.paymentStatus === "paid" ? (
              <>
                <p className="text-[13px] font-extrabold text-cream">Paid online</p>
                <p className="text-[11.5px] font-semibold text-muted">
                  {inr(order.total)} · payment confirmed
                </p>
              </>
            ) : (
              <>
                <p className="text-[13px] font-extrabold text-cream">Payment pending</p>
                <Link
                  href={`/pay?order=${order.id}`}
                  className="text-[11.5px] font-bold text-flame"
                >
                  Complete payment →
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Items */}
        <section className="rounded-2xl border border-line bg-surface p-4">
          <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">
            In this order
          </h3>
          <div className="mt-3 space-y-2.5">
            {order.items.map((it) => (
              <div key={it.id} className="flex items-center gap-2 text-[13px]">
                <span className="min-w-0 flex-1 truncate font-semibold text-cream">
                  {it.name} <span className="text-muted">× {it.qty}</span>
                </span>
                <span className="font-bold text-cream">{inr(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-line pt-3 text-[15px] font-extrabold">
            <span className="text-cream">Total</span>
            <span className="text-gold">{inr(order.total)}</span>
          </div>
        </section>

        <p className="px-2 text-center text-[11px] font-semibold italic text-muted">
          {RESTAURANT.prepNote}
        </p>
      </main>
    </div>
  );
}
