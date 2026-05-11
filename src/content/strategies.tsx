import type { ReactNode } from 'react';
import { Abbr } from '../components/ui/Abbr';
import type { FounderMistake } from './lessonExtras';

export type StrategySubsectionId =
  | 'extraction'
  | 'wealth-preservation'
  | 'investment'
  | 'sale-exit'
  | 'income-classification'
  | 'multi-entity'
  | 'long-term'
  | 'misunderstood';

export interface StrategySubsection {
  id: StrategySubsectionId;
  title: string;
  oneLiner: string;
  intro: string;
}

export const STRATEGY_SUBSECTIONS: StrategySubsection[] = [
  {
    id: 'extraction',
    title: 'Extraction',
    oneLiner: 'Getting money out of your company tax-efficiently.',
    intro:
      'Once a company is a separate legal person from you, every pound has to choose a route to land in your personal hands — salary, dividend, pension, expense reimbursement, loan, or capital event. Picking the right mix and the right order is the most-used strategic decision a founder makes.',
  },
  {
    id: 'wealth-preservation',
    title: 'Wealth Preservation',
    oneLiner: 'Keeping wealth tax-efficient as it grows over years and decades.',
    intro:
      'Once wealth is yours, the question shifts from "extract cheaply" to "compound efficiently." This sub-section covers the long-horizon vehicles and tactics that protect wealth from unnecessary tax drag while letting it grow.',
  },
  {
    id: 'investment',
    title: 'Investment',
    oneLiner: 'Using your capital tax-efficiently when investing.',
    intro:
      'The UK runs a handful of schemes that subsidise specific kinds of investment — early-stage equity, growth funds, IHT-relievable shares. They work, but they come with strings attached and real underlying risk.',
  },
  {
    id: 'sale-exit',
    title: 'Sale & Exit',
    oneLiner: 'Preparing structurally for a liquidity event.',
    intro:
      'A sale is the single biggest tax event in most founders\' lives. The structural decisions that determine the bill are made one to three years ahead of the sale, not in the deal room.',
  },
  {
    id: 'income-classification',
    title: 'Income Classification',
    oneLiner: 'How the same money gets taxed differently depending on its label.',
    intro:
      'Tax law cares about the label — salary, dividend, capital, royalty, IP licence — at least as much as the amount. These strategies exploit the legitimate distinctions and flag the situations where HMRC will recharacterise.',
  },
  {
    id: 'multi-entity',
    title: 'Multi-Entity & Group',
    oneLiner: 'Strategies for portfolio entrepreneurs running multiple companies.',
    intro:
      'Once you have more than one trading entity or a meaningful pile of retained cash, group structuring becomes a real lever. Done well it isolates risk and moves cash efficiently; done badly it just creates two sets of accounts.',
  },
  {
    id: 'long-term',
    title: 'Long-Term Wealth',
    oneLiner: 'Inheritance, gifting, and multi-generational planning.',
    intro:
      'These strategies operate over decades, not tax years. They\'re also the territory where rules change most often and where amateur mistakes are most expensive.',
  },
  {
    id: 'misunderstood',
    title: 'Misunderstood Strategies',
    oneLiner: 'What\'s oversold, misrepresented, or risky on social media.',
    intro:
      'Some strategies you\'ll have heard about online are real but heavily caveated. Others are myths repeated without nuance. A few are aggressive schemes that have repeatedly lost in court. This sub-section is where the app most directly protects you from costly mistakes.',
  },
];

export interface Strategy {
  id: string;
  subsection: StrategySubsectionId;
  title: string;
  /** Plain-English summary, 1–3 sentences. Always shown at the top. */
  summary: string;
  /** "How it works" — the mechanics, in JSX so we can use abbreviations inline. */
  body: () => ReactNode;
  /** "Why it works" — connect back to a universal pattern. One paragraph. */
  principle: string;
  /** Specific conditions where the strategy works. */
  whenApplies: string[];
  /** Specific conditions where it doesn't work or backfires. */
  whenDoesNot: string[];
  /** Genuine benefits with rough magnitudes where possible. */
  pros: string[];
  /** Genuine costs and risks. */
  cons: string[];
  /** Which professional advisers must be involved. */
  professionals: string[];
  /** Optional founder-mistake stories, same shape as elsewhere in the app. */
  mistakes?: FounderMistake[];
  /** "Worth reading" — what to ask your accountant; reputable resources. */
  worthReading: string[];
  /** Whether a strategy-specific simulator should be rendered. */
  hasSimulator?: boolean;
}

// =====================================================================
// EXTRACTION
// =====================================================================

const extractionStrategies: Strategy[] = [
  {
    id: 'salary-vs-dividends',
    subsection: 'extraction',
    title: 'Salary + dividends optimisation',
    summary:
      "Pay yourself a small salary up to the personal allowance and take the rest as dividends. It's the default-efficient extraction recipe for most owner-directors and usually beats taking everything one way or the other.",
    body: () => (
      <>
        <p>
          The classic UK owner-extraction recipe has three legs:
        </p>
        <ol>
          <li>
            <strong>Salary at the personal allowance</strong> (~£12,570). It uses
            your £0% income-tax band, is deductible for{' '}
            <Abbr k="ct" />, and costs only a small slice of employer{' '}
            <Abbr k="ni" />. It also keeps your{' '}
            <Abbr k="paye" /> record current and earns state-pension qualifying
            years.
          </li>
          <li>
            <strong>Dividends</strong> to top up to your spending needs. They
            use lower rates than salary (10.75% / 35.75% / 39.35%) and skip{' '}
            NI entirely. The catch is the company has already paid CT on the
            profit before declaring them.
          </li>
          <li>
            <strong>Pension contributions</strong> for any surplus you don't
            need to live on (covered as a separate strategy below).
          </li>
        </ol>
        <p>
          The arithmetic almost always favours this mix, but the precise
          tipping point depends on your other income, your pension headroom,
          and whether you're near the £100k personal-allowance taper.
        </p>
      </>
    ),
    principle:
      'This is the classification pattern in pure form: the same pound can land as salary, dividend, or pension contribution, with very different combined tax depending on the label. The optimal mix exploits the legitimate distinctions in how the law taxes each.',
    whenApplies: [
      'You own and direct a UK Ltd that is reliably profitable.',
      'You don\'t need to maximise pension contributions or maintain a higher salary for mortgage/lender reasons.',
      'Your other income is low enough that you have basic-rate band available for dividends.',
    ],
    whenDoesNot: [
      'You need a high mortgageable salary for affordability — lenders typically use salary, not dividends.',
      'Your company is loss-making — you can\'t legally declare a dividend without distributable reserves.',
      'You\'re inside IR35 on a contract — the off-payroll rules collapse most of the saving.',
      'You want to maximise pension contributions — those need salary as the basis above auto-enrolment minimums.',
    ],
    pros: [
      'Saves roughly £4,000–£8,000/year vs. taking everything as salary at typical owner-director profit levels.',
      'Flexible — dividends can be declared and stopped freely (subject to distributable reserves).',
      'Compatible with pension contributions, R&D claims, and most other strategies.',
    ],
    cons: [
      'Lower mortgage capacity in some cases.',
      'Dividends are not pensionable earnings — over-rotating loses pension qualifying-earnings room.',
      'Needs distributable reserves; startups and loss-making years can\'t use it.',
    ],
    professionals: [
      'Accountant — runs the precise mix against your year and prepares the dividend paperwork (board minutes, dividend vouchers).',
      'Mortgage broker — if the lower salary affects affordability.',
    ],
    mistakes: [
      {
        id: 'salary-dividend-flat',
        title: 'Paying yourself only as salary',
        body:
          'A Ltd director pays themselves £60,000 as salary because that\'s what they earned at their old job. Their accountant later points out they could have taken £12,570 as salary and £47,430 as dividends, saving roughly £4,500 in NI alone. They had been overpaying for three years — about £13,500 of avoidable tax. The fix: a one-hour review of extraction strategy in the first month of any new Ltd.',
      },
      {
        id: 'dividend-no-reserves',
        title: 'Declaring a dividend with no distributable reserves',
        body:
          'A founder takes regular monthly "dividends" without checking that the company has retained profit to support them. Accounts at year-end show insufficient reserves; the dividends are reclassified as either salary (with retroactive PAYE/NI) or director\'s loans (triggering BiK and potentially s455 charges). The fix: maintain a running reserves figure and only declare dividends the company can legally support.',
      },
    ],
    worthReading: [
      'Ask: what salary level optimises my situation given my other income, pension goals, and any mortgage applications?',
      'HMRC manual: PAYE Manual on dividends vs. salary characterisation.',
    ],
    hasSimulator: true,
  },
  {
    id: 'pension-extraction',
    subsection: 'extraction',
    title: 'Pension contributions through the company',
    summary:
      'Employer pension contributions are deductible for CT, dodge NI entirely, and aren\'t taxed on you until you draw them — making this the single cheapest route from company profit to long-term personal wealth.',
    body: () => (
      <>
        <p>
          A pension contribution paid <em>by your company</em> (rather than by
          you) is treated as a business cost. The company deducts it for{' '}
          <Abbr k="ct" />, no <Abbr k="ni" /> applies, and the contribution is
          not your personal income today. Inside the pension wrapper,
          investments grow tax-free.
        </p>
        <p>
          On the way out (currently from age 55, rising to 57 from 2028), 25%
          of the pot is tax-free; the rest is taxed at your marginal income
          rate at the time of withdrawal — usually lower than your peak
          earning years. The annual allowance is currently £60,000, with up
          to three years of unused allowance carried forward, so a profitable
          year can absorb a £180k+ one-off contribution.
        </p>
        <p>
          For most founders past their living-cost extraction needs, this is
          a more efficient route than dividends + ISA. The trade-off is
          liquidity — money in the pension is genuinely locked until late
          fifties.
        </p>
      </>
    ),
    principle:
      'Deferral pattern in its purest form: the pension wrapper defers the tax bill to a later year when growth has compounded inside a tax-free environment. Combined with the lower likely retirement-rate marginal rate, the deferred bill is smaller in real and nominal terms.',
    whenApplies: [
      'Your company is profitable beyond your living-cost extraction needs.',
      'You\'re comfortable not touching the money until your late 50s.',
      'You haven\'t already filled this year\'s annual allowance through other contributions.',
    ],
    whenDoesNot: [
      'You\'ll need the cash before your late 50s — the access lockup is real and absolute.',
      'You\'re tapered (very high earners with adjusted income above £260k) — the annual allowance can drop to as low as £10k.',
      'You\'re at the lifetime "wholly and exclusively" boundary — contributions disproportionate to a director\'s role can be challenged.',
    ],
    pros: [
      'Avoids CT (saves up to 25% on the way in), NI (saves ~13.8% employer), and personal income tax / dividend tax that would otherwise apply.',
      'Tax-free growth inside the wrapper for as long as you hold it.',
      '25% tax-free lump sum on the way out plus marginal-rate-on-rest, typically less than peak working tax.',
      'Pensions historically sit outside the IHT estate, though rules are evolving — see the Long-Term Wealth section.',
    ],
    cons: [
      'Locked until your late 50s — illiquid by design.',
      'Annual allowance taper for very high earners reduces the room significantly.',
      'Future rule changes — lifetime allowance was abolished and may return; tax-free lump sum capped — political risk is real.',
      'Must be commercially justifiable as a director\'s remuneration package; HMRC can challenge token contributions to non-working family members.',
    ],
    professionals: [
      'Accountant — to confirm the company can deduct it, document the contribution properly, and check carry-forward.',
      'Independent financial adviser — for pension provider, fund choice, and lifetime planning.',
    ],
    mistakes: [
      {
        id: 'no-carry-forward',
        title: 'Letting carry-forward expire',
        body:
          'A founder has a profitable year and contributes £60,000 to their pension. They didn\'t realise unused annual allowance from the previous three years could have been used too — they could have made a one-off £200,000+ contribution from accumulated profits, saving roughly £40,000 in tax. The fix: review unused allowance at every year-end, not just when you finally have spare cash.',
      },
      {
        id: 'pension-vs-isa-default',
        title: 'Defaulting to ISA over company pension',
        body:
          'A Ltd director takes maximum dividends every year and puts £20,000 into a personal ISA. They miss that company pension contributions skip CT, NI, and dividend tax — moving £20,000 from the company to a pension is far cheaper than moving it to an ISA via dividend. Over 20 years and reasonable returns, the missed strategy can cost six figures of compound growth.',
      },
    ],
    worthReading: [
      'Ask: how much annual allowance and carry-forward do I have available, and is the company profitable enough to use it?',
      'HMRC Pensions Tax Manual — annual allowance, tapered annual allowance.',
    ],
    hasSimulator: true,
  },
  {
    id: 'trivial-benefits',
    subsection: 'extraction',
    title: 'Trivial benefits and exempt benefits',
    summary:
      'Small but completely free wins. Trivial benefits up to £50 each, exempt benefits like mobile phones, eye tests, and certain training — all available for genuine business reasons without triggering BiK or NI.',
    body: () => (
      <>
        <p>
          UK rules carve out specific small employee benefits as exempt from
          income tax and <Abbr k="ni" />. Used habitually, they accumulate to
          a meaningful annual saving without any aggressive planning.
        </p>
        <p>
          Headline categories:
        </p>
        <ul>
          <li>
            <strong>Trivial benefits</strong> — non-cash, costing under £50,
            not a reward for performance, not contractual. Directors of close
            companies are capped at £300/year total. Examples: a meal out, a
            gift of flowers, a small Christmas gift.
          </li>
          <li>
            <strong>Mobile phones</strong> — one company-provided phone per
            employee with a contract in the company's name is fully exempt
            from <Abbr k="bik" />.
          </li>
          <li>
            <strong>Eye tests and corrective lenses</strong> — required if you
            use display screen equipment at work, fully exempt.
          </li>
          <li>
            <strong>Annual events</strong> — Christmas party / summer event up
            to £150 per head, all-employee, exempt.
          </li>
          <li>
            <strong>Job-related training</strong> — fully exempt where it
            maintains or updates skills used in the role.
          </li>
        </ul>
      </>
    ),
    principle:
      'Threshold pattern: each exemption sits at a specific cliff edge. Spend up to the limit and there\'s no tax; cross by a pound and the whole benefit becomes taxable.',
    whenApplies: [
      'You operate through a Ltd that pays your salary and incidentals.',
      'You have genuine business uses for these benefits — not a paper trail to disguise personal spending.',
    ],
    whenDoesNot: [
      'You\'re a sole trader — most of these are employee benefits, not allowable for self-employment.',
      'The expense isn\'t genuinely incidental to the business — HMRC scrutinises directors\' claims more closely than employees\'.',
    ],
    pros: [
      'No tax, no NI, no PAYE reporting (for genuine trivial benefits under £50).',
      'Cumulative effect over a year is meaningful — easy £500–£1,000 of net annual saving used systematically.',
      'Phone and eye-test exemptions don\'t count toward the £300 director cap.',
    ],
    cons: [
      'Easy to get wrong — exceeding £50 on one item makes the whole item taxable.',
      'Can\'t be cash, can\'t be a contractual entitlement, can\'t be in recognition of work — narrow rules.',
      'Director cap of £300/year is a real ceiling for owner-directors.',
    ],
    professionals: [
      'Accountant — confirms which exemptions apply and ensures the documentation exists if HMRC asks.',
    ],
    worthReading: [
      'HMRC Employment Income Manual — section EIM21863 onwards on exempt benefits.',
      'Ask: which exempt-benefit categories make sense given how I actually spend? It costs nothing to use them properly.',
    ],
    hasSimulator: true,
  },
  {
    id: 'mileage-and-home',
    subsection: 'extraction',
    title: 'Mileage allowances and use-of-home',
    summary:
      'Legitimate ways to recover personal expenditure as company costs. AMAP rates pay tax-free mileage for business journeys in your own car; HMRC simplified expenses cover working from home without receipts.',
    body: () => (
      <>
        <p>
          Two specific HMRC-blessed mechanisms let you push genuine personal
          spend through the company without triggering <Abbr k="bik" />:
        </p>
        <ul>
          <li>
            <strong><Abbr k="amap" /> mileage</strong> — your company can pay
            you 45p/mile for the first 10,000 business miles a year and 25p
            thereafter, tax-free, for using your own car for business journeys
            (not commuting). Records: date, route, miles, purpose. The rates
            are also a tax cap; if the company pays more, the excess is{' '}
            taxable.
          </li>
          <li>
            <strong>Use-of-home flat rate</strong> — if you work from home
            regularly, the company can pay you a small flat-rate amount
            (currently £6/week or £312/year) tax-free without any receipts.
            For higher amounts, you need to apportion actual costs (heat,
            light, broadband) by the proportion of the home used.
          </li>
        </ul>
        <p>
          Neither is a fortune, but both are genuine, low-effort, and work
          year-after-year.
        </p>
      </>
    ),
    principle:
      'Classification pattern: the same cash flow (you spend money on petrol; the company has used the trip) gets taxed differently depending on whether it lands as expense reimbursement or as remuneration.',
    whenApplies: [
      'You drive your own car for genuine business purposes (client visits, off-site work, not commuting).',
      'You work from home for at least part of your work — common for founders.',
    ],
    whenDoesNot: [
      'You have a company car — different (and worse) BiK rules apply.',
      'You charge the company for personal mileage or for "working from home" on days you didn\'t — this is recharacterised as remuneration.',
    ],
    pros: [
      'AMAP can be £200–£800/year of net cash for a moderate-mileage founder.',
      'Use-of-home flat rate is small but free — no receipts, no apportionment.',
      'Both reduce the company\'s CT bill (deductible) and don\'t hit your personal tax.',
    ],
    cons: [
      'Records matter — HMRC will ask for the mileage log if they investigate.',
      'AMAP rates haven\'t risen in over a decade; for high mileage, the actual fuel cost may exceed the rate.',
      'The £6/week flat is meaningful only as a habit; serious home-use requires apportioned actuals.',
    ],
    professionals: [
      'Accountant — to set up the mileage policy properly and confirm the use-of-home apportionment if you\'re going beyond the flat rate.',
    ],
    worthReading: [
      'HMRC EIM31200 (mileage), EIM01476 (use of home as office).',
    ],
    hasSimulator: true,
  },
  {
    id: 'family-employment',
    subsection: 'extraction',
    title: 'Family employment',
    summary:
      'Paying a spouse or adult child a genuine salary for genuine work — using their otherwise-unused personal allowance and basic-rate band. Real work and a defensible market rate are non-negotiable.',
    body: () => (
      <>
        <p>
          Each adult in your household has their own £12,570 <Abbr k="pa" />,
          their own £37,700 basic-rate band, and (for shareholders) their own
          £500 dividend allowance. If a family member doesn't use these — say
          a non-working spouse, or an adult child at university — the
          household effectively wastes them.
        </p>
        <p>
          When the family member does <em>genuine work</em> for your
          business, paying them a salary or part-salary at a market-comparable
          rate uses those allowances and bands. The savings can be material:
          a £20,000 salary to a non-working spouse uses their PA + lower
          basic-rate band, saving roughly £4,000–£8,000 of household tax
          versus you paying yourself the equivalent.
        </p>
        <p>
          The line HMRC enforces, hard: the work must be genuine, the role
          must exist, and the pay must be commensurate with what you'd pay an
          arm's-length employee doing the same work. "Paying my spouse £50k
          to do bookkeeping that a £10k bookkeeper would handle" gets
          challenged.
        </p>
      </>
    ),
    principle:
      'Combines classification and threshold patterns: by re-classifying part of household income as the family member\'s salary, the second adult\'s untouched allowances and basic-rate band are brought into use.',
    whenApplies: [
      'A family member has unused personal allowance / basic-rate band.',
      'They genuinely do work the business needs — admin, finance, marketing, ops.',
      'You can document the work and justify the rate against external benchmarks.',
    ],
    whenDoesNot: [
      'No genuine work exists — paying a salary for show-up-only is a settlements-legislation problem.',
      'The pay rate is wildly above market for the role.',
      'The family member already has high earnings of their own.',
    ],
    pros: [
      'Net household saving of £2,000–£8,000/year in typical cases.',
      'Genuine work creates genuine value for the business beyond the tax saving.',
      'Family member builds NI record and pension qualifying earnings.',
    ],
    cons: [
      'HMRC scrutiny is higher than for arm\'s-length employees — paperwork must be tight.',
      'Settlements legislation can apply if income is shifted to a spouse without commensurate substance.',
      'Disputes (divorce, family breakdown) can complicate later — payroll records become evidence.',
    ],
    professionals: [
      'Accountant — to set up payroll, document the role, and benchmark the rate.',
      'Solicitor — if there\'s any complexity around shareholdings or director appointments for the family member.',
    ],
    mistakes: [
      {
        id: 'phantom-salary',
        title: 'Paying a spouse £40k to "help out"',
        body:
          'A founder pays their non-working spouse £40,000 a year as "office manager" without any defined role, recorded hours, or evidence of work performed. HMRC challenges the deduction, disallows the salary as a CT expense, and reclassifies it as the founder\'s income — adding back tax, NI, and penalties of roughly £20,000–£30,000. The fix: write the job description, pay a market rate, document hours, treat it like a real role.',
      },
    ],
    worthReading: [
      'HMRC Business Income Manual BIM37000 onwards on settlements legislation.',
      'Ask: can I document my family member\'s work as something I\'d pay an arm\'s-length employee for?',
    ],
    hasSimulator: true,
  },
  {
    id: 'directors-loans',
    subsection: 'extraction',
    title: "Director's loans (handled carefully)",
    summary:
      'A loan from your company to you that bridges a short cash need. Tax-traps multiply if it isn\'t repaid quickly: BiK above £10k, s455 CT charge if not repaid within nine months and a day, and the bed-and-breakfasting rules that closed the obvious workaround.',
    body: () => (
      <>
        <p>
          A <Abbr k="dla" /> tracks the running balance between you and your
          company. If you take cash out that isn't salary, dividend,
          legitimate expense, or pension contribution, it sits in the DLA as
          a loan from the company to you. Repaying it removes the loan;
          leaving it triggers a series of tax events.
        </p>
        <ul>
          <li>
            <strong>£10,000 BiK threshold.</strong> A loan over £10,000 at any
            point in the tax year (with limited exceptions) creates a benefit
            in kind taxed on you, equivalent to interest the company didn't
            charge.
          </li>
          <li>
            <strong>Section 455 CT charge.</strong> If the loan isn't repaid
            within nine months and one day of the company's year-end, the
            company pays an extra 35.75% CT on the unpaid balance. It's
            recoverable when you repay — but cash is gone in the meantime.
          </li>
          <li>
            <strong>Bed-and-breakfasting rules.</strong> Repaying the loan
            and re-borrowing within 30 days is treated as if you never repaid.
            HMRC closed the obvious workaround.
          </li>
        </ul>
        <p>
          Used as an emergency bridge — known sale, known repayment date —
          the DLA is a useful tool. Used as routine extraction, it
          accumulates expensive surprises.
        </p>
      </>
    ),
    principle:
      'Timing pattern with anti-avoidance teeth: the DLA is a deferral, but the deferred event has its own tax treatment that triggers if you delay too long. Tax law works hard to prevent loans being a substitute for salary or dividend.',
    whenApplies: [
      'Genuine short-term cash need with a clear repayment plan within nine months of year-end.',
      'You\'re prepared to monitor the balance and re-pay deliberately, not by accident.',
    ],
    whenDoesNot: [
      'You\'re using the DLA as routine drawings — bad idea, it accumulates s455 charges.',
      'You\'ve accidentally drifted into an overdrawn DLA without a plan.',
      'The loan is large and you can\'t repay it before year-end + 9 months.',
    ],
    pros: [
      'Genuinely short-term and small, it\'s a flexible bridge with no tax cost.',
      'Repayable at any time without ceremony.',
    ],
    cons: [
      'Three separate tax traps that interact — easy to fall into one if you\'re not watching.',
      'The s455 cash is recoverable but not fast — typically the year after repayment, after the company\'s next CT return.',
      'Repeated use erodes the "genuine loan" position with HMRC.',
    ],
    professionals: [
      'Accountant — to track the DLA, flag year-end positions, and handle s455 reclaims.',
    ],
    mistakes: [
      {
        id: 's455-trigger',
        title: 'Forgetting the £15k "I borrowed it briefly"',
        body:
          'A director takes £15,000 from the company as a loan, planning to repay it within the year. They forget. Nine months after year-end, the unpaid loan triggers a 35.75% s455 charge — about £5,400 of tax payable by the company. The cash is recoverable when they later repay, but it sits at HMRC for years. The fix: reconcile the director\'s loan account against year-end, every year, no exceptions.',
      },
      {
        id: 'bed-and-breakfast',
        title: 'Repaying and re-borrowing',
        body:
          'A director repays a £30k DLA on year-end day and re-borrows £30k two weeks later. They assume the s455 clock resets. Bed-and-breakfasting rules apply — the repayment is ignored for s455 purposes and the charge applies as if the loan was never repaid. The fix: a genuine repayment with real cash that doesn\'t come back from the same source within 30 days.',
      },
    ],
    worthReading: [
      'HMRC Company Taxation Manual — CTM61500 series on close-company loans.',
      'Ask: what\'s my DLA balance at this exact moment, and what\'s the plan to clear it?',
    ],
  },
];

// =====================================================================
// WEALTH PRESERVATION
// =====================================================================

const wealthStrategies: Strategy[] = [
  {
    id: 'borrow-against-listed',
    subsection: 'wealth-preservation',
    title: 'Borrow against listed assets (the honest version of "Buy, Borrow, Die")',
    summary:
      "Loans aren't taxable events; selling triggers CGT. Post-exit founders with significant listed wealth can borrow against their portfolio to fund spending without selling. It works — but it's leverage, with all that implies, and the UK rules differ meaningfully from the US version that's marketed online.",
    body: () => (
      <>
        <p>
          The core observation is real: if you borrow money you don't pay
          tax on the loan; if you sell an appreciated asset you pay{' '}
          <Abbr k="cgt" />. So if you have a portfolio of listed shares
          standing at a large unrealised gain and you need £200,000 to fund
          a year of life, borrowing £200,000 against the portfolio is
          tax-free; selling £200,000 of shares triggers CGT on the gain.
        </p>
        <p>
          The version that works in practice:
        </p>
        <ul>
          <li>
            <strong>You hold publicly-listed assets</strong> in a brokerage
            account that supports margin or securities-backed lending.
          </li>
          <li>
            <strong>The lender will lend</strong> at a sensible{' '}
            <Abbr k="ltv" /> — typically 50–70% for diversified equity
            portfolios, less for concentrated single-stock holdings.
          </li>
          <li>
            <strong>The interest rate</strong> is at or near your
            after-tax CGT rate — currently feasible because base rates are
            roughly 4–5% and securities-backed margin sits at base + 1–3%.
          </li>
          <li>
            <strong>You're disciplined</strong> about LTV staying well below
            the maintenance margin, and you have a plan if markets fall 30%+.
          </li>
        </ul>
        <p>
          What doesn't work for most founders: doing this against private
          company shares. UK banks rarely lend against unlisted equity, and
          structures that achieve a similar economic outcome (employee benefit
          trusts, contractor loan schemes, share-pledge arrangements with
          related parties) have repeatedly been defeated by HMRC under
          disguised-remuneration rules.
        </p>
        <p>
          The "Die" part of "Buy, Borrow, Die" relies on a CGT reset on
          death. UK rules: assets passing on death receive a CGT uplift to
          the date-of-death market value, so unrealised gains are wiped out
          for CGT purposes — but <Abbr k="iht" /> may then apply at 40% on
          the same value (with reliefs and the nil-rate bands). The strategy
          can still work for IHT-planning families but it's not the simple
          "everything tax-free at death" some social-media versions imply.
        </p>
      </>
    ),
    principle:
      'Deferral + classification: a loan is a different label than a sale, and the timing of the eventual disposal may be either never (death) or at lower marginal rates (retirement). The wealth growth happens at full pre-tax rates inside the portfolio.',
    whenApplies: [
      'You\'ve had a liquidity event and own significant publicly-listed equity.',
      'You\'re comfortable with the leverage and the discipline it requires.',
      'You\'re using the borrowed cash for spending or investing in tax-efficient wrappers, not consumption that would have been tax-deductible anyway.',
    ],
    whenDoesNot: [
      'Your wealth is mostly in unlisted shares — banks won\'t lend, and onshore "alternatives" are HMRC targets.',
      'You don\'t have a margin-call playbook for a 30%+ drawdown.',
      'Selling and paying CGT plus reinvesting in an ISA over time would produce a similar outcome with no leverage.',
      'You\'re using borrowed cash to fund consumption that grows nothing — interest then compounds against you.',
    ],
    pros: [
      'Defers (and possibly avoids) CGT on appreciated assets.',
      'Keeps capital invested at full pre-tax compounding rates.',
      'Genuinely flexible — repay any time, take more if needed.',
    ],
    cons: [
      'Leverage cuts both ways — a 50% drawdown forces sales at the worst time.',
      'Interest accrues; if it exceeds the asset\'s after-tax appreciation, you go backwards.',
      'Not a substitute for an exit-strategy plan; eventually the loan must be repaid or rolled.',
      'IHT may still apply on death, even if CGT is reset.',
    ],
    professionals: [
      'Wealth manager / private bank — for the actual lending facility.',
      'Tax adviser — for the CGT-uplift-on-death and IHT interaction analysis.',
      'Solicitor — for any pledge / collateral documentation.',
    ],
    mistakes: [
      {
        id: 'private-shares-loan',
        title: 'Trying to borrow against private-company shares',
        body:
          'A pre-exit founder is sold a complex structure to "unlock" cash from their unlisted shares without selling — typically involving an offshore trust or a contractor loan arrangement. Five years later HMRC challenges, the structure is unwound, and the founder owes the deferred CGT plus penalties and interest. The fix: until the shares are listed or sold, treat them as illiquid; don\'t pay anyone who promises otherwise.',
      },
      {
        id: 'margin-call',
        title: 'Margin call in a market downturn',
        body:
          'A founder borrows at 65% LTV against a concentrated tech portfolio in 2021. The portfolio drops 50% in 2022, the LTV breaches the maintenance margin, and the broker force-sells at the bottom — crystallising large CGT on what was meant to be a deferral. The fix: cap LTV well below the maintenance threshold (35–45% rather than 65%), and diversify the underlying holdings.',
      },
    ],
    worthReading: [
      'Ask: what\'s the actual rate on a securities-backed loan today, what\'s the maintenance LTV, and what does the documentation say about force-sale rights?',
      'Read: HMRC IHT Manual on the CGT-uplift-on-death position, and the Disguised Remuneration manual for why private-share structures don\'t work.',
    ],
    hasSimulator: true,
  },
  {
    id: 'holding-company',
    subsection: 'wealth-preservation',
    title: 'Holding company structures',
    summary:
      'A parent Ltd that owns 100% of one or more trading subsidiaries. Cash sweeps up tax-free between UK group companies, isolating the cash from operational risk and preserving BPR/BADR-friendly trading status in the subs.',
    body: () => (
      <>
        <p>
          A "holdco" sits above your trading <Abbr k="ltd" />(s). The trading
          sub generates the operating profit; the holdco does no trading
          itself. UK-to-UK group dividends are normally exempt from{' '}
          <Abbr k="ct" />, so post-CT cash can flow up from the sub to the
          holdco with no further tax leakage.
        </p>
        <p>
          What this gives you:
        </p>
        <ul>
          <li>
            <strong>Risk isolation.</strong> Cash already swept up to the
            holdco isn't on the trading sub's balance sheet, so it isn't
            available to claimants pursuing the sub.
          </li>
          <li>
            <strong>Preserves trading status.</strong> A trading sub with too
            much non-operational cash can lose its "trading" character for{' '}
            <Abbr k="bpr" /> and <Abbr k="badr" /> — sweeping the surplus up
            preserves the relief.
          </li>
          <li>
            <strong>Cleaner exit.</strong> A buyer can acquire the trading
            sub without acquiring the cash, the holdco, or any unrelated
            history.
          </li>
          <li>
            <strong>Group relief for losses</strong>, subject to rules.
          </li>
        </ul>
        <p>
          Inserting a holdco above an existing trading Ltd is usually done
          via a share-for-share exchange. Done well in advance of any sale,
          it's clean. Done a few months before, it can disqualify BADR.
        </p>
      </>
    ),
    principle:
      'Structure pattern: the same trading activity, repackaged through stacked entities, gets different risk treatment and different tax treatment for the surplus cash. Group dividends are an explicit relief, not a loophole — they exist because taxing the same profit twice within a single group would distort behaviour.',
    whenApplies: [
      'You have £200k+ of non-operational cash inside a trading Ltd.',
      'You run two or more trading lines you want isolated.',
      'You\'re 2+ years from a sale and want to preserve BADR cleanly.',
    ],
    whenDoesNot: [
      'Single trading Ltd with no surplus cash — a holdco adds cost without benefit.',
      'You can\'t accept the extra accounts and admin.',
      'The associated-company rules will push the group into the marginal-relief band when you weren\'t there before.',
    ],
    pros: [
      'Risk isolation is genuine — separately capitalised entities.',
      'Inter-co dividends are normally CT-free.',
      'Cleaner business sale; cleaner ringfencing of new ventures.',
    ],
    cons: [
      'Two (or more) sets of accounts and CT returns.',
      'Associated-company rules tighten CT bands.',
      'Substance and director-time considerations — holdcos can\'t be paper shells.',
      'Setup costs (legal + tax advice for the share-for-share).',
    ],
    professionals: [
      'Tax adviser — for the share-for-share exchange and any pre-sale planning.',
      'Solicitor — for new articles, shareholder agreements, intra-group services agreements.',
      'Accountant — for the ongoing two-set-of-accounts world.',
    ],
    mistakes: [
      {
        id: 'cash-pile-bpr',
        title: 'Letting the cash pile knock out BPR / BADR',
        body:
          'A founder accumulates £700,000 of retained cash inside their trading Ltd over five years. On exit, BADR is challenged because excess investment-style cash has eroded the "trading" character. They pay full 24% CGT instead of 18% — costing roughly £60,000 on the first £1m of gain. A holdco-and-sweep structure put in place 3+ years earlier would have neutralised the issue.',
      },
    ],
    worthReading: [
      'Ask: what\'s the cleanest way to insert a holdco given my current shareholders, and how does it interact with my BADR clock?',
    ],
  },
  {
    id: 'fic-strategy',
    subsection: 'wealth-preservation',
    title: 'Family Investment Companies (FICs)',
    summary:
      'Bespoke Ltds designed to hold investments and pass wealth across generations. They emerged after the 2006 trust reforms made discretionary trusts more expensive. Setup is non-trivial; the horizon is decades.',
    body: () => (
      <>
        <p>
          A <Abbr k="fic" /> is a Ltd whose purpose is to hold investments —
          shares, funds, sometimes property — rather than to trade. Family
          members hold different classes of shares with different rights to
          income, capital, and votes. The company invests at corporate rates;
          value can be passed across generations through the share structure.
        </p>
        <p>
          Why families use them instead of trusts: large discretionary trusts
          set up since 2006 face an immediate 20% IHT entry charge plus
          10-year periodic charges of up to 6%. FICs have no entry charge
          and use lower corporate rates instead of trust rates — but they're
          not exempt; the wealth still gets taxed, just at corporate rather
          than trust rates.
        </p>
        <p>
          The mechanics typically involve:
        </p>
        <ul>
          <li>
            <strong>Founder lends cash to the FIC</strong> (a director's loan
            that can be repaid tax-free over time).
          </li>
          <li>
            <strong>Different share classes</strong> for adult children — each
            using their own personal allowance and dividend allowance.
          </li>
          <li>
            <strong>Growth shares</strong> gifted to children early, when
            value is low — subsequent appreciation is outside the founder's
            estate (subject to the 7-year rule).
          </li>
          <li>
            <strong>Investment income</strong> taxed at CT rates inside (UK
            dividends to a UK company are generally exempt, interest is
            taxable, gains are taxable).
          </li>
        </ul>
      </>
    ),
    principle:
      'Combines retention (corporate-rate compounding inside) with structure (different share classes for different family members) for a multi-decade IHT and growth play.',
    whenApplies: [
      'Investable capital £500k+ that you don\'t need personally.',
      'You have a multi-decade view (10–30 years) and adult children to gift to.',
      'You can absorb the £5k–£15k+ setup cost and ongoing admin.',
    ],
    whenDoesNot: [
      'Smaller capital that ISAs and pensions can comfortably wrap.',
      'Short-horizon (under 10 years) — the structure doesn\'t outperform simpler routes.',
      'Family dynamics where unequal share classes would create disputes.',
    ],
    pros: [
      'Investment growth taxed at lower corporate rates than top personal.',
      'Generation-skipping share structures.',
      'No 20% IHT entry charge, unlike post-2006 discretionary trusts.',
    ],
    cons: [
      'Setup is genuinely complex — bespoke share classes, articles, member agreements.',
      'Ongoing admin and accountancy is meaningful.',
      'Future political risk — FIC tax treatment could change.',
      'Family disputes can deadlock the structure.',
    ],
    professionals: [
      'Specialist tax adviser — FICs are a niche; non-specialists make expensive mistakes.',
      'Solicitor — for the bespoke articles and share-class drafting.',
      'Independent financial adviser — for the underlying investment policy.',
    ],
    worthReading: [
      'HMRC FIC review (2019) — the unit was disbanded after finding no widespread avoidance, but the rules can change.',
      'Ask: how does an FIC compare to maxed-out pensions + ISAs across the family for our specific facts?',
    ],
  },
  {
    id: 'pensions-long-game',
    subsection: 'wealth-preservation',
    title: 'Pensions as the long-game wealth vehicle',
    summary:
      'Beyond extraction, pensions are the most powerful long-term tax-deferred wrapper available — tax-free growth, partly tax-free draw, historically (and currently still partly) outside the IHT estate.',
    body: () => (
      <>
        <p>
          The extraction case for pensions is covered in the Extraction
          sub-section. The wealth-preservation case is the same wrapper used
          across decades: contributions accumulate, compound tax-free
          internally, and can be drawn flexibly from the late 50s onwards.
        </p>
        <p>
          The IHT angle deserves separate attention. Historically, pensions
          have sat outside the IHT estate — meaning a defined-contribution
          pot passed to beneficiaries on death was IHT-free (with income tax
          for beneficiaries depending on age at death). Recent
          announcements (Autumn 2024) signalled tightening: pensions will be
          brought into IHT scope from April 2027 (subject to legislation).
          The exact mechanics will follow consultation.
        </p>
        <p>
          Until then and after, the in-life advantages remain: tax-free
          growth, no annual reporting, broad investment freedom,{' '}
          25% tax-free lump sum at draw, marginal-rate-on-rest. For a 30+
          year compounding horizon, very few wrappers compete.
        </p>
      </>
    ),
    principle:
      'Deferral compounded across decades. The longer the horizon, the more the time-value advantage of in-wrapper growth dwarfs the eventual draw-tax cost.',
    whenApplies: [
      'You have surplus cash beyond living needs and short-term reserves.',
      'You can leave the cash alone until your late 50s.',
      'You\'re not already past the lifetime allowance considerations (for any historical builds).',
    ],
    whenDoesNot: [
      'You\'ll need access before late 50s.',
      'Annual allowance taper bites at very high income.',
      'You\'re assuming current IHT treatment will persist forever — model the post-April-2027 changes too.',
    ],
    pros: [
      'Tax-free internal compounding.',
      '25% tax-free lump sum + marginal rate on rest.',
      'In-life IHT advantage even after the 2027 changes (still likely outside the estate for some purposes).',
    ],
    cons: [
      'Locked until your late 50s.',
      'Annual / lifetime caps and tapers add complexity.',
      'Political and rule-change risk.',
    ],
    professionals: [
      'Independent financial adviser for fund choice and lifetime planning.',
      'Tax adviser for the IHT interaction post-2027.',
    ],
    worthReading: [
      'HMRC Pensions Tax Manual.',
      'Autumn 2024 Budget — pensions and IHT consultation document.',
    ],
    hasSimulator: true,
  },
  {
    id: 'isa-discipline',
    subsection: 'wealth-preservation',
    title: 'ISAs and disciplined annual maxing',
    summary:
      'Each adult\'s £20,000/year ISA allowance compounds dramatically over decades. Every year missed is a year of compounding lost forever — there\'s no carry-forward.',
    body: () => (
      <>
        <p>
          An <Abbr k="isa" /> is a personal wrapper with a £20,000 annual
          contribution cap. Inside, growth and withdrawals are free of income
          tax and <Abbr k="cgt" /> for life. Two adults filling £20,000 each
          for 20 years at 7% gross compound to roughly £870,000 — entirely
          outside any further tax.
        </p>
        <p>
          The crucial constraint: the allowance is annual and does <em>not</em>{' '}
          carry forward. Each tax year you don't use it is gone. This is
          why "disciplined annual maxing" matters more than picking
          investments inside.
        </p>
        <p>
          For under-40s, the <Abbr k="lisa" /> adds a 25% government bonus on
          contributions up to £4,000/year (within the overall £20k limit),
          usable for first home or retirement (after 60). Early withdrawal
          incurs a 25% penalty.
        </p>
      </>
    ),
    principle:
      'Wrapper pattern: tax-on-the-way-in (post-tax cash), tax-free in transit, tax-free on the way out. The opposite shape of a pension. Because contributions are post-tax, the wrapper can\'t match a pension on the input multiplier — but it makes up for it with full liquidity.',
    whenApplies: [
      'You have surplus post-tax cash you don\'t need within the next year or two.',
      'Especially: every adult in the household has an ISA allowance — use both.',
    ],
    whenDoesNot: [
      'You\'re cash-strapped — ISAs aren\'t for emergency-fund money.',
      'You\'d be better off using a pension first (employer contributions skip CT and NI; ISA contributions don\'t).',
    ],
    pros: [
      'Tax-free growth and withdrawal, simple, no admin.',
      'Full liquidity (most types) — withdraw any time.',
      'Each adult has their own £20k allowance — household effective £40k.',
    ],
    cons: [
      'Cap is meaningful only across years; one year max isn\'t game-changing.',
      'Allowance doesn\'t carry forward — every missed year is gone.',
      'Post-tax money in — CT and dividend tax (for company owners) eat into the input.',
    ],
    professionals: [
      'IFA — fund choice and platform selection.',
    ],
    worthReading: [
      'GOV.UK ISA pages — contribution rules, transfer rules, eligibility.',
    ],
    hasSimulator: true,
  },
];

// =====================================================================
// INVESTMENT
// =====================================================================

const investmentStrategies: Strategy[] = [
  {
    id: 'eis-seis',
    subsection: 'investment',
    title: 'EIS and SEIS investments',
    summary:
      'Tax-advantaged investments in qualifying early-stage UK companies. 30% (EIS) or 50% (SEIS) income tax relief, CGT-free gains after 3 years, plus loss relief — but you\'re funding genuinely high-risk equity.',
    body: () => (
      <>
        <p>
          <Abbr k="eis" /> and <Abbr k="seis" /> are the UK's two main schemes
          for incentivising private investment into early-stage companies.
          They give individual investors generous reliefs in exchange for
          taking real equity risk in qualifying companies.
        </p>
        <p>
          Headline reliefs:
        </p>
        <ul>
          <li>
            <strong>SEIS:</strong> 50% income tax relief on up to £200,000/year
            of investment, CGT-free gains if held 3+ years, 50% CGT
            reinvestment relief on existing gains, generous loss relief.
          </li>
          <li>
            <strong>EIS:</strong> 30% income tax relief on up to £1m/year (£2m
            if at least £1m goes into knowledge-intensive companies), CGT-free
            gains, loss relief on the unrelieved portion.
          </li>
        </ul>
        <p>
          Eligibility is strict: the investee company must be qualifying
          (size, activities, age limits), the investor must be unconnected
          (broadly: not own &gt;30%, not be an employee, not have lent the
          company structured as the investment), and the shares must be
          ordinary risk equity. Get advance assurance from HMRC before
          raising — it's standard.
        </p>
      </>
    ),
    principle:
      'Incentive pattern: the government wants more risk capital flowing into early-stage companies and pays you (in tax relief) to provide it. The relief makes the asymmetric upside feasible despite the high failure rate.',
    whenApplies: [
      'You have meaningful taxable income that the relief can reduce.',
      'You can afford to lose the entire investment — these are genuinely high-risk.',
      'You\'re prepared to hold for at least 3 years to keep the income-tax relief.',
    ],
    whenDoesNot: [
      'You\'re investing in your own company or one where you\'re an employee — connected-party rules disqualify.',
      'You can\'t afford the loss — relief reduces the downside but doesn\'t eliminate it.',
      'The capital is for retirement and you can\'t afford illiquidity.',
    ],
    pros: [
      'Very large headline reliefs.',
      'CGT-free gains if you back a winner.',
      'Loss relief cushions the downside meaningfully.',
    ],
    cons: [
      'Underlying companies are high-risk; many fail.',
      'Strict qualifying conditions for company and investor.',
      'Illiquid — you\'re locked in for years.',
      'Misuse (preferential rights, related-party arrangements) can lose qualification retrospectively.',
    ],
    professionals: [
      'Tax adviser — to confirm relief eligibility and document the claim.',
      'Investment platform / EIS fund manager — for actual deal flow if you don\'t have direct access.',
    ],
    mistakes: [
      {
        id: 'connected-party',
        title: 'Investing in your own company under EIS',
        body:
          'A founder tries to "invest" £100k in their own Ltd under EIS to claim £30k of income-tax relief. The connected-party rules disqualify the investment — they own more than 30% and are an employee. Relief is denied; the investment is just an ordinary equity issue.',
      },
    ],
    worthReading: [
      'HMRC Venture Capital Schemes Manual.',
      'Ask: do I qualify as unconnected? Has the company applied for advance assurance?',
    ],
    hasSimulator: true,
  },
  {
    id: 'vct',
    subsection: 'investment',
    title: 'Venture Capital Trusts (VCTs)',
    summary:
      'Listed funds investing in qualifying small companies. 30% income tax relief on subscription, tax-free dividends, no CGT — in exchange for a 5-year hold, manager fees, and the underlying small-cap risk.',
    body: () => (
      <>
        <p>
          A <Abbr k="vct" /> is a publicly-listed investment company that
          deploys capital into a portfolio of qualifying small UK companies.
          For investors, it sits between EIS and a regular fund — more
          diversified than direct EIS, but with a similar tax-relief profile.
        </p>
        <p>
          Headline tax treatment:
        </p>
        <ul>
          <li>30% income tax relief on subscriptions up to £200,000/year (on new shares only — not secondary purchases).</li>
          <li>Tax-free dividends from the VCT.</li>
          <li>No CGT on disposal of the VCT shares.</li>
          <li>Must hold the shares for at least 5 years to keep the income-tax relief.</li>
        </ul>
        <p>
          The trade-offs vs EIS: more diversification (the VCT spreads across
          many investee companies), but higher fees, less transparency, and
          the price you pay is the secondary-market price which can trade at
          a premium to NAV during fundraising.
        </p>
      </>
    ),
    principle:
      'Same incentive pattern as EIS — public-policy subsidy for small-company capital — but packaged as a listed fund for easier access.',
    whenApplies: [
      'You\'ve already used your pension and ISA allowances and want further tax-relief room.',
      'You can hold for 5 years and accept manager fees in exchange for diversification.',
      'You have meaningful taxable income to set the relief against.',
    ],
    whenDoesNot: [
      'Pension and ISA aren\'t maxed yet — those are usually better first.',
      'You can\'t hold for 5 years.',
      'You don\'t want the underlying small-cap risk.',
    ],
    pros: [
      '30% income-tax relief and tax-free dividends.',
      'Diversified vs. single-EIS bets.',
      'Listed and transferable (though selling early forfeits the tax relief).',
    ],
    cons: [
      'Manager fees of 1.5–3.0% per year are meaningful drag.',
      'Secondary-market prices can trade well below subscription price.',
      'Underlying small-cap risk is real.',
      'Less transparent than holding listed equities directly.',
    ],
    professionals: [
      'IFA who actually understands VCTs — most "advisers" defer to a small group of specialists.',
      'Tax adviser for the relief documentation.',
    ],
    worthReading: [
      'AIC (Association of Investment Companies) VCT pages — annual sector data and individual VCT histories.',
      'Ask: what does this VCT actually hold, and what are its 5- and 10-year NAV returns net of fees?',
    ],
    hasSimulator: true,
  },
  {
    id: 'business-relief-aim',
    subsection: 'investment',
    title: 'Business Relief assets',
    summary:
      'Some unlisted shares (and certain AIM-listed shares) qualify for 100% Business Relief — meaning 0% IHT after just two years of ownership. Useful for IHT planning, but illiquid, volatile, and politically exposed.',
    body: () => (
      <>
        <p>
          <Abbr k="bpr" /> is an <Abbr k="iht" /> relief that exempts
          qualifying business assets from inheritance tax after two years of
          ownership. Originally aimed at preventing the forced sale of family
          businesses on death, the relief also covers some shares in
          qualifying trading companies — including a subset of{' '}
          <Abbr k="aim" />-listed shares.
        </p>
        <p>
          The mainstream IHT-planning use is buying a portfolio of qualifying
          AIM shares (or a managed BPR portfolio service) and holding it for
          two years. After that, on death, the value is generally outside the
          taxable estate.
        </p>
        <p>
          Caveats are heavy. AIM stocks are volatile and not all of them
          qualify — managers select the ones expected to qualify, but HMRC
          can challenge. Recent budget announcements signalled that BPR will
          be capped: from April 2026, only the first £1m of qualifying assets
          will get full relief, with the excess at 50% relief instead of
          100%. The detail is still in consultation.
        </p>
      </>
    ),
    principle:
      'Relief pattern: a deliberate carve-out from the general 40% IHT rule, conditioned on the asset being a productive business interest (or analogous). Holding period exists to prevent gaming.',
    whenApplies: [
      'You have a significant estate above the IHT nil-rate bands.',
      'You can hold the qualifying assets for at least 2 years before death.',
      'You can tolerate AIM-level volatility on the BPR portion.',
    ],
    whenDoesNot: [
      'Your estate is already below the IHT thresholds — no benefit.',
      'You can\'t accept AIM volatility — the assets must be held to qualify.',
      'You\'ve assumed BPR will stay 100% — model the post-April-2026 capped version.',
    ],
    pros: [
      'IHT exemption (within the new cap) after just 2 years.',
      'Liquid (AIM-listed) compared to private business interests.',
      'Can be combined with normal investment portfolios.',
    ],
    cons: [
      'AIM volatility is real — the BPR subset can swing 30–50% in a bad year.',
      'Manager fees on BPR portfolio services.',
      'Post-April-2026 cap reduces the benefit on estates above £1m of BPR assets.',
      'HMRC qualification is on a stock-by-stock basis; some get challenged.',
    ],
    professionals: [
      'Specialist BPR portfolio manager — most IFAs subcontract this.',
      'Tax adviser for the IHT planning interaction.',
      'Solicitor for will / estate planning.',
    ],
    worthReading: [
      'HMRC IHT Manual on BPR.',
      'Autumn 2024 Budget — BPR / APR cap consultation.',
    ],
    hasSimulator: true,
  },
  {
    id: 'reinvestment-relief',
    subsection: 'investment',
    title: 'Reinvestment relief',
    summary:
      'Roll a capital gain into a qualifying EIS investment within 3 years to defer the CGT. Useful if you\'re planning the EIS investment anyway; not a reason on its own.',
    body: () => (
      <>
        <p>
          If you make a capital gain — selling shares, property, a business —
          you can defer the <Abbr k="cgt" /> on it by reinvesting the gain
          into a qualifying <Abbr k="eis" /> investment within 1 year before
          or 3 years after the disposal. The deferred CGT becomes payable
          when the EIS shares are eventually sold (or another chargeable
          event happens, like the company ceasing to qualify).
        </p>
        <p>
          The relief stacks with the standard 30% EIS income-tax relief, so
          the same investment is doing two jobs: deferring an old CGT bill
          and getting a new IT relief.
        </p>
      </>
    ),
    principle:
      'Pure deferral: the gain isn\'t exempt, just postponed. The benefit is the time-value of money plus the chance the eventual rate is lower.',
    whenApplies: [
      'You\'ve realised a large gain you\'d otherwise pay CGT on.',
      'You were going to make an EIS investment anyway, or are willing to.',
      'You can absorb the underlying EIS risk.',
    ],
    whenDoesNot: [
      'You aren\'t comfortable with EIS-level risk — don\'t take it just to defer CGT.',
      'BADR was available on the original gain — using BADR (18%) is usually better than deferring at standard rates.',
    ],
    pros: [
      'Defers CGT, sometimes for many years.',
      'Stacks with EIS income-tax relief.',
    ],
    cons: [
      'Just deferral, not exemption — eventual sale crystallises the gain.',
      'EIS investment risk is real and not relieved by the deferral.',
      'Adds complexity to record-keeping across years.',
    ],
    professionals: [
      'Tax adviser to compute whether deferral or BADR-now is the better route.',
    ],
    worthReading: [
      'HMRC HS297 — Reinvestment Relief.',
      'Ask: what was the CGT rate / relief available on the original gain, and is deferring worth taking on EIS risk?',
    ],
    hasSimulator: true,
  },
];

// =====================================================================
// SALE & EXIT
// =====================================================================

const saleStrategies: Strategy[] = [
  {
    id: 'badr-qualification',
    subsection: 'sale-exit',
    title: 'BADR qualification',
    summary:
      '18% CGT instead of 24% on the first £1m of qualifying lifetime gain. Worth roughly £60,000 on a £1m sale. The qualifying conditions are strict and must be held for the full 2 years before the sale — small late changes can disqualify you.',
    body: () => (
      <>
        <p>
          <Abbr k="badr" /> reduces the CGT rate on qualifying business sales
          to 18% on the first £1m of lifetime gain. Anything above that is
          taxed at the ordinary CGT rate (24% post-Oct-2024).
        </p>
        <p>
          To qualify (broad strokes):
        </p>
        <ul>
          <li>You hold ≥5% of ordinary shares and voting rights.</li>
          <li>You\'re an officer or employee of the company.</li>
          <li>The company is a trading company (or holding company of a trading group).</li>
          <li>All of the above held for at least 2 years before the sale.</li>
        </ul>
        <p>
          The 2-year requirement is the trap most founders fall into. A
          structural change made within 2 years of the sale — a new share
          class, a director resignation, a reorganisation — can break the
          continuous-holding test and disqualify the relief retrospectively.
        </p>
      </>
    ),
    principle:
      'Incentive + relief pattern. The reduced rate is policy-driven — the government wants founders to build and sell businesses — but it\'s heavily conditioned on substance and continuity to prevent gaming.',
    whenApplies: [
      'You\'re selling shares in a company where you\'ve been a director / employee with ≥5% holding for 2+ years.',
      'The company genuinely trades (not predominantly investment-holding).',
      'You\'re planning the sale far enough ahead to keep the structure clean.',
    ],
    whenDoesNot: [
      'You\'ve held for less than 2 years.',
      'The company has accumulated material non-operational cash that erodes "trading" status.',
      'You\'re selling a non-qualifying asset (e.g. an investment company, a personal-use asset).',
      'You\'ve already used your £1m lifetime cap on previous sales.',
    ],
    pros: [
      'Saves roughly £60,000 on a £1m gain (6pp rate difference).',
      'Available alongside other reliefs (EIS, etc.) where they don\'t conflict.',
    ],
    cons: [
      'Strict 2-year test plus continuous-employment requirement.',
      'Lifetime cap of £1m of gain — meaningful for big exits.',
      'Pre-sale restructuring can disqualify if not done carefully.',
    ],
    professionals: [
      'Tax adviser — early. Pre-sale planning is where most BADR is won or lost.',
      'Solicitor — for the SPA structure.',
    ],
    mistakes: [
      {
        id: 'last-minute-share-class',
        title: 'New share class 18 months before sale',
        body:
          'A founder builds a successful Ltd over six years, then decides to sell. They start the sale process before checking BADR eligibility. A small structural detail — they introduced a growth-share class 18 months earlier — disqualifies them from BADR. They pay full 24% CGT instead of 18%, costing roughly £60,000 on a £1m sale. The fix: discuss any structural change with an adviser, and plan the sale 2+ years ahead.',
      },
    ],
    worthReading: [
      'HMRC HS275 — Business Asset Disposal Relief.',
      'Ask: what is my BADR clock and what could break it between now and the sale?',
    ],
    hasSimulator: true,
  },
  {
    id: 'eot-sale',
    subsection: 'sale-exit',
    title: 'Employee Ownership Trusts (EOTs)',
    summary:
      'Sell to a trust that holds shares for the employees and pay 0% CGT — provided the qualifying conditions are met and continue to be met. Genuinely powerful for founders who want legacy and tax efficiency; not a fit for those who want maximum cash on day one.',
    body: () => (
      <>
        <p>
          An <Abbr k="eot" /> is a trust that holds &gt;50% of the shares in a
          trading company on behalf of its employees. Sales to a qualifying
          EOT attract 0% <Abbr k="cgt" /> on the gain (subject to all
          conditions being and remaining met).
        </p>
        <p>
          Key conditions:
        </p>
        <ul>
          <li>The company must be a trading company (or holding company of a trading group).</li>
          <li>The EOT must hold &gt;50% of the company.</li>
          <li>All eligible employees must benefit on the same terms (with limited variation by salary, length of service, hours).</li>
          <li>The seller(s) and connected persons must not retain control after the sale.</li>
        </ul>
        <p>
          The sale typically happens at fair market value, with consideration
          deferred — the EOT pays the founder out of future trading profits
          over several years. So the founder gets full value (eventually),
          tax-free, but takes credit risk on the company\'s future
          performance.
        </p>
      </>
    ),
    principle:
      'Incentive pattern: the government wants more employee-owned businesses, so the relief is uncapped for qualifying sales. Substance test: the employees must genuinely benefit; the seller must genuinely cede control.',
    whenApplies: [
      'Founder wants legacy + clean tax outcome.',
      'Business has a strong management team that can run it post-sale.',
      'Founder is comfortable with deferred consideration (paid out of future profits).',
    ],
    whenDoesNot: [
      'Founder wants maximum cash on day one — EOT pays slowly, out of future profits.',
      'Business depends on the founder personally — without them, profits drop and the deferred consideration is at risk.',
      'There are external buyers willing to pay a premium that exceeds the EOT tax saving.',
    ],
    pros: [
      '0% CGT on the qualifying gain — uncapped.',
      'Continuity of business, employees, culture.',
      'Less aggressive negotiation than a trade sale.',
    ],
    cons: [
      'Deferred consideration — credit risk on future trading.',
      'Strict ongoing conditions; breach can claw back the relief.',
      'Specialist legal and trustee setup.',
      'Slower than a trade sale; less optionality.',
    ],
    professionals: [
      'EOT-specialist solicitor and tax adviser — niche territory.',
      'Independent trustee — usually a specialist firm.',
      'Independent valuer for the share value.',
    ],
    worthReading: [
      'EOA (Employee Ownership Association) and HMRC VCM Manual on EOTs.',
      'Ask: what does our cashflow look like if profits drop 30% — can the EOT still pay the deferred consideration?',
    ],
    hasSimulator: true,
  },
  {
    id: 'earn-outs',
    subsection: 'sale-exit',
    title: 'Earn-out structures and tax',
    summary:
      'Earn-outs (consideration contingent on future performance) are often taxed as employment income rather than capital gain. Negotiate the structure carefully — small wording changes shift millions in tax.',
    body: () => (
      <>
        <p>
          When a sale includes an earn-out — additional consideration paid
          based on the company\'s future performance — UK tax treatment is
          rarely as clean as a straight capital sale. HMRC may treat the
          earn-out as employment income (taxed at top marginal rates plus
          NI) rather than capital gain (potentially BADR-eligible).
        </p>
        <p>
          The risk factors HMRC weighs:
        </p>
        <ul>
          <li>Is the seller required to remain employed for the earn-out to vest? (If yes — employment treatment risk.)</li>
          <li>Is the earn-out tied to individual performance or to general business performance?</li>
          <li>Is the earn-out value disproportionate to a typical employment package?</li>
          <li>Did the seller receive a market-rate salary during the earn-out period?</li>
        </ul>
        <p>
          Done well, earn-outs can be structured as deferred consideration
          for the shares — capital, with potential BADR. Done badly, they
          collapse into income at the top rate.
        </p>
      </>
    ),
    principle:
      'Classification pattern at its sharpest: the same payment can be taxed at 18% (BADR capital) or 47% (additional-rate income + NI), depending on how the contract is written and what substance the seller\'s post-sale role has.',
    whenApplies: [
      'The deal includes future-contingent consideration.',
      'You expect to remain involved in the business post-sale.',
    ],
    whenDoesNot: [
      'Pure cash deal at completion — earn-out questions don\'t arise.',
    ],
    pros: [
      'Done correctly, preserves capital treatment on contingent consideration.',
      'Lets buyer pay value over time aligned with performance.',
    ],
    cons: [
      'Recharacterisation risk is real — case law is extensive.',
      'You\'re also taking the credit risk on the future payment.',
      'Often forces continued employment, which may not be what you want.',
    ],
    professionals: [
      'Tax adviser and corporate solicitor — co-ordinated. The legal drafting and the tax view must agree.',
    ],
    worthReading: [
      'HMRC ERSM110000 onwards on earn-outs and securities options.',
      'Ask: does the earn-out vest if I leave the business? Are the payments structured as additional consideration or as employment?',
    ],
    hasSimulator: true,
  },
  {
    id: 'pre-sale-restructuring',
    subsection: 'sale-exit',
    title: 'Pre-sale restructuring',
    summary:
      'Two to three years before sale, clean up: share structure, personal assets on the balance sheet, non-trading activities, director\'s loans. Each issue left in place is a discount or a relief loss.',
    body: () => (
      <>
        <p>
          A clean pre-sale balance sheet is worth real money. Buyers price in
          uncertainty as a discount; HMRC denies reliefs where structure
          isn\'t in shape. The standard pre-sale checklist:
        </p>
        <ul>
          <li>
            <strong>Share structure.</strong> Single class of ordinary shares
            is cleanest. Multiple classes (growth, deferred, alphabet) need
            careful pre-sale rationalisation. Significant changes within 2
            years of sale risk <Abbr k="badr" />.
          </li>
          <li>
            <strong>Personal assets on the balance sheet.</strong> Founder\'s
            car, holiday home, hobby kit — all should be off before due
            diligence starts. Buyers don\'t want them and they create awkward
            BiK and director\'s-loan questions.
          </li>
          <li>
            <strong>Non-trading activities.</strong> Significant cash piles,
            investment portfolios, rental property — anything that erodes the
            "trading" character of the company can lose BADR or BPR. Move
            them up to a holdco well in advance.
          </li>
          <li>
            <strong>Director\'s loans.</strong> Clear all balances. An
            outstanding DLA at sale is a deal-friction point and a tax
            problem.
          </li>
          <li>
            <strong>Group relief and inter-co positions.</strong> Tidy up.
            Buyers will redo the group anyway, and any messy intercompany
            balances become disclosure issues.
          </li>
        </ul>
      </>
    ),
    principle:
      'Structure and substance: BADR, BPR, and a clean buyer experience all reward continuity and tidy paperwork. Last-minute changes to optimise tax can backfire — both on relief eligibility and on buyer trust.',
    whenApplies: [
      'You expect to sell within 1–3 years.',
      'Your company has accumulated complexity over time.',
    ],
    whenDoesNot: [
      'Sale is more than 3 years away — useful but not urgent.',
      'The "complexity" is genuine business diversification — restructuring it might harm the business.',
    ],
    pros: [
      'Higher headline price (cleaner accounts attract better offers).',
      'Lower DD friction, faster close.',
      'Preserves BADR / BPR.',
    ],
    cons: [
      'Costs in adviser fees up front.',
      'Some restructuring (e.g. sweeping cash to a holdco) takes 1–2 years to bed in.',
    ],
    professionals: [
      'Tax adviser — relief checks and pre-sale structuring.',
      'Corporate solicitor — share-class and articles tidy.',
      'Accountant — accounts and DD-readiness.',
    ],
    worthReading: [
      'Pre-sale tax memorandum — get one from your tax adviser 18+ months before any sale process.',
    ],
  },
];

// =====================================================================
// INCOME CLASSIFICATION
// =====================================================================

const classificationStrategies: Strategy[] = [
  {
    id: 'equity-vs-cash',
    subsection: 'income-classification',
    title: 'Equity vs. cash compensation in your own company',
    summary:
      'Taking growth equity instead of higher salary builds wealth at lower combined tax rates and at lower CGT on eventual sale. The trade-off is cashflow today and tax-on-vest issues if not structured carefully.',
    body: () => (
      <>
        <p>
          For founders and senior employees with skin in the game, the
          composition of compensation matters as much as the amount. £100,000
          of salary is taxed at up to 47% combined (45% IT + 2% NI for
          additional-rate); £100,000 of growth in the value of your shares is
          taxed at up to 24% CGT on sale, or 18% with <Abbr k="badr" />.
        </p>
        <p>
          For the founder of a private Ltd, this is automatic — your
          ownership stake grows with the business value. For senior
          employees, formal arrangements (growth shares, EMI options, hurdle
          shares) can give equity-style upside without immediate income tax.
        </p>
        <p>
          The trap is "tax on vest": if you receive valuable equity that
          isn\'t a properly-structured option, HMRC can tax the value at vest
          as employment income — at 47% — even though no cash has changed
          hands.
        </p>
      </>
    ),
    principle:
      'Classification pattern. The same economic reward — sharing in business growth — can be taxed at 47% (cash bonus + NI) or 18% (BADR-eligible capital gain), depending on the legal form of the reward.',
    whenApplies: [
      'You\'re a founder or early hire with meaningful upside in the business.',
      'You can afford the lower cash compensation in exchange for equity.',
      'You\'re willing to set up properly-structured equity arrangements (EMI, growth shares).',
    ],
    whenDoesNot: [
      'You need the cash now — equity doesn\'t pay your mortgage.',
      'The business value isn\'t expected to grow significantly — equity\'s only valuable if it appreciates.',
      'The structure isn\'t set up properly — informal equity grants can collapse into immediate income.',
    ],
    pros: [
      'Lower combined tax rate over the life of the holding.',
      'Aligns long-term incentives with the business.',
      'BADR-eligible on eventual sale (subject to conditions).',
    ],
    cons: [
      'Cashflow trade-off today.',
      'Illiquid until a liquidity event.',
      'Failed structure = immediate income tax + NI on the value at vest.',
    ],
    professionals: [
      'Tax adviser for the structure (EMI, growth shares, hurdle shares).',
      'Solicitor for the share-class drafting and shareholder agreements.',
      'Independent valuation for the unrestricted-market-value calculation at grant.',
    ],
    worthReading: [
      'HMRC Employment Related Securities Manual.',
      'Ask: should this employee receive EMI options, growth shares, or both? What\'s the unrestricted market value at grant?',
    ],
    hasSimulator: true,
  },
  {
    id: 'capital-vs-income',
    subsection: 'income-classification',
    title: 'Capital vs. income classification',
    summary:
      'Some transactions can land as either capital gains (lower rates) or trading income (higher rates) depending on substance. The "badges of trade" tests determine which. HMRC recharacterises aggressively where the structure looks contrived.',
    body: () => (
      <>
        <p>
          The capital/income distinction matters because the rates differ
          dramatically — capital gains at 18–24%, trading income at up to
          47%. HMRC applies the "badges of trade" tests to determine which:
        </p>
        <ul>
          <li>Subject matter (was the asset bought for trading or investment?).</li>
          <li>Frequency of similar transactions.</li>
          <li>Length of ownership.</li>
          <li>Modifications to make it more saleable.</li>
          <li>Reason for sale.</li>
          <li>Motive — was profit the explicit goal?</li>
        </ul>
        <p>
          Concrete cases this matters in: property flips (HMRC often
          recharacterises serial flippers as traders), short-term equity
          trading, crypto trading at scale, and "investment" companies that
          look like dealers.
        </p>
        <p>
          The structural choices that affect the answer: long holding
          periods, low frequency, no modifications-for-sale, clearly
          documented investment intent at the time of purchase.
        </p>
      </>
    ),
    principle:
      'Classification + substance. The label isn\'t self-applied — HMRC looks at how you actually behaved, not what you wrote on the tin.',
    whenApplies: [
      'You\'re buying and selling appreciable assets at a frequency where the answer isn\'t obvious.',
      'The amounts are large enough that the rate difference matters.',
    ],
    whenDoesNot: [
      'Pure investment (long-hold, no modifications) — answer is clearly capital.',
      'Frequent professional trading — answer is clearly income.',
    ],
    pros: [
      'When genuinely capital, lower rate plus annual exemption + reliefs.',
    ],
    cons: [
      'Recharacterisation risk if the substance doesn\'t match the form.',
      'Penalties on top of the rate difference if challenged successfully.',
    ],
    professionals: [
      'Tax adviser — to assess the badges of trade against your actual behaviour.',
      'Solicitor for documentation of intent at the time of purchase.',
    ],
    worthReading: [
      'HMRC BIM20000 series on the badges of trade.',
      'Ask: how would my pattern of buying and selling look to an HMRC inspector? Could I document it as investment?',
    ],
    hasSimulator: true,
  },
  {
    id: 'ir35-aware',
    subsection: 'income-classification',
    title: 'IR35-aware contractor arrangements',
    summary:
      'For genuine contractors and the businesses hiring them. Stay outside IR35 by being genuinely independent — multiple clients, real risk, your own kit, real substitution rights. Inside IR35 wipes most of the tax advantage of operating through a Ltd.',
    body: () => (
      <>
        <p>
          <Abbr k="ir35" /> is the off-payroll-working framework. If your
          contracting reality looks like employment of the client (one
          client, you\'re part of their team, they direct your work, mutual
          obligation to provide and accept work), HMRC treats the income as
          if you were an employee — wiping out most of the tax advantage of
          operating through a <Abbr k="psc" />.
        </p>
        <p>
          The three classic tests:
        </p>
        <ul>
          <li>
            <strong>Personal service.</strong> Must you do the work yourself,
            or can you genuinely send a substitute?
          </li>
          <li>
            <strong>Control.</strong> Does the client direct what, when,
            where, and how you work?
          </li>
          <li>
            <strong><Abbr k="moo" />.</strong> Is the client obliged to give
            you ongoing work and you obliged to take it?
          </li>
        </ul>
        <p>
          For medium and large clients, IR35 status determination is the
          client\'s responsibility. They must issue a written{' '}
          <Abbr k="sds" />. For small clients the contractor\'s PSC determines
          status. Either way, if status is "inside," income tax and NI apply
          as if employed.
        </p>
        <p>
          The defence is genuine independence: multiple clients, real risk
          of loss, freedom to substitute (and ideally evidence of having
          actually substituted at least once), your own equipment, your own
          marketing.
        </p>
      </>
    ),
    principle:
      'Substance pattern. Rules look through the legal form (the PSC) to the economic reality of the engagement. Calling something a contract doesn\'t make it one.',
    whenApplies: [
      'You contract for multiple clients, with genuine independence in how, when, and where you work.',
      'Your contracts have real substitution clauses you could exercise.',
    ],
    whenDoesNot: [
      'You have effectively one client you sit alongside as if employed.',
      'You\'ve been at the same client on rolling renewals for years with no other engagements.',
      'The client controls hours, location, and methodology.',
    ],
    pros: [
      'Outside IR35: typical PSC tax efficiency available.',
      'Limited liability stays useful regardless.',
      'Operational flexibility (multiple clients, varying engagements).',
    ],
    cons: [
      'Inside IR35: most of the tax saving disappears, plus the PSC overhead remains.',
      'Status disputes are exhausting and expensive.',
      'HMRC has won the majority of high-profile recent cases.',
    ],
    professionals: [
      'IR35 specialist for contract reviews and SDS challenges.',
      'Accountant for the day-to-day PSC running.',
    ],
    mistakes: [
      {
        id: 'single-client-psc',
        title: 'PSC with one embedded client',
        body:
          'A contractor invoices through their Ltd for a single client they sit alongside as if employed — same hours, same desk, same projects. After three years, HMRC challenges and reclassifies the engagement as inside IR35. The contractor owes back PAYE and NI of roughly £25,000–£40,000, plus penalties. The fix: build genuine multi-client independence early, document it, and re-evaluate annually.',
      },
    ],
    worthReading: [
      'HMRC ESM (Employment Status Manual).',
      'CEST (Check Employment Status for Tax) — HMRC\'s online tool. Useful as a sanity check, not a definitive answer.',
    ],
    hasSimulator: true,
  },
  {
    id: 'royalty-ip-licensing',
    subsection: 'income-classification',
    title: 'Royalty and IP-licensing structures',
    summary:
      'Separating valuable IP into a holding entity that licenses it to the trading entity can be legitimate (genuinely valuable IP, multi-jurisdiction operations) or bureaucratic theatre that HMRC will challenge. Substance is the line.',
    body: () => (
      <>
        <p>
          The pattern: a holding company owns the company\'s genuinely
          valuable intellectual property — software, brand, patents — and
          licenses it to the trading company in exchange for a royalty. The
          royalty is deductible in the trading company and taxable in the
          holding company. Done across borders, the structure can be a
          legitimate way to allocate profit to where the IP was developed.
        </p>
        <p>
          Where it works: genuinely valuable, separately-developable IP;
          real R&D in a separate entity that owns the IP; multi-
          jurisdictional operations where the IP company is in a sensible
          jurisdiction with substance.
        </p>
        <p>
          Where it doesn\'t: domestic structures where the same one or two
          founders own both companies, the "IP" is just the trading
          activity, the royalty is calibrated to maximise tax savings rather
          than reflect commercial reality. HMRC challenges these under
          transfer-pricing rules, the diverted profits tax, and{' '}
          <Abbr k="cfc" /> rules where offshore.
        </p>
      </>
    ),
    principle:
      'Structure + substance. Done properly, this aligns tax with where economic value is genuinely created. Done badly, it\'s just relabelling profits, which transfer-pricing and anti-avoidance rules will reverse.',
    whenApplies: [
      'You have genuinely valuable, separately-identifiable IP.',
      'You have real multi-jurisdictional operations or genuinely separate development.',
      'You can document arm\'s-length pricing and underlying substance.',
    ],
    whenDoesNot: [
      'Single-company small business where the "IP" is the business itself.',
      'Offshore IP company with no substance — paper-only structures get unwound.',
    ],
    pros: [
      'Legitimately allocates profit where IP was developed.',
      'Genuine cross-border efficiency where operations span jurisdictions.',
    ],
    cons: [
      'Transfer-pricing studies, ongoing compliance, substance requirements — all costly.',
      'HMRC has wide tools (DPT, CFC, GAAR) to challenge weak structures.',
      'Reputation risk and disclosure (DAC6) considerations.',
    ],
    professionals: [
      'International tax specialist — non-negotiable.',
      'Transfer-pricing economist for the arm\'s-length royalty analysis.',
      'Specialist solicitor for the IP assignment and licence drafting.',
    ],
    worthReading: [
      'OECD Transfer Pricing Guidelines.',
      'HMRC International Manual on transfer pricing and DPT.',
    ],
  },
];

// =====================================================================
// MULTI-ENTITY & GROUP
// =====================================================================

const multiEntityStrategies: Strategy[] = [
  {
    id: 'group-foundational',
    subsection: 'multi-entity',
    title: 'Holding company + trading subsidiary',
    summary:
      'The foundational group structure. Holdco owns 100% of one or more trading subs. Cash sweeps up tax-free between UK group companies; trading risk is isolated; the structure pays for its overhead once you have meaningful retained cash or more than one business line.',
    body: () => (
      <>
        <p>
          Covered in detail in the Wealth Preservation section as well, this
          strategy belongs here too because it\'s the foundation of every
          multi-entity arrangement.
        </p>
        <p>
          The mechanics in brief: the holdco does no trading. It owns 100%
          of the trading sub(s). Post-CT cash from the sub can be dividended
          up to the holdco without further <Abbr k="ct" />. The holdco can
          then reinvest it, lend it to a new sub, or hold it for future
          extraction — insulated from operational risk in the trading sub.
        </p>
        <p>
          The threshold for "is it worth it?": single trading Ltds without
          surplus cash generally don\'t earn the group complexity. Once you
          have £200k+ of non-operational cash sitting in the trading sub, or
          two or more trading lines, the conversation is real.
        </p>
      </>
    ),
    principle:
      'Structure pattern. The same trading activities, repackaged through stacked entities, get different risk treatment and different cash-allocation efficiency.',
    whenApplies: [
      '£200k+ non-operational cash in a trading Ltd.',
      'Multiple trading lines you want to isolate.',
      'Pre-sale planning (preserves trading status for BADR / BPR).',
    ],
    whenDoesNot: [
      'Single small trading Ltd with no surplus cash — overhead-only outcome.',
      'You can\'t accept the extra accounts and admin.',
    ],
    pros: [
      'Risk isolation, tax-free intercompany dividends, cleaner exit, group relief.',
    ],
    cons: [
      'Two sets of accounts, associated-company rules tighten CT bands, substance requirements.',
    ],
    professionals: [
      'Tax adviser for the share-for-share insertion.',
      'Solicitor for articles and intercompany agreements.',
    ],
    worthReading: [
      'See the Holding section in Structures for the full mechanics.',
    ],
  },
  {
    id: 'group-relief',
    subsection: 'multi-entity',
    title: 'Group relief for losses',
    summary:
      'A trading loss in one group company can offset a trading profit in another, subject to rules. This is why some founders intentionally consolidate — and why some intentionally don\'t.',
    body: () => (
      <>
        <p>
          UK group relief lets a trading loss in one company in a 75%-owned
          group be surrendered to a profit-making member of the same group,
          reducing that member\'s <Abbr k="ct" /> bill in the same accounting
          period.
        </p>
        <p>
          What "75% group" means: the parent must beneficially own 75% of
          the ordinary share capital of the subsidiary, with rights to 75%
          of the available distributable profit and 75% of the net assets on
          a winding up.
        </p>
        <p>
          When this changes structural decisions: a group with a profitable
          mature business and a loss-making new venture can immediately
          monetise the new venture\'s losses against the mature business\'s
          profits. Without the group, the new venture\'s losses would only
          shelter its own future profits — possibly years away.
        </p>
      </>
    ),
    principle:
      'Relief pattern with a structure prerequisite. The relief is deliberate — it prevents the group as a whole being worse off than a single company with both activities — but accessing it requires the right shareholding shape.',
    whenApplies: [
      'You have one profitable Ltd and one loss-making Ltd both 75%-controlled by the same parent.',
      'The losses are current-year trading losses that would otherwise carry forward.',
    ],
    whenDoesNot: [
      'The companies aren\'t in the same 75% group.',
      'The losses are non-trading or capital — different rules.',
      'Anti-avoidance rules (e.g. arrangements to bring the loss-maker into the group) apply.',
    ],
    pros: [
      'Immediate tax relief on losses that would otherwise carry forward for years.',
      'Reduces group-wide effective tax rate.',
    ],
    cons: [
      '75% group test must hold; ownership changes can break it.',
      'Anti-avoidance for "buying losses" via group entry.',
    ],
    professionals: [
      'Accountant — for the formal group-relief claim.',
      'Tax adviser — for the structure check.',
    ],
    worthReading: [
      'HMRC CTM80000 series on group relief.',
    ],
    hasSimulator: true,
  },
  {
    id: 'inter-co-charges',
    subsection: 'multi-entity',
    title: 'Inter-company charges and management fees',
    summary:
      'A holdco charging trading subs for services it genuinely provides (group HR, finance, IT, IP licence) is legitimate and sometimes useful. Charging for nothing — or at non-arm\'s-length rates — gets challenged.',
    body: () => (
      <>
        <p>
          Where the holdco genuinely provides services to its trading subs —
          shared finance team, HR, IT, an IP licence — it can charge for
          those services. The charge is deductible in the sub and taxable in
          the holdco, allowing some legitimate routing of profit.
        </p>
        <p>
          The constraints HMRC enforces:
        </p>
        <ul>
          <li>The services must genuinely be provided.</li>
          <li>The charge must reflect arm\'s-length pricing — what an unrelated company would charge for the same service.</li>
          <li>Documentation: service-level agreements, invoices, evidence of actual delivery.</li>
        </ul>
        <p>
          Where this works: groups with a genuine central services function.
          Where it doesn\'t: paper management fees calibrated to extract
          profit without underlying substance.
        </p>
      </>
    ),
    principle:
      'Substance + classification. Genuine services → deductible expense + matching income. Paper-only charges → recharacterised, with penalties.',
    whenApplies: [
      'The holdco genuinely provides services to subs.',
      'You can document arm\'s-length pricing.',
    ],
    whenDoesNot: [
      'No genuine service is being provided.',
      'The fee is calibrated to tax outcomes rather than service economics.',
    ],
    pros: [
      'Recognises genuine economic substance.',
      'Smooths group-wide effective tax rate.',
    ],
    cons: [
      'Documentation overhead.',
      'Audit/HMRC focus area — must be defensible.',
      'Cross-border versions hit transfer-pricing rules.',
    ],
    professionals: [
      'Accountant — for the SLA and pricing.',
      'Tax adviser if cross-border.',
    ],
    worthReading: [
      'HMRC International Manual — transfer pricing principles even apply between UK group members in some respects.',
    ],
    hasSimulator: true,
  },
  {
    id: 'ringfencing-risk',
    subsection: 'multi-entity',
    title: 'Ringfencing risk via subsidiaries',
    summary:
      'Each business line in its own subsidiary contains its risk to that subsidiary. Useful when activities differ in risk profile or when you might want to sell or wind up one without the others. Not useful when it\'s just complexity for its own sake.',
    body: () => (
      <>
        <p>
          Companies have separate legal personality. A claim against one
          subsidiary doesn\'t automatically reach assets in another. So
          putting distinct activities in separate subsidiaries — each
          undercapitalised relative to the group as a whole — limits the
          group\'s exposure to a bad outcome in any one of them.
        </p>
        <p>
          The classic founder application: a trading sub with employees,
          customers, and operational risk; an IP sub holding the genuinely
          valuable assets and licensing them in; a property sub holding the
          office. A claim against the trading sub can\'t reach the IP or the
          property.
        </p>
        <p>
          Limits on this: directors can be personally liable for some
          conduct (wrongful trading, fraud); group structures with no
          substance can be challenged via "piercing the veil"; cross-
          guarantees between group companies vitiate the protection.
        </p>
      </>
    ),
    principle:
      'Structure pattern as risk management. Limited liability is legal-system-given; using it across multiple entities multiplies the protection — provided each entity has genuine substance and isn\'t an alter ego.',
    whenApplies: [
      'Genuinely high-risk operations (claims, contract risk).',
      'Distinct business lines with different risk profiles.',
      'Plans to sell one line without the others.',
    ],
    whenDoesNot: [
      'Single small business where the activities are interconnected.',
      'Activities so connected that creditor courts would treat the group as one.',
      'Cost of running multiple entities exceeds the benefit.',
    ],
    pros: [
      'Real protection of assets in non-trading subs.',
      'Optionality on sale of individual lines.',
    ],
    cons: [
      'Multiple sets of accounts.',
      'Substance must be real — sham subsidiaries don\'t protect.',
      'Cross-guarantees (often required by lenders) reduce the protection.',
    ],
    professionals: [
      'Solicitor — for the legal structure and any cross-guarantee analysis.',
      'Accountant — for the multiple-entity accounts.',
    ],
    worthReading: [
      'Ask: are the subsidiaries genuinely separate operations, or one business in three boxes?',
    ],
  },
];

// =====================================================================
// LONG-TERM WEALTH
// =====================================================================

const longTermStrategies: Strategy[] = [
  {
    id: 'iht-business-relief',
    subsection: 'long-term',
    title: 'Inheritance Tax planning through Business Relief',
    summary:
      'Qualifying business assets pass IHT-free after two years of ownership. Until April 2026, this is uncapped at 100% relief; after that, capped at £1m per individual with the excess at 50% relief. Plan around the new cap, not the old one.',
    body: () => (
      <>
        <p>
          <Abbr k="bpr" /> exempts qualifying business assets from{' '}
          <Abbr k="iht" /> after a 2-year holding period. The qualifying
          categories include unquoted trading-company shares, an interest in
          a trading partnership, and a subset of <Abbr k="aim" />-listed
          shares.
        </p>
        <p>
          The headline rule until April 2026: 100% relief — IHT-free. From
          April 2026 onwards (subject to legislation): the first £1m per
          individual gets 100%, the excess gets 50%. So a trading-business
          shareholder with a £5m company stake at death would have:
        </p>
        <ul>
          <li>£1m at 100% relief = £0 IHT on that slice.</li>
          <li>£4m at 50% relief = £4m × 50% × 40% = £800,000 IHT.</li>
        </ul>
        <p>
          Compared to no relief at all (£5m × 40% = £2m IHT), the reduced
          relief is still meaningful — but a far cry from the prior
          uncapped 100%.
        </p>
        <p>
          Planning angles for the post-2026 world: spreading ownership
          across spouses (each gets the £1m cap), structuring to keep
          businesses qualifying, gifting earlier (the 7-year rule still
          applies and can take value out of the estate entirely), and
          considering whether a trust or FIC fits better for very large
          estates.
        </p>
      </>
    ),
    principle:
      'Relief pattern with new caps. Ownership of productive business assets is favoured, but recent budget changes signal a tightening — strategies have to model the new rules.',
    whenApplies: [
      'You hold qualifying business assets and have an estate above the IHT bands.',
      'You can hold the assets for at least 2 years to qualify.',
    ],
    whenDoesNot: [
      'Estate below the nil-rate bands — no IHT to plan around.',
      'Assets are non-qualifying (e.g. predominantly investment companies).',
      'You\'re assuming pre-2026 100% relief — re-model.',
    ],
    pros: [
      'Substantial IHT saving even after the cap.',
      'Compatible with continued business ownership.',
    ],
    cons: [
      'Political risk — rules continue to evolve.',
      'Qualifying status can be lost (excess cash, ceasing to trade).',
      '2-year holding period before relief vests.',
    ],
    professionals: [
      'STEP-qualified estate-planning solicitor.',
      'Specialist tax adviser on BPR qualification.',
    ],
    worthReading: [
      'HMRC IHT Manual on BPR.',
      'Autumn 2024 Budget — BPR / APR cap technical consultation.',
    ],
    hasSimulator: true,
  },
  {
    id: 'gifting-7-year',
    subsection: 'long-term',
    title: 'Lifetime gifting and the 7-year rule',
    summary:
      'Gifts out of your estate become IHT-free after 7 years. Gifts within years 3–7 attract tapered relief. The £3,000 annual exemption and the gifts-from-income exemption stack on top.',
    body: () => (
      <>
        <p>
          A gift to an individual is a "potentially exempt transfer" — fully
          IHT-exempt if the donor survives 7 years. Survive 3 to 7 years
          and a tapered relief reduces the IHT on the gift\'s value. Die
          within 3 years and the gift is treated as if you still owned it
          (with limited reliefs).
        </p>
        <p>
          On top of the 7-year rule, several smaller exemptions:
        </p>
        <ul>
          <li>
            <strong>£3,000 annual exemption.</strong> Per donor, can be
            carried forward one year.
          </li>
          <li>
            <strong>Small gifts up to £250.</strong> Per recipient, unlimited
            recipients.
          </li>
          <li>
            <strong>Wedding gifts.</strong> £5,000 to a child, £2,500 to a
            grandchild, £1,000 to others, free of IHT.
          </li>
          <li>
            <strong>Normal-expenditure-out-of-income exemption.</strong>{' '}
            Regular gifts from surplus income (e.g. paying a child\'s rent
            from your salary every month) are immediately IHT-exempt — this
            is one of the most underused exemptions.
          </li>
        </ul>
      </>
    ),
    principle:
      'Threshold + relief pattern. The 7-year rule incentivises lifetime giving; the tapered relief in years 3–7 prevents a deathbed-gift cliff edge.',
    whenApplies: [
      'You have estate value above the IHT bands.',
      'You\'re willing to give meaningful sums during your lifetime.',
      'You\'re reasonably likely to survive 7 years (the strategy gets weaker the closer you are to expected death).',
    ],
    whenDoesNot: [
      'You can\'t afford to give the cash (this is real cash leaving you).',
      'You\'re close to expected death — short-term gifts come back in.',
      'The recipient\'s situation makes gifts inappropriate (e.g. divorce risk).',
    ],
    pros: [
      'Full IHT exemption after 7 years on PETs.',
      'Stackable exemptions (annual, small-gift, wedding, normal-income).',
      'Brings value out of estate at current values, before further appreciation.',
    ],
    cons: [
      '7-year window — death within is a tax problem.',
      'Loss of access to the gifted asset.',
      'Recipient\'s divorce / bankruptcy can lose the asset to claimants.',
    ],
    professionals: [
      'Estate-planning solicitor.',
      'Accountant for documenting normal-expenditure gifts (the exemption requires evidence of a pattern).',
    ],
    worthReading: [
      'HMRC IHT Manual on PETs and exempt transfers.',
      'Ask: are there regular payments I make that could qualify under the gifts-out-of-income exemption with proper documentation?',
    ],
    hasSimulator: true,
  },
  {
    id: 'trust-strategy',
    subsection: 'long-term',
    title: 'Trust structures',
    summary:
      'Trusts separate legal ownership (trustees) from benefit (beneficiaries). Useful for control, asset protection, and specific multi-generational use cases. Tax treatment is intricate and the rules change — specialist advice is non-negotiable.',
    body: () => (
      <>
        <p>
          A trust holds an asset for the benefit of someone other than its
          legal owner. Three roles: settlor (puts the asset in), trustee
          (legal owner with fiduciary duty), beneficiary (entitled to the
          benefit). The trust deed sets out the rules.
        </p>
        <p>
          Main UK types:
        </p>
        <ul>
          <li><strong>Bare trust:</strong> beneficiary is absolutely entitled. Tax-transparent. Common for assets held for minor children.</li>
          <li><strong>Interest-in-possession:</strong> one beneficiary has a right to income; another may inherit capital later.</li>
          <li><strong>Discretionary:</strong> trustees have wide discretion over which beneficiaries get paid, when, and how much. Most flexible but most heavily taxed.</li>
        </ul>
        <p>
          Post-2006 rules brought most discretionary and many interest-in-
          possession trusts under the relevant-property regime: 20% IHT entry
          charge above the nil-rate band, 10-year periodic charges of up to
          6%, exit charges. For most new wealth this changed the calculus —
          FICs or lifetime gifting plus the 7-year rule are often more
          efficient.
        </p>
        <p>
          Where trusts still earn their place: asset protection from
          divorce/bankruptcy/creditors, vulnerable beneficiaries, multi-
          generation control where the settlor wants distribution rules
          enforced after death.
        </p>
      </>
    ),
    principle:
      'Structure pattern at maximum complexity. Trusts originally a tax-efficiency tool; post-2006 mostly a control + protection tool with tax cost.',
    whenApplies: [
      'Asset protection (divorce, creditor) is a primary goal.',
      'Vulnerable or minor beneficiaries.',
      'Multi-generational control beyond the settlor\'s death.',
    ],
    whenDoesNot: [
      'Pure tax efficiency on new wealth — usually FIC or gifting beats it post-2006.',
      'Settlor wants flexibility to access the asset (gifts to a trust are usually one-way).',
      'No specialist adviser involved — DIY trusts fail expensively.',
    ],
    pros: [
      'Asset protection from claimants.',
      'Multi-generation control.',
      'Specific reliefs for vulnerable-beneficiary trusts.',
    ],
    cons: [
      '20% entry charge + 10-year periodic charges on relevant-property trusts.',
      'Highly intricate rules; getting any aspect wrong is expensive.',
      'Reduced flexibility — trust assets aren\'t the settlor\'s any more.',
    ],
    professionals: [
      'STEP-qualified solicitor — non-negotiable.',
      'Specialist tax adviser for the entry / periodic / exit charge analysis.',
      'Independent trustee firm for ongoing administration.',
    ],
    worthReading: [
      'STEP — Society of Trust and Estate Practitioners — for adviser directory and primers.',
      'HMRC IHT Manual on relevant-property trusts.',
    ],
  },
  {
    id: 'residency-domicile',
    subsection: 'long-term',
    title: 'Geographic strategies — residency and domicile',
    summary:
      'Genuinely relocating to a lower-tax jurisdiction works. Pretending to relocate while keeping UK ties does not. The UK Statutory Residence Test plus the recently-overhauled non-dom regime are unforgiving — and a real life elsewhere has costs beyond tax.',
    body: () => (
      <>
        <p>
          Residency is determined by the <Abbr k="srt" /> — a multi-step test
          involving days in the UK, ties (family, accommodation, work),
          recent residency history, and overseas connections. Domicile (where
          you have your permanent home for legal purposes) is separate and
          historically harder to change.
        </p>
        <p>
          What works:
        </p>
        <ul>
          <li>
            <strong>Genuine relocation.</strong> Move your home, your
            family, your real day-to-day life to a lower-tax jurisdiction.
            Break UK ties (no UK home, minimal UK days). The tax outcome
            follows the substance.
          </li>
          <li>
            <strong>Long-term commitment.</strong> Most regimes (Portugal\'s
            former NHR, Italy\'s flat-tax, UAE) reward genuinely settled
            residency — short stays don\'t qualify or don\'t hold up.
          </li>
        </ul>
        <p>
          What doesn\'t:
        </p>
        <ul>
          <li>
            <strong>"Day-counting" with UK life intact.</strong> Spending 90
            days in the UK while keeping a UK home, family, and clients
            often fails the SRT despite the day count.
          </li>
          <li>
            <strong>Assuming the non-dom regime is still what it was.</strong>{' '}
            From April 2025 the UK non-dom rules are replaced with a
            residence-based regime. The familiar "remittance basis" is gone
            for new arrivers; transitional rules apply for existing non-doms.
            Any plan built on the old rules needs revisiting.
          </li>
          <li>
            <strong>Underestimating the personal cost.</strong> Living
            somewhere genuinely (school for children, relationships, climate,
            culture) is the actual decision. Tax savings rarely justify a
            move you wouldn\'t otherwise make.
          </li>
        </ul>
      </>
    ),
    principle:
      'Residency pattern. Most countries tax their residents on worldwide income; non-residents on local-source only. Crossing borders changes the answer — but only if you genuinely cross.',
    whenApplies: [
      'You\'re willing to genuinely live elsewhere (the actual life, not just the tax address).',
      'You can break UK ties cleanly (no main home, minimal days, no significant UK work).',
      'The destination jurisdiction is stable and welcoming long-term.',
    ],
    whenDoesNot: [
      'You want to keep your UK base, family, and clients while claiming non-residency.',
      'You expect to return within a few years — short trips abroad are sometimes recharacterised.',
      'The destination\'s rules are about to tighten or change.',
    ],
    pros: [
      'Done genuinely, can be a complete change of tax footprint.',
      'Some destinations have specific incentive regimes for new residents.',
    ],
    cons: [
      'Personal-life cost is the dominant cost.',
      'SRT and the new residence-based regime are strict and getting stricter.',
      'Future return to the UK can trigger temporary-non-residence anti-avoidance.',
      'Many "low-tax" jurisdictions have hidden costs (cost of living, healthcare, education).',
    ],
    professionals: [
      'UK tax adviser — for the SRT and exit-tax analysis.',
      'Local tax adviser in the destination — non-negotiable.',
      'Solicitor for any UK property / estate matters.',
    ],
    worthReading: [
      'HMRC RDR3 — Statutory Residence Test guidance.',
      'Spring 2024 Budget and subsequent Finance Bill — replacement of the non-dom regime.',
    ],
  },
];

// =====================================================================
// MISUNDERSTOOD STRATEGIES
// =====================================================================

const misunderstoodStrategies: Strategy[] = [
  {
    id: 'just-move-to-dubai',
    subsection: 'misunderstood',
    title: '"Just move to Dubai/Portugal/Cyprus/Monaco"',
    summary:
      'Genuinely moving to a lower-tax country and breaking UK ties works. Claiming residency abroad while keeping a UK life does not. The UK SRT and post-2025 residence regime are strict; the destination\'s rules also tighten regularly.',
    body: () => (
      <>
        <p>
          The marketed version: book a flight, get a tax residency
          certificate from a low-tax country, keep your London life, save
          50% on tax. The actual version: move your real life — home,
          family, day-to-day work, social and family ties — to the new
          country, break the UK ones cleanly, accept that you\'ll be living
          there genuinely for years.
        </p>
        <p>
          The UK\'s tools to challenge half-measures:
        </p>
        <ul>
          <li>
            The <Abbr k="srt" /> looks at days, ties (family, accommodation,
            work, 90-day tie), and overseas connections together.
          </li>
          <li>
            Temporary non-residence rules: leave the UK and return within 5
            years, and certain income / gains realised abroad in the
            interim are taxed on your return.
          </li>
          <li>
            From April 2025: the non-dom regime is replaced with a
            residence-based system. Foreign-income / gains protections are
            time-limited.
          </li>
        </ul>
        <p>
          The destinations\' tools: their own substance tests, minimum-stay
          requirements, and rule changes (Portugal\'s NHR ended in 2024;
          Cyprus has tightened; Monaco has stiff residency requirements).
        </p>
      </>
    ),
    principle:
      'Substance over form, applied internationally. Tax authorities care about where your life actually is, not just your post.',
    whenApplies: [
      'You\'re willing to make the genuine move.',
    ],
    whenDoesNot: [
      'You want to keep your UK base, family, and clients while not paying UK tax.',
      'You\'re assuming the non-dom rules still work as they used to — they don\'t.',
    ],
    pros: [
      'Done genuinely, transformative.',
    ],
    cons: [
      'Personal-life cost is real.',
      'Most short-cuts get challenged or recharacterised.',
    ],
    professionals: [
      'UK tax adviser + destination-country tax adviser, working together.',
    ],
    worthReading: [
      'HMRC RDR3 (SRT guidance), 2024 budget non-dom replacement materials.',
    ],
  },
  {
    id: 'offshore-companies',
    subsection: 'misunderstood',
    title: 'Offshore companies',
    summary:
      'Legitimate where genuine international operations have real substance abroad. Reckless when used to disguise UK-source income behind paper companies. CFC, transfer pricing, GAAR, and DPT all apply — HMRC enforces aggressively.',
    body: () => (
      <>
        <p>
          A company incorporated in a low-tax jurisdiction is not, by
          itself, a tax-avoidance device. Multinationals use offshore
          companies legitimately to manage genuine international operations
          — that\'s what the rules contemplate.
        </p>
        <p>
          What HMRC challenges, and wins:
        </p>
        <ul>
          <li>
            <strong>UK-resident companies dressed as offshore.</strong> A
            company is UK-tax-resident if its central management and
            control is in the UK — regardless of where it\'s incorporated.
            "I\'m in London running it on Zoom" makes the company UK-resident.
          </li>
          <li>
            <strong><Abbr k="cfc" /> rules.</strong> If a UK company controls
            a low-tax foreign subsidiary lacking commercial substance, the
            sub\'s profits are taxed in the UK as if earned here.
          </li>
          <li>
            <strong><Abbr k="dpt" />.</strong> Diverted profits tax penalises
            arrangements that artificially divert UK profits abroad.
          </li>
          <li>
            <strong>Transfer pricing.</strong> Inter-co charges between UK
            and offshore must be at arm\'s length.
          </li>
        </ul>
        <p>
          The honest test: would the offshore company exist if the tax
          benefit didn\'t? If yes (genuine local ops, local employees, local
          customers), the structure has substance. If no, it\'s likely to be
          unwound on challenge.
        </p>
      </>
    ),
    principle:
      'Substance pattern with extensive anti-avoidance toolkit. Offshore + paper-only = aggressively challenged. Offshore + genuine substance = legitimate cross-border arrangement.',
    whenApplies: [
      'Genuine international operations with real substance abroad.',
      'Multi-jurisdictional businesses where the offshore entity has employees, customers, decisions made there.',
    ],
    whenDoesNot: [
      'UK founder, UK customers, UK decisions, but a Cayman company on the books.',
      'Structure exists primarily to disguise UK-source income.',
    ],
    pros: [
      'For genuine cases, allocates profit to where economic activity is.',
    ],
    cons: [
      'Aggressive enforcement, broad rules (CFC, DPT, GAAR, transfer pricing).',
      'Reputational risk and beneficial-owner disclosure regimes.',
      'Failed structures unwind expensively.',
    ],
    professionals: [
      'International tax specialist with deep CFC / DPT experience.',
    ],
    worthReading: [
      'HMRC International Manual on residence, CFC, and DPT.',
    ],
  },
  {
    id: 'pay-yourself-in-crypto',
    subsection: 'misunderstood',
    title: '"Pay yourself in crypto"',
    summary:
      'The myth: crypto bypasses tax. The reality: HMRC treats crypto received as compensation as ordinary income at GBP value when received, with a separate CGT layer on disposal. There\'s no tax shelter — only extra documentation.',
    body: () => (
      <>
        <p>
          HMRC has been clear for years on the tax treatment of crypto:
        </p>
        <ul>
          <li>
            <strong>Receipt as employment / self-employment income.</strong>{' '}
            Taxed at the GBP value at the date of receipt. Same income tax
            and NI as if you\'d been paid in cash.
          </li>
          <li>
            <strong>Subsequent disposal.</strong> CGT applies to any change
            in GBP value between receipt and disposal — treated like any
            other asset.
          </li>
          <li>
            <strong>Mining / staking.</strong> Treated as income at GBP
            value at the date received; further CGT on disposal.
          </li>
          <li>
            <strong>Receipt by a UK Ltd.</strong> Same as any other revenue —
            taxed under CT, with the GBP-value translation at receipt.
          </li>
        </ul>
        <p>
          The added cost is documentation: every transaction needs a GBP
          valuation, every disposal needs a calculated gain or loss, and
          poor record-keeping turns into ugly tax surprises.
        </p>
      </>
    ),
    principle:
      'Substance pattern. Tax law applies to economic events — the medium of payment doesn\'t change the event.',
    whenApplies: [
      'Receiving crypto for work is something you genuinely want for non-tax reasons (e.g. payment from a crypto-native client).',
    ],
    whenDoesNot: [
      'You think crypto avoids tax. It doesn\'t.',
    ],
    pros: [
      'No tax advantage — but no tax penalty either, with proper records.',
    ],
    cons: [
      'Heavy documentation burden.',
      'Volatility means tax bills can become uncomfortable if you\'ve held and the price has dropped.',
      'Audit risk is higher — HMRC is actively looking at crypto holders.',
    ],
    professionals: [
      'Accountant comfortable with crypto records and the GBP-translation work.',
    ],
    worthReading: [
      'HMRC Cryptoassets Manual.',
    ],
    hasSimulator: true,
  },
  {
    id: 'buy-borrow-die',
    subsection: 'misunderstood',
    title: '"Buy, Borrow, Die" as marketed online',
    summary:
      'Real strategy for post-exit founders with listed assets. Marketed as a one-size-fits-all answer for everyone. The UK version differs from the US version on death, and the version that works for ordinary founders with unlisted shares is roughly nothing.',
    body: () => (
      <>
        <p>
          Covered in the Wealth Preservation section as a real strategy with
          conditions. This entry exists to push back on the social-media
          version — which omits all the conditions.
        </p>
        <p>
          Things you\'ll see online that are wrong or oversimplified:
        </p>
        <ul>
          <li>
            <em>"Borrow against your shares — never sell, never pay tax."</em>{' '}
            Works only against listed assets a bank will lend on. Doesn\'t
            work against unlisted company shares for almost any UK founder.
          </li>
          <li>
            <em>"Die holding the shares and your heirs pay nothing."</em>{' '}
            UK gives a CGT uplift on death (yes), but IHT may apply at 40%
            (the social-media version usually ignores this). The US version
            of the strategy works partly because the US has different
            CGT-on-death rules — copying the US version into a UK context
            misleads.
          </li>
          <li>
            <em>"Banks will lend against private company shares."</em>{' '}
            Almost none will, except in narrow corporate-finance contexts
            with strict conditions. The "alternatives" sold to founders to
            achieve this outcome (offshore loans, employee benefit trusts,
            related-party share pledges) are heavily targeted by HMRC and
            most have lost in court.
          </li>
        </ul>
      </>
    ),
    principle:
      'Substance + structure. The strategy reflects real economic mechanics, but UK-specific tax rules and lender behaviour change which version is workable.',
    whenApplies: [
      'You\'re post-liquidity-event with listed-asset wealth.',
      'You understand and can manage the leverage.',
    ],
    whenDoesNot: [
      'Your wealth is in unlisted company shares — no real version exists for you.',
      'You expect "no tax ever" — UK IHT will likely still apply on death.',
    ],
    pros: [
      'Real for the right founder profile.',
    ],
    cons: [
      'The "every founder" version online ignores the conditions that matter.',
    ],
    professionals: [
      'Wealth manager + tax adviser — see the Wealth Preservation entry.',
    ],
    worthReading: [
      'See the dedicated entry in Wealth Preservation for the working version.',
    ],
  },
  {
    id: 'aggressive-schemes',
    subsection: 'misunderstood',
    title: 'Aggressive avoidance schemes marketed to founders',
    summary:
      'Loan trusts, employee benefit trusts, contractor schemes, "remuneration trusts" — schemes promising dramatic tax reduction through clever structures. HMRC has won the major cases, the 2019 loan charge swept up users retrospectively, and people lost their houses. Walk away.',
    body: () => (
      <>
        <p>
          Over the past 15 years, several waves of aggressive tax-avoidance
          schemes have been marketed to founders, contractors, and
          high-earners. They share a pattern: a complex structure (often
          involving offshore trusts and loans), promised dramatic tax
          reduction (often paying 5–15% effective on income that would
          otherwise be 47%), and confident assurances that the structure has
          been "approved" or "QC-opined."
        </p>
        <p>
          What actually happened:
        </p>
        <ul>
          <li>
            HMRC has won the substantial majority of major test cases over
            the past decade (e.g. Rangers, Boyle, Murray Group).
          </li>
          <li>
            The 2019 loan charge applied retrospectively to participants in
            disguised-remuneration schemes — many faced demands for tax,
            interest, and penalties going back a decade. People lost houses.
          </li>
          <li>
            <Abbr k="dotas" /> registration and the <Abbr k="gaar" /> give
            HMRC tools to challenge schemes proactively.
          </li>
          <li>
            Promoters of failed schemes have variously been declared
            bankrupt, struck off, or absconded — leaving users to deal with
            HMRC alone.
          </li>
        </ul>
        <p>
          The honest signals that should make you walk away:
        </p>
        <ul>
          <li>The promised tax reduction is dramatic (50%+ better than mainstream alternatives).</li>
          <li>The structure involves offshore trusts and loans that "won\'t need to be repaid."</li>
          <li>The promoter cites a QC opinion you can\'t see.</li>
          <li>You\'re told there\'s "no risk because of how it\'s structured."</li>
          <li>The fee is contingent or a percentage of "tax saved."</li>
        </ul>
      </>
    ),
    principle:
      'Substance + GAAR. Structures whose only point is the tax outcome have decades of case law against them. The rules continue to tighten.',
    whenApplies: [
      'Never. There is no profile of founder for whom these schemes are a reasonable choice.',
    ],
    whenDoesNot: [
      'Always.',
    ],
    pros: [
      'None worth listing.',
    ],
    cons: [
      'Tax, interest, penalties on retrospective challenge.',
      'Personal financial ruin in the worst cases.',
      'Reputational and professional consequences.',
      'Promoters may not be there when HMRC arrives.',
    ],
    professionals: [
      'Walk away. If you\'ve already entered a scheme: an experienced tax-disputes solicitor, urgently.',
    ],
    worthReading: [
      'HMRC: Spotlight series — alerts on current schemes.',
      'Rangers, Murray Group, Boyle — the case law on disguised remuneration.',
      'The 2019 loan charge — what it covered and how it played out.',
    ],
  },
  {
    id: 'every-expense-myth',
    subsection: 'misunderstood',
    title: 'The "every expense is a business expense" myth',
    summary:
      'The "wholly and exclusively" test is real and enforced. Pushing personal spend through the company doesn\'t just risk the disallowance of that one expense — a single significant disallowance triggers broader audit scrutiny.',
    body: () => (
      <>
        <p>
          UK rules deduct an expense only if it\'s "wholly and exclusively
          for the purposes of the trade." Dual-purpose expenses (you\'d have
          spent the money anyway personally) usually fail. Personal expenses
          in business clothing don\'t become business expenses.
        </p>
        <p>
          Where founders most often go wrong:
        </p>
        <ul>
          <li><strong>"Business" travel that\'s a holiday with one meeting.</strong> Travel is allowed only where the predominant purpose is business.</li>
          <li><strong>Clothing.</strong> Professional clothing for general use is dual-purpose and disallowed (Mallalieu v Drummond is the leading case).</li>
          <li><strong>Client entertainment.</strong> Specifically disallowed for CT, regardless of how legitimate the client relationship is.</li>
          <li><strong>Mixing personal cards.</strong> Paying personal expenses from the business account, then "reconciling later" — creates messy DLA balances and audit-bait.</li>
        </ul>
        <p>
          The downstream effect of getting this wrong is the bigger risk. A
          single significant disallowed expense gives HMRC reason to look at
          everything else — and broader audit scrutiny rarely ends with the
          original item.
        </p>
      </>
    ),
    principle:
      'Substance + classification. Genuine business spend is deductible; dressing personal spend up isn\'t. Tax law is unromantic about the distinction.',
    whenApplies: [
      'Always — every founder has expenses to categorise.',
    ],
    whenDoesNot: [
      'Never; the rules apply to everyone.',
    ],
    pros: [
      'Done correctly, every legitimate deduction lowers tax — habits matter.',
    ],
    cons: [
      'Pushing the line invites audit; audits widen.',
    ],
    professionals: [
      'Accountant — for the categorisation and the tougher edge cases.',
    ],
    worthReading: [
      'HMRC BIM37000 — wholly and exclusively.',
      'Mallalieu v Drummond — classic clothing case.',
    ],
  },
];

// =====================================================================
// Aggregate
// =====================================================================

export const STRATEGIES: Strategy[] = [
  ...extractionStrategies,
  ...wealthStrategies,
  ...investmentStrategies,
  ...saleStrategies,
  ...classificationStrategies,
  ...multiEntityStrategies,
  ...longTermStrategies,
  ...misunderstoodStrategies,
];

export function getStrategiesBySubsection(id: StrategySubsectionId): Strategy[] {
  return STRATEGIES.filter((s) => s.subsection === id);
}

export function getStrategy(id: string): Strategy | undefined {
  return STRATEGIES.find((s) => s.id === id);
}

export function getSubsection(
  id: StrategySubsectionId,
): StrategySubsection | undefined {
  return STRATEGY_SUBSECTIONS.find((s) => s.id === id);
}
