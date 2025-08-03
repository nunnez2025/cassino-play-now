import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const NUMBERS = Array.from({ length: 37 }, (_, i) => i); // 0-36
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

interface RouletteProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const Roulette = ({ balance, onBalanceChange }: RouletteProps) => {
  const [bet, setBet] = useState(25);
  const [betType, setBetType] = useState<"number" | "red" | "black" | "even" | "odd">("red");
  const [betNumber, setBetNumber] = useState(7);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const spin = useCallback(() => {
    if (balance < bet || isSpinning) return;

    setIsSpinning(true);
    setMessage("");
    onBalanceChange(balance - bet);

    setTimeout(() => {
      const result = Math.floor(Math.random() * 37);
      setLastResult(result);
      setIsSpinning(false);

      let won = false;
      let winAmount = 0;

      switch (betType) {
        case "number":
          if (result === betNumber) {
            won = true;
            winAmount = bet * 36;
          }
          break;
        case "red":
          if (result !== 0 && RED_NUMBERS.includes(result)) {
            won = true;
            winAmount = bet * 2;
          }
          break;
        case "black":
          if (result !== 0 && !RED_NUMBERS.includes(result)) {
            won = true;
            winAmount = bet * 2;
          }
          break;
        case "even":
          if (result !== 0 && result % 2 === 0) {
            won = true;
            winAmount = bet * 2;
          }
          break;
        case "odd":
          if (result !== 0 && result % 2 === 1) {
            won = true;
            winAmount = bet * 2;
          }
          break;
      }

      if (won) {
        onBalanceChange(balance - bet + winAmount);
        setMessage(`🎉 Você ganhou ${winAmount} fichas!`);
      } else {
        setMessage("Não foi dessa vez! Tente novamente.");
      }
    }, 3000);
  }, [balance, bet, betType, betNumber, isSpinning, onBalanceChange]);

  const getNumberColor = (num: number) => {
    if (num === 0) return "text-casino-green";
    return RED_NUMBERS.includes(num) ? "text-casino-red" : "text-white";
  };

  return (
    <Card className="bg-casino-dark border-casino-gold casino-glow">
      <CardHeader>
        <CardTitle className="text-center text-casino-gold text-2xl">
          🎯 ROLETA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className={`w-32 h-32 rounded-full border-8 border-casino-gold bg-casino-dark flex items-center justify-center ${
            isSpinning ? "roulette-wheel" : ""
          }`}>
            {lastResult !== null ? (
              <span className={`text-4xl font-bold ${getNumberColor(lastResult)}`}>
                {lastResult}
              </span>
            ) : (
              <span className="text-casino-gold text-2xl">?</span>
            )}
          </div>
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

          <div className="space-y-3">
            <label className="text-casino-gold font-bold block">Tipo de Aposta:</label>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={betType === "red" ? "casino" : "outline"}
                onClick={() => setBetType("red")}
                className="bg-casino-red hover:bg-casino-red/80 text-white"
              >
                Vermelho (2x)
              </Button>
              <Button
                variant={betType === "black" ? "casino" : "outline"}
                onClick={() => setBetType("black")}
                className="bg-casino-black hover:bg-casino-black/80 text-white border-white"
              >
                Preto (2x)
              </Button>
              <Button
                variant={betType === "even" ? "casino" : "outline"}
                onClick={() => setBetType("even")}
              >
                Par (2x)
              </Button>
              <Button
                variant={betType === "odd" ? "casino" : "outline"}
                onClick={() => setBetType("odd")}
              >
                Ímpar (2x)
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={betType === "number" ? "casino" : "outline"}
                onClick={() => setBetType("number")}
              >
                Número específico (36x)
              </Button>
              {betType === "number" && (
                <Input
                  type="number"
                  value={betNumber}
                  onChange={(e) => setBetNumber(Math.max(0, Math.min(36, parseInt(e.target.value) || 0)))}
                  min="0"
                  max="36"
                  className="w-20 text-center bg-casino-black border-casino-gold text-casino-gold"
                />
              )}
            </div>
          </div>

          <Button
            variant="casino"
            size="lg"
            onClick={spin}
            disabled={balance < bet || isSpinning}
            className="w-full"
          >
            {isSpinning ? "GIRANDO..." : "GIRAR ROLETA"}
          </Button>

          {message && (
            <div className="text-center">
              <p className={`text-xl font-bold ${
                message.includes("ganhou") ? "text-casino-green neon-text" : "text-casino-red"
              }`}>
                {message}
              </p>
            </div>
          )}

          {lastResult !== null && (
            <div className="text-center">
              <p className="text-casino-gold">
                Último resultado: <span className={`font-bold ${getNumberColor(lastResult)}`}>
                  {lastResult}
                </span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Roulette;