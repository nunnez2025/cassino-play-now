import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import chipIcon from "@/assets/chip-icon.png";

interface CasinoHeaderProps {
  balance: number;
}

const CasinoHeader = ({ balance }: CasinoHeaderProps) => {
  return (
    <header className="w-full bg-gradient-casino border-b-2 border-casino-gold p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={chipIcon} alt="Casino Chip" className="w-12 h-12" />
          <h1 className="text-3xl font-bold neon-text">🎰 CASSINO REAL</h1>
        </div>
        
        <Card className="bg-casino-dark border-casino-gold p-4">
          <div className="flex items-center space-x-2">
            <img src={chipIcon} alt="Chips" className="w-6 h-6" />
            <span className="text-casino-gold font-bold text-xl">
              {balance.toLocaleString()} Fichas
            </span>
          </div>
        </Card>
      </div>
    </header>
  );
};

export default CasinoHeader;