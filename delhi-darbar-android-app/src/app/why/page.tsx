import Link from "next/link";
import { BackHeader } from "@/components/ui";
import {
  ClockIcon,
  PotIcon,
  ShieldIcon,
  SparkIcon,
  TruckIcon,
} from "@/components/icons";
import { RESTAURANT } from "@/lib/utils";

export const metadata = { title: "Why the Esteemed Group — The Delhi Darbar" };

const REASONS = [
  {
    icon: PotIcon,
    title: "Genuine Kashmiri Wazwan",
    text: "Rista, rogan josh, goshtaba and tabak maaz cooked the traditional way from family recipes — alongside Tandoori, Chinese and North Indian favourites.",
  },
  {
    icon: ClockIcon,
    title: "A clear 20–30 minute prep promise",
    text: "Nothing frozen, nothing pre-made. Every order is cooked fresh the moment you place it, with a clear 20–30 minute preparation commitment you can trust.",
  },
  {
    icon: ShieldIcon,
    title: "Pay your way, safely",
    text: "Keep your cash at home with Cash on Delivery, or pay online securely by UPI or card — whatever suits you, no surprises at the door.",
  },
  {
    icon: TruckIcon,
    title: "Live order tracking",
    text: "Follow your food from Order Placed to Preparing to Out for Delivery, with your exact delivery address and an estimated arrival time at every step.",
  },
  {
    icon: SparkIcon,
    title: "A promise, not a tagline",
    text: "“Customer's Satisfaction is Our Motive.” It guides how we cook, how we deliver, and how we answer the phone — every single day.",
  },
];

export default function WhyPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BackHeader title="Why the Esteemed Group?" sub="Order from The Delhi Darbar" href="/" />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-raise via-surface to-bg p-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gold/15 blur-3xl" />
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-flame">
            Why order through the app
          </p>
          <h2 className="mt-1.5 font-display text-[24px] font-bold leading-tight text-cream">
            Five reasons to trust
            <br />
            <span className="text-gold">the Darbar kitchen</span>
          </h2>
        </div>

        <div className="mt-4 space-y-3">
          {REASONS.map((r, i) => (
            <div key={r.title} className="flex gap-3.5 rounded-2xl border border-line bg-surface p-4">
              <div className="flex flex-col items-center">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-flame/15 text-flame">
                  <r.icon className="h-5 w-5" />
                </span>
                {i < REASONS.length - 1 && (
                  <span className="mt-1.5 w-px flex-1 bg-line" />
                )}
              </div>
              <div className="pb-1">
                <p className="text-[14px] font-extrabold text-cream">
                  <span className="mr-1.5 text-gold">{i + 1}.</span>
                  {r.title}
                </p>
                <p className="mt-1 text-[12px] font-medium leading-relaxed text-muted">
                  {r.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-gold/30 bg-gold/[0.07] p-4 text-center">
          <p className="font-display text-[16px] font-bold italic text-gold">
            “{RESTAURANT.tagline}”
          </p>
        </div>

        <Link
          href="/"
          className="mt-4 block rounded-2xl bg-flame py-4 text-center text-[14px] font-extrabold text-bg"
        >
          Order now
        </Link>
      </main>
    </div>
  );
}
