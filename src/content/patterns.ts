export interface Pattern {
  id: string;
  name: string;
  oneLiner: string;
  why: string;
  examples: string[];
  recognise: string[];
}

export const PATTERNS: Pattern[] = [
  {
    id: 'retention',
    name: 'The retention pattern',
    oneLiner: 'Companies hold money cheaper than individuals do.',
    why:
      "Governments tax retained corporate profit at lower rates because they want re-investment, not consumption. Almost universal across developed economies.",
    examples: [
      'UK: 25% CT vs 47% top personal',
      'US: 21% federal corp tax + state vs 37% top federal personal',
      'Singapore: 17% corp tax vs ~22% top personal',
    ],
    recognise: [
      'Big gap between corporate and personal top rates',
      'A way to leave profit inside the company indefinitely',
      'No annual deemed-distribution rule forcing extraction',
    ],
  },
  {
    id: 'capital-gains',
    name: 'The capital gains pattern',
    oneLiner: 'Sold assets are taxed lower than earned income.',
    why:
      'Lower CGT rates exist to reward investment risk. Without them, capital allocation would skew toward consumption.',
    examples: [
      'UK BADR 18% on first £1m vs 47% top personal',
      'US QSBS — up to $10m gain federally tax-free',
      'Canada Lifetime Capital Gains Exemption',
    ],
    recognise: [
      'CGT rates lower than top income rates',
      'Specific founder reliefs on business sale',
      'Holding-period requirements (encourage long-term)',
    ],
  },
  {
    id: 'deferral',
    name: 'The deferral pattern',
    oneLiner: 'Paying tax later is — in present-value terms — paying less tax.',
    why:
      'The time value of money means a £10k tax bill in 10 years is worth less today than £10k now. Deferral is genuine, mechanical economic value.',
    examples: [
      'Pensions / 401(k) / RRSP / superannuation',
      'Capital allowances (writing down value over years)',
      'Roll-over relief on reinvested gains',
    ],
    recognise: [
      'A choice between paying now vs. later',
      'Tax-favoured wrapper that grows untaxed inside',
      'Treatment as deductible-now, taxable-later',
    ],
  },
  {
    id: 'classification',
    name: 'The classification pattern',
    oneLiner: 'The same money is taxed differently depending on the label the law puts on it.',
    why:
      "Tax codes carve different rates for salary, dividends, interest, capital gains, royalties — economically similar flows, legally different.",
    examples: [
      'Salary vs dividend optimisation',
      'Distinction between trading and investment income',
      'IR35 reclassifying contractor work as employment',
    ],
    recognise: [
      'Different rate schedule for "kinds" of income',
      'Anti-avoidance rules that look at substance',
      'Pre-set tests for what counts as which class',
    ],
  },
  {
    id: 'incentive',
    name: 'The incentive pattern',
    oneLiner: 'Governments use the tax code to nudge behaviour.',
    why:
      "Where governments want more of something — investment, R&D, retirement saving, green energy — they reduce the tax cost of doing it.",
    examples: [
      'R&D credits (UK / US / Canada / Australia)',
      'EIS / SEIS / VCT / QSBS',
      'Bonus depreciation, opportunity zones',
      'Pension contributions',
    ],
    recognise: [
      'Spending category gets enhanced deduction or refundable credit',
      'Specific qualifying conditions tied to the policy goal',
      'Sunset dates and rate changes — they expire',
    ],
  },
  {
    id: 'threshold',
    name: 'The threshold pattern',
    oneLiner: 'Most tax systems have cliff edges and brackets that create planning opportunities.',
    why:
      "Bracketed systems create kinks. A £1 over a threshold can have a non-linear effect. Smart planning sits just below the kink.",
    examples: [
      'UK personal allowance taper above £100k',
      'UK CT marginal relief band 50–250k',
      'VAT registration threshold',
      'High-income child benefit charge',
    ],
    recognise: [
      'A specific number that triggers a regime change',
      'Marginal rates spike near the edge',
      'Planning opportunities sit on the just-below side',
    ],
  },
  {
    id: 'timing',
    name: 'The timing pattern',
    oneLiner: 'The year a transaction occurs in changes its tax outcome.',
    why:
      "Income-tax bands, CGT exemption, and dividend allowance all reset each year. The same realised gain split across two years can use both years' bands and exemptions.",
    examples: [
      'Splitting share sales across two tax years',
      "Using both spouses' allowances by gifting before sale",
      'Year-end pension top-ups using carry-forward',
    ],
    recognise: [
      'An exemption / allowance that resets annually',
      'A band that you can re-use next year',
      'A choice of when to recognise a gain or expense',
    ],
  },
  {
    id: 'structure',
    name: 'The structure pattern',
    oneLiner: 'The entity around a transaction changes its tax outcome.',
    why:
      "Different legal forms attract different rates and reliefs. The same activity through Ltd vs sole trader vs LLP has different fiscal consequences.",
    examples: [
      'Ltd vs sole trader for retention',
      'Holding company over trading subsidiary',
      'Family Investment Company vs personal investment',
    ],
    recognise: [
      'A choice of entity ahead of the activity',
      'Group / inter-company exemptions',
      'Anti-avoidance pulling substance over form',
    ],
  },
  {
    id: 'residence',
    name: 'The residence pattern',
    oneLiner: 'Where you (and your entities) are taxed depends on residency rules.',
    why:
      "Most countries tax their residents on worldwide income. Non-residents are taxed only on local-source income. Crossing borders changes everything.",
    examples: [
      'UK statutory residence test',
      'US citizenship-based taxation',
      'Double tax treaties allocating taxing rights',
      'Permanent establishment rules',
    ],
    recognise: [
      'Rules tied to days present, family, work pattern',
      'Different treatment for "non-doms" or special regimes',
      'Treaty articles for cross-border income',
    ],
  },
  {
    id: 'relief',
    name: 'The relief pattern',
    oneLiner: 'Most tax codes include relief for specific activities.',
    why:
      "A relief is a deliberate carve-out: relief for charitable giving, R&D, business asset disposal, reinvested gains, and so on. Spotting reliefs is a primary activity for any adviser.",
    examples: [
      'Gift Aid / charitable giving relief',
      'BADR / QSBS / lifetime capital gains exemption',
      'Roll-over and hold-over reliefs',
    ],
    recognise: [
      'A specific carve-out from the general rule',
      'Conditions tied to the activity the relief encourages',
      'Often time-limited or capped',
    ],
  },
  {
    id: 'double-tax',
    name: 'The double-tax pattern',
    oneLiner: 'When the same money would be taxed twice, systems try (imperfectly) to handle it.',
    why:
      "A dividend is paid out of post-CT profit and then taxed again on you. Cross-border income could be taxed by both states. Rules exist to avoid making this worse than it needs to be.",
    examples: [
      'UK dividend rates (lower than salary, accounting for CT already paid)',
      'Foreign tax credits',
      'Double tax treaties',
      'Group dividend exemptions',
    ],
    recognise: [
      'Rates that look "low" because the underlying money was already taxed',
      'Credit / exemption mechanisms for cross-border income',
      'Inter-company exemptions within groups',
    ],
  },
  {
    id: 'substance',
    name: 'The substance pattern',
    oneLiner: 'Tax authorities care about economic reality, not paperwork.',
    why:
      'If a structure has the form of A but the substance of B, tax authorities will treat it as B. This is the limit on how much "label engineering" you can do.',
    examples: [
      'IR35 — looking through PSCs at employment relationships',
      'Anti-disguised remuneration rules',
      'Permanent establishment substance tests',
      'GAAR (general anti-avoidance rule)',
    ],
    recognise: [
      'A rule that "looks at the reality"',
      'A challenge mechanism HMRC can invoke',
      'Specific factual tests (control, autonomy, risk)',
    ],
  },
];
