import { NextResponse } from "next/server";
import { db } from "@/db";
import { enquiries } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim().slice(0, 120);
    const phone = String(body.phone ?? "").replace(/\D/g, "").slice(-10) || null;
    const type = body.type === "catering" ? "catering" : "general";
    const message = String(body.message ?? "").trim().slice(0, 2000);

    if (name.length < 2 || message.length < 3) {
      return NextResponse.json(
        { ok: false, error: "Please add your name and a short message" },
        { status: 400 },
      );
    }

    await db.insert(enquiries).values({ name, phone, type, message });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
