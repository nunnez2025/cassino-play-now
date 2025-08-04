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
  darkcoins: number;
  timestamp: Date;
}

interface PlayerStats {
  totalGames: number;
  winRate: number;
  averageBet: number;
  favoriteGame: string;
  riskLevel: 'low' | 'medium' | 'high';
}

class AILearningService {
  private gameHistory: GameState[] = [];
  private playerPatterns: Map<string, number> = new Map();
  private strategies: Map<string, any> = new Map();
  private isLearning: boolean = true;

  constructor() {
    this.loadStoredData();
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
      this.initializeDefaults();
    }
  }

  private initializeDefaults() {
    // Inicializar estratégias padrão para cada jogo
    const defaultStrategies = {
      blackjack: { aggressiveness: 0.5, riskTolerance: 0.4, adaptability: 0.6 },
      roulette: { aggressiveness: 0.6, riskTolerance: 0.5, adaptability: 0.7 },
      slots: { aggressiveness: 0.4, riskTolerance: 0.6, adaptability: 0.5 },
      high_low: { aggressiveness: 0.7, riskTolerance: 0.4, adaptability: 0.8 },
      arena: { aggressiveness: 0.8, riskTolerance: 0.3, adaptability: 0.9 }
    };

    Object.entries(defaultStrategies).forEach(([game, strategy]) => {
      this.strategies.set(game, strategy);
    });
  }

  private saveData() {
    try {
      const data = {
        gameHistory: this.gameHistory.slice(-2000), // Keep last 2000 games
        playerPatterns: Array.from(this.playerPatterns.entries()),
        strategies: Array.from(this.strategies.entries()),
        lastUpdate: new Date().toISOString()
      };
      localStorage.setItem('ai_learning_data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving AI data:', error);
    }
  }

  learnFromGame(gameState: GameState) {
    if (!this.isLearning) return;

    // Adicionar timestamp se não existir
    const completeGameState = {
      ...gameState,
      timestamp: gameState.timestamp || new Date()
    };

    this.gameHistory.push(completeGameState);
    
    // Analisar padrões do jogador
    this.analyzePlayerPatterns(completeGameState);
    
    // Atualizar estratégias baseadas no resultado
    this.updateStrategies(completeGameState);
    
    // Salvar dados periodicamente
    if (this.gameHistory.length % 10 === 0) {
      this.saveData();
    }
  }

  private analyzePlayerPatterns(gameState: GameState) {
    const patternKey = `${gameState.gameType}_${gameState.playerAction}`;
    const currentCount = this.playerPatterns.get(patternKey) || 0;
    this.playerPatterns.set(patternKey, currentCount + 1);

    // Analisar padrões de risco
    const riskPattern = this.calculateRiskLevel(gameState);
    this.playerPatterns.set(`${gameState.gameType}_risk_${riskPattern}`, 
      (this.playerPatterns.get(`${gameState.gameType}_risk_${riskPattern}`) || 0) + 1);

    // Analisar padrões temporais
    const hour = gameState.timestamp.getHours();
    const timePattern = `time_${Math.floor(hour / 4) * 4}`; // Agrupa em blocos de 4 horas
    this.playerPatterns.set(timePattern, (this.playerPatterns.get(timePattern) || 0) + 1);
  }

  private calculateRiskLevel(gameState: GameState): string {
    const balanceRatio = gameState.playerBalance > 0 ? 
      (gameState.playerBalance / 1000) : 0; // Assumindo 1000 como balance inicial
    
    if (balanceRatio > 1.5) return 'low';
    if (balanceRatio > 0.5) return 'medium';
    return 'high';
  }

  private updateStrategies(gameState: GameState) {
    const strategyKey = gameState.gameType;
    const currentStrategy = this.strategies.get(strategyKey) || {
      aggressiveness: 0.5,
      riskTolerance: 0.5,
      adaptability: 0.5
    };

    const learningRate = 0.05; // Taxa de aprendizado baixa para mudanças graduais

    if (gameState.result === 'player_win') {
      // Jogador ganhou - AI precisa ser mais agressiva
      currentStrategy.aggressiveness = Math.min(1, currentStrategy.aggressiveness + learningRate);
      currentStrategy.riskTolerance = Math.max(0, currentStrategy.riskTolerance - learningRate/2);
    } else if (gameState.result === 'ai_win') {
      // IA ganhou - manter estratégia mas ser menos arriscada
      currentStrategy.aggressiveness = Math.max(0, currentStrategy.aggressiveness - learningRate/3);
      currentStrategy.riskTolerance = Math.min(1, currentStrategy.riskTolerance + learningRate/2);
    }

    // Adaptabilidade baseada na frequência de jogo
    const gameCount = this.gameHistory.filter(g => g.gameType === gameState.gameType).length;
    currentStrategy.adaptability = Math.min(1, 0.3 + (gameCount / 100));

    this.strategies.set(strategyKey, currentStrategy);
  }

  makeDecision(gameType: string, context: any): any {
    const strategy = this.strategies.get(gameType) || {
      aggressiveness: 0.5,
      riskTolerance: 0.5,
      adaptability: 0.5
    };

    // Aplicar aprendizado baseado em padrões históricos
    const historicalPattern = this.getHistoricalPattern(gameType, context);
    
    switch (gameType) {
      case 'blackjack':
        return this.makeBlackjackDecision(context, strategy, historicalPattern);
      case 'poker':
        return this.makePokerDecision(context, strategy, historicalPattern);
      case 'roulette':
        return this.makeRouletteDecision(context, strategy, historicalPattern);
      case 'high_low':
        return this.makeHighLowDecision(context, strategy, historicalPattern);
      case 'arena':
        return this.makeArenaDecision(context, strategy, historicalPattern);
      default:
        return this.makeRandomDecision(strategy);
    }
  }

  private getHistoricalPattern(gameType: string, context: any): any {
    const recentGames = this.gameHistory
      .filter(game => game.gameType === gameType)
      .slice(-50); // Últimos 50 jogos do tipo

    if (recentGames.length === 0) return null;

    const playerWins = recentGames.filter(game => game.result === 'player_win').length;
    const winRate = playerWins / recentGames.length;

    return {
      winRate,
      totalGames: recentGames.length,
      averageBalance: recentGames.reduce((sum, game) => sum + game.playerBalance, 0) / recentGames.length,
      trend: winRate > 0.5 ? 'winning' : 'losing'
    };
  }

  private makeBlackjackDecision(context: any, strategy: any, pattern: any) {
    const { playerTotal, dealerCard } = context;
    
    let decision = 'stand';
    
    // Estratégia básica com adaptação de IA
    if (playerTotal <= 11) {
      decision = 'hit';
    } else if (playerTotal >= 17) {
      decision = 'stand';
    } else {
      // Zona de decisão (12-16)
      const riskThreshold = 15 + (strategy.riskTolerance * 2);
      const aggressionBonus = pattern?.winRate > 0.6 ? strategy.aggressiveness * 0.5 : 0;
      
      if (playerTotal <= riskThreshold + aggressionBonus) {
        decision = Math.random() < (0.6 + strategy.aggressiveness * 0.4) ? 'hit' : 'stand';
      } else {
        decision = 'stand';
      }
    }

    return {
      action: decision,
      confidence: strategy.adaptability,
      reasoning: `Baseado em ${pattern?.totalGames || 0} jogos anteriores`
    };
  }

  private makeHighLowDecision(context: any, strategy: any, pattern: any) {
    const { currentCard } = context;
    
    let decision = 'higher';
    let confidence = 0.5;

    // Lógica básica
    if (currentCard <= 6) {
      decision = 'higher';
      confidence = 0.8;
    } else if (currentCard >= 9) {
      decision = 'lower';
      confidence = 0.8;
    } else {
      // Cartas do meio (7-8) - usar padrões aprendidos
      const higherPattern = this.playerPatterns.get('high_low_higher') || 0;
      const lowerPattern = this.playerPatterns.get('high_low_lower') || 0;
      
      if (higherPattern > lowerPattern) {
        decision = Math.random() < strategy.adaptability ? 'lower' : 'higher';
      } else {
        decision = Math.random() < strategy.adaptability ? 'higher' : 'lower';
      }
      
      confidence = 0.6;
    }

    // Ajustar baseado no padrão do jogador
    if (pattern?.trend === 'winning') {
      confidence *= (1 + strategy.aggressiveness * 0.2);
    }

    return { action: decision, confidence, reasoning: 'IA adaptativa' };
  }

  private makeArenaDecision(context: any, strategy: any, pattern: any) {
    const { availableFighters, playerChoice } = context;
    
    // Escolher lutador com base na estratégia aprendida
    const aggressionLevel = strategy.aggressiveness;
    
    let chosenFighter = availableFighters[0]; // Default
    
    if (aggressionLevel > 0.7) {
      // Escolher lutador mais agressivo
      chosenFighter = availableFighters.find((f: any) => f.type === 'aggressive') || availableFighters[0];
    } else if (aggressionLevel < 0.3) {
      // Escolher lutador mais defensivo
      chosenFighter = availableFighters.find((f: any) => f.type === 'defensive') || availableFighters[1];
    } else {
      // Escolher lutador balanceado
      chosenFighter = availableFighters.find((f: any) => f.type === 'balanced') || availableFighters[2];
    }

    return {
      fighter: chosenFighter,
      confidence: strategy.adaptability,
      reasoning: `Estratégia ${aggressionLevel > 0.6 ? 'agressiva' : 'equilibrada'}`
    };
  }

  private makeRouletteDecision(context: any, strategy: any, pattern: any) {
    const { lastNumbers } = context;
    
    const recentReds = lastNumbers?.filter((n: number) => 
      [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(n)
    ).length || 0;
    
    const choices = ['red', 'black', 'even', 'odd'];
    const betAmount = Math.floor(25 * (1 + strategy.riskTolerance));
    
    return { 
      type: 'color', 
      value: choices[Math.floor(Math.random() * choices.length)], 
      amount: betAmount
    };
  }

  private makePokerDecision(context: any, strategy: any, pattern: any) {
    return { action: 'call', confidence: strategy.adaptability };
  }

  private makeRandomDecision(strategy: any) {
    return {
      action: 'random',
      confidence: strategy.riskTolerance,
      reasoning: 'Decisão baseada em padrões aprendidos'
    };
  }

  generateChatResponse(message: string, playerStats: any, personality: string): string {
    const gameCount = this.gameHistory.length;
    const playerWinRate = this.calculatePlayerWinRate();
    const favoriteGame = this.getFavoriteGame();
    
    // Respostas baseadas em personalidade e dados aprendidos
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

  private calculatePlayerWinRate(): number {
    if (this.gameHistory.length === 0) return 0.5;
    
    const wins = this.gameHistory.filter(game => game.result === 'player_win').length;
    return wins / this.gameHistory.length;
  }

  getAIStats() {
    const learningLevel = Math.min(this.gameHistory.length / 1000, 1);
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

  // Método para resetar aprendizado (se necessário)
  resetLearning() {
    this.gameHistory = [];
    this.playerPatterns.clear();
    this.strategies.clear();
    this.initializeDefaults();
    localStorage.removeItem('ai_learning_data');
  }

  // Método para pausar/retomar aprendizado
  toggleLearning() {
    this.isLearning = !this.isLearning;
  }
}

export const aiService = new AILearningService();
export default AILearningService;
