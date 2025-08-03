import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CasinoHeader from "@/components/CasinoHeader";
import SlotMachine from "@/components/SlotMachine";
import Blackjack from "@/components/Blackjack";
import Roulette from "@/components/Roulette";
import CasinoStats from "@/components/CasinoStats";
import casinoBg from "@/assets/joker-casino-bg.jpg";

const Index = () => {
  const [balance, setBalance] = useState(1000);
  const [initialBalance] = useState(1000);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const { toast } = useToast();

  const handleBalanceChange = (newBalance: number) => {
    const oldBalance = balance;
    setBalance(newBalance);
    
    if (newBalance !== oldBalance) {
      setGamesPlayed(prev => prev + 1);
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
              <Tabs defaultValue="slots" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gradient-dark border-joker-purple">
                  <TabsTrigger 
                    value="slots" 
                    className="data-[state=active]:bg-gradient-joker data-[state=active]:text-joker-black font-gothic"
                  >
                    🃏 Joker Slots
                  </TabsTrigger>
                  <TabsTrigger 
                    value="blackjack"
                    className="data-[state=active]:bg-gradient-joker data-[state=active]:text-joker-black font-gothic"
                  >
                    🎭 Blackjack
                  </TabsTrigger>
                  <TabsTrigger 
                    value="roulette"
                    className="data-[state=active]:bg-gradient-joker data-[state=active]:text-joker-black font-gothic"
                  >
                    🎪 Roleta
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="slots" className="mt-6">
                  <SlotMachine 
                    balance={balance} 
                    onBalanceChange={handleBalanceChange}
                  />
                </TabsContent>
                
                <TabsContent value="blackjack" className="mt-6">
                  <Blackjack 
                    balance={balance} 
                    onBalanceChange={handleBalanceChange}
                  />
                </TabsContent>
                
                <TabsContent value="roulette" className="mt-6">
                  <Roulette 
                    balance={balance} 
                    onBalanceChange={handleBalanceChange}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <CasinoStats 
                balance={balance}
                initialBalance={initialBalance}
                gamesPlayed={gamesPlayed}
              />
              
              <div className="text-center">
                <Button 
                  variant="joker" 
                  onClick={addBonus}
                  className="w-full font-gothic"
                >
                  🎁 BONUS JOKER 500 FICHAS
                </Button>
              </div>

              <div className="bg-gradient-dark border border-joker-purple rounded-lg p-4 neon-glow">
                <h3 className="text-joker-gold font-bold mb-2 text-center font-joker">🎭 REGRAS DO JOKER</h3>
                <div className="text-sm text-joker-gold font-gothic space-y-2">
                  <p><strong>🃏 Joker Slots:</strong> Combine símbolos para ganhar!</p>
                  <p><strong>🎭 Blackjack:</strong> Chegue próximo de 21, Joker vale 15!</p>
                  <p><strong>🎪 Roleta:</strong> Aposte em cores, números ou paridades.</p>
                  <p className="text-joker-purple mt-3 font-horror">🃏 Que a loucura traga sorte!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
