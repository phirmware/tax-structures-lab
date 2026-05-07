import { useMemo, useState } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { formatGBP, formatPct } from '../../lib/format';

export function LessonNine() {
  return (
    <>
      <h2>The most underused tool in the founder toolbox</h2>
      <p>
        Pension contributions are the single most efficient way most UK founders extract money
        from their company. Here's why:
      </p>
      <ul>
        <li>
          The <strong>company</strong> pays the contribution and treats it as a deductible cost
          — corporation tax goes <em>down</em>.
        </li>
        <li>
          <strong>You</strong> pay no income tax on the contribution today (employer pension
          contributions don't count as your income).
        </li>
        <li>
          <strong>Inside the pension</strong> the money grows tax-free.
        </li>
        <li>
          On the way out (from age 55, rising to 57 from 2028), 25% can be tax-free; the rest
          is taxed at your marginal rate at that time — usually lower than your peak earning
          years.
        </li>
      </ul>
      <p>
        That's the whole package: tax-free in, tax-free growth, partly tax-free out. The
        textbook deferral pattern.
      </p>

      <h3>Why this is the deferral pattern in its purest form</h3>
      <p>
        Lesson 1.7 introduced the time value of taxes. A pension deploys this idea at three
        layers — the contribution, the compounding, and the staged withdrawal. That's why over
        a long horizon, very little else competes.
      </p>

      <h3>Interactive: 30 years of pension vs. taxable savings</h3>
      <p>
        Same £20,000 / year of pre-tax contribution. One path: into pension. The other: take it
        as dividend, save the rest. After 30 years and an eventual withdrawal, who's ahead?
      </p>

      <PensionWidget />

      <h3>Limits and watch-outs</h3>
      <ul>
        <li>
          <strong>Annual allowance</strong> — currently £60,000 / year (less if you're a high
          earner with tapering).
        </li>
        <li>
          <strong>Wholly and exclusively</strong> — large contributions for a director must be
          consistent with their role and the company's profitability.
        </li>
        <li>
          <strong>Liquidity</strong> — you can't access it before age 55/57. So don't pension
          money you'll need before then.
        </li>
        <li>
          <strong>Lifetime considerations</strong> — the lifetime allowance has been removed,
          but rules can change. Don't structure decades of life around current rates.
        </li>
      </ul>

      <h3>What to take away</h3>
      <ul>
        <li>For most founders most of the time, the pension is the cheapest extraction route.</li>
        <li>The cost is liquidity — but most founders can afford that for surplus cash.</li>
        <li>Coordinate with your accountant; the limits are real.</li>
      </ul>
    </>
  );
}

function PensionWidget() {
  const [annualPreTax, setAnnualPreTax] = useState(20_000);
  const [years, setYears] = useState(30);

  // Same starting amount, two paths.
  // Path A: into pension. Whole amount goes in pre-tax. Grows at 7%.
  //          Withdrawal: 25% tax-free, 75% at 20% (assumed retirement basic rate).
  // Path B: dividend. Pays ~33.75% dividend tax (higher rate). Net invested at 5% in a taxable wrapper.
  // Use 7% pension growth, 5% taxable growth (post-tax effects baked in roughly).

  const data = useMemo(() => {
    const out = [];
    let pension = 0;
    let taxable = 0;
    const dividendTaxRate = 0.3375;
    const pensionGrowth = 0.07;
    const taxableGrowth = 0.05;

    for (let i = 1; i <= years; i++) {
      pension = pension * (1 + pensionGrowth) + annualPreTax;
      taxable = taxable * (1 + taxableGrowth) + annualPreTax * (1 - dividendTaxRate);
      out.push({
        year: i,
        pensionPot: Math.round(pension),
        taxablePot: Math.round(taxable),
      });
    }
    return out;
  }, [annualPreTax, years]);

  const lastP = data[data.length - 1]?.pensionPot ?? 0;
  const lastT = data[data.length - 1]?.taxablePot ?? 0;

  const taxFree = lastP * 0.25;
  const taxed = lastP * 0.75;
  const exitTaxRate = 0.2; // assumed basic rate in retirement
  const exitTax = taxed * exitTaxRate;
  const pensionAfterExit = lastP - exitTax;

  return (
    <div className="not-prose my-6 rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-sm font-medium">Annual pre-tax amount</span>
            <span className="font-mono">{formatGBP(annualPreTax)}</span>
          </div>
          <input
            type="range"
            min={2_000}
            max={60_000}
            step={1_000}
            value={annualPreTax}
            onChange={(e) => setAnnualPreTax(Number(e.target.value))}
            className="w-full accent-accent-600"
          />
        </label>
        <label>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-sm font-medium">Years</span>
            <span className="font-mono">{years}</span>
          </div>
          <input
            type="range"
            min={5}
            max={40}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-accent-600"
          />
        </label>
      </div>

      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
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
            <Line
              type="monotone"
              dataKey="pensionPot"
              name="Pension pot (pre-withdrawal)"
              stroke="#2e956a"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="taxablePot"
              name="Taxable savings (post-dividend-tax)"
              stroke="#67738c"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Pension pot at year-end"
          value={formatGBP(lastP)}
          tone="net"
          hint={`Of which 25% (${formatGBP(taxFree)}) tax-free`}
        />
        <Stat
          label="Pension after exit-tax"
          value={formatGBP(pensionAfterExit)}
          tone="net"
          hint={`Assumed ${formatPct(exitTaxRate)} on the taxable 75%`}
        />
        <Stat
          label="Taxable savings path"
          value={formatGBP(lastT)}
          hint="Post-dividend-tax on input, 5% growth"
        />
      </div>
      <p className="mt-3 text-xs text-ink-500 dark:text-ink-400">
        Difference at year {years}:{' '}
        <strong className="text-accent-700 dark:text-accent-300">
          {formatGBP(pensionAfterExit - lastT)}
        </strong>{' '}
        more under the pension path.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  hint,
}: {
  label: string;
  value: string;
  tone?: 'net';
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-ink-200 p-3 dark:border-ink-700">
      <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {label}
      </div>
      <div
        className={
          'font-mono text-base font-semibold tabular-nums ' +
          (tone === 'net' ? 'text-accent-700 dark:text-accent-300' : '')
        }
      >
        {value}
      </div>
      {hint && <div className="mt-0.5 text-[11px] text-ink-500 dark:text-ink-400">{hint}</div>}
    </div>
  );
}
