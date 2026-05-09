import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Cell,
} from 'recharts';
import { formatGBP } from '../../lib/format';

export interface SeriesSpec {
  key: string;
  name: string;
  color: string;
}

/**
 * Multi-series line chart for time-evolution comparisons (e.g. pension pot vs
 * personal pot over N years). Data points each carry one or more series; the
 * caller supplies which series to plot.
 */
export function TimeSeriesChart({
  data,
  series,
  xKey = 'year',
  height = 240,
  yFormat = (v: number) => `£${Math.round(v / 1000)}k`,
}: {
  data: Array<Record<string, number>>;
  series: SeriesSpec[];
  xKey?: string;
  height?: number;
  yFormat?: (v: number) => string;
}) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
          <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
          <XAxis dataKey={xKey} stroke="currentColor" fontSize={11} />
          <YAxis stroke="currentColor" fontSize={11} tickFormatter={yFormat} />
          <Tooltip
            formatter={(v: number) => formatGBP(v)}
            contentStyle={{
              background: 'var(--tooltip-bg, #ffffff)',
              border: '1px solid rgba(120,130,145,0.3)',
              fontSize: 12,
              borderRadius: 8,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface ComparisonBar {
  label: string;
  value: number;
  color: string;
}

/**
 * Side-by-side bar chart for static comparisons (e.g. BADR savings: standard
 * CGT vs BADR rate). Each bar has its own colour to support the "good vs bad"
 * visual contrast.
 */
export function ComparisonBars({
  bars,
  height = 220,
  yFormat = (v: number) => `£${Math.round(v / 1000)}k`,
}: {
  bars: ComparisonBar[];
  height?: number;
  yFormat?: (v: number) => string;
}) {
  const data = bars.map((b) => ({
    label: b.label,
    value: Math.max(0, b.value),
    color: b.color,
  }));
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 16 }}>
          <CartesianGrid stroke="currentColor" strokeOpacity={0.08} vertical={false} />
          <XAxis
            dataKey="label"
            stroke="currentColor"
            fontSize={11}
            interval={0}
            tick={{ fontSize: 11 }}
          />
          <YAxis stroke="currentColor" fontSize={11} tickFormatter={yFormat} />
          <Tooltip
            formatter={(v: number) => formatGBP(v)}
            contentStyle={{
              background: 'var(--tooltip-bg, #ffffff)',
              border: '1px solid rgba(120,130,145,0.3)',
              fontSize: 12,
              borderRadius: 8,
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Standard semantic colours for charts to match the rest of the app. */
export const SIM_COLORS = {
  good: '#2e956a',
  warn: '#ca8a04',
  bad: '#dc2626',
  neutral: '#67738c',
  accent: '#4cb083',
};
