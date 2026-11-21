export const DEFAULT_CHIP_COLORS = [
  { id: 'white', name: 'White', color: '#f8fafc', textColor: '#0f172a', borderColor: '#cbd5e1', defaultValue: 1 },
  { id: 'red', name: 'Red', color: '#ef4444', textColor: '#ffffff', borderColor: '#b91c1c', defaultValue: 5 },
  { id: 'blue', name: 'Blue', color: '#3b82f6', textColor: '#ffffff', borderColor: '#1d4ed8', defaultValue: 10 },
  { id: 'green', name: 'Green', color: '#10b981', textColor: '#ffffff', borderColor: '#047857', defaultValue: 25 },
  { id: 'black', name: 'Black', color: '#1e293b', textColor: '#ffffff', borderColor: '#475569', defaultValue: 100 },
];

/**
 * Calculates a balanced chip breakdown for a given buyin amount and player count
 * @param {number} buyIn 
 * @param {Array<{id: string, name: string, defaultValue: number}>} chipConfig 
 */
export function calculateSuggestedDistribution(buyIn, chipConfig = DEFAULT_CHIP_COLORS) {
  const target = Number(buyIn) || 0;
  if (target <= 0) return { distribution: {}, totalValue: 0 };

  // Sort chips ascending
  const chips = [...chipConfig].sort((a, b) => a.defaultValue - b.defaultValue);
  const distribution = {};
  chips.forEach(c => distribution[c.id] = 0);

  let remaining = target;

  // Practical home game breakdown heuristic:
  // Give players a good mix so small bets can be made, but not too many small chips.
  // 1. Give 5-10 of lowest denomination for blinds / small bets
  if (chips.length > 0 && remaining >= chips[0].defaultValue) {
    const smallChip = chips[0];
    const smallCount = Math.min(10, Math.floor(remaining / smallChip.defaultValue / 2));
    if (smallCount > 0) {
      distribution[smallChip.id] = smallCount;
      remaining -= smallCount * smallChip.defaultValue;
    }
  }

  // 2. Distribute higher denominations from largest to smallest
  for (let i = chips.length - 1; i >= 0; i--) {
    const chip = chips[i];
    if (chip.defaultValue <= remaining && chip.defaultValue > 0) {
      const count = Math.floor(remaining / chip.defaultValue);
      distribution[chip.id] = (distribution[chip.id] || 0) + count;
      remaining = Math.round((remaining - count * chip.defaultValue) * 100) / 100;
    }
  }

  // Calculate actual total
  let totalValue = 0;
  chips.forEach(c => {
    totalValue += (distribution[c.id] || 0) * c.defaultValue;
  });

  return {
    distribution,
    totalValue
  };
}
