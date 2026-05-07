import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Bar,
  BarChart,
} from 'recharts';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import { Slider } from '../../components/ui/Slider';
import {
  capitalGainsTax,
  ltdResult,
  multiYearLtd,
  type YearInput,
} from '../../lib/tax';
import { BADR_RATE, BADR_LIFETIME_LIMIT } from '../../lib/constants';
import { formatGBP, formatPct } from '../../lib/format';
import { NotesPanel } from '../../components/ui/NotesPanel';

interface MultiInputs {
  baseRevenue: number;
  baseCosts: number;
  desiredCash: number;
  ownerSalary: number;
  pension: number;
  revenueGrowth: number;
  reinvestReturn: number;
  years: number;
  exitMultiple: number;
  useBADR: boolean;
}

const DEFAULTS: MultiInputs = {
  baseRevenue: 200_000,
  baseCosts: 60_000,
  desiredCash: 60_000,
  ownerSalary: 12_570,
  pension: 30_000,
  revenueGrowth: 0.1,
  reinvestReturn: 0.07,
  years: 10,
  exitMultiple: 4,
  useBADR: true,
};

export function MultiYearLab() {
  const [inputs, setInputs] = useState<MultiInputs>(DEFAULTS);

  const data = useMemo(() => {
    const years: YearInput[] = [];
    for (let i = 0; i < inputs.years; i++) {
      const revenue = inputs.baseRevenue * Math.pow(1 + inputs.revenueGrowth, i);
      const costs = inputs.baseCosts * Math.pow(1 + inputs.revenueGrowth, i);
      years.push({
        revenue,
        costs,
        ownerSalary: inputs.ownerSalary,
        desiredCash: inputs.desiredCash,
        pensionContribution: inputs.pension,
      });
    }
    const path = multiYearLtd(years, inputs.reinvestReturn);
    const lastYear = path[path.length - 1];
    const finalRetained = lastYear.cumulativeRetained;
    const totalNetExtracted = path.reduce((s, y) => s + y.ownerTotalNet, 0);
    const totalTaxYearly = path.reduce((s, y) => s + y.totalTaxToHmrc, 0);
    // Exit value: simple multiple of last year's post-tax profit + retained cash.
    const exitValue =
      lastYear.postTaxProfit * inputs.exitMultiple + finalRetained;
    // CGT on the exit. BADR for the first £1m at reduced rate; remainder at 24%.
    const badrSlice = inputs.useBADR
      ? Math.min(exitValue, BADR_LIFETIME_LIMIT)
      : 0;
    const remainder = exitValue - badrSlice;
    const cgt = capitalGainsTax(remainder, 0).total + badrSlice * BADR_RATE;

    return {
      path,
      finalRetained,
      totalNetExtracted,
      totalTaxYearly,
      exitValue,
      cgt,
      netExit: exitValue - cgt,
      effectiveExitRate: exitValue > 0 ? cgt / exitValue : 0,
      grandTotal: totalNetExtracted + (exitValue - cgt),
    };
  }, [inputs]);

  // Comparison: extract everything as dividends every year (no retention)
  const noRetainData = useMemo(() => {
    let totalNet = 0;
    let totalTax = 0;
    for (let i = 0; i < inputs.years; i++) {
      const revenue = inputs.baseRevenue * Math.pow(1 + inputs.revenueGrowth, i);
      const costs = inputs.baseCosts * Math.pow(1 + inputs.revenueGrowth, i);
      const r = ltdResult({
        revenue,
        costs,
        ownerSalary: inputs.ownerSalary,
        desiredCash: 1e9, // effectively: extract everything possible
        pensionContribution: 0,
      });
      totalNet += r.ownerTotalNet;
      totalTax += r.totalTaxToHmrc;
    }
    return { totalNet, totalTax };
  }, [inputs]);

  const update = (patch: Partial<MultiInputs>) => setInputs((p) => ({ ...p, ...patch }));

  const chartData = data.path.map((y) => ({
    year: `Y${y.year}`,
    netExtracted: Math.round(y.ownerTotalNet),
    retained: Math.round(y.companyRetained),
    cumulativeRetained: Math.round(y.cumulativeRetained),
    tax: Math.round(y.totalTaxToHmrc),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cash Flow Lab"
        title="Multi-year mode"
        description="The structural decision in year 1 produces compounding differences over a decade. Watch the gap widen between extract-everything and retain-and-compound."
        pageId="lab/multi-year"
      />
      <DisclaimerBanner compact />

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="card-pad space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Inputs
            </h2>
            <Slider
              label="Year 1 revenue"
              value={inputs.baseRevenue}
              min={50_000}
              max={2_000_000}
              step={5_000}
              onChange={(v) => update({ baseRevenue: v })}
            />
            <Slider
              label="Year 1 costs"
              value={inputs.baseCosts}
              min={0}
              max={Math.max(50_000, inputs.baseRevenue)}
              step={1_000}
              onChange={(v) => update({ baseCosts: v })}
            />
            <Slider
              label="Personal cash needed / year"
              value={inputs.desiredCash}
              min={20_000}
              max={300_000}
              step={1_000}
              onChange={(v) => update({ desiredCash: v })}
            />
            <Slider
              label="Director salary"
              value={inputs.ownerSalary}
              min={0}
              max={150_000}
              step={500}
              onChange={(v) => update({ ownerSalary: v })}
            />
            <Slider
              label="Pension / year"
              value={inputs.pension}
              min={0}
              max={60_000}
              step={500}
              onChange={(v) => update({ pension: v })}
            />
            <Slider
              label="Revenue growth %"
              value={inputs.revenueGrowth}
              min={-0.1}
              max={0.5}
              step={0.01}
              onChange={(v) => update({ revenueGrowth: v })}
              format={(v) => formatPct(v)}
            />
            <Slider
              label="Retained-earnings return"
              value={inputs.reinvestReturn}
              min={0}
              max={0.2}
              step={0.005}
              onChange={(v) => update({ reinvestReturn: v })}
              format={(v) => formatPct(v)}
            />
            <Slider
              label="Years"
              value={inputs.years}
              min={3}
              max={20}
              step={1}
              onChange={(v) => update({ years: v })}
              format={(v) => `${v} years`}
            />

            <div className="border-t border-ink-200 pt-4 dark:border-ink-800">
              <Slider
                label="Exit multiple of final-year profit"
                value={inputs.exitMultiple}
                min={0}
                max={15}
                step={0.5}
                onChange={(v) => update({ exitMultiple: v })}
                format={(v) => `${v}× profit`}
              />
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={inputs.useBADR}
                  onChange={(e) => update({ useBADR: e.target.checked })}
                  className="h-4 w-4 rounded border-ink-300 text-accent-600 focus:ring-accent-500"
                />
                Apply BADR (14% on first £1m)
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryStat
              label="Net extracted (yearly)"
              value={data.totalNetExtracted}
              tone="net"
              hint={`Across ${inputs.years} years`}
            />
            <SummaryStat
              label="Cumulative retained"
              value={data.finalRetained}
              tone="retain"
              hint={`At ${formatPct(inputs.reinvestReturn)} reinvested`}
            />
            <SummaryStat
              label="Net at exit (after CGT)"
              value={data.netExit}
              tone="net"
              hint={`Exit ${formatGBP(data.exitValue)} · CGT ${formatGBP(data.cgt)} (${formatPct(
                data.effectiveExitRate,
              )})`}
            />
          </div>

          <section className="card-pad">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Yearly net vs. retained
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={chartData}>
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
                  <Bar dataKey="netExtracted" stackId="a" name="Net extracted" fill="#4cb083" />
                  <Bar dataKey="retained" stackId="a" name="Retained" fill="#ca8a04" />
                  <Bar dataKey="tax" stackId="a" name="Tax" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="card-pad">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Cumulative retained earnings
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <LineChart data={chartData}>
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
                  <Line
                    type="monotone"
                    dataKey="cumulativeRetained"
                    stroke="#ca8a04"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="card-pad">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Compare to extracting everything every year
            </h3>
            <table className="mt-3 w-full text-sm">
              <tbody className="[&_tr]:border-b [&_tr:last-child]:border-0 [&_tr]:border-ink-200/60 dark:[&_tr]:border-ink-800/60">
                <tr>
                  <td className="py-2">Net extracted (yearly retain strategy)</td>
                  <td className="py-2 text-right font-mono">{formatGBP(data.totalNetExtracted)}</td>
                </tr>
                <tr>
                  <td className="py-2">Net extracted (extract everything)</td>
                  <td className="py-2 text-right font-mono">
                    {formatGBP(noRetainData.totalNet)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">+ Net at exit (retain strategy, after CGT)</td>
                  <td className="py-2 text-right font-mono">{formatGBP(data.netExit)}</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">Total wealth (retain + reinvest + exit)</td>
                  <td className="py-2 text-right font-mono font-semibold text-accent-700 dark:text-accent-300">
                    {formatGBP(data.grandTotal)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">Total wealth (extract every year)</td>
                  <td className="py-2 text-right font-mono font-semibold">
                    {formatGBP(noRetainData.totalNet)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">Difference</td>
                  <td className="py-2 text-right font-mono font-semibold text-accent-700 dark:text-accent-300">
                    {formatGBP(data.grandTotal - noRetainData.totalNet)}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <NotesPanel pageId="lab/multi-year" />
        </div>
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number;
  hint?: string;
  tone?: 'net' | 'retain' | 'tax';
}) {
  const tones = {
    net: 'text-accent-700 dark:text-accent-300',
    retain: 'text-yellow-700 dark:text-yellow-300',
    tax: 'text-danger-500',
  };
  return (
    <div className="card-pad">
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {label}
      </div>
      <div className={`mt-1 font-mono text-2xl font-semibold ${tone ? tones[tone] : ''}`}>
        {formatGBP(value)}
      </div>
      {hint && <div className="mt-1 text-xs text-ink-500 dark:text-ink-400">{hint}</div>}
    </div>
  );
}
