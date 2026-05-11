// Plain-English definitions used by the global tooltip. Keep this short and durable;
// tax law specifics belong in lesson copy, not here.

export interface GlossaryEntry {
  term: string;
  short: string;
  see?: string; // section/lesson route to learn more
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
  'sole trader': {
    term: 'Sole trader',
    short:
      'You and the business are the same legal person. Profits are your income; you carry unlimited personal liability.',
    see: '/structures/sole-trader',
  },
  'limited company': {
    term: 'Limited company',
    short:
      "A separate legal person you can own. It pays its own tax (corporation tax). You extract money via salary, dividends or pension contributions.",
    see: '/structures/ltd',
  },
  ltd: {
    term: 'Ltd',
    short: 'Short for "limited company" — see Limited company.',
    see: '/structures/ltd',
  },
  llp: {
    term: 'LLP',
    short:
      'Limited Liability Partnership. Tax-transparent like a partnership but with limited liability for the members.',
    see: '/structures/llp',
  },
  'corporation tax': {
    term: 'Corporation tax',
    short:
      "The tax a company pays on its profits. In the UK there's a small-profits rate, a main rate, and a marginal-relief band in between.",
    see: '/uk/corporation-tax',
  },
  'income tax': {
    term: 'Income tax',
    short:
      'Tax on your earned income (salary, self-employment profit). Bands stack: 0% / 20% / 40% / 45% in rUK.',
    see: '/uk/income-tax',
  },
  'national insurance': {
    term: 'National Insurance (NI)',
    short:
      'A tax on earnings — Class 1 (employees), Class 4 (self-employed), and an employer charge on salaries.',
    see: '/uk/ni',
  },
  ni: {
    term: 'NI',
    short: 'See National Insurance.',
    see: '/uk/ni',
  },
  dividend: {
    term: 'Dividend',
    short:
      'A distribution of post-tax profits from a company to a shareholder. Taxed at lower rates than salary, but no NI and not a deductible cost.',
    see: '/uk/dividends',
  },
  'dividend allowance': {
    term: 'Dividend allowance',
    short:
      'A small slice of dividend income each year that is taxed at 0%. Currently £500.',
    see: '/uk/dividends',
  },
  'personal allowance': {
    term: 'Personal allowance',
    short:
      'The slice of your income each year taxed at 0%. Tapers away as income rises above £100k.',
    see: '/uk/income-tax',
  },
  'capital gains': {
    term: 'Capital gains',
    short:
      'The gain on selling an asset (shares, property, business). Taxed at lower rates than income — typically 18% / 24% in the UK.',
    see: '/uk/cgt',
  },
  cgt: {
    term: 'CGT',
    short: 'Capital Gains Tax — see Capital gains.',
    see: '/uk/cgt',
  },
  badr: {
    term: 'BADR',
    short:
      'Business Asset Disposal Relief — a reduced CGT rate (currently 18%) on up to £1m of qualifying lifetime gains when selling a business.',
    see: '/uk/badr',
  },
  ir35: {
    term: 'IR35',
    short:
      "Off-payroll working rules. If you provide services through your own company but operate like an employee of the client, you may be taxed as one.",
    see: '/uk/ir35',
  },
  'r&d': {
    term: 'R&D credits',
    short:
      'Tax relief for companies doing qualifying research & development. Uplifts the deduction or generates a payable credit.',
    see: '/uk/rd',
  },
  vat: {
    term: 'VAT',
    short:
      "A tax on sales (currently 20% standard rate). You must register once turnover crosses ~£90k. Generally reclaimable on business inputs.",
    see: '/uk/vat',
  },
  eis: {
    term: 'EIS',
    short:
      'Enterprise Investment Scheme — investors get 30% income-tax relief and CGT advantages for funding qualifying high-risk companies.',
    see: '/uk/eis-seis',
  },
  seis: {
    term: 'SEIS',
    short:
      'Seed Enterprise Investment Scheme — even more generous (50% income-tax relief) for investors in earlier-stage companies.',
    see: '/uk/eis-seis',
  },
  'holding company': {
    term: 'Holding company',
    short:
      'A company that owns shares in other (trading) companies. Dividends between UK companies are usually exempt — useful for risk and reinvestment.',
    see: '/structures/holding',
  },
  'retained earnings': {
    term: 'Retained earnings',
    short:
      'Post-tax profit kept inside the company instead of distributed. Compounds at the corporate-tax rate, not your personal rate.',
    see: '/foundations/1-5',
  },
  bik: {
    term: 'BiK',
    short:
      'Benefit in Kind — a non-cash perk (car, accommodation, low-interest loan) the recipient pays income tax on.',
    see: '/uk/directors-loan',
  },
  'directors loan': {
    term: "Director's loan",
    short:
      "Money you (as a director) owe the company or vice versa. Tax traps if not repaid within 9 months of year-end (s455 charge).",
    see: '/uk/directors-loan',
  },
  pension: {
    term: 'Pension contribution',
    short:
      "Money paid into a pension. Generally deductible for the company and not taxed on you until withdrawal — one of the most efficient extraction routes.",
    see: '/uk/pensions',
  },
  isa: {
    term: 'ISA',
    short:
      'Individual Savings Account. £20k/year wrapper where investment growth and withdrawals are tax-free.',
    see: '/uk/isa',
  },
  iht: {
    term: 'IHT',
    short:
      'Inheritance tax. 40% above the nil-rate bands. Trading-company shares often qualify for Business Property Relief.',
    see: '/uk/iht',
  },
};

export function findGlossary(rawTerm: string): GlossaryEntry | null {
  const k = rawTerm.toLowerCase().trim();
  return GLOSSARY[k] ?? null;
}
