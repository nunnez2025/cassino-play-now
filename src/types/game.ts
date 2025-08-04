
export interface GameState {
  gameType: string;
  playerAction: string;
  result: 'player_win' | 'ai_win' | 'tie';
  playerBalance: number;
  darkcoins: number;
  timestamp: Date;
}

export interface Player {
  id: string;
  name: string;
  darkcoins: number;
  totalWins: number;
  rank: number;
}

export interface AIStats {
  gamesAnalyzed: number;
  patternsLearned: number;
  strategiesAdapted: number;
  playerWinRate: number;
  learningLevel: number;
  isActive: boolean;
  favoriteGame: string;
  totalDarkcoinsEarned: number;
}

export interface DarkCoinSystemData {
  playerDarkcoins: number;
  totalSupply: number;
  houseProfit: number;
  lastBurnDate: string;
  lastPrizeClaimDate: string;
  burnHistory: Array<{date: string, amount: number}>;
  monthlyPrizeClaimed: boolean;
  players: Player[];
}

export interface AIStrategy {
  aggressiveness: number;
  riskTolerance: number;
  adaptability: number;
}

export interface AIDecision {
  action: string;
  confidence: number;
  reasoning: string;
}
