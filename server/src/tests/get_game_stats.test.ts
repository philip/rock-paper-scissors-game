
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { gameRecordsTable } from '../db/schema';
import { getGameStats } from '../handlers/get_game_stats';

describe('getGameStats', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return zero stats when no games played', async () => {
    const stats = await getGameStats();

    expect(stats.totalGames).toEqual(0);
    expect(stats.wins).toEqual(0);
    expect(stats.losses).toEqual(0);
    expect(stats.draws).toEqual(0);
  });

  it('should return correct stats with mixed game results', async () => {
    // Insert test game records
    await db.insert(gameRecordsTable).values([
      {
        userChoice: 'rock',
        computerChoice: 'scissors',
        result: 'win'
      },
      {
        userChoice: 'paper',
        computerChoice: 'rock',
        result: 'win'
      },
      {
        userChoice: 'scissors',
        computerChoice: 'rock',
        result: 'lose'
      },
      {
        userChoice: 'rock',
        computerChoice: 'rock',
        result: 'draw'
      },
      {
        userChoice: 'paper',
        computerChoice: 'paper',
        result: 'draw'
      }
    ]).execute();

    const stats = await getGameStats();

    expect(stats.totalGames).toEqual(5);
    expect(stats.wins).toEqual(2);
    expect(stats.losses).toEqual(1);
    expect(stats.draws).toEqual(2);
  });

  it('should return correct stats with only wins', async () => {
    // Insert only winning games
    await db.insert(gameRecordsTable).values([
      {
        userChoice: 'rock',
        computerChoice: 'scissors',
        result: 'win'
      },
      {
        userChoice: 'paper',
        computerChoice: 'rock',
        result: 'win'
      },
      {
        userChoice: 'scissors',
        computerChoice: 'paper',
        result: 'win'
      }
    ]).execute();

    const stats = await getGameStats();

    expect(stats.totalGames).toEqual(3);
    expect(stats.wins).toEqual(3);
    expect(stats.losses).toEqual(0);
    expect(stats.draws).toEqual(0);
  });

  it('should return correct stats with only losses', async () => {
    // Insert only losing games
    await db.insert(gameRecordsTable).values([
      {
        userChoice: 'rock',
        computerChoice: 'paper',
        result: 'lose'
      },
      {
        userChoice: 'paper',
        computerChoice: 'scissors',
        result: 'lose'
      }
    ]).execute();

    const stats = await getGameStats();

    expect(stats.totalGames).toEqual(2);
    expect(stats.wins).toEqual(0);
    expect(stats.losses).toEqual(2);
    expect(stats.draws).toEqual(0);
  });
});
