
import { Flame, TrendingUp, Coins } from "lucide-react";

interface DarkCoinStatsProps {
  daysUntilBurn: number;
  houseProfit: number;
}

const DarkCoinStats = ({ daysUntilBurn, houseProfit }: DarkCoinStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 text-xs text-joker-gold">
      <div className="text-center">
        <Flame className="w-3 h-3 mx-auto mb-1 text-red-500" />
        <p>Próxima Queima</p>
        <p className="font-bold">{daysUntilBurn}d</p>
      </div>
      <div className="text-center">
        <TrendingUp className="w-3 h-3 mx-auto mb-1 text-joker-green" />
        <p>Taxa de Queima</p>
        <p className="font-bold">10% total</p>
      </div>
      <div className="text-center">
        <Coins className="w-3 h-3 mx-auto mb-1 text-joker-gold" />
        <p>Lucro Casa</p>
        <p className="font-bold">{(houseProfit / 1000).toFixed(0)}K</p>
      </div>
    </div>
  );
};

export default DarkCoinStats;
