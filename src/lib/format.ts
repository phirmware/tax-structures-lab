const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const gbpPrecise = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 2,
});

const pct = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  maximumFractionDigits: 1,
});

const num = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });

export function formatGBP(value: number, precise = false): string {
  if (!isFinite(value)) return '—';
  return precise ? gbpPrecise.format(value) : gbp.format(Math.round(value));
}

export function formatPct(value: number): string {
  if (!isFinite(value)) return '—';
  return pct.format(value);
}

export function formatNum(value: number): string {
  if (!isFinite(value)) return '—';
  return num.format(Math.round(value));
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
