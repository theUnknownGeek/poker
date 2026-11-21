import React, { useState } from 'react';
import { UserPlus, Play, X, Layers, Users, Sparkles, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function SetupGame({
  buyIn,
  onBuyInChange,
  players,
  onAddPlayer,
  onRemovePlayer,
  onStartGame,
  currency,
  onOpenChipDistribution,
  recentPlayers = [],
  onAddRecentPlayer
}) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddPlayer = (e) => {
    e?.preventDefault();
    const trimmed = newPlayerName.trim();
    if (!trimmed) return;

    // Check duplicate
    if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg(`"${trimmed}" is already added.`);
      return;
    }

    setErrorMsg('');
    onAddPlayer(trimmed);
    setNewPlayerName('');
  };

  const handleStart = () => {
    if (players.length < 2) {
      setErrorMsg('Please add at least 2 players to start a poker game.');
      return;
    }
    if (buyIn <= 0) {
      setErrorMsg('Please enter a valid buy-in amount.');
      return;
    }
    setErrorMsg('');
    onStartGame();
  };

  const quickBuyIns = [20, 50, 100, 200, 500];

  return (
    <div className="max-w-md mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Setup Game
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure initial buy-in & players to begin
        </p>
      </div>

      {/* Buy In Card */}
      <div className="bg-[#141923] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="text-center">
          <label className="text-sm font-bold text-slate-300 inline-flex items-center gap-1.5">
            Buy <span className="text-lg">💰</span> In
          </label>
          <div className="text-[11px] text-slate-400 font-medium">(per player)</div>
        </div>

        {/* Big Buy In Input */}
        <div className="relative max-w-xs mx-auto">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-emerald-400">
            {currency}
          </span>
          <input
            type="number"
            min="1"
            step="any"
            value={buyIn}
            onChange={(e) => onBuyInChange(Math.max(1, parseFloat(e.target.value) || 0))}
            className="w-full text-center py-3.5 pl-10 pr-4 bg-slate-900 border-2 border-slate-700 focus:border-emerald-500 rounded-xl text-3xl font-black text-emerald-400 outline-none transition"
          />
        </div>

        {/* Quick Buy In Presets */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {quickBuyIns.map(amount => (
            <button
              key={amount}
              type="button"
              onClick={() => onBuyInChange(amount)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                buyIn === amount
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              {currency}{amount}
            </button>
          ))}
        </div>
      </div>

      {/* Players Section */}
      <div className="bg-[#141923] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-emerald-400" />
            <h2 className="text-sm font-bold text-white">
              Players <span className="text-xs text-slate-400 font-normal">({players.length})</span>
            </h2>
          </div>
          {players.length > 0 && (
            <span className="text-xs font-mono font-semibold text-emerald-400">
              Total Pot: {formatCurrency(players.length * buyIn, currency)}
            </span>
          )}
        </div>

        {/* Player Input Field */}
        <form onSubmit={handleAddPlayer} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => {
                setNewPlayerName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Who's playing? (e.g. harsh, manish)"
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl text-sm font-medium text-white placeholder-slate-500 outline-none transition"
            />
            <button
              type="submit"
              disabled={!newPlayerName.trim()}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center gap-1.5 border border-slate-700 transition"
            >
              <UserPlus size={16} />
              Add
            </button>
          </div>
        </form>

        {/* Quick Add from Recent Players */}
        {recentPlayers && recentPlayers.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles size={11} className="text-amber-400" />
              Quick add past players:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recentPlayers
                .filter(name => !players.some(p => p.name.toLowerCase() === name.toLowerCase()))
                .slice(0, 6)
                .map(name => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => onAddRecentPlayer(name)}
                    className="px-2.5 py-1 bg-slate-900/90 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-700/80 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 transition"
                  >
                    + {name}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Players List Chips */}
        {players.length === 0 ? (
          <div className="py-6 text-center border-2 border-dashed border-slate-800 rounded-xl">
            <Users size={28} className="mx-auto text-slate-600 mb-1" />
            <div className="text-xs font-semibold text-slate-400">No players added yet</div>
            <div className="text-[11px] text-slate-500">Type a name above and press Enter</div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {players.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl group hover:border-slate-600 transition"
                >
                  <span className="text-xs font-bold text-slate-400 w-4 text-center">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-white capitalize">
                    {p.name}
                  </span>
                  <span className="text-xs font-mono text-emerald-400/90 font-medium">
                    {formatCurrency(p.totalBuyIn || buyIn, currency)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemovePlayer(p.id)}
                    className="p-1 text-slate-400 hover:text-red-400 rounded-md hover:bg-slate-800 transition"
                    title="Remove player"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggested Chip Distribution Button */}
      <button
        type="button"
        onClick={onOpenChipDistribution}
        className="w-full py-3 px-4 bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99]"
      >
        <Layers size={18} className="text-emerald-400" />
        Get Suggested Chip Distribution
      </button>

      {/* Error message */}
      {errorMsg && (
        <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs font-semibold text-red-300 text-center animate-in shake duration-200">
          {errorMsg}
        </div>
      )}

      {/* Big Green Start Game Button */}
      <button
        type="button"
        onClick={handleStart}
        className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition duration-150 active:scale-[0.99]"
      >
        <Play size={22} className="fill-white" />
        Start Game
      </button>
    </div>
  );
}
