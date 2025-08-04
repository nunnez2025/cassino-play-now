
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Flame, TrendingUp, Trophy, Coins } from "lucide-react";

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

const DarkCoinSystem = ({ balance, onBalanceChange }: DarkCoinSystemProps) => {
  const [darkcoins, setDarkcoins] = useState(1000);
  const [burnRate, setBurnRate] = useState(10); // 10% per month
  const [nextBurn, setNextBurn] = useState<Date>(new Date());
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [houseProfit, setHouseProfit] = useState(50000);
  const { toast } = useToast();

  useEffect(() => {
    // Calculate next burn date (monthly)
    const now = new Date();
    const nextBurnDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setNextBurn(nextBurnDate);
    
    // Load leaderboard data
    loadLeaderboard();
  }, []);

  const loadLeaderboard = () => {
    // Simulated leaderboard data - in real implementation, this would come from Supabase
    const mockPlayers: Player[] = [
      { id: '1', name: 'Coringa Negro', darkcoins: 15000, totalWins: 120, rank: 1 },
      { id: '2', name: 'Arlequim Dourado', darkcoins: 12000, totalWins: 98, rank: 2 },
      { id: '3', name: 'Palhaço Sombrio', darkcoins: 10000, totalWins: 87, rank: 3 },
      { id: '4', name: 'Você', darkcoins: darkcoins, totalWins: 45, rank: 4 },
    ];
    setLeaderboard(mockPlayers.sort((a, b) => b.darkcoins - a.darkcoins));
  };

  const convertToDarkCoin = (chips: number) => {
    if (balance < chips) {
      toast({
        title: "💸 Saldo Insuficiente",
        description: "Você não tem fichas suficientes para converter!",
        variant: "destructive",
      });
      return;
    }

    const darkcoinsEarned = Math.floor(chips / 10); // 10 chips = 1 darkcoin
    setDarkcoins(prev => prev + darkcoinsEarned);
    onBalanceChange(balance - chips);

    toast({
      title: "🪙 Conversão Realizada!",
      description: `Você converteu ${chips} fichas em ${darkcoinsEarned} DarkCoins!`,
      className: "border-joker-gold",
    });
  };

  const simulateBurn = () => {
    const burnAmount = Math.floor(darkcoins * (burnRate / 100));
    setDarkcoins(prev => prev - burnAmount);
    setHouseProfit(prev => prev + burnAmount * 10); // Convert burned coins to profit

    toast({
      title: "🔥 Queima Mensal Executada!",
      description: `${burnAmount} DarkCoins foram queimados! (${burnRate}%)`,
      variant: "destructive",
    });
  };

  const claimMonthlyPrize = () => {
    const prize = Math.floor(houseProfit * 0.05); // 5% of house profit
    if (leaderboard[0]?.name === 'Você') {
      setDarkcoins(prev => prev + prize);
      toast({
        title: "🏆 PRÊMIO DO PRIMEIRO LUGAR!",
        description: `Você ganhou ${prize} DarkCoins! (5% do lucro da banca)`,
        className: "border-joker-gold",
      });
    } else {
      toast({
        title: "🥈 Não foi dessa vez!",
        description: "Apenas o primeiro lugar recebe o prêmio mensal!",
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
    <div className="space-y-6">
      {/* DarkCoin Balance */}
      <Card className="bg-gradient-dark border-joker-purple casino-glow">
        <CardHeader>
          <CardTitle className="text-center text-joker-gold text-xl font-joker neon-text">
            🪙 DARKCOIN VAULT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-joker-gold font-horror">
              {darkcoins.toLocaleString()}
            </div>
            <p className="text-joker-purple font-gothic">DarkCoins</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-joker-gold">
            <div className="text-center">
              <Flame className="w-4 h-4 mx-auto mb-1 text-red-500" />
              <p>Próxima Queima</p>
              <p className="font-bold">{getDaysUntilBurn()} dias</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-4 h-4 mx-auto mb-1 text-joker-green" />
              <p>Taxa de Queima</p>
              <p className="font-bold">{burnRate}% mensal</p>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="joker"
              onClick={() => convertToDarkCoin(100)}
              disabled={balance < 100}
              className="w-full text-sm"
            >
              Converter 100 Fichas → 10 DarkCoins
            </Button>
            <Button
              variant="bet"
              onClick={simulateBurn}
              className="w-full text-sm"
            >
              🔥 Simular Queima Mensal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="bg-gradient-dark border-joker-purple casino-glow">
        <CardHeader>
          <CardTitle className="text-center text-joker-gold text-lg font-joker neon-text">
            🏆 RANKING DARKCOIN
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  player.name === 'Você' 
                    ? 'bg-gradient-joker text-joker-black' 
                    : 'bg-gradient-dark border border-joker-purple'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-amber-600 text-black' :
                    'bg-joker-dark text-joker-gold'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${player.name === 'Você' ? 'text-joker-black' : 'text-joker-gold'}`}>
                      {player.name}
                    </p>
                    <p className={`text-xs ${player.name === 'Você' ? 'text-joker-black/80' : 'text-joker-purple'}`}>
                      {player.totalWins} vitórias
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${player.name === 'Você' ? 'text-joker-black' : 'text-joker-gold'}`}>
                    {player.darkcoins.toLocaleString()}
                  </p>
                  <p className={`text-xs ${player.name === 'Você' ? 'text-joker-black/80' : 'text-joker-purple'}`}>
                    DarkCoins
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gradient-dark border border-joker-gold rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-joker-gold font-bold text-sm">Prêmio Mensal</p>
                <p className="text-joker-purple text-xs">5% do lucro da banca</p>
              </div>
              <div className="text-right">
                <p className="text-joker-gold font-bold">
                  {Math.floor(houseProfit * 0.05).toLocaleString()} DC
                </p>
                <Button
                  variant="win"
                  size="sm"
                  onClick={claimMonthlyPrize}
                  className="mt-1"
                >
                  <Trophy className="w-3 h-3 mr-1" />
                  Reivindicar
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
