
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface JokerHackerProps {
  onBack: () => void;
}

const JokerHacker = ({ onBack }: JokerHackerProps) => {
  return (
    <Card className="bg-casino-dark border-casino-gold casino-glow p-0 overflow-hidden">
      <div className="relative">
        <Button 
          onClick={onBack}
          variant="casino"
          className="absolute top-4 right-4 z-50"
        >
          ← Voltar
        </Button>
        
        <div className="w-full h-full min-h-[600px]">
          <iframe
            srcDoc={`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>JOKER HACKER - TESTE DE INVASÃO</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --joker-purple: #800080;
            --joker-green: #00ff00;
            --joker-red: #ff0000;
            --joker-yellow: #ffff00;
            --dark-bg: #0a000a;
            --darker-bg: #000000;
            --terminal-text: #00ff00;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            font-family: 'Courier New', monospace;
            background: var(--darker-bg);
            color: var(--terminal-text);
            line-height: 1.6;
            overflow-x: hidden;
            position: relative;
            min-height: 100vh;
            touch-action: manipulation;
        }

        /* Background Image */
        .background-image {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background-image: url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDP3a3FZ9Y7etXMr5j-2vnvlLzl0cxt1oFsfQHA5ABaAEWNVmyRMjzVCURe8aABCM1u5UPoZtRDWJl8plppsr5HjB7rjTZ1CcalHbDOVxBmNArSPSvw8b087k66vjBqJoYktoH-ea37eNF7qSvD6fVcz32TIQNhoFzvztRz9_BB80e0SqWN0vLr7_XEx83/s1600/IMG_3715.jpeg');
            background-size: cover;
            background-position: center;
            opacity: 0.3;
        }

        /* Header */
        .header {
            background: rgba(40, 0, 40, 0.9);
            border-bottom: 2px solid var(--joker-purple);
            padding: 0.8rem 0;
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(5px);
            text-align: center;
        }

        .logo {
            font-family: 'Courier New', monospace;
            font-size: 1.5rem;
            font-weight: 900;
            color: var(--joker-purple);
            text-shadow: 0 0 10px var(--joker-purple);
            animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
            from { text-shadow: 0 0 10px var(--joker-purple); }
            to { text-shadow: 0 0 20px var(--joker-purple), 0 0 30px var(--joker-purple); }
        }

        /* HUD */
        .hud {
            display: flex;
            justify-content: space-between;
            background: rgba(40, 0, 40, 0.8);
            border: 1px solid var(--joker-purple);
            border-radius: 8px;
            padding: 0.6rem;
            margin: 0.8rem;
            font-size: 0.8rem;
            flex-wrap: wrap;
        }

        .hud-item {
            display: flex;
            align-items: center;
            gap: 0.3rem;
        }

        /* Main Content */
        .main-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0.8rem;
        }

        /* Sections */
        .section {
            display: none;
            animation: fadeIn 0.5s ease;
        }

        .section.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Menu */
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }

        .menu-item {
            background: rgba(40, 0, 40, 0.8);
            border: 2px solid var(--joker-purple);
            border-radius: 10px;
            padding: 1.5rem 1rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .menu-item:hover, .menu-item:active {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(128, 0, 128, 0.4);
            border-color: var(--joker-green);
        }

        .menu-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(128, 0, 128, 0.2), transparent);
            transition: 0.5s;
        }

        .menu-item:hover::before {
            left: 100%;
        }

        .menu-icon {
            font-size: 2rem;
            margin-bottom: 0.8rem;
            color: var(--joker-purple);
        }

        .menu-title {
            font-size: 1.2rem;
            color: var(--joker-green);
            margin-bottom: 0.3rem;
        }

        /* Game Board */
        .game-board {
            background: rgba(20, 0, 20, 0.9);
            border: 2px solid var(--joker-purple);
            border-radius: 10px;
            padding: 1.5rem;
            margin-top: 1rem;
            min-height: 400px;
        }

        .game-header {
            text-align: center;
            font-size: 1.5rem;
            color: var(--joker-purple);
            margin-bottom: 1rem;
        }

        /* Invasao Game */
        .invasao-game {
            text-align: center;
        }

        .sequence-display {
            font-size: 3rem;
            margin: 2rem 0;
            min-height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .sequence-item {
            width: 70px;
            height: 70px;
            border: 2px solid var(--joker-green);
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(0, 20, 0, 0.5);
            transition: all 0.2s ease;
        }

        .sequence-item.active {
            background: var(--joker-green);
            color: #000;
            transform: scale(1.1);
        }

        .user-input {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem 0;
            flex-wrap: wrap;
        }

        .input-btn {
            width: 60px;
            height: 60px;
            border: 2px solid var(--joker-purple);
            border-radius: 10px;
            background: rgba(40, 0, 40, 0.8);
            color: var(--joker-purple);
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .input-btn:active {
            background: var(--joker-purple);
            color: #fff;
            transform: scale(0.95);
        }

        .game-status {
            font-size: 1.2rem;
            margin: 1rem 0;
            min-height: 30px;
        }

        .level-indicator {
            font-size: 1rem;
            color: var(--joker-yellow);
            margin-bottom: 1rem;
        }

        /* Buttons */
        .btn {
            background: linear-gradient(45deg, var(--joker-purple), #4b0082);
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 5px;
            cursor: pointer;
            font-family: inherit;
            font-weight: bold;
            transition: all 0.3s ease;
            margin: 0.5rem;
            font-size: 1rem;
        }

        .btn:active {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(128, 0, 128, 0.4);
        }

        .btn-primary {
            background: linear-gradient(45deg, var(--joker-green), #00cc00);
            color: #000;
        }

        .btn-danger {
            background: linear-gradient(45deg, var(--joker-red), #cc0000);
        }

        /* Progress Bar */
        .progress-container {
            background: rgba(0, 20, 0, 0.5);
            border-radius: 10px;
            overflow: hidden;
            height: 20px;
            margin: 1rem 0;
            border: 1px solid var(--joker-green);
        }

        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--joker-green), var(--joker-yellow));
            width: 0%;
            transition: width 0.5s ease;
        }

        /* Notification */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            background: rgba(40, 0, 40, 0.9);
            border: 1px solid var(--joker-purple);
            border-radius: 5px;
            color: var(--joker-green);
            z-index: 1000;
            transform: translateX(200%);
            transition: transform 0.3s ease;
        }

        .notification.show {
            transform: translateX(0);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .menu-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .hud {
                flex-direction: column;
                gap: 0.3rem;
                padding: 0.4rem;
            }
            
            .logo {
                font-size: 1.2rem;
            }
            
            .menu-item {
                padding: 1rem;
            }
            
            .sequence-item {
                width: 50px;
                height: 50px;
                font-size: 2rem;
            }
            
            .input-btn {
                width: 50px;
                height: 50px;
                font-size: 1.2rem;
            }
        }

        @media (max-width: 480px) {
            .menu-grid {
                grid-template-columns: 1fr;
            }
            
            .sequence-item {
                width: 40px;
                height: 40px;
                font-size: 1.5rem;
            }
            
            .input-btn {
                width: 45px;
                height: 45px;
                font-size: 1.1rem;
            }
            
            .game-header {
                font-size: 1.2rem;
            }
        }
    </style>
</head>
<body>
    <div class="background-image"></div>

    <header class="header">
        <div class="logo">JOKER HACKER - TESTE DE INVASÃO</div>
    </header>

    <div class="hud">
        <div class="hud-item">
            <i class="fas fa-user-secret"></i>
            <span>Reputação: <span id="reputation">100</span></span>
        </div>
        <div class="hud-item">
            <i class="fas fa-coins"></i>
            <span>Bits: <span id="bits">500</span></span>
        </div>
        <div class="hud-item">
            <i class="fas fa-microchip"></i>
            <span>Nível: <span id="level">1</span></span>
        </div>
        <div class="hud-item">
            <i class="fas fa-battery-three-quarters"></i>
            <span>Energia:</span>
            <div class="progress-container" style="width: 80px;">
                <div class="progress-bar" id="energy-bar" style="width: 80%;"></div>
            </div>
        </div>
    </div>

    <div class="main-content">
        <div id="menu-section" class="section active">
            <div class="menu-grid">
                <div class="menu-item" onclick="showSection('invasao')">
                    <div class="menu-icon"><i class="fas fa-brain"></i></div>
                    <div class="menu-title">TESTE DE INVASÃO</div>
                    <div>Protocolo Mental</div>
                </div>
                <div class="menu-item" onclick="showSection('missions')">
                    <div class="menu-icon"><i class="fas fa-bullseye"></i></div>
                    <div class="menu-title">MISSÕES</div>
                    <div>Invasões</div>
                </div>
                <div class="menu-item" onclick="showSection('shop')">
                    <div class="menu-icon"><i class="fas fa-shopping-cart"></i></div>
                    <div class="menu-title">LOJA</div>
                    <div>Upgrades</div>
                </div>
                <div class="menu-item" onclick="showSection('profile')">
                    <div class="menu-icon"><i class="fas fa-user"></i></div>
                    <div class="menu-title">PERFIL</div>
                    <div>Status</div>
                </div>
            </div>
        </div>

        <div id="invasao-section" class="section">
            <div class="game-board">
                <div class="game-header">TESTE DE INVASÃO - PROTOCOLO MENTAL</div>
                <div class="invasao-game">
                    <div class="level-indicator">Nível: <span id="invasao-level">1</span> | Sequência: <span id="sequence-length">3</span> símbolos</div>
                    
                    <div class="sequence-display" id="sequence-display">
                        <div class="sequence-item">?</div>
                        <div class="sequence-item">?</div>
                        <div class="sequence-item">?</div>
                    </div>
                    
                    <div class="game-status" id="game-status">Toque em INICIAR para começar</div>
                    
                    <div class="user-input">
                        <button class="input-btn" onclick="selectSymbol('▲')">▲</button>
                        <button class="input-btn" onclick="selectSymbol('●')">●</button>
                        <button class="input-btn" onclick="selectSymbol('■')">■</button>
                        <button class="input-btn" onclick="selectSymbol('♦')">♦</button>
                    </div>
                    
                    <button class="btn btn-primary" onclick="startInvasao()" id="start-invasao-btn">
                        <i class="fas fa-play"></i> INICIAR
                    </button>
                    <button class="btn" onclick="resetInvasao()">
                        <i class="fas fa-redo"></i> REINICIAR
                    </button>
                </div>
            </div>
        </div>

        <div id="missions-section" class="section">
            <div class="game-board">
                <div class="game-header">MISSÕES DE INVASÃO</div>
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-lock" style="font-size: 3rem; color: var(--joker-purple); margin-bottom: 1rem;"></i>
                    <p>Complete o teste de invasão para desbloquear missões!</p>
                    <button class="btn" onclick="showSection('invasao')">
                        <i class="fas fa-brain"></i> IR PARA TESTE
                    </button>
                </div>
            </div>
        </div>

        <div id="shop-section" class="section">
            <div class="game-board">
                <div class="game-header">LOJA DE UPGRADES</div>
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-store" style="font-size: 3rem; color: var(--joker-purple); margin-bottom: 1rem;"></i>
                    <p>Ganhe bits completando missões e testes!</p>
                    <button class="btn" onclick="showSection('invasao')">
                        <i class="fas fa-brain"></i> FAZER TESTE
                    </button>
                </div>
            </div>
        </div>

        <div id="profile-section" class="section">
            <div class="game-board">
                <div class="game-header">PERFIL DO CORINGA</div>
                <div style="display: flex; flex-wrap: wrap; gap: 1.5rem;">
                    <div style="flex: 1; min-width: 250px;">
                        <h3 style="color: var(--joker-purple); margin-bottom: 1rem;">HABILIDADES</h3>
                        <div style="margin-bottom: 1rem;">
                            <div>Velocidade: <span id="speed-level">1</span>/10</div>
                            <div class="progress-container">
                                <div class="progress-bar" id="speed-bar" style="width: 10%;"></div>
                            </div>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <div>Lógica: <span id="logic-level">1</span>/10</div>
                            <div class="progress-container">
                                <div class="progress-bar" id="logic-bar" style="width: 10%;"></div>
                            </div>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <div>Memória: <span id="memory-level">1</span>/10</div>
                            <div class="progress-container">
                                <div class="progress-bar" id="memory-bar" style="width: 10%;"></div>
                            </div>
                        </div>
                    </div>
                    <div style="flex: 1; min-width: 250px;">
                        <h3 style="color: var(--joker-purple); margin-bottom: 1rem;">CONQUISTAS</h3>
                        <div id="achievements">
                            <div style="padding: 0.5rem; border-bottom: 1px solid var(--joker-purple);">
                                <i class="fas fa-trophy"></i> Primeiro Teste
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="notification" class="notification"></div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            initializeGame();
        });

        const gameState = {
            reputation: 100,
            bits: 500,
            level: 1,
            energy: 80,
            skills: {
                speed: 1,
                logic: 1,
                memory: 1
            },
            invasao: {
                level: 1,
                sequenceLength: 3,
                currentSequence: [],
                userSequence: [],
                showingSequence: false,
                activeIndex: -1
            }
        };

        function initializeGame() {
            updateHUD();
            showNotification("Bem-vindo ao teste de invasão, Coringa!", "success");
        }

        function updateHUD() {
            document.getElementById('reputation').textContent = gameState.reputation;
            document.getElementById('bits').textContent = gameState.bits;
            document.getElementById('level').textContent = gameState.level;
            document.getElementById('energy-bar').style.width = gameState.energy + '%';
            
            document.getElementById('speed-bar').style.width = (gameState.skills.speed * 10) + '%';
            document.getElementById('logic-bar').style.width = (gameState.skills.logic * 10) + '%';
            document.getElementById('memory-bar').style.width = (gameState.skills.memory * 10) + '%';
            
            document.getElementById('speed-level').textContent = gameState.skills.speed;
            document.getElementById('logic-level').textContent = gameState.skills.logic;
            document.getElementById('memory-level').textContent = gameState.skills.memory;
        }

        function showSection(sectionId) {
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            document.getElementById(sectionId + '-section').classList.add('active');
            
            updateHUD();
        }

        function startInvasao() {
            if (gameState.invasao.showingSequence) return;
            
            document.getElementById('start-invasao-btn').disabled = true;
            document.getElementById('game-status').textContent = "Memorize o protocolo de invasão...";
            
            gameState.invasao.currentSequence = [];
            const symbols = ['▲', '●', '■', '♦'];
            
            for (let i = 0; i < gameState.invasao.sequenceLength; i++) {
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                gameState.invasao.currentSequence.push(randomSymbol);
            }
            
            showSequence();
        }

        function showSequence() {
            gameState.invasao.showingSequence = true;
            gameState.invasao.userSequence = [];
            const display = document.getElementById('sequence-display');
            
            display.innerHTML = '';
            
            gameState.invasao.currentSequence.forEach((symbol, index) => {
                const item = document.createElement('div');
                item.className = 'sequence-item';
                item.textContent = '?';
                item.id = 'seq-item-' + index;
                display.appendChild(item);
            });
            
            let i = 0;
            const showInterval = setInterval(() => {
                if (i < gameState.invasao.currentSequence.length) {
                    const item = document.getElementById('seq-item-' + i);
                    item.textContent = gameState.invasao.currentSequence[i];
                    item.classList.add('active');
                    
                    setTimeout(() => {
                        item.classList.remove('active');
                        i++;
                    }, 500);
                } else {
                    clearInterval(showInterval);
                    setTimeout(() => {
                        const items = display.querySelectorAll('.sequence-item');
                        items.forEach(item => {
                            item.textContent = '?';
                        });
                        
                        gameState.invasao.showingSequence = false;
                        document.getElementById('game-status').textContent = "Repita o protocolo tocando nos símbolos";
                        document.getElementById('start-invasao-btn').disabled = false;
                    }, 1000);
                }
            }, 1000);
        }

        function selectSymbol(symbol) {
            if (gameState.invasao.showingSequence) return;
            if (gameState.invasao.userSequence.length >= gameState.invasao.currentSequence.length) return;
            
            gameState.invasao.userSequence.push(symbol);
            
            const currentIndex = gameState.invasao.userSequence.length - 1;
            if (currentIndex < gameState.invasao.sequenceLength) {
                const item = document.getElementById('seq-item-' + currentIndex);
                if (item) {
                    item.textContent = symbol;
                    item.classList.add('active');
                    setTimeout(() => {
                        item.classList.remove('active');
                    }, 300);
                }
            }
            
            if (gameState.invasao.userSequence.length === gameState.invasao.currentSequence.length) {
                checkSequence();
            }
        }

        function checkSequence() {
            const isCorrect = JSON.stringify(gameState.invasao.userSequence) === 
                             JSON.stringify(gameState.invasao.currentSequence);
            
            if (isCorrect) {
                document.getElementById('game-status').textContent = "Protocolo executado com sucesso!";
                gameState.invasao.level++;
                gameState.invasao.sequenceLength = Math.min(gameState.invasao.level + 2, 5);
                gameState.bits += gameState.invasao.level * 10;
                gameState.reputation += 5;
                updateHUD();
                showNotification('Nível ' + gameState.invasao.level + ' completo! +' + (gameState.invasao.level * 10) + ' bits', "success");
            } else {
                document.getElementById('game-status').textContent = "Falha no protocolo! Tente novamente.";
                showNotification("Sequência incorreta! Tente novamente.", "error");
            }
            
            document.getElementById('invasao-level').textContent = gameState.invasao.level;
            document.getElementById('sequence-length').textContent = gameState.invasao.sequenceLength;
        }

        function resetInvasao() {
            gameState.invasao.level = 1;
            gameState.invasao.sequenceLength = 3;
            gameState.invasao.currentSequence = [];
            gameState.invasao.userSequence = [];
            gameState.invasao.showingSequence = false;
            
            document.getElementById('sequence-display').innerHTML = '<div class="sequence-item">?</div><div class="sequence-item">?</div><div class="sequence-item">?</div>';
            
            document.getElementById('game-status').textContent = "Toque em INICIAR para começar";
            document.getElementById('invasao-level').textContent = gameState.invasao.level;
            document.getElementById('sequence-length').textContent = gameState.invasao.sequenceLength;
            document.getElementById('start-invasao-btn').disabled = false;
            
            showNotification("Teste reiniciado", "info");
        }

        function showNotification(message, type) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = 'notification show';
            
            if (type === 'success') {
                notification.style.borderColor = '#00ff00';
                notification.style.color = '#00ff00';
            } else if (type === 'error') {
                notification.style.borderColor = '#ff0000';
                notification.style.color = '#ff0000';
            } else {
                notification.style.borderColor = '#800080';
                notification.style.color = '#800080';
            }
            
            setTimeout(() => {
                notification.className = 'notification';
            }, 3000);
        }
    </script>
</body>
</html>`}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          />
        </div>
      </div>
    </Card>
  );
};

export default JokerHacker;
