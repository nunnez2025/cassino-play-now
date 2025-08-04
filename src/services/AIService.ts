
import { gameLearningService } from './GameLearningService';
import { GameState, AIStats } from '@/types/game';

// Re-export for backwards compatibility
export const aiService = {
  learnFromGame: (gameState: GameState) => gameLearningService.learnFromGame(gameState),
  getAIStats: (): AIStats => gameLearningService.getAIStats(),
  generateChatResponse: (message: string, playerStats: any, personality: string): string => 
    gameLearningService.generateChatResponse(message, playerStats, personality),
  resetLearning: () => gameLearningService.resetLearning(),
  toggleLearning: () => gameLearningService.toggleLearning()
};

export default gameLearningService;
