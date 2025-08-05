import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import SlotMachine from "./SlotMachine";
import Blackjack from "./Blackjack";
import JokerHacker from "./JokerHacker";
import JokerGame from "./JokerGame";
import Arena from "./Arena";
import AIChat from "./AIChat";

interface CasinoGamesProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  playerStats: {
    balance: number;
    darkcoins: number;
    gamesPlayed: number;
  };
}

const CasinoGames = ({ balance, onBalanceChange, playerStats }: CasinoGamesProps) => {
  const [activeTab, setActiveTab] = useState("slots");
  const [showJokerHacker, setShowJokerHacker] = useState(false);

  const handleJokerHackerOpen = () => {
    setShowJokerHacker(true);
  };

  const handleJokerHackerBack = () => {
    setShowJokerHacker(false);
  };

  if (showJokerHacker) {
    return (
      <JokerHacker 
        balance={balance}
        onBalanceChange={onBalanceChange}
        onBack={handleJokerHackerBack} 
      />
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-6 bg-gradient-dark border-joker-purple">
        <TabsTrigger 
          value="slots" 
          className="data-[state=active]:bg-gradient-joker data-[state=active]:text-joker-black font-gothic text-xs"
        >
          🃏 Joker Slots
        </TabsTrigger>
        <TabsTrigger 
          value="blackjack"
          className="data-[state=active]:bg-gradient-joker data-[state=active]:text-joker-black font-gothic text-xs"
        >
          🎭 Blackjack
        </TabsTrigger>
        <TabsTrigger 
          value="hacker"
          className="data-[state=active]:bg-gradient-joker data-[state=active]:text-joker-black font-gothic text-xs"
        >
          🎯 Hacker
        </TabsTrigger>
        <TabsTrigger 
          value="jokergame"
          className="data-[state=active]:bg-gradient-joker data-[state=active]:text-joker-black font-gothic text-xs"
        >
          🎲 High-Low
        </TabsTrigger>
        <TabsTrigger 
          value="arena"
          className="data-[state=active]:bg-gradient-joker data-[state=active]:text-joker-black font-gothic text-xs"
        >
          ⚔️ Arena
        </TabsTrigger>
        <TabsTrigger 
          value="ai-chat" 
          className="data-[state=active]:bg-gradient-joker data-[state=active]:text-joker-black font-gothic text-xs"
        >
          🤖 IA Chat
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="slots" className="mt-6">
        <SlotMachine 
          balance={balance} 
          onBalanceChange={onBalanceChange}
        />
      </TabsContent>
      
      <TabsContent value="blackjack" className="mt-6">
        <Blackjack 
          balance={balance} 
          onBalanceChange={onBalanceChange}
        />
      </TabsContent>
      
      <TabsContent value="hacker" className="mt-6">
        <div className="text-center">
          <button 
            onClick={handleJokerHackerOpen}
            className="bg-gradient-to-br from-joker-purple to-joker-purple-dark text-white px-8 py-4 rounded-lg text-xl font-bold hover:shadow-neon transition-all duration-300"
          >
            🎯 ABRIR JOKER HACKER
          </button>
        </div>
      </TabsContent>

      <TabsContent value="jokergame" className="mt-6">
        <JokerGame 
          balance={balance} 
          onBalanceChange={onBalanceChange}
        />
      </TabsContent>

      <TabsContent value="arena" className="mt-6">
        <Arena 
          balance={balance} 
          onBalanceChange={onBalanceChange}
        />
      </TabsContent>
      
      <TabsContent value="ai-chat" className="mt-6">
        <AIChat playerStats={playerStats} />
      </TabsContent>
    </Tabs>
  );
};

export default CasinoGames;
