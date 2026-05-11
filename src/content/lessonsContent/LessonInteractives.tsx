import {
  ShowWithMyNumbers,
  type InputSpec,
} from '../../components/ui/ShowWithMyNumbers';
import {
  ltdResult,
  soleTraderResult,
} from '../../lib/tax';
import {
  CGT_HIGHER,
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
        const ltd = ltdResult({
          revenue,
          costs,
          ownerSalary: 12_570,
          desiredCash: need,
        });
        // companyRetained is post-CT cash already sitting inside the Ltd.
        const annualRetained = ltd.companyRetained;

        // Inside route: keep the £annualRetained inside the company. It grows
        // gross at 7%, but corporate-rate tax applies to investment returns
        // (illustrative — real CT on investment income depends on the company's
        // overall band; we use small-profits as a conservative proxy).
        const insideRate = 0.07 * (1 - CT_SMALL_RATE);

        // Outside route: extract the same post-CT cash by paying a higher-rate
        // dividend, then invest personally. Two natural personal venues:
        //   - ISA (no further tax drag — capped at £20k/year, but used here as
        //     the tax-efficient ceiling for what extraction can achieve)
        //   - GIA (general investment account — 24% CGT on realised gains acts
        //     as the long-run drag)
        // We default to the GIA assumption for honesty; the ISA result is shown
        // as the best-case alternative.
        const personalAfterDivTax = annualRetained * (1 - DIV_HIGHER);
        const giaRate = 0.07 * (1 - CGT_HIGHER);
        const isaRate = 0.07;

        const compounding = (annualPayIn: number, rate: number) => {
          let pot = 0;
          for (let i = 0; i < years; i++) pot = (pot + annualPayIn) * (1 + rate);
          return pot;
        };
        const inside = compounding(annualRetained, insideRate);
        const outsideGia = compounding(personalAfterDivTax, giaRate);
        const outsideIsa = compounding(personalAfterDivTax, isaRate);
        return (
          <div className="space-y-3">
            <Box
              label="Surplus retained inside the company each year (post-CT)"
              value={formatGBP(annualRetained)}
              tone="ok"
              full
            />
            <Box
              label={`If instead extracted as dividend, lands personally as`}
              value={formatGBP(personalAfterDivTax)}
              tone="warn"
              full
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <Box
                label={`Inside Ltd — ${years} yrs`}
                value={formatGBP(inside)}
                tone="ok"
              />
              <Box
                label={`Personal ISA — ${years} yrs`}
                value={formatGBP(outsideIsa)}
                tone="warn"
              />
              <Box
                label={`Personal GIA — ${years} yrs`}
                value={formatGBP(outsideGia)}
                tone="warn"
              />
            </div>
            <p className="text-[12px] text-ink-500 dark:text-ink-400">
              All three pots assume 7% gross return. Inside the Ltd, investment
              returns face corporation tax (modelled at the 19% small-profits
              rate). The two personal routes start with less because extracting
              the surplus costs {formatPct(DIV_HIGHER)} higher-rate dividend tax — an ISA
              wrapper then grows tax-free, a GIA pays 24% on realised gains.
              Eventual extraction tax on the inside pot (dividend, BADR on
              sale) isn't modelled; see lesson 1.9 and the Multi-year Lab.
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
      hint: 'An extra £X of legitimate, deductible business spend in a year.',
    },
  ];
  return (
    <ShowWithMyNumbers
      title="Show me with my numbers — what one deductible £ is worth"
      inputs={inputs}
      render={({ values }) => {
        const spend = values.annualCosts ?? 0;
        // The marginal CT saving from deducting £spend is spend * marginal_CT_rate.
        // Which marginal rate applies depends on the company's overall profit
        // band; we show both endpoints honestly rather than picking one.
        const savedAtSmallRate = spend * CT_SMALL_RATE;
        const savedAtMainRate = spend * CT_MAIN_RATE;
        // For a sole trader / personally deductible spend, the saving depends
        // on the marginal personal-tax band. Show basic (20%) and higher (40%)
        // endpoints. NI savings are not included here for clarity.
        const savedAtBasic = spend * 0.2;
        const savedAtHigher = spend * 0.4;
        return (
          <div className="space-y-3">
            <p className="text-sm text-ink-700 dark:text-ink-300">
              Each £1 of deductible spend reduces taxable profit by £1, so the
              cash saving equals £1 × the marginal tax rate that the deduction
              eats into. The actual rate depends on which band your profit sits
              in — we show both endpoints.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Box
                label="Ltd — saved at 19% small-profits rate"
                value={formatGBP(savedAtSmallRate)}
                tone="ok"
              />
              <Box
                label="Ltd — saved at 25% main rate"
                value={formatGBP(savedAtMainRate)}
                tone="ok"
              />
              <Box
                label="Personal — saved at 20% basic rate"
                value={formatGBP(savedAtBasic)}
                tone="ok"
              />
              <Box
                label="Personal — saved at 40% higher rate"
                value={formatGBP(savedAtHigher)}
                tone="ok"
              />
            </div>
            <p className="text-[12px] text-ink-500 dark:text-ink-400">
              Inside the Ltd's marginal-relief band (£50k–£250k) the effective
              marginal rate climbs above 25% (peaks at 26.5%). Personal savings
              also depend on whether you're in the £100k–£125k taper zone where
              the marginal rate hits ~60%.
            </p>
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
        // higher-rate dividend as the relevant case for a profitable
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
              Assumptions: 7% gross return, 25% CT main rate, {formatPct(DIV_HIGHER)} higher-rate
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
