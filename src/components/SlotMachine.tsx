import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SYMBOLS = ["🃏", "🎭", "👑", "💎", "🔮", "⚡", "🌟", "🎪"];

interface SlotMachineProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const SlotMachine = ({ balance, onBalanceChange }: SlotMachineProps) => {
  const [reels, setReels] = useState(["🃏", "🃏", "🃏"]);
  const [bet, setBet] = useState(15);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);

  const spin = useCallback(() => {
    if (balance < bet || isSpinning) return;

    setIsSpinning(true);
    onBalanceChange(balance - bet);

    // Animate spinning
    const spinInterval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      
      const finalReels = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ];
      
      setReels(finalReels);
      setIsSpinning(false);

      // Check for wins
      let winAmount = 0;
      if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
        // Three of a kind - Joker themed multipliers
        if (finalReels[0] === "🃏") winAmount = bet * 50; // Joker is highest
        else if (finalReels[0] === "🎭") winAmount = bet * 25; // Mask
        else if (finalReels[0] === "👑") winAmount = bet * 20; // Crown
        else if (finalReels[0] === "💎") winAmount = bet * 15; // Diamond
        else if (finalReels[0] === "🔮") winAmount = bet * 12; // Crystal ball
        else winAmount = bet * 8;
      } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
        // Two of a kind
        winAmount = bet * 2;
      }

      if (winAmount > 0) {
        setLastWin(winAmount);
        onBalanceChange(balance - bet + winAmount);
      } else {
        setLastWin(0);
      }
    }, 2000);
  }, [balance, bet, isSpinning, onBalanceChange]);

  return (
    <Card className="bg-gradient-dark border-joker-purple casino-glow">
      <CardHeader>
        <CardTitle className="text-center text-joker-purple text-2xl font-joker neon-text">
          🎰 JOKER'S SLOTS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center space-x-2">
          {reels.map((symbol, index) => (
            <div
              key={index}
              className={`w-24 h-24 bg-gradient-to-br from-joker-gold to-joker-purple rounded-xl flex items-center justify-center text-5xl border-4 border-joker-green shadow-glow ${
                isSpinning ? "slot-reel" : ""
              }`}
            >
              {symbol}
            </div>
          ))}
        </div>

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

          <div className="text-center">
            <Button
              variant="joker"
              size="lg"
              onClick={spin}
              disabled={balance < bet || isSpinning}
              className="w-full shake-animation"
            >
              {isSpinning ? "🎪 GIRANDO..." : "🃏 GIRAR"}
            </Button>
          </div>

          {lastWin > 0 && (
            <div className="text-center">
              <p className="text-joker-green text-3xl font-bold neon-text font-horror">
                🎉 VOCÊ GANHOU {lastWin} FICHAS! 🎉
              </p>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-joker-gold font-gothic">
          <p>🃏 = 50x | 🎭 = 25x | 👑 = 20x | 💎 = 15x | 🔮 = 12x | Outros = 8x</p>
          <p>Dois iguais = 3x | <span className="text-joker-purple">Sorte do Coringa!</span></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlotMachine;