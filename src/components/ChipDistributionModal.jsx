import React, { useState } from 'react';
import { X, Layers, Settings2, RotateCcw, Check } from 'lucide-react';
import { calculateSuggestedDistribution, DEFAULT_CHIP_COLORS } from '../utils/chipDistribution';
import { formatCurrency } from '../utils/formatters';

export function ChipDistributionModal({
  isOpen,
  onClose,
  buyIn,
  currency,
  chipConfig,
  onUpdateChipConfig
}) {
  const [isEditingValues, setIsEditingValues] = useState(false);
  const [tempConfig, setTempConfig] = useState(chipConfig);

  if (!isOpen) return null;

  const { distribution, totalValue } = calculateSuggestedDistribution(buyIn, chipConfig);

  const handleValueChange = (id, val) => {
    const num = Math.max(1, parseFloat(val) || 1);
    setTempConfig(prev => prev.map(c => c.id === id ? { ...c, defaultValue: num } : c));
  };

  const handleSaveConfig = () => {
    onUpdateChipConfig(tempConfig);
    setIsEditingValues(false);
  };

  const handleResetDefault = () => {
    setTempConfig(DEFAULT_CHIP_COLORS);
    onUpdateChipConfig(DEFAULT_CHIP_COLORS);
    setIsEditingValues(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#161b26] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Suggested Chip Distribution</h3>
              <p className="text-xs text-slate-400">For {formatCurrency(buyIn, currency)} buy-in stack per player</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isEditingValues ? 'Edit Chip Values' : 'Chips per player'}
            </span>
            <button
              type="button"
              onClick={() => {
                if (isEditingValues) {
                  handleSaveConfig();
                } else {
                  setTempConfig(chipConfig);
                  setIsEditingValues(true);
                }
              }}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Settings2 size={13} />
              {isEditingValues ? 'Done Editing' : 'Customize Values'}
            </button>
          </div>

          <div className="space-y-2.5">
            {chipConfig.map(chip => {
              const count = distribution[chip.id] || 0;
              const subtotal = count * chip.defaultValue;

              return (
                <div
                  key={chip.id}
                  className="flex items-center justify-between p-3.5 bg-slate-900/70 border border-slate-800/80 rounded-xl hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2"
                      style={{
                        backgroundColor: chip.color,
                        color: chip.textColor,
                        borderColor: chip.borderColor
                      }}
                    >
                      {chip.defaultValue}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{chip.name} Chip</div>
                      {isEditingValues ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs text-slate-400">{currency}</span>
                          <input
                            type="number"
                            min="0.1"
                            step="any"
                            value={tempConfig.find(c => c.id === chip.id)?.defaultValue || chip.defaultValue}
                            onChange={(e) => handleValueChange(chip.id, e.target.value)}
                            className="w-20 px-2 py-0.5 bg-slate-950 border border-slate-700 rounded text-xs font-mono font-bold text-emerald-400 outline-none"
                          />
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400">Value: {currency}{chip.defaultValue}</div>
                      )}
                    </div>
                  </div>

                  {!isEditingValues && (
                    <div className="text-right">
                      <div className="text-base font-bold text-white font-mono">
                        {count} <span className="text-xs font-normal text-slate-400">chips</span>
                      </div>
                      <div className="text-xs font-mono text-emerald-400/90 font-medium">
                        = {formatCurrency(subtotal, currency)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Verification check */}
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Stack Value:</span>
            <div className="text-right">
              <span className={`text-base font-bold font-mono ${totalValue === buyIn ? 'text-emerald-400' : 'text-amber-400'}`}>
                {formatCurrency(totalValue, currency)}
              </span>
              {totalValue !== buyIn && (
                <div className="text-[10px] text-amber-400">
                  (Difference of {formatCurrency(Math.abs(buyIn - totalValue), currency)} from target buy-in)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex items-center gap-3">
          {isEditingValues && (
            <button
              type="button"
              onClick={handleResetDefault}
              className="py-2.5 px-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={isEditingValues ? handleSaveConfig : onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition"
          >
            <Check size={18} />
            {isEditingValues ? 'Save Values' : 'Got It'}
          </button>
        </div>
      </div>
    </div>
  );
}
