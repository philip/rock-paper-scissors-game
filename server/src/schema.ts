
import { z } from 'zod';

// Game choice enum
export const gameChoiceSchema = z.enum(['rock', 'paper', 'scissors']);
export type GameChoice = z.infer<typeof gameChoiceSchema>;

// Game result enum
export const gameResultSchema = z.enum(['win', 'lose', 'draw']);
export type GameResult = z.infer<typeof gameResultSchema>;

// Play game input schema
export const playGameInputSchema = z.object({
  userChoice: gameChoiceSchema
});
export type PlayGameInput = z.infer<typeof playGameInputSchema>;

// Play game response schema
export const playGameResponseSchema = z.object({
  userChoice: gameChoiceSchema,
  computerChoice: gameChoiceSchema,
  result: gameResultSchema
});
export type PlayGameResponse = z.infer<typeof playGameResponseSchema>;

// Game stats schema
export const gameStatsSchema = z.object({
  totalGames: z.number().int(),
  wins: z.number().int(),
  losses: z.number().int(),
  draws: z.number().int()
});
export type GameStats = z.infer<typeof gameStatsSchema>;
