import { useState } from 'react';
import { BADR_RATE, DIV_HIGHER } from '../../lib/constants';
import { formatGBP, formatPct } from '../../lib/format';

export function LessonThree() {
  return (
    <>
      <h2>Three levers, one principle</h2>
      <p>
        If you remember nothing else from this curriculum, remember this:
      </p>
      <blockquote>
        You only pay tax on what the law defines as taxable income, in the year it's defined as
        taxable, at the rate that applies to that type of income.
      </blockquote>
      <p>That sentence has three levers buried in it:</p>
      <ul>
        <li>
          <strong>What</strong> is taxable — labels matter. Salary, dividends, capital gains,
          interest, royalties, rent: all "income," all taxed differently.
        </li>
        <li>
          <strong>When</strong> it's taxable — timing matters. Pre-tax, post-tax, deferred,
          accelerated, recognised this year vs. next.
        </li>
        <li>
          <strong>How</strong> (at what rate) — structure matters. Personal rate vs. corporate
          rate vs. capital-gains rate.
        </li>
      </ul>
      <p>
        Every tax planning idea you'll meet — pensions, EIS, BADR, salary-vs-dividend, holding
        companies, R&D credits — is just a way of pulling one or more of these three levers.
      </p>

      <h3>The same £100,000 — three different bills</h3>
      <p>
        Try the toy below. Same £100k, classified three different ways.
      </p>

      <ThreeLevers />

      <h3>How to think about this in practice</h3>
      <p>
        When you get a piece of advice from your accountant, ask which lever it's pulling. "Pay
        a bonus into your pension" — that's the <em>when</em> lever (deferral) plus the{' '}
        <em>what</em> lever (re-classifying salary into pension contribution). "Sell shares
        through BADR" — that's the <em>what</em> lever (turning what could be dividends into
        capital gains) plus the <em>how</em> lever (preferential rate).
      </p>
      <p>
        If you can name the lever, you can usually figure out whether the advice makes sense for
        your situation.
      </p>

      <h3>What to take away</h3>
      <ul>
        <li>Three levers: <strong>what</strong>, <strong>when</strong>, <strong>how</strong>.</li>
        <li>Every tax strategy is a combination of these.</li>
        <li>If a piece of advice doesn't map to one of them, ask harder questions.</li>
      </ul>
    </>
  );
}

const SCENARIOS = [
  {
    id: 'salary',
    label: 'As salary',
    rate: 0.42, // 40% IT + 2% NI on additional-rate margin (illustrative)
    note: 'Top slice: 40% income tax + 2% NI. Worst of the three rate-wise.',
    lever: 'How (rate)',
  },
  {
    id: 'dividend',
    label: 'As dividend',
    rate: DIV_HIGHER,
    note: `Higher-rate dividend tax ${formatPct(DIV_HIGHER)} — but you also need to have already paid corporation tax to declare it.`,
    lever: 'What (classification)',
  },
  {
    id: 'cgt',
    label: 'As capital gain (BADR)',
    rate: BADR_RATE,
    note: 'BADR rate on first £1m of qualifying gain. The "what" lever pulled hardest.',
    lever: 'What + How',
  },
  {
    id: 'pension',
    label: 'Into pension (deferred)',
    rate: 0.0,
    note: '0% today. Tax on the way out — often at lower rates. The "when" lever.',
    lever: 'When (deferral)',
  },
];

function ThreeLevers() {
  const [amount, setAmount] = useState(100_000);

  return (
    <div className="not-prose my-6 rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <label className="block">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-sm font-medium">Pre-tax amount</span>
          <span className="font-mono text-sm tabular-nums">{formatGBP(amount)}</span>
        </div>
        <input
          type="range"
          min={10_000}
          max={500_000}
          step={5_000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full accent-accent-600"
        />
      </label>

      <div className="mt-5 space-y-3">
        {SCENARIOS.map((s) => {
          const tax = amount * s.rate;
          const net = amount - tax;
          const pct = (net / amount) * 100;
          return (
            <div key={s.id}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 text-xs">
                <span className="font-medium">{s.label}</span>
                <span className="text-ink-500 dark:text-ink-400">
                  Lever: {s.lever}
                </span>
                <span className="font-mono">
                  Net {formatGBP(net)} · Tax {formatGBP(tax)}
                </span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
                <div className="bg-accent-500" style={{ width: `${pct}%` }} />
                <div className="bg-danger-500" style={{ width: `${100 - pct}%` }} />
              </div>
              <p className="mt-1 text-[11px] text-ink-500 dark:text-ink-400">{s.note}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs italic text-ink-500 dark:text-ink-400">
        Rates are illustrative; in real life the order matters (you need profit before dividends, etc).
      </p>
    </div>
  );
}
