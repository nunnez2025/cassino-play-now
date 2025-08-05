
import { useState, useEffect } from "react";
import { Bot, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AIFloatingTipsProps {
  playerStats: {
    balance: number;
    gamesPlayed: number;
  };
}

const AIFloatingTips = ({ playerStats }: AIFloatingTipsProps) => {
  const [currentTip, setCurrentTip] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    "🃏 Bem-vindo ao Joker's Casino! Sou sua IA assistente e estou aqui para ajudar!",
    "💡 Dica: Comece com apostas baixas para entender cada jogo!",
    "🎰 Os slots são ótimos para iniciantes - experimente diferentes valores de aposta!",
    "🃏 No Blackjack, lembre-se: o objetivo é chegar próximo de 21 sem estourar!",
    "🏆 Você está indo bem! Continue jogando para ganhar mais fichas!",
    "💎 Que tal tentar o Arena? É onde os verdadeiros coringas se destacam!",
    "🎭 Sua estratégia está evoluindo! Posso ver padrões interessantes em seu jogo!",
    "⚡ Lembre-se de gerenciar suas fichas com sabedoria - a casa sempre tem vantagem!",
    "🎪 Experimente diferentes jogos para encontrar seu favorito!",
    "🔮 Vejo potencial em você! Continue praticando suas habilidades!"
  ];

  useEffect(() => {
    const showTip = () => {
      if (!isVisible) {
        setCurrentTip(tips[tipIndex]);
        setIsVisible(true);
        setTipIndex((prev) => (prev + 1) % tips.length);
      }
    };

    // Show first tip after 3 seconds
    const initialTimer = setTimeout(showTip, 3000);
    
    // Then show tips every 30 seconds
    const intervalTimer = setInterval(showTip, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [tipIndex, isVisible, tips]);

  // Auto-hide tip after 8 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const closeTip = () => {
    setIsVisible(false);
  };

  if (!isVisible || !currentTip) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-fade-in">
      <Card className="bg-gradient-to-r from-joker-dark to-joker-black border-2 border-joker-purple shadow-2xl max-w-sm">
        <div className="p-4 relative">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-joker-purple to-joker-purple-dark rounded-full flex items-center justify-center shadow-neon">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-joker-dark border border-joker-purple rounded-lg p-3 relative">
                <div className="absolute -left-2 top-3 w-4 h-4 bg-joker-dark border-l border-b border-joker-purple transform rotate-45"></div>
                <p className="text-sm text-joker-gold font-gothic leading-relaxed">
                  {currentTip}
                </p>
              </div>
            </div>
            <button
              onClick={closeTip}
              className="flex-shrink-0 text-joker-purple hover:text-joker-gold transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-xs text-joker-purple font-gothic text-center">
            IA Coringa • Nível de Aprendizado: {Math.min(100, playerStats.gamesPlayed * 2)}%
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIFloatingTips;
