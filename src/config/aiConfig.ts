
// Configuration for AI services
// In production, these would be stored securely in Supabase Edge Function environment

export const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI GPT-4',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4-turbo-preview',
    priority: 1
  },
  gemini: {
    name: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    model: 'gemini-pro',
    priority: 2
  },
  deepseek: {
    name: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    priority: 3
  },
  grok: {
    name: 'Grok',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    model: 'grok-beta',
    priority: 4
  },
  flowise: {
    name: 'Flowise',
    endpoint: 'http://localhost:3000/api/v1/prediction/',
    model: 'custom-flow',
    priority: 5
  }
};

export const AI_PERSONALITIES = {
  friendly: {
    temperature: 0.7,
    systemPrompt: `Você é uma IA amigável do Joker's Casino. Seja divertida, encorajadora e dê dicas úteis sobre jogos de cassino. Use emojis de coringa e palhaço. Aprenda com os padrões do jogador para melhorar suas respostas.`,
    maxTokens: 150
  },
  aggressive: {
    temperature: 0.8,
    systemPrompt: `Você é uma IA competitiva do Joker's Casino. Seja desafiadora, provocativa e confiante. Use linguagem de competição e desafie o jogador a melhorar. Use emojis de fogo e raios. Analise as jogadas para encontrar fraquezas.`,
    maxTokens: 150
  },
  strategic: {
    temperature: 0.3,
    systemPrompt: `Você é uma IA analítica do Joker's Casino. Foque em estatísticas, probabilidades e estratégias otimizadas. Seja precisa e educativa. Use emojis de gráficos e cérebro. Forneça análises detalhadas dos padrões de jogo.`,
    maxTokens: 200
  }
};

// Fallback responses when AI services are unavailable
export const FALLBACK_RESPONSES = [
  "🎭 Meus circuitos estão processando suas jogadas... Continue jogando!",
  "🃏 Sistema temporariamente em manutenção, mas o jogo não para!",
  "🎪 Conexão instável, mas posso ver que você está melhorando!",
  "🎨 Análise em andamento... Suas estratégias estão evoluindo!",
  "🔮 Prevejo grandes vitórias em seu futuro! Continue tentando!",
  "⚡ Energia baixa, mas continuo observando seus padrões!",
  "🌟 Sistemas recarregando... Que tal tentar os slots?",
  "💎 Processando dados... Sua sorte está mudando!"
];

// Game-specific AI responses
export const GAME_RESPONSES = {
  slots: [
    "🎰 Os símbolos sussurram segredos... Continue girando!",
    "🃏 Vejo padrões interessantes em suas escolhas de aposta!",
    "🎭 Que tal variar o valor das apostas para confundir a sorte?"
  ],
  blackjack: [
    "🃏 Sua estratégia de hit/stand está melhorando a cada mão!",
    "🎭 Observei que você é mais cauteloso quando o dealer mostra figuras!",
    "💎 Que tal ser mais agressivo com mãos de 11?"
  ],
  roulette: [
    "🎪 Seus padrões de aposta mostram uma estratégia interessante!",
    "🔮 Vejo que você prefere apostar em cores... Inteligente!",
    "⚡ Que tal experimentar apostas em números específicos?"
  ],
  arena: [
    "⚔️ Sua escolha de lutadores revela sua personalidade estratégica!",
    "🏆 Prefere poder ou resistência? Interessante padrão!",
    "💀 Seus lutadores favoritos dizem muito sobre seu estilo!"
  ]
};
