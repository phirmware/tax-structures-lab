import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { formatGBP } from '../../lib/format';

export function LessonEight() {
  return (
    <>
      <h2>Why a bad year is worth more than it looks</h2>
      <p>
        A loss reduces taxable profit. So a £20,000 loss this year, in a company that's making
        steady profits, is effectively a future tax saving of £4,000–£5,000 (at typical CT
        rates). The loss has economic value beyond the lost cash itself.
      </p>
      <p>
        Tax systems generally let you do one of three things with a loss:
      </p>
      <ul>
        <li>
          <strong>Carry forward</strong> — use it to offset future profits (default).
        </li>
        <li>
          <strong>Carry back</strong> — claim a refund against last year's profit (subject to
          rules).
        </li>
        <li>
          <strong>Group relief</strong> — surrender it to a sister company that's profitable.
        </li>
      </ul>

      <h3>Why this matters for risk-taking</h3>
      <p>
        Without loss relief, the tax system would be unbalanced: the upside of a successful year
        is shared with HMRC, but the downside of a bad year would be entirely yours. Loss relief
        rebalances that, which is why governments build it into the code. It's a feature, not
        a loophole.
      </p>
      <p>
        For founders, this changes the calculus of investment. Spending on R&D, hiring, or new
        product lines that produce a loss this year often produces value next year — and the
        loss reduces the next year's bill.
      </p>

      <h3>Interactive: a 5-year P&L</h3>
      <p>
        Move the year-1 result. Watch how a year-1 loss reduces year-3's tax bill via the
        carry-forward mechanism.
      </p>

      <LossWidget />

      <h3>Watch out for</h3>
      <ul>
        <li>
          Loss-restriction rules — large losses post-2017 are restricted to 50% of profits
          above £5m in a group.
        </li>
        <li>
          Trade vs. non-trade losses behave differently. So do capital losses (CGT pool) vs.
          trading losses.
        </li>
        <li>
          Sole-trader losses can offset <em>other</em> personal income — useful in early years
          but with strict rules.
        </li>
      </ul>

      <h3>What to take away</h3>
      <ul>
        <li>A loss is a future tax saving — don't write it off (literally).</li>
        <li>The system is designed to encourage taking risks; losses balance gains.</li>
        <li>
          Always understand which loss type and which carry options apply before deciding how
          to recognise expenses.
        </li>
      </ul>
    </>
  );
}

function LossWidget() {
  const [year1, setYear1] = useState(-30_000);

  // Years 2-5 are profitable (£40k each).
  const ctRate = 0.25;
  const baseProfits = [year1, 40_000, 40_000, 40_000, 40_000];

  const data = useMemo(() => {
    let lossPool = 0;
    return baseProfits.map((p, i) => {
      let taxable = p;
      let usedLoss = 0;
      if (taxable < 0) {
        lossPool += -taxable;
        taxable = 0;
      } else if (lossPool > 0) {
        usedLoss = Math.min(lossPool, taxable);
        taxable -= usedLoss;
        lossPool -= usedLoss;
      }
      const tax = taxable * ctRate;
      return {
        year: `Y${i + 1}`,
        profitOrLoss: Math.round(p),
        usedLoss: Math.round(usedLoss),
        tax: Math.round(tax),
      };
    });
  }, [year1]);

  const cumulativeTax = data.reduce((s, y) => s + y.tax, 0);
  const totalLossesUsed = data.reduce((s, y) => s + y.usedLoss, 0);

  return (
    <div className="not-prose my-6 rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <label className="block">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-sm font-medium">Year 1 result</span>
          <span
            className={
              'font-mono ' +
              (year1 < 0 ? 'text-danger-500' : 'text-accent-700 dark:text-accent-300')
            }
          >
            {formatGBP(year1)}
          </span>
        </div>
        <input
          type="range"
          min={-100_000}
          max={50_000}
          step={1_000}
          value={year1}
          onChange={(e) => setYear1(Number(e.target.value))}
          className="w-full accent-accent-600"
        />
      </label>

      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
            <XAxis dataKey="year" stroke="currentColor" fontSize={11} />
            <YAxis stroke="currentColor" fontSize={11} tickFormatter={(v) => `£${v / 1000}k`} />
            <Tooltip
              formatter={(v: number, name) => [formatGBP(v), name]}
              contentStyle={{
                background: 'var(--tooltip-bg, #ffffff)',
                border: '1px solid rgba(120,130,145,0.3)',
                fontSize: 12,
                borderRadius: 8,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="profitOrLoss" name="Profit / loss" fill="#3b82f6" />
            <Bar dataKey="usedLoss" name="Loss carried & used" fill="#ca8a04" />
            <Bar dataKey="tax" name="Tax paid" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Stat label="Total tax paid (5 yrs)" value={formatGBP(cumulativeTax)} tone="tax" />
        <Stat label="Total loss used" value={formatGBP(totalLossesUsed)} tone="retain" />
      </div>
      <p className="mt-3 text-xs text-ink-500 dark:text-ink-400">
        With a {formatGBP(Math.abs(Math.min(0, year1)))} year-1 loss, future profits absorb it
        and produce £0 tax until exhausted. That's why losses have value.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'tax' | 'retain';
}) {
  return (
    <div className="rounded-lg border border-ink-200 p-3 dark:border-ink-700">
      <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {label}
      </div>
      <div
        className={
          'font-mono text-base font-semibold tabular-nums ' +
          (tone === 'tax'
            ? 'text-danger-500'
            : tone === 'retain'
            ? 'text-yellow-700 dark:text-yellow-300'
            : '')
        }
      >
        {value}
      </div>
    </div>
  );
}
