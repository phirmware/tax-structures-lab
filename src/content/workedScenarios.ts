export interface WorkedScenario {
  id: string;
  title: string;
  oneLiner: string;
  forWhom: string;
  body: string;
  patternsUsed: string[];
  numbers: { label: string; value: string }[];
}

export const WORKED: WorkedScenario[] = [
  {
    id: 'first-freelancer',
    title: '1 · The first-time freelancer',
    oneLiner: "When does it stop making sense to be a sole trader?",
    forWhom: 'Earning ~£40k–£80k from one or two clients, low costs.',
    body: `Below ~£40k of profit, the cost of running a Ltd (accountancy, accounts filings, the time spent) often exceeds the tax saving. Above ~£60k of profit it tilts; above ~£80k Ltd usually wins on round-trip tax even if you extract everything.

If you're going to retain anything inside the company, even £10k a year, the Ltd tilts dramatically faster — corporation tax 19/25% on retained profit beats personal income tax 20/40/45%.

Watch for IR35 if you have one client. Watch for VAT registration if revenue crosses ~£90k. Always check whether being a sole trader for one more year qualifies you for any spousal-band-allocation tricks before incorporating.`,
    patternsUsed: ['structure', 'retention', 'threshold'],
    numbers: [
      { label: 'Sole-trader breakeven', value: '~£40k profit' },
      { label: 'Ltd dominance', value: '~£80k+ profit' },
      { label: 'VAT trigger', value: '£90k turnover' },
    ],
  },
  {
    id: '100k-decision',
    title: '2 · The £100k decision point',
    oneLiner: 'Why £100k is a real, non-arbitrary edge in UK tax.',
    forWhom: 'Sole director / sole shareholder approaching six figures of profit.',
    body: `£100k is where the personal allowance starts tapering. Every £2 over £100k removes £1 of allowance; the effective marginal rate in the £100k–£125,140 band is ~60%.

If you're a sole trader making £110k profit, you're paying that 60% on £10k. If you're in a Ltd, you can choose how much to extract and stay below the taper.

The Ltd doesn't avoid the tax forever — eventually you extract — but it gives you the choice of <em>when</em>. Combined with pension contributions and the retention pattern, this is the structural moment where Ltd usually becomes obvious.`,
    patternsUsed: ['threshold', 'structure', 'deferral'],
    numbers: [
      { label: 'Taper start', value: '£100,000' },
      { label: 'Effective marginal', value: '~60%' },
      { label: 'Taper end', value: '£125,140' },
    ],
  },
  {
    id: 'side-hustle',
    title: '3 · Side hustle while employed',
    oneLiner: "Structuring a small business that doesn't disrupt your day job.",
    forWhom: 'Employed founder testing a side product or service.',
    body: `Most side hustles start as sole trader. The admin overhead matters more when revenue is sporadic.

Watch out:
• Trading allowance: first £1,000 of self-employment is tax-free. Below that, you don't even need to register.
• Day-job employment contracts often restrict outside work; check before scaling.
• If the side hustle generates losses (fairly common in year 1), sole-trader losses can offset employment income — a real benefit Ltd doesn't share.
• Once it's clearly going to keep growing past £30k–£40k profit and you're not extracting all of it, incorporate.`,
    patternsUsed: ['threshold', 'classification', 'timing'],
    numbers: [
      { label: 'Trading allowance', value: '£1,000' },
      { label: 'Incorporation tilt', value: '~£40k profit' },
    ],
  },
  {
    id: 'going-fulltime',
    title: '4 · Going full-time on the business',
    oneLiner: 'Restructuring at the moment of full-time commitment.',
    forWhom: 'Solo founder leaving employment.',
    body: `The transition is your structural moment. Don't carry over a sole-trader setup into a full-time business unless you've genuinely thought about it.

Considerations:
• Set up the Ltd at incorporation, not later. Backdating is messy.
• Consider whether to transfer goodwill / IP — there are rules.
• Make sure the new salary level interacts properly with NI / pension qualifying earnings.
• Open a separate bank account on day one. Keep accounting clean.
• Think about R&D eligibility from year 1 if relevant.`,
    patternsUsed: ['structure', 'timing', 'incentive'],
    numbers: [
      { label: 'Director salary baseline', value: '£12,570 (PA)' },
      { label: 'Pension annual allowance', value: '£60,000' },
    ],
  },
  {
    id: 'multi-business',
    title: '5 · Multiple small businesses',
    oneLiner: 'When does a group structure earn its complexity?',
    forWhom: 'Founder with 2–4 distinct ventures.',
    body: `Single Ltd with multiple "trades" inside it is technically possible but mixes risks. A group — holding company over each trading subsidiary — is the cleaner answer once any of them is doing real money.

Benefits:
• Inter-company dividends usually exempt; cash sweeps to holdco tax-free.
• You can sell one subsidiary cleanly without disturbing the others.
• If one fails, the others are insulated.

Costs:
• Two (or more) sets of accounts.
• Associated-company rules tighten the CT thresholds.
• Substance considerations — directors' time and decision-making must be real.`,
    patternsUsed: ['structure', 'retention'],
    numbers: [
      { label: 'Inter-co dividend', value: 'Usually exempt' },
      { label: 'Group relief', value: 'Available subject to rules' },
    ],
  },
  {
    id: 'first-employee',
    title: '6 · Hiring your first employee',
    oneLiner: 'Payroll is a different game; understand the cost.',
    forWhom: 'About to hire someone properly (not a contractor).',
    body: `Hiring crosses you into PAYE, employer NI, auto-enrolment pensions, employer's liability insurance, and HR obligations. The fully-loaded cost of a £40k employee is more like £48k–£50k once employer NI and pension are factored in.

For tax planning:
• Employer NI is a deductible cost (good for CT).
• Pension contributions for staff are deductible.
• Salary sacrifice schemes (e.g., for pension or EV) can reduce both employer NI and the employee's tax.
• Don't conflate contractors and employees — IR35 / employment status battles are exhausting and expensive.`,
    patternsUsed: ['classification', 'incentive'],
    numbers: [
      { label: 'Employer NI rate', value: '~15% above £5k' },
      { label: 'Auto-enrolment min', value: '3% employer + 5% employee' },
    ],
  },
  {
    id: 'selling-business',
    title: '7 · Selling your business',
    oneLiner: 'Prepare structurally years before the sale.',
    forWhom: 'Founder considering exit in 2–5 years.',
    body: `BADR is the headline relief — 14% on the first £1m of qualifying gain. To qualify:
• ≥5% ordinary shares + voting rights + entitlement to assets on a winding up.
• Officer or employee of the company.
• Trading company status (or holding co. of a trading group).
• Held for at least 2 years.

Pre-sale structural moves often worth doing 1–2 years before:
• Strip excess investment-type cash (BPR / "trading" status risk).
• Review share classes and vesting.
• Tidy intercompany positions and any director's loans.
• Get tax-clearance / advance assurance where useful.`,
    patternsUsed: ['capital-gains', 'relief', 'structure'],
    numbers: [
      { label: 'BADR rate', value: '14%' },
      { label: 'BADR lifetime cap', value: '£1,000,000 of gain' },
      { label: 'Holding period', value: '≥ 2 years' },
    ],
  },
  {
    id: 'pension-extraction',
    title: '8 · Pension-funded extraction',
    oneLiner: 'When the pension is your primary tool, not a side allocation.',
    forWhom: 'Founder with surplus profits beyond living needs.',
    body: `For founders well past their living-cost extraction needs, pension contributions are usually the cheapest way to move company cash into personal-controlled assets.

Annual allowance is £60,000 (lower if you're tapered). Carry-forward of unused allowance from the previous three tax years can let you do a one-off £180k+ contribution.

The cost is liquidity (no access until 55/57). For most founders, surplus cash beyond a sensible reserve buffer can comfortably go into a pension without disrupting personal life.`,
    patternsUsed: ['deferral', 'incentive', 'classification'],
    numbers: [
      { label: 'Annual allowance', value: '£60,000' },
      { label: 'Carry-forward', value: 'Up to 3 prior years' },
    ],
  },
  {
    id: 'holding-diversification',
    title: '9 · Holding company for diversification',
    oneLiner: 'When the parent-subsidiary split earns its keep.',
    forWhom: 'Single trading Ltd with material retained cash building up.',
    body: `If your trading company has £200k+ of cash that isn't immediately for the trade, you may have a "trading status" risk for BPR / BADR.

A common move: insert a holding company above the trading company (share-for-share exchange), then drip cash up to holdco. Holdco can:
• Hold investments with proper substance.
• Lend to / invest in new ventures.
• Be the entity through which a future sale happens.

This is non-trivial structurally. Get advice; check stamp duty / ER reorganisation reliefs apply; mind the substance.`,
    patternsUsed: ['structure', 'retention', 'relief'],
    numbers: [
      { label: 'Inter-co dividend', value: 'Usually exempt' },
      { label: 'Substance test', value: 'Real activity required' },
    ],
  },
  {
    id: 'international-saas',
    title: '10 · International SaaS from the UK',
    oneLiner: 'Selling globally from a UK Ltd — what gets taxed where.',
    forWhom: 'UK Ltd with substantial overseas customers.',
    body: `If your company is UK-resident and has no permanent establishment abroad, generally all profit is taxed in the UK. As you scale:
• VAT on B2C digital sales is collected per the customer's location (One Stop Shop or equivalent).
• Withholding taxes on royalties / interest in some countries — check treaties.
• If you build a real office or sales team in another jurisdiction, you may create a PE there and trigger local tax.
• "Significant economic presence" / digital services taxes are evolving — keep an eye.

For most early-stage SaaS the answer is "stay UK-tax-resident, mind the VAT rules." It gets complicated when you cross headcount thresholds in another country.`,
    patternsUsed: ['residence', 'substance', 'double-tax'],
    numbers: [
      { label: 'UK CT main rate', value: '25%' },
      { label: 'B2C digital VAT', value: 'Customer location' },
    ],
  },
];
