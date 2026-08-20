import Link from "next/link";
import { BackHeader } from "@/components/ui";
import { ClockIcon, PinIcon, SparkIcon, TruckIcon } from "@/components/icons";
import { RESTAURANT } from "@/lib/utils";

export const metadata = { title: "About — The Delhi Darbar" };

const FACTS = [
  { icon: PinIcon, label: "Location", value: "K.P. Road, Anantnag" },
  { icon: SparkIcon, label: "Cuisine", value: "Kashmiri Wazwan · Tandoori · Chinese · North Indian" },
  { icon: TruckIcon, label: "Type", value: "Veg & Non-Veg Family Restaurant" },
  { icon: ClockIcon, label: "Fresh prep", value: "Every order cooked in 20–30 min" },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BackHeader title="About Us" sub="The Delhi Darbar" href="/" />
      <main className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        <img
          src="https://images.pexels.com/photos/37420999/pexels-photo-37420999.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=640"
          alt="A spread of dishes from The Delhi Darbar"
          className="h-44 w-full rounded-3xl border border-line object-cover"
        />

        <div>
          <h2 className="font-display text-[24px] font-bold text-flame">Our Story</h2>
          {/* EDIT: replace this paragraph with your own story, history and family legacy. */}
          <p className="mt-3 text-[13.5px] font-medium leading-relaxed text-cream/90">
            On the busy stretch of K.P. Road in Anantnag, The Delhi Darbar has grown into the kind
            of place families make their own — a warm corner of the valley where the smell of
            saffron kehwaa and tandoor smoke welcomes you in. What began as a simple promise to
            cook honest, home-style Kashmiri food for the neighbourhood has become a full
            restaurant and fast-food kitchen serving everyone who walks in or rings the phone.
          </p>
          <p className="mt-3 text-[13.5px] font-medium leading-relaxed text-cream/90">
            Our signature is the Kashmiri Wazwan — rista, rogan josh, goshtaba and tabak maaz
            prepared the traditional way, in small batches and never in a hurry. Around it we
            build the rest of our kitchen: sizzling Tandoori specials, hearty North Indian
            curries, everyday rice and biryanis, and a Chinese counter that keeps the
            fast-food crowd coming back. Everything is cooked fresh when you order, and
            everything — from the first spoon of kehwaa to the last piece of naan — is made with
            one motive in mind: yours.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {FACTS.map((f) => (
            <div key={f.label} className="rounded-2xl border border-line bg-surface p-3.5">
              <f.icon className="h-5 w-5 text-gold" />
              <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted">
                {f.label}
              </p>
              <p className="mt-0.5 text-[12px] font-bold leading-snug text-cream">{f.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-gold/30 bg-gold/[0.07] p-5 text-center">
          <p className="font-display text-[18px] font-bold italic text-gold">
            “{RESTAURANT.tagline}”
          </p>
          <p className="mt-1.5 text-[11.5px] font-semibold text-muted">
            — The family at The Delhi Darbar
          </p>
        </div>

        <Link
          href="/"
          className="block rounded-2xl bg-flame py-4 text-center text-[14px] font-extrabold text-bg"
        >
          Browse the menu
        </Link>
      </main>
    </div>
  );
}
