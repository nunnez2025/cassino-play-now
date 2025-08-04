
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, Zap } from "lucide-react";

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
      content: 'Bem-vindo ao Joker\'s Casino! 🃏 Sou a IA Coringa, sua adversária inteligente! Posso conversar sobre estratégias, analisar suas jogadas ou simplesmente bater um papo. O que você gostaria de fazer?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiPersonality, setAiPersonality] = useState('friendly'); // friendly, aggressive, strategic
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

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
      // Call the AI service through Supabase Edge Function
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          playerStats,
          aiPersonality,
          context: messages.slice(-5) // Send last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Desculpe, algo deu errado. Tente novamente!',
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update AI personality based on interaction
      updateAIPersonality(userMessage.content, data.response);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback responses when AI is unavailable
      const fallbackResponses = [
        'Hmm, parece que estou com alguns problemas técnicos. Mas posso dizer que suas jogadas estão interessantes! 🃏',
        'Meus circuitos estão um pouco confusos, mas continuarei observando suas estratégias! 🎭',
        'Conexão instável por aqui, mas o jogo continua! Que tal tentar sua sorte nos slots? 🎰',
        'Sistema temporariamente fora do ar, mas a diversão não para! Continue jogando! 🎪'
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

  const updateAIPersonality = (userMessage: string, aiResponse: string) => {
    // Simple personality adaptation based on user interaction
    if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('ajuda')) {
      setAiPersonality('friendly');
    } else if (userMessage.toLowerCase().includes('strategy') || userMessage.toLowerCase().includes('estratégia')) {
      setAiPersonality('strategic');
    } else if (userMessage.toLowerCase().includes('challenge') || userMessage.toLowerCase().includes('desafio')) {
      setAiPersonality('aggressive');
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: 'Chat limpo! 🧹 Pronto para uma nova conversa, jogador?',
      sender: 'ai',
      timestamp: new Date()
    }]);
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
      case 'strategic': return 'text-blue-500';
      default: return 'text-joker-purple';
    }
  };

  return (
    <Card className="bg-gradient-dark border-joker-purple casino-glow h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-joker-gold font-joker neon-text">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>IA CORINGA</span>
            <span className={`text-lg ${getPersonalityColor()}`}>
              {getAIAvatar()}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="text-xs"
            >
              Limpar
            </Button>
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
          </div>
        </CardTitle>
        <div className="text-xs text-joker-purple font-gothic">
          Modo: {aiPersonality === 'friendly' ? 'Amigável' : aiPersonality === 'aggressive' ? 'Agressiva' : 'Estratégica'} | 
          {messages.length - 1} mensagens
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 min-h-0">
        <ScrollArea className="flex-1 pr-3">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-joker text-joker-black'
                      : 'bg-gradient-dark border border-joker-purple text-joker-gold'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className={`text-lg ${message.sender === 'user' ? 'text-joker-black' : getPersonalityColor()}`}>
                      {message.sender === 'user' ? '👤' : getAIAvatar()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-gothic">{message.content}</p>
                      <p className={`text-xs mt-1 opacity-70 ${
                        message.sender === 'user' ? 'text-joker-black' : 'text-joker-purple'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-dark border border-joker-purple text-joker-gold p-3 rounded-lg">
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
            placeholder="Digite sua mensagem..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
            className="flex-1 bg-joker-dark border-joker-purple text-joker-gold font-gothic"
          />
          <Button
            variant="joker"
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-1 text-xs">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputMessage("Qual é a melhor estratégia?")}
            className="text-xs"
          >
            Estratégia
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputMessage("Como posso melhorar?")}
            className="text-xs"
          >
            Dicas
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputMessage("Vamos jogar!")}
            className="text-xs"
          >
            Desafio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;
