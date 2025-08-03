import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SUITS = ["♠️", "♥️", "♦️", "♣️"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

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
    if (card.value === "A") return 11;
    if (["J", "Q", "K"].includes(card.value)) return 10;
    return parseInt(card.value);
  };

  const getHandValue = (cards: PlayingCard[]): number => {
    let value = 0;
    let aces = 0;

    for (const card of cards) {
      if (card.value === "A") {
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

    // Check for blackjack
    if (getHandValue(newPlayerCards) === 21) {
      setGameState("finished");
      const winAmount = Math.floor(bet * 2.5);
      onBalanceChange(balance - bet + winAmount);
      setMessage(`BLACKJACK! Você ganhou ${winAmount} fichas!`);
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
        <div className="w-16 h-24 bg-casino-red rounded-lg border-2 border-casino-gold flex items-center justify-center">
          <span className="text-white text-xl">?</span>
        </div>
      );
    }

    const isRed = card.suit === "♥️" || card.suit === "♦️";
    return (
      <div className="w-16 h-24 bg-white rounded-lg border-2 border-casino-gold flex flex-col items-center justify-center">
        <span className={`text-sm font-bold ${isRed ? "text-red-600" : "text-black"}`}>
          {card.value}
        </span>
        <span className="text-lg">{card.suit}</span>
      </div>
    );
  };

  return (
    <Card className="bg-casino-dark border-casino-gold casino-glow">
      <CardHeader>
        <CardTitle className="text-center text-casino-gold text-2xl">
          🃏 BLACKJACK
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {gameState === "betting" && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 justify-center">
              <label className="text-casino-gold font-bold">Aposta:</label>
              <Input
                type="number"
                value={bet}
                onChange={(e) => setBet(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={balance}
                className="w-24 text-center bg-casino-black border-casino-gold text-casino-gold"
              />
              <span className="text-casino-gold">fichas</span>
            </div>
            <Button
              variant="casino"
              size="lg"
              onClick={startGame}
              disabled={balance < bet}
              className="w-full"
            >
              INICIAR JOGO
            </Button>
          </div>
        )}

        {gameState !== "betting" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-casino-gold font-bold mb-2">
                Dealer ({gameState === "playing" ? "?" : getHandValue(dealerCards)})
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
              <h3 className="text-casino-gold font-bold mb-2">
                Você ({getHandValue(playerCards)})
              </h3>
              <div className="flex space-x-2">
                {playerCards.map((card, index) => (
                  <div key={index}>{renderCard(card)}</div>
                ))}
              </div>
            </div>

            {gameState === "playing" && (
              <div className="flex space-x-4 justify-center">
                <Button variant="bet" onClick={hit}>
                  PEDIR CARTA
                </Button>
                <Button variant="casino" onClick={stand}>
                  PARAR
                </Button>
              </div>
            )}

            {gameState === "finished" && (
              <div className="space-y-4">
                <p className="text-center text-xl font-bold text-casino-gold">
                  {message}
                </p>
                <Button
                  variant="casino"
                  onClick={() => {
                    setGameState("betting");
                    setPlayerCards([]);
                    setDealerCards([]);
                    setMessage("");
                  }}
                  className="w-full"
                >
                  JOGAR NOVAMENTE
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