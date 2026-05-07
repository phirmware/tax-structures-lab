import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatGBP, formatPct } from '../../lib/format';

export function LessonSeven() {
  return (
    <>
      <h2>Pay later, in real terms pay less</h2>
      <p>
        £10,000 of tax due today and £10,000 of tax due ten years from now are not equal. The
        future bill, in present-value terms, is smaller. Every £1 you pay today could otherwise
        be invested and grow.
      </p>
      <p>
        That's why deferral — pushing tax into the future — is one of the highest-value moves
        in tax planning. Pensions defer. Capital allowances defer. Depreciation schedules
        defer. Even good cashflow timing within a year is a small form of deferral.
      </p>

      <h3>Acceleration too</h3>
      <p>
        The reverse also has uses. If you have unused tax-free allowances this year and not
        next, you might want to <em>accelerate</em> recognition of income. If your bands sit
        differently this year vs. next, you might want to time a bonus, a sale, or a dividend.
      </p>

      <h3>Interactive: present value of a deferred bill</h3>
      <p>
        Drag the years. Watch a £10,000 future tax bill shrink in today's terms as the discount
        rate compounds. Then change the rate and see how sensitive the answer is.
      </p>

      <PVWidget />

      <h3>The rule of thumb</h3>
      <p>
        Whenever an option puts the same eventual tax further away, you almost certainly want
        it — unless you have a reason to expect <em>higher</em> rates in the future for your
        specific situation. (And if you do, that's exactly the time to <em>accelerate</em>.)
      </p>

      <h3>Watch out for</h3>
      <ul>
        <li>
          Anti-forestalling rules — when a budget changes rates, governments often block last-minute acceleration.
        </li>
        <li>
          The fact that deferral works only if the deferred sum is being deployed (invested,
          compounded). Sitting in a low-yield account, the benefit is small.
        </li>
        <li>
          Personal life changes — retirement, emigration, divorce — can change which year is
          actually most efficient.
        </li>
      </ul>

      <h3>What to take away</h3>
      <ul>
        <li>Deferred tax is — in present-value terms — less tax.</li>
        <li>The benefit grows with the time horizon and the discount rate.</li>
        <li>The exception is a planned rate <em>increase</em>: that's when you accelerate.</li>
      </ul>
    </>
  );
}

function PVWidget() {
  const [years, setYears] = useState(10);
  const [discount, setDiscount] = useState(0.07);

  const tax = 10_000;

  const data = useMemo(() => {
    const out = [];
    for (let i = 0; i <= 30; i++) {
      const pv = tax / Math.pow(1 + discount, i);
      out.push({ year: i, pv: Math.round(pv) });
    }
    return out;
  }, [discount]);

  const pvNow = tax / Math.pow(1 + discount, years);
  const saved = tax - pvNow;

  return (
    <div className="not-prose my-6 rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-sm font-medium">Years until tax is paid</span>
            <span className="font-mono">{years}</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-accent-600"
          />
        </label>
        <label>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-sm font-medium">Annual return / discount rate</span>
            <span className="font-mono">{formatPct(discount)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={0.15}
            step={0.005}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-full accent-accent-600"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Future tax bill" value={formatGBP(tax)} />
        <Stat
          label={`PV today (in ${years}y)`}
          value={formatGBP(pvNow)}
          tone="net"
        />
        <Stat
          label="Effective deferral saving"
          value={formatGBP(saved)}
          tone="retain"
        />
      </div>

      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
            <XAxis dataKey="year" stroke="currentColor" fontSize={11} />
            <YAxis stroke="currentColor" fontSize={11} tickFormatter={(v) => `£${v / 1000}k`} />
            <Tooltip
              formatter={(v: number) => formatGBP(v)}
              contentStyle={{
                background: 'var(--tooltip-bg, #ffffff)',
                border: '1px solid rgba(120,130,145,0.3)',
                fontSize: 12,
                borderRadius: 8,
              }}
            />
            <Bar dataKey="pv" name="Present value" fill="#4cb083" />
          </BarChart>
        </ResponsiveContainer>
      </div>
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
  tone?: 'net' | 'retain';
}) {
  return (
    <div className="rounded-lg border border-ink-200 p-3 dark:border-ink-700">
      <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {label}
      </div>
      <div
        className={
          'font-mono text-base font-semibold tabular-nums ' +
          (tone === 'net'
            ? 'text-accent-700 dark:text-accent-300'
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
