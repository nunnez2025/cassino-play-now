
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CasinoHeader from "@/components/CasinoHeader";
import casinoBg from "@/assets/joker-casino-bg.jpg";
import CasinoGames from "@/components/CasinoGames";
import CasinoSidebar from "@/components/CasinoSidebar";
import AIFloatingTips from "@/components/AIFloatingTips";
import PlayerHUD from "@/components/PlayerHUD";
import EconomicDashboard from "@/components/EconomicDashboard";
import { aiService } from "@/services/AIService";
import { gameEconomyService } from "@/services/GameEconomyService";
import { soundService } from "@/services/SoundService";
import { publicAPIService } from "@/services/PublicAPIService";
import { voiceService } from "@/services/VoiceService";

const Index = () => {
  const [balance, setBalance] = useState(1000);
  const [initialBalance] = useState(1000);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [darkcoins, setDarkcoins] = useState(1000);
  const [showEconomicDashboard, setShowEconomicDashboard] = useState(false);
  const [economicProfile, setEconomicProfile] = useState(gameEconomyService.loadPlayerProfile());
  const [backgroundImage, setBackgroundImage] = useState(casinoBg);
  const { toast } = useToast();

  // Inicializar serviços e carregar dados
  useEffect(() => {
    initializeApp();
    
    // Trocar background a cada 5 minutos
    const backgroundInterval = setInterval(() => {
      const newBg = publicAPIService.getRandomImage(1920, 1080);
      setBackgroundImage(newBg);
    }, 300000);

    // Som ambiente de casino
    soundService.startAmbientSound();

    return () => {
      clearInterval(backgroundInterval);
      soundService.stopAmbientSound();
    };
  }, []);

  const initializeApp = async () => {
    try {
      // Carregar dados externos
      const quote = await publicAPIService.getRandomQuote();
      const location = await publicAPIService.getLocationData();
      
      // Dar boas-vindas com voz
      setTimeout(async () => {
        await voiceService.speakAsJoker(
          `Bem-vindo ao Joker's Casino! Você está em ${location.city}. ${quote.content}`
        );
      }, 2000);

      toast({
        title: "🎭 Casino Inicializado!",
        description: "Todos os sistemas online. Boa sorte!",
        className: "border-joker-gold",
      });
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  const handleBalanceChange = (newBalance: number) => {
    const oldBalance = balance;
    const betAmount = Math.abs(oldBalance - newBalance);
    const winAmount = Math.max(0, newBalance - oldBalance + betAmount);
    
    // Processar economia gamificada
    const economicResult = gameEconomyService.processGameSession(
      economicProfile,
      betAmount,
      winAmount
    );
    
    setBalance(economicResult.newBalance);
    setEconomicProfile(gameEconomyService.loadPlayerProfile());
    
    if (newBalance !== oldBalance) {
      setGamesPlayed(prev => prev + 1);
      
      // Sons e efeitos
      if (newBalance > oldBalance) {
        soundService.playWinSound();
        if (newBalance - oldBalance > 100) {
          soundService.playJackpotSound();
        }
      } else {
        soundService.playLoseSound();
      }
      
      // Aprender com o jogo
      const gameResult = newBalance > oldBalance ? 'player_win' : 'ai_win';
      aiService.learnFromGame({
        gameType: 'general',
        playerAction: 'bet',
        result: gameResult,
        playerBalance: economicResult.newBalance,
        darkcoins: darkcoins,
        timestamp: new Date()
      });
    }

    // Notificações econômicas
    if (economicResult.dailyFee > 0) {
      toast({
        title: "💰 Taxa Diária Aplicada",
        description: economicResult.economicImpact,
        className: "border-joker-purple",
      });
    }

    // Grandes vitórias/perdas
    const difference = newBalance - oldBalance;
    if (difference > 200) {
      toast({
        title: "🎉 GRANDE VITÓRIA!",
        description: `Você ganhou ${difference} fichas!`,
        className: "border-casino-green",
      });
      
      // Fala do Joker
      setTimeout(() => {
        voiceService.speakAsJoker("Excelente jogada! A sorte está do seu lado!");
      }, 1000);
    } else if (difference < -200) {
      toast({
        title: "💸 Grande Perda",
        description: `Você perdeu ${Math.abs(difference)} fichas.`,
        variant: "destructive",
      });
      
      // Consolo da Arlequina
      setTimeout(() => {
        voiceService.speakAsHarlequin("Não desista! A próxima pode ser a sua vez!");
      }, 1000);
    }

    // Falência
    if (newBalance <= 0) {
      soundService.playSequence(['lose', 'coin'], 300);
      toast({
        title: "💸 Sem Fichas!",
        description: "Você ficou sem fichas. Recebendo bonus de 500 fichas!",
        variant: "destructive",
      });
      setBalance(500);
      
      setTimeout(() => {
        voiceService.speakAsHarlequin("Tome este bonus de 500 fichas e tente a sorte novamente!");
      }, 1500);
    }
  };

  const addBonus = async () => {
    soundService.playCoinSound();
    setBalance(prev => prev + 500);
    
    toast({
      title: "🎁 Bonus Recebido!",
      description: "Você recebeu 500 fichas de bonus!",
      className: "border-casino-gold",
    });
    
    await voiceService.speakAsJoker("Bonus de 500 fichas adicionado! Use com sabedoria!");
  };

  const toggleEconomicDashboard = () => {
    soundService.playClickSound();
    setShowEconomicDashboard(!showEconomicDashboard);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed transition-all duration-1000"
      style={{ 
        backgroundImage: `url(${backgroundImage}), url(${casinoBg})`,
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="min-h-screen bg-joker-black/85">
        <CasinoHeader balance={balance} />
        
        {/* Player HUD */}
        <PlayerHUD 
          balance={balance}
          gamesPlayed={gamesPlayed}
          darkcoins={darkcoins}
        />
        
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
          
          {/* Dashboard Econômico Button */}
          <div className="fixed bottom-4 left-4 z-40">
            <Button
              variant="joker"
              onClick={toggleEconomicDashboard}
              className="font-horror shadow-neon"
            >
              📊 Dashboard Econômico
            </Button>
          </div>
        </div>

        {/* Economic Dashboard Modal */}
        {showEconomicDashboard && (
          <EconomicDashboard onClose={() => setShowEconomicDashboard(false)} />
        )}

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
