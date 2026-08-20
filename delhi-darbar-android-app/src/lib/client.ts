// Client-side (browser) storage helpers — shared across screens.

export type ClientUser = {
  name: string;
  phone: string;
  via: "otp" | "google";
};

export type RecentOrderRef = {
  id: number;
  code: string;
};

const USER_KEY = "ddd_user_v1";
const RECENT_KEY = "ddd_recent_v1";
export const CART_KEY = "ddd_cart_v1";

export function readUser(): ClientUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as ClientUser) : null;
  } catch {
    return null;
  }
}

export function saveUser(u: ClientUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(u));
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

export function readRecent(): RecentOrderRef[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as RecentOrderRef[]) : [];
  } catch {
    return [];
  }
}

export function pushRecent(ref: RecentOrderRef) {
  const list = readRecent().filter((r) => r.id !== ref.id);
  list.unshift(ref);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 12)));
}
