
import { DarkCoinSystemData, Player } from '@/types/game';

export class DarkCoinEconomy {
  private readonly HOUSE_PRIZE_RATE = 0.05; // 5%
  private readonly CONVERSION_RATE = 10; // 10 chips = 1 darkcoin

  loadSystemData(): DarkCoinSystemData {
    try {
      const saved = localStorage.getItem('darkcoin_system');
      if (saved) {
        const data: DarkCoinSystemData = JSON.parse(saved);
        this.checkMonthlyReset(data);
        return data;
      }
    } catch (error) {
      console.error('Error loading system data:', error);
    }
    
    return this.getDefaultSystemData();
  }

  private getDefaultSystemData(): DarkCoinSystemData {
    return {
      playerDarkcoins: 1000,
      totalSupply: 50000,
      houseProfit: 50000,
      lastBurnDate: '',
      lastPrizeClaimDate: '',
      burnHistory: [],
      monthlyPrizeClaimed: false,
      players: this.generateInitialPlayers(1000)
    };
  }

  private generateInitialPlayers(playerDarkcoins: number): Player[] {
    return [
      { id: '1', name: 'Coringa Negro', darkcoins: 15000, totalWins: 120, rank: 1 },
      { id: '2', name: 'Arlequim Dourado', darkcoins: 12000, totalWins: 98, rank: 2 },
      { id: '3', name: 'Palhaço Sombrio', darkcoins: 10000, totalWins: 87, rank: 3 },
      { id: 'player', name: 'Você', darkcoins: playerDarkcoins, totalWins: 45, rank: 4 },
    ].sort((a, b) => b.darkcoins - a.darkcoins).map((player, index) => ({
      ...player,
      rank: index + 1
    }));
  }

  private checkMonthlyReset(data: DarkCoinSystemData) {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    const lastClaimMonth = data.lastPrizeClaimDate ? 
      new Date(data.lastPrizeClaimDate) : new Date(0);
    const lastClaimMonthStr = `${lastClaimMonth.getFullYear()}-${lastClaimMonth.getMonth()}`;
    
    if (currentMonth !== lastClaimMonthStr) {
      data.monthlyPrizeClaimed = false;
    }
  }

  saveSystemData(data: DarkCoinSystemData) {
    try {
      localStorage.setItem('darkcoin_system', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving system data:', error);
    }
  }

  convertChipsToDarkcoins(chips: number): number {
    return Math.floor(chips / this.CONVERSION_RATE);
  }

  calculateMonthlyPrize(houseProfit: number): number {
    return Math.floor(houseProfit * this.HOUSE_PRIZE_RATE);
  }

  updatePlayerInLeaderboard(data: DarkCoinSystemData, newDarkcoins: number): Player[] {
    return data.players.map(player => 
      player.id === 'player' ? { ...player, darkcoins: newDarkcoins } : player
    ).sort((a, b) => b.darkcoins - a.darkcoins)
     .map((player, index) => ({ ...player, rank: index + 1 }));
  }

  getDaysUntilBurn(): number {
    const now = new Date();
    const nextBurn = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const diffTime = nextBurn.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}

export const darkCoinEconomy = new DarkCoinEconomy();
