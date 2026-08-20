import Link from "next/link";
import { cx } from "@/lib/utils";
import { BackIcon } from "./icons";

export function VegDot({ veg, className }: { veg: boolean; className?: string }) {
  return (
    <span
      title={veg ? "Veg" : "Non-Veg"}
      className={cx(
        "grid h-[14px] w-[14px] shrink-0 place-items-center rounded-[4px] border",
        veg ? "border-leaf" : "border-chili",
        className,
      )}
    >
      <span className={cx("h-[6px] w-[6px] rounded-full", veg ? "bg-leaf" : "bg-chili")} />
    </span>
  );
}

export function Badge({
  children,
  tone = "gold",
  className,
}: {
  children: React.ReactNode;
  tone?: "gold" | "flame" | "line" | "leaf";
  className?: string;
}) {
  const tones = {
    gold: "border-gold/40 bg-gold/10 text-gold",
    flame: "border-flame/40 bg-flame/10 text-flame",
    line: "border-line bg-raise text-muted",
    leaf: "border-leaf/40 bg-leaf/10 text-leaf",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function BackHeader({
  title,
  sub,
  href,
}: {
  title: string;
  sub?: string;
  href: string;
}) {
  return (
    <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-line bg-bg/95 px-3 py-3 backdrop-blur">
      <Link
        href={href}
        className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-cream active:scale-95 transition"
        aria-label="Go back"
      >
        <BackIcon className="h-4.5 w-4.5" />
      </Link>
      <div className="min-w-0">
        <h1 className="truncate font-display text-[17px] font-semibold text-gold">{title}</h1>
        {sub ? <p className="truncate text-[11px] text-muted">{sub}</p> : null}
      </div>
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-gold/30 border-t-gold",
        className,
      )}
    />
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      {children}
      {error ? <span className="mt-1 block text-[11px] font-semibold text-chili">{error}</span> : null}
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-[14px] font-medium text-cream placeholder:text-muted/60 outline-none transition focus:border-gold/60 focus:bg-raise";
