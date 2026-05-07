export interface StructureMeta {
  id: string;
  shortName: string;
  longName: string;
  jurisdiction: 'universal' | 'uk';
  patternNote: string;
  oneLiner: string;
  whyExists: string;
  pros: string[];
  cons: string[];
  whenToChoose: string[];
  whenToAvoid: string[];
  complexity: 'low' | 'medium' | 'high';
}

export const STRUCTURES: StructureMeta[] = [
  {
    id: 'sole-trader',
    shortName: 'Sole trader',
    longName: 'Sole trader / sole proprietor',
    jurisdiction: 'universal',
    oneLiner: "You and the business are the same person, both legally and for tax.",
    whyExists:
      "The default form of running a business — no formation needed. The tradeoff is you carry the business's risk on your personal balance sheet.",
    patternNote:
      'Sole trader exemplifies the lack of the structure pattern: with no entity in front of you, all profit is yours, taxed at your personal rates, and all liabilities are yours too.',
    pros: ['Trivial to set up', 'Cheap to run', 'Losses can offset other personal income'],
    cons: [
      'Unlimited personal liability',
      'No distinction between you and the business',
      'Profits taxed at top personal rates regardless of whether you need the cash',
    ],
    whenToChoose: ['Side projects with low risk', 'Pre-revenue or very low revenue', 'Service work where personal-name brand is the asset'],
    whenToAvoid: ['Higher-risk activities (claims, debts)', 'Once profits comfortably exceed your personal needs'],
    complexity: 'low',
  },
  {
    id: 'partnership',
    shortName: 'Partnership',
    longName: 'General partnership',
    jurisdiction: 'universal',
    oneLiner: 'Multiple sole traders sharing in profits and (crucially) liabilities of one business.',
    whyExists:
      'Lets two or more people pool capital and effort without forming a company. Tax is transparent — partners pay tax on their share of profits.',
    patternNote: 'A partnership inherits the sole trader pattern but multiplies the joint-and-several liability across the partners.',
    pros: ['Easy to set up', 'Tax-transparent (no partnership-level tax)', 'Each partner taxed only on their share'],
    cons: ['Joint and several liability — one partner can bind the others', 'Hard to bring in capital without changing structure'],
    whenToChoose: ['Tight, trusted teams of professionals'],
    whenToAvoid: ['Most modern situations — LLP is almost always preferable'],
    complexity: 'low',
  },
  {
    id: 'ltd',
    shortName: 'Limited company',
    longName: 'Limited company / corporation',
    jurisdiction: 'universal',
    oneLiner: 'A separate legal person you own, that pays its own tax and shields you from its debts.',
    whyExists:
      "To enable risk-taking. Investors can put money in without exposing personal assets; founders can build without one bad lawsuit ruining them.",
    patternNote:
      'The Ltd embodies three patterns at once: structure (separate person), retention (lower corporate rate on retained earnings) and classification (income via salary vs. dividends vs. capital gains on exit).',
    pros: [
      'Limited liability',
      'Lower tax rate on retained profits',
      'Flexibility on how to extract (salary, dividends, pension, capital gains on exit)',
      'Cleaner to bring in investors / partners',
    ],
    cons: ['More admin (filings, accounts)', 'Two layers of tax if you extract everything', 'Director duties and statutory traps'],
    whenToChoose: [
      'Profits comfortably exceed your personal needs',
      'Risk profile is non-trivial',
      'You expect outside investment, employees, or to sell',
    ],
    whenToAvoid: ['Tiny side hustles', 'Pure pass-through where retained earnings would never sit in the company'],
    complexity: 'medium',
  },
  {
    id: 'llp',
    shortName: 'LLP',
    longName: 'Limited Liability Partnership (UK)',
    jurisdiction: 'uk',
    oneLiner: 'A partnership for tax, but with limited liability for the members.',
    whyExists: 'Lets professional partnerships (lawyers, architects, advisers) get liability protection without becoming companies.',
    patternNote: 'LLPs unbundle the structure pattern from the retention pattern: limited liability without the corporate-rate savings.',
    pros: ['Limited liability', 'Tax-transparent — each member taxed personally', 'Flexible profit allocation between members'],
    cons: ['No corporate-rate retention benefit', 'Requires at least two members', 'Public filings'],
    whenToChoose: ['Professional partnerships', "When you want partnership tax treatment but don't want personal liability"],
    whenToAvoid: ['Single-founder ventures (use Ltd)'],
    complexity: 'medium',
  },
  {
    id: 'holding',
    shortName: 'Holding company',
    longName: 'Holding company + trading subsidiary',
    jurisdiction: 'universal',
    oneLiner: 'A non-trading parent company that owns the shares of one or more trading companies.',
    whyExists:
      "Separates the asset (cash, IP) from the operational risk (employees, contracts). UK lets you move dividends between group companies tax-free.",
    patternNote: 'A textbook example of the structure pattern: the same activities, repackaged through stacked entities, get different risk and tax treatment.',
    pros: [
      'Trading risk isolated to subsidiary',
      'Dividends between UK companies usually exempt',
      'Cleaner for selling individual subsidiaries',
      'Group reliefs (in some cases) for losses',
    ],
    cons: ['Two sets of accounts', 'More complexity, more cost', 'Substance and director-time considerations'],
    whenToChoose: ['Multiple trading lines', 'Significant retained cash you want to protect', 'Pre-exit restructuring'],
    whenToAvoid: ['Single-business operations with little retained cash'],
    complexity: 'high',
  },
  {
    id: 'fic',
    shortName: 'Family Investment Company',
    longName: 'Family Investment Company (UK)',
    jurisdiction: 'uk',
    oneLiner: "A company designed to hold investments and pass wealth across generations, taxed at corporate rates.",
    whyExists:
      "An alternative to trusts for IHT planning post-2006. Investments grow inside a company; family members hold different share classes.",
    patternNote: 'Combines the retention pattern with the residence/structure pattern for inheritance planning.',
    pros: ['Investment growth taxed at lower corporate rates', 'Generation-skipping share structures', 'IHT planning over time'],
    cons: ['Setup cost and ongoing complexity', 'Dividends on company-held investments often exempt — but be careful', 'Long horizon required'],
    whenToChoose: ['£500k+ invested capital', 'Family wealth planning across generations'],
    whenToAvoid: ['Most operating businesses', 'Short-horizon planning'],
    complexity: 'high',
  },
  {
    id: 'psc',
    shortName: 'Personal Service Co.',
    longName: 'Personal Service Company / Contractor Ltd (UK)',
    jurisdiction: 'uk',
    oneLiner: "A limited company that exists primarily to invoice for one person's services.",
    whyExists:
      "Originally to give contractors limited liability and the salary+dividend option. IR35 rules now reduce its tax advantage where the work resembles employment.",
    patternNote:
      'The classification pattern: HMRC tries to reclassify disguised employment back into employment for tax, regardless of the company in front.',
    pros: ['Limited liability', 'Salary+dividend planning when outside IR35', 'Pension contributions through the company'],
    cons: ['IR35 risk', 'Client may apply off-payroll rules', 'Diminished benefit if inside IR35'],
    whenToChoose: ['Contractor genuinely working independently across multiple clients'],
    whenToAvoid: ['You only have one client and behave like their employee'],
    complexity: 'medium',
  },
  {
    id: 'trust',
    shortName: 'Trust',
    longName: 'Trust structures',
    jurisdiction: 'universal',
    oneLiner: 'A legal arrangement where one party (trustee) holds assets for the benefit of another (beneficiary).',
    whyExists: 'Asset protection, succession planning, and (historically) tax efficiency. Heavily restricted post-2006 in the UK.',
    patternNote: 'A different shape entirely from companies. Trusts were the original residence/structure planning tool.',
    pros: ['Asset protection', 'Succession across generations', 'Specific tax regimes for specific trust types'],
    cons: [
      'Complex',
      'Specific anti-avoidance rules (UK)',
      'Often less tax-efficient than alternatives for new wealth',
    ],
    whenToChoose: ['Specific multi-generation planning needs — with professional advice'],
    whenToAvoid: ['Most operating-business situations'],
    complexity: 'high',
  },
];

export function getStructure(id: string): StructureMeta | undefined {
  return STRUCTURES.find((s) => s.id === id);
}
