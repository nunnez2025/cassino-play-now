
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
    <Card className="bg-gradient-dark border-2 border-joker-gold shadow-gold">
      <CardHeader>
        <CardTitle className="text-center text-white text-xl font-bold font-joker" style={{
          textShadow: '2px 2px 0px #000, 0 0 10px hsl(var(--joker-gold))'
        }}>📊 ESTATÍSTICAS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-black/30 p-3 rounded-lg border border-joker-gold/30">
            <p className="text-white text-sm font-bold font-gothic mb-1" style={{
              textShadow: '1px 1px 0px #000'
            }}>Saldo Inicial</p>
            <p className="text-joker-gold font-bold text-xl font-gothic" style={{
              textShadow: '2px 2px 0px #000'
            }}>
              {initialBalance.toLocaleString()}
            </p>
          </div>
          <div className="bg-black/30 p-3 rounded-lg border border-joker-gold/30">
            <p className="text-white text-sm font-bold font-gothic mb-1" style={{
              textShadow: '1px 1px 0px #000'
            }}>Saldo Atual</p>
            <p className="text-joker-gold font-bold text-xl font-gothic" style={{
              textShadow: '2px 2px 0px #000'
            }}>
              {balance.toLocaleString()}
            </p>
          </div>
          <div className="bg-black/30 p-3 rounded-lg border border-joker-gold/30">
            <p className="text-white text-sm font-bold font-gothic mb-1" style={{
              textShadow: '1px 1px 0px #000'
            }}>Lucro/Prejuízo</p>
            <p className={`font-bold text-xl font-gothic ${profit >= 0 ? "text-joker-green" : "text-red-400"}`} style={{
              textShadow: '2px 2px 0px #000'
            }}>
              {profit >= 0 ? "+" : ""}{profit.toLocaleString()}
            </p>
          </div>
          <div className="bg-black/30 p-3 rounded-lg border border-joker-gold/30">
            <p className="text-white text-sm font-bold font-gothic mb-1" style={{
              textShadow: '1px 1px 0px #000'
            }}>Variação</p>
            <p className={`font-bold text-xl font-gothic ${profit >= 0 ? "text-joker-green" : "text-red-400"}`} style={{
              textShadow: '2px 2px 0px #000'
            }}>
              {profit >= 0 ? "+" : ""}{profitPercentage}%
            </p>
          </div>
        </div>
        
        <div className="text-center pt-4 border-t-2 border-joker-gold bg-black/30 rounded-lg p-3 mt-4">
          <p className="text-white text-sm font-bold font-gothic mb-1" style={{
            textShadow: '1px 1px 0px #000'
          }}>Jogos Realizados</p>
          <p className="text-joker-gold font-bold text-2xl font-gothic" style={{
            textShadow: '2px 2px 0px #000'
          }}>{gamesPlayed}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CasinoStats;
