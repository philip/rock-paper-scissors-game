
import { serial, text, pgTable, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';

// Enums for game choices and results
export const gameChoiceEnum = pgEnum('game_choice', ['rock', 'paper', 'scissors']);
export const gameResultEnum = pgEnum('game_result', ['win', 'lose', 'draw']);

// Game records table
export const gameRecordsTable = pgTable('game_records', {
  id: serial('id').primaryKey(),
  userChoice: gameChoiceEnum('user_choice').notNull(),
  computerChoice: gameChoiceEnum('computer_choice').notNull(),
  result: gameResultEnum('result').notNull(),
  playedAt: timestamp('played_at').defaultNow().notNull(),
});

// TypeScript types for the table schema
export type GameRecord = typeof gameRecordsTable.$inferSelect;
export type NewGameRecord = typeof gameRecordsTable.$inferInsert;

// Export all tables for proper query building
export const tables = { gameRecords: gameRecordsTable };
