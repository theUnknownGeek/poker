/**
 * Calculates optimal debt settlement with minimum number of transactions
 * using a greedy algorithm.
 * 
 * @param {Array<{id: string, name: string, totalBuyIn: number, finalChips: number}>} players
 * @returns {{
 *   transactions: Array<{id: string, fromId: string, from: string, toId: string, to: string, amount: number, completed: boolean}>,
 *   playerStats: Array<{id: string, name: string, totalBuyIn: number, finalChips: number, net: number, isWinner: boolean}>,
 *   totalPot: number,
 *   totalFinal: number,
 *   discrepancy: number
 * }}
 */
export function calculateSettlement(players) {
  let totalPot = 0;
  let totalFinal = 0;

  const playerStats = players.map(p => {
    const buyIn = Number(p.totalBuyIn) || 0;
    const final = Number(p.finalChips) || 0;
    const net = Math.round((final - buyIn) * 100) / 100;

    totalPot += buyIn;
    totalFinal += final;

    return {
      id: p.id,
      name: p.name,
      totalBuyIn: buyIn,
      finalChips: final,
      net: net,
      isWinner: net > 0
    };
  });

  const discrepancy = Math.round((totalFinal - totalPot) * 100) / 100;

  // Split into debtors and creditors
  // Debtor: net < 0 (they owe money)
  // Creditor: net > 0 (they are owed money)
  const debtors = [];
  const creditors = [];

  playerStats.forEach(p => {
    if (p.net < -0.009) {
      debtors.push({ id: p.id, name: p.name, amount: Math.abs(p.net) });
    } else if (p.net > 0.009) {
      creditors.push({ id: p.id, name: p.name, amount: p.net });
    }
  });

  // Sort: biggest debtors and biggest creditors first
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    // Settle the minimum of what debtor owes and creditor is owed
    const settledAmount = Math.min(debtor.amount, creditor.amount);
    const roundedAmount = Math.round(settledAmount * 100) / 100;

    if (roundedAmount > 0) {
      transactions.push({
        id: `tx-${debtor.id}-${creditor.id}-${transactions.length}`,
        fromId: debtor.id,
        from: debtor.name,
        toId: creditor.id,
        to: creditor.name,
        amount: roundedAmount,
        completed: false
      });
    }

    debtor.amount = Math.round((debtor.amount - settledAmount) * 100) / 100;
    creditor.amount = Math.round((creditor.amount - settledAmount) * 100) / 100;

    if (debtor.amount < 0.01) {
      dIdx++;
    }
    if (creditor.amount < 0.01) {
      cIdx++;
    }
  }

  // Sort player stats by net descending (winners first)
  playerStats.sort((a, b) => b.net - a.net);

  return {
    transactions,
    playerStats,
    totalPot,
    totalFinal,
    discrepancy
  };
}
