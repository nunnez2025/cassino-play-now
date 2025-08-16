
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Coins, TrendingDown, Calendar, 
  Volume2, VolumeX, Mic, MicOff, ChevronRight, ChevronLeft
} from "lucide-react";
import { gameEconomyService, PlayerEconomicProfile } from "@/services/GameEconomyService";
import { publicAPIService, Quote, LocationData, WeatherData } from "@/services/PublicAPIService";
import { voiceService } from "@/services/VoiceService";
import { useToast } from "@/hooks/use-toast";

interface PlayerHUDProps {
  balance: number;
  gamesPlayed: number;
  darkcoins: number;
}

const PlayerHUD = ({ balance, gamesPlayed, darkcoins }: PlayerHUDProps) => {
  const [economicProfile, setEconomicProfile] = useState<PlayerEconomicProfile>(
    gameEconomyService.loadPlayerProfile()
  );
  const [quote, setQuote] = useState<Quote | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadExternalData();
    const interval = setInterval(loadExternalData, 300000); // 5 minutos
    return () => clearInterval(interval);
  }, []);

  const loadExternalData = async () => {
    try {
      const [quoteData, locationData, weatherData] = await Promise.all([
        publicAPIService.getRandomQuote(),
        publicAPIService.getLocationData(),
        publicAPIService.getWeatherData()
      ]);
      
      setQuote(quoteData);
      setLocation(locationData);
      setWeather(weatherData);
    } catch (error) {
      console.error('Error loading external data:', error);
    }
  };

  const speakQuote = async () => {
    if (!quote || isSpeaking) return;
    
    setIsSpeaking(true);
    try {
      await voiceService.speakAsJoker(`${quote.content} - ${quote.author}`);
      toast({
        title: "🎭 Joker Falou!",
        description: "Frase motivacional compartilhada!",
      });
    } catch (error) {
      console.error('Error speaking:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const startListening = async () => {
    if (isListening) return;
    
    setIsListening(true);
    try {
      const result = await voiceService.listen();
      
      if (result.transcript.toLowerCase().includes('saldo')) {
        await voiceService.speakAsHarlequin(
          `Seu saldo atual é de ${balance} fichas e ${darkcoins} DarkCoins`
        );
      } else if (result.transcript.toLowerCase().includes('dica')) {
        const insight = gameEconomyService.generateEconomicInsight(economicProfile);
        await voiceService.speakAsJoker(insight);
      } else {
        await voiceService.speakAsHarlequin(
          `Ouvi você dizer: ${result.transcript}. Como posso ajudar no cassino?`
        );
      }
      
      toast({
        title: "🎤 Comando de Voz",
        description: `Reconhecido: "${result.transcript}"`,
      });
    } catch (error) {
      console.error('Error listening:', error);
      toast({
        title: "❌ Erro de Voz",
        description: "Não consegui entender. Tente novamente!",
        variant: "destructive",
      });
    } finally {
      setIsListening(false);
    }
  };

  const cycleProgress = economicProfile.monthlyData.currentCycle;
  const progressPercentage = ((30 - cycleProgress) / 30) * 100;
  const estimatedReturn = economicProfile.monthlyData.totalLoss * 0.5;

  // Botão compacto quando retraído
  if (!isExpanded) {
    return (
      <div className="fixed top-4 right-4 z-40">
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-dark border-joker-purple casino-glow p-2 hover:scale-105 transition-all duration-300"
          variant="outline"
        >
          <ChevronLeft className="w-4 h-4 text-joker-gold" />
          <span className="text-xs text-joker-gold ml-1">HUD</span>
        </Button>
      </div>
    );
  }

  // Interface expandida
  return (
    <div className="fixed top-4 right-4 z-40 space-y-2 max-w-sm">
      {/* Botão de fechar */}
      <div className="flex justify-end mb-2">
        <Button
          onClick={() => setIsExpanded(false)}
          className="bg-gradient-dark border-joker-purple casino-glow p-1 h-8"
          variant="outline"
          size="sm"
        >
          <ChevronRight className="w-3 h-3 text-joker-gold" />
        </Button>
      </div>

      {/* Status Principal */}
      <Card className="bg-gradient-dark border-joker-purple casino-glow">
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <Coins className="w-3 h-3 text-joker-gold" />
              <span className="text-joker-gold font-bold">{balance.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-joker-purple" />
              <span className="text-joker-purple font-bold">{darkcoins.toLocaleString()} DC</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-joker-gold" />
              <span className="text-joker-gold text-xs">{gamesPlayed} jogos</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingDown className="w-3 h-3 text-red-400" />
              <span className="text-red-400 text-xs">
                -{economicProfile.monthlyData.totalLoss.toFixed(0)}
              </span>
            </div>
          </div>
          
          {/* Progresso do Ciclo */}
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-joker-purple">Ciclo 30 dias</span>
              <span className="text-xs text-joker-gold">{cycleProgress} dias restantes</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-1.5 bg-joker-dark" 
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-red-400">
                Perdido: {economicProfile.monthlyData.totalLoss.toFixed(0)}
              </span>
              <span className="text-xs text-green-400">
                Retorno: +{estimatedReturn.toFixed(0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles de Voz */}
      <Card className="bg-gradient-dark border-joker-purple casino-glow">
        <CardContent className="p-2">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={speakQuote}
              disabled={isSpeaking || !quote}
              className="text-xs h-7"
            >
              {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              Joker
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={startListening}
              disabled={isListening}
              className="text-xs h-7"
            >
              {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              Falar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações Contextuais */}
      <Card className="bg-gradient-dark border-joker-purple casino-glow">
        <CardContent className="p-2">
          <div className="space-y-1 text-xs">
            {location && (
              <div className="text-joker-gold">
                📍 {location.city}, {location.region}
              </div>
            )}
            {weather && (
              <div className="text-joker-purple">
                🌡️ {weather.current_condition[0]?.temp_C}°C - {weather.current_condition[0]?.weatherDesc[0]?.value}
              </div>
            )}
            {quote && (
              <div className="text-joker-gold text-xs leading-tight border-t border-joker-purple pt-1 mt-1">
                💬 "{quote.content.substring(0, 60)}..." - {quote.author}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerHUD;
