
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
          className="w-full font-gothic mb-2 text-lg font-bold"
          style={{
            textShadow: '1px 1px 0px #000'
          }}
        >
          🎁 BONUS JOKER 500 FICHAS
        </Button>
      </div>

      {/* AI Stats Display */}
      <div className="bg-gradient-dark border-2 border-joker-purple rounded-lg p-4 neon-glow">
        <h3 className="text-white font-bold text-lg mb-3 text-center font-joker" style={{
          textShadow: '2px 2px 0px #000, 0 0 10px hsl(var(--joker-purple))'
        }}>🤖 STATUS DA IA</h3>
        <div className="text-base text-white font-gothic space-y-2" style={{
          textShadow: '1px 1px 0px #000'
        }}>
          {(() => {
            const stats = aiService.getAIStats();
            return (
              <>
                <p><strong className="text-joker-gold">🧠 Jogos Analisados:</strong> {stats.gamesAnalyzed}</p>
                <p><strong className="text-joker-gold">📊 Padrões Aprendidos:</strong> {stats.patternsLearned}</p>
                <p><strong className="text-joker-gold">⚡ Nível de Aprendizado:</strong> {(stats.learningLevel * 100).toFixed(1)}%</p>
                <p><strong className="text-joker-gold">🎯 Taxa de Vitória do Jogador:</strong> {(stats.playerWinRate * 100).toFixed(1)}%</p>
              </>
            );
          })()}
        </div>
      </div>

      {/* Enhanced Rules */}
      <div className="bg-gradient-dark border-2 border-joker-purple rounded-lg p-4 neon-glow">
        <h3 className="text-white font-bold text-lg mb-3 text-center font-joker" style={{
          textShadow: '2px 2px 0px #000, 0 0 10px hsl(var(--joker-purple))'
        }}>🎭 ECONOMIA DARKCOIN</h3>
        <div className="text-sm text-white font-gothic space-y-2 leading-relaxed" style={{
          textShadow: '1px 1px 0px #000'
        }}>
          <p><strong className="text-joker-gold">🪙 DarkCoin:</strong> Moeda premium do cassino</p>
          <p><strong className="text-joker-gold">🔥 Queima Mensal:</strong> 10% dos tokens são queimados</p>
          <p><strong className="text-joker-gold">🏆 Prêmio Mensal:</strong> 5% do lucro da banca para o 1º lugar</p>
          <p><strong className="text-joker-gold">🤖 IA Adversária:</strong> Aprende com seus padrões de jogo</p>
          <p><strong className="text-joker-gold">📊 Conversão:</strong> 10 fichas = 1 DarkCoin</p>
          <p className="text-joker-purple font-bold mt-3 font-horror text-base" style={{
            textShadow: '2px 2px 0px #000, 0 0 10px hsl(var(--joker-purple))'
          }}>💰 Domine a economia do caos!</p>
        </div>
      </div>

      <div className="bg-gradient-dark border-2 border-joker-purple rounded-lg p-4 neon-glow">
        <h3 className="text-white font-bold text-lg mb-3 text-center font-joker" style={{
          textShadow: '2px 2px 0px #000, 0 0 10px hsl(var(--joker-purple))'
        }}>🎭 REGRAS DO JOKER</h3>
        <div className="text-sm text-white font-gothic space-y-2 leading-relaxed" style={{
          textShadow: '1px 1px 0px #000'
        }}>
          <p><strong className="text-joker-gold">🃏 Joker Slots:</strong> Combine símbolos para ganhar!</p>
          <p><strong className="text-joker-gold">🎭 Blackjack:</strong> Chegue próximo de 21, Joker vale 15!</p>
          <p><strong className="text-joker-gold">🎪 Roleta:</strong> Aposte em cores, números ou paridades.</p>
          <p><strong className="text-joker-gold">🎲 High-Low:</strong> Adivinhe se a carta será maior ou menor!</p>
          <p><strong className="text-joker-gold">⚔️ Arena:</strong> Escolha um lutador e domine a arena!</p>
          <p className="text-joker-purple font-bold mt-3 font-horror text-base" style={{
            textShadow: '2px 2px 0px #000, 0 0 10px hsl(var(--joker-purple))'
          }}>🃏 Que a loucura traga sorte!</p>
        </div>
      </div>
    </div>
  );
};

export default CasinoSidebar;
