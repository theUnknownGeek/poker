import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, Share2, Trophy, RotateCcw, CheckCircle, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency, generateShareText } from '../utils/formatters';

export function SettleUpResults({
  settlementData,
  currency,
  gameDate,
  onBackToTally,
  onStartNewGameWithSamePlayers,
  onResetGame
}) {
  const [completedTx, setCompletedTx] = useState({});
  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const { transactions, playerStats, totalPot } = settlementData;

  const toggleTxComplete = (id) => {
    setCompletedTx(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyShare = async () => {
    const text = generateShareText({
      gameDate,
      currency,
      totalPot,
      transactions,
      playerStats
    });

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const allCompleted = transactions.length > 0 && transactions.every(tx => completedTx[tx.id]);

  return (
    <div className="max-w-md mx-auto px-4 py-5 sm:py-6 pb-12 space-y-6 animate-in fade-in duration-300">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToTally}
          className="p-2 -ml-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft size={18} />
          <span>Tally</span>
        </button>

        <h1 className="text-xl font-extrabold text-white text-center">
          Settle Up
        </h1>

        <button
          onClick={handleCopyShare}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 transition"
          title="Share results"
        >
          <Share2 size={16} />
        </button>
      </div>

      {/* Recommended Transactions Header (matches pic 5) */}
      <div className="space-y-1">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          Recommended Transactions
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
            {transactions.length} {transactions.length === 1 ? 'payment' : 'payments'}
          </span>
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The following transactions will settle all debts with the minimum number of payments:
        </p>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="p-6 text-center bg-[#141923] border border-slate-800 rounded-2xl space-y-2">
            <Sparkles size={28} className="mx-auto text-emerald-400" />
            <div className="text-base font-bold text-white">Everyone Broke Even!</div>
            <div className="text-xs text-slate-400">All players finished with their exact buy-in amount. No transfers required.</div>
          </div>
        ) : (
          transactions.map((tx) => {
            const isDone = !!completedTx[tx.id];

            return (
              <div
                key={tx.id}
                onClick={() => toggleTxComplete(tx.id)}
                className={`group cursor-pointer bg-[#141923] hover:bg-[#181f2c] border rounded-2xl p-4 transition shadow-md flex items-center justify-between ${
                  isDone 
                    ? 'border-emerald-800/40 bg-emerald-950/20 opacity-75' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Flow: Sender -> Receiver */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-base font-bold capitalize ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {tx.from}
                    </span>
                    <ArrowRight size={16} className="text-emerald-500 shrink-0" />
                    <span className={`text-base font-bold capitalize ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                      {tx.to}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-black font-mono ${isDone ? 'text-slate-400' : 'text-emerald-400'}`}>
                      {formatCurrency(tx.amount, currency)}
                    </span>
                    {isDone && (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <Check size={12} /> Paid
                      </span>
                    )}
                  </div>
                </div>

                {/* Checkbox / Paid indicator */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTxComplete(tx.id);
                  }}
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition ${
                    isDone 
                      ? 'bg-emerald-600 border-emerald-500 text-white' 
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-emerald-500'
                  }`}
                  title={isDone ? 'Mark as unpaid' : 'Mark as paid'}
                >
                  <Check size={18} className={isDone ? 'opacity-100' : 'opacity-0'} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Share / WhatsApp action banner */}
      <div className="p-4 bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-900/60 rounded-2xl flex items-center justify-between gap-3 shadow-lg">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Send size={13} className="text-emerald-400" />
            Share Game Summary
          </div>
          <div className="text-[11px] text-slate-400">
            Copy formatted breakdown for WhatsApp / Telegram group
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopyShare}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
            copied 
              ? 'bg-emerald-600 text-white' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {copied ? (
            <>
              <Check size={14} /> Copied!
            </>
          ) : (
            <>
              <Copy size={14} /> Copy Text
            </>
          )}
        </button>
      </div>

      {/* Leaderboard / Net Performance Summary */}
      <div className="bg-[#141923] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Trophy size={14} className="text-amber-400" />
            Final Standings
          </span>
          <span className="text-xs font-mono text-slate-400">
            Pot: {formatCurrency(totalPot, currency)}
          </span>
        </div>

        <div className="space-y-2">
          {playerStats.map((p, idx) => {
            const isTopWinner = idx === 0 && p.net > 0;
            return (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800/80"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-center text-xs font-bold text-slate-400">
                    {isTopWinner ? '👑' : `${idx + 1}`}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-white capitalize flex items-center gap-1">
                      {p.name}
                      {isTopWinner && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/50">
                          MVP
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      In: {formatCurrency(p.totalBuyIn, currency)} · Out: {formatCurrency(p.finalChips, currency)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-base font-extrabold font-mono ${
                    p.net > 0 ? 'text-emerald-400' : p.net < 0 ? 'text-red-400' : 'text-slate-400'
                  }`}>
                    {p.net > 0 ? `+${formatCurrency(p.net, currency)}` : p.net < 0 ? `-${formatCurrency(Math.abs(p.net), currency)}` : '±0'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start New Game Buttons */}
      <div className="space-y-2 pt-2 pb-20">
        <button
          type="button"
          onClick={onStartNewGameWithSamePlayers}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition active:scale-[0.99]"
        >
          <RotateCcw size={16} />
          Rematch (Same Players)
        </button>

        <button
          type="button"
          onClick={onResetGame}
          className="w-full py-3 px-4 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition"
        >
          Start New Game from Scratch
        </button>
      </div>
    </div>
  );
}
