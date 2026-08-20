"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { CartProvider } from "@/components/CartProvider";
import {
  CheckIcon,
  GoogleIcon,
  PinIcon,
  ReceiptIcon,
  TrashIcon,
  UserIcon,
} from "@/components/icons";
import { Badge, Field, inputCls, Spinner } from "@/components/ui";
import { normalizePhone, isValidPhone } from "@/lib/utils";
import {
  clearUser,
  readUser,
  saveUser,
  type ClientUser,
} from "@/lib/client";
import type { SavedAddress } from "@/lib/types";

type Step = "phone" | "otp" | "name";

export default function AccountPage() {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [gOpen, setGOpen] = useState(false);
  const [gName, setGName] = useState("");
  const [gPhone, setGPhone] = useState("");
  const [gErr, setGErr] = useState("");
  const [saved, setSaved] = useState<SavedAddress[]>([]);
  const [removing, setRemoving] = useState<number | null>(null);

  useEffect(() => {
    setUser(readUser());
  }, []);

  const loadAddrs = useCallback(async (p: string) => {
    try {
      const res = await fetch(`/api/addresses?phone=${p}`);
      const data = (await res.json()) as { addresses?: SavedAddress[] };
      setSaved(data.addresses ?? []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (user) loadAddrs(user.phone);
    else setSaved([]);
  }, [user, loadAddrs]);

  const sendOtp = async () => {
    setError("");
    if (!isValidPhone(phone)) return setError("Enter a valid 10-digit mobile number");
    setBusy(true);
    try {
      const res = await fetch("/api/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizePhone(phone) }),
      });
      const data = (await res.json()) as { ok: boolean; demoOtp?: string; error?: string };
      if (!data.ok) return setError(data.error ?? "Could not send OTP");
      setDemoOtp(data.demoOtp ?? "");
      setOtp("");
      setStep("otp");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async (withName?: string) => {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizePhone(phone),
          code: otp,
          ...(withName ? { name: withName } : {}),
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        isNewUser?: boolean;
        user?: { name: string; phone: string; via: string } | null;
      };
      if (!data.ok) {
        setError(data.error ?? "Verification failed");
        if (data.error?.includes("expired")) {
          setStep("phone");
          setDemoOtp("");
        }
        return;
      }
      if (data.user) {
        const u: ClientUser = {
          name: data.user.name,
          phone: normalizePhone(phone),
          via: data.user.via === "google" ? "google" : "otp",
        };
        saveUser(u);
        setUser(u);
        setStep("phone");
        setDemoOtp("");
        setOtp("");
      } else if (data.isNewUser) {
        setStep("name");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const googleSignin = async () => {
    setGErr("");
    if (gName.trim().length < 2) return setGErr("Please enter your name");
    if (!isValidPhone(gPhone)) return setGErr("Enter a valid 10-digit mobile number");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: gName.trim(), phone: normalizePhone(gPhone) }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; user?: { name: string; phone: string } };
      if (!data.ok) return setGErr(data.error ?? "Could not sign in");
      const u: ClientUser = { name: data.user!.name, phone: normalizePhone(gPhone), via: "google" };
      saveUser(u);
      setUser(u);
      setGOpen(false);
      setGName("");
      setGPhone("");
    } catch {
      setGErr("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const signOut = () => {
    clearUser();
    setUser(null);
  };

  const removeAddr = async (id: number) => {
    setRemoving(id);
    try {
      await fetch(`/api/addresses?id=${id}`, { method: "DELETE" });
      setSaved((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setRemoving(null);
    }
  };

  const initials = (u: ClientUser) =>
    u.name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <CartProvider>
      <AppShell active="account">
        <div className="space-y-4 px-4 py-4">
          {!user ? (
            <>
              <div className="flex flex-col items-center pt-4 text-center">
                <img
                  src="/images/logo.png"
                  alt="The Delhi Darbar"
                  className="h-20 w-20 rounded-3xl border border-line"
                />
                <h2 className="mt-4 font-display text-[22px] font-bold text-cream">
                  Welcome to The Delhi Darbar
                </h2>
                <p className="mt-1 max-w-[280px] text-[12.5px] font-medium text-muted">
                  Sign in to track orders, save addresses and reorder in one tap.
                </p>
              </div>

              {/* Google (placeholder) */}
              <button
                onClick={() => setGOpen(true)}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-line bg-surface py-3.5 text-[13.5px] font-extrabold text-cream transition active:scale-[0.99]"
              >
                <GoogleIcon className="h-5 w-5" /> Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-line" />
                <span className="text-[10px] font-bold tracking-widest text-muted">OR</span>
                <span className="h-px flex-1 bg-line" />
              </div>

              {/* OTP flow */}
              <div className="space-y-3.5 rounded-3xl border border-line bg-surface p-4">
                {step === "phone" && (
                  <>
                    <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">
                      Sign in with phone
                    </h3>
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
                    {error && <p className="text-[11.5px] font-bold text-chili">{error}</p>}
                    <button
                      onClick={sendOtp}
                      disabled={busy}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-flame py-3.5 text-[13.5px] font-extrabold text-bg transition active:scale-[0.99] disabled:opacity-60"
                    >
                      {busy ? <Spinner className="border-bg/40 border-t-bg" /> : "Send OTP"}
                    </button>
                  </>
                )}

                {step === "otp" && (
                  <>
                    <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">
                      Verify OTP
                    </h3>
                    <p className="text-[12px] font-semibold text-muted">
                      We sent a 6-digit code to +91 {phone}
                    </p>
                    <div className="flex items-start gap-2 rounded-xl border border-dashed border-gold/50 bg-gold/10 px-3 py-2.5">
                      <p className="text-[11px] font-bold leading-snug text-gold">
                        Demo mode: SMS gateway not connected — your OTP is{" "}
                        <span className="text-[14px] tracking-[0.2em]">{demoOtp}</span>
                      </p>
                    </div>
                    <Field label="Enter code">
                      <input
                        className={inputCls + " tracking-[0.5em] text-center font-extrabold"}
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="••••••"
                        maxLength={6}
                      />
                    </Field>
                    {error && <p className="text-[11.5px] font-bold text-chili">{error}</p>}
                    <button
                      onClick={() => verify()}
                      disabled={busy || otp.length < 6}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-flame py-3.5 text-[13.5px] font-extrabold text-bg transition active:scale-[0.99] disabled:opacity-50"
                    >
                      {busy ? <Spinner className="border-bg/40 border-t-bg" /> : "Verify & continue"}
                    </button>
                    <button
                      onClick={sendOtp}
                      className="w-full text-center text-[11.5px] font-bold text-muted"
                    >
                      Resend code
                    </button>
                  </>
                )}

                {step === "name" && (
                  <>
                    <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">
                      Almost there
                    </h3>
                    <p className="text-[12px] font-semibold text-muted">
                      +91 {phone} is verified. What should we call you?
                    </p>
                    <Field label="Your name">
                      <input
                        className={inputCls}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aarif Bhat"
                      />
                    </Field>
                    {error && <p className="text-[11.5px] font-bold text-chili">{error}</p>}
                    <button
                      onClick={() => name.trim().length >= 2 && verify(name.trim())}
                      disabled={busy || name.trim().length < 2}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-flame py-3.5 text-[13.5px] font-extrabold text-bg transition active:scale-[0.99] disabled:opacity-50"
                    >
                      {busy ? <Spinner className="border-bg/40 border-t-bg" /> : "Continue"}
                    </button>
                  </>
                )}
              </div>

              <p className="pb-2 text-center text-[10.5px] font-medium text-muted">
                By continuing you agree to receive order updates on this number.
              </p>
            </>
          ) : (
            <>
              {/* Profile */}
              <div className="flex items-center gap-4 rounded-3xl border border-line bg-gradient-to-br from-raise to-surface p-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold text-lg font-extrabold text-bg">
                  {initials(user)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[19px] font-bold text-cream">
                    {user.name}
                  </p>
                  <p className="text-[12px] font-semibold text-muted">+91 {user.phone}</p>
                  <Badge tone={user.via === "google" ? "flame" : "gold"} className="mt-1.5">
                    <CheckIcon className="h-3 w-3" />
                    {user.via === "google" ? "Google account" : "Phone verified"}
                  </Badge>
                </div>
              </div>

              {/* Orders shortcut */}
              <Link
                href="/orders"
                className="flex items-center gap-3.5 rounded-2xl border border-line bg-surface p-4 transition active:scale-[0.99]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-flame/15 text-flame">
                  <ReceiptIcon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-[13.5px] font-extrabold text-cream">My orders</p>
                  <p className="text-[11.5px] font-semibold text-muted">
                    Track live status & reorder in a tap
                  </p>
                </div>
                <span className="text-[12px] font-extrabold text-flame">View →</span>
              </Link>

              {/* Saved addresses */}
              <div className="rounded-2xl border border-line bg-surface p-4">
                <h3 className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">
                  <PinIcon className="h-3.5 w-3.5" /> Saved addresses
                </h3>
                {saved.length === 0 ? (
                  <p className="mt-2.5 text-[12px] font-semibold text-muted">
                    No saved addresses yet — they'll appear here after your first delivery.
                  </p>
                ) : (
                  <div className="mt-3 space-y-2.5">
                    {saved.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-start gap-2.5 rounded-xl border border-line bg-raise p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[12.5px] font-extrabold text-cream">{a.label}</p>
                          <p className="mt-0.5 line-clamp-2 text-[11.5px] font-medium text-muted">
                            {a.line}
                          </p>
                        </div>
                        <button
                          onClick={() => removeAddr(a.id)}
                          disabled={removing === a.id}
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line text-chili transition active:scale-90 disabled:opacity-50"
                          aria-label="Delete address"
                        >
                          {removing === a.id ? (
                            <Spinner className="h-3.5 w-3.5" />
                          ) : (
                            <TrashIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={signOut}
                className="w-full rounded-2xl border border-chili/40 bg-chili/10 py-3.5 text-[13px] font-extrabold text-chili transition active:scale-[0.99]"
              >
                Sign out
              </button>
            </>
          )}
        </div>

        {/* Google dialog (placeholder) */}
        {gOpen && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-6">
            <button
              className="dd-fade absolute inset-0 bg-black/70"
              onClick={() => setGOpen(false)}
              aria-label="Close"
            />
            <div className="dd-slide-up relative w-full space-y-3.5 rounded-3xl border border-line bg-surface p-5">
              <div className="flex items-center gap-2.5">
                <GoogleIcon className="h-6 w-6" />
                <h3 className="font-display text-[17px] font-bold text-cream">
                  Google Sign-In
                </h3>
              </div>
              <p className="text-[11.5px] font-medium leading-snug text-muted">
                Placeholder flow — in production this uses Google Credential Manager. Add your
                name and the phone number linked to your orders.
              </p>
              <Field label="Your name">
                <input
                  className={inputCls}
                  value={gName}
                  onChange={(e) => setGName(e.target.value)}
                  placeholder="Full name"
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
                    value={gPhone}
                    onChange={(e) => setGPhone(normalizePhone(e.target.value))}
                    placeholder="10-digit number"
                    maxLength={10}
                  />
                </div>
              </Field>
              {gErr && <p className="text-[11.5px] font-bold text-chili">{gErr}</p>}
              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={() => setGOpen(false)}
                  className="flex-1 rounded-2xl border border-line py-3 text-[13px] font-bold text-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={googleSignin}
                  disabled={busy}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gold py-3 text-[13px] font-extrabold text-bg disabled:opacity-60"
                >
                  {busy ? <Spinner className="border-bg/40 border-t-bg" /> : "Continue"}
                </button>
              </div>
            </div>
          </div>
        )}
      </AppShell>
    </CartProvider>
  );
}
