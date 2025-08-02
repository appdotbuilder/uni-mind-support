
import { serial, text, pgTable, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum for mood types
export const moodTypeEnum = pgEnum('mood_type', [
  'happy', 'sad', 'anxious', 'stressed', 'calm', 'excited', 'tired', 'angry', 'content', 'overwhelmed'
]);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  age: integer('age').notNull(), // 18-25 for university students
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Moods table for mood tracking
export const moodsTable = pgTable('moods', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  mood_level: integer('mood_level').notNull(), // 1-10 scale
  mood_type: moodTypeEnum('mood_type').notNull(),
  notes: text('notes'), // Nullable for optional notes
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Journal entries table for private journaling
export const journalEntriesTable = pgTable('journal_entries', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  is_private: boolean('is_private').notNull().default(true), // Default to private
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// AI chat sessions table
export const aiChatSessionsTable = pgTable('ai_chat_sessions', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  session_name: text('session_name').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// AI chat messages table
export const aiChatMessagesTable = pgTable('ai_chat_messages', {
  id: serial('id').primaryKey(),
  session_id: integer('session_id').notNull().references(() => aiChatSessionsTable.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  is_user_message: boolean('is_user_message').notNull(), // true for user, false for AI
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  moods: many(moodsTable),
  journalEntries: many(journalEntriesTable),
  aiChatSessions: many(aiChatSessionsTable),
}));

export const moodsRelations = relations(moodsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [moodsTable.user_id],
    references: [usersTable.id],
  }),
}));

export const journalEntriesRelations = relations(journalEntriesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [journalEntriesTable.user_id],
    references: [usersTable.id],
  }),
}));

export const aiChatSessionsRelations = relations(aiChatSessionsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [aiChatSessionsTable.user_id],
    references: [usersTable.id],
  }),
  messages: many(aiChatMessagesTable),
}));

export const aiChatMessagesRelations = relations(aiChatMessagesTable, ({ one }) => ({
  session: one(aiChatSessionsTable, {
    fields: [aiChatMessagesTable.session_id],
    references: [aiChatSessionsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Mood = typeof moodsTable.$inferSelect;
export type NewMood = typeof moodsTable.$inferInsert;
export type JournalEntry = typeof journalEntriesTable.$inferSelect;
export type NewJournalEntry = typeof journalEntriesTable.$inferInsert;
export type AiChatSession = typeof aiChatSessionsTable.$inferSelect;
export type NewAiChatSession = typeof aiChatSessionsTable.$inferInsert;
export type AiChatMessage = typeof aiChatMessagesTable.$inferSelect;
export type NewAiChatMessage = typeof aiChatMessagesTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  users: usersTable,
  moods: moodsTable,
  journalEntries: journalEntriesTable,
  aiChatSessions: aiChatSessionsTable,
  aiChatMessages: aiChatMessagesTable,
};
