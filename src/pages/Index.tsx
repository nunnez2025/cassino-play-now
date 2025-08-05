import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CasinoHeader from "@/components/CasinoHeader";
import SlotMachine from "@/components/SlotMachine";
import Blackjack from "@/components/Blackjack";
import Roulette from "@/components/Roulette";
import JokerGame from "@/components/JokerGame";
import Arena from "@/components/Arena";
import CasinoStats from "@/components/CasinoStats";
import casinoBg from "@/assets/joker-casino-bg.jpg";
import DarkCoinSystem from "@/components/DarkCoinSystem";
import AIChat from "@/components/AIChat";
import { aiService } from "@/services/AIService";
import CasinoGames from "@/components/CasinoGames";
import CasinoSidebar from "@/components/CasinoSidebar";
import AIFloatingTips from "@/components/AIFloatingTips";

const Index = () => {
  const [balance, setBalance] = useState(1000);
  const [initialBalance] = useState(1000);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [darkcoins, setDarkcoins] = useState(1000);
  const { toast } = useToast();

  const handleBalanceChange = (newBalance: number) => {
    const oldBalance = balance;
    setBalance(newBalance);
    
    if (newBalance !== oldBalance) {
      setGamesPlayed(prev => prev + 1);
      
      // Learn from the game result
      const gameResult = newBalance > oldBalance ? 'player_win' : 'ai_win';
      aiService.learnFromGame({
        gameType: 'general',
        playerAction: 'bet',
        result: gameResult,
        playerBalance: newBalance,
        darkcoins: darkcoins,
        timestamp: new Date()
      });
    }

    // Show notifications for significant wins/losses
    const difference = newBalance - oldBalance;
    if (difference > 100) {
      toast({
        title: "🎉 Grande Vitória!",
        description: `Você ganhou ${difference} fichas!`,
        className: "border-casino-green",
      });
    } else if (difference < -100) {
      toast({
        title: "💸 Grande Perda",
        description: `Você perdeu ${Math.abs(difference)} fichas.`,
        variant: "destructive",
      });
    }

    // Check for bankruptcy
    if (newBalance <= 0) {
      toast({
        title: "💸 Sem Fichas!",
        description: "Você ficou sem fichas. Recebendo bonus de 500 fichas!",
        variant: "destructive",
      });
      setBalance(500);
    }
  };

  const addBonus = () => {
    setBalance(prev => prev + 500);
    toast({
      title: "🎁 Bonus Recebido!",
      description: "Você recebeu 500 fichas de bonus!",
      className: "border-casino-gold",
    });
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${casinoBg})` }}
    >
      <div className="min-h-screen bg-joker-black/85">
        <CasinoHeader balance={balance} />
        
        <div className="container mx-auto p-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Games */}
            <div className="lg:col-span-3">
              <CasinoGames
                balance={balance}
                onBalanceChange={handleBalanceChange}
                playerStats={{
                  balance,
                  darkcoins,
                  gamesPlayed
                }}
              />
            </div>

            {/* Enhanced Sidebar */}
            <CasinoSidebar
              balance={balance}
              initialBalance={initialBalance}
              gamesPlayed={gamesPlayed}
              onBalanceChange={setBalance}
              onAddBonus={addBonus}
            />
          </div>
        </div>

        {/* AI Floating Tips */}
        <AIFloatingTips 
          playerStats={{
            balance,
            gamesPlayed
          }}
        />
      </div>
    </div>
  );
};

export default Index;
