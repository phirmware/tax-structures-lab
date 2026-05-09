import {
  ShowWithMyNumbers,
  type InputSpec,
} from '../../components/ui/ShowWithMyNumbers';
import { MiniSim, SimBox } from '../../components/ui/MiniSim';
import {
  ComparisonBars,
  SIM_COLORS,
  TimeSeriesChart,
} from '../../components/ui/SimCharts';
import {
  computeSalaryAndDividends,
  ltdResult,
} from '../../lib/tax';
import {
  BADR_LIFETIME_LIMIT,
  BADR_RATE,
  CGT_ANNUAL_EXEMPTION,
  CGT_HIGHER,
  CT_MAIN_RATE,
  CT_SMALL_RATE,
  DIV_HIGHER,
  EIS_INCOME_TAX_RELIEF,
  IT_BASIC,
  IT_HIGHER,
  IHT_NIL_RATE_BAND,
  IHT_RATE,
  ISA_ALLOWANCE,
  PERSONAL_ALLOWANCE,
  SEIS_INCOME_TAX_RELIEF,
  VAT_STANDARD_RATE,
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
    case 'trivial-benefits':
      return <TrivialBenefitsSim />;
    case 'mileage-and-home':
      return <MileageHomeSim />;
    case 'family-employment':
      return <FamilyEmploymentSim />;
    case 'directors-loans':
      return <DirectorsLoanSim />;
    case 'borrow-against-listed':
      return <BorrowAgainstListedSim />;
    case 'pensions-long-game':
      return <PensionsLongGameSim />;
    case 'isa-discipline':
      return <IsaDisciplineSim />;
    case 'eis-seis':
      return <EisSeisSim />;
    case 'vct':
      return <VctSim />;
    case 'business-relief-aim':
      return <BusinessReliefAimSim />;
    case 'reinvestment-relief':
      return <ReinvestmentReliefSim />;
    case 'badr-qualification':
      return <BadrQualificationSim />;
    case 'eot-sale':
      return <EotSaleSim />;
    case 'earn-outs':
      return <EarnOutsSim />;
    case 'equity-vs-cash':
      return <EquityVsCashSim />;
    case 'capital-vs-income':
      return <CapitalVsIncomeSim />;
    case 'ir35-aware':
      return <Ir35Sim />;
    case 'group-relief':
      return <GroupReliefSim />;
    case 'inter-co-charges':
      return <InterCoChargesSim />;
    case 'iht-business-relief':
      return <IhtBprSim />;
    case 'gifting-7-year':
      return <Gifting7YearSim />;
    case 'pay-yourself-in-crypto':
      return <CryptoMythSim />;
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

        const gainFraction = 0.5;
        const cgtPerPound = gainFraction * CGT_HIGHER;
        const annualSold = annualNeed / (1 - cgtPerPound);
        const interestRate = 0.06;
        const growth = 0.07;

        // Year-by-year evolution.
        const data: Array<{ year: number; sell: number; borrow: number; loan: number }> = [];
        let portfolioSell = portfolio;
        let portfolioBorrow = portfolio;
        let loan = 0;
        let totalCgt = 0;
        let interestPaid = 0;
        for (let y = 1; y <= years; y++) {
          // Sell path: portfolio drops by amount sold, then grows.
          portfolioSell = (portfolioSell - annualSold) * (1 + growth);
          totalCgt += annualSold * cgtPerPound;
          // Borrow path: portfolio grows untouched; loan accrues interest + new draw.
          portfolioBorrow = portfolioBorrow * (1 + growth);
          loan = (loan + annualNeed) * (1 + interestRate);
          interestPaid += loan * interestRate;
          data.push({
            year: y,
            sell: Math.round(portfolioSell),
            borrow: Math.round(portfolioBorrow - loan),
            loan: Math.round(loan),
          });
        }

        return (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <SimBox
                label={`Sell route — total CGT over ${years} yrs`}
                value={totalCgt}
                tone="bad"
              />
              <SimBox
                label={`Borrow route — interest accrued over ${years} yrs`}
                value={interestPaid}
                tone="warn"
              />
              <SimBox
                label="Sell route — portfolio at end"
                value={portfolioSell}
              />
              <SimBox
                label="Borrow route — portfolio at end, net of loan"
                value={portfolioBorrow - loan}
              />
            </div>
            <TimeSeriesChart
              data={data}
              series={[
                { key: 'sell', name: 'Sell route — portfolio', color: SIM_COLORS.warn },
                { key: 'borrow', name: 'Borrow — portfolio net of loan', color: SIM_COLORS.good },
                { key: 'loan', name: 'Borrow — outstanding loan', color: SIM_COLORS.bad },
              ]}
            />
            <p className="text-[11px] text-ink-500 dark:text-ink-400">
              Illustrative. 50% cost basis on the portfolio (so 50% of every
              sale is taxable gain at 24% CGT), 7% gross portfolio growth, 6%
              loan interest. Borrow wins when growth comfortably exceeds
              interest; loses badly in a drawdown that triggers a margin call.
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

// ------------------- Extraction (additional) --------------------

function TrivialBenefitsSim() {
  return (
    <MiniSim
      title="Annual savings from exempt benefits"
      inputs={[
        {
          key: 'gifts',
          label: 'Trivial gifts taken (count, max £50 each)',
          defaultValue: 6,
          kind: 'count',
          min: 0,
          max: 6,
          hint: 'Director cap: £300/year (~6 × £50). Phone/eye-test exemptions don\'t count toward this cap.',
        },
        {
          key: 'partyHeads',
          label: 'Annual-event headcount (£150/head)',
          defaultValue: 4,
          kind: 'count',
          min: 0,
          max: 50,
        },
        {
          key: 'phoneAnnual',
          label: 'Mobile phone annual cost (company contract)',
          defaultValue: 600,
          kind: 'currency',
          min: 0,
          step: 50,
        },
      ]}
      render={({ values }) => {
        const giftsValue = Math.min(values.gifts, 6) * 50;
        const partyValue = Math.min(values.partyHeads, 50) * 150;
        const phoneValue = values.phoneAnnual;
        const total = giftsValue + partyValue + phoneValue;
        // Personal-tax cost saved if you'd had to pay for these from net pay.
        const equivPersonalGross = total / (1 - 0.4 - 0.02); // 40% IT + 2% NI
        return (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <SimBox label="Trivial-gift exemption used" value={giftsValue} tone="ok" />
              <SimBox label="Annual-event exemption used" value={partyValue} tone="ok" />
              <SimBox label="Phone exemption used" value={phoneValue} tone="ok" />
            </div>
            <SimBox
              label="Total tax-free benefit"
              value={total}
              tone="ok"
              full
            />
            <SimBox
              label="Equivalent gross pay you'd need to net the same"
              value={equivPersonalGross}
              tone="warn"
              full
            />
          </div>
        );
      }}
      footer="Each exemption is its own cliff edge — exceed by £1 and the whole item becomes taxable. Phone and annual-event exemptions don't count toward the £300 director-trivial cap."
    />
  );
}

function MileageHomeSim() {
  return (
    <MiniSim
      title="Mileage + home flat-rate annual reclaim"
      inputs={[
        {
          key: 'businessMiles',
          label: 'Business miles per year (own car)',
          defaultValue: 4_000,
          kind: 'count',
          min: 0,
          max: 30_000,
          step: 100,
        },
        {
          key: 'workFromHomeWeeks',
          label: 'Weeks worked from home',
          defaultValue: 40,
          kind: 'count',
          min: 0,
          max: 52,
        },
      ]}
      render={({ values }) => {
        const miles = values.businessMiles;
        const firstSlice = Math.min(miles, 10_000) * 0.45;
        const secondSlice = Math.max(0, miles - 10_000) * 0.25;
        const mileageTotal = firstSlice + secondSlice;
        const homeFlat = values.workFromHomeWeeks * 6;
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <SimBox
              label="Mileage reclaim @ AMAP rates"
              value={mileageTotal}
              tone="ok"
            />
            <SimBox
              label="Home-flat-rate reclaim (£6/week)"
              value={homeFlat}
              tone="ok"
            />
            <SimBox
              label="Total tax-free annual reclaim"
              value={mileageTotal + homeFlat}
              tone="ok"
              full
            />
          </div>
        );
      }}
      footer="AMAP rates: 45p/mile up to 10,000 miles, 25p thereafter. The home-flat-rate is the receipt-free shortcut — actuals can be higher with apportioned bills."
    />
  );
}

function DirectorsLoanSim() {
  return (
    <MiniSim
      title="What an unmonitored director's loan actually costs"
      inputs={[
        {
          key: 'loan',
          label: 'Loan amount (peak)',
          defaultValue: 30_000,
          kind: 'currency',
          min: 0,
          max: 200_000,
          step: 1_000,
        },
        {
          key: 'monthsHeld',
          label: 'Months from year-end to repayment',
          defaultValue: 12,
          kind: 'months',
          min: 0,
          max: 36,
          hint: 'The s455 deadline is 9 months and 1 day after year-end.',
        },
      ]}
      render={({ values }) => {
        const loan = values.loan;
        const monthsAfterYearEnd = values.monthsHeld;
        const overThreshold = loan > 10_000;
        // BiK ~ HMRC official rate (use 2.25% as illustrative current ORI).
        const bikYears = Math.ceil(monthsAfterYearEnd / 12);
        const bikValue = overThreshold ? loan * 0.0225 * bikYears : 0;
        const bikTax = bikValue * 0.4; // higher-rate, illustrative
        // s455 if not repaid within 9m1d.
        const s455 =
          monthsAfterYearEnd > 9 ? loan * 0.3375 : 0;
        const total = bikTax + s455;
        return (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <SimBox
                label="BiK on cheap loan (>£10k)"
                value={bikValue}
                tone={overThreshold ? 'warn' : undefined}
              />
              <SimBox
                label="Personal tax on BiK (~40%)"
                value={bikTax}
                tone={bikTax > 0 ? 'bad' : undefined}
              />
              <SimBox
                label="s455 charge if &gt;9 months overdue"
                value={s455}
                tone={s455 > 0 ? 'bad' : undefined}
              />
              <SimBox
                label="Total cost while loan unrepaid"
                value={total}
                tone={total > 0 ? 'bad' : 'ok'}
              />
            </div>
            <p className="text-[12px] text-ink-500 dark:text-ink-400">
              s455 is recoverable when the loan is later repaid — but only after
              the next CT return cycles, so cash sits at HMRC for years. BiK
              cost is permanent.
            </p>
          </div>
        );
      }}
    />
  );
}

// ------------------- Wealth Preservation (additional) --------------------

function PensionsLongGameSim() {
  const inputs: InputSpec[] = [
    {
      key: 'pensionContribution',
      defaultValue: 30_000,
      min: 0,
      max: 60_000,
      step: 500,
      label: 'Annual contribution (years 1–N)',
    },
    {
      key: 'yearsHorizon',
      defaultValue: 25,
      min: 5,
      max: 40,
      step: 1,
      label: 'Years to retirement',
    },
  ];
  return (
    <ShowWithMyNumbers
      title="30-year compounding inside vs outside a pension"
      inputs={inputs}
      render={({ values }) => {
        const contrib = values.pensionContribution ?? 0;
        const years = Math.max(1, Math.round(values.yearsHorizon ?? 1));
        const growth = 0.07;
        const personalIn = contrib * (1 - CT_MAIN_RATE) * (1 - DIV_HIGHER);

        const data: Array<{ year: number; pension: number; personal: number }> = [];
        let pensionPot = 0;
        let personalPot = 0;
        for (let y = 1; y <= years; y++) {
          pensionPot = (pensionPot + contrib) * (1 + growth);
          personalPot = (personalPot + personalIn) * (1 + growth);
          data.push({
            year: y,
            pension: Math.round(pensionPot),
            personal: Math.round(personalPot),
          });
        }
        const lumpSum = pensionPot * 0.25;
        const taxedPortion = pensionPot * 0.75;
        const pensionNetAtBasicDraw =
          lumpSum + taxedPortion * (1 - IT_BASIC);
        const pensionNetAtHigherDraw =
          lumpSum + taxedPortion * (1 - IT_HIGHER);

        return (
          <div className="space-y-3">
            <TimeSeriesChart
              data={data}
              series={[
                { key: 'pension', name: 'Pension pot (pre-draw)', color: SIM_COLORS.good },
                { key: 'personal', name: 'Personal ISA pot', color: SIM_COLORS.warn },
              ]}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <SimBox
                label="Pension net @ basic-rate draw"
                value={pensionNetAtBasicDraw}
                tone="ok"
              />
              <SimBox
                label="Pension net @ higher-rate draw"
                value={pensionNetAtHigherDraw}
                tone="ok"
              />
              <SimBox
                label="Personal ISA pot at end"
                value={personalPot}
                tone="warn"
              />
              <SimBox
                label="Pension advantage at basic-rate draw"
                value={Math.max(0, pensionNetAtBasicDraw - personalPot)}
                tone="ok"
              />
            </div>
            <p className="text-[12px] text-ink-500 dark:text-ink-400">
              Pension wins more clearly at longer horizons and when the
              retirement marginal rate is below your peak-earning rate.
              Assumes 7% gross growth, 25% CT, 33.75% higher-rate dividend.
            </p>
          </div>
        );
      }}
    />
  );
}

function IsaDisciplineSim() {
  return (
    <MiniSim
      title="What a missed ISA year actually costs"
      inputs={[
        {
          key: 'annualContribution',
          label: 'Annual ISA contribution',
          defaultValue: ISA_ALLOWANCE,
          kind: 'currency',
          min: 0,
          max: ISA_ALLOWANCE,
          step: 500,
        },
        {
          key: 'years',
          label: 'Years (current age to 65)',
          defaultValue: 25,
          kind: 'years',
          min: 1,
          max: 40,
        },
        {
          key: 'missedYears',
          label: 'Years skipped',
          defaultValue: 5,
          kind: 'years',
          min: 0,
          max: 40,
        },
      ]}
      render={({ values }) => {
        const contrib = values.annualContribution;
        const years = Math.max(1, Math.round(values.years));
        const missed = Math.min(Math.round(values.missedYears), years);
        const growth = 0.07;

        const data: Array<{ year: number; full: number; skipped: number }> = [];
        let full = 0;
        let skipped = 0;
        for (let y = 1; y <= years; y++) {
          full = (full + contrib) * (1 + growth);
          // Skip the FIRST `missed` years.
          const contribThisYear = y <= missed ? 0 : contrib;
          skipped = (skipped + contribThisYear) * (1 + growth);
          data.push({
            year: y,
            full: Math.round(full),
            skipped: Math.round(skipped),
          });
        }
        const cost = full - skipped;
        return (
          <div className="space-y-3">
            <TimeSeriesChart
              data={data}
              series={[
                { key: 'full', name: 'Every year used', color: SIM_COLORS.good },
                { key: 'skipped', name: 'With skipped years', color: SIM_COLORS.warn },
              ]}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <SimBox label="Pot — every year used" value={full} tone="ok" />
              <SimBox label="Pot — with skipped years" value={skipped} tone="warn" />
              <SimBox label="Cost of skipped years" value={cost} tone="bad" />
            </div>
          </div>
        );
      }}
      footer="Assumes 7% gross compounding inside the ISA. Each missed allowance is gone for good — there's no carry-forward."
    />
  );
}

// ------------------- Investment (additional) --------------------

function VctSim() {
  return (
    <MiniSim
      title="VCT relief over a 5-year hold"
      inputs={[
        {
          key: 'investment',
          label: 'VCT investment',
          defaultValue: 50_000,
          kind: 'currency',
          min: 5_000,
          max: 200_000,
          step: 1_000,
        },
        {
          key: 'yieldRate',
          label: 'Annual VCT dividend yield',
          defaultValue: 0.07,
          kind: 'percent',
          min: 0,
          max: 0.15,
          step: 0.005,
        },
      ]}
      render={({ values }) => {
        const inv = values.investment;
        const yieldRate = values.yieldRate;
        const itRelief = inv * 0.30;
        const dividendsOver5y = inv * yieldRate * 5;
        // Compare to a higher-rate dividend taxed at 33.75%.
        const dividendTaxIfNotVct = dividendsOver5y * DIV_HIGHER;
        const totalBenefit = itRelief + dividendTaxIfNotVct;
        return (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <SimBox
                label="30% income-tax relief on subscription"
                value={itRelief}
                tone="ok"
              />
              <SimBox
                label="Tax-free dividends over 5 years"
                value={dividendsOver5y}
                tone="ok"
              />
              <SimBox
                label="Dividend tax avoided (vs taxable holding)"
                value={dividendTaxIfNotVct}
                tone="ok"
              />
              <SimBox
                label="Total tax benefit over 5y"
                value={totalBenefit}
                tone="ok"
              />
            </div>
            <p className="text-[12px] text-ink-500 dark:text-ink-400">
              Reliefs are the upside; the underlying VCT pays manager fees
              of ~1.5–3.0%/year and invests in small UK companies — all of
              which can lose value. Sell within 5 years and the income-tax
              relief is clawed back.
            </p>
          </div>
        );
      }}
    />
  );
}

function BusinessReliefAimSim() {
  return (
    <MiniSim
      title="BPR before and after the April 2026 cap"
      inputs={[
        {
          key: 'estate',
          label: 'Estate value',
          defaultValue: 4_000_000,
          kind: 'currency',
          min: 500_000,
          max: 50_000_000,
          step: 50_000,
        },
        {
          key: 'bprAssets',
          label: 'Of which qualifying BPR assets',
          defaultValue: 3_000_000,
          kind: 'currency',
          min: 0,
          max: 50_000_000,
          step: 50_000,
        },
      ]}
      render={({ values }) => {
        const estate = values.estate;
        const bpr = Math.min(values.bprAssets, estate);
        const nonBpr = estate - bpr;
        const bands = IHT_NIL_RATE_BAND + 175_000; // illustrative w/ residence band
        const taxableNonBpr = Math.max(0, nonBpr - bands);

        const ihtNoRelief = Math.max(0, estate - bands) * IHT_RATE;
        const ihtPre2026 = taxableNonBpr * IHT_RATE;
        // Post-April-2026: first £1m at 100%, excess at 50% relief.
        const cap = 1_000_000;
        const bprAtFullRelief = Math.min(bpr, cap);
        const bprAtPartialRelief = Math.max(0, bpr - cap);
        const taxableBprPost = bprAtPartialRelief * 0.5; // 50% remains taxable
        const ihtPost2026 =
          (taxableNonBpr + taxableBprPost) * IHT_RATE;
        return (
          <div className="space-y-3">
            <ComparisonBars
              bars={[
                { label: 'No relief', value: ihtNoRelief, color: SIM_COLORS.bad },
                { label: 'Pre-Apr-2026 (100%)', value: ihtPre2026, color: SIM_COLORS.good },
                { label: 'Post-Apr-2026 (£1m cap)', value: ihtPost2026, color: SIM_COLORS.warn },
              ]}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <SimBox label="No relief" value={ihtNoRelief} tone="bad" />
              <SimBox label="Pre-Apr-2026" value={ihtPre2026} tone="ok" />
              <SimBox label="Post-Apr-2026" value={ihtPost2026} tone="warn" />
            </div>
            <SimBox
              label="Cap impact on this estate"
              value={ihtPost2026 - ihtPre2026}
              tone="warn"
              full
            />
            {bprAtFullRelief > 0 && (
              <p className="text-[12px] text-ink-500 dark:text-ink-400">
                First £{cap.toLocaleString('en-GB')} of qualifying BPR keeps
                100% relief; the {formatGBP(bprAtPartialRelief)} above the cap
                gets 50% relief (so 50% remains taxable at 40%).
              </p>
            )}
          </div>
        );
      }}
      footer="Illustrative. The 2026 cap is per individual; spouses can each have their own."
    />
  );
}

function ReinvestmentReliefSim() {
  return (
    <MiniSim
      title="EIS reinvestment relief on a realised gain"
      inputs={[
        {
          key: 'gain',
          label: 'Capital gain to reinvest',
          defaultValue: 200_000,
          kind: 'currency',
          min: 5_000,
          step: 5_000,
        },
        {
          key: 'years',
          label: 'Years until eventual disposal',
          defaultValue: 7,
          kind: 'years',
          min: 3,
          max: 20,
        },
      ]}
      render={({ values }) => {
        const gain = values.gain;
        const years = Math.max(3, Math.round(values.years));
        const cgtNow = gain * CGT_HIGHER;
        const cgtDeferred = gain * CGT_HIGHER; // same nominal, paid later
        const realDiscount = 0.04;
        const cgtDeferredPv =
          cgtDeferred / Math.pow(1 + realDiscount, years);
        const itReliefOnNew = gain * EIS_INCOME_TAX_RELIEF;
        return (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <SimBox
                label="CGT if paid now"
                value={cgtNow}
                tone="bad"
              />
              <SimBox
                label="CGT if deferred (PV today, 4% real)"
                value={cgtDeferredPv}
                tone="warn"
              />
              <SimBox
                label="EIS income-tax relief on the new investment"
                value={itReliefOnNew}
                tone="ok"
              />
              <SimBox
                label="Effective benefit (CGT saved in PV + IT relief)"
                value={cgtNow - cgtDeferredPv + itReliefOnNew}
                tone="ok"
              />
            </div>
            <p className="text-[12px] text-ink-500 dark:text-ink-400">
              The CGT is deferred, not exempted — eventual disposal of the
              EIS shares triggers the deferred bill. The benefit is the
              time-value of money plus the new IT relief stacking on top.
            </p>
          </div>
        );
      }}
    />
  );
}

// ------------------- Sale & Exit (additional) --------------------

function BadrQualificationSim() {
  return (
    <MiniSim
      title="What BADR is worth on this sale"
      inputs={[
        {
          key: 'gain',
          label: 'Total capital gain on sale',
          defaultValue: 1_500_000,
          kind: 'currency',
          min: 50_000,
          step: 50_000,
        },
      ]}
      render={({ values }) => {
        const gain = values.gain;
        const cgtFull = (gain - CGT_ANNUAL_EXEMPTION) * CGT_HIGHER;
        const badrSlice = Math.min(gain, BADR_LIFETIME_LIMIT);
        const aboveSlice = Math.max(0, gain - BADR_LIFETIME_LIMIT);
        const cgtBadr =
          badrSlice * BADR_RATE + (aboveSlice - CGT_ANNUAL_EXEMPTION) * CGT_HIGHER;
        const cgtBadrSafe = Math.max(0, cgtBadr);
        return (
          <div className="space-y-3">
            <ComparisonBars
              bars={[
                { label: 'No BADR (24%)', value: cgtFull, color: SIM_COLORS.bad },
                { label: 'With BADR (14% on £1m)', value: cgtBadrSafe, color: SIM_COLORS.good },
              ]}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <SimBox label="CGT @ standard 24%" value={cgtFull} tone="bad" />
              <SimBox label="CGT with BADR" value={cgtBadrSafe} tone="ok" />
            </div>
            <SimBox
              label="BADR saving"
              value={cgtFull - cgtBadrSafe}
              tone="ok"
              full
            />
          </div>
        );
      }}
      footer="BADR caps at £1m of lifetime gain. Anything above is at the standard CGT rate. Qualifying continuously for 2 years before sale is non-negotiable."
    />
  );
}

function EotSaleSim() {
  return (
    <MiniSim
      title="EOT (0% CGT) vs trade sale (BADR + main rate)"
      inputs={[
        {
          key: 'saleValue',
          label: 'Sale value (≈ gain for founder cost basis)',
          defaultValue: 5_000_000,
          kind: 'currency',
          min: 100_000,
          step: 100_000,
        },
      ]}
      render={({ values }) => {
        const v = values.saleValue;
        const tradeBadr = Math.min(v, BADR_LIFETIME_LIMIT) * BADR_RATE;
        const tradeAbove =
          Math.max(0, v - BADR_LIFETIME_LIMIT - CGT_ANNUAL_EXEMPTION) * CGT_HIGHER;
        const tradeTotal = tradeBadr + tradeAbove;
        const tradeNet = v - tradeTotal;
        const eotNet = v;
        return (
          <div className="space-y-3">
            <ComparisonBars
              bars={[
                { label: 'Trade sale net', value: tradeNet, color: SIM_COLORS.warn },
                { label: 'EOT net (0% CGT)', value: eotNet, color: SIM_COLORS.good },
              ]}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <SimBox label="Trade-sale CGT" value={tradeTotal} tone="bad" />
              <SimBox label="EOT CGT" value={0} tone="ok" />
            </div>
            <SimBox
              label="EOT advantage on the headline number"
              value={eotNet - tradeNet}
              tone="ok"
              full
            />
            <p className="text-[12px] text-ink-500 dark:text-ink-400">
              EOT consideration is typically <em>deferred</em> — paid out of
              future trading profits over years. The headline number is right;
              the certainty of receiving it depends on the company\'s
              continuing performance.
            </p>
          </div>
        );
      }}
    />
  );
}

function EarnOutsSim() {
  return (
    <MiniSim
      title="Earn-out as capital vs as employment income"
      inputs={[
        {
          key: 'earnout',
          label: 'Contingent consideration',
          defaultValue: 500_000,
          kind: 'currency',
          min: 50_000,
          step: 25_000,
        },
      ]}
      render={({ values }) => {
        const eo = values.earnout;
        const capitalTax = eo * BADR_RATE;
        const incomeTax = eo * 0.47;
        return (
          <div className="space-y-3">
            <ComparisonBars
              bars={[
                { label: 'Capital (BADR 14%)', value: capitalTax, color: SIM_COLORS.good },
                { label: 'Employment income (47%)', value: incomeTax, color: SIM_COLORS.bad },
              ]}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <SimBox label="Capital treatment" value={capitalTax} tone="ok" />
              <SimBox label="Income treatment" value={incomeTax} tone="bad" />
            </div>
            <SimBox
              label="Cost of getting the structure wrong"
              value={incomeTax - capitalTax}
              tone="bad"
              full
            />
          </div>
        );
      }}
      footer="HMRC recharacterises earn-outs as employment when the seller is required to remain employed for the earn-out to vest. The structural drafting of the SPA matters as much as the headline price."
    />
  );
}

// ------------------- Income Classification (additional) --------------------

function EquityVsCashSim() {
  return (
    <MiniSim
      title="Cash bonus vs growth equity over the same horizon"
      inputs={[
        {
          key: 'amount',
          label: 'Total compensation value',
          defaultValue: 200_000,
          kind: 'currency',
          min: 10_000,
          step: 10_000,
        },
      ]}
      render={({ values }) => {
        const amt = values.amount;
        const cashNet = amt * (1 - 0.47);
        const equityNet = amt * (1 - BADR_RATE);
        return (
          <div className="space-y-3">
            <ComparisonBars
              bars={[
                { label: 'Cash bonus (47%)', value: cashNet, color: SIM_COLORS.warn },
                { label: 'BADR equity (14%)', value: equityNet, color: SIM_COLORS.good },
              ]}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <SimBox label="Cash bonus net" value={cashNet} tone="warn" />
              <SimBox label="BADR equity net" value={equityNet} tone="ok" />
            </div>
            <SimBox
              label="Tax saved by routing through equity"
              value={equityNet - cashNet}
              tone="ok"
              full
            />
          </div>
        );
      }}
      footer="Assumes the equity arrangement is properly structured (EMI, growth shares) so it isn't taxed as income at vest. Failed structures collapse back into the cash-bonus column."
    />
  );
}

function CapitalVsIncomeSim() {
  return (
    <MiniSim
      title="Same gain, two classifications"
      inputs={[
        {
          key: 'gain',
          label: 'Realised gain on the disposal',
          defaultValue: 100_000,
          kind: 'currency',
          min: 10_000,
          step: 5_000,
        },
      ]}
      render={({ values }) => {
        const g = values.gain;
        const capital = (g - CGT_ANNUAL_EXEMPTION) * CGT_HIGHER;
        const income = g * 0.47;
        return (
          <div className="space-y-3">
            <ComparisonBars
              bars={[
                { label: 'Capital (24% CGT)', value: capital, color: SIM_COLORS.good },
                { label: 'Trading income (47%)', value: income, color: SIM_COLORS.bad },
              ]}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <SimBox label="Capital classification" value={capital} tone="ok" />
              <SimBox label="Income classification" value={income} tone="bad" />
            </div>
            <SimBox
              label="Cost of recharacterisation"
              value={income - capital}
              tone="bad"
              full
            />
          </div>
        );
      }}
      footer="Badges of trade — frequency, modifications for sale, length of holding, motive — drive HMRC's classification. Pure investment with long holding usually stays capital; serial flipping usually doesn't."
    />
  );
}

function Ir35Sim() {
  const inputs: InputSpec[] = [
    {
      key: 'annualRevenue',
      defaultValue: 120_000,
      min: 20_000,
      step: 5_000,
      label: 'Contract value (annual)',
    },
    {
      key: 'annualCosts',
      defaultValue: 5_000,
      min: 0,
      step: 500,
      label: 'Genuine business costs',
    },
    {
      key: 'pensionContribution',
      defaultValue: 0,
      min: 0,
      max: 60_000,
      step: 500,
      label: 'Pension contribution',
    },
  ];
  return (
    <ShowWithMyNumbers
      title="Outside-IR35 vs inside-IR35 net to you"
      inputs={inputs}
      render={({ values }) => {
        const r = values.annualRevenue ?? 0;
        const c = values.annualCosts ?? 0;
        const pension = values.pensionContribution ?? 0;
        const outside = ltdResult({
          revenue: r,
          costs: c,
          ownerSalary: PERSONAL_ALLOWANCE,
          desiredCash: r,
          pensionContribution: pension,
        });
        const insideSalary = Math.max(0, r - c - pension);
        const insidePersonal = computeSalaryAndDividends(insideSalary, 0);
        const insideEmployerNi =
          Math.max(0, insideSalary - 5_000) * 0.15;
        const insideTotalTax =
          insidePersonal.itOnSalary +
          insidePersonal.employeeNI +
          insideEmployerNi;
        const insideNet = insidePersonal.netSalary;
        const advantage = outside.ownerTotalNet - insideNet;
        return (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <SimBox
                label="Outside IR35 — total tax"
                value={outside.totalTaxToHmrc}
                tone="bad"
              />
              <SimBox
                label="Inside IR35 — total tax"
                value={insideTotalTax}
                tone="bad"
              />
              <SimBox
                label="Outside IR35 — net to you"
                value={outside.ownerTotalNet}
                tone="ok"
              />
              <SimBox
                label="Inside IR35 — net to you"
                value={insideNet}
                tone="warn"
              />
            </div>
            <SimBox
              label="Outside-IR35 advantage"
              value={advantage}
              tone="ok"
              full
            />
            <p className="text-[12px] text-ink-500 dark:text-ink-400">
              Inside IR35 collapses most of the PSC tax saving. The structural
              defence is genuine independence, not the contract wording.
            </p>
          </div>
        );
      }}
    />
  );
}

// ------------------- Multi-Entity & Group (additional) --------------------

function GroupReliefSim() {
  return (
    <MiniSim
      title="Group relief vs carry-forward"
      inputs={[
        {
          key: 'lossSubLoss',
          label: 'Year-1 loss in Sub A',
          defaultValue: 80_000,
          kind: 'currency',
          min: 0,
          step: 5_000,
        },
        {
          key: 'profitSubProfit',
          label: 'Year-1 profit in Sub B',
          defaultValue: 200_000,
          kind: 'currency',
          min: 0,
          step: 10_000,
        },
      ]}
      render={({ values }) => {
        const loss = values.lossSubLoss;
        const profit = values.profitSubProfit;
        // Without group relief: Sub B pays CT on full profit; Sub A carries loss forward.
        const ctSubBStandalone = profit * CT_MAIN_RATE;
        // With group relief: loss surrendered against Sub B's profit.
        const offset = Math.min(loss, profit);
        const ctSubBPostRelief = (profit - offset) * CT_MAIN_RATE;
        const ctSaved = ctSubBStandalone - ctSubBPostRelief;
        return (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <SimBox
                label="Sub B CT — no group relief"
                value={ctSubBStandalone}
                tone="bad"
              />
              <SimBox
                label="Sub B CT — with group relief"
                value={ctSubBPostRelief}
                tone="ok"
              />
            </div>
            <SimBox
              label="Cash saved this year (rest of loss carries forward)"
              value={ctSaved}
              tone="ok"
              full
            />
          </div>
        );
      }}
      footer="Available where the parent owns ≥75% of both subs. Without group relief, the loss only shelters Sub A's own future profit — possibly years away."
    />
  );
}

function InterCoChargesSim() {
  return (
    <MiniSim
      title="Recharge effect on group CT"
      inputs={[
        {
          key: 'subProfit',
          label: 'Trading sub pre-recharge profit',
          defaultValue: 280_000,
          kind: 'currency',
          min: 0,
          step: 10_000,
          hint: 'Currently in the marginal-relief band (£50k–£250k) so the marginal CT rate is above 25%.',
        },
        {
          key: 'recharge',
          label: 'Holdco recharge to sub',
          defaultValue: 50_000,
          kind: 'currency',
          min: 0,
          max: 250_000,
          step: 5_000,
        },
      ]}
      render={({ values }) => {
        const subProfit = values.subProfit;
        const recharge = Math.min(values.recharge, subProfit);
        // Holdco assumed loss-making prior to recharge for simplicity (so the
        // recharge offsets its costs and is taxed within its small-profits band).
        const ctSubBefore = subProfit * CT_MAIN_RATE;
        const ctSubAfter = (subProfit - recharge) * CT_MAIN_RATE;
        const ctHoldcoOnRecharge = recharge * CT_SMALL_RATE;
        const groupBefore = ctSubBefore;
        const groupAfter = ctSubAfter + ctHoldcoOnRecharge;
        return (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <SimBox
                label="Group CT without recharge"
                value={groupBefore}
                tone="bad"
              />
              <SimBox
                label="Group CT with arm\'s-length recharge"
                value={groupAfter}
                tone="warn"
              />
            </div>
            <SimBox
              label="Difference"
              value={groupBefore - groupAfter}
              tone={groupBefore > groupAfter ? 'ok' : 'warn'}
              full
            />
          </div>
        );
      }}
      footer="Only legitimate when the holdco genuinely provides the service and the recharge is at arm\'s-length. Paper-only management fees get challenged."
    />
  );
}

// ------------------- Long-Term Wealth (additional) --------------------

function IhtBprSim() {
  return (
    <MiniSim
      title="BPR on a worked estate"
      inputs={[
        {
          key: 'estate',
          label: 'Total estate value',
          defaultValue: 3_000_000,
          kind: 'currency',
          min: 500_000,
          step: 50_000,
        },
        {
          key: 'bpr',
          label: 'Of which qualifying BPR',
          defaultValue: 2_000_000,
          kind: 'currency',
          min: 0,
          step: 50_000,
        },
      ]}
      render={({ values }) => {
        const estate = values.estate;
        const bpr = Math.min(values.bpr, estate);
        const nonBpr = estate - bpr;
        const bands = IHT_NIL_RATE_BAND + 175_000;
        const taxableNonBpr = Math.max(0, nonBpr - bands);
        const noRelief = Math.max(0, estate - bands) * IHT_RATE;
        const fullRelief = taxableNonBpr * IHT_RATE; // pre-2026
        // Post-2026 cap.
        const cap = 1_000_000;
        const aboveCap = Math.max(0, bpr - cap);
        const taxableBprAfterCap = aboveCap * 0.5;
        const cappedRelief =
          (taxableNonBpr + taxableBprAfterCap) * IHT_RATE;
        return (
          <div className="space-y-3">
            <ComparisonBars
              bars={[
                { label: 'No relief', value: noRelief, color: SIM_COLORS.bad },
                { label: 'Pre-Apr-2026', value: fullRelief, color: SIM_COLORS.good },
                { label: 'Post-Apr-2026', value: cappedRelief, color: SIM_COLORS.warn },
              ]}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <SimBox label="No relief" value={noRelief} tone="bad" />
              <SimBox label="Pre-Apr-2026" value={fullRelief} tone="ok" />
              <SimBox label="Post-Apr-2026 cap" value={cappedRelief} tone="warn" />
            </div>
          </div>
        );
      }}
    />
  );
}

function Gifting7YearSim() {
  return (
    <MiniSim
      title="Death within 7 years of a gift"
      inputs={[
        {
          key: 'gift',
          label: 'Gift value',
          defaultValue: 300_000,
          kind: 'currency',
          min: 10_000,
          step: 10_000,
        },
        {
          key: 'yearsBeforeDeath',
          label: 'Years between gift and death',
          defaultValue: 5,
          kind: 'years',
          min: 0,
          max: 8,
        },
      ]}
      render={({ values }) => {
        const gift = values.gift;
        const years = Math.min(Math.max(0, values.yearsBeforeDeath), 8);
        const fullIht = gift * IHT_RATE;
        const ihtAt = (yrs: number) => {
          if (yrs >= 7) return 0;
          if (yrs >= 6) return fullIht * 0.2;
          if (yrs >= 5) return fullIht * 0.4;
          if (yrs >= 4) return fullIht * 0.6;
          if (yrs >= 3) return fullIht * 0.8;
          return fullIht;
        };
        const data = Array.from({ length: 9 }, (_, y) => ({
          year: y,
          iht: Math.round(ihtAt(y)),
        }));
        const ihtDue = ihtAt(years);
        return (
          <div className="space-y-3">
            <TimeSeriesChart
              data={data}
              series={[
                { key: 'iht', name: 'IHT due on death this year', color: SIM_COLORS.bad },
              ]}
              xKey="year"
              yFormat={(v) => `£${Math.round(v / 1000)}k`}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <SimBox
                label="IHT if death immediately after the gift"
                value={fullIht}
                tone="bad"
              />
              <SimBox
                label={`IHT after ${years} year${years === 1 ? '' : 's'}`}
                value={ihtDue}
                tone={ihtDue === 0 ? 'ok' : ihtDue < fullIht ? 'warn' : 'bad'}
              />
            </div>
            <p className="text-[12px] text-ink-500 dark:text-ink-400">
              Tapered relief reduces the IHT on a gift in years 3–7 of survival
              (not the gift itself). Survival of 7 full years removes the gift
              entirely. Assumes the gift is above the nil-rate band.
            </p>
          </div>
        );
      }}
    />
  );
}

// ------------------- Misunderstood (additional) --------------------

function CryptoMythSim() {
  return (
    <MiniSim
      title="Crypto pay = double tax, not no tax"
      inputs={[
        {
          key: 'gbpAtReceipt',
          label: 'GBP value of crypto when paid to you',
          defaultValue: 60_000,
          kind: 'currency',
          min: 1_000,
          step: 500,
        },
        {
          key: 'gbpAtSale',
          label: 'GBP value when you later sell',
          defaultValue: 90_000,
          kind: 'currency',
          min: 0,
          step: 500,
        },
      ]}
      render={({ values }) => {
        const atReceipt = values.gbpAtReceipt;
        const atSale = values.gbpAtSale;
        // Income tax + NI at higher rate as illustrative.
        const incomeTax =
          (atReceipt - PERSONAL_ALLOWANCE > 0
            ? Math.min(atReceipt - PERSONAL_ALLOWANCE, 37_700) * IT_BASIC +
              Math.max(0, atReceipt - 50_270) * IT_HIGHER
            : 0) +
          (atReceipt > NI_PT()
            ? niEstimate(atReceipt)
            : 0);
        const cgt = Math.max(0, atSale - atReceipt - CGT_ANNUAL_EXEMPTION) * CGT_HIGHER;
        const cashOnlyIncomeTax = incomeTax; // identical IT/NI on a cash salary
        return (
          <div className="space-y-3">
            <ComparisonBars
              bars={[
                {
                  label: 'Cash salary (IT + NI only)',
                  value: cashOnlyIncomeTax,
                  color: SIM_COLORS.warn,
                },
                {
                  label: 'Crypto pay (IT + NI + CGT)',
                  value: incomeTax + cgt,
                  color: SIM_COLORS.bad,
                },
              ]}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <SimBox label="IT + NI at receipt" value={incomeTax} tone="bad" />
              <SimBox label="CGT on subsequent disposal" value={cgt} tone="bad" />
              <SimBox
                label="Total tax across both events"
                value={incomeTax + cgt}
                tone="bad"
              />
            </div>
            <p className="text-[12px] text-ink-500 dark:text-ink-400">
              HMRC values crypto received as employment income at GBP at the
              date of receipt — same income tax + NI as cash. Any further
              appreciation is then taxed under CGT on sale. There is no
              avoidance angle.
            </p>
          </div>
        );
      }}
    />
  );
}

// Small helpers used only by CryptoMythSim.
function NI_PT() {
  return PERSONAL_ALLOWANCE;
}
function niEstimate(salary: number) {
  const inMain = Math.max(0, Math.min(salary, 50_270) - PERSONAL_ALLOWANCE);
  const inUpper = Math.max(0, salary - 50_270);
  return inMain * 0.08 + inUpper * 0.02;
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

