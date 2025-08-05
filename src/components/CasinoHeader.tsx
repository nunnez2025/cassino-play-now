
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import jokerChip from "@/assets/joker-chip.png";
import jokerLogo from "@/assets/joker-logo.png";

interface CasinoHeaderProps {
  balance: number;
}

const CasinoHeader = ({ balance }: CasinoHeaderProps) => {
  return (
    <header className="w-full bg-gradient-dark border-b-2 border-joker-purple p-4 neon-glow">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={jokerLogo} alt="Joker Logo" className="w-16 h-16 floating-animation" />
          <h1 className="text-4xl font-bold joker-title text-white font-joker" style={{
            textShadow: '3px 3px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 0 0 15px hsl(var(--joker-purple))',
            WebkitTextStroke: '2px hsl(var(--joker-purple))'
          }}>
            🃏 JOKER'S CASINO
          </h1>
          <span className="text-base text-white font-bold font-gothic hidden md:block" style={{
            textShadow: '2px 2px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 0 0 10px hsl(var(--joker-gold))'
          }}>
            "Where Chaos Meets Fortune"
          </span>
        </div>
        
        <Card className="bg-gradient-dark border-joker-gold border-2 p-4 shadow-gold">
          <div className="flex items-center space-x-2">
            <img src={jokerChip} alt="Joker Chips" className="w-8 h-8" />
            <span className="text-white font-bold text-xl font-gothic" style={{
              textShadow: '2px 2px 0px #000, 0 0 10px hsl(var(--joker-gold))'
            }}>
              {balance.toLocaleString()} Fichas
            </span>
          </div>
        </Card>
      </div>
    </header>
  );
};

export default CasinoHeader;
