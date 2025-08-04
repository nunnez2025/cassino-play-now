
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Flame, TrendingUp, Trophy, Coins, Calendar } from "lucide-react";

interface DarkCoinSystemProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

interface Player {
  id: string;
  name: string;
  darkcoins: number;
  totalWins: number;
  rank: number;
}

interface SystemData {
  playerDarkcoins: number;
  totalSupply: number;
  houseProfit: number;
  lastBurnDate: string;
  lastPrizeClaimDate: string;
  burnHistory: Array<{date: string, amount: number}>;
  monthlyPrizeClaimed: boolean;
  players: Player[];
}

const DarkCoinSystem = ({ balance, onBalanceChange }: DarkCoinSystemProps) => {
  const [darkcoins, setDarkcoins] = useState(1000);
  const [totalSupply, setTotalSupply] = useState(50000); // Total de tokens no sistema
  const [burnRate] = useState(10); // 10% do total supply
  const [nextBurn, setNextBurn] = useState<Date>(new Date());
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [houseProfit, setHouseProfit] = useState(50000);
  const [lastBurnDate, setLastBurnDate] = useState<string>('');
  const [monthlyPrizeClaimed, setMonthlyPrizeClaimed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSystemData();
    calculateNextBurn();
  }, []);

  const loadSystemData = () => {
    try {
      const saved = localStorage.getItem('darkcoin_system');
      if (saved) {
        const data: SystemData = JSON.parse(saved);
        setDarkcoins(data.playerDarkcoins || 1000);
        setTotalSupply(data.totalSupply || 50000);
        setHouseProfit(data.houseProfit || 50000);
        setLastBurnDate(data.lastBurnDate || '');
        setMonthlyPrizeClaimed(data.monthlyPrizeClaimed || false);
        setLeaderboard(data.players || generateInitialPlayers());
        
        // Verificar se é um novo mês para resetar o prêmio
        checkMonthlyReset();
      } else {
        setLeaderboard(generateInitialPlayers());
      }
    } catch (error) {
      console.error('Erro ao carregar dados do sistema:', error);
      setLeaderboard(generateInitialPlayers());
    }
  };

  const saveSystemData = () => {
    try {
      const data: SystemData = {
        playerDarkcoins: darkcoins,
        totalSupply,
        houseProfit,
        lastBurnDate,
        lastPrizeClaimDate: new Date().toISOString(),
        monthlyPrizeClaimed,
        burnHistory: [],
        players: leaderboard
      };
      localStorage.setItem('darkcoin_system', JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados do sistema:', error);
    }
  };

  useEffect(() => {
    saveSystemData();
  }, [darkcoins, totalSupply, houseProfit, lastBurnDate, monthlyPrizeClaimed, leaderboard]);

  const generateInitialPlayers = (): Player[] => {
    return [
      { id: '1', name: 'Coringa Negro', darkcoins: 15000, totalWins: 120, rank: 1 },
      { id: '2', name: 'Arlequim Dourado', darkcoins: 12000, totalWins: 98, rank: 2 },
      { id: '3', name: 'Palhaço Sombrio', darkcoins: 10000, totalWins: 87, rank: 3 },
      { id: 'player', name: 'Você', darkcoins: darkcoins, totalWins: 45, rank: 4 },
    ].sort((a, b) => b.darkcoins - a.darkcoins).map((player, index) => ({
      ...player,
      rank: index + 1
    }));
  };

  const calculateNextBurn = () => {
    const now = new Date();
    const nextBurnDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setNextBurn(nextBurnDate);
  };

  const checkMonthlyReset = () => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    const lastClaimMonth = lastBurnDate ? new Date(lastBurnDate) : new Date(0);
    const lastClaimMonthStr = `${lastClaimMonth.getFullYear()}-${lastClaimMonth.getMonth()}`;
    
    if (currentMonth !== lastClaimMonthStr) {
      setMonthlyPrizeClaimed(false);
    }
  };

  const convertToDarkCoin = (chips: number) => {
    if (isLoading) return;
    
    if (balance < chips) {
      toast({
        title: "💸 Saldo Insuficiente",
        description: "Você não tem fichas suficientes para converter!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const darkcoinsEarned = Math.floor(chips / 10); // 10 chips = 1 darkcoin
    const newDarkcoins = darkcoins + darkcoinsEarned;
    
    setDarkcoins(newDarkcoins);
    setTotalSupply(prev => prev + darkcoinsEarned);
    onBalanceChange(balance - chips);

    // Atualizar ranking
    updatePlayerInLeaderboard(newDarkcoins);

    toast({
      title: "🪙 Conversão Realizada!",
      description: `Você converteu ${chips} fichas em ${darkcoinsEarned} DarkCoins!`,
      className: "border-joker-gold",
    });
    
    setIsLoading(false);
  };

  const updatePlayerInLeaderboard = (newDarkcoins: number) => {
    const updatedLeaderboard = leaderboard.map(player => 
      player.id === 'player' ? { ...player, darkcoins: newDarkcoins } : player
    ).sort((a, b) => b.darkcoins - a.darkcoins)
     .map((player, index) => ({ ...player, rank: index + 1 }));
    
    setLeaderboard(updatedLeaderboard);
  };

  const simulateBurn = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Queima 10% do TOTAL SUPPLY, não do jogador individual
    const burnAmount = Math.floor(totalSupply * (burnRate / 100));
    const playerBurnAmount = Math.floor((darkcoins / totalSupply) * burnAmount);
    
    setDarkcoins(prev => Math.max(0, prev - playerBurnAmount));
    setTotalSupply(prev => prev - burnAmount);
    setHouseProfit(prev => prev + burnAmount * 5); // Casa ganha 5x o valor queimado
    setLastBurnDate(new Date().toISOString());

    // Atualizar todos os jogadores do leaderboard proporcionalmente
    const updatedLeaderboard = leaderboard.map(player => {
      if (player.id === 'player') {
        return { ...player, darkcoins: Math.max(0, darkcoins - playerBurnAmount) };
      } else {
        const playerBurn = Math.floor((player.darkcoins / totalSupply) * burnAmount);
        return { ...player, darkcoins: Math.max(0, player.darkcoins - playerBurn) };
      }
    }).sort((a, b) => b.darkcoins - a.darkcoins)
     .map((player, index) => ({ ...player, rank: index + 1 }));
    
    setLeaderboard(updatedLeaderboard);

    toast({
      title: "🔥 Queima Mensal Executada!",
      description: `${burnAmount.toLocaleString()} DarkCoins foram queimados do supply total! Você perdeu ${playerBurnAmount} tokens.`,
      variant: "destructive",
    });
    
    setIsLoading(false);
  };

  const claimMonthlyPrize = () => {
    if (isLoading || monthlyPrizeClaimed) return;
    
    const playerRank = leaderboard.find(p => p.id === 'player')?.rank;
    const prize = Math.floor(houseProfit * 0.05); // 5% do lucro da casa
    
    if (playerRank === 1 && !monthlyPrizeClaimed) {
      setIsLoading(true);
      setDarkcoins(prev => prev + prize);
      setMonthlyPrizeClaimed(true);
      updatePlayerInLeaderboard(darkcoins + prize);
      
      toast({
        title: "🏆 PRÊMIO MENSAL CONQUISTADO!",
        description: `Parabéns! Você ganhou ${prize.toLocaleString()} DarkCoins como líder do ranking!`,
        className: "border-joker-gold",
      });
      setIsLoading(false);
    } else if (monthlyPrizeClaimed) {
      toast({
        title: "🏆 Prêmio Já Reivindicado",
        description: "O prêmio mensal já foi reivindicado este mês!",
        variant: "destructive",
      });
    } else {
      toast({
        title: "🥈 Não Elegível",
        description: "Apenas o primeiro lugar pode reivindicar o prêmio mensal!",
        variant: "destructive",
      });
    }
  };

  const getDaysUntilBurn = () => {
    const now = new Date();
    const diffTime = nextBurn.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <div className="space-y-4">
      {/* DarkCoin Balance */}
      <Card className="bg-gradient-dark border-joker-purple casino-glow">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-joker-gold text-lg font-joker neon-text">
            🪙 DARKCOIN VAULT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-joker-gold font-horror">
              {darkcoins.toLocaleString()}
            </div>
            <p className="text-joker-purple font-gothic text-sm">DarkCoins</p>
            <p className="text-xs text-joker-gold/60">Supply Total: {totalSupply.toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-joker-gold">
            <div className="text-center">
              <Flame className="w-3 h-3 mx-auto mb-1 text-red-500" />
              <p>Próxima Queima</p>
              <p className="font-bold">{getDaysUntilBurn()}d</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-3 h-3 mx-auto mb-1 text-joker-green" />
              <p>Taxa de Queima</p>
              <p className="font-bold">{burnRate}% total</p>
            </div>
            <div className="text-center">
              <Coins className="w-3 h-3 mx-auto mb-1 text-joker-gold" />
              <p>Lucro Casa</p>
              <p className="font-bold">{(houseProfit / 1000).toFixed(0)}K</p>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="joker"
              onClick={() => convertToDarkCoin(100)}
              disabled={balance < 100 || isLoading}
              className="w-full text-xs"
            >
              {isLoading ? 'Processando...' : 'Converter 100 Fichas → 10 DC'}
            </Button>
            <Button
              variant="bet"
              onClick={simulateBurn}
              disabled={isLoading}
              className="w-full text-xs"
            >
              🔥 {isLoading ? 'Queimando...' : 'Simular Queima Mensal'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="bg-gradient-dark border-joker-purple casino-glow">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-joker-gold text-sm font-joker neon-text">
            🏆 RANKING DARKCOIN
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.slice(0, 4).map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-2 rounded text-xs ${
                  player.id === 'player' 
                    ? 'bg-gradient-joker text-joker-black' 
                    : 'bg-gradient-dark border border-joker-purple'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-amber-600 text-black' :
                    'bg-joker-dark text-joker-gold'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className={`font-bold text-xs ${player.id === 'player' ? 'text-joker-black' : 'text-joker-gold'}`}>
                      {player.name}
                    </p>
                    <p className={`text-xs ${player.id === 'player' ? 'text-joker-black/80' : 'text-joker-purple'}`}>
                      {player.totalWins} vitórias
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-xs ${player.id === 'player' ? 'text-joker-black' : 'text-joker-gold'}`}>
                    {player.darkcoins.toLocaleString()}
                  </p>
                  <p className={`text-xs ${player.id === 'player' ? 'text-joker-black/80' : 'text-joker-purple'}`}>
                    DC
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 p-2 bg-gradient-dark border border-joker-gold rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-joker-gold font-bold text-xs">Prêmio Mensal</p>
                <p className="text-joker-purple text-xs">5% do lucro da casa</p>
                {monthlyPrizeClaimed && (
                  <p className="text-red-400 text-xs">✓ Já reivindicado</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-joker-gold font-bold text-xs">
                  {Math.floor(houseProfit * 0.05).toLocaleString()} DC
                </p>
                <Button
                  variant="win"
                  size="sm"
                  onClick={claimMonthlyPrize}
                  disabled={isLoading || monthlyPrizeClaimed || leaderboard.find(p => p.id === 'player')?.rank !== 1}
                  className="mt-1 text-xs h-6"
                >
                  <Trophy className="w-2 h-2 mr-1" />
                  {monthlyPrizeClaimed ? 'Reivindicado' : 'Reivindicar'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DarkCoinSystem;
