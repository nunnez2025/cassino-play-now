import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎", "🔔", "7️⃣"];

interface SlotMachineProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const SlotMachine = ({ balance, onBalanceChange }: SlotMachineProps) => {
  const [reels, setReels] = useState(["🍒", "🍒", "🍒"]);
  const [bet, setBet] = useState(10);
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
        // Three of a kind
        if (finalReels[0] === "💎") winAmount = bet * 20;
        else if (finalReels[0] === "7️⃣") winAmount = bet * 15;
        else if (finalReels[0] === "⭐") winAmount = bet * 10;
        else winAmount = bet * 5;
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
    <Card className="bg-casino-dark border-casino-gold casino-glow">
      <CardHeader>
        <CardTitle className="text-center text-casino-gold text-2xl">
          🎰 CAÇA-NÍQUEIS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center space-x-2">
          {reels.map((symbol, index) => (
            <div
              key={index}
              className={`w-20 h-20 bg-white rounded-lg flex items-center justify-center text-4xl border-4 border-casino-gold ${
                isSpinning ? "slot-reel" : ""
              }`}
            >
              {symbol}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 justify-center">
            <label className="text-casino-gold font-bold">Aposta:</label>
            <Input
              type="number"
              value={bet}
              onChange={(e) => setBet(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max={balance}
              className="w-24 text-center bg-casino-black border-casino-gold text-casino-gold"
            />
            <span className="text-casino-gold">fichas</span>
          </div>

          <div className="text-center">
            <Button
              variant="casino"
              size="lg"
              onClick={spin}
              disabled={balance < bet || isSpinning}
              className="w-full"
            >
              {isSpinning ? "GIRANDO..." : "GIRAR"}
            </Button>
          </div>

          {lastWin > 0 && (
            <div className="text-center">
              <p className="text-casino-green text-2xl font-bold neon-text">
                VOCÊ GANHOU {lastWin} FICHAS! 🎉
              </p>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>💎 = 20x | 7️⃣ = 15x | ⭐ = 10x | Outros = 5x</p>
          <p>Dois iguais = 2x</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlotMachine;