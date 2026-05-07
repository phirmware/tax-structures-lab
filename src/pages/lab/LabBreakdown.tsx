import type { LtdResult } from '../../lib/tax';
import { formatGBP, formatPct } from '../../lib/format';

export function LabBreakdown({ ltd }: { ltd: LtdResult }) {
  const ct = ltd.corporationTax;
  const p = ltd.personal;
  return (
    <div className="grid gap-4 text-sm md:grid-cols-2">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Company side
        </div>
        <table className="mt-1 w-full text-xs">
          <tbody className="[&_tr]:border-b [&_tr:last-child]:border-0 [&_tr]:border-ink-200/60 dark:[&_tr]:border-ink-800/60">
            <Row label="Revenue" v={ltd.revenue} />
            <Row label="Costs" v={ltd.costs} negative />
            <Row label="Director salary" v={ltd.ownerSalary} negative />
            <Row label="Employer NI" v={ltd.employerNI} negative />
            {ltd.pensionContribution > 0 && (
              <Row label="Pension contribution" v={ltd.pensionContribution} negative />
            )}
            <Row label="Pre-tax profit" v={ltd.preTaxProfit} bold />
            <Row
              label={`Corporation tax (${formatPct(ct.effectiveRate)})`}
              v={ct.total}
              negative
              tone="tax"
            />
            <Row label="Post-tax profit" v={ltd.postTaxProfit} bold />
            <Row label="Dividend declared" v={ltd.dividendDeclared} />
            <Row label="Retained earnings" v={ltd.retainedEarnings} bold tone="retain" />
          </tbody>
        </table>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Personal side
        </div>
        <table className="mt-1 w-full text-xs">
          <tbody className="[&_tr]:border-b [&_tr:last-child]:border-0 [&_tr]:border-ink-200/60 dark:[&_tr]:border-ink-800/60">
            <Row label="Gross salary" v={p.salary} />
            <Row label="Income tax on salary" v={p.itOnSalary} negative tone="tax" />
            <Row label="Employee NI" v={p.employeeNI} negative tone="tax" />
            <Row label="Net salary" v={p.netSalary} bold tone="net" />
            <Row label="Gross dividend" v={p.dividends} />
            <Row label="Dividend tax" v={p.totalDividendTax} negative tone="tax" />
            <Row label="Net dividend" v={p.netDividends} bold tone="net" />
            <Row label="Total net to owner" v={p.totalNet} bold tone="net" />
          </tbody>
        </table>
      </div>
      <div className="md:col-span-2">
        <div className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs text-ink-700 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-200">
          <strong>Total tax to HMRC: </strong>
          {formatGBP(ltd.totalTaxToHmrc)} ({' '}
          {formatGBP(ltd.employerNI)} employer NI ·{' '}
          {formatGBP(ct.total)} corporation tax ·{' '}
          {formatGBP(p.totalPersonalTax)} personal )
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  v,
  negative,
  bold,
  tone,
}: {
  label: string;
  v: number;
  negative?: boolean;
  bold?: boolean;
  tone?: 'tax' | 'net' | 'retain';
}) {
  const toneClass =
    tone === 'tax'
      ? 'text-danger-500'
      : tone === 'net'
      ? 'text-accent-700 dark:text-accent-300'
      : tone === 'retain'
      ? 'text-yellow-700 dark:text-yellow-300'
      : '';
  return (
    <tr>
      <td className={`py-1 ${bold ? 'font-semibold' : ''}`}>{label}</td>
      <td
        className={`py-1 text-right font-mono tabular-nums ${
          bold ? 'font-semibold' : ''
        } ${toneClass}`}
      >
        {negative ? '−' : ''}
        {formatGBP(v)}
      </td>
    </tr>
  );
}
