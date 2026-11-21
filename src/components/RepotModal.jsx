import React, { useState, useEffect } from 'react';
import { X, PlusCircle, ArrowUpRight, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function RepotModal({
  isOpen,
  onClose,
  player,
  initialBuyIn,
  currency,
  onAddFunds
}) {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Default to initial buy-in amount for quick 1-tap repot
      setAmount(String(initialBuyIn));
    }
  }, [isOpen, initialBuyIn]);

  if (!isOpen || !player) return null;

  const numericAmount = parseFloat(amount) || 0;
  const newTotal = (player.totalBuyIn || 0) + numericAmount;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (numericAmount <= 0) return;
    onAddFunds(player.id, numericAmount);
    onClose();
  };

  const presets = [
    { label: '0.5x', value: Math.round(initialBuyIn * 0.5) },
    { label: '1x Full', value: initialBuyIn },
    { label: '1.5x', value: Math.round(initialBuyIn * 1.5) },
    { label: '2x Double', value: initialBuyIn * 2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#161b26] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Add Funds / Repot</div>
            <h3 className="text-xl font-bold text-white capitalize">{player.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Current buy-in info */}
          <div className="flex items-center justify-between p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400">Current Total Buy-in:</span>
            <span className="text-base font-bold font-mono text-white">
              {formatCurrency(player.totalBuyIn, currency)}
            </span>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Enter Repot Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                {currency}
              </span>
              <input
                type="number"
                step="any"
                min="1"
                autoFocus
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border-2 border-slate-700 focus:border-emerald-500 rounded-xl text-3xl font-black text-emerald-400 outline-none transition"
              />
            </div>
          </div>

          {/* Presets */}
          <div>
            <div className="text-xs text-slate-400 mb-2 font-medium">Quick Amounts:</div>
            <div className="grid grid-cols-4 gap-2">
              {presets.map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setAmount(String(p.value))}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-bold transition ${
                    numericAmount === p.value
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div>{p.label}</div>
                  <div className="text-[11px] font-mono text-slate-400">{formatCurrency(p.value, currency)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Projection */}
          {numericAmount > 0 && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-xl flex items-center justify-between text-xs">
              <span className="text-emerald-300 flex items-center gap-1 font-medium">
                <ArrowUpRight size={14} /> New Total Buy-in:
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {formatCurrency(newTotal, currency)}
              </span>
            </div>
          )}

          {/* Big Green Add Funds Button */}
          <button
            type="submit"
            disabled={numericAmount <= 0}
            className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition active:scale-[0.99]"
          >
            <PlusCircle size={20} />
            Add Funds ({formatCurrency(numericAmount, currency)})
          </button>
        </form>
      </div>
    </div>
  );
}
