
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface ArenaProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

interface Fighter {
  id: number;
  name: string;
  emoji: string;
  power: number;
  health: number;
  maxHealth: number;
  specialty: string;
}

interface Battle {
  fighter1: Fighter;
  fighter2: Fighter;
  isActive: boolean;
  winner?: Fighter;
  round: number;
}

const Arena = ({ balance, onBalanceChange }: ArenaProps) => {
  const [bet, setBet] = useState(10);
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);
  const [battle, setBattle] = useState<Battle | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [fighters] = useState<Fighter[]>([
    {
      id: 1,
      name: "Coringa Sombrio",
      emoji: "🃏",
      power: 85,
      health: 100,
      maxHealth: 100,
      specialty: "Ilusões Mortais"
    },
    {
      id: 2,
      name: "Palhaço Macabro",
      emoji: "🎭",
      power: 78,
      health: 120,
      maxHealth: 120,
      specialty: "Risada Venenosa"
    },
    {
      id: 3,
      name: "Arlequim Louco",
      emoji: "🎪",
      power: 92,
      health: 90,
      maxHealth: 90,
      specialty: "Caos Absoluto"
    },
    {
      id: 4,
      name: "Bufão Real",
      emoji: "👑",
      power: 70,
      health: 140,
      maxHealth: 140,
      specialty: "Defesa Imperial"
    },
    {
      id: 5,
      name: "Mime Assassino",
      emoji: "🎨",
      power: 88,
      health: 95,
      maxHealth: 95,
      specialty: "Silêncio Mortal"
    },
    {
      id: 6,
      name: "Diabrete Risonho",
      emoji: "😈",
      power: 95,
      health: 85,
      maxHealth: 85,
      specialty: "Fogo Infernal"
    }
  ]);

  const getRandomFighter = useCallback(() => {
    const availableFighters = fighters.filter(f => f.id !== selectedFighter?.id);
    return availableFighters[Math.floor(Math.random() * availableFighters.length)];
  }, [fighters, selectedFighter]);

  const resetFighter = (fighter: Fighter): Fighter => {
    return { ...fighter, health: fighter.maxHealth };
  };

  const startBattle = () => {
    if (!selectedFighter) {
      toast({
        title: "🎭 Selecione um Lutador!",
        description: "Escolha seu campeão da arena antes de apostar!",
        variant: "destructive",
      });
      return;
    }

    if (balance < bet) {
      toast({
        title: "💸 Saldo Insuficiente",
        description: "Você não tem fichas suficientes para esta aposta!",
        variant: "destructive",
      });
      return;
    }

    const opponent = getRandomFighter();
    const newBattle: Battle = {
      fighter1: resetFighter(selectedFighter),
      fighter2: resetFighter(opponent),
      isActive: true,
      round: 1
    };

    setBattle(newBattle);
    setBattleLog([]);
    setIsSimulating(true);
    onBalanceChange(balance - bet);

    // Iniciar simulação da batalha
    simulateBattle(newBattle);
  };

  const simulateBattle = (currentBattle: Battle) => {
    let updatedBattle = { ...currentBattle };
    let log: string[] = [];

    const battleInterval = setInterval(() => {
      if (updatedBattle.fighter1.health <= 0 || updatedBattle.fighter2.health <= 0) {
        // Batalha terminou
        clearInterval(battleInterval);
        
        const winner = updatedBattle.fighter1.health > 0 ? updatedBattle.fighter1 : updatedBattle.fighter2;
        updatedBattle.winner = winner;
        updatedBattle.isActive = false;

        log.push(`🏆 ${winner.name} venceu a batalha!`);

        // Verificar se o jogador ganhou
        const playerWon = winner.id === selectedFighter?.id;
        if (playerWon) {
          const winAmount = bet * 2;
          onBalanceChange(balance + winAmount);
          toast({
            title: "🎉 Vitória na Arena!",
            description: `${winner.name} venceu! Você ganhou ${winAmount} fichas!`,
            className: "border-joker-green",
          });
        } else {
          toast({
            title: "💀 Derrota na Arena",
            description: `${winner.name} derrotou seu lutador. Tente novamente!`,
            variant: "destructive",
          });
        }

        setBattle(updatedBattle);
        setBattleLog(log);
        setIsSimulating(false);
        return;
      }

      // Calcular dano
      const attacker = updatedBattle.round % 2 === 1 ? updatedBattle.fighter1 : updatedBattle.fighter2;
      const defender = updatedBattle.round % 2 === 1 ? updatedBattle.fighter2 : updatedBattle.fighter1;

      const baseDamage = Math.floor(attacker.power * (0.8 + Math.random() * 0.4));
      const criticalHit = Math.random() < 0.15;
      const damage = criticalHit ? Math.floor(baseDamage * 1.5) : baseDamage;

      defender.health = Math.max(0, defender.health - damage);

      const critText = criticalHit ? " 💥 CRÍTICO!" : "";
      log.push(`Round ${updatedBattle.round}: ${attacker.name} ataca ${defender.name} causando ${damage} de dano${critText}`);

      if (defender.health <= 0) {
        log.push(`💀 ${defender.name} foi derrotado!`);
      }

      updatedBattle.round++;
      setBattle({ ...updatedBattle });
      setBattleLog([...log]);

    }, 1500); // Intervalo de 1.5 segundos entre ataques
  };

  const resetArena = () => {
    setBattle(null);
    setBattleLog([]);
    setIsSimulating(false);
    setSelectedFighter(null);
  };

  return (
    <Card className="bg-gradient-dark border-joker-purple casino-glow">
      <CardHeader>
        <CardTitle className="text-center text-joker-purple text-2xl font-joker neon-text">
          ⚔️ ARENA DO CORINGA
        </CardTitle>
        <div className="text-center text-sm text-joker-gold font-gothic">
          <p>Escolha seu lutador e domine a arena!</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Seleção de Lutador */}
        {!battle && (
          <div className="space-y-4">
            <h3 className="text-joker-gold font-bold text-center font-gothic">
              🎭 Escolha seu Campeão
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {fighters.map((fighter) => (
                <div
                  key={fighter.id}
                  onClick={() => setSelectedFighter(fighter)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedFighter?.id === fighter.id
                      ? "border-joker-gold bg-gradient-joker shadow-glow"
                      : "border-joker-purple bg-gradient-dark hover:border-joker-gold"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{fighter.emoji}</div>
                    <div className={`font-bold text-sm ${selectedFighter?.id === fighter.id ? 'text-joker-black' : 'text-joker-gold'}`}>
                      {fighter.name}
                    </div>
                    <div className={`text-xs ${selectedFighter?.id === fighter.id ? 'text-joker-black' : 'text-joker-purple'}`}>
                      ⚡ {fighter.power} | ❤️ {fighter.health}
                    </div>
                    <div className={`text-xs ${selectedFighter?.id === fighter.id ? 'text-joker-black' : 'text-joker-gold'}`}>
                      {fighter.specialty}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Área de Aposta */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 justify-center">
                <label className="text-joker-gold font-bold font-gothic">Aposta:</label>
                <Input
                  type="number"
                  value={bet}
                  onChange={(e) => setBet(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={balance}
                  className="w-24 text-center bg-joker-dark border-joker-purple text-joker-gold font-gothic"
                />
                <span className="text-joker-gold font-gothic">fichas</span>
              </div>
              
              <Button
                variant="joker"
                size="lg"
                onClick={startBattle}
                disabled={!selectedFighter || balance < bet}
                className="w-full shake-animation"
              >
                ⚔️ INICIAR BATALHA
              </Button>
            </div>
          </div>
        )}

        {/* Arena de Batalha */}
        {battle && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-joker-gold font-bold font-gothic mb-4">
                ⚔️ BATALHA EM ANDAMENTO - Round {battle.round}
              </h3>
            </div>

            {/* Lutadores */}
            <div className="flex justify-between items-center">
              {/* Lutador 1 */}
              <div className="text-center bg-gradient-dark border border-joker-purple rounded-lg p-4 flex-1 mx-2">
                <div className="text-4xl mb-2">{battle.fighter1.emoji}</div>
                <div className="text-joker-gold font-bold text-sm">{battle.fighter1.name}</div>
                <div className="text-joker-purple text-xs">⚡ {battle.fighter1.power}</div>
                <div className="mt-2">
                  <div className="bg-joker-dark rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-joker-green to-joker-gold h-full transition-all duration-500"
                      style={{ width: `${(battle.fighter1.health / battle.fighter1.maxHealth) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-joker-gold mt-1">
                    {battle.fighter1.health}/{battle.fighter1.maxHealth} HP
                  </div>
                </div>
              </div>

              {/* VS */}
              <div className="text-center mx-4">
                <div className="w-16 h-16 bg-gradient-joker rounded-full border-2 border-joker-gold flex items-center justify-center shadow-neon animate-pulse">
                  <span className="text-xl font-horror">VS</span>
                </div>
              </div>

              {/* Lutador 2 */}
              <div className="text-center bg-gradient-dark border border-joker-purple rounded-lg p-4 flex-1 mx-2">
                <div className="text-4xl mb-2">{battle.fighter2.emoji}</div>
                <div className="text-joker-gold font-bold text-sm">{battle.fighter2.name}</div>
                <div className="text-joker-purple text-xs">⚡ {battle.fighter2.power}</div>
                <div className="mt-2">
                  <div className="bg-joker-dark rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-joker-green to-joker-gold h-full transition-all duration-500"
                      style={{ width: `${(battle.fighter2.health / battle.fighter2.maxHealth) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-joker-gold mt-1">
                    {battle.fighter2.health}/{battle.fighter2.maxHealth} HP
                  </div>
                </div>
              </div>
            </div>

            {/* Log da Batalha */}
            <div className="bg-gradient-dark border border-joker-purple rounded-lg p-4 max-h-32 overflow-y-auto">
              <h4 className="text-joker-gold font-bold mb-2 text-center font-gothic">
                📜 Log da Batalha
              </h4>
              {battleLog.length === 0 ? (
                <p className="text-joker-purple text-center text-sm animate-pulse">
                  🎭 A batalha está começando...
                </p>
              ) : (
                <div className="space-y-1">
                  {battleLog.slice(-4).map((entry, index) => (
                    <p key={index} className="text-joker-gold text-xs font-gothic">
                      {entry}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Botões de Controle */}
            {!isSimulating && (
              <div className="text-center">
                <Button
                  variant="bet"
                  onClick={resetArena}
                  className="font-gothic"
                >
                  🎪 NOVA BATALHA
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Regras da Arena */}
        <div className="text-center text-xs text-joker-gold font-gothic space-y-1">
          <p><strong>⚔️ Regras:</strong> Escolha um lutador e aposte no combate!</p>
          <p><strong>🎭 Vitória:</strong> Se seu lutador ganhar, você dobra suas fichas!</p>
          <p><strong>🎪 Estratégia:</strong> Analise poder e vida para escolher bem!</p>
          <p className="text-joker-purple font-horror">⚔️ Que o caos favoreça o mais forte!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Arena;
