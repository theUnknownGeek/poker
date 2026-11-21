import React from 'react';
import { RotateCcw } from 'lucide-react';

export function Header({
  step,
  currency,
  onCurrencyChange,
  onResetGame
}) {
  const stepLabels = {
    setup: '1. Setup Game',
    progress: '2. In Progress',
    tally: '3. Tally Final Chips',
    settle: '4. Settle Up'
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0c0f17]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 sm:px-6">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-950 font-bold text-lg select-none">
            ♠
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-base">Poker Ledger</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                Home Game
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {stepLabels[step] || 'Game'}
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Switcher */}
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            disabled={step !== 'setup'}
            title="Select Currency"
            className="bg-slate-900 border border-slate-700 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="$">$ (USD)</option>
            <option value="₹">₹ (INR)</option>
            <option value="€">€ (EUR)</option>
            <option value="£">£ (GBP)</option>
            <option value="C$">C$ (CAD)</option>
            <option value="A$">A$ (AUD)</option>
          </select>

          {/* Reset button if in game */}
          {step !== 'setup' && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to quit the current game? Current game data will be cleared.')) {
                  onResetGame();
                }
              }}
              title="Reset Game"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950/50 hover:text-red-400 text-slate-400 border border-slate-800 hover:border-red-900/50 transition"
            >
              <RotateCcw size={15} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

