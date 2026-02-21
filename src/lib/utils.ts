// Division definitions
export const DIVISIONS = [
  { id: 1, name: 'Novice Speaker',    minXp: 0,      maxXp: 499,   emoji: '🟤', tier: 1, badgeClass: 'badge-novice' },
  { id: 2, name: 'Confident Speaker', minXp: 500,    maxXp: 1499,  emoji: '🔵', tier: 2, badgeClass: 'badge-confident' },
  { id: 3, name: 'Orator',            minXp: 1500,   maxXp: 3999,  emoji: '🟡', tier: 3, badgeClass: 'badge-orator' },
  { id: 4, name: 'Keynote Speaker',   minXp: 4000,   maxXp: 9999,  emoji: '💜', tier: 4, badgeClass: 'badge-keynote' },
  { id: 5, name: 'Legend',            minXp: 10000,  maxXp: Infinity, emoji: '🔴', tier: 5, badgeClass: 'badge-legend' },
] as const;

export function getDivision(xp: number) {
  return DIVISIONS.find(d => xp >= d.minXp && xp <= d.maxXp) ?? DIVISIONS[0];
}

export function getXpProgressInDivision(xp: number) {
  const div = getDivision(xp);
  if (div.id === 5) return 100;
  const rangeTotal = div.maxXp - div.minXp + 1;
  const rangeProgress = xp - div.minXp;
  return Math.round((rangeProgress / rangeTotal) * 100);
}

// XP Calculation
export function calculateXp(scores: Record<string, number>, tipUsed: boolean, streakDays: number): number {
  const factors = Object.values(scores);
  const baseXp = factors.reduce((sum, s) => sum + Math.round((s / 100) * 10), 0);
  const tipBonus = tipUsed ? 25 : 0;

  let streakMultiplier = 1;
  if (streakDays >= 30) streakMultiplier = 2.0;
  else if (streakDays >= 14) streakMultiplier = 1.75;
  else if (streakDays >= 7)  streakMultiplier = 1.5;
  else if (streakDays >= 4)  streakMultiplier = 1.25;
  else if (streakDays >= 2)  streakMultiplier = 1.1;

  return Math.round((baseXp + tipBonus) * streakMultiplier);
}

// Score labels
export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Excellent', color: '#4caf82' };
  if (score >= 70) return { label: 'Good',      color: '#c9a84c' };
  if (score >= 50) return { label: 'Average',   color: '#e8a44a' };
  if (score >= 30) return { label: 'Needs Work', color: '#e87070' };
  return { label: 'Poor', color: '#e85a4a' };
}

export function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
