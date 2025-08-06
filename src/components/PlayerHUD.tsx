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

  // Interface expandida com layout corrigido
  return (
    <div className="fixed top-4 right-4 z-40 space-y-3 max-w-xs">
      {/* Botão de fechar */}
      <div className="flex justify-end">
        <Button
          onClick={() => setIsExpanded(false)}
          className="bg-gradient-dark border-joker-purple casino-glow p-1 h-8"
          variant="outline"
          size="sm"
        >
          <ChevronRight className="w-3 h-3 text-joker-gold" />
        </Button>
      </div>

      {/* Status Principal - Layout em grid 2x2 */}
      <Card className="bg-gradient-dark border-joker-purple casino-glow">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* Primeira linha */}
            <div className="flex items-center space-x-2">
              <Coins className="w-4 h-4 text-joker-gold flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-joker-gold font-bold text-xs">Fichas</span>
                <span className="text-joker-gold font-bold truncate">{balance.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-joker-purple flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-joker-purple font-bold text-xs">DarkCoins</span>
                <span className="text-joker-purple font-bold truncate">{darkcoins.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Segunda linha */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-joker-gold flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-joker-gold text-xs">Jogos</span>
                <span className="text-joker-gold font-bold">{gamesPlayed}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-red-400 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-red-400 text-xs">Perda</span>
                <span className="text-red-400 font-bold">
                  -{economicProfile.monthlyData.totalLoss.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Progresso do Ciclo */}
          <div className="mt-4 pt-3 border-t border-joker-purple/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-joker-purple">Ciclo 30 dias</span>
              <span className="text-xs text-joker-gold">{cycleProgress} dias restantes</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-joker-dark" 
            />
            <div className="flex justify-between items-center mt-2">
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
        <CardContent className="p-3">
          <div className="flex justify-between items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={speakQuote}
              disabled={isSpeaking || !quote}
              className="text-xs h-8 flex-1"
            >
              {isSpeaking ? <VolumeX className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
              Joker
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={startListening}
              disabled={isListening}
              className="text-xs h-8 flex-1"
            >
              {isListening ? <MicOff className="w-3 h-3 mr-1" /> : <Mic className="w-3 h-3 mr-1" />}
              Falar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações Contextuais */}
      <Card className="bg-gradient-dark border-joker-purple casino-glow">
        <CardContent className="p-3">
          <div className="space-y-2 text-xs">
            {location && (
              <div className="text-joker-gold flex items-center">
                <span className="mr-1">📍</span>
                <span className="truncate">{location.city}, {location.region}</span>
              </div>
            )}
            {weather && (
              <div className="text-joker-purple flex items-center">
                <span className="mr-1">🌡️</span>
                <span className="truncate">
                  {weather.current_condition[0]?.temp_C}°C - {weather.current_condition[0]?.weatherDesc[0]?.value}
                </span>
              </div>
            )}
            {quote && (
              <div className="text-joker-gold text-xs leading-tight border-t border-joker-purple/30 pt-2">
                <div className="flex items-start">
                  <span className="mr-1 flex-shrink-0">💬</span>
                  <div className="min-w-0">
                    <p className="truncate">"{quote.content.substring(0, 45)}..."</p>
                    <p className="text-right text-joker-purple/80 mt-1">- {quote.author}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerHUD;
