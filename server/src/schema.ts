
import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  age: z.number().int().min(18).max(25), // University students aged 18-25
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Mood tracking schema
export const moodSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  mood_level: z.number().int().min(1).max(10), // 1-10 scale
  mood_type: z.enum(['happy', 'sad', 'anxious', 'stressed', 'calm', 'excited', 'tired', 'angry', 'content', 'overwhelmed']),
  notes: z.string().nullable(),
  created_at: z.coerce.date()
});

export type Mood = z.infer<typeof moodSchema>;

// Journal entry schema
export const journalEntrySchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string(),
  content: z.string(),
  is_private: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type JournalEntry = z.infer<typeof journalEntrySchema>;

// AI chat session schema
export const aiChatSessionSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  session_name: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type AiChatSession = z.infer<typeof aiChatSessionSchema>;

// AI chat message schema
export const aiChatMessageSchema = z.object({
  id: z.number(),
  session_id: z.number(),
  message: z.string(),
  is_user_message: z.boolean(), // true for user, false for AI
  created_at: z.coerce.date()
});

export type AiChatMessage = z.infer<typeof aiChatMessageSchema>;

// Input schemas for creating records
export const createUserInputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  age: z.number().int().min(18).max(25)
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createMoodInputSchema = z.object({
  user_id: z.number(),
  mood_level: z.number().int().min(1).max(10),
  mood_type: z.enum(['happy', 'sad', 'anxious', 'stressed', 'calm', 'excited', 'tired', 'angry', 'content', 'overwhelmed']),
  notes: z.string().nullable().optional()
});

export type CreateMoodInput = z.infer<typeof createMoodInputSchema>;

export const createJournalEntryInputSchema = z.object({
  user_id: z.number(),
  title: z.string().min(1),
  content: z.string().min(1),
  is_private: z.boolean().default(true)
});

export type CreateJournalEntryInput = z.infer<typeof createJournalEntryInputSchema>;

export const updateJournalEntryInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  is_private: z.boolean().optional()
});

export type UpdateJournalEntryInput = z.infer<typeof updateJournalEntryInputSchema>;

export const createAiChatSessionInputSchema = z.object({
  user_id: z.number(),
  session_name: z.string().min(1)
});

export type CreateAiChatSessionInput = z.infer<typeof createAiChatSessionInputSchema>;

export const createAiChatMessageInputSchema = z.object({
  session_id: z.number(),
  message: z.string().min(1),
  is_user_message: z.boolean()
});

export type CreateAiChatMessageInput = z.infer<typeof createAiChatMessageInputSchema>;

// Query input schemas
export const getUserMoodsInputSchema = z.object({
  user_id: z.number(),
  days: z.number().int().positive().optional().default(30) // Default to last 30 days
});

export type GetUserMoodsInput = z.infer<typeof getUserMoodsInputSchema>;

export const getUserJournalEntriesInputSchema = z.object({
  user_id: z.number(),
  limit: z.number().int().positive().optional().default(20)
});

export type GetUserJournalEntriesInput = z.infer<typeof getUserJournalEntriesInputSchema>;

export const getAiChatSessionsInputSchema = z.object({
  user_id: z.number()
});

export type GetAiChatSessionsInput = z.infer<typeof getAiChatSessionsInputSchema>;

export const getAiChatMessagesInputSchema = z.object({
  session_id: z.number()
});

export type GetAiChatMessagesInput = z.infer<typeof getAiChatMessagesInputSchema>;
