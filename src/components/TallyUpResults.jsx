import React, { useState } from 'react';
import { ArrowLeft, Calculator, Check, AlertCircle, CheckCircle2, ChevronRight, Scale, Sparkles, HelpCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function TallyUpResults({
  currency,
  players,
  onUpdatePlayerFinalChips,
  onOpenCalculatorModal,
  onSettleUp,
  onBackToGame
}) {
  const [allowDiscrepancyOverride, setAllowDiscrepancyOverride] = useState(false);

  // Compute totals
  const totalBuyInPot = players.reduce((sum, p) => sum + (Number(p.totalBuyIn) || 0), 0);
  const totalFinalEntered = players.reduce((sum, p) => {
    return sum + (p.finalChips !== undefined && p.finalChips !== null ? Number(p.finalChips) : 0);
  }, 0);

  // Count players who have entered their results
  const enteredCount = players.filter(p => p.finalChips !== undefined && p.finalChips !== null).length;
  const allEntered = enteredCount === players.length;

  const diff = Math.round((totalFinalEntered - totalBuyInPot) * 100) / 100;
  const isBalanced = Math.abs(diff) < 0.01 && allEntered;

  const handleQuickBust = (playerId, e) => {
    e.stopPropagation();
    onUpdatePlayerFinalChips(playerId, 0);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-5 sm:py-6 pb-12 space-y-5 animate-in fade-in duration-300">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToGame}
          className="p-2 -ml-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft size={18} />
          <span>Game</span>
        </button>

        <h1 className="text-xl font-extrabold text-white text-center">
          Tally Up Results
        </h1>

        <div className="w-12 text-right text-xs font-mono font-bold text-slate-400">
          {enteredCount}/{players.length}
        </div>
      </div>

      {/* Live Balance / Pot Verification Card */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 shadow-xl ${
        isBalanced 
          ? 'bg-emerald-950/40 border-emerald-500/80 shadow-emerald-950/50' 
          : diff === 0 && !allEntered
            ? 'bg-[#141923] border-slate-800'
            : 'bg-amber-950/30 border-amber-800/80 shadow-amber-950/40'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Scale size={18} className={isBalanced ? 'text-emerald-400' : 'text-amber-400'} />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Pot Balance Check
            </span>
          </div>

          <div className="text-xs font-mono font-bold">
            {isBalanced ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 size={12} /> Balanced
              </span>
            ) : diff < 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40">
                Missing {formatCurrency(Math.abs(diff), currency)}
              </span>
            ) : diff > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                +{formatCurrency(diff, currency)} Extra
              </span>
            ) : (
              <span className="text-slate-400">Enter chips</span>
            )}
          </div>
        </div>

        {/* Comparison grid */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center font-mono">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-sans font-semibold">Total Buy-in Pot</div>
            <div className="text-lg font-black text-white">
              {formatCurrency(totalBuyInPot, currency)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-sans font-semibold">Total Chips Tallied</div>
            <div className={`text-lg font-black ${isBalanced ? 'text-emerald-400' : 'text-white'}`}>
              {formatCurrency(totalFinalEntered, currency)}
            </div>
          </div>
        </div>

        {/* Helper instruction */}
        <div className="mt-3 text-xs flex items-center gap-1.5">
          {isBalanced ? (
            <p className="text-emerald-300 font-medium flex items-center gap-1">
              <Sparkles size={14} /> Total buy-in matches chips count! You can now settle up.
            </p>
          ) : (
            <p className="text-slate-400">
              {!allEntered 
                ? `Enter final chip amounts for remaining ${players.length - enteredCount} players.`
                : diff < 0 
                  ? `Missing chips: chip counts are short by ${formatCurrency(Math.abs(diff), currency)}.`
                  : `Surplus chips: entered chips exceed total pot by ${formatCurrency(diff, currency)}.`}
            </p>
          )}
        </div>
      </div>

      {/* Player List for Final Chips Entry (matches pic 4) */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Player Cash-Outs
        </div>

        <div className="space-y-2.5">
          {players.map((p) => {
            const hasEntered = p.finalChips !== undefined && p.finalChips !== null;
            const finalVal = hasEntered ? Number(p.finalChips) : 0;
            const net = hasEntered ? Math.round((finalVal - p.totalBuyIn) * 100) / 100 : null;

            return (
              <div
                key={p.id}
                onClick={() => onOpenCalculatorModal(p)}
                className={`group cursor-pointer bg-[#141923] hover:bg-[#181f2c] border rounded-2xl p-4 transition shadow-md flex items-center justify-between ${
                  hasEntered ? 'border-slate-800' : 'border-dashed border-slate-700/80 bg-slate-900/40'
                }`}
              >
                {/* Left side: Name & Buy-in */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white capitalize group-hover:text-emerald-400 transition">
                      {p.name}
                    </h3>
                    <span className="text-xs font-mono text-slate-400">
                      (In: {formatCurrency(p.totalBuyIn, currency)})
                    </span>
                  </div>

                  {/* Subtitle / Status */}
                  <div className="mt-1 flex items-center gap-2">
                    {!hasEntered ? (
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 group-hover:text-emerald-300 transition">
                        <Calculator size={14} className="text-emerald-400" />
                        Tap to enter final chips
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black font-mono text-white">
                          {formatCurrency(finalVal, currency)}
                        </span>
                        <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                          net > 0 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' 
                            : net < 0 
                              ? 'bg-red-950 text-red-400 border border-red-800/60' 
                              : 'bg-slate-800 text-slate-400'
                        }`}>
                          {net > 0 ? `+${formatCurrency(net, currency)}` : net < 0 ? `-${formatCurrency(Math.abs(net), currency)}` : 'Break Even'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Quick actions or Chevron */}
                <div className="flex items-center gap-2">
                  {!hasEntered && (
                    <button
                      type="button"
                      onClick={(e) => handleQuickBust(p.id, e)}
                      title="Player lost all chips ($0)"
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-700 text-xs font-semibold transition"
                    >
                      Busted ($0)
                    </button>
                  )}
                  <ChevronRight size={18} className="text-slate-500 group-hover:text-white transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Discrepancy override helper for real-world table rounding */}
      {!isBalanced && allEntered && (
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold flex items-center gap-1">
              <HelpCircle size={14} /> Chips don't match exactly?
            </span>
            <button
              type="button"
              onClick={() => setAllowDiscrepancyOverride(!allowDiscrepancyOverride)}
              className="text-emerald-400 font-bold hover:underline"
            >
              {allowDiscrepancyOverride ? 'Hide Override' : 'Enable Force Settle'}
            </button>
          </div>
          {allowDiscrepancyOverride && (
            <p className="text-slate-400">
              Force Settle will proportionally absorb or account for the {formatCurrency(Math.abs(diff), currency)} discrepancy so you can finish settling.
            </p>
          )}
        </div>
      )}

      {/* Settle Up Action Button (in normal page flow so no player is obscured) */}
      <div className="pt-4 pb-20 space-y-2">
        <button
          type="button"
          disabled={!isBalanced && !allowDiscrepancyOverride}
          onClick={onSettleUp}
          className={`w-full py-4 px-6 rounded-xl font-extrabold text-base flex items-center justify-center gap-2 transition duration-200 ${
            isBalanced || allowDiscrepancyOverride
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 cursor-pointer active:scale-[0.99] poker-glow'
              : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-60'
          }`}
        >
          <CheckCircle2 size={20} />
          {isBalanced ? 'Settle Up' : allowDiscrepancyOverride ? 'Force Settle Up' : 'Settle Up (Requires Balance)'}
        </button>
        {!isBalanced && !allowDiscrepancyOverride && (
          <p className="text-[11px] text-center text-slate-400">
            Total buy-in pot must equal total final chips count to settle.
          </p>
        )}
      </div>
    </div>
  );
}
