import { useMemo, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import { Slider } from '../../components/ui/Slider';
import { ltdResult, soleTraderResult } from '../../lib/tax';
import { formatGBP, formatPct } from '../../lib/format';
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
import { FullscreenDiagram } from '../../components/diagrams/CashFlowDiagram';
import { buildLtdFlow, buildSoleTraderFlow } from '../../components/diagrams/buildFlow';

const SAME_EXAMPLE = {
  revenue: 100_000,
  costs: 30_000,
  desiredCash: 40_000,
};

export function StructureCompare() {
  const [revenue, setRevenue] = useState(SAME_EXAMPLE.revenue);
  const [costs, setCosts] = useState(SAME_EXAMPLE.costs);
  const [desired, setDesired] = useState(SAME_EXAMPLE.desiredCash);

  const sole = useMemo(() => soleTraderResult(revenue, costs), [revenue, costs]);
  const ltdLow = useMemo(
    () =>
      ltdResult({
        revenue,
        costs,
        ownerSalary: 12_570,
        desiredCash: desired,
      }),
    [revenue, costs, desired],
  );
  const ltdHigh = useMemo(
    () =>
      ltdResult({
        revenue,
        costs,
        ownerSalary: 70_000,
        desiredCash: desired,
      }),
    [revenue, costs, desired],
  );
  const ltdRetain = useMemo(
    () =>
      ltdResult({
        revenue,
        costs,
        ownerSalary: 12_570,
        desiredCash: 0,
      }),
    [revenue, costs],
  );

  const data = [
    {
      name: 'Sole trader',
      net: Math.round(sole.netToOwner),
      retained: 0,
      tax: Math.round(sole.totalTax),
    },
    {
      name: 'Ltd · low salary + dividend',
      net: Math.round(ltdLow.ownerTotalNet),
      retained: Math.round(ltdLow.companyRetained),
      tax: Math.round(ltdLow.totalTaxToHmrc),
    },
    {
      name: 'Ltd · high salary',
      net: Math.round(ltdHigh.ownerTotalNet),
      retained: Math.round(ltdHigh.companyRetained),
      tax: Math.round(ltdHigh.totalTaxToHmrc),
    },
    {
      name: 'Ltd · retain everything',
      net: Math.round(ltdRetain.ownerTotalNet),
      retained: Math.round(ltdRetain.companyRetained),
      tax: Math.round(ltdRetain.totalTaxToHmrc),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Structures"
        title="Compare side-by-side"
        description="The same business profit run through different structures and extraction strategies. Identical inputs, very different outputs."
        pageId="structures/compare"
      />
      <DisclaimerBanner compact />

      <section className="card-pad grid gap-4 md:grid-cols-3">
        <Slider
          label="Revenue"
          value={revenue}
          min={20_000}
          max={1_000_000}
          step={1_000}
          onChange={setRevenue}
        />
        <Slider
          label="Costs"
          value={costs}
          min={0}
          max={Math.max(50_000, revenue)}
          step={500}
          onChange={setCosts}
        />
        <Slider
          label="Personal cash needed"
          value={desired}
          min={0}
          max={300_000}
          step={1_000}
          onChange={setDesired}
        />
      </section>

      <section className="card-pad">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Same money, different structures
        </h3>
        <div className="mt-3 h-72 w-full">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
              <XAxis dataKey="name" stroke="currentColor" fontSize={11} />
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
              <Bar dataKey="net" stackId="a" name="Net to owner" fill="#4cb083" />
              <Bar dataKey="retained" stackId="a" name="Retained in company" fill="#ca8a04" />
              <Bar dataKey="tax" stackId="a" name="Tax to HMRC" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-200 text-left dark:border-ink-800">
            <tr>
              <th className="px-4 py-3 font-medium">Strategy</th>
              <th className="px-4 py-3 text-right font-medium">Net to owner</th>
              <th className="px-4 py-3 text-right font-medium">Retained</th>
              <th className="px-4 py-3 text-right font-medium">Tax</th>
              <th className="px-4 py-3 text-right font-medium">Effective rate</th>
            </tr>
          </thead>
          <tbody className="[&_tr]:border-b [&_tr]:border-ink-200/60 dark:[&_tr]:border-ink-800/60 [&_tr:last-child]:border-0">
            {data.map((d) => {
              const operating = revenue - costs;
              const rate = operating > 0 ? d.tax / operating : 0;
              return (
                <tr key={d.name}>
                  <td className="px-4 py-3">{d.name}</td>
                  <td className="px-4 py-3 text-right font-mono text-accent-700 dark:text-accent-300">
                    {formatGBP(d.net)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-yellow-700 dark:text-yellow-300">
                    {formatGBP(d.retained)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-danger-500">
                    {formatGBP(d.tax)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{formatPct(rate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <FlowSection title="Sole trader" flow={buildSoleTraderFlow(sole)} />
        <FlowSection title="Ltd — low salary + dividend (balanced)" flow={buildLtdFlow(ltdLow)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <FlowSection title="Ltd — high salary" flow={buildLtdFlow(ltdHigh)} />
        <FlowSection title="Ltd — retain everything (no extraction)" flow={buildLtdFlow(ltdRetain)} />
      </section>
    </div>
  );
}

function FlowSection({
  title,
  flow,
}: {
  title: string;
  flow: ReturnType<typeof buildSoleTraderFlow> | ReturnType<typeof buildLtdFlow>;
}) {
  return (
    <div className="card overflow-hidden">
      <header className="border-b border-ink-200 px-4 py-3 dark:border-ink-800">
        <div className="text-sm font-semibold">{title}</div>
      </header>
      <div className="px-2 py-3 sm:px-3">
        <FullscreenDiagram title={title} {...flow} />
      </div>
    </div>
  );
}
