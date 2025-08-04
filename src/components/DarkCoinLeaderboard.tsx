
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { Player } from "@/types/game";
import { darkCoinEconomy } from "@/services/DarkCoinEconomy";

interface DarkCoinLeaderboardProps {
  players: Player[];
  houseProfit: number;
  monthlyPrizeClaimed: boolean;
  onClaimPrize: () => void;
  isLoading: boolean;
}

const DarkCoinLeaderboard = ({ 
  players, 
  houseProfit, 
  monthlyPrizeClaimed, 
  onClaimPrize, 
  isLoading 
}: DarkCoinLeaderboardProps) => {
  return (
    <Card className="bg-gradient-dark border-joker-purple casino-glow">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-joker-gold text-sm font-joker neon-text">
          🏆 RANKING DARKCOIN
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {players.slice(0, 4).map((player, index) => (
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
                {darkCoinEconomy.calculateMonthlyPrize(houseProfit).toLocaleString()} DC
              </p>
              <Button
                variant="win"
                size="sm"
                onClick={onClaimPrize}
                disabled={isLoading || monthlyPrizeClaimed || players.find(p => p.id === 'player')?.rank !== 1}
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
  );
};

export default DarkCoinLeaderboard;
