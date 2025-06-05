
import { db } from '../db';
import { gameRecordsTable } from '../db/schema';
import { type PlayGameInput, type PlayGameResponse, type GameChoice, type GameResult } from '../schema';

const getRandomChoice = (): GameChoice => {
  const choices: GameChoice[] = ['rock', 'paper', 'scissors'];
  return choices[Math.floor(Math.random() * choices.length)];
};

const determineResult = (userChoice: GameChoice, computerChoice: GameChoice): GameResult => {
  if (userChoice === computerChoice) {
    return 'draw';
  }
  
  const winConditions: Record<GameChoice, GameChoice> = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
  };
  
  return winConditions[userChoice] === computerChoice ? 'win' : 'lose';
};

export const playGame = async (input: PlayGameInput): Promise<PlayGameResponse> => {
  try {
    const computerChoice = getRandomChoice();
    const result = determineResult(input.userChoice, computerChoice);
    
    // Store the game record in the database
    await db.insert(gameRecordsTable)
      .values({
        userChoice: input.userChoice,
        computerChoice: computerChoice,
        result: result
      })
      .execute();
    
    return {
      userChoice: input.userChoice,
      computerChoice: computerChoice,
      result: result
    };
  } catch (error) {
    console.error('Game play failed:', error);
    throw error;
  }
};
