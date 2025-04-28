export interface WagerResult {
  win: boolean;
  payout: number;
  dice: { d1: number; d2: number };
  sum: number;
}

export function placeWager(amount: number, isLucky: boolean): WagerResult {
  const d1 = Math.ceil(Math.random() * 6);
  const d2 = Math.ceil(Math.random() * 6);
  const sum = d1 + d2;

  const didRollSeven = sum === 7;
  const win = isLucky ? didRollSeven : !didRollSeven;

  let payout = 0;
  if (win) payout = amount * (isLucky ? 7 : 1);

  return { win, payout, dice: { d1, d2 }, sum };
}
