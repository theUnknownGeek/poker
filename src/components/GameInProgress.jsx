import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, MoreVertical, Plus, UserPlus, History, DollarSign, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function GameInProgress({
  initialBuyIn,
  currency,
  chipConfig,
  players,
  history,
  onOpenRepotModal,
  onFinishGame,
  onBackToSetup,
  onAddLatePlayer
}) {
  const [showLatePlayerInput, setShowLatePlayerInput] = useState(false);
  const [latePlayerName, setLatePlayerName] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // Total Pot
  const totalPot = players.reduce((sum, p) => sum + (Number(p.totalBuyIn) || 0), 0);
  const totalRepotsCount = players.reduce((sum, p) => sum + (p.repots ? p.repots.length : 0), 0);

  const handleAddLate = (e) => {
    e?.preventDefault();
    const trimmed = latePlayerName.trim();
    if (!trimmed) return;
    onAddLatePlayer(trimmed);
    setLatePlayerName('');
    setShowLatePlayerInput(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-5 sm:py-6 pb-12 space-y-5 animate-in fade-in duration-300">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToSetup}
          className="p-2 -ml-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft size={18} />
          <span>Setup</span>
        </button>

        <h1 className="text-xl font-extrabold text-white text-center">
          Game in Progress
        </h1>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition ${
            showHistory 
              ? 'bg-emerald-950/80 border-emerald-600 text-emerald-400' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Toggle Repot Audit History"
        >
          <History size={16} />
        </button>
      </div>

      {/* Subheader / Table Info */}
      <div className="bg-[#141923] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Initial Buy-in: <span className="text-white font-mono font-bold text-sm">{formatCurrency(initialBuyIn, currency)}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Pot: </span>
            <span className="text-lg font-black font-mono text-emerald-400">
              {formatCurrency(totalPot, currency)}
            </span>
          </div>
        </div>

        {/* Chip Denomination Ribbon (like reference pic 2) */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-semibold mb-2">Chip Values:</div>
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
            {chipConfig.map(chip => (
              <div key={chip.id} className="flex items-center gap-1.5 flex-shrink-0 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800">
                <div
                  className="w-4 h-4 rounded-full border shadow-sm"
                  style={{
                    backgroundColor: chip.color,
                    borderColor: chip.borderColor
                  }}
                />
                <span className="text-[11px] font-mono font-bold text-slate-200">
                  {currency}{chip.defaultValue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Repot Activity History (Expandable) */}
      {showHistory && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Repot / Add Funds Log</span>
            <span className="text-slate-500 font-normal">{history.length} transactions</span>
          </div>
          {history.length === 0 ? (
            <div className="text-xs text-slate-500 py-2 text-center">No repots yet this game.</div>
          ) : (
            <div className="max-h-40 overflow-y-auto space-y-1.5 text-xs font-mono">
              {history.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                  <span className="text-slate-300 capitalize">
                    <strong className="text-white">{item.playerName}</strong> +{formatCurrency(item.amount, currency)}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Players List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Players ({players.length})
          </span>
          <button
            type="button"
            onClick={() => setShowLatePlayerInput(!showLatePlayerInput)}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <UserPlus size={13} />
            Add Late Player
          </button>
        </div>

        {/* Add Late Player Form */}
        {showLatePlayerInput && (
          <form onSubmit={handleAddLate} className="flex gap-2 p-3 bg-slate-900 border border-emerald-900/50 rounded-xl animate-in fade-in duration-150">
            <input
              type="text"
              autoFocus
              placeholder="Late player name..."
              value={latePlayerName}
              onChange={(e) => setLatePlayerName(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!latePlayerName.trim()}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold"
            >
              Add ({formatCurrency(initialBuyIn, currency)})
            </button>
          </form>
        )}

        {/* Player Cards (matching reference pic 2 & 3) */}
        <div className="space-y-2.5">
          {players.map((p) => {
            const hasRepots = p.repots && p.repots.length > 0;
            const repotTotal = hasRepots ? p.repots.reduce((s, r) => s + r.amount, 0) : 0;

            return (
              <div
                key={p.id}
                className="group relative bg-[#141923] hover:bg-[#181f2c] border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition shadow-md flex items-center justify-between"
              >
                {/* Player details */}
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onOpenRepotModal(p)}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white capitalize group-hover:text-emerald-400 transition">
                      {p.name}
                    </h3>
                    {hasRepots && (
                      <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                        {p.repots.length} {p.repots.length === 1 ? 'repot' : 'repots'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-black font-mono text-white">
                      {formatCurrency(p.totalBuyIn, currency)}
                    </span>
                    {hasRepots && (
                      <span className="text-xs text-slate-400 font-mono">
                        (Initial: {formatCurrency(initialBuyIn, currency)} + {formatCurrency(repotTotal, currency)})
                      </span>
                    )}
                  </div>
                </div>

                {/* Repot / 3-dots action button */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onOpenRepotModal(p)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-emerald-950/80 hover:text-emerald-300 hover:border-emerald-700/80 border border-slate-700/70 text-slate-200 text-xs font-bold transition active:scale-95"
                  >
                    <Plus size={14} className="text-emerald-400" />
                    <span>Repot</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenRepotModal(p)}
                    className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                    title="Player options"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Finish Game Action Button (in normal page flow so no player is ever covered) */}
      <div className="pt-4 pb-20 space-y-2">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Ready to end the game and count everyone\'s final chips?')) {
              onFinishGame();
            }
          }}
          className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition active:scale-[0.99]"
        >
          <CheckCircle2 size={20} />
          Finish Game
        </button>
      </div>
    </div>
  );
}
