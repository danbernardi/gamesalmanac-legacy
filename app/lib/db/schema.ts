import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const authTokens = pgTable('auth_tokens', {
  id: varchar('id', { length: 50 }).primaryKey(),
  provider: varchar('provider', { length: 50 }).notNull(), // 'igdb'
  accessToken: text('access_token').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});