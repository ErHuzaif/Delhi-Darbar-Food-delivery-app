"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/data/menu";
import { cx, inr } from "@/lib/utils";
import { useCart } from "./CartProvider";
import { Badge, VegDot } from "./ui";
import { MinusIcon, PlusIcon } from "./icons";

export function MenuList() {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const { detail, add, dec } = useCart();

  const qtyOf = (id: string) => detail.find((d) => d.id === id)?.qty ?? 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveCat(e.target.id.replace("cat-", ""));
          }
        }
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setActiveCat(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pb-4">
      {/* Sticky category rail */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-line bg-bg/95 px-4 py-2.5 backdrop-blur">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => scrollTo(c.id)}
              className={cx(
                "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[11.5px] font-bold transition",
                activeCat === c.id
                  ? "border-gold bg-gold text-bg"
                  : "border-line bg-surface text-muted",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      {CATEGORIES.map((cat) => (
        <section
          key={cat.id}
          id={`cat-${cat.id}`}
          ref={(el) => {
            sectionRefs.current[cat.id] = el;
          }}
          className="scroll-mt-[64px] px-4 pt-5"
        >
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="font-display text-[19px] font-bold text-flame">{cat.name}</h3>
            <span className="text-[11px] font-semibold text-muted">
              {cat.items.length} dish{cat.items.length > 1 ? "es" : ""}
            </span>
          </div>
          <div className="space-y-2.5">
            {cat.items.map((item) => {
              const qty = qtyOf(item.id);
              const advance = item.name.toLowerCase().includes("advance order only");
              return (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-2xl border border-line bg-surface p-3"
                >
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-start gap-2">
                      <VegDot veg={item.veg} className="mt-0.5" />
                      <h4 className="text-[13.5px] font-semibold leading-snug text-cream">
                        {item.name}
                      </h4>
                    </div>
                    {advance && (
                      <Badge tone="gold" className="mt-1.5">
                        Advance order only
                      </Badge>
                    )}
                    <p className="mt-1.5 text-[13.5px] font-extrabold text-gold">
                      {inr(item.price)}
                    </p>
                  </div>
                  <div className="flex w-[96px] shrink-0 flex-col items-center gap-2">
                    <img
                      loading="lazy"
                      src={cat.image}
                      alt={item.name}
                      className="h-[72px] w-[96px] rounded-xl border border-line object-cover"
                    />
                    {qty === 0 ? (
                      <button
                        onClick={() => add(item.id)}
                        className="w-full rounded-lg border border-flame/70 bg-flame/10 py-1.5 text-[11px] font-extrabold tracking-[0.18em] text-flame active:scale-95 transition"
                      >
                        ADD
                      </button>
                    ) : (
                      <div className="flex w-full items-center justify-between rounded-lg bg-flame px-1.5 py-1 text-bg">
                        <button
                          onClick={() => dec(item.id)}
                          className="grid h-6 w-6 place-items-center active:scale-90 transition"
                          aria-label={`Remove one ${item.name}`}
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-[12px] font-extrabold">{qty}</span>
                        <button
                          onClick={() => add(item.id)}
                          className="grid h-6 w-6 place-items-center active:scale-90 transition"
                          aria-label={`Add one ${item.name}`}
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
