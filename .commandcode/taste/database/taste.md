# database

- Use Drizzle ORM with D1 for database access in RedwoodSDK projects — configure with `drizzle(env.DB, { schema })`, `drizzle-orm` + `drizzle-kit`, and migrations in a `drizzle/` directory. Confidence: 0.85
- Use `created_at` and `updated_at` timestamp columns positioned immediately after the primary key in all database table schemas, with defaults of `sql`(datetime('now', 'localtime'))``. Confidence: 0.85
- Use nanoid with `customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')` and a prefix pattern (e.g., `{ prefix: 'usr' }`) for primary key generation instead of ULID or auto-increment. Confidence: 0.85
- Never run database mutations (inserts, updates, deletes, backfills, migrations) on production — only operate on the local dev D1 database. Reset local dev DB before testing any new database operations. Confidence: 0.85
- When checking whether a related record exists before skipping an operation, always verify against the actual D1 table (e.g., `db.select().from(accounts).where(...)`) rather than trusting a cached foreign key field stored in KV — KV can hold stale references to deleted D1 rows. Confidence: 0.70
