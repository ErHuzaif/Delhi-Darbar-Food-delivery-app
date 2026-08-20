export type OrderItem = { id: string; name: string; price: number; qty: number };

export type Order = {
  id: number;
  code: string;
  phone: string;
  name: string;
  addressLine: string;
  lat: number | null;
  lng: number | null;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: "cod" | "online";
  paymentStatus: "paid" | "pending" | "failed";
  placedAt: string;
};

export type SavedAddress = {
  id: number;
  phone: string;
  label: string;
  line: string;
  lat: number | null;
  lng: number | null;
};
