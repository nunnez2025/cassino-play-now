
export interface DailyEconomicData {
  date: string;
  totalBet: number;
  totalWon: number;
  netLoss: number;
  dailyFee: number; // 10% de tudo que jogou
  gamesPlayed: number;
}

export interface MonthlyReport {
  totalLoss: number;
  totalReturn: number; // 50% de tudo que perdeu
  returnRate: number;
  currentCycle: number; // dias restantes do ciclo
  dailyData: DailyEconomicData[];
}

export interface PlayerEconomicProfile {
  playerId: string;
  currentBalance: number;
  currentMonth: string;
  monthlyData: MonthlyReport;
  historicalMonths: MonthlyReport[];
  totalLifetimeLoss: number;
  totalLifetimeReturn: number;
}

class GameEconomyService {
  private readonly DAILY_FEE_RATE = 0.10; // 10%
  private readonly MONTHLY_RETURN_RATE = 0.50; // 50%
  private readonly CYCLE_DAYS = 30;

  loadPlayerProfile(): PlayerEconomicProfile {
    try {
      const stored = localStorage.getItem('game_economy_profile');
      if (stored) {
        const profile: PlayerEconomicProfile = JSON.parse(stored);
        this.checkMonthlyReset(profile);
        return profile;
      }
    } catch (error) {
      console.error('Error loading economic profile:', error);
    }
    
    return this.createNewProfile();
  }

  private createNewProfile(): PlayerEconomicProfile {
    const currentMonth = this.getCurrentMonthKey();
    
    return {
      playerId: 'player',
      currentBalance: 1000,
      currentMonth,
      monthlyData: this.createNewMonthlyReport(),
      historicalMonths: [],
      totalLifetimeLoss: 0,
      totalLifetimeReturn: 0
    };
  }

  private createNewMonthlyReport(): MonthlyReport {
    return {
      totalLoss: 0,
      totalReturn: 0,
      returnRate: this.MONTHLY_RETURN_RATE,
      currentCycle: this.CYCLE_DAYS,
      dailyData: []
    };
  }

  private getCurrentMonthKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  private getCurrentDateKey(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  private checkMonthlyReset(profile: PlayerEconomicProfile): void {
    const currentMonth = this.getCurrentMonthKey();
    
    if (profile.currentMonth !== currentMonth) {
      // Fim do ciclo - calcular retorno
      const monthlyReturn = profile.monthlyData.totalLoss * this.MONTHLY_RETURN_RATE;
      profile.monthlyData.totalReturn = monthlyReturn;
      
      // Adicionar ao histórico
      profile.historicalMonths.push({ ...profile.monthlyData });
      
      // Adicionar retorno ao saldo
      profile.currentBalance += monthlyReturn;
      profile.totalLifetimeReturn += monthlyReturn;
      
      // Resetar para novo mês
      profile.currentMonth = currentMonth;
      profile.monthlyData = this.createNewMonthlyReport();
    }
  }

  savePlayerProfile(profile: PlayerEconomicProfile): void {
    try {
      localStorage.setItem('game_economy_profile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving economic profile:', error);
    }
  }

  processGameSession(
    profile: PlayerEconomicProfile, 
    betAmount: number, 
    winAmount: number
  ): { newBalance: number; dailyFee: number; economicImpact: string } {
    
    const today = this.getCurrentDateKey();
    const netResult = winAmount - betAmount;
    const dailyFee = betAmount * this.DAILY_FEE_RATE;
    
    // Atualizar saldo
    profile.currentBalance = profile.currentBalance + netResult - dailyFee;
    
    // Encontrar ou criar dados do dia
    let todayData = profile.monthlyData.dailyData.find(d => d.date === today);
    if (!todayData) {
      todayData = {
        date: today,
        totalBet: 0,
        totalWon: 0,
        netLoss: 0,
        dailyFee: 0,
        gamesPlayed: 0
      };
      profile.monthlyData.dailyData.push(todayData);
    }
    
    // Atualizar dados do dia
    todayData.totalBet += betAmount;
    todayData.totalWon += winAmount;
    todayData.dailyFee += dailyFee;
    todayData.gamesPlayed += 1;
    todayData.netLoss = todayData.totalBet - todayData.totalWon + todayData.dailyFee;
    
    // Atualizar totais mensais
    profile.monthlyData.totalLoss += Math.max(0, betAmount - winAmount) + dailyFee;
    profile.totalLifetimeLoss += Math.max(0, betAmount - winAmount) + dailyFee;
    
    // Calcular dias restantes do ciclo
    const monthStart = new Date(profile.currentMonth + '-01');
    const now = new Date();
    const daysPassed = Math.floor((now.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
    profile.monthlyData.currentCycle = Math.max(0, this.CYCLE_DAYS - daysPassed);
    
    this.savePlayerProfile(profile);
    
    // Determinar impacto econômico
    let economicImpact = '';
    if (netResult > 0) {
      economicImpact = `Ganhou ${netResult} fichas! Taxa diária: -${dailyFee}`;
    } else {
      economicImpact = `Perdeu ${Math.abs(netResult)} fichas + taxa: -${dailyFee}`;
    }
    
    return {
      newBalance: profile.currentBalance,
      dailyFee,
      economicImpact
    };
  }

  generateEconomicInsight(profile: PlayerEconomicProfile): string {
    const insights = [
      `💰 Você perdeu ${profile.monthlyData.totalLoss.toFixed(0)} fichas este mês`,
      `🔄 Retorno estimado: ${(profile.monthlyData.totalLoss * this.MONTHLY_RETURN_RATE).toFixed(0)} fichas`,
      `📅 ${profile.monthlyData.currentCycle} dias restantes do ciclo`,
      `🎯 Taxa de retorno: ${(this.MONTHLY_RETURN_RATE * 100)}% das perdas`,
      `📊 Total de jogos hoje: ${this.getTodayGamesCount(profile)}`
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  }

  private getTodayGamesCount(profile: PlayerEconomicProfile): number {
    const today = this.getCurrentDateKey();
    const todayData = profile.monthlyData.dailyData.find(d => d.date === today);
    return todayData ? todayData.gamesPlayed : 0;
  }

  getTopLosers(): Array<{ name: string; loss: number; rank: number }> {
    // Simular ranking de maiores perdedores
    const names = [
      'Coringa Sombrio', 'Arlequina Dourada', 'Palhaço Negro', 'Joker Supremo',
      'Dama das Cartas', 'Rei da Noite', 'Rainha Vermelha', 'As de Espadas'
    ];
    
    return names.map((name, index) => ({
      name,
      loss: Math.floor(Math.random() * 50000) + 10000,
      rank: index + 1
    })).sort((a, b) => b.loss - a.loss);
  }

  getTopRecoveries(): Array<{ name: string; recovery: number; rank: number }> {
    // Simular ranking de maiores recuperações
    const names = [
      'Phoenix Gamer', 'Lucky Comeback', 'Ressurreição', 'Miracle Player',
      'Second Chance', 'Golden Return', 'Epic Comeback', 'Fortune Hunter'
    ];
    
    return names.map((name, index) => ({
      name,
      recovery: Math.floor(Math.random() * 25000) + 5000,
      rank: index + 1
    })).sort((a, b) => b.recovery - a.recovery);
  }
}

export const gameEconomyService = new GameEconomyService();
