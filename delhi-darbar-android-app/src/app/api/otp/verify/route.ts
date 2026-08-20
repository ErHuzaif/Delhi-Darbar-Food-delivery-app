import { NextResponse } from "next/server";
import { db } from "@/db";
import { otpCodes, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

/**
 * Verify an OTP. If the user is new and no name is supplied yet, the code
 * stays valid so the name can be captured on the next call.
 */
export async function POST(req: Request) {
  let body: { phone?: string; code?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const phone = String(body.phone ?? "").replace(/\D/g, "").slice(-10);
  const code = String(body.code ?? "").trim();
  const name = (body.name ?? "").trim().slice(0, 120);

  if (!/^[6-9]\d{9}$/.test(phone) || !/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid mobile number and 6-digit code" },
      { status: 400 },
    );
  }

  const [otp] = await db
    .select()
    .from(otpCodes)
    .where(eq(otpCodes.phone, phone))
    .orderBy(desc(otpCodes.id))
    .limit(1);

  if (!otp || otp.code !== code) {
    return NextResponse.json({ ok: false, error: "Invalid code. Please try again." });
  }
  if (otp.expiresAt.getTime() < Date.now()) {
    await db.delete(otpCodes).where(eq(otpCodes.id, otp.id));
    return NextResponse.json(
      { ok: false, error: "Code expired. Please request a new one." },
    );
  }

  const [existing] = await db.select().from(users).where(eq(users.phone, phone));

  if (existing) {
    if (name) {
      await db.update(users).set({ name }).where(eq(users.id, existing.id));
    }
    await db.delete(otpCodes).where(eq(otpCodes.id, otp.id));
    return NextResponse.json({
      ok: true,
      isNewUser: false,
      user: { name: name || existing.name, phone, via: existing.isGoogle ? "google" : "otp" },
    });
  }

  if (!name) {
    // Keep the code alive so the name can be set on the follow-up call.
    return NextResponse.json({ ok: true, isNewUser: true, user: null });
  }

  await db.insert(users).values({ name, phone });
  await db.delete(otpCodes).where(eq(otpCodes.id, otp.id));
  return NextResponse.json({
    ok: true,
    isNewUser: true,
    user: { name, phone, via: "otp" },
  });
}
