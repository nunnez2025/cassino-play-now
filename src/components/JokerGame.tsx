
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface JokerGameProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const JokerGame = ({ balance, onBalanceChange }: JokerGameProps) => {
  const [bet, setBet] = useState(10);
  const [playerChoice, setPlayerChoice] = useState<'higher' | 'lower' | null>(null);
  const [currentCard, setCurrentCard] = useState<number>(7);
  const [nextCard, setNextCard] = useState<number | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [gameState, setGameState] = useState<'betting' | 'choosing' | 'revealing' | 'finished'>('betting');
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [gameHistory, setGameHistory] = useState<{card: number, choice: string, won: boolean}[]>([]);

  const cardSymbols = ['🃏', '🎭', '👑', '💎', '🔮', '⚡', '🌟', '🎪', '🃁', '🂱', '🃑', '🂡', '🂢'];
  
  const getCardDisplay = (value: number) => {
    if (value === 1) return { symbol: 'A', color: 'text-joker-purple' };
    if (value === 11) return { symbol: 'J', color: 'text-joker-gold' };
    if (value === 12) return { symbol: 'Q', color: 'text-joker-green' };
    if (value === 13) return { symbol: 'K', color: 'text-joker-purple' };
    if (value === 14) return { symbol: '🃏', color: 'text-gradient-joker' };
    return { symbol: value.toString(), color: 'text-white' };
  };

  const startGame = useCallback(() => {
    if (balance < bet) {
      toast({
        title: "💸 Saldo Insuficiente",
        description: "Você não tem fichas suficientes para esta aposta!",
        variant: "destructive",
      });
      return;
    }

    setCurrentCard(Math.floor(Math.random() * 13) + 1);
    setNextCard(null);
    setPlayerChoice(null);
    setGameState('choosing');
    setIsRevealing(false);
    onBalanceChange(balance - bet);
  }, [balance, bet, onBalanceChange]);

  const makeChoice = (choice: 'higher' | 'lower') => {
    setPlayerChoice(choice);
    setGameState('revealing');
    setIsRevealing(true);

    setTimeout(() => {
      const newCard = Math.floor(Math.random() * 13) + 1;
      setNextCard(newCard);
      setIsRevealing(false);
      
      let won = false;
      if (choice === 'higher' && newCard > currentCard) won = true;
      if (choice === 'lower' && newCard < currentCard) won = true;
      if (newCard === currentCard) won = false; // Empate = perda

      const newHistory = [...gameHistory, { card: newCard, choice, won }];
      setGameHistory(newHistory.slice(-5)); // Manter apenas os últimos 5

      if (won) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        
        // Multiplicador baseado na sequência
        const newMultiplier = 1 + (newStreak * 0.5);
        setMultiplier(newMultiplier);
        
        const winAmount = Math.floor(bet * newMultiplier);
        onBalanceChange(balance + winAmount);
        
        toast({
          title: "🎉 Vitória do Coringa!",
          description: `Você ganhou ${winAmount} fichas! Sequência: ${newStreak}x`,
          className: "border-joker-green",
        });
      } else {
        setStreak(0);
        setMultiplier(1);
        
        toast({
          title: "💸 O Coringa riu de você!",
          description: `Você perdeu ${bet} fichas. Tente novamente!`,
          variant: "destructive",
        });
      }

      setGameState('finished');
    }, 2000);
  };

  const continueGame = () => {
    if (nextCard) {
      setCurrentCard(nextCard);
      setNextCard(null);
      setPlayerChoice(null);
      setGameState('choosing');
      setIsRevealing(false);
    }
  };

  const newGame = () => {
    setGameState('betting');
    setStreak(0);
    setMultiplier(1);
    setCurrentCard(7);
    setNextCard(null);
    setPlayerChoice(null);
    setIsRevealing(false);
  };

  return (
    <Card className="bg-gradient-dark border-joker-purple casino-glow">
      <CardHeader>
        <CardTitle className="text-center text-joker-purple text-2xl font-joker neon-text">
          🃏 JOKER'S HIGH-LOW
        </CardTitle>
        <div className="text-center text-sm text-joker-gold font-gothic">
          <p>Sequência: {streak}x | Multiplicador: {multiplier.toFixed(1)}x</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Área das Cartas */}
        <div className="flex justify-center items-center space-x-8">
          {/* Carta Atual */}
          <div className="text-center">
            <p className="text-joker-gold font-gothic mb-2">Carta Atual</p>
            <div className="w-24 h-32 bg-gradient-to-br from-joker-gold to-joker-purple rounded-xl border-4 border-joker-green shadow-glow flex items-center justify-center">
              <span className={`text-4xl font-bold ${getCardDisplay(currentCard).color}`}>
                {getCardDisplay(currentCard).symbol}
              </span>
            </div>
            <p className="text-joker-purple font-horror mt-2">{currentCard}</p>
          </div>

          {/* Versus */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-joker rounded-full border-2 border-joker-gold flex items-center justify-center shadow-neon">
              <span className="text-2xl font-horror">VS</span>
            </div>
          </div>

          {/* Próxima Carta */}
          <div className="text-center">
            <p className="text-joker-gold font-gothic mb-2">Próxima Carta</p>
            <div className={`w-24 h-32 rounded-xl border-4 border-joker-green shadow-glow flex items-center justify-center ${
              isRevealing ? "card-flip" : ""
            }`}>
              {nextCard !== null ? (
                <div className="bg-gradient-to-br from-joker-gold to-joker-purple w-full h-full rounded-lg flex items-center justify-center">
                  <span className={`text-4xl font-bold ${getCardDisplay(nextCard).color}`}>
                    {getCardDisplay(nextCard).symbol}
                  </span>
                </div>
              ) : (
                <div className="bg-gradient-purple w-full h-full rounded-lg flex items-center justify-center">
                  <span className="text-joker-gold text-3xl font-joker">
                    {isRevealing ? "🎭" : "?"}
                  </span>
                </div>
              )}
            </div>
            {nextCard !== null && (
              <p className="text-joker-purple font-horror mt-2">{nextCard}</p>
            )}
          </div>
        </div>

        {/* Controles do Jogo */}
        {gameState === 'betting' && (
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
              onClick={startGame}
              disabled={balance < bet}
              className="w-full shake-animation"
            >
              🎭 INICIAR JOGO
            </Button>
          </div>
        )}

        {gameState === 'choosing' && (
          <div className="space-y-4">
            <p className="text-center text-joker-gold font-gothic">
              A próxima carta será maior ou menor que {currentCard}?
            </p>
            <div className="flex space-x-4 justify-center">
              <Button
                variant="bet"
                size="lg"
                onClick={() => makeChoice('higher')}
                className="font-gothic hover:scale-110 transition-all duration-300"
              >
                🔺 MAIOR
              </Button>
              <Button
                variant="win"
                size="lg"
                onClick={() => makeChoice('lower')}
                className="font-gothic hover:scale-110 transition-all duration-300"
              >
                🔻 MENOR
              </Button>
            </div>
          </div>
        )}

        {gameState === 'revealing' && (
          <div className="text-center">
            <p className="text-joker-purple text-xl font-horror animate-pulse">
              🎪 O CORINGA ESTÁ REVELANDO... 🎪
            </p>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-xl font-bold font-horror ${
                nextCard && ((playerChoice === 'higher' && nextCard > currentCard) || 
                (playerChoice === 'lower' && nextCard < currentCard))
                  ? "text-joker-green neon-text" 
                  : "text-red-500"
              }`}>
                {nextCard && ((playerChoice === 'higher' && nextCard > currentCard) || 
                (playerChoice === 'lower' && nextCard < currentCard))
                  ? `🎉 CORINGA SORRIU! +${Math.floor(bet * multiplier)} FICHAS`
                  : "💀 O CORINGA RIU DE VOCÊ!"}
              </p>
            </div>
            
            <div className="flex space-x-2 justify-center">
              {streak > 0 && (
                <Button
                  variant="joker"
                  onClick={continueGame}
                  className="font-gothic"
                >
                  🎭 CONTINUAR (Sequência: {streak})
                </Button>
              )}
              <Button
                variant="bet"
                onClick={newGame}
                className="font-gothic"
              >
                🎪 NOVO JOGO
              </Button>
            </div>
          </div>
        )}

        {/* Histórico do Jogo */}
        {gameHistory.length > 0 && (
          <div className="bg-gradient-dark border border-joker-purple rounded-lg p-4">
            <h4 className="text-joker-gold font-bold mb-2 text-center font-gothic">
              🎭 Histórico das Últimas Jogadas
            </h4>
            <div className="flex justify-center space-x-2">
              {gameHistory.map((game, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    game.won ? "bg-joker-green text-white" : "bg-red-600 text-white"
                  }`}
                >
                  {game.card}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regras do Jogo */}
        <div className="text-center text-xs text-joker-gold font-gothic space-y-1">
          <p><strong>🃏 Regras:</strong> Adivinhe se a próxima carta será maior ou menor!</p>
          <p><strong>🎭 Sequência:</strong> Cada acerto consecutivo aumenta o multiplicador!</p>
          <p><strong>🎪 Empate:</strong> Se as cartas forem iguais, você perde!</p>
          <p className="text-joker-purple font-horror">🃏 A sorte do Coringa está com você!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default JokerGame;
