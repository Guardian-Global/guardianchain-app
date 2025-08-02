import React from "react";
import { TradingBotAPI } from "@/components/trading/TradingBotAPI";

export default function TradingBotsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Trading Bot API</h1>
          <p className="text-slate-400">
            Enterprise-grade APIs for algorithmic trading and automated
            strategies
          </p>
        </div>

        <TradingBotAPI />
      </div>
    </div>
  );
}
