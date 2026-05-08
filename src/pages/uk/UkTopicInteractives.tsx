import {
  ShowWithMyNumbers,
  type InputSpec,
} from '../../components/ui/ShowWithMyNumbers';
import { computeSalaryAndDividends, ltdResult } from '../../lib/tax';
import {
  CT_MAIN_RATE,
  CT_SMALL_RATE,
  PERSONAL_ALLOWANCE,
  VAT_REGISTRATION_THRESHOLD,
} from '../../lib/constants';
import { formatGBP, formatPct } from '../../lib/format';

/**
 * Per-UK-topic "Show me with my numbers" panels. Renders nothing if the
 * topic doesn't have a calculation worth personalising — most do.
 */
export function UkTopicInteractives({ topicId }: { topicId: string }) {
  switch (topicId) {
    case 'corporation-tax':
      return <CtPanel />;
    case 'income-tax':
      return <IncomeTaxPanel />;
    case 'salary-vs-dividend':
      return <SalaryVsDividendPanel />;
    case 'dividends':
      return <DividendsPanel />;
    case 'vat':
      return <VatPanel />;
    case 'pensions':
      return <PensionExtractionPanel />;
    case 'rd':
      return <RdPanel />;
    default:
      return null;
  }
}

function CtPanel() {
  const inputs: InputSpec[] = [
    { key: 'annualRevenue', defaultValue: 250_000, min: 0, step: 1_000 },
    { key: 'annualCosts', defaultValue: 80_000, min: 0, step: 1_000 },
  ];
  return (
    <ShowWithMyNumbers
      title="Show me with my numbers — what corporation tax do I actually pay?"
      inputs={inputs}
      render={({ values }) => {
        const r = values.annualRevenue ?? 0;
        const c = values.annualCosts ?? 0;
        const profit = Math.max(0, r - c);
        const ltd = ltdResult({
          revenue: r,
          costs: c,
          ownerSalary: 12_570,
          desiredCash: 0,
        });
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            <Box label="Profit (after director salary)" value={formatGBP(ltd.preTaxProfit)} />
            <Box label="Corporation tax due" value={formatGBP(ltd.corporationTax.total)} tone="bad" />
            <Box
              label="Effective CT rate"
              value={formatPct(profit > 0 ? ltd.corporationTax.effectiveRate : 0)}
            />
          </div>
        );
      }}
    />
  );
}

function IncomeTaxPanel() {
  const inputs: InputSpec[] = [
    { key: 'personalIncomeNeed', defaultValue: 75_000, min: 0, step: 500 },
  ];
  return (
    <ShowWithMyNumbers
      title="Show me with my numbers — income tax & NI on a salary"
      inputs={inputs}
      render={({ values }) => {
        const salary = values.personalIncomeNeed ?? 0;
        const mix = computeSalaryAndDividends(salary, 0);
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            <Box label="Gross salary" value={formatGBP(salary)} />
            <Box label="Income tax" value={formatGBP(mix.itOnSalary)} tone="bad" />
            <Box label="Employee NI" value={formatGBP(mix.employeeNI)} tone="bad" />
            <Box label="Net to you" value={formatGBP(mix.netSalary)} tone="ok" />
            <Box
              label="Effective rate"
              value={formatPct(salary > 0 ? (mix.itOnSalary + mix.employeeNI) / salary : 0)}
            />
            <Box
              label="Personal allowance left"
              value={formatGBP(Math.max(0, mix.pa - Math.min(salary, PERSONAL_ALLOWANCE)))}
            />
          </div>
        );
      }}
    />
  );
}

function SalaryVsDividendPanel() {
  const inputs: InputSpec[] = [
    { key: 'annualRevenue', defaultValue: 150_000, min: 0, step: 1_000 },
    { key: 'annualCosts', defaultValue: 30_000, min: 0, step: 500 },
    { key: 'personalIncomeNeed', defaultValue: 50_000, min: 0, step: 500 },
  ];
  return (
    <ShowWithMyNumbers
      title="Show me with my numbers — salary-only vs. salary+dividends"
      inputs={inputs}
      render={({ values }) => {
        const r = values.annualRevenue ?? 0;
        const c = values.annualCosts ?? 0;
        const need = values.personalIncomeNeed ?? 0;
        // Salary-only: pay enough salary to net `need` after tax+NI (rough — bisect)
        const salaryOnly = ltdResult({
          revenue: r,
          costs: c,
          ownerSalary: bisectSalaryForNet(need),
          desiredCash: need,
        });
        const balanced = ltdResult({
          revenue: r,
          costs: c,
          ownerSalary: 12_570,
          desiredCash: need,
        });
        const diff = salaryOnly.totalTaxToHmrc - balanced.totalTaxToHmrc;
        return (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Box
                label="Total tax — salary only"
                value={formatGBP(salaryOnly.totalTaxToHmrc)}
                tone="bad"
              />
              <Box
                label="Total tax — PA salary + dividends"
                value={formatGBP(balanced.totalTaxToHmrc)}
                tone="bad"
              />
            </div>
            <Box
              label={
                diff > 0
                  ? `Salary+dividend saves you about ${formatGBP(diff)}`
                  : 'Salary-only happens to win for these numbers'
              }
              value={formatGBP(Math.abs(diff))}
              tone={diff > 0 ? 'ok' : 'warn'}
              full
            />
            <p className="text-[12px] text-ink-500 dark:text-ink-400">
              Illustrative only — ignores pension, R&D, and the £100k taper for clarity.
            </p>
          </div>
        );
      }}
    />
  );
}

function DividendsPanel() {
  const inputs: InputSpec[] = [
    { key: 'personalIncomeNeed', defaultValue: 40_000, min: 0, step: 500 },
  ];
  return (
    <ShowWithMyNumbers
      title="Show me with my numbers — dividend tax on £X of dividends"
      inputs={inputs}
      render={({ values }) => {
        const div = values.personalIncomeNeed ?? 0;
        const mix = computeSalaryAndDividends(12_570, div);
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            <Box label="Salary (PA)" value={formatGBP(12_570)} />
            <Box label="Dividend declared" value={formatGBP(div)} />
            <Box label="Dividend tax" value={formatGBP(mix.totalDividendTax)} tone="bad" />
            <Box label="Net dividends to you" value={formatGBP(mix.netDividends)} tone="ok" />
            <Box
              label="Effective dividend rate"
              value={formatPct(div > 0 ? mix.totalDividendTax / div : 0)}
            />
          </div>
        );
      }}
    />
  );
}

function VatPanel() {
  const inputs: InputSpec[] = [
    {
      key: 'annualRevenue',
      defaultValue: 95_000,
      min: 0,
      step: 1_000,
      hint: 'Your taxable turnover over a rolling 12 months.',
    },
  ];
  return (
    <ShowWithMyNumbers
      title="Show me with my numbers — am I close to the VAT threshold?"
      inputs={inputs}
      render={({ values }) => {
        const r = values.annualRevenue ?? 0;
        const over = r - VAT_REGISTRATION_THRESHOLD;
        const monthlyAllowance = (VAT_REGISTRATION_THRESHOLD - r) / 12;
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <Box
              label="VAT threshold"
              value={formatGBP(VAT_REGISTRATION_THRESHOLD)}
            />
            <Box
              label={over >= 0 ? 'Over threshold by' : 'Headroom remaining'}
              value={formatGBP(Math.abs(over))}
              tone={over >= 0 ? 'bad' : 'ok'}
            />
            {over < 0 && (
              <Box
                label="Average per month before crossing"
                value={formatGBP(Math.max(0, monthlyAllowance))}
                full
              />
            )}
            {over >= 0 && (
              <Box
                label="VAT you may need to charge on the next £10k of sales"
                value={formatGBP(2_000)}
                tone="warn"
                full
              />
            )}
          </div>
        );
      }}
    />
  );
}

function PensionExtractionPanel() {
  const inputs: InputSpec[] = [
    { key: 'pensionContribution', defaultValue: 30_000, min: 0, max: 60_000, step: 500 },
  ];
  return (
    <ShowWithMyNumbers
      title="Show me with my numbers — what does £X of company pension save?"
      inputs={inputs}
      render={({ values }) => {
        const contrib = values.pensionContribution ?? 0;
        // Saved CT at small-profits rate, plus avoided NI + dividend tax (illustrative).
        const ctSaved = contrib * CT_SMALL_RATE;
        const ctSavedMain = contrib * CT_MAIN_RATE;
        const dividendEquivalentNet = contrib * 0.4865; // illustrative round trip
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <Box
              label="CT saved (small-profits rate)"
              value={formatGBP(ctSaved)}
              tone="ok"
            />
            <Box
              label="CT saved (main rate)"
              value={formatGBP(ctSavedMain)}
              tone="ok"
            />
            <Box
              label="If extracted as dividend, you'd net about"
              value={formatGBP(dividendEquivalentNet)}
              tone="warn"
              full
            />
            <Box
              label="In a pension, you keep the full £"
              value={formatGBP(contrib)}
              tone="ok"
              full
            />
          </div>
        );
      }}
    />
  );
}

function RdPanel() {
  const inputs: InputSpec[] = [
    {
      key: 'rdEligibleSpend',
      defaultValue: 60_000,
      min: 0,
      step: 1_000,
      hint: 'Annual qualifying R&D spend (staff, subcontractors, software).',
    },
  ];
  return (
    <ShowWithMyNumbers
      title="Show me with my numbers — what could R&D credits be worth?"
      inputs={inputs}
      render={({ values }) => {
        const spend = values.rdEligibleSpend ?? 0;
        const benefit = spend * 0.162; // illustrative merged-scheme net benefit
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <Box label="Qualifying R&D spend" value={formatGBP(spend)} />
            <Box
              label="Illustrative net benefit"
              value={formatGBP(benefit)}
              tone="ok"
            />
          </div>
        );
      }}
    />
  );
}

// Quick bisection: salary that nets approximately `target` (ignoring dividends).
function bisectSalaryForNet(target: number): number {
  let lo = 0;
  let hi = 250_000;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const net = computeSalaryAndDividends(mid, 0).netSalary;
    if (net >= target) hi = mid;
    else lo = mid;
  }
  return Math.round(hi);
}

function Box({
  label,
  value,
  tone,
  full,
}: {
  label: string;
  value: string;
  tone?: 'ok' | 'bad' | 'warn';
  full?: boolean;
}) {
  const colour =
    tone === 'ok'
      ? 'text-accent-700 dark:text-accent-300'
      : tone === 'bad'
        ? 'text-danger-500'
        : tone === 'warn'
          ? 'text-yellow-700 dark:text-yellow-300'
          : 'text-ink-800 dark:text-ink-100';
  return (
    <div
      className={
        'rounded-lg border border-ink-200 p-3 dark:border-ink-700 ' +
        (full ? 'sm:col-span-2' : '')
      }
    >
      <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {label}
      </div>
      <div className={`mt-1 font-mono text-sm font-semibold tabular-nums ${colour}`}>
        {value}
      </div>
    </div>
  );
}
