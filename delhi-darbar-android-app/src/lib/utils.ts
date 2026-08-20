export function inr(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export function cx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}

export const RESTAURANT = {
  name: "The Delhi Darbar",
  sub: "Restaurant & Fast Food",
  tagline: "Customer's Satisfaction is Our Motive",
  address: "K.P. Road, Anantnag, Jammu & Kashmir",
  phones: ["01932-22485", "+91 9906721833"],
  tel: ["0193222485", "919906721833"],
  prepNote:
    "Every order is cooked fresh in our kitchen — please allow 20–30 minutes of preparation time.",
};

export type OrderStage = {
  key: "placed" | "preparing" | "out" | "delivered";
  label: string;
  note: string;
};

export const ORDER_STAGES: OrderStage[] = [
  { key: "placed", label: "Order Placed", note: "We've received your order" },
  {
    key: "preparing",
    label: "Preparing",
    note: "Freshly cooking in our kitchen · 20–30 min",
  },
  { key: "out", label: "Out for Delivery", note: "Your rider is on the way" },
  { key: "delivered", label: "Delivered", note: "Enjoy your meal!" },
];

/**
 * Order lifecycle is derived from real time so tracking is always honest:
 * 0–3 min  → Order Placed
 * 3–33 min → Preparing (the 20–30 min kitchen window)
 * 33–48 min→ Out for Delivery
 * 48+ min  → Delivered
 */
export function orderProgress(placedAtMs: number, nowMs: number) {
  const mins = (nowMs - placedAtMs) / 60000;
  let index = 3;
  if (mins < 3) index = 0;
  else if (mins < 33) index = 1;
  else if (mins < 48) index = 2;

  const etaMs = placedAtMs + 48 * 60000;
  return {
    index,
    stage: ORDER_STAGES[index],
    etaMs,
    minsRemaining: Math.max(0, Math.ceil((etaMs - nowMs) / 60000)),
    delivered: index === 3,
  };
}

export function fmtClock(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function isValidPhone(p: string): boolean {
  return /^[6-9]\d{9}$/.test(p.replace(/\D/g, "").slice(-10));
}

export function normalizePhone(p: string): string {
  return p.replace(/\D/g, "").slice(-10);
}
