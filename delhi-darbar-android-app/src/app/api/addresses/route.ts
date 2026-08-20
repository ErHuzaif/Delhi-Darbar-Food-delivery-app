import { NextResponse } from "next/server";
import { db } from "@/db";
import { addresses } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const phone = url.searchParams.get("phone") ?? "";
  if (!phone) return NextResponse.json({ ok: true, addresses: [] });

  const rows = await db
    .select()
    .from(addresses)
    .where(eq(addresses.phone, phone))
    .orderBy(desc(addresses.createdAt));
  return NextResponse.json({ ok: true, addresses: rows });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body.phone ?? "").replace(/\D/g, "").slice(-10);
    const label = String(body.label ?? "").trim().slice(0, 40) || "Home";
    const line = String(body.line ?? "").trim().slice(0, 400);
    if (!phone || !line) {
      return NextResponse.json({ ok: false, error: "Missing address details" }, { status: 400 });
    }
    const [row] = await db
      .insert(addresses)
      .values({
        phone,
        label,
        line,
        lat: typeof body.lat === "number" ? body.lat : null,
        lng: typeof body.lng === "number" ? body.lng : null,
      })
      .returning();
    return NextResponse.json({ ok: true, address: row });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = Number(url.searchParams.get("id"));
  if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  await db.delete(addresses).where(eq(addresses.id, id));
  return NextResponse.json({ ok: true });
}
