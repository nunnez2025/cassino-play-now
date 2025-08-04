
interface AIResponse {
  response: string;
  confidence: number;
  strategy: string;
}

interface GameState {
  gameType: string;
  playerAction: string;
  result: string;
  playerBalance: number;
  timestamp: Date;
}

class AILearningService {
  private gameHistory: GameState[] = [];
  private playerPatterns: Map<string, number> = new Map();
  private strategies: Map<string, any> = new Map();

  constructor() {
    this.loadStoredData();
  }

  // Store and retrieve data from localStorage (in real app, would use Supabase)
  private loadStoredData() {
    try {
      const stored = localStorage.getItem('ai_learning_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.gameHistory = data.gameHistory || [];
        this.playerPatterns = new Map(data.playerPatterns || []);
        this.strategies = new Map(data.strategies || []);
      }
    } catch (error) {
      console.error('Error loading AI data:', error);
    }
  }

  private saveData() {
    try {
      const data = {
        gameHistory: this.gameHistory.slice(-1000), // Keep last 1000 games
        playerPatterns: Array.from(this.playerPatterns.entries()),
        strategies: Array.from(this.strategies.entries())
      };
      localStorage.setItem('ai_learning_data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving AI data:', error);
    }
  }

  // Learn from player's game behavior
  learnFromGame(gameState: GameState) {
    this.gameHistory.push(gameState);
    
    // Analyze player patterns
    const patternKey = `${gameState.gameType}_${gameState.playerAction}`;
    const currentCount = this.playerPatterns.get(patternKey) || 0;
    this.playerPatterns.set(patternKey, currentCount + 1);

    // Update strategies based on success/failure
    this.updateStrategies(gameState);
    this.saveData();
  }

  private updateStrategies(gameState: GameState) {
    const strategyKey = gameState.gameType;
    const currentStrategy = this.strategies.get(strategyKey) || {
      aggressiveness: 0.5,
      riskTolerance: 0.5,
      adaptability: 0.5
    };

    // Adjust strategy based on game result
    if (gameState.result === 'player_win') {
      currentStrategy.aggressiveness = Math.min(1, currentStrategy.aggressiveness + 0.1);
      currentStrategy.riskTolerance = Math.max(0, currentStrategy.riskTolerance - 0.05);
    } else if (gameState.result === 'ai_win') {
      currentStrategy.aggressiveness = Math.max(0, currentStrategy.aggressiveness - 0.05);
      currentStrategy.riskTolerance = Math.min(1, currentStrategy.riskTolerance + 0.1);
    }

    this.strategies.set(strategyKey, currentStrategy);
  }

  // Generate AI decision based on learned patterns
  makeDecision(gameType: string, context: any): any {
    const strategy = this.strategies.get(gameType) || {
      aggressiveness: 0.5,
      riskTolerance: 0.5,
      adaptability: 0.5
    };

    switch (gameType) {
      case 'blackjack':
        return this.makeBlackjackDecision(context, strategy);
      case 'poker':
        return this.makePokerDecision(context, strategy);
      case 'roulette':
        return this.makeRouletteDecision(context, strategy);
      case 'high_low':
        return this.makeHighLowDecision(context, strategy);
      default:
        return this.makeRandomDecision(strategy);
    }
  }

  private makeBlackjackDecision(context: any, strategy: any) {
    const { playerCards, dealerCard, playerTotal } = context;
    
    // Basic strategy with AI learning modifications
    if (playerTotal <= 11) return 'hit';
    if (playerTotal >= 17) return 'stand';
    
    // Apply learned aggressiveness
    const riskThreshold = 16 + (strategy.riskTolerance * 4);
    if (playerTotal >= riskThreshold) return 'stand';
    
    return Math.random() < strategy.aggressiveness ? 'hit' : 'stand';
  }

  private makeHighLowDecision(context: any, strategy: any) {
    const { currentCard } = context;
    
    // Analyze historical patterns
    const higherPattern = this.playerPatterns.get('high_low_higher') || 0;
    const lowerPattern = this.playerPatterns.get('high_low_lower') || 0;
    
    let decision = 'higher';
    
    if (currentCard <= 6) {
      decision = 'higher';
    } else if (currentCard >= 8) {
      decision = 'lower';
    } else {
      // Use learned patterns for middle cards
      if (lowerPattern > higherPattern) {
        decision = Math.random() < strategy.adaptability ? 'higher' : 'lower';
      } else {
        decision = Math.random() < strategy.adaptability ? 'lower' : 'higher';
      }
    }

    return decision;
  }

  private makePokerDecision(context: any, strategy: any) {
    const { hand, communityCards, pot, playerBet } = context;
    
    // Simple hand evaluation with strategy modification
    const handStrength = this.evaluatePokerHand(hand, communityCards);
    const aggressionFactor = strategy.aggressiveness;
    
    if (handStrength > 0.8) return 'raise';
    if (handStrength > 0.6 && Math.random() < aggressionFactor) return 'call';
    if (handStrength > 0.4) return 'call';
    
    return 'fold';
  }

  private makeRouletteDecision(context: any, strategy: any) {
    const { lastNumbers, playerBets } = context;
    
    // Analyze recent patterns
    const recentReds = lastNumbers.filter((n: number) => [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(n)).length;
    const recentBlacks = lastNumbers.length - recentReds;
    
    // Apply counter-strategy based on learned patterns
    if (recentReds > recentBlacks && Math.random() < strategy.adaptability) {
      return { type: 'color', value: 'black', amount: 25 };
    } else if (recentBlacks > recentReds && Math.random() < strategy.adaptability) {
      return { type: 'color', value: 'red', amount: 25 };
    }
    
    // Random strategic choice
    const choices = ['red', 'black', 'even', 'odd'];
    return { 
      type: 'color', 
      value: choices[Math.floor(Math.random() * choices.length)], 
      amount: 25 * (1 + strategy.riskTolerance) 
    };
  }

  private makeRandomDecision(strategy: any) {
    return {
      action: 'random',
      confidence: strategy.riskTolerance,
      reasoning: 'Decisão baseada em análise de padrões aprendidos'
    };
  }

  private evaluatePokerHand(hand: any[], communityCards: any[]): number {
    // Simplified hand evaluation - in real implementation would be more complex
    return Math.random() * 0.6 + 0.2; // Return value between 0.2 and 0.8
  }

  // Get AI chat response based on learned data
  generateChatResponse(message: string, playerStats: any, personality: string): string {
    const gameCount = this.gameHistory.length;
    const playerWinRate = this.calculatePlayerWinRate();
    
    // Personality-based responses
    const responses = {
      friendly: [
        `Interessante! Com ${gameCount} jogos analisados, posso ver que você está evoluindo! 🃏`,
        `Seus padrões de jogo mostram que você tem ${(playerWinRate * 100).toFixed(1)}% de taxa de vitória. Impressionante! 🎭`,
        `Baseado no que aprendi observando você, que tal tentar uma estratégia mais agressiva no próximo jogo? 🎪`,
      ],
      aggressive: [
        `Com sua taxa de vitória de ${(playerWinRate * 100).toFixed(1)}%, você ainda não está no meu nível! 😈`,
        `Analisei ${gameCount} de seus jogos - você precisa melhorar sua estratégia! 🔥`,
        `Seus padrões são previsíveis. Vou ajustar minha estratégia para te derrotar! ⚡`,
      ],
      strategic: [
        `Análise completa: ${gameCount} jogos processados. Taxa de sucesso: ${(playerWinRate * 100).toFixed(1)}%. 🧠`,
        `Padrões identificados em seus ${gameCount} jogos. Sugestão: varie mais suas estratégias. 📊`,
        `Correlação encontrada entre suas apostas e resultados. Quer discutir otimizações? 🔬`,
      ]
    };

    const personalityResponses = responses[personality as keyof typeof responses] || responses.friendly;
    return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
  }

  private calculatePlayerWinRate(): number {
    if (this.gameHistory.length === 0) return 0.5;
    
    const wins = this.gameHistory.filter(game => game.result === 'player_win').length;
    return wins / this.gameHistory.length;
  }

  // Get current AI statistics
  getAIStats() {
    return {
      gamesAnalyzed: this.gameHistory.length,
      patternsLearned: this.playerPatterns.size,
      strategiesAdapted: this.strategies.size,
      playerWinRate: this.calculatePlayerWinRate(),
      learningLevel: Math.min(this.gameHistory.length / 1000, 1) // 0 to 1
    };
  }
}

export const aiService = new AILearningService();
export default AILearningService;
