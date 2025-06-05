
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { gameRecordsTable } from '../db/schema';
import { type PlayGameInput } from '../schema';
import { playGame } from '../handlers/play_game';
import { eq } from 'drizzle-orm';

const testInput: PlayGameInput = {
  userChoice: 'rock'
};

describe('playGame', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should play a game and return valid response', async () => {
    const result = await playGame(testInput);

    // Validate response structure
    expect(result.userChoice).toEqual('rock');
    expect(['rock', 'paper', 'scissors']).toContain(result.computerChoice);
    expect(['win', 'lose', 'draw']).toContain(result.result);
  });

  it('should determine correct game results', async () => {
    // Test winning scenario
    const rockResult = await playGame({ userChoice: 'rock' });
    if (rockResult.computerChoice === 'scissors') {
      expect(rockResult.result).toEqual('win');
    } else if (rockResult.computerChoice === 'paper') {
      expect(rockResult.result).toEqual('lose');
    } else {
      expect(rockResult.result).toEqual('draw');
    }

    // Test paper scenario
    const paperResult = await playGame({ userChoice: 'paper' });
    if (paperResult.computerChoice === 'rock') {
      expect(paperResult.result).toEqual('win');
    } else if (paperResult.computerChoice === 'scissors') {
      expect(paperResult.result).toEqual('lose');
    } else {
      expect(paperResult.result).toEqual('draw');
    }

    // Test scissors scenario
    const scissorsResult = await playGame({ userChoice: 'scissors' });
    if (scissorsResult.computerChoice === 'paper') {
      expect(scissorsResult.result).toEqual('win');
    } else if (scissorsResult.computerChoice === 'rock') {
      expect(scissorsResult.result).toEqual('lose');
    } else {
      expect(scissorsResult.result).toEqual('draw');
    }
  });

  it('should save game record to database', async () => {
    const result = await playGame(testInput);

    // Query the database to verify record was saved
    const gameRecords = await db.select()
      .from(gameRecordsTable)
      .where(eq(gameRecordsTable.userChoice, 'rock'))
      .execute();

    expect(gameRecords).toHaveLength(1);
    expect(gameRecords[0].userChoice).toEqual('rock');
    expect(gameRecords[0].computerChoice).toEqual(result.computerChoice);
    expect(gameRecords[0].result).toEqual(result.result);
    expect(gameRecords[0].playedAt).toBeInstanceOf(Date);
    expect(gameRecords[0].id).toBeDefined();
  });

  it('should handle multiple games correctly', async () => {
    // Play multiple games
    await playGame({ userChoice: 'rock' });
    await playGame({ userChoice: 'paper' });
    await playGame({ userChoice: 'scissors' });

    // Verify all games were recorded
    const allRecords = await db.select()
      .from(gameRecordsTable)
      .execute();

    expect(allRecords).toHaveLength(3);
    expect(allRecords.map(r => r.userChoice)).toContain('rock');
    expect(allRecords.map(r => r.userChoice)).toContain('paper');
    expect(allRecords.map(r => r.userChoice)).toContain('scissors');
  });
});
