import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CasinoStatsProps {
  balance: number;
  initialBalance: number;
  gamesPlayed: number;
}

const CasinoStats = ({ balance, initialBalance, gamesPlayed }: CasinoStatsProps) => {
  const profit = balance - initialBalance;
  const profitPercentage = ((profit / initialBalance) * 100).toFixed(1);

  return (
    <Card className="bg-casino-dark border-casino-gold">
      <CardHeader>
        <CardTitle className="text-center text-casino-gold">📊 ESTATÍSTICAS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-muted-foreground">Saldo Inicial</p>
            <p className="text-casino-gold font-bold text-xl">
              {initialBalance.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Saldo Atual</p>
            <p className="text-casino-gold font-bold text-xl">
              {balance.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Lucro/Prejuízo</p>
            <p className={`font-bold text-xl ${profit >= 0 ? "text-casino-green" : "text-casino-red"}`}>
              {profit >= 0 ? "+" : ""}{profit.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Variação</p>
            <p className={`font-bold text-xl ${profit >= 0 ? "text-casino-green" : "text-casino-red"}`}>
              {profit >= 0 ? "+" : ""}{profitPercentage}%
            </p>
          </div>
        </div>
        
        <div className="text-center pt-4 border-t border-casino-gold">
          <p className="text-muted-foreground">Jogos Realizados</p>
          <p className="text-casino-gold font-bold text-2xl">{gamesPlayed}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CasinoStats;