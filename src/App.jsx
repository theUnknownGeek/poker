import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SetupGame } from './components/SetupGame';
import { GameInProgress } from './components/GameInProgress';
import { RepotModal } from './components/RepotModal';
import { TallyUpResults } from './components/TallyUpResults';
import { SettleUpResults } from './components/SettleUpResults';
import { ChipCalculatorModal } from './components/ChipCalculatorModal';
import { ChipDistributionModal } from './components/ChipDistributionModal';
import { DEFAULT_CHIP_COLORS } from './utils/chipDistribution';
import { calculateSettlement } from './utils/settlement';
import { loadSavedGameState, saveGameState, loadRecentPlayers, saveRecentPlayers } from './utils/storage';

export function App() {
  // Initialize state from local storage or defaults
  const [hasLoaded, setHasLoaded] = useState(false);
  const [step, setStep] = useState('setup'); // 'setup' | 'progress' | 'tally' | 'settle'
  const [currency, setCurrency] = useState('$');
  const [buyIn, setBuyIn] = useState(20);
  const [players, setPlayers] = useState([
    { id: 'p-1', name: 'harsh', totalBuyIn: 20, finalChips: null, repots: [] },
    { id: 'p-2', name: 'manish', totalBuyIn: 20, finalChips: null, repots: [] },
    { id: 'p-3', name: 'kc', totalBuyIn: 20, finalChips: null, repots: [] },
  ]);
  const [chipConfig, setChipConfig] = useState(DEFAULT_CHIP_COLORS);
  const [history, setHistory] = useState([]);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [gameDate, setGameDate] = useState(null);
  const [settlementData, setSettlementData] = useState(null);
  const [recentPlayers, setRecentPlayers] = useState([]);

  // Modals state
  const [repotPlayer, setRepotPlayer] = useState(null);
  const [calculatorPlayer, setCalculatorPlayer] = useState(null);
  const [isChipDistributionOpen, setIsChipDistributionOpen] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const saved = loadSavedGameState();
    const recents = loadRecentPlayers();
    setRecentPlayers(recents);

    if (saved) {
      if (saved.step) setStep(saved.step);
      if (saved.currency) setCurrency(saved.currency);
      if (saved.buyIn) setBuyIn(saved.buyIn);
      if (saved.players) setPlayers(saved.players);
      if (saved.chipConfig) setChipConfig(saved.chipConfig);
      if (saved.history) setHistory(saved.history);
      if (saved.gameStartTime) setGameStartTime(saved.gameStartTime);
      if (saved.gameDate) setGameDate(saved.gameDate);
      if (saved.settlementData) setSettlementData(saved.settlementData);
    }
    setHasLoaded(true);
  }, []);

  // Save game state changes to localStorage
  useEffect(() => {
    if (!hasLoaded) return;
    saveGameState({
      step,
      currency,
      buyIn,
      players,
      chipConfig,
      history,
      gameStartTime,
      gameDate,
      settlementData
    });
  }, [step, currency, buyIn, players, chipConfig, history, gameStartTime, gameDate, settlementData, hasLoaded]);

  // Player handlers
  const handleAddPlayer = (name) => {
    const id = `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setPlayers(prev => [
      ...prev,
      {
        id,
        name: name.trim().toLowerCase(),
        totalBuyIn: buyIn,
        finalChips: null,
        repots: []
      }
    ]);
  };

  const handleRemovePlayer = (id) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const handleAddRecentPlayer = (name) => {
    if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) return;
    handleAddPlayer(name);
  };

  const handleBuyInChange = (newAmount) => {
    setBuyIn(newAmount);
    // If on setup screen, update all players' initial buy-in
    if (step === 'setup') {
      setPlayers(prev => prev.map(p => ({
        ...p,
        totalBuyIn: newAmount
      })));
    }
  };

  // Start Game
  const handleStartGame = () => {
    const now = Date.now();
    setGameStartTime(now);
    setGameDate(now);
    setStep('progress');
    saveRecentPlayers(players);
    setRecentPlayers(loadRecentPlayers());
  };

  // Add Late Player
  const handleAddLatePlayer = (name) => {
    const id = `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newPlayer = {
      id,
      name: name.trim().toLowerCase(),
      totalBuyIn: buyIn,
      finalChips: null,
      repots: []
    };
    setPlayers(prev => [...prev, newPlayer]);
    setHistory(prev => [
      {
        playerName: newPlayer.name,
        amount: buyIn,
        type: 'late_join',
        timestamp: Date.now()
      },
      ...prev
    ]);
    saveRecentPlayers([newPlayer.name]);
  };

  // Repot / Add Funds
  const handleAddFunds = (playerId, amount) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    setPlayers(prev => prev.map(p => {
      if (p.id !== playerId) return p;
      return {
        ...p,
        totalBuyIn: (p.totalBuyIn || 0) + amount,
        repots: [
          ...(p.repots || []),
          { amount, timestamp: Date.now() }
        ]
      };
    }));

    setHistory(prev => [
      {
        playerName: player.name,
        amount,
        type: 'repot',
        timestamp: Date.now()
      },
      ...prev
    ]);
  };

  // Finish Game (transition to tally)
  const handleFinishGame = () => {
    setStep('tally');
  };

  // Update Player Final Chips
  const handleUpdatePlayerFinalChips = (playerId, finalVal) => {
    setPlayers(prev => prev.map(p => {
      if (p.id !== playerId) return p;
      return {
        ...p,
        finalChips: finalVal
      };
    }));
  };

  // Settle Up
  const handleSettleUp = () => {
    const result = calculateSettlement(players);
    setSettlementData(result);
    setStep('settle');
  };

  // Start New Game with Same Players (Rematch)
  const handleStartNewGameWithSamePlayers = () => {
    const now = Date.now();
    setGameStartTime(now);
    setGameDate(now);
    setPlayers(prev => prev.map(p => ({
      ...p,
      totalBuyIn: buyIn,
      finalChips: null,
      repots: []
    })));
    setHistory([]);
    setSettlementData(null);
    setStep('progress');
  };

  // Reset Game completely
  const handleResetGame = () => {
    setStep('setup');
    setGameStartTime(null);
    setGameDate(null);
    setSettlementData(null);
    setHistory([]);
    setPlayers(prev => prev.map(p => ({
      ...p,
      totalBuyIn: buyIn,
      finalChips: null,
      repots: []
    })));
    saveGameState(null);
  };

  return (
    <div className="min-h-screen bg-[#0c0f17] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        step={step}
        currency={currency}
        onCurrencyChange={setCurrency}
        onResetGame={handleResetGame}
      />

      {/* Main Screen Router */}
      <main className="flex-1 w-full max-w-2xl mx-auto">
        {step === 'setup' && (
          <SetupGame
            buyIn={buyIn}
            onBuyInChange={handleBuyInChange}
            players={players}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={handleRemovePlayer}
            onStartGame={handleStartGame}
            currency={currency}
            onOpenChipDistribution={() => setIsChipDistributionOpen(true)}
            recentPlayers={recentPlayers}
            onAddRecentPlayer={handleAddRecentPlayer}
          />
        )}

        {step === 'progress' && (
          <GameInProgress
            initialBuyIn={buyIn}
            currency={currency}
            chipConfig={chipConfig}
            players={players}
            history={history}
            onOpenRepotModal={(p) => setRepotPlayer(p)}
            onFinishGame={handleFinishGame}
            onBackToSetup={() => setStep('setup')}
            onAddLatePlayer={handleAddLatePlayer}
          />
        )}

        {step === 'tally' && (
          <TallyUpResults
            currency={currency}
            players={players}
            onUpdatePlayerFinalChips={handleUpdatePlayerFinalChips}
            onOpenCalculatorModal={(p) => setCalculatorPlayer(p)}
            onSettleUp={handleSettleUp}
            onBackToGame={() => setStep('progress')}
          />
        )}

        {step === 'settle' && settlementData && (
          <SettleUpResults
            settlementData={settlementData}
            currency={currency}
            gameDate={gameDate}
            onBackToTally={() => setStep('tally')}
            onStartNewGameWithSamePlayers={handleStartNewGameWithSamePlayers}
            onResetGame={handleResetGame}
          />
        )}
      </main>

      {/* Modals */}
      <RepotModal
        isOpen={!!repotPlayer}
        player={repotPlayer}
        initialBuyIn={buyIn}
        currency={currency}
        onClose={() => setRepotPlayer(null)}
        onAddFunds={handleAddFunds}
      />

      <ChipCalculatorModal
        isOpen={!!calculatorPlayer}
        player={calculatorPlayer}
        currency={currency}
        chipConfig={chipConfig}
        onClose={() => setCalculatorPlayer(null)}
        onSave={handleUpdatePlayerFinalChips}
      />

      <ChipDistributionModal
        isOpen={isChipDistributionOpen}
        buyIn={buyIn}
        currency={currency}
        chipConfig={chipConfig}
        onClose={() => setIsChipDistributionOpen(false)}
        onUpdateChipConfig={setChipConfig}
      />
    </div>
  );
}

export default App;
