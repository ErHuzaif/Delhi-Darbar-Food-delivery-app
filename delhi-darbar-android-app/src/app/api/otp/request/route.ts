import { NextResponse } from "next/server";
import { db } from "@/db";
import { otpCodes, users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Request an OTP for a phone number.
 * PRODUCTION NOTE: wire an SMS provider (MSG91 / Twilio / Gupshup) here
 * to send the code. In this demo build the code is returned as `demoOtp`
 * so the flow is fully testable.
 */
export async function POST(req: Request) {
  let body: { phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const phone = String(body.phone ?? "").replace(/\D/g, "").slice(-10);
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid 10-digit mobile number" },
      { status: 400 },
    );
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.phone, phone));
  const isNewUser = !existing;

  await db.delete(otpCodes).where(eq(otpCodes.phone, phone));
  await db.insert(otpCodes).values({ phone, code, expiresAt });

  return NextResponse.json({ ok: true, phone, isNewUser, demoOtp: code });
}
