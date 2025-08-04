
import { Button } from "@/components/ui/button";
import CasinoStats from "./CasinoStats";
import DarkCoinSystem from "./DarkCoinSystem";
import { aiService } from "@/services/AIService";

interface CasinoSidebarProps {
  balance: number;
  initialBalance: number;
  gamesPlayed: number;
  onBalanceChange: (newBalance: number) => void;
  onAddBonus: () => void;
}

const CasinoSidebar = ({ 
  balance, 
  initialBalance, 
  gamesPlayed, 
  onBalanceChange, 
  onAddBonus 
}: CasinoSidebarProps) => {
  return (
    <div className="space-y-6">
      <CasinoStats 
        balance={balance}
        initialBalance={initialBalance}
        gamesPlayed={gamesPlayed}
      />

      <DarkCoinSystem
        balance={balance}
        onBalanceChange={onBalanceChange}
      />
      
      <div className="text-center">
        <Button 
          variant="joker" 
          onClick={onAddBonus}
          className="w-full font-gothic mb-2"
        >
          🎁 BONUS JOKER 500 FICHAS
        </Button>
      </div>

      {/* AI Stats Display */}
      <div className="bg-gradient-dark border border-joker-purple rounded-lg p-4 neon-glow">
        <h3 className="text-joker-gold font-bold mb-2 text-center font-joker">🤖 STATUS DA IA</h3>
        <div className="text-sm text-joker-gold font-gothic space-y-1">
          {(() => {
            const stats = aiService.getAIStats();
            return (
              <>
                <p><strong>🧠 Jogos Analisados:</strong> {stats.gamesAnalyzed}</p>
                <p><strong>📊 Padrões Aprendidos:</strong> {stats.patternsLearned}</p>
                <p><strong>⚡ Nível de Aprendizado:</strong> {(stats.learningLevel * 100).toFixed(1)}%</p>
                <p><strong>🎯 Taxa de Vitória do Jogador:</strong> {(stats.playerWinRate * 100).toFixed(1)}%</p>
              </>
            );
          })()}
        </div>
      </div>

      {/* Enhanced Rules */}
      <div className="bg-gradient-dark border border-joker-purple rounded-lg p-4 neon-glow">
        <h3 className="text-joker-gold font-bold mb-2 text-center font-joker">🎭 ECONOMIA DARKCOIN</h3>
        <div className="text-sm text-joker-gold font-gothic space-y-2">
          <p><strong>🪙 DarkCoin:</strong> Moeda premium do cassino</p>
          <p><strong>🔥 Queima Mensal:</strong> 10% dos tokens são queimados</p>
          <p><strong>🏆 Prêmio Mensal:</strong> 5% do lucro da banca para o 1º lugar</p>
          <p><strong>🤖 IA Adversária:</strong> Aprende com seus padrões de jogo</p>
          <p><strong>📊 Conversão:</strong> 10 fichas = 1 DarkCoin</p>
          <p className="text-joker-purple mt-3 font-horror">💰 Domine a economia do caos!</p>
        </div>
      </div>

      <div className="bg-gradient-dark border border-joker-purple rounded-lg p-4 neon-glow">
        <h3 className="text-joker-gold font-bold mb-2 text-center font-joker">🎭 REGRAS DO JOKER</h3>
        <div className="text-sm text-joker-gold font-gothic space-y-2">
          <p><strong>🃏 Joker Slots:</strong> Combine símbolos para ganhar!</p>
          <p><strong>🎭 Blackjack:</strong> Chegue próximo de 21, Joker vale 15!</p>
          <p><strong>🎪 Roleta:</strong> Aposte em cores, números ou paridades.</p>
          <p><strong>🎲 High-Low:</strong> Adivinhe se a carta será maior ou menor!</p>
          <p><strong>⚔️ Arena:</strong> Escolha um lutador e domine a arena!</p>
          <p className="text-joker-purple mt-3 font-horror">🃏 Que a loucura traga sorte!</p>
        </div>
      </div>
    </div>
  );
};

export default CasinoSidebar;
