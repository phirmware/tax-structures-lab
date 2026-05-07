import { useState } from 'react';
import { formatGBP, formatPct } from '../../lib/format';

export function LessonTwo() {
  return (
    <>
      <h2>Three different things, three different bills</h2>
      <p>
        When founders talk about "making" money, they often blur three separate things:
      </p>
      <ul>
        <li>
          <strong>Revenue</strong> — what comes <em>in</em>. The headline number on an invoice.
        </li>
        <li>
          <strong>Profit</strong> — what's <em>left</em> after costs. The thing you actually
          earned.
        </li>
        <li>
          <strong>Wealth</strong> — what you <em>accumulate</em> across years. The thing that
          changes your life.
        </li>
      </ul>
      <p>
        These three are taxed differently, treated differently in conversation, and confused
        constantly. The whole tax system makes a lot more sense once you keep them separate.
      </p>

      <h3>Why the distinction matters</h3>
      <p>
        Tax is on profit, not revenue. This is the single most important sentence in this
        curriculum. A business with £1m of revenue and £1m of cost owes no tax. A business
        with £100k of revenue and £20k of cost owes tax on £80k. Two very different revenues, but
        the second one made you (a little) wealthier.
      </p>
      <p>
        That's why expense management is not just bookkeeping hygiene — it directly determines
        the size of the taxable number.
      </p>

      <h3>Interactive: same revenue, different worlds</h3>
      <p>
        Move the costs slider. Watch revenue stay constant while profit, tax, and wealth-built
        all change.
      </p>

      <SliderWidget />

      <h3>Wealth is the thing you actually keep</h3>
      <p>
        Wealth isn't a single year's number. It's what's left in your pocket (or your company's
        bank account, or your pension, or your shares) after years of profit. The whole reason
        we care about tax efficiency is that even a small percentage saved each year compounds
        across a career into something significant.
      </p>
      <blockquote>
        Revenue is what you say at parties. Profit is what your accountant talks about. Wealth
        is what you actually have.
      </blockquote>

      <h3>What to take away</h3>
      <ul>
        <li>You are taxed on <strong>profit</strong>, not revenue.</li>
        <li>
          Anything that legitimately reduces profit reduces tax. This is why understanding what
          counts as a deductible cost matters (lesson 1.6).
        </li>
        <li>Wealth is the integral of profit over time, with tax leaks taken out at each step.</li>
      </ul>
    </>
  );
}

function SliderWidget() {
  const [revenue] = useState(200_000);
  const [costs, setCosts] = useState(80_000);

  const profit = Math.max(0, revenue - costs);
  // Use a flat 25% effective rate just to show the relationship — not a real calc.
  const tax = profit * 0.25;
  const wealthBuilt = profit - tax;

  return (
    <div className="not-prose my-6 rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Revenue" value={formatGBP(revenue)} />
        <Stat label="Costs" value={formatGBP(costs)} tone="warn" />
        <Stat label="Profit" value={formatGBP(profit)} />
      </div>
      <input
        type="range"
        className="mt-4 w-full accent-accent-600"
        min={0}
        max={revenue}
        step={1_000}
        value={costs}
        onChange={(e) => setCosts(Number(e.target.value))}
      />
      <div className="mt-2 flex items-center justify-between text-xs text-ink-500 dark:text-ink-400">
        <span>£0 costs</span>
        <span>£{(revenue / 1000).toFixed(0)}k costs</span>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Bar
          label="Tax (illustrative 25%)"
          value={tax}
          max={revenue}
          className="bg-danger-500"
        />
        <Bar
          label="Wealth built this year"
          value={wealthBuilt}
          max={revenue}
          className="bg-accent-500"
        />
      </div>
      <p className="mt-3 text-xs text-ink-500 dark:text-ink-400">
        Same revenue, dramatically different outcomes. Tax is{' '}
        {formatPct(profit > 0 ? tax / profit : 0)} of profit, not of revenue.
      </p>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'warn' }) {
  return (
    <div className="rounded-lg border border-ink-200 p-3 dark:border-ink-700">
      <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {label}
      </div>
      <div
        className={
          'font-mono text-base font-semibold tabular-nums ' +
          (tone === 'warn' ? 'text-warn-500' : '')
        }
      >
        {value}
      </div>
    </div>
  );
}

function Bar({
  label,
  value,
  max,
  className,
}: {
  label: string;
  value: number;
  max: number;
  className: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span>{label}</span>
        <span className="font-mono">{formatGBP(value)}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
        <div
          className={`h-full transition-[width] duration-300 ${className}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
