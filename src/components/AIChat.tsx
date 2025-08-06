
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, Zap, Brain, TrendingUp, ChevronUp, ChevronDown, Minimize2, Maximize2 } from "lucide-react";
import { aiService } from "@/services/AIService";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatProps {
  playerStats: {
    balance: number;
    darkcoins: number;
    gamesPlayed: number;
  };
}

const AIChat = ({ playerStats }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou a IA Coringa 🃏 Estou sempre aprendendo com cada jogador. Analisei seus padrões e posso ajudar com estratégias ou apenas conversar. Como posso ajudar?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiPersonality, setAiPersonality] = useState<'friendly' | 'aggressive' | 'strategic'>('friendly');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Gerar resposta usando o sistema de IA local
      const aiResponse = aiService.generateChatResponse(
        inputMessage, 
        playerStats, 
        aiPersonality
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Aprender com a interação - usando 'tie' como resultado neutro para interações de chat
      aiService.learnFromGame({
        gameType: 'chat',
        playerAction: 'message',
        result: 'tie',
        playerBalance: playerStats.balance,
        darkcoins: playerStats.darkcoins,
        timestamp: new Date()
      });

      // Atualizar personalidade baseada na mensagem
      updateAIPersonality(userMessage.content);

    } catch (error) {
      console.error('Erro no chat:', error);
      
      const fallbackResponses = [
        'Hmm, meus circuitos estão processando muitos dados... Mas continuo aprendendo com você! 🃏',
        'Sistema ocupado analisando padrões, mas o papo continua! 🎭',
        'Sobrecarga neural detectada, mas ainda posso conversar! 🤖',
        'IA em recalibração... Mas suas estratégias continuam interessantes! 🧠'
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAIPersonality = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('ajuda') || lowerMessage.includes('help') || lowerMessage.includes('dica')) {
      setAiPersonality('friendly');
    } else if (lowerMessage.includes('desafio') || lowerMessage.includes('competir') || lowerMessage.includes('battle')) {
      setAiPersonality('aggressive');
    } else if (lowerMessage.includes('estratégia') || lowerMessage.includes('análise') || lowerMessage.includes('estatística')) {
      setAiPersonality('strategic');
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'reset',
      content: 'Chat reiniciado! 🔄 Meu aprendizado continua ativo. Vamos conversar!',
      sender: 'ai',
      timestamp: new Date()
    }]);
    
    toast({
      title: "🤖 Chat Limpo",
      description: "Histórico limpo mas aprendizado mantido!",
    });
  };

  const getAIAvatar = () => {
    switch (aiPersonality) {
      case 'aggressive': return '😈';
      case 'strategic': return '🧠';
      default: return '🃏';
    }
  };

  const getPersonalityColor = () => {
    switch (aiPersonality) {
      case 'aggressive': return 'text-red-500';
      case 'strategic': return 'text-blue-400';
      default: return 'text-joker-purple';
    }
  };

  const getPersonalityName = () => {
    switch (aiPersonality) {
      case 'aggressive': return 'Agressiva';
      case 'strategic': return 'Estratégica';
      default: return 'Amigável';
    }
  };

  // Obter estatísticas da IA
  const aiStats = aiService.getAIStats();

  // Se minimizado, mostrar apenas um botão flutuante
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-joker hover:bg-gradient-joker/90 text-joker-black font-bold rounded-full w-14 h-14 shadow-lg hover:shadow-neon transition-all duration-300"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Card className="bg-gradient-dark border-joker-purple casino-glow h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-joker-gold font-joker neon-text text-sm">
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4" />
              <span>IA CORINGA</span>
              <span className={`text-base ${getPersonalityColor()}`}>
                {getAIAvatar()}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                className="text-xs h-6"
              >
                Limpar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-xs h-6 w-6 p-0"
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
            </div>
          </CardTitle>
          
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <div className="flex items-center justify-between">
              <div className="text-xs text-joker-purple font-gothic">
                <span>Modo: {getPersonalityName()}</span>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs h-6 w-6 p-0">
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="space-y-2">
              <div className="bg-gradient-dark border border-joker-purple rounded p-2">
                <div className="grid grid-cols-2 gap-2 text-xs text-joker-gold">
                  <div className="flex items-center space-x-1">
                    <Brain className="w-3 h-3" />
                    <span>Nível: {(aiStats.learningLevel * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Win Rate: {(aiStats.playerWinRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="text-xs text-joker-purple col-span-2">
                    🧠 {aiStats.gamesAnalyzed} jogos | Favorito: {aiStats.favoriteGame || 'Analisando...'}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-3 min-h-0">
          <ScrollArea className="flex-1 pr-2 max-h-60">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2 rounded text-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-joker text-joker-black'
                        : 'bg-gradient-dark border border-joker-purple text-joker-gold'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className={`text-base ${message.sender === 'user' ? 'text-joker-black' : getPersonalityColor()}`}>
                        {message.sender === 'user' ? '👤' : getAIAvatar()}
                      </div>
                      <div className="flex-1">
                        <p className="font-gothic leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-1 opacity-60 ${
                          message.sender === 'user' ? 'text-joker-black' : 'text-joker-purple'
                        }`}>
                          {message.timestamp.toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-dark border border-joker-purple text-joker-gold p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <div className={getPersonalityColor()}>{getAIAvatar()}</div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-joker-purple rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-joker-purple rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-joker-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Converse com a IA..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
              className="flex-1 bg-joker-dark border-joker-purple text-joker-gold font-gothic text-sm"
            />
            <Button
              variant="joker"
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-3"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("Qual minha melhor estratégia?")}
              className="text-xs h-6"
            >
              📊 Análise
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("Me desafie em um jogo!")}
              className="text-xs h-6"
            >
              ⚔️ Desafio
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("Como ganhar DarkCoins?")}
              className="text-xs h-6"
            >
              🪙 Dicas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChat;
