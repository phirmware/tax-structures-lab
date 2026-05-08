// Single source of truth for tax/business/legal abbreviations used across the app.
// Adding a new abbreviation should be one-line work — just append to this map.

export interface AbbrEntry {
  /** The abbreviation as displayed (canonical case). */
  short: string;
  /** Full expanded term. */
  full: string;
  /** One-sentence plain-English definition. */
  definition: string;
  /** Optional internal route to learn more. */
  see?: string;
}

/**
 * The dictionary is keyed by the lowercased abbreviation. Add aliases by giving
 * different keys the same payload (e.g. 'r&d' and 'rd' both pointing at R&D).
 */
export const ABBREVIATIONS: Record<string, AbbrEntry> = {
  vat: {
    short: 'VAT',
    full: 'Value Added Tax',
    definition:
      'A tax on the value added to goods and services at each stage of production and distribution.',
    see: '/uk/vat',
  },
  cgt: {
    short: 'CGT',
    full: 'Capital Gains Tax',
    definition:
      'A tax on the profit when you sell an asset that has increased in value.',
    see: '/uk/cgt',
  },
  badr: {
    short: 'BADR',
    full: 'Business Asset Disposal Relief',
    definition:
      'A reduced rate of CGT when selling all or part of your business, subject to qualifying conditions.',
    see: '/uk/badr',
  },
  eis: {
    short: 'EIS',
    full: 'Enterprise Investment Scheme',
    definition:
      'A UK scheme offering income tax and capital gains relief to investors in qualifying small companies.',
    see: '/uk/eis-seis',
  },
  seis: {
    short: 'SEIS',
    full: 'Seed Enterprise Investment Scheme',
    definition:
      'A more generous version of EIS for very early-stage companies.',
    see: '/uk/eis-seis',
  },
  ni: {
    short: 'NI',
    full: 'National Insurance',
    definition:
      'UK contributions paid by employees, employers, and the self-employed that fund state benefits and pensions.',
    see: '/uk/income-tax',
  },
  nic: {
    short: 'NIC',
    full: 'National Insurance Contributions',
    definition: 'The specific payments made under the NI system.',
    see: '/uk/income-tax',
  },
  bik: {
    short: 'BiK',
    full: 'Benefit in Kind',
    definition:
      'Non-cash benefits provided by an employer that are treated as taxable income.',
    see: '/uk/directors-loan',
  },
  ir35: {
    short: 'IR35',
    full: 'Off-payroll working rules',
    definition:
      'UK tax rules that determine whether a contractor is genuinely self-employed or effectively an employee for tax purposes.',
    see: '/uk/ir35',
  },
  'r&d': {
    short: 'R&D',
    full: 'Research and Development',
    definition:
      'Activities aimed at creating new knowledge or capability, often eligible for tax credits.',
    see: '/uk/rd',
  },
  rd: {
    short: 'R&D',
    full: 'Research and Development',
    definition:
      'Activities aimed at creating new knowledge or capability, often eligible for tax credits.',
    see: '/uk/rd',
  },
  hmrc: {
    short: 'HMRC',
    full: "His Majesty's Revenue and Customs",
    definition:
      'The UK government department responsible for collecting taxes.',
  },
  'p&l': {
    short: 'P&L',
    full: 'Profit and Loss',
    definition:
      'A financial statement showing revenues, costs, and resulting profit or loss over a period.',
  },
  paye: {
    short: 'PAYE',
    full: 'Pay As You Earn',
    definition:
      'The system through which employers deduct income tax and NI from employee wages before paying them.',
  },
  ltd: {
    short: 'Ltd',
    full: 'Limited Company',
    definition:
      'A UK business structure where the company is a separate legal entity with limited liability for its owners.',
    see: '/structures/ltd',
  },
  llp: {
    short: 'LLP',
    full: 'Limited Liability Partnership',
    definition:
      'A partnership structure where individual partners have limited liability.',
    see: '/structures/llp',
  },
  isa: {
    short: 'ISA',
    full: 'Individual Savings Account',
    definition:
      'A UK tax-free savings or investment account with annual contribution limits.',
    see: '/uk/isa',
  },
  lisa: {
    short: 'LISA',
    full: 'Lifetime ISA',
    definition:
      'A specialised ISA for first home purchase or retirement, with a government bonus on contributions.',
    see: '/uk/isa',
  },
  iht: {
    short: 'IHT',
    full: 'Inheritance Tax',
    definition:
      'A tax on the estate (property, money, possessions) of someone who has died.',
    see: '/uk/iht',
  },
  ct: {
    short: 'CT',
    full: 'Corporation Tax',
    definition: 'The tax paid by UK companies on their profits.',
    see: '/uk/corporation-tax',
  },
  bpr: {
    short: 'BPR',
    full: 'Business Property Relief',
    definition:
      'An IHT relief that can exempt qualifying trading-business shares from inheritance tax.',
    see: '/uk/iht',
  },
  dla: {
    short: 'DLA',
    full: "Director's Loan Account",
    definition:
      'A running record of money owed between a company and its director.',
    see: '/uk/directors-loan',
  },
  pa: {
    short: 'PA',
    full: 'Personal Allowance',
    definition:
      'The slice of personal income each year taxed at 0% (currently £12,570).',
    see: '/uk/income-tax',
  },
  psc: {
    short: 'PSC',
    full: 'Personal Service Company',
    definition:
      "A limited company set up primarily to provide one person's services — often the focus of IR35.",
    see: '/structures/psc',
  },
  fic: {
    short: 'FIC',
    full: 'Family Investment Company',
    definition:
      'A company designed to hold investments and pass wealth across generations at corporate tax rates.',
    see: '/structures/fic',
  },
  pe: {
    short: 'PE',
    full: 'Permanent Establishment',
    definition:
      "A taxable presence in a foreign country triggered by a fixed place of business or dependent agent.",
  },
  vct: {
    short: 'VCT',
    full: 'Venture Capital Trust',
    definition:
      'A listed UK investment vehicle backing small companies, with income-tax relief for investors.',
  },
  qsbs: {
    short: 'QSBS',
    full: 'Qualified Small Business Stock',
    definition:
      "A US capital-gains incentive analogous to BADR, exempting up to $10m of gain on qualifying shares.",
  },
  gaar: {
    short: 'GAAR',
    full: 'General Anti-Avoidance Rule',
    definition:
      'A broad UK rule allowing HMRC to challenge tax arrangements that lack commercial substance.',
  },
};

export function findAbbr(rawTerm: string): AbbrEntry | null {
  if (!rawTerm) return null;
  const k = rawTerm.toLowerCase().trim();
  return ABBREVIATIONS[k] ?? null;
}

/** Sorted list (A→Z) of unique entries, suitable for a glossary panel. */
export function abbrList(): AbbrEntry[] {
  const seen = new Set<string>();
  const out: AbbrEntry[] = [];
  for (const e of Object.values(ABBREVIATIONS)) {
    if (seen.has(e.short)) continue;
    seen.add(e.short);
    out.push(e);
  }
  out.sort((a, b) => a.short.localeCompare(b.short));
  return out;
}
