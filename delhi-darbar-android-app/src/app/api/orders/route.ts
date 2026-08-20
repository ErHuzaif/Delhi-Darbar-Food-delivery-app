import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { menuItemById } from "@/data/menu";

function makeCode() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) {
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return "DD-" + s;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body.phone ?? "").replace(/\D/g, "").slice(-10);
    const name = String(body.name ?? "").trim().slice(0, 120);
    const addressLine = String(body.addressLine ?? "").trim().slice(0, 500);
    const paymentMethod = body.paymentMethod === "online" ? "online" : "cod";

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ ok: false, error: "Enter a valid mobile number" }, { status: 400 });
    }
    if (name.length < 2) {
      return NextResponse.json({ ok: false, error: "Please enter your name" }, { status: 400 });
    }
    if (!addressLine) {
      return NextResponse.json({ ok: false, error: "Please set your delivery address" }, { status: 400 });
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ ok: false, error: "Your cart is empty" }, { status: 400 });
    }

    // Re-price everything server-side from the live menu (never trust the client).
    const items: Array<{ id: string; name: string; price: number; qty: number }> = [];
    let subtotal = 0;
    for (const line of body.items as Array<{ id?: string; qty?: number }>) {
      const item = menuItemById(String(line.id ?? ""));
      const qty = Math.max(1, Math.min(20, Number(line.qty ?? 1)));
      if (!item) continue;
      subtotal += item.price * qty;
      const existing = items.find((i) => i.id === item.id);
      if (existing) existing.qty += qty;
      else items.push({ id: item.id, name: item.name, price: item.price, qty });
    }
    if (items.length === 0) {
      return NextResponse.json({ ok: false, error: "Your cart is empty" }, { status: 400 });
    }

    const [order] = await db
      .insert(orders)
      .values({
        code: makeCode(),
        phone,
        name,
        addressLine,
        lat: typeof body.lat === "number" ? body.lat : null,
        lng: typeof body.lng === "number" ? body.lng : null,
        items,
        subtotal,
        total: subtotal,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "paid" : "pending",
      })
      .returning();

    return NextResponse.json({ ok: true, order });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const phone = url.searchParams.get("phone") ?? "";
  if (!phone) return NextResponse.json({ ok: true, orders: [] });
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.phone, phone))
    .orderBy(desc(orders.placedAt));
  return NextResponse.json({ ok: true, orders: rows });
}
