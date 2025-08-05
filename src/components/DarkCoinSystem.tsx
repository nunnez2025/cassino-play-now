import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Flame, TrendingUp, Trophy, Coins } from "lucide-react";
import { darkCoinEconomy } from "@/services/DarkCoinEconomy";
import { DarkCoinSystemData } from "@/types/game";
import DarkCoinLeaderboard from "./DarkCoinLeaderboard";
import DarkCoinStats from "./DarkCoinStats";

interface DarkCoinSystemProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const DarkCoinSystem = ({ balance, onBalanceChange }: DarkCoinSystemProps) => {
  const [systemData, setSystemData] = useState<DarkCoinSystemData>(
    darkCoinEconomy.loadSystemData()
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    darkCoinEconomy.saveSystemData(systemData);
  }, [systemData]);

  const convertToDarkCoin = (chips: number) => {
    if (isLoading || balance < chips) {
      toast({
        title: "💸 Saldo Insuficiente",
        description: "Você não tem fichas suficientes para converter!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const darkcoinsEarned = darkCoinEconomy.convertChipsToDarkcoins(chips);
    const newDarkcoins = systemData.playerDarkcoins + darkcoinsEarned;
    
    setSystemData(prev => ({
      ...prev,
      playerDarkcoins: newDarkcoins,
      totalSupply: prev.totalSupply + darkcoinsEarned,
      players: darkCoinEconomy.updatePlayerInLeaderboard(prev, newDarkcoins)
    }));
    
    onBalanceChange(balance - chips);

    toast({
      title: "🪙 Conversão Realizada!",
      description: `Você converteu ${chips} fichas em ${darkcoinsEarned} DarkCoins!`,
      className: "border-joker-gold",
    });
    
    setIsLoading(false);
  };

  const simulateBurn = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    const newSystemData = { ...systemData };
    const { burnAmount, playerBurnAmount } = darkCoinEconomy.executeBurn(newSystemData);
    
    setSystemData(newSystemData);

    toast({
      title: "🔥 Queima Mensal Executada!",
      description: `${burnAmount.toLocaleString()} DarkCoins foram queimados do supply total! Você perdeu ${playerBurnAmount} tokens.`,
      variant: "destructive",
    });
    
    setIsLoading(false);
  };

  const claimMonthlyPrize = () => {
    if (isLoading || systemData.monthlyPrizeClaimed) return;
    
    const playerRank = systemData.players.find(p => p.id === 'player')?.rank;
    const prize = darkCoinEconomy.calculateMonthlyPrize(systemData.houseProfit);
    
    if (playerRank === 1 && !systemData.monthlyPrizeClaimed) {
      setIsLoading(true);
      
      const newDarkcoins = systemData.playerDarkcoins + prize;
      setSystemData(prev => ({
        ...prev,
        playerDarkcoins: newDarkcoins,
        monthlyPrizeClaimed: true,
        lastPrizeClaimDate: new Date().toISOString(),
        players: darkCoinEconomy.updatePlayerInLeaderboard(prev, newDarkcoins)
      }));
      
      toast({
        title: "🏆 PRÊMIO MENSAL CONQUISTADO!",
        description: `Parabéns! Você ganhou ${prize.toLocaleString()} DarkCoins como líder do ranking!`,
        className: "border-joker-gold",
      });
      setIsLoading(false);
    } else if (systemData.monthlyPrizeClaimed) {
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

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-dark border-joker-purple casino-glow">
        <CardHeader className="pb-2">
          <CardTitle className="text-center readable-title text-lg font-joker">
            🪙 DARKCOIN VAULT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-joker-gold font-horror">
              {systemData.playerDarkcoins.toLocaleString()}
            </div>
            <p className="text-joker-purple font-gothic text-sm">DarkCoins</p>
            <p className="text-xs text-joker-gold/60">Supply Total: {systemData.totalSupply.toLocaleString()}</p>
          </div>

          <DarkCoinStats
            daysUntilBurn={darkCoinEconomy.getDaysUntilBurn()}
            houseProfit={systemData.houseProfit}
          />

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

      <DarkCoinLeaderboard
        players={systemData.players}
        houseProfit={systemData.houseProfit}
        monthlyPrizeClaimed={systemData.monthlyPrizeClaimed}
        onClaimPrize={claimMonthlyPrize}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DarkCoinSystem;
