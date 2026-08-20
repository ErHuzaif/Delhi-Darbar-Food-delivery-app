import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Simulated online payment confirmation.
 * PRODUCTION NOTE: replace this route with a Razorpay integration —
 * create the order with Razorpay Orders API, open the Checkout on the
 * client, then verify the signature server-side here before marking
 * paymentStatus = "paid".
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const num = Number(id);
  if (!num) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  let body: { method?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* body optional */
  }

  const [order] = await db
    .update(orders)
    .set({ paymentStatus: "paid" })
    .where(eq(orders.id, num))
    .returning();

  if (!order) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({
    ok: true,
    order,
    payment: {
      method: body.method === "card" ? "card" : "upi",
      mode: "test",
      ref: "pay_test_" + num,
    },
  });
}
