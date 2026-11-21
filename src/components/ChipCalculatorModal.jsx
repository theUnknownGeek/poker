import React, { useState, useEffect } from 'react';
import { X, Calculator, Plus, Minus, Check, Coins } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function ChipCalculatorModal({
  isOpen,
  onClose,
  player,
  currency,
  chipConfig,
  onSave
}) {
  const [mode, setMode] = useState('direct'); // 'direct' or 'chips'
  const [directAmount, setDirectAmount] = useState('');
  const [chipCounts, setChipCounts] = useState({});

  useEffect(() => {
    if (isOpen && player) {
      // Default direct amount to current finalChips or empty
      setDirectAmount(player.finalChips !== undefined && player.finalChips !== null ? String(player.finalChips) : '');
      
      // Initialize chip counts
      const initialCounts = {};
      chipConfig.forEach(c => {
        initialCounts[c.id] = 0;
      });
      setChipCounts(initialCounts);
      setMode('direct');
    }
  }, [isOpen, player, chipConfig]);

  if (!isOpen || !player) return null;

  // Calculate chip total
  const calculatedChipTotal = chipConfig.reduce((sum, c) => {
    return sum + (Number(chipCounts[c.id]) || 0) * (Number(c.defaultValue) || 0);
  }, 0);

  const handleChipChange = (id, delta) => {
    setChipCounts(prev => {
      const current = Number(prev[id]) || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleChipInput = (id, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setChipCounts(prev => ({ ...prev, [id]: num }));
  };

  const handleSave = () => {
    const finalVal = mode === 'direct' 
      ? Math.max(0, parseFloat(directAmount) || 0)
      : calculatedChipTotal;
    
    onSave(player.id, finalVal);
    onClose();
  };

  const currentTotal = mode === 'direct' 
    ? (parseFloat(directAmount) || 0) 
    : calculatedChipTotal;

  const netPL = currentTotal - player.totalBuyIn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#161b26] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Tally Final Chips</div>
            <h3 className="text-xl font-bold text-white capitalize flex items-center gap-2">
              {player.name}
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                In: {formatCurrency(player.totalBuyIn, currency)}
              </span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switch between Direct Amount and Chip Stack Count */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800/60">
          <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800 text-sm font-medium">
            <button
              type="button"
              onClick={() => setMode('direct')}
              className={`py-2 rounded-lg flex items-center justify-center gap-2 transition ${
                mode === 'direct'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coins size={16} />
              Direct Value
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('chips');
              }}
              className={`py-2 rounded-lg flex items-center justify-center gap-2 transition ${
                mode === 'chips'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator size={16} />
              Count Chips
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {mode === 'direct' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Total Chip Value ({currency})
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                    {currency}
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    autoFocus
                    placeholder="0"
                    value={directAmount}
                    onChange={(e) => setDirectAmount(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave();
                    }}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900 border-2 border-slate-700 focus:border-emerald-500 rounded-xl text-3xl font-bold text-emerald-400 outline-none transition"
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <div className="text-xs text-slate-400 font-medium mb-2">Quick Presets:</div>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setDirectAmount('0')}
                    className="px-2 py-2 bg-slate-800/80 hover:bg-red-950/60 hover:text-red-300 hover:border-red-800 border border-slate-700/60 rounded-lg text-xs font-semibold text-slate-300 transition"
                  >
                    Bust ($0)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirectAmount(String(player.totalBuyIn))}
                    className="px-2 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded-lg text-xs font-semibold text-slate-300 transition"
                  >
                    Even ({player.totalBuyIn})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirectAmount(String(player.totalBuyIn * 1.5))}
                    className="px-2 py-2 bg-slate-800/80 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-800 border border-slate-700/60 rounded-lg text-xs font-semibold text-slate-300 transition"
                  >
                    1.5x
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirectAmount(String(player.totalBuyIn * 2))}
                    className="px-2 py-2 bg-slate-800/80 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-800 border border-slate-700/60 rounded-lg text-xs font-semibold text-slate-300 transition"
                  >
                    2x
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-slate-400">
                Count the stacks of each chip color:
              </div>
              {chipConfig.map(chip => {
                const count = chipCounts[chip.id] || 0;
                const value = count * chip.defaultValue;
                return (
                  <div
                    key={chip.id}
                    className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-800 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2"
                        style={{
                          backgroundColor: chip.color,
                          color: chip.textColor,
                          borderColor: chip.borderColor
                        }}
                      >
                        {chip.defaultValue}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{chip.name}</div>
                        <div className="text-xs text-slate-400">{currency}{chip.defaultValue} each</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleChipChange(chip.id, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition active:scale-95"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={count === 0 ? '' : count}
                        placeholder="0"
                        onChange={(e) => handleChipInput(chip.id, e.target.value)}
                        className="w-14 text-center py-1.5 bg-slate-950 border border-slate-700 rounded-lg font-bold text-white text-base focus:border-emerald-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleChipChange(chip.id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition active:scale-95"
                      >
                        <Plus size={14} />
                      </button>
                      <div className="w-16 text-right font-mono text-sm font-bold text-slate-200">
                        {currency}{value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Real-time Summary preview */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Calculated Final:</div>
              <div className="text-2xl font-black text-white font-mono">
                {formatCurrency(currentTotal, currency)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Net Outcome:</div>
              <div className={`text-base font-bold font-mono ${
                netPL > 0 ? 'text-emerald-400' : netPL < 0 ? 'text-red-400' : 'text-slate-400'
              }`}>
                {netPL > 0 ? `+${formatCurrency(netPL, currency)}` : netPL < 0 ? `-${formatCurrency(Math.abs(netPL), currency)}` : 'Break Even'}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition active:scale-[0.99]"
          >
            <Check size={18} />
            Confirm Chips
          </button>
        </div>
      </div>
    </div>
  );
}
