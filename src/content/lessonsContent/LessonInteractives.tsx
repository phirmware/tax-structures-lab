import {
  ShowWithMyNumbers,
  type InputSpec,
} from '../../components/ui/ShowWithMyNumbers';
import {
  ltdResult,
  soleTraderResult,
  corporationTax,
} from '../../lib/tax';
import {
  CT_MAIN_RATE,
  CT_SMALL_RATE,
  DIV_HIGHER,
  IT_HIGHER,
} from '../../lib/constants';
import { formatGBP, formatPct } from '../../lib/format';

/**
 * Per-lesson "Show me with my numbers" panels.
 * Rendered separately from the existing LessonOne…LessonTen bodies so the
 * original lesson content is left untouched. Each branch handles a single
 * lesson where a calculation makes the lesson land harder when applied to
 * the user's own numbers.
 */
export function LessonInteractives({ lessonId }: { lessonId: string }) {
  switch (lessonId) {
    case '1-2':
      return <IncomeVsProfitPanel />;
    case '1-3':
      return <ThreeLeversPanel />;
    case '1-5':
      return <RetentionPanel />;
    case '1-6':
      return <DeductionsPanel />;
    case '1-7':
      return <DeferralPanel />;
    case '1-9':
      return <PensionPanel />;
    default:
      return null;
  }
}

function IncomeVsProfitPanel() {
  const inputs: InputSpec[] = [
    { key: 'annualRevenue', defaultValue: 200_000, min: 0, step: 1_000 },
    { key: 'annualCosts', defaultValue: 140_000, min: 0, step: 500 },
  ];
  return (
    <ShowWithMyNumbers
      title="Show me with my numbers — revenue vs. profit vs. tax"
      inputs={inputs}
      render={({ values }) => {
        const revenue = values.annualRevenue ?? 0;
        const costs = values.annualCosts ?? 0;
        const profit = Math.max(0, revenue - costs);
        const sole = soleTraderResult(revenue, costs);
        return (
          <div className="grid gap-3 sm:grid-cols-3">
            <Box label="Revenue" value={formatGBP(revenue)} />
            <Box label="Costs" value={formatGBP(costs)} tone="warn" />
            <Box label="Profit (taxable)" value={formatGBP(profit)} tone="ok" />
            <Box label="Estimated tax (sole trader)" value={formatGBP(sole.totalTax)} tone="bad" />
            <Box label="Net to you" value={formatGBP(sole.netToOwner)} tone="ok" />
            <Box
              label="Tax as % of revenue"
              value={revenue > 0 ? formatPct(sole.totalTax / revenue) : '—'}
            />
          </div>
        );
      }}
    />
  );
}

function ThreeLeversPanel() {
  const inputs: InputSpec[] = [
    { key: 'annualRevenue', defaultValue: 150_000, min: 0, step: 1_000 },
    { key: 'annualCosts', defaultValue: 30_000, min: 0, step: 500 },
    {
      key: 'pensionContribution',
      defaultValue: 0,
      min: 0,
      max: 60_000,
      step: 500,
      hint: 'A simple "what if I deferred this much via pension?" lever.',
    },
  ];
  return (
    <ShowWithMyNumbers
      title="Show me with my numbers — the three levers"
      inputs={inputs}
      render={({ values }) => {
        const revenue = values.annualRevenue ?? 0;
        const costs = values.annualCosts ?? 0;
        const pension = values.pensionContribution ?? 0;
        const baselineLtd = ltdResult({
          revenue,
          costs,
          ownerSalary: 12_570,
          desiredCash: 40_000,
        });
        const withPension = ltdResult({
          revenue,
          costs,
          ownerSalary: 12_570,
          desiredCash: 40_000,
          pensionContribution: pension,
        });
        const taxSaved = baselineLtd.totalTaxToHmrc - withPension.totalTaxToHmrc;
        return (
          <div className="space-y-3">
            <p className="text-sm text-ink-700 dark:text-ink-300">
              Two illustrative Ltd extractions — one with a £{Math.round(pension).toLocaleString('en-GB')} pension contribution, one without — share identical revenue, costs, and salary. The difference is purely "when does this get taxed."
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Box
                label="Total tax (no pension)"
                value={formatGBP(baselineLtd.totalTaxToHmrc)}
                tone="bad"
              />
              <Box
                label={`Total tax (£${Math.round(pension).toLocaleString('en-GB')} pension)`}
                value={formatGBP(withPension.totalTaxToHmrc)}
                tone="bad"
              />
            </div>
            <Box
              label="Tax deferred this year (the When lever)"
              value={formatGBP(Math.max(0, taxSaved))}
              tone="ok"
              full
            />
          </div>
        );
      }}
    />
  );
}

function RetentionPanel() {
  const inputs: InputSpec[] = [
    {
      key: 'annualRevenue',
      defaultValue: 180_000,
      min: 0,
      step: 1_000,
    },
    { key: 'annualCosts', defaultValue: 30_000, min: 0, step: 500 },
    {
      key: 'personalIncomeNeed',
      defaultValue: 50_000,
      min: 0,
      step: 1_000,
      hint: 'How much you actually need to spend personally each year.',
    },
    {
      key: 'yearsHorizon',
      defaultValue: 10,
      min: 1,
      max: 40,
      step: 1,
      hint: 'How long you plan to retain rather than extract.',
    },
  ];
  return (
    <ShowWithMyNumbers
      title="Show me with my numbers — the retention principle"
      inputs={inputs}
      render={({ values }) => {
        const revenue = values.annualRevenue ?? 0;
        const costs = values.annualCosts ?? 0;
        const need = values.personalIncomeNeed ?? 0;
        const years = Math.max(1, Math.round(values.yearsHorizon ?? 1));
        const retained = ltdResult({
          revenue,
          costs,
          ownerSalary: 12_570,
          desiredCash: need,
        });
        const annualRetained = retained.companyRetained;
        // Simple compound projections — illustrative only.
        const insideRate = 0.07 * (1 - CT_SMALL_RATE); // post-CT growth
        const outsideRate = 0.07 * (1 - IT_HIGHER); // post-personal-tax growth
        const compounding = (rate: number) => {
          let pot = 0;
          for (let i = 0; i < years; i++) pot = (pot + annualRetained) * (1 + rate);
          return pot;
        };
        const inside = compounding(insideRate);
        const outside = compounding(outsideRate);
        return (
          <div className="space-y-3">
            <Box
              label={`Surplus retained inside the company each year`}
              value={formatGBP(annualRetained)}
              tone="ok"
              full
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Box
                label={`Pot after ${years} yrs — kept inside the Ltd`}
                value={formatGBP(inside)}
                tone="ok"
              />
              <Box
                label={`Pot after ${years} yrs — extracted then saved personally`}
                value={formatGBP(outside)}
                tone="warn"
              />
            </div>
            <p className="text-[12px] text-ink-500 dark:text-ink-400">
              Both pots assume 7% gross investment return. The retained version pays the lower corporate-rate tax drag; the extracted version pays your personal-rate drag. Illustrative only.
            </p>
          </div>
        );
      }}
    />
  );
}

function DeductionsPanel() {
  const inputs: InputSpec[] = [
    {
      key: 'annualCosts',
      defaultValue: 5_000,
      min: 0,
      step: 100,
      hint: 'Imagine an extra £X of legitimate, deductible business spend in a year.',
    },
  ];
  return (
    <ShowWithMyNumbers
      title="Show me with my numbers — what one £1,000 deduction is worth"
      inputs={inputs}
      render={({ values }) => {
        const spend = values.annualCosts ?? 0;
        const ctSavedSmall = corporationTax(spend).total;
        const personalSaved40 = spend * 0.4;
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <Box
              label={`Tax saved by deducting £${Math.round(spend).toLocaleString('en-GB')} (Ltd, small-profits rate)`}
              value={formatGBP(ctSavedSmall)}
              tone="ok"
            />
            <Box
              label="Tax saved if instead deducted against your 40% income"
              value={formatGBP(personalSaved40)}
              tone="ok"
            />
          </div>
        );
      }}
    />
  );
}

function DeferralPanel() {
  const inputs: InputSpec[] = [
    {
      key: 'pensionContribution',
      defaultValue: 30_000,
      min: 0,
      max: 200_000,
      step: 1_000,
      hint: 'Tax bill you defer today, taxed (some of it) later.',
    },
    { key: 'yearsHorizon', defaultValue: 20, min: 1, max: 40, step: 1 },
  ];
  return (
    <ShowWithMyNumbers
      title="Show me with my numbers — what 1% real-rate deferral is worth"
      inputs={inputs}
      render={({ values }) => {
        const taxBill = values.pensionContribution ?? 0;
        const years = Math.max(1, Math.round(values.yearsHorizon ?? 1));
        const realRate = 0.04;
        const presentValue = taxBill / Math.pow(1 + realRate, years);
        const saved = taxBill - presentValue;
        return (
          <div className="space-y-3">
            <Box
              label={`Nominal tax bill in ${years} years`}
              value={formatGBP(taxBill)}
              tone="warn"
              full
            />
            <Box
              label="Same bill expressed in today's pounds (4% real discount)"
              value={formatGBP(presentValue)}
              tone="ok"
              full
            />
            <Box
              label="Real-terms benefit of deferring"
              value={formatGBP(Math.max(0, saved))}
              tone="ok"
              full
            />
          </div>
        );
      }}
    />
  );
}

function PensionPanel() {
  const inputs: InputSpec[] = [
    {
      key: 'pensionContribution',
      defaultValue: 30_000,
      min: 0,
      max: 60_000,
      step: 500,
      hint: 'Pre-tax company profit being directed to one route or the other.',
    },
    { key: 'yearsHorizon', defaultValue: 20, min: 1, max: 40, step: 1 },
  ];
  return (
    <ShowWithMyNumbers
      title="Show me with my numbers — pension vs. dividend extraction"
      inputs={inputs}
      render={({ values }) => {
        const contribution = values.pensionContribution ?? 0;
        const years = Math.max(1, Math.round(values.yearsHorizon ?? 1));
        const growth = 0.07;

        // --- Dividend route: company pays CT, you take a dividend, you pay
        // dividend tax, you invest the rest. Use main-rate CT (25%) and
        // higher-rate dividend (33.75%) as the relevant case for a profitable
        // founder making this trade-off. ISA-wrapped — no further tax drag.
        const ctPaid = contribution * CT_MAIN_RATE;
        const postCt = contribution - ctPaid; // dividend declared
        const dividendTax = postCt * DIV_HIGHER;
        const personalStart = postCt - dividendTax;
        const personalPot = personalStart * Math.pow(1 + growth, years);

        // --- Pension route: full £contribution lands in the pension wrapper
        // (employer contribution is deductible for CT, no NI, not personal
        // income today). Tax-free growth inside the wrapper.
        const pensionGross = contribution * Math.pow(1 + growth, years);
        // On draw: 25% tax-free lump sum, 75% taxed at marginal income rate.
        // Use higher-rate (40%) as the conservative default for someone with
        // a meaningful pension; the panel notes this explicitly.
        const drawMarginal = IT_HIGHER;
        const lumpSum = pensionGross * 0.25;
        const taxedPortion = pensionGross * 0.75;
        const pensionNet = lumpSum + taxedPortion * (1 - drawMarginal);

        return (
          <div className="space-y-3">
            <p className="text-sm text-ink-700 dark:text-ink-300">
              Compare £{Math.round(contribution).toLocaleString('en-GB')} of pre-CT
              company profit directed to (a) an employer pension contribution, or
              (b) extracted as a dividend after CT and invested personally in an ISA.
            </p>

            <div className="rounded-lg border border-ink-200 p-3 text-xs dark:border-ink-700">
              <div className="font-semibold text-ink-700 dark:text-ink-200">
                Dividend route — money landing in your hands
              </div>
              <div className="mt-1 grid grid-cols-2 gap-1 font-mono tabular-nums">
                <span>Pre-CT company profit</span>
                <span className="text-right">{formatGBP(contribution)}</span>
                <span>− CT @ {Math.round(CT_MAIN_RATE * 100)}%</span>
                <span className="text-right text-danger-500">−{formatGBP(ctPaid)}</span>
                <span>= Dividend declared</span>
                <span className="text-right">{formatGBP(postCt)}</span>
                <span>− Dividend tax @ {(DIV_HIGHER * 100).toFixed(2)}%</span>
                <span className="text-right text-danger-500">−{formatGBP(dividendTax)}</span>
                <span className="font-semibold">= Lands in your ISA</span>
                <span className="text-right font-semibold text-accent-700 dark:text-accent-300">
                  {formatGBP(personalStart)}
                </span>
              </div>
            </div>

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
                label={`Pension pre-draw-tax pot — ${years} yrs`}
                value={formatGBP(pensionGross)}
              />
              <Box
                label="Pension advantage (net)"
                value={formatGBP(Math.max(0, pensionNet - personalPot))}
                tone="ok"
              />
            </div>

            <p className="text-[12px] text-ink-500 dark:text-ink-400">
              Assumptions: 7% gross return, 25% CT main rate, 33.75% higher-rate
              dividend, ISA wrapper (no growth drag), pension drawn with 25%
              tax-free lump sum and 75% at 40% marginal income tax. Real figures
              vary with your CT band, dividend band, draw strategy, and ISA
              capacity. Ignores annual-allowance taper and pension lifetime rules.
            </p>
          </div>
        );
      }}
    />
  );
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
