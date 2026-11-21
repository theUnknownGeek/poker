const STORAGE_KEY = 'poker_homegame_state_v1';
const RECENT_PLAYERS_KEY = 'poker_homegame_recent_players';

export function loadSavedGameState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load game state', e);
    return null;
  }
}

export function saveGameState(state) {
  try {
    if (!state) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (e) {
    console.error('Failed to save game state', e);
  }
}

export function loadRecentPlayers() {
  try {
    const raw = localStorage.getItem(RECENT_PLAYERS_KEY);
    if (!raw) return ['Harsh', 'Manish', 'KC', 'Alex', 'Rahul', 'Sam'];
    return JSON.parse(raw);
  } catch (e) {
    return ['Harsh', 'Manish', 'KC'];
  }
}

export function saveRecentPlayers(players) {
  try {
    const names = players.map(p => typeof p === 'string' ? p : p.name);
    const existing = loadRecentPlayers();
    const combined = Array.from(new Set([...names, ...existing])).slice(0, 20);
    localStorage.setItem(RECENT_PLAYERS_KEY, JSON.stringify(combined));
  } catch (e) {
    console.error('Failed to save recent players', e);
  }
}
