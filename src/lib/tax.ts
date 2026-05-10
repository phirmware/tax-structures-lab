// UK tax calculation engine.
// Pure functions only. Each returns the inputs, the bands hit, the rate breakdown,
// so the UI can render an explanation panel for any number.
//
// PRINCIPLES persist; numbers change. See constants.ts for the dated figures.

import {
  BASIC_RATE_LIMIT,
  CGT_ANNUAL_EXEMPTION,
  CGT_BASIC,
  CGT_HIGHER,
  CT_MAIN_RATE,
  CT_MAIN_THRESHOLD,
  CT_MARGINAL_FRACTION,
  CT_SMALL_PROFITS,
  CT_SMALL_RATE,
  C4_LOWER,
  C4_MAIN,
  C4_UPPER,
  C4_UPPER_RATE,
  DIVIDEND_ALLOWANCE,
  DIV_ADDITIONAL,
  DIV_BASIC,
  DIV_HIGHER,
  HIGHER_RATE_LIMIT,
  IT_ADDITIONAL,
  IT_BASIC,
  IT_HIGHER,
  NI_ER_RATE,
  NI_ER_THRESHOLD,
  NI_MAIN,
  NI_PT,
  NI_UEL,
  NI_UPPER,
  PA_TAPER_END,
  PA_TAPER_START,
  PERSONAL_ALLOWANCE,
} from './constants';

// ---------- Personal Allowance with taper ----------

export function personalAllowance(grossIncome: number): number {
  if (grossIncome <= PA_TAPER_START) return PERSONAL_ALLOWANCE;
  if (grossIncome >= PA_TAPER_END) return 0;
  const reduction = (grossIncome - PA_TAPER_START) / 2;
  return Math.max(0, PERSONAL_ALLOWANCE - reduction);
}

// ---------- Income tax on a salary (rUK) ----------
// Treats `salary` as the only earned income. For combined cases see computeMix.

export interface ITBreakdown {
  basic: number;
  higher: number;
  additional: number;
  total: number;
  pa: number;
  taxableIncome: number;
}

export function incomeTaxOnSalary(salary: number): ITBreakdown {
  const pa = personalAllowance(salary);
  const taxable = Math.max(0, salary - pa);

  // Bands measured against the *original* thresholds, but applied to taxable amount.
  // Basic rate band runs from 0 → (BASIC_RATE_LIMIT - PA_FULL) of taxable income.
  // We recompute thresholds on taxable income for clarity.
  const basicEnd = BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE; // 37,700
  const higherEnd = HIGHER_RATE_LIMIT - PERSONAL_ALLOWANCE; // 112,570

  const inBasic = Math.min(taxable, basicEnd);
  const inHigher = Math.max(0, Math.min(taxable, higherEnd) - basicEnd);
  const inAdditional = Math.max(0, taxable - higherEnd);

  const basic = inBasic * IT_BASIC;
  const higher = inHigher * IT_HIGHER;
  const additional = inAdditional * IT_ADDITIONAL;

  return {
    basic,
    higher,
    additional,
    total: basic + higher + additional,
    pa,
    taxableIncome: taxable,
  };
}

// ---------- Employee NI (Class 1) ----------

export interface NIBreakdown {
  main: number;
  upper: number;
  total: number;
}

export function employeeNI(salary: number): NIBreakdown {
  const inMain = Math.max(0, Math.min(salary, NI_UEL) - NI_PT);
  const inUpper = Math.max(0, salary - NI_UEL);
  const main = inMain * NI_MAIN;
  const upper = inUpper * NI_UPPER;
  return { main, upper, total: main + upper };
}

export function employerNI(salary: number): number {
  return Math.max(0, salary - NI_ER_THRESHOLD) * NI_ER_RATE;
}

// ---------- Class 4 NI (self-employed) ----------

export function class4NI(profit: number): number {
  const inMain = Math.max(0, Math.min(profit, C4_UPPER) - C4_LOWER);
  const inUpper = Math.max(0, profit - C4_UPPER);
  return inMain * C4_MAIN + inUpper * C4_UPPER_RATE;
}

// ---------- Corporation tax with marginal relief ----------

export interface CTBreakdown {
  smallProfits: number;
  mainRate: number;
  marginalRelief: number;
  total: number;
  effectiveRate: number;
}

export function corporationTax(profit: number): CTBreakdown {
  if (profit <= 0) {
    return {
      smallProfits: 0,
      mainRate: 0,
      marginalRelief: 0,
      total: 0,
      effectiveRate: 0,
    };
  }

  if (profit <= CT_SMALL_PROFITS) {
    const total = profit * CT_SMALL_RATE;
    return {
      smallProfits: total,
      mainRate: 0,
      marginalRelief: 0,
      total,
      effectiveRate: total / profit,
    };
  }

  if (profit >= CT_MAIN_THRESHOLD) {
    const total = profit * CT_MAIN_RATE;
    return {
      smallProfits: 0,
      mainRate: total,
      marginalRelief: 0,
      total,
      effectiveRate: CT_MAIN_RATE,
    };
  }

  // Marginal: tax at main rate, less relief = (U − A) × N/A × fraction
  // Where U=250k, A=profits, N=profits (no FII), fraction=3/200.
  // Standard simplified: TAX = profit * 25% - (250000 - profit) * 3/200
  const mainRate = profit * CT_MAIN_RATE;
  const marginalRelief = (CT_MAIN_THRESHOLD - profit) * CT_MARGINAL_FRACTION;
  const total = Math.max(0, mainRate - marginalRelief);
  return {
    smallProfits: 0,
    mainRate,
    marginalRelief,
    total,
    effectiveRate: total / profit,
  };
}

// ---------- Combined income tax: salary + dividends ----------
// Dividends sit on top of non-savings income for band purposes.
// A simplified but accurate-enough engine for teaching.

export interface CombinedBreakdown {
  salary: number;
  dividends: number;
  pa: number;
  // Income tax on salary
  itOnSalary: number;
  // Dividend tax
  dividendAllowanceUsed: number;
  divBasic: number;
  divHigher: number;
  divAdditional: number;
  totalDividendTax: number;
  // NI
  employeeNI: number;
  // Aggregates
  totalPersonalTax: number;
  netSalary: number;
  netDividends: number;
  totalNet: number;
}

export function computeSalaryAndDividends(
  salary: number,
  dividends: number,
): CombinedBreakdown {
  const totalIncome = salary + dividends;
  const pa = personalAllowance(totalIncome);

  // Step 1: salary uses PA first, then bands.
  const salaryTaxable = Math.max(0, salary - pa);
  const paUsedBySalary = salary - salaryTaxable;
  const paLeft = Math.max(0, pa - paUsedBySalary);

  const basicEnd = BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE; // 37,700
  const higherEnd = HIGHER_RATE_LIMIT - PERSONAL_ALLOWANCE; // 112,570

  const salaryInBasic = Math.min(salaryTaxable, basicEnd);
  const salaryInHigher = Math.max(
    0,
    Math.min(salaryTaxable, higherEnd) - basicEnd,
  );
  const salaryInAdditional = Math.max(0, salaryTaxable - higherEnd);
  const itOnSalary =
    salaryInBasic * IT_BASIC +
    salaryInHigher * IT_HIGHER +
    salaryInAdditional * IT_ADDITIONAL;

  // Step 2: dividends use any leftover PA, then £500 dividend allowance, then bands.
  let divRemaining = dividends;
  const paOnDiv = Math.min(divRemaining, paLeft);
  divRemaining -= paOnDiv;

  const dividendAllowanceUsed = Math.min(divRemaining, DIVIDEND_ALLOWANCE);
  // Note: the £500 allowance still counts toward band usage.
  divRemaining -= dividendAllowanceUsed;

  // Bands remaining for dividends. Two things consume band capacity:
  //   - salaryTaxable: salary above PA sits in the bands.
  //   - dividendAllowanceUsed: the £500 allowance is at 0% but still occupies
  //     the band space it falls into (it's a rate slice, not extra room).
  // Crucially, paOnDiv (dividend covered by leftover PA) does NOT consume any
  // band — PA-covered income sits *below* the basic-rate band. Including it
  // would artificially advance the user up the bands and over-charge tax.
  const usedTotalForBands = salaryTaxable + dividendAllowanceUsed;
  const remainingInBasic = Math.max(0, basicEnd - usedTotalForBands);
  const usedAfterBasic = Math.max(0, usedTotalForBands - basicEnd);
  const remainingInHigher = Math.max(
    0,
    higherEnd - basicEnd - usedAfterBasic,
  );

  const divInBasic = Math.min(divRemaining, remainingInBasic);
  divRemaining -= divInBasic;
  const divInHigher = Math.min(divRemaining, remainingInHigher);
  divRemaining -= divInHigher;
  const divInAdditional = divRemaining;

  const divBasic = divInBasic * DIV_BASIC;
  const divHigher = divInHigher * DIV_HIGHER;
  const divAdditional = divInAdditional * DIV_ADDITIONAL;
  const totalDividendTax = divBasic + divHigher + divAdditional;

  const ni = employeeNI(salary).total;

  const totalPersonalTax = itOnSalary + totalDividendTax + ni;
  const netSalary = salary - itOnSalary - ni;
  const netDividends = dividends - totalDividendTax;

  return {
    salary,
    dividends,
    pa,
    itOnSalary,
    dividendAllowanceUsed,
    divBasic,
    divHigher,
    divAdditional,
    totalDividendTax,
    employeeNI: ni,
    totalPersonalTax,
    netSalary,
    netDividends,
    totalNet: netSalary + netDividends,
  };
}

// ---------- CGT ----------

export interface CGTBreakdown {
  exempt: number;
  taxableGain: number;
  basicSlice: number;
  higherSlice: number;
  total: number;
}

// Income is the user's other taxable income, used to allocate gains across bands.
export function capitalGainsTax(gain: number, otherTaxableIncome: number): CGTBreakdown {
  if (gain <= 0)
    return { exempt: 0, taxableGain: 0, basicSlice: 0, higherSlice: 0, total: 0 };

  const exempt = Math.min(gain, CGT_ANNUAL_EXEMPTION);
  const taxableGain = gain - exempt;

  const basicEnd = BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE; // 37,700
  const remainingBasic = Math.max(0, basicEnd - otherTaxableIncome);

  const inBasic = Math.min(taxableGain, remainingBasic);
  const inHigher = taxableGain - inBasic;

  const basicSlice = inBasic * CGT_BASIC;
  const higherSlice = inHigher * CGT_HIGHER;
  return {
    exempt,
    taxableGain,
    basicSlice,
    higherSlice,
    total: basicSlice + higherSlice,
  };
}

// ---------- Sole trader cash flow ----------

export interface SoleTraderResult {
  revenue: number;
  costs: number;
  profit: number;
  itOnProfit: number;
  class4NI: number;
  totalTax: number;
  netToOwner: number;
  effectiveTaxRate: number;
}

export function soleTraderResult(
  revenue: number,
  costs: number,
): SoleTraderResult {
  const profit = Math.max(0, revenue - costs);
  // Self-employed income is taxed at IT bands (no NI Class 1, but Class 4)
  const it = incomeTaxOnSalary(profit).total;
  const ni4 = class4NI(profit);
  const totalTax = it + ni4;
  return {
    revenue,
    costs,
    profit,
    itOnProfit: it,
    class4NI: ni4,
    totalTax,
    netToOwner: profit - totalTax,
    effectiveTaxRate: profit > 0 ? totalTax / profit : 0,
  };
}

// ---------- Limited company cash flow ----------

export type ExtractionStrategy =
  | 'salary-heavy'
  | 'dividend-heavy'
  | 'balanced'
  | 'retain';

export interface LtdInputs {
  revenue: number;
  costs: number; // pre-salary costs
  ownerSalary: number; // gross salary the company pays the director
  pensionContribution?: number; // employer pension (deductible)
  rdEligibleSpend?: number; // for illustration
  desiredCash: number; // how much the director wants to take after personal tax
}

export interface LtdResult {
  inputs: LtdInputs;
  // Company side
  revenue: number;
  costs: number;
  ownerSalary: number;
  employerNI: number;
  pensionContribution: number;
  rdReliefBenefit: number; // illustrative
  preTaxProfit: number;
  corporationTax: CTBreakdown;
  postTaxProfit: number;
  // Personal side
  dividendDeclared: number;
  retainedEarnings: number;
  personal: CombinedBreakdown;
  // Aggregates
  totalTaxToHmrc: number;
  ownerTotalNet: number;
  companyRetained: number;
}

// Compute Ltd outcome given a salary level and a desiredCash.
export function ltdResult(inputs: LtdInputs): LtdResult {
  const employerNi = employerNI(inputs.ownerSalary);
  const pension = inputs.pensionContribution ?? 0;
  const rdSpend = inputs.rdEligibleSpend ?? 0;

  // Illustrative R&D benefit: ~16.2% of qualifying spend under SME merged scheme.
  // In reality this is much more nuanced — but principle is what counts.
  const rdReliefBenefit = rdSpend * 0.162;

  const operatingCosts = inputs.costs + inputs.ownerSalary + employerNi + pension;
  // preTaxProfit can be negative — company is at a loss when salary+erNI exceeds operating profit.
  // We don't clamp here; the diagram and breakdown show the deficit honestly.
  const preTaxProfit = inputs.revenue - operatingCosts + rdReliefBenefit;
  const ct = corporationTax(preTaxProfit);
  const postTaxProfit = preTaxProfit - ct.total;

  // Only distributable if the company is in profit after tax.
  const distributable = Math.max(0, postTaxProfit);

  // Figure out how much dividend is needed to give desiredCash on top of net salary.
  // Use bisection — accurate even with bands.
  const personalNoDiv = computeSalaryAndDividends(inputs.ownerSalary, 0);
  const cashFromSalary = personalNoDiv.netSalary;
  const cashStillNeeded = Math.max(0, inputs.desiredCash - cashFromSalary);

  let lo = 0;
  let hi = distributable;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const mix = computeSalaryAndDividends(inputs.ownerSalary, mid);
    const personalCash = mix.totalNet;
    if (personalCash >= inputs.desiredCash) hi = mid;
    else lo = mid;
  }
  const dividendDeclared = Math.min(hi, distributable);
  const retainedEarnings = Math.max(0, distributable - dividendDeclared);

  const personal = computeSalaryAndDividends(inputs.ownerSalary, dividendDeclared);
  const totalTaxToHmrc =
    employerNi + ct.total + personal.totalPersonalTax;

  return {
    inputs,
    revenue: inputs.revenue,
    costs: inputs.costs,
    ownerSalary: inputs.ownerSalary,
    employerNI: employerNi,
    pensionContribution: pension,
    rdReliefBenefit,
    preTaxProfit,
    corporationTax: ct,
    postTaxProfit,
    dividendDeclared,
    retainedEarnings,
    personal,
    totalTaxToHmrc,
    ownerTotalNet: personal.totalNet,
    companyRetained: retainedEarnings,
  };
}

// ---------- Strategy presets for Ltd salary level ----------

export function recommendedSalary(strategy: ExtractionStrategy): number {
  switch (strategy) {
    case 'salary-heavy':
      return 70_000;
    case 'dividend-heavy':
      return 12_570; // PA, no IT
    case 'balanced':
      return 12_570;
    case 'retain':
      return 12_570;
  }
}

/**
 * Maximum director salary the company can pay without running a pre-tax loss.
 * Solves: salary + max(0, salary − NI_ER_THRESHOLD) × NI_ER_RATE = available
 */
export function maxDirectorSalary(revenue: number, costs: number, pension = 0): number {
  const available = Math.max(0, revenue - costs - pension);
  if (available <= NI_ER_THRESHOLD) return available;
  // salary × (1 + NI_ER_RATE) − NI_ER_THRESHOLD × NI_ER_RATE = available
  return (available + NI_ER_THRESHOLD * NI_ER_RATE) / (1 + NI_ER_RATE);
}

// ---------- Partnership / LLP ----------

export interface PartnershipResult {
  revenue: number;
  costs: number;
  profit: number;
  numPartners: number;
  profitPerPartner: number;
  itPerPartner: number;
  class4NIPerPartner: number;
  taxPerPartner: number;
  netPerPartner: number;
  totalTaxToHmrc: number;
  totalNetToOwners: number;
  effectiveTaxRate: number;
}

export function partnershipResult(
  revenue: number,
  costs: number,
  numPartners = 2,
): PartnershipResult {
  const profit = Math.max(0, revenue - costs);
  const profitPerPartner = profit / numPartners;
  const it = incomeTaxOnSalary(profitPerPartner).total;
  const ni = class4NI(profitPerPartner);
  const taxPerPartner = it + ni;
  const netPerPartner = profitPerPartner - taxPerPartner;
  return {
    revenue,
    costs,
    profit,
    numPartners,
    profitPerPartner,
    itPerPartner: it,
    class4NIPerPartner: ni,
    taxPerPartner,
    netPerPartner,
    totalTaxToHmrc: taxPerPartner * numPartners,
    totalNetToOwners: netPerPartner * numPartners,
    effectiveTaxRate: profit > 0 ? (taxPerPartner * numPartners) / profit : 0,
  };
}

// ---------- Umbrella company ----------

export interface UmbrellaResult {
  revenue: number;
  umbrellaFee: number;
  employerNI: number;
  grossPay: number;
  itOnPay: number;
  employeeNI: number;
  totalTax: number;
  netToContractor: number;
  effectiveTaxRate: number;
}

export function umbrellaResult(revenue: number, umbrellaFee = 2_400): UmbrellaResult {
  // Umbrella absorbs fee first; remaining must cover employer NI + gross pay.
  // maxDirectorSalary solves: pay + employerNI(pay) = available.
  const grossPay = maxDirectorSalary(revenue, umbrellaFee);
  const erNI = employerNI(grossPay);
  const it = incomeTaxOnSalary(grossPay).total;
  const eeNI = employeeNI(grossPay).total;
  const totalTax = erNI + it + eeNI;
  return {
    revenue,
    umbrellaFee,
    employerNI: erNI,
    grossPay,
    itOnPay: it,
    employeeNI: eeNI,
    totalTax,
    netToContractor: grossPay - it - eeNI,
    effectiveTaxRate: revenue > 0 ? totalTax / revenue : 0,
  };
}

// ---------- Ltd inside IR35 (deemed employment) ----------

export interface Ir35Result {
  revenue: number;
  costs: number;
  available: number;
  employerNI: number;
  deemedSalary: number;
  itOnSalary: number;
  employeeNI: number;
  totalTax: number;
  netToContractor: number;
  effectiveTaxRate: number;
}

export function ir35Result(revenue: number, costs: number): Ir35Result {
  // IR35: all income treated as employment. Costs deduction preserved;
  // remainder becomes deemed salary on which both employer + employee NI apply.
  const deemedSalary = maxDirectorSalary(revenue, costs);
  const erNI = employerNI(deemedSalary);
  const it = incomeTaxOnSalary(deemedSalary).total;
  const eeNI = employeeNI(deemedSalary).total;
  const totalTax = erNI + it + eeNI;
  const available = Math.max(0, revenue - costs);
  return {
    revenue,
    costs,
    available,
    employerNI: erNI,
    deemedSalary,
    itOnSalary: it,
    employeeNI: eeNI,
    totalTax,
    netToContractor: deemedSalary - it - eeNI,
    effectiveTaxRate: available > 0 ? totalTax / available : 0,
  };
}

// ---------- Multi-year compounding helper ----------

export interface YearInput {
  revenue: number;
  costs: number;
  ownerSalary: number;
  desiredCash: number;
  pensionContribution?: number;
  rdEligibleSpend?: number;
}

export interface YearResult extends LtdResult {
  year: number;
  cumulativeRetained: number;
}

export function multiYearLtd(years: YearInput[], reinvestReturn = 0.07): YearResult[] {
  const out: YearResult[] = [];
  let pot = 0;
  years.forEach((y, idx) => {
    pot = pot * (1 + reinvestReturn);
    const r = ltdResult({
      revenue: y.revenue + pot * 0, // pot is held off P&L; revenue separate
      costs: y.costs,
      ownerSalary: y.ownerSalary,
      desiredCash: y.desiredCash,
      pensionContribution: y.pensionContribution,
      rdEligibleSpend: y.rdEligibleSpend,
    });
    pot += r.companyRetained;
    out.push({ ...r, year: idx + 1, cumulativeRetained: pot });
  });
  return out;
}
