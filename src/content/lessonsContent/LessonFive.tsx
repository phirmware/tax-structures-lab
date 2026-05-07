import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatGBP } from '../../lib/format';

export function LessonFive() {
  return (
    <>
      <h2>The cheapest place to keep your money</h2>
      <p>
        In every developed economy, money kept inside a company is taxed at lower rates than
        money paid out to a person. UK corporation tax tops out at 25%; UK personal income tops
        out at 47% (45% IT + 2% NI). Other countries differ in numbers but rarely in direction.
      </p>
      <p>
        This is intentional. Governments want to encourage <em>reinvestment</em> — companies
        building things, hiring people, buying equipment, doing R&D. The lower corporate rate is
        the reward for not consuming the profit immediately.
      </p>

      <h3>Why this matters for founders</h3>
      <p>
        If you take all your business profit out as personal income each year, you are paying
        the highest rates available. If you only take what you need to live and leave the rest
        inside the company, the leftover compounds at the corporate rate.
      </p>
      <p>
        Over a decade, the difference between extracting everything and leaving £50k a year
        inside the company isn't a few percent. It's life-changing.
      </p>

      <h3>Interactive: 10 years, two strategies</h3>
      <p>
        Same business, same revenue. Slider on the left: how much you extract personally each
        year. Watch the wealth gap open up.
      </p>

      <RetainWidget />

      <h3>The catch (you knew there was one)</h3>
      <p>
        The money inside the company isn't yours yet. To get it out, you eventually pay tax —
        either as a dividend, or (better) as a capital gain when you sell. So the retention
        pattern is really a <em>deferral</em>, not a permanent saving. But:
      </p>
      <ul>
        <li>Deferred tax is, in present-value terms, less tax (lesson 1.7).</li>
        <li>You may extract eventually at lower rates (BADR on sale, retirement years).</li>
        <li>While inside, the money compounds at the corporate rate, not your personal rate.</li>
      </ul>

      <h3>What to take away</h3>
      <ul>
        <li>The company is the cheapest place to keep money inside the country.</li>
        <li>Extract only what you need; let the rest compound.</li>
        <li>This is the single biggest reason limited companies exist for founders.</li>
      </ul>
    </>
  );
}

function RetainWidget() {
  const [extractionPct, setExtractionPct] = useState(0.5);

  const annualPostTaxProfit = 80_000;
  const personalTaxOnExtracted = 0.36; // illustrative blended for higher-rate dividends
  const corpReturn = 0.07;
  const personalReturn = 0.03; // post-tax savings rate

  const data = useMemo(() => {
    const out: { year: number; companyPot: number; personalPot: number }[] = [];
    let company = 0;
    let personal = 0;
    for (let i = 1; i <= 15; i++) {
      const extracted = annualPostTaxProfit * extractionPct;
      const retained = annualPostTaxProfit - extracted;
      const personalKept = extracted * (1 - personalTaxOnExtracted);
      personal = personal * (1 + personalReturn) + personalKept;
      company = company * (1 + corpReturn) + retained;
      out.push({ year: i, companyPot: Math.round(company), personalPot: Math.round(personal) });
    }
    return out;
  }, [extractionPct]);

  const last = data[data.length - 1];
  const total = (last?.companyPot ?? 0) + (last?.personalPot ?? 0);

  return (
    <div className="not-prose my-6 rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <label className="block">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-sm font-medium">% of post-tax profit extracted each year</span>
          <span className="font-mono tabular-nums">{Math.round(extractionPct * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={extractionPct}
          onChange={(e) => setExtractionPct(Number(e.target.value))}
          className="w-full accent-accent-600"
        />
      </label>

      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
            <XAxis dataKey="year" stroke="currentColor" fontSize={11} />
            <YAxis stroke="currentColor" fontSize={11} tickFormatter={(v) => `£${v / 1000}k`} />
            <Tooltip
              contentStyle={{
                background: 'var(--tooltip-bg, #ffffff)',
                border: '1px solid rgba(120,130,145,0.3)',
                fontSize: 12,
                borderRadius: 8,
              }}
              formatter={(v: number, name) => [formatGBP(v), name]}
            />
            <Line
              type="monotone"
              dataKey="companyPot"
              name="Inside company (compounding at 7%)"
              stroke="#ca8a04"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="personalPot"
              name="Personal savings (after-tax, 3%)"
              stroke="#2e956a"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Stat label="Inside company (Y15)" value={formatGBP(last?.companyPot ?? 0)} tone="retain" />
        <Stat label="Personal savings (Y15)" value={formatGBP(last?.personalPot ?? 0)} tone="net" />
        <Stat label="Combined wealth" value={formatGBP(total)} bold />
      </div>
      <p className="mt-3 text-xs text-ink-500 dark:text-ink-400">
        At 0% extraction, all £80k/year compounds at corporate rates. At 100%, you pay personal
        tax each year and the rest grows in your taxable savings at lower returns.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  bold,
}: {
  label: string;
  value: string;
  tone?: 'retain' | 'net';
  bold?: boolean;
}) {
  return (
    <div className="rounded-lg border border-ink-200 p-3 dark:border-ink-700">
      <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {label}
      </div>
      <div
        className={
          'font-mono tabular-nums ' +
          (bold ? 'text-base font-semibold ' : 'text-sm ') +
          (tone === 'retain'
            ? 'text-yellow-700 dark:text-yellow-300'
            : tone === 'net'
            ? 'text-accent-700 dark:text-accent-300'
            : '')
        }
      >
        {value}
      </div>
    </div>
  );
}
