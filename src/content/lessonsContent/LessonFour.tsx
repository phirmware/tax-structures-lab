import { useState } from 'react';
import { formatGBP, formatPct } from '../../lib/format';

export function LessonFour() {
  return (
    <>
      <h2>Why the same money is taxed differently</h2>
      <p>
        Every developed economy taxes <strong>ordinary income</strong> (your salary, your
        business profit) at higher rates than <strong>capital gains</strong> (the increase in
        value of an asset you own — shares, property, a business).
      </p>
      <p>
        This isn't an accident. Governments do it deliberately. Capital gains rates are kept
        lower to encourage <em>investment</em>. The idea is that society benefits when capital is
        deployed into productive things — companies, factories, R&D — rather than spent on
        consumption. Lower CGT rates are the reward for taking that risk.
      </p>

      <h3>What this means for founders</h3>
      <p>
        You have two ways to extract money from a company you own:
      </p>
      <ul>
        <li>
          <strong>Ordinary income</strong>: salary or dividends. Taxed at your personal income
          or dividend rates.
        </li>
        <li>
          <strong>Capital gains</strong>: sell some or all of your shares. Taxed at CGT rates,
          typically much lower.
        </li>
      </ul>
      <p>
        For ongoing operations you can't avoid the first. But for the <em>big</em> moments —
        selling the business, partial buyouts, share schemes for staff — capital-gains
        treatment can dwarf the difference between any two extraction strategies.
      </p>

      <h3>Interactive: same £100k, classified differently</h3>
      <p>
        Move the slider to see what happens to a £100,000 windfall depending on its label.
      </p>

      <ClassificationWidget />

      <h3>The watch-out: HMRC cares about substance</h3>
      <p>
        You can't just slap a "capital gain" label on something that economically is salary.
        Tax authorities have decades of case law to reclassify disguised remuneration. The
        capital-gains advantage is real, but only when the underlying economic event is real
        too — you actually built equity, you actually sold it, the buyer is at arm's length.
      </p>
      <p>
        The same caution applies to dividends-vs-salary in single-shareholder companies, and to
        IR35 contractor cases. The pattern is: if the law thinks you're disguising income, the
        law will reclassify it.
      </p>

      <h3>What to take away</h3>
      <ul>
        <li>Capital gains are taxed lower than ordinary income, by design, almost everywhere.</li>
        <li>For founders, this is most relevant on <strong>exit</strong>.</li>
        <li>The label only sticks if the substance backs it up.</li>
      </ul>
    </>
  );
}

const RATES = {
  salary: { label: 'Salary (40% IT + 2% NI)', rate: 0.42, lever: 'Top slice IT + NI' },
  dividend: { label: 'Dividend (higher rate)', rate: 0.3375, lever: 'IT-class but lower bands' },
  cgt: { label: 'Capital gains (24%)', rate: 0.24, lever: 'Capital gains tax band' },
  badr: { label: 'BADR capital gain (14%)', rate: 0.14, lever: 'Special founder relief' },
};

function ClassificationWidget() {
  const [amount, setAmount] = useState(100_000);

  return (
    <div className="not-prose my-6 rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <label className="block">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-sm font-medium">Amount</span>
          <span className="font-mono tabular-nums">{formatGBP(amount)}</span>
        </div>
        <input
          type="range"
          min={10_000}
          max={1_000_000}
          step={5_000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full accent-accent-600"
        />
      </label>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {Object.entries(RATES).map(([k, v]) => {
          const tax = amount * v.rate;
          const net = amount - tax;
          return (
            <div
              key={k}
              className="rounded-lg border border-ink-200 p-3 dark:border-ink-700"
            >
              <div className="text-xs font-semibold">{v.label}</div>
              <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                <span className="text-ink-500 dark:text-ink-400">Tax</span>
                <span className="text-right font-mono text-danger-500">
                  {formatGBP(tax)}
                </span>
                <span className="text-ink-500 dark:text-ink-400">Net</span>
                <span className="text-right font-mono text-accent-700 dark:text-accent-300">
                  {formatGBP(net)}
                </span>
                <span className="text-ink-500 dark:text-ink-400">Rate</span>
                <span className="text-right font-mono">{formatPct(v.rate)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs italic text-ink-500 dark:text-ink-400">
        From {formatGBP(amount * RATES.badr.rate)} (BADR) to{' '}
        {formatGBP(amount * RATES.salary.rate)} (salary) — same £{(amount / 1000).toFixed(0)}k. The label changes the bill.
      </p>
    </div>
  );
}
