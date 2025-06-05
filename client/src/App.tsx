
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { GameChoice, PlayGameResponse, GameStats } from '../../server/src/schema';

// Choice options for the random selection
const choices: GameChoice[] = ['rock', 'paper', 'scissors'];

// Visual representations for each choice
const choiceEmojis = {
  rock: '🪨',
  paper: '📄', 
  scissors: '✂️'
} as const;

const choiceLabels = {
  rock: 'Rock',
  paper: 'Paper',
  scissors: 'Scissors'
} as const;

function App() {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'result'>('ready');
  const [gameResult, setGameResult] = useState<PlayGameResponse | null>(null);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const result = await trpc.getGameStats.query();
      setStats(result);
    } catch (error) {
      console.error('Failed to load game stats:', error);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const playRound = async (userChoice: GameChoice) => {
    // Start animation and game
    setIsAnimating(true);
    setGameState('playing');
    
    try {
      // Simulate button flash animation
      setTimeout(async () => {
        setIsAnimating(false);
        
        // Call the API
        const result = await trpc.playGame.mutate({ userChoice });
        setGameResult(result);
        setGameState('result');
        
        // Refresh stats
        await loadStats();
        
        // Auto return to ready state after 3 seconds
        setTimeout(() => {
          setGameState('ready');
          setGameResult(null);
        }, 3000);
      }, 600); // Flash duration
      
    } catch (error) {
      console.error('Failed to play game:', error);
      setGameState('ready');
      setIsAnimating(false);
    }
  };

  const getResultMessage = (result: string) => {
    switch (result) {
      case 'win':
        return { text: 'You Win! 🎉', color: 'text-green-600' };
      case 'lose':
        return { text: 'You Lose! 😢', color: 'text-red-600' };
      case 'draw':
        return { text: "It's a Draw! 🤝", color: 'text-yellow-600' };
      default:
        return { text: '', color: '' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-lg w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Rock Paper Scissors
        </h1>

        {/* Stats Display */}
        {stats && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalGames}</div>
                  <div className="text-sm text-gray-600">Games</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.wins}</div>
                  <div className="text-sm text-gray-600">Wins</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{stats.losses}</div>
                  <div className="text-sm text-gray-600">Losses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.draws}</div>
                  <div className="text-sm text-gray-600">Draws</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Game Area */}
        <div className="space-y-6">
          {gameState === 'ready' && (
            <div className="flex flex-col space-y-4">
              <div className="text-lg font-semibold text-gray-700 mb-2">Choose your move:</div>
              <div className="flex justify-center space-x-4">
                {choices.map((choice) => (
                  <Button
                    key={choice}
                    onClick={() => playRound(choice)}
                    className={`w-32 h-32 rounded-full text-lg font-bold bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all duration-200 flex flex-col items-center justify-center ${
                      isAnimating ? 'animate-pulse bg-green-300 scale-110' : ''
                    }`}
                    disabled={gameState !== 'ready'}
                  >
                    <span className="text-3xl mb-1">{choiceEmojis[choice]}</span>
                    <span className="text-sm">{choiceLabels[choice]}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-green-300 flex items-center justify-center animate-pulse">
                <span className="text-6xl">🎲</span>
              </div>
            </div>
          )}

          {gameState === 'result' && gameResult && (
            <div className="space-y-6">
              {/* Choices Display */}
              <div className="flex justify-center items-center space-x-8">
                <div className="text-center">
                  <div className="text-6xl mb-2">{choiceEmojis[gameResult.userChoice]}</div>
                  <div className="text-lg font-semibold text-gray-700">You</div>
                  <div className="text-sm text-gray-600">{choiceLabels[gameResult.userChoice]}</div>
                </div>
                
                <div className="text-4xl text-gray-400">VS</div>
                
                <div className="text-center">
                  <div className="text-6xl mb-2">{choiceEmojis[gameResult.computerChoice]}</div>
                  <div className="text-lg font-semibold text-gray-700">Computer</div>
                  <div className="text-sm text-gray-600">{choiceLabels[gameResult.computerChoice]}</div>
                </div>
              </div>

              {/* Result */}
              <div className="text-center">
                <div className={`text-3xl font-bold ${getResultMessage(gameResult.result).color}`}>
                  {getResultMessage(gameResult.result).text}
                </div>
              </div>
            </div>
          )}
        </div>

        {gameState === 'result' && (
          <div className="text-sm text-gray-500 mt-4">
            Next round starts automatically...
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
