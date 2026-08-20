import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const num = Number(id);
  if (!num) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  const [order] = await db.select().from(orders).where(eq(orders.id, num)).limit(1);
  if (!order) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, order });
}
