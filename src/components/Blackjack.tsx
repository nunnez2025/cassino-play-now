import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SUITS = ["♠️", "♥️", "♦️", "♣️"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "🃏"];

interface PlayingCard {
  suit: string;
  value: string;
}

interface BlackjackProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const Blackjack = ({ balance, onBalanceChange }: BlackjackProps) => {
  const [playerCards, setPlayerCards] = useState<PlayingCard[]>([]);
  const [dealerCards, setDealerCards] = useState<PlayingCard[]>([]);
  const [bet, setBet] = useState(20);
  const [gameState, setGameState] = useState<"betting" | "playing" | "dealer" | "finished">("betting");
  const [message, setMessage] = useState("");

  const createDeck = (): PlayingCard[] => {
    const deck: PlayingCard[] = [];
    for (const suit of SUITS) {
      for (const value of VALUES) {
        deck.push({ suit, value });
      }
    }
    return deck.sort(() => Math.random() - 0.5);
  };

  const getCardValue = (card: PlayingCard): number => {
    if (card.value === "🃏") return 15; // Joker card special value
    if (card.value === "A") return 11;
    if (["J", "Q", "K"].includes(card.value)) return 10;
    return parseInt(card.value);
  };

  const getHandValue = (cards: PlayingCard[]): number => {
    let value = 0;
    let aces = 0;

    for (const card of cards) {
      if (card.value === "🃏") {
        value += 15; // Joker always worth 15
      } else if (card.value === "A") {
        aces++;
        value += 11;
      } else if (["J", "Q", "K"].includes(card.value)) {
        value += 10;
      } else {
        value += parseInt(card.value);
      }
    }

    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return value;
  };

  const startGame = useCallback(() => {
    if (balance < bet) return;

    const deck = createDeck();
    const newPlayerCards = [deck[0], deck[2]];
    const newDealerCards = [deck[1], deck[3]];

    setPlayerCards(newPlayerCards);
    setDealerCards(newDealerCards);
    setGameState("playing");
    setMessage("");
    onBalanceChange(balance - bet);

    // Check for blackjack or joker win
    if (getHandValue(newPlayerCards) === 21) {
      setGameState("finished");
      const winAmount = Math.floor(bet * 2.5);
      onBalanceChange(balance - bet + winAmount);
      setMessage(`🃏 BLACKJACK! Você ganhou ${winAmount} fichas!`);
    } else if (newPlayerCards.some(card => card.value === "🃏")) {
      // Bonus for having a joker
      setMessage("🎭 Joker na mão! Boa sorte!");
    }
  }, [balance, bet, onBalanceChange]);

  const hit = () => {
    const newCard = {
      suit: SUITS[Math.floor(Math.random() * SUITS.length)],
      value: VALUES[Math.floor(Math.random() * VALUES.length)]
    };
    
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);

    const playerValue = getHandValue(newPlayerCards);
    if (playerValue > 21) {
      setGameState("finished");
      setMessage("Você estourou! Dealer ganhou.");
    }
  };

  const stand = () => {
    setGameState("dealer");
    let newDealerCards = [...dealerCards];

    // Dealer hits until 17 or higher
    while (getHandValue(newDealerCards) < 17) {
      const newCard = {
        suit: SUITS[Math.floor(Math.random() * SUITS.length)],
        value: VALUES[Math.floor(Math.random() * VALUES.length)]
      };
      newDealerCards.push(newCard);
    }

    setDealerCards(newDealerCards);

    const playerValue = getHandValue(playerCards);
    const dealerValue = getHandValue(newDealerCards);

    if (dealerValue > 21) {
      const winAmount = bet * 2;
      onBalanceChange(balance + winAmount);
      setMessage(`Dealer estourou! Você ganhou ${winAmount} fichas!`);
    } else if (dealerValue > playerValue) {
      setMessage("Dealer ganhou!");
    } else if (playerValue > dealerValue) {
      const winAmount = bet * 2;
      onBalanceChange(balance + winAmount);
      setMessage(`Você ganhou ${winAmount} fichas!`);
    } else {
      onBalanceChange(balance + bet);
      setMessage("Empate! Aposta devolvida.");
    }

    setGameState("finished");
  };

  const renderCard = (card: PlayingCard, hidden = false) => {
    if (hidden) {
      return (
        <div className="w-20 h-28 bg-gradient-purple rounded-xl border-2 border-joker-gold flex items-center justify-center shadow-neon">
          <span className="text-joker-gold text-2xl font-joker">🎭</span>
        </div>
      );
    }

    const isRed = card.suit === "♥️" || card.suit === "♦️";
    const isJoker = card.value === "🃏";
    
    return (
      <div className={`w-20 h-28 rounded-xl border-2 flex flex-col items-center justify-center shadow-lg ${
        isJoker ? "bg-gradient-joker border-joker-gold" : "bg-white border-joker-purple"
      }`}>
        <span className={`text-sm font-bold ${
          isJoker ? "text-white font-horror" : isRed ? "text-red-600" : "text-black"
        }`}>
          {card.value}
        </span>
        <span className="text-lg">{isJoker ? "🎭" : card.suit}</span>
      </div>
    );
  };

  return (
    <Card className="bg-gradient-dark border-joker-purple casino-glow">
      <CardHeader>
        <CardTitle className="text-center text-joker-purple text-2xl font-joker neon-text">
          🃏 JOKER'S BLACKJACK
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {gameState === "betting" && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 justify-center">
              <label className="text-joker-gold font-bold font-gothic">Aposta:</label>
              <Input
                type="number"
                value={bet}
                onChange={(e) => setBet(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={balance}
                className="w-24 text-center bg-joker-dark border-joker-purple text-joker-gold font-gothic"
              />
              <span className="text-joker-gold font-gothic">fichas</span>
            </div>
            <Button
              variant="joker"
              size="lg"
              onClick={startGame}
              disabled={balance < bet}
              className="w-full"
            >
              🎭 INICIAR JOGO
            </Button>
          </div>
        )}

        {gameState !== "betting" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-joker-gold font-bold mb-2 font-gothic">
                🎭 Dealer ({gameState === "playing" ? "?" : getHandValue(dealerCards)})
              </h3>
              <div className="flex space-x-2">
                {dealerCards.map((card, index) => (
                  <div key={index}>
                    {renderCard(card, gameState === "playing" && index === 1)}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-joker-gold font-bold mb-2 font-gothic">
                🃏 Você ({getHandValue(playerCards)})
              </h3>
              <div className="flex space-x-2">
                {playerCards.map((card, index) => (
                  <div key={index}>{renderCard(card)}</div>
                ))}
              </div>
            </div>

            {gameState === "playing" && (
              <div className="flex space-x-4 justify-center">
                <Button variant="bet" onClick={hit} className="font-gothic">
                  🎪 PEDIR CARTA
                </Button>
                <Button variant="joker" onClick={stand} className="font-gothic">
                  🎭 PARAR
                </Button>
              </div>
            )}

            {gameState === "finished" && (
              <div className="space-y-4">
                <p className="text-center text-xl font-bold text-joker-gold font-horror">
                  {message}
                </p>
                <Button
                  variant="joker"
                  onClick={() => {
                    setGameState("betting");
                    setPlayerCards([]);
                    setDealerCards([]);
                    setMessage("");
                  }}
                  className="w-full font-gothic"
                >
                  🎭 JOGAR NOVAMENTE
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Blackjack;