"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CartProvider } from "@/components/CartProvider";
import { CakeIcon, CheckIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { Field, inputCls, Spinner } from "@/components/ui";
import { cx, RESTAURANT } from "@/lib/utils";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"general" | "catering">("general");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (name.trim().length < 2) return setError("Please enter your name");
    if (message.trim().length < 3) return setError("Please write a short message");
    setBusy(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.replace(/\D/g, "").slice(-10) || null,
          type,
          message: message.trim(),
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) return setError(data.error ?? "Could not send. Please try again.");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <CartProvider>
      <AppShell active="contact">
        <div className="space-y-4 px-4 py-4">
          {/* Restaurant card */}
          <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-raise via-surface to-bg p-5">
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-flame/15 blur-3xl" />
            <div className="relative flex items-center gap-3.5">
              <img
                src="/images/logo.png"
                alt="The Delhi Darbar"
                className="h-14 w-14 rounded-2xl border border-line"
              />
              <div>
                <h2 className="font-display text-[19px] font-bold text-gold">
                  {RESTAURANT.name}
                </h2>
                <p className="text-[11.5px] font-semibold text-muted">{RESTAURANT.sub}</p>
              </div>
            </div>
            <div className="relative mt-4 flex items-start gap-2.5 text-[12.5px] font-semibold text-cream">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <p>{RESTAURANT.address}</p>
            </div>
            <div className="relative mt-4 grid grid-cols-2 gap-2.5">
              <a
                href={`tel:${RESTAURANT.tel[0]}`}
                className="flex items-center justify-center gap-2 rounded-2xl bg-flame py-3.5 text-[12.5px] font-extrabold text-bg transition active:scale-[0.98]"
              >
                <PhoneIcon className="h-4 w-4" /> Call restaurant
              </a>
              <a
                href={`tel:${RESTAURANT.tel[1]}`}
                className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-3.5 text-[12.5px] font-extrabold text-gold transition active:scale-[0.98]"
              >
                <PhoneIcon className="h-4 w-4" /> WhatsApp / SMS
              </a>
            </div>
            <div className="relative mt-2.5 flex justify-center gap-6 text-[11.5px] font-bold text-muted">
              <span>{RESTAURANT.phones[0]}</span>
              <span>{RESTAURANT.phones[1]}</span>
            </div>
          </div>

          {/* Party & catering */}
          <div className="rounded-2xl border border-gold/30 bg-gold/[0.07] p-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
                <CakeIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[13.5px] font-extrabold text-cream">
                  Parties, kitty parties &amp; celebrations
                </p>
                <p className="text-[11.5px] font-semibold text-muted">
                  Birthdays, kitty parties, wedding anniversaries &amp; other events
                </p>
              </div>
            </div>
            <p className="mt-2.5 text-[11.5px] font-bold leading-snug text-gold">
              Catering orders carry a 10% service charge. Use the form below or call us to plan
              your event.
            </p>
          </div>

          {/* Enquiry form */}
          <div className="rounded-2xl border border-line bg-surface p-4">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-leaf/15 text-leaf">
                  <CheckIcon className="h-8 w-8" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-cream">
                    Message received
                  </h3>
                  <p className="mt-1 text-[12px] font-medium text-muted">
                    Our team will get back to you shortly{phone ? " on your number" : ""}.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSent(false);
                    setName("");
                    setPhone("");
                    setMessage("");
                    setType("general");
                  }}
                  className="text-[12px] font-extrabold text-flame"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">
                  Questions? Enquiry? Booking?
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { k: "general", label: "General question" },
                      { k: "catering", label: "Party / catering" },
                    ] as const
                  ).map((o) => (
                    <button
                      key={o.k}
                      onClick={() => setType(o.k)}
                      className={cx(
                        "rounded-xl border py-2.5 text-[12px] font-extrabold transition",
                        type === o.k
                          ? "border-gold bg-gold/15 text-gold"
                          : "border-line bg-raise text-muted",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {type === "catering" && (
                  <p className="rounded-xl border border-gold/30 bg-gold/10 px-3 py-2 text-[11px] font-bold leading-snug text-gold">
                    For catering &amp; party arrangements, a 10% service charge applies to your
                    order.
                  </p>
                )}
                <Field label="Your name">
                  <input
                    className={inputCls}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                  />
                </Field>
                <Field label="Phone (optional)">
                  <input
                    className={inputCls}
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit number"
                  />
                </Field>
                <Field label="Message">
                  <textarea
                    className={inputCls + " min-h-[96px] resize-none"}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      type === "catering"
                        ? "Tell us about your event — date, headcount, dishes you like…"
                        : "How can we help?"
                    }
                  />
                </Field>
                {error && <p className="text-[11.5px] font-bold text-chili">{error}</p>}
                <button
                  onClick={submit}
                  disabled={busy}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-flame py-3.5 text-[13.5px] font-extrabold text-bg transition active:scale-[0.99] disabled:opacity-60"
                >
                  {busy ? <Spinner className="border-bg/40 border-t-bg" /> : "Send enquiry"}
                </button>
              </div>
            )}
          </div>
        </div>
      </AppShell>
    </CartProvider>
  );
}
