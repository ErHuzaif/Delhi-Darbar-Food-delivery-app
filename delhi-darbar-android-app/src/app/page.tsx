import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { CartProvider } from "@/components/CartProvider";
import { MenuList } from "@/components/MenuList";
import { Badge } from "@/components/ui";
import { CakeIcon, ClockIcon, SparkIcon, TruckIcon } from "@/components/icons";
import { RESTAURANT } from "@/lib/utils";

export default function Home() {
  return (
    <CartProvider>
      <AppShell active="menu">
        <div className="px-4 pt-4">
          {/* Hero — menu card feel */}
          <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-raise via-surface to-bg p-4">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-flame/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
            <div className="relative flex items-center gap-3.5">
              <img
                src="/images/logo.png"
                alt="The Delhi Darbar chef mascot"
                className="h-16 w-16 rounded-2xl border border-line object-cover"
              />
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-flame">
                  Kashmiri Wazwan · Anantnag
                </p>
                <h2 className="mt-1 font-display text-[21px] font-bold leading-tight text-cream">
                  Darbar-class taste,
                  <br />
                  delivered home
                </h2>
              </div>
            </div>
            <div className="relative mt-3.5 flex flex-wrap gap-1.5">
              <Badge tone="leaf">Veg &amp; Non-Veg</Badge>
              <Badge tone="gold">
                <ClockIcon className="h-3 w-3" /> Prep 20–30 min
              </Badge>
              <Badge tone="flame">
                <TruckIcon className="h-3 w-3" /> COD available
              </Badge>
            </div>
            <p className="relative mt-3 text-[11.5px] italic text-muted">
              “{RESTAURANT.tagline}”
            </p>
          </div>

          {/* Quick links */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Link
              href="/why"
              className="rounded-2xl border border-line bg-surface p-3 text-center transition active:scale-[0.98]"
            >
              <SparkIcon className="mx-auto h-5 w-5 text-gold" />
              <p className="mt-1.5 text-[11px] font-bold text-cream">Why us</p>
            </Link>
            <Link
              href="/about"
              className="rounded-2xl border border-line bg-surface p-3 text-center transition active:scale-[0.98]"
            >
              <CakeIcon className="mx-auto h-5 w-5 text-gold" />
              <p className="mt-1.5 text-[11px] font-bold text-cream">About us</p>
            </Link>
            <Link
              href="/contact"
              className="rounded-2xl border border-line bg-surface p-3 text-center transition active:scale-[0.98]"
            >
              <TruckIcon className="mx-auto h-5 w-5 text-gold" />
              <p className="mt-1.5 text-[11px] font-bold text-cream">Party &amp; events</p>
            </Link>
          </div>
        </div>

        <MenuList />
      </AppShell>
    </CartProvider>
  );
}
