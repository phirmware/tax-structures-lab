import {
  ShowWithMyNumbers,
  type InputSpec,
} from '../../components/ui/ShowWithMyNumbers';
import {
  computeSalaryAndDividends,
  ltdResult,
} from '../../lib/tax';
import {
  CGT_HIGHER,
  CT_MAIN_RATE,
  DIV_HIGHER,
  EIS_INCOME_TAX_RELIEF,
  IT_HIGHER,
  PERSONAL_ALLOWANCE,
  SEIS_INCOME_TAX_RELIEF,
} from '../../lib/constants';
import { formatGBP, formatPct } from '../../lib/format';

/**
 * Per-strategy simulators. Returns null for strategies without one — the
 * StrategyCard renders the panel slot only when this returns content.
 */
export function StrategySimulator({
  strategyId,
}: {
  strategyId: string;
}) {
  switch (strategyId) {
    case 'salary-vs-dividends':
      return <SalaryVsDividendsSim />;
    case 'pension-extraction':
      return <PensionExtractionSim />;
    case 'family-employment':
      return <FamilyEmploymentSim />;
    case 'borrow-against-listed':
      return <BorrowAgainstListedSim />;
    case 'eis-seis':
      return <EisSeisSim />;
    default:
      return null;
  }
}

// ------------------- Extraction --------------------

function SalaryVsDividendsSim() {
  const inputs: InputSpec[] = [
    { key: 'annualRevenue', defaultValue: 150_000, min: 0, step: 1_000 },
    { key: 'annualCosts', defaultValue: 30_000, min: 0, step: 500 },
    { key: 'personalIncomeNeed', defaultValue: 50_000, min: 0, step: 500 },
  ];
  return (
    <ShowWithMyNumbers
      title="Salary-only vs. PA-salary + dividends"
      inputs={inputs}
      render={({ values }) => {
        const r = values.annualRevenue ?? 0;
        const c = values.annualCosts ?? 0;
        const need = values.personalIncomeNeed ?? 0;
        const salaryOnly = ltdResult({
          revenue: r,
          costs: c,
          ownerSalary: bisectSalaryForNet(need),
          desiredCash: need,
        });
        const balanced = ltdResult({
          revenue: r,
          costs: c,
          ownerSalary: PERSONAL_ALLOWANCE,
          desiredCash: need,
        });
        const diff = salaryOnly.totalTaxToHmrc - balanced.totalTaxToHmrc;
        return (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Box
                label="Salary-only — total tax to HMRC"
                value={formatGBP(salaryOnly.totalTaxToHmrc)}
                tone="bad"
              />
              <Box
                label="PA + dividends — total tax to HMRC"
                value={formatGBP(balanced.totalTaxToHmrc)}
                tone="bad"
              />
            </div>
            <Box
              label={
                diff > 0
                  ? 'PA + dividends saves you'
                  : 'Salary-only narrowly wins for these numbers'
              }
              value={formatGBP(Math.abs(diff))}
              tone={diff > 0 ? 'ok' : 'warn'}
              full
            />
          </div>
        );
      }}
    />
  );
}

function PensionExtractionSim() {
  const inputs: InputSpec[] = [
    {
      key: 'pensionContribution',
      defaultValue: 30_000,
      min: 0,
      max: 60_000,
      step: 500,
    },
    { key: 'yearsHorizon', defaultValue: 20, min: 1, max: 40, step: 1 },
  ];
  return (
    <ShowWithMyNumbers
      title="Pension vs. dividend extraction over time"
      inputs={inputs}
      render={({ values }) => {
        const contribution = values.pensionContribution ?? 0;
        const years = Math.max(1, Math.round(values.yearsHorizon ?? 1));
        const growth = 0.07;

        const ctPaid = contribution * CT_MAIN_RATE;
        const dividendDeclared = contribution - ctPaid;
        const dividendTax = dividendDeclared * DIV_HIGHER;
        const personalStart = dividendDeclared - dividendTax;
        const personalPot = personalStart * Math.pow(1 + growth, years);

        const pensionGross = contribution * Math.pow(1 + growth, years);
        const lumpSum = pensionGross * 0.25;
        const taxedPortion = pensionGross * 0.75;
        const pensionNet = lumpSum + taxedPortion * (1 - IT_HIGHER);

        return (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Box
                label={`Pension net of draw tax — ${years} yrs`}
                value={formatGBP(pensionNet)}
                tone="ok"
              />
              <Box
                label={`Personal ISA pot — ${years} yrs`}
                value={formatGBP(personalPot)}
                tone="warn"
              />
              <Box
                label="Pension advantage over dividend route"
                value={formatGBP(Math.max(0, pensionNet - personalPot))}
                tone="ok"
                full
              />
            </div>
            <p className="text-[11px] text-ink-500 dark:text-ink-400">
              Assumptions: 7% gross return, 25% main-rate CT, 33.75% higher-rate
              dividend, ISA wrapper for personal route, pension drawn 25%
              tax-free + 75% at 40%. Real figures vary.
            </p>
          </div>
        );
      }}
    />
  );
}

function FamilyEmploymentSim() {
  const inputs: InputSpec[] = [
    {
      key: 'personalIncomeNeed',
      defaultValue: 80_000,
      min: 20_000,
      step: 1_000,
      hint: 'Total household earnings you want to allocate.',
    },
    {
      key: 'pensionContribution',
      defaultValue: 0,
      min: 0,
      max: 60_000,
      step: 500,
      hint: 'Salary to allocate to a non-working family member (genuine work).',
    },
  ];
  return (
    <ShowWithMyNumbers
      title="Family-employment split vs. solo allocation"
      inputs={inputs}
      render={({ values }) => {
        const total = values.personalIncomeNeed ?? 0;
        const familySalary = Math.min(values.pensionContribution ?? 0, total);
        const founderSalary = Math.max(0, total - familySalary);

        const founderOnly = computeSalaryAndDividends(total, 0);
        const founderSplit = computeSalaryAndDividends(founderSalary, 0);
        const familySplit = computeSalaryAndDividends(familySalary, 0);

        const soloHouseholdTax =
          founderOnly.itOnSalary + founderOnly.employeeNI;
        const splitHouseholdTax =
          founderSplit.itOnSalary +
          founderSplit.employeeNI +
          familySplit.itOnSalary +
          familySplit.employeeNI;
        const saved = soloHouseholdTax - splitHouseholdTax;

        return (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Box
                label="Founder-only allocation — household tax"
                value={formatGBP(soloHouseholdTax)}
                tone="bad"
              />
              <Box
                label="Split allocation — household tax"
                value={formatGBP(splitHouseholdTax)}
                tone="bad"
              />
            </div>
            <Box
              label="Household tax saved by splitting"
              value={formatGBP(Math.max(0, saved))}
              tone="ok"
              full
            />
            <p className="text-[11px] text-ink-500 dark:text-ink-400">
              Splits the same gross household earnings between two adults to
              use the second adult's PA + basic-rate band. Only legitimate if
              the family member genuinely does the work and the rate is
              market-comparable.
            </p>
          </div>
        );
      }}
    />
  );
}

// ------------------- Wealth Preservation --------------------

function BorrowAgainstListedSim() {
  // Reuses the profile fields where they make sense as proxies.
  const inputs: InputSpec[] = [
    {
      key: 'annualRevenue',
      defaultValue: 2_000_000,
      min: 100_000,
      step: 50_000,
      label: 'Listed portfolio value',
      hint: 'Assumed cost basis 50% of value (i.e. ~50% unrealised gain).',
    },
    {
      key: 'personalIncomeNeed',
      defaultValue: 200_000,
      min: 10_000,
      step: 5_000,
      label: 'Annual cash needed',
    },
    {
      key: 'yearsHorizon',
      defaultValue: 5,
      min: 1,
      max: 20,
      step: 1,
      label: 'Years to fund',
    },
  ];
  return (
    <ShowWithMyNumbers
      title="Borrow vs. sell to fund spending"
      inputs={inputs}
      render={({ values }) => {
        const portfolio = values.annualRevenue ?? 0;
        const annualNeed = values.personalIncomeNeed ?? 0;
        const years = Math.max(1, Math.round(values.yearsHorizon ?? 1));

        // Sell route: realise enough each year to net annualNeed after CGT,
        // assume 50% of proceeds are gain. CGT at higher rate.
        const gainFraction = 0.5;
        const cgtPerPound = gainFraction * CGT_HIGHER; // tax on £1 of proceeds
        const annualSold = annualNeed / (1 - cgtPerPound);
        const totalSold = annualSold * years;
        const totalCgt = totalSold * cgtPerPound;

        // Borrow route: borrow annualNeed each year; carry interest at
        // base + 2% (illustrative ~6%) on the average drawn balance. Assume
        // portfolio compounds at 7% gross meanwhile.
        const interestRate = 0.06;
        // Average drawn balance over the period for interest calc.
        let drawn = 0;
        let interestPaid = 0;
        for (let y = 0; y < years; y++) {
          drawn += annualNeed;
          interestPaid += drawn * interestRate;
        }
        // Portfolio value at end — kept invested, no sales.
        const portfolioAtEnd = portfolio * Math.pow(1.07, years);
        const portfolioAtEndIfSold =
          (portfolio - totalSold) * Math.pow(1.07, years);

        return (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Box
                label={`Sell route — total CGT over ${years} yrs`}
                value={formatGBP(totalCgt)}
                tone="bad"
              />
              <Box
                label={`Borrow route — interest paid over ${years} yrs`}
                value={formatGBP(interestPaid)}
                tone="warn"
              />
              <Box
                label="Sell route — portfolio at end"
                value={formatGBP(portfolioAtEndIfSold)}
              />
              <Box
                label="Borrow route — portfolio at end (loan to repay)"
                value={formatGBP(portfolioAtEnd - drawn)}
              />
            </div>
            <p className="text-[11px] text-ink-500 dark:text-ink-400">
              Illustrative. Assumes 50% cost basis on the portfolio (so 50% of
              every sale is taxable gain at 24% CGT), 7% gross portfolio
              growth, and 6% interest on the borrow line. Borrow wins when
              portfolio growth comfortably exceeds interest cost; loses badly
              in a drawdown that triggers a margin call.
            </p>
          </div>
        );
      }}
    />
  );
}

// ------------------- Investment --------------------

function EisSeisSim() {
  const inputs: InputSpec[] = [
    {
      key: 'rdEligibleSpend',
      defaultValue: 50_000,
      min: 1_000,
      max: 1_000_000,
      step: 1_000,
      label: 'Investment amount',
    },
    {
      key: 'pensionContribution',
      defaultValue: 80_000,
      min: 0,
      max: 200_000,
      step: 1_000,
      label: 'Your taxable income this year',
      hint: 'Used to check the relief is actually deductible against your tax.',
    },
  ];
  return (
    <ShowWithMyNumbers
      title="EIS / SEIS reliefs on a single investment"
      inputs={inputs}
      render={({ values }) => {
        const inv = values.rdEligibleSpend ?? 0;
        const itOnIncome =
          computeSalaryAndDividends(values.pensionContribution ?? 0, 0)
            .itOnSalary;
        const eisRelief = Math.min(inv * EIS_INCOME_TAX_RELIEF, itOnIncome);
        const seisRelief = Math.min(inv * SEIS_INCOME_TAX_RELIEF, itOnIncome);
        // Loss relief if investment goes to zero, after IT relief used.
        const eisAtRiskCapital = inv - eisRelief;
        const eisLossReliefAtHigherRate = eisAtRiskCapital * IT_HIGHER;
        const eisNetCostIfTotalLoss = inv - eisRelief - eisLossReliefAtHigherRate;
        const seisAtRiskCapital = inv - seisRelief;
        const seisLossReliefAtHigherRate = seisAtRiskCapital * IT_HIGHER;
        const seisNetCostIfTotalLoss =
          inv - seisRelief - seisLossReliefAtHigherRate;
        return (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Box
                label="EIS — income-tax relief (30%)"
                value={formatGBP(eisRelief)}
                tone="ok"
              />
              <Box
                label="SEIS — income-tax relief (50%)"
                value={formatGBP(seisRelief)}
                tone="ok"
              />
              <Box
                label="EIS — net cost if investee fails (after loss relief)"
                value={formatGBP(eisNetCostIfTotalLoss)}
                tone="warn"
              />
              <Box
                label="SEIS — net cost if investee fails"
                value={formatGBP(seisNetCostIfTotalLoss)}
                tone="warn"
              />
            </div>
            <p className="text-[11px] text-ink-500 dark:text-ink-400">
              Loss relief assumes higher-rate marginal. Relief capped at your
              actual income tax for the year. Reliefs not available if you\'re
              connected to the investee (employee, &gt;30% holding).
            </p>
          </div>
        );
      }}
    />
  );
}

// ------------------- helpers --------------------

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

