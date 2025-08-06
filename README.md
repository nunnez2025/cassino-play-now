
# 🎭 Joker's Casino - Sistema de Cassino Virtual Avançado

Um sistema completo de cassino virtual com IA, economia gamificada, síntese de voz e APIs integradas.

## ✨ Funcionalidades Principais

### 🎮 Jogos Disponíveis
- **🎰 Joker Slots** - Caça-níqueis temático
- **🃏 Blackjack** - 21 clássico com IA
- **🎯 Joker Hacker** - Mini-game hacker temático  
- **🎲 High-Low** - Jogo de adivinhação
- **⚔️ Arena** - Batalhas automáticas
- **🤖 IA Chat** - Conversa com assistente inteligente

### 💰 Sistema Econômico Gamificado
- **Taxa Diária**: 10% de todas as apostas
- **Retorno Mensal**: 50% das perdas após 30 dias
- **Histórico Completo**: Gráficos e estatísticas detalhadas
- **Rankings**: Maiores perdedores e recuperações

### 🧠 Sistema de IA Avançado
- **Aprendizado Automático**: IA aprende com cada jogo
- **Análise de Padrões**: Detecta comportamentos do jogador
- **Dicas Inteligentes**: Sugestões baseadas no desempenho
- **Personalidades**: Joker (agressivo), Arlequina (amigável), Estratégico

### 🔊 Sistema de Voz Completo
- **Text-to-Speech**: Joker e Arlequina falam com você
- **Speech-to-Text**: Comandos de voz funcionais
- **Efeitos Sonoros**: Sons de casino realistas
- **Música Ambiente**: Atmosfera imersiva

### 🌐 APIs Integradas (Sem Chave)
- **Frases Motivacionais**: `quotable.io` e `zenquotes.io`
- **Localização**: `ipapi.co` para dados geográficos
- **Clima**: `wttr.in` para informações meteorológicas
- **Imagens Dinâmicas**: `picsum.photos` e `unsplash.com`

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Animações customizadas
- **Charts**: Recharts para gráficos econômicos
- **Icons**: Lucide React
- **Audio**: Web Speech API + Web Audio API
- **Storage**: localStorage para persistência
- **Build**: Vite com otimizações de produção

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone [url-do-repositorio]
cd jokers-casino
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto em desenvolvimento**
```bash
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:5173
```

### Build para Produção

```bash
npm run build
npm run preview
```

## 🌐 Deploy na Vercel

### Configuração Automática
1. Conecte seu repositório na Vercel
2. A configuração está em `vercel.json`
3. Deploy automático a cada push

### Deploy Manual
```bash
npm install -g vercel
vercel
```

## 📱 Funcionalidades por Componente

### 🎯 PlayerHUD
- Status em tempo real do jogador
- Informações contextuais (localização, clima)
- Controles de voz integrados
- Progresso do ciclo econômico

### 📊 Economic Dashboard
- Gráficos de barras e pizza interativos
- Histórico de 30 dias detalhado
- Rankings globais simulados
- Projeções de retorno

### 🤖 AI Chat System
- Conversas inteligentes contextualizadas
- Análise de padrões de jogo
- Dicas estratégicas personalizadas
- Múltiplas personalidades

### 🎵 Sound System
- Efeitos sonoros procedurais
- Música ambiente adaptável
- Controles de volume independentes
- Sequências sonoras complexas

## 🎨 Design System

### Cores Principais
```css
--joker-purple: #8B5CF6
--joker-gold: #F59E0B
--joker-black: #0F0F0F
--joker-dark: #1F1F1F
```

### Fontes
- **Headers**: 'Creepster' (Horror theme)
- **Body**: 'Cinzel' (Gothic theme)
- **UI**: System fonts

### Animações
- Transições suaves com `transition-all`
- Efeitos de neon e glow
- Animações de partículas
- Hover effects responsivos

## 🔧 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI base
│   ├── games/          # Componentes de jogos
│   └── layouts/        # Layouts e estruturas
├── services/           # Lógica de negócio
│   ├── AIService.ts    # Sistema de IA
│   ├── VoiceService.ts # Síntese/reconhecimento voz
│   ├── SoundService.ts # Sistema de áudio
│   ├── GameEconomyService.ts # Economia gamificada
│   └── PublicAPIService.ts # APIs externas
├── types/              # Definições TypeScript
├── hooks/              # Custom React hooks
├── assets/             # Imagens e recursos
└── pages/              # Páginas principais
```

## 🎮 Como Jogar

### Primeiro Acesso
1. Você inicia com 1000 fichas
2. A IA dá boas-vindas com síntese de voz
3. Escolha seu jogo favorito nas abas

### Sistema Econômico
1. **10% de taxa diária** em todas as apostas
2. **Ciclo de 30 dias** para retorno
3. **50% de volta** de tudo que perdeu
4. Acompanhe no Dashboard Econômico

### Comandos de Voz
- Diga **"saldo"** para ouvir seu saldo atual
- Diga **"dica"** para receber conselhos da IA
- Use o botão de microfone no HUD

### Interação com IA
- Chat inteligente com contexto
- IA aprende seus padrões de jogo
- Dicas personalizadas baseadas no desempenho
- Múltiplas personalidades (Amigável, Agressiva, Estratégica)

## 🔊 Sistema de Áudio

### Configuração
- **Volume Master**: Controla todos os sons
- **Efeitos**: Sons de vitória, derrota, cliques
- **Ambiente**: Música de fundo contínua
- **Voz**: Text-to-speech com vozes diferenciadas

### Compatibilidade
- Chrome/Edge: Suporte completo
- Firefox: Funcional com limitações
- Safari: Funcional em iOS 14.5+
- Mobile: Requer interação do usuário primeiro

## 📊 Métricas e Analytics

### Dados Coletados (Local)
- Padrões de apostas por jogo
- Horários de maior atividade
- Taxa de vitória/derrota
- Tempo médio de sessão
- Preferências de jogos

### Relatórios Disponíveis
- Dashboard econômico completo
- Gráficos de evolução diária
- Rankings comparativos
- Projeções de retorno

## 🛡️ Recursos de Segurança

### Dados Locais
- Todas informações salvas no navegador
- Sem coleta de dados pessoais
- Reset completo disponível
- Backups automáticos

### APIs Externas
- Apenas APIs públicas gratuitas
- Sem necessidade de chaves
- Cache inteligente para performance
- Fallbacks para indisponibilidade

## 🔄 Atualizações e Manutenção

### Versionamento
- Versionamento semântico (semver)
- Changelog detalhado
- Migrações de dados automáticas

### Roadmap Futuro
- [ ] Integração blockchain/NFT
- [ ] Multiplayer real
- [ ] Mais jogos de casino
- [ ] Sistema de conquistas
- [ ] Torneios programados

## 📞 Suporte e Contribuição

### Reportar Bugs
1. Use as Issues do GitHub
2. Inclua steps para reproduzir
3. Adicione screenshots se necessário

### Contribuir
1. Fork do projeto
2. Feature branch (`feature/nova-funcionalidade`)
3. Commit com mensagens claras
4. Pull Request detalhado

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 🎭 Créditos

Desenvolvido com ❤️ para criar a melhor experiência de cassino virtual.

**Joker's Casino** - Onde a sorte encontra a tecnologia! 🃏✨
