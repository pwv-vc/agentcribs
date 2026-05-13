import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
);

const prefixes = {
  account: "acc",
  document: "doc",
} as const;

function createId(prefix: string, length = 12): string {
  return `${prefix}_${nanoid(length)}`;
}

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey().$defaultFn(() => createId(prefixes.account)),
  created_at: text("created_at")
    .notNull()
    .default(sql`(datetime('now', 'localtime'))`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`(datetime('now', 'localtime'))`),
  email: text("email").notNull().unique(),
});

export type Account = typeof accounts.$inferSelect;
export type AccountInsert = typeof accounts.$inferInsert;

export const profiles = sqliteTable("profiles", {
  account_id: text("account_id")
    .primaryKey()
    .references(() => accounts.id, { onDelete: "cascade" }),
  created_at: text("created_at")
    .notNull()
    .default(sql`(datetime('now', 'localtime'))`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`(datetime('now', 'localtime'))`),
  first_name: text("first_name"),
  last_name: text("last_name"),
  nickname: text("nickname"),
  bio: text("bio"),
  avatar_url: text("avatar_url"),
  github_handle: text("github_handle"),
  github_id: integer("github_id"),
});

export type Profile = typeof profiles.$inferSelect;
export type ProfileInsert = typeof profiles.$inferInsert;

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey().$defaultFn(() => createId(prefixes.document)),
  created_at: text("created_at")
    .notNull()
    .default(sql`(datetime('now', 'localtime'))`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`(datetime('now', 'localtime'))`),
  account_id: text("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  application_id: text("application_id"),
  document_type: text("document_type").notNull().default("application"),
  filename: text("filename").notNull(),
  content_type: text("content_type"),
  size_bytes: integer("size_bytes"),
  r2_key: text("r2_key").notNull(),
});

export type Document = typeof documents.$inferSelect;
export type DocumentInsert = typeof documents.$inferInsert;
