export interface PrebuiltScenario {
  id: string;
  name: string;
  oneLiner: string;
  commentary: string;
  inputs: {
    revenue: number;
    costs: number;
    desiredCash: number;
    ownerSalary: number;
    pensionContribution: number;
    rdEligibleSpend: number;
    structures: string[];
  };
  whatToLookFor: string[];
}

export const PREBUILT: PrebuiltScenario[] = [
  {
    id: 'freelancer',
    name: 'The freelancer',
    oneLiner: '£80k revenue, low costs, takes most of it home — sole trader vs Ltd',
    commentary:
      "At this revenue, the Ltd advantage is mostly about retention. If you take everything out as cash anyway, the difference is small. The interesting question is whether you can leave anything inside.",
    inputs: {
      revenue: 80_000,
      costs: 8_000,
      desiredCash: 50_000,
      ownerSalary: 12_570,
      pensionContribution: 0,
      rdEligibleSpend: 0,
      structures: ['sole-trader', 'ltd'],
    },
    whatToLookFor: [
      'Notice what happens to the comparison when you reduce desiredCash to £35k',
      'Notice the Class 4 NI on sole trader profit — easy to miss',
      'Notice that the Ltd retained earnings line is the real prize',
    ],
  },
  {
    id: 'consultancy',
    name: 'The growing consultancy',
    oneLiner: '£200k revenue, retain vs extract',
    commentary:
      "This is where Ltd and the retention pattern earn their keep. With £100k+ surplus over personal needs, leaving money inside the company saves a lot vs. extracting and re-investing personally.",
    inputs: {
      revenue: 200_000,
      costs: 40_000,
      desiredCash: 60_000,
      ownerSalary: 12_570,
      pensionContribution: 0,
      rdEligibleSpend: 0,
      structures: ['ltd'],
    },
    whatToLookFor: [
      'Try desiredCash £60k vs £150k — see how the personal tax line jumps',
      'CT effective rate sits in the marginal band (50–250k)',
      'Retained earnings compound at corporate rate, not your 40%/45% personal',
    ],
  },
  {
    id: 'saas',
    name: 'The SaaS founder',
    oneLiner: '£150k revenue, mostly software/dev costs, R&D-eligible',
    commentary:
      "The R&D credit illustration shows why the incentive pattern matters. Don't change real economic behaviour to chase reliefs — but if you're already doing the work, getting the relief is cash on the table.",
    inputs: {
      revenue: 150_000,
      costs: 60_000,
      desiredCash: 50_000,
      ownerSalary: 12_570,
      pensionContribution: 0,
      rdEligibleSpend: 40_000,
      structures: ['ltd'],
    },
    whatToLookFor: [
      'Watch the Pre-tax profit line rise as R&D-eligible spend grows — that is the credit benefit',
      'Realise that the credit is illustrative — the real claim is more nuanced',
      'Notice that without retaining cash, the R&D benefit just lowers extraction tax',
    ],
  },
  {
    id: 'pre-exit',
    name: 'The pre-exit founder',
    oneLiner: '£500k revenue, planning to sell in 3 years — extract minimum',
    commentary:
      "Capital gains on sale are taxed lower than dividends. This is the classification pattern: leave the money in the company, sell later, pay BADR-like rates instead of dividend rates.",
    inputs: {
      revenue: 500_000,
      costs: 120_000,
      desiredCash: 80_000,
      ownerSalary: 12_570,
      pensionContribution: 60_000,
      rdEligibleSpend: 0,
      structures: ['ltd'],
    },
    whatToLookFor: [
      'Maximum pension contribution to drain pre-tax profit pre-exit',
      'Retained cash builds value in shares → CGT on sale, not dividend tax',
      'Compare the same revenue if you extract £200k via dividends',
    ],
  },
  {
    id: 'maximizer',
    name: 'The high earner extracting maximum',
    oneLiner: '£300k revenue, takes everything as personal cash',
    commentary:
      "What happens when you ignore the retention pattern entirely. Useful as a baseline to see how much the structure can cost when you fight against it.",
    inputs: {
      revenue: 300_000,
      costs: 50_000,
      desiredCash: 200_000,
      ownerSalary: 12_570,
      pensionContribution: 0,
      rdEligibleSpend: 0,
      structures: ['ltd'],
    },
    whatToLookFor: [
      "Total tax line — eye-watering",
      'Personal allowance taper kicking in above £100k — extra 20% effective in that band',
      'The dividend additional rate above £125k of total income',
    ],
  },
  {
    id: 'retain',
    name: 'The retain-and-compound founder',
    oneLiner: '£300k revenue, lives on minimum, retains the rest',
    commentary:
      "Same business as the maximizer scenario. Look at the difference in retained earnings. Over 10 years, that gap compounds into something life-changing.",
    inputs: {
      revenue: 300_000,
      costs: 50_000,
      desiredCash: 50_000,
      ownerSalary: 12_570,
      pensionContribution: 0,
      rdEligibleSpend: 0,
      structures: ['ltd'],
    },
    whatToLookFor: [
      'Retained line dwarfs the net-to-owner line',
      'CT is the only tax leak on retained money — far less than personal rates',
      'Switch to multi-year mode to see the compounding effect',
    ],
  },
  {
    id: 'pension-max',
    name: 'The pension-maximizer',
    oneLiner: '£150k revenue, route surplus into pension',
    commentary:
      "Pension is the deferral pattern's purest form. Tax-deductible going in, tax-deferred while invested, often lower-rate on the way out. A founder superpower.",
    inputs: {
      revenue: 150_000,
      costs: 30_000,
      desiredCash: 50_000,
      ownerSalary: 12_570,
      pensionContribution: 50_000,
      rdEligibleSpend: 0,
      structures: ['ltd'],
    },
    whatToLookFor: [
      'Pension reduces pre-tax profit, so CT drops',
      'No Income Tax on the contribution today',
      'You will pay tax on the way out — but probably at lower rates',
    ],
  },
  {
    id: 'portfolio',
    name: 'The portfolio entrepreneur',
    oneLiner: 'Multiple small businesses — group structure question',
    commentary:
      "This scenario sits between the lab and the structures section. It is a case for using a holding company. Run the numbers through Ltd here, then see Structures → Holding company.",
    inputs: {
      revenue: 250_000,
      costs: 60_000,
      desiredCash: 70_000,
      ownerSalary: 12_570,
      pensionContribution: 30_000,
      rdEligibleSpend: 20_000,
      structures: ['ltd'],
    },
    whatToLookFor: [
      'Even ignoring grouping, the retention pattern is dominant',
      'Holdco unlocks moving cash between businesses tax-free',
      'Each subsidiary keeps small-profits CT rate, instead of one big company hitting marginal',
    ],
  },
];
