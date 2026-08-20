import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 14 }).notNull().unique(),
  isGoogle: boolean("is_google").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const otpCodes = pgTable("otp_codes", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 14 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 14 }).notNull(),
  label: varchar("label", { length: 40 }).notNull(),
  line: text("line").notNull(),
  lat: real("lat"),
  lng: real("lng"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 12 }).notNull().unique(),
    phone: varchar("phone", { length: 14 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    addressLine: text("address_line").notNull(),
    lat: real("lat"),
    lng: real("lng"),
    items: jsonb("items").notNull(),
    subtotal: integer("subtotal").notNull(),
    total: integer("total").notNull(),
    paymentMethod: varchar("payment_method", { length: 10 }).notNull(),
    paymentStatus: varchar("payment_status", { length: 10 })
      .notNull()
      .default("pending"),
    placedAt: timestamp("placed_at").notNull().defaultNow(),
  },
  (t) => [index("orders_phone_idx").on(t.phone)],
);

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 14 }),
  type: varchar("type", { length: 20 }).notNull().default("general"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
