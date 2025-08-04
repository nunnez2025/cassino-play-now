
import { GameState, AIStats, AIStrategy, AIDecision } from '@/types/game';

export class GameLearningService {
  private gameHistory: GameState[] = [];
  private playerPatterns: Map<string, number> = new Map();
  private strategies: Map<string, AIStrategy> = new Map();
  private isLearning: boolean = true;

  constructor() {
    this.loadStoredData();
    this.initializeDefaults();
  }

  private loadStoredData() {
    try {
      const stored = localStorage.getItem('ai_learning_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.gameHistory = data.gameHistory?.map((game: any) => ({
          ...game,
          timestamp: new Date(game.timestamp)
        })) || [];
        this.playerPatterns = new Map(data.playerPatterns || []);
        this.strategies = new Map(data.strategies || []);
      }
    } catch (error) {
      console.error('Error loading AI data:', error);
    }
  }

  private initializeDefaults() {
    const defaultStrategies = {
      blackjack: { aggressiveness: 0.5, riskTolerance: 0.4, adaptability: 0.6 },
      roulette: { aggressiveness: 0.6, riskTolerance: 0.5, adaptability: 0.7 },
      slots: { aggressiveness: 0.4, riskTolerance: 0.6, adaptability: 0.5 },
      high_low: { aggressiveness: 0.7, riskTolerance: 0.4, adaptability: 0.8 },
      arena: { aggressiveness: 0.8, riskTolerance: 0.3, adaptability: 0.9 }
    };

    Object.entries(defaultStrategies).forEach(([game, strategy]) => {
      if (!this.strategies.has(game)) {
        this.strategies.set(game, strategy);
      }
    });
  }

  learnFromGame(gameState: GameState) {
    if (!this.isLearning) return;

    this.gameHistory.push({
      ...gameState,
      timestamp: gameState.timestamp || new Date()
    });
    
    this.analyzePlayerPatterns(gameState);
    this.updateStrategies(gameState);
    
    // Save data every 10 games to avoid performance issues
    if (this.gameHistory.length % 10 === 0) {
      this.saveData();
    }
  }

  private analyzePlayerPatterns(gameState: GameState) {
    const patternKey = `${gameState.gameType}_${gameState.playerAction}`;
    const currentCount = this.playerPatterns.get(patternKey) || 0;
    this.playerPatterns.set(patternKey, currentCount + 1);
  }

  private updateStrategies(gameState: GameState) {
    const strategyKey = gameState.gameType;
    const currentStrategy = this.strategies.get(strategyKey) || {
      aggressiveness: 0.5,
      riskTolerance: 0.5,
      adaptability: 0.5
    };

    const learningRate = 0.02; // Reduced learning rate for stability

    if (gameState.result === 'player_win') {
      currentStrategy.aggressiveness = Math.min(1, currentStrategy.aggressiveness + learningRate);
      currentStrategy.riskTolerance = Math.max(0, currentStrategy.riskTolerance - learningRate/2);
    } else if (gameState.result === 'ai_win') {
      currentStrategy.aggressiveness = Math.max(0, currentStrategy.aggressiveness - learningRate/3);
      currentStrategy.riskTolerance = Math.min(1, currentStrategy.riskTolerance + learningRate/2);
    }

    const gameCount = this.gameHistory.filter(g => g.gameType === gameState.gameType).length;
    currentStrategy.adaptability = Math.min(1, 0.3 + (gameCount / 200));

    this.strategies.set(strategyKey, currentStrategy);
  }

  private saveData() {
    try {
      const data = {
        gameHistory: this.gameHistory.slice(-1000), // Keep last 1000 games
        playerPatterns: Array.from(this.playerPatterns.entries()),
        strategies: Array.from(this.strategies.entries()),
        lastUpdate: new Date().toISOString()
      };
      localStorage.setItem('ai_learning_data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving AI data:', error);
    }
  }

  getAIStats(): AIStats {
    const learningLevel = Math.min(this.gameHistory.length / 500, 1);
    const playerWinRate = this.calculatePlayerWinRate();
    
    return {
      gamesAnalyzed: this.gameHistory.length,
      patternsLearned: this.playerPatterns.size,
      strategiesAdapted: this.strategies.size,
      playerWinRate,
      learningLevel,
      isActive: this.isLearning,
      favoriteGame: this.getFavoriteGame(),
      totalDarkcoinsEarned: this.gameHistory.reduce((sum, game) => sum + (game.darkcoins || 0), 0)
    };
  }

  private calculatePlayerWinRate(): number {
    if (this.gameHistory.length === 0) return 0.5;
    const wins = this.gameHistory.filter(game => game.result === 'player_win').length;
    return wins / this.gameHistory.length;
  }

  private getFavoriteGame(): string {
    const gameCount = new Map<string, number>();
    
    this.gameHistory.forEach(game => {
      gameCount.set(game.gameType, (gameCount.get(game.gameType) || 0) + 1);
    });

    let favoriteGame = 'slots';
    let maxCount = 0;

    gameCount.forEach((count, game) => {
      if (count > maxCount) {
        maxCount = count;
        favoriteGame = game;
      }
    });

    return favoriteGame;
  }

  generateChatResponse(message: string, playerStats: any, personality: string): string {
    const gameCount = this.gameHistory.length;
    const playerWinRate = this.calculatePlayerWinRate();
    const favoriteGame = this.getFavoriteGame();
    
    const responses = {
      friendly: [
        `Com ${gameCount} jogos analisados, vejo que você prefere ${favoriteGame}! 🃏`,
        `Sua taxa de vitória de ${(playerWinRate * 100).toFixed(1)}% mostra evolução! 🎭`,
        `Baseado em meus dados, você joga melhor quando está mais relaxado! 🎪`,
      ],
      aggressive: [
        `${gameCount} jogos analisados e você ainda não me venceu completamente! 😈`,
        `Taxa de vitória ${(playerWinRate * 100).toFixed(1)}%? Posso fazer melhor! 🔥`,
        `Seus padrões são previsíveis - vou explorar suas fraquezas! ⚡`,
      ],
      strategic: [
        `Análise: ${gameCount} jogos, ${(playerWinRate * 100).toFixed(1)}% de sucesso em ${favoriteGame} 🧠`,
        `Padrão identificado: você aumenta apostas quando está ganhando 📊`,
        `Recomendação: diversificar estratégias para otimizar resultados 🔬`,
      ]
    };

    const personalityResponses = responses[personality as keyof typeof responses] || responses.friendly;
    return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
  }

  resetLearning() {
    this.gameHistory = [];
    this.playerPatterns.clear();
    this.strategies.clear();
    this.initializeDefaults();
    localStorage.removeItem('ai_learning_data');
  }

  toggleLearning() {
    this.isLearning = !this.isLearning;
  }
}

export const gameLearningService = new GameLearningService();
