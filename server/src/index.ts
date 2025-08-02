
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import {
  createUserInputSchema,
  createMoodInputSchema,
  getUserMoodsInputSchema,
  createJournalEntryInputSchema,
  updateJournalEntryInputSchema,
  getUserJournalEntriesInputSchema,
  createAiChatSessionInputSchema,
  getAiChatSessionsInputSchema,
  createAiChatMessageInputSchema,
  getAiChatMessagesInputSchema
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { createMood } from './handlers/create_mood';
import { getUserMoods } from './handlers/get_user_moods';
import { createJournalEntry } from './handlers/create_journal_entry';
import { updateJournalEntry } from './handlers/update_journal_entry';
import { getUserJournalEntries } from './handlers/get_user_journal_entries';
import { createAiChatSession } from './handlers/create_ai_chat_session';
import { getAiChatSessions } from './handlers/get_ai_chat_sessions';
import { createAiChatMessage } from './handlers/create_ai_chat_message';
import { getAiChatMessages } from './handlers/get_ai_chat_messages';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),

  // Mood tracking
  createMood: publicProcedure
    .input(createMoodInputSchema)
    .mutation(({ input }) => createMood(input)),

  getUserMoods: publicProcedure
    .input(getUserMoodsInputSchema)
    .query(({ input }) => getUserMoods(input)),

  // Journal entries
  createJournalEntry: publicProcedure
    .input(createJournalEntryInputSchema)
    .mutation(({ input }) => createJournalEntry(input)),

  updateJournalEntry: publicProcedure
    .input(updateJournalEntryInputSchema)
    .mutation(({ input }) => updateJournalEntry(input)),

  getUserJournalEntries: publicProcedure
    .input(getUserJournalEntriesInputSchema)
    .query(({ input }) => getUserJournalEntries(input)),

  // AI chat functionality
  createAiChatSession: publicProcedure
    .input(createAiChatSessionInputSchema)
    .mutation(({ input }) => createAiChatSession(input)),

  getAiChatSessions: publicProcedure
    .input(getAiChatSessionsInputSchema)
    .query(({ input }) => getAiChatSessions(input)),

  createAiChatMessage: publicProcedure
    .input(createAiChatMessageInputSchema)
    .mutation(({ input }) => createAiChatMessage(input)),

  getAiChatMessages: publicProcedure
    .input(getAiChatMessagesInputSchema)
    .query(({ input }) => getAiChatMessages(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Mental Health TRPC server listening at port: ${port}`);
}

start();
