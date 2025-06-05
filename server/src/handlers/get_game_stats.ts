
import { db } from '../db';
import { gameRecordsTable } from '../db/schema';
import { type GameStats } from '../schema';
import { eq, count } from 'drizzle-orm';

export const getGameStats = async (): Promise<GameStats> => {
  try {
    // Get total games count
    const totalGamesResult = await db
      .select({ count: count() })
      .from(gameRecordsTable)
      .execute();

    const totalGames = totalGamesResult[0]?.count || 0;

    // Get wins count
    const winsResult = await db
      .select({ count: count() })
      .from(gameRecordsTable)
      .where(eq(gameRecordsTable.result, 'win'))
      .execute();

    const wins = winsResult[0]?.count || 0;

    // Get losses count
    const lossesResult = await db
      .select({ count: count() })
      .from(gameRecordsTable)
      .where(eq(gameRecordsTable.result, 'lose'))
      .execute();

    const losses = lossesResult[0]?.count || 0;

    // Get draws count
    const drawsResult = await db
      .select({ count: count() })
      .from(gameRecordsTable)
      .where(eq(gameRecordsTable.result, 'draw'))
      .execute();

    const draws = drawsResult[0]?.count || 0;

    return {
      totalGames,
      wins,
      losses,
      draws
    };
  } catch (error) {
    console.error('Failed to get game stats:', error);
    throw error;
  }
};
