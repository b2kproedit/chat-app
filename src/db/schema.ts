import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

// Chat rooms
export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users (session-based, no auth needed)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).notNull(),
  avatarColor: varchar("avatar_color", { length: 20 }).notNull().default("#6366f1"),
  sessionId: varchar("session_id", { length: 100 }).notNull().unique(),
  lastSeen: timestamp("last_seen").defaultNow().notNull(),
  isOnline: boolean("is_online").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Messages
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Room = typeof rooms.$inferSelect;
export type User = typeof users.$inferSelect;
export type Message = typeof messages.$inferSelect;
