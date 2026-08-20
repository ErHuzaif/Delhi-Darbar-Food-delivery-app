import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Placeholder for Google Sign-In.
 * PRODUCTION NOTE: switch this to a real Google Identity Services flow —
 * send the credential (JWT) here, verify it with google-auth-library,
 * and upsert the user by verified email/phone.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim().slice(0, 120);
    const phone = String(body.phone ?? "").replace(/\D/g, "").slice(-10);

    if (name.length < 2) {
      return NextResponse.json({ ok: false, error: "Please enter your name" }, { status: 400 });
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { ok: false, error: "Enter a valid 10-digit mobile number" },
        { status: 400 },
      );
    }

    const [existing] = await db.select().from(users).where(eq(users.phone, phone));
    if (existing) {
      await db
        .update(users)
        .set({ name, isGoogle: true })
        .where(eq(users.id, existing.id));
      return NextResponse.json({ ok: true, user: { name, phone, via: "google" } });
    }

    await db.insert(users).values({ name, phone, isGoogle: true });
    return NextResponse.json({ ok: true, user: { name, phone, via: "google" } });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
