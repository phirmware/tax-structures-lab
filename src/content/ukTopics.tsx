import { type ReactNode } from 'react';
import { G } from '../components/ui/Glossary';
import {
  CT_MAIN_RATE,
  CT_MAIN_THRESHOLD,
  CT_SMALL_PROFITS,
  CT_SMALL_RATE,
  DIVIDEND_ALLOWANCE,
  DIV_ADDITIONAL,
  DIV_BASIC,
  DIV_HIGHER,
  ISA_ALLOWANCE,
  LISA_ALLOWANCE,
  LISA_BONUS,
  PENSION_ANNUAL_ALLOWANCE,
  PERSONAL_ALLOWANCE,
  RATES_AS_OF,
  VAT_REGISTRATION_THRESHOLD,
} from '../lib/constants';
import { formatGBP, formatPct } from '../lib/format';

export interface UkTopic {
  id: string;
  title: string;
  pattern: string; // which universal pattern this implements
  summary: string;
  body: () => ReactNode;
}

export const UK_TOPICS: UkTopic[] = [
  {
    id: 'corporation-tax',
    title: 'Corporation tax',
    pattern: 'Retention pattern',
    summary: `Companies pay CT on profit. ${formatPct(CT_SMALL_RATE)} small-profits rate up to ${formatGBP(CT_SMALL_PROFITS)}, ${formatPct(CT_MAIN_RATE)} above ${formatGBP(CT_MAIN_THRESHOLD)}, marginal relief in between.`,
    body: () => (
      <>
        <h2>What it is</h2>
        <p>
          Corporation tax (CT) is the tax a UK company pays on its profits. From April 2023 the
          UK has had a tiered structure:
        </p>
        <ul>
          <li>
            Up to {formatGBP(CT_SMALL_PROFITS)} of profit — small-profits rate{' '}
            <strong>{formatPct(CT_SMALL_RATE)}</strong>
          </li>
          <li>
            From {formatGBP(CT_SMALL_PROFITS)} to {formatGBP(CT_MAIN_THRESHOLD)} —{' '}
            <em>marginal relief</em> band, effective rate climbs from{' '}
            {formatPct(CT_SMALL_RATE)} to {formatPct(CT_MAIN_RATE)}
          </li>
          <li>
            Above {formatGBP(CT_MAIN_THRESHOLD)} — main rate{' '}
            <strong>{formatPct(CT_MAIN_RATE)}</strong>
          </li>
        </ul>
        <p>
          The tiers exist because a single rate either favours large companies (low rate) or
          punishes small ones (high rate). Tiering tries to do both.
        </p>
        <h3>Why it has tiers (the universal pattern)</h3>
        <p>
          Any country with one corporate rate has to choose between two failure modes — too
          generous to large profitable companies, or too punitive to small ones. The UK's
          marginal-relief band is the standard answer: you ramp up across a transition zone
          rather than cliff-edging at a threshold.
        </p>
        <h3>Watch out for</h3>
        <ul>
          <li>
            <strong>Associated companies</strong> — having multiple companies under common
            control divides the thresholds, pushing each into the marginal rate sooner.
          </li>
          <li>
            <strong>Short accounting periods</strong> — proportion the thresholds, not the rate.
          </li>
          <li>
            <strong>Loan relationships and other special regimes</strong> — interest received on
            cash piles inside a non-trading company can have surprising tax treatment.
          </li>
        </ul>
        <h3>Questions to ask your accountant</h3>
        <ul>
          <li>Are any of my companies "associated" for CT threshold purposes?</li>
          <li>Are we capturing all eligible R&D / capital allowances before computing CT?</li>
          <li>If we sit in the marginal band, can we shift expenses or revenue to reduce it?</li>
        </ul>
      </>
    ),
  },
  {
    id: 'income-tax',
    title: 'Income tax & NI',
    pattern: 'Threshold + classification',
    summary: `Employment income is taxed at 20% / 40% / 45% above the personal allowance, plus NI of 8% / 2%.`,
    body: () => (
      <>
        <h2>What it is</h2>
        <p>
          Earned income (salary, self-employment profit) is taxed in stacked bands. For rest-of-UK
          residents:
        </p>
        <ul>
          <li>
            Personal allowance (0%): up to <strong>{formatGBP(PERSONAL_ALLOWANCE)}</strong>
          </li>
          <li>Basic rate (20%): next slice up to £50,270 of total income</li>
          <li>Higher rate (40%): next slice to £125,140</li>
          <li>Additional rate (45%): everything above</li>
        </ul>
        <p>
          National Insurance sits on top: employee Class 1 at 8% between PA and £50,270, then 2%
          above. Employer NI applies to the company at ~15% above £5,000 (post-2025 illustrative).
        </p>
        <h3>The taper trap</h3>
        <p>
          Between £100k and £125,140 the personal allowance tapers — every £2 over £100k removes
          £1 of allowance. Effective marginal rate in that band is 60%+. This is one of the most
          studied "edges" in UK tax.
        </p>
        <h3>Patterns being implemented</h3>
        <ul>
          <li>
            The threshold pattern — bands at clean edges create planning opportunities (drop a
            bonus into the year you're below an edge, or pension-contribute to drop back below).
          </li>
          <li>
            The classification pattern — earned income vs dividends vs pension carry different
            band treatment.
          </li>
        </ul>
        <h3>Questions to ask your accountant</h3>
        <ul>
          <li>Am I planning around the £100k taper?</li>
          <li>Am I using both spouses' personal allowances if applicable?</li>
        </ul>
      </>
    ),
  },
  {
    id: 'dividends',
    title: 'Dividend tax',
    pattern: 'Classification',
    summary: `${formatGBP(DIVIDEND_ALLOWANCE)} allowance, then ${formatPct(DIV_BASIC)} / ${formatPct(DIV_HIGHER)} / ${formatPct(DIV_ADDITIONAL)} bands.`,
    body: () => (
      <>
        <h2>What it is</h2>
        <p>
          Dividends are distributions of post-tax company profit to shareholders. They sit on top
          of other income for band purposes, but use their own rates:
        </p>
        <ul>
          <li>{formatGBP(DIVIDEND_ALLOWANCE)} allowance at 0%</li>
          <li>Basic-rate band: {formatPct(DIV_BASIC)}</li>
          <li>Higher-rate band: {formatPct(DIV_HIGHER)}</li>
          <li>Additional-rate band: {formatPct(DIV_ADDITIONAL)}</li>
        </ul>
        <p>
          They aren't subject to NI. They're also not deductible to the company, so dividends
          come out of <em>after-CT</em> profit.
        </p>
        <h3>Why dividends often beat salary on the personal side</h3>
        <p>
          No NI, lower rate. But the company already paid 19–25% CT on the profit before
          declaring it. The combined "round-trip" tax is what matters for comparison — see{' '}
          <em>Salary vs. dividend</em>.
        </p>
        <h3>Watch out for</h3>
        <ul>
          <li>
            Illegal dividends — declared without distributable reserves are reclaimable from the
            shareholder.
          </li>
          <li>
            <G term="ir35">IR35</G> — disguised remuneration of an employee can be reclassified.
          </li>
          <li>
            Settlements legislation — paying dividends to a spouse who didn't earn them can be
            challenged in some cases (<em>Arctic Systems</em> sets the boundary).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'salary-vs-dividend',
    title: 'Salary vs. dividend',
    pattern: 'Classification + how (rate)',
    summary: `The classic optimisation: pay the personal allowance as salary, the rest as dividends — most of the time.`,
    body: () => (
      <>
        <h2>What it is</h2>
        <p>
          The standard owner-extraction strategy in the UK is:
        </p>
        <ol>
          <li>
            Pay yourself a salary up to the <G term="personal allowance">personal allowance</G>{' '}
            (£12,570). It costs the company a small amount of employer NI but is fully deductible
            for CT.
          </li>
          <li>
            Take the rest as dividends. They use up the £500 dividend allowance, then get taxed
            at 8.75% / 33.75% / 39.35% depending on band.
          </li>
        </ol>
        <h3>Why this generally wins</h3>
        <p>
          Salary saves you CT on the way out (deductible), but costs you NI both sides plus
          income tax. Dividends pay CT first, then dividend tax. The arithmetic usually favours
          a low salary + dividends — but not always:
        </p>
        <ul>
          <li>If you want pension qualifying earnings, you need salary above ~£6,396.</li>
          <li>If your company is loss-making, dividends aren't legally available; salary is.</li>
          <li>If you want to maximise pension contributions, salary becomes more attractive.</li>
        </ul>
        <h3>Use the lab</h3>
        <p>
          Open the <G term="limited company">Cash Flow Lab</G> and toggle the Extraction strategy
          dropdown. The numbers update live.
        </p>
        <h3>Watch out for</h3>
        <ul>
          <li>Different rules for Scottish income tax bands.</li>
          <li>Auto-enrolment and pension qualifying earnings if you have employees.</li>
          <li>Director's loans (next topic) when you forget to declare the dividend properly.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'directors-loan',
    title: "Director's loans",
    pattern: 'Timing',
    summary: `Money you owe the company (or vice versa). Trap: s455 corporation tax of ${formatPct(0.3375)} if not repaid within 9 months of year-end.`,
    body: () => (
      <>
        <h2>What it is</h2>
        <p>
          A <G term="directors loan">director's loan account</G> (DLA) tracks the running balance
          between you and your company. Cash drawn that isn't salary, dividend, expenses
          repayment, or pension contribution sits in the DLA as a loan.
        </p>
        <h3>The s455 trap</h3>
        <p>
          If your DLA is overdrawn (you owe the company) at year end and isn't repaid within{' '}
          <strong>nine months and one day</strong>, the company pays a 33.75% extra corporation
          tax on the balance. You can reclaim it later when you repay, but the cash is gone in
          the meantime.
        </p>
        <h3>The BiK trap</h3>
        <p>
          Loans over £10,000 at any point in the year (with some exceptions) trigger a benefit
          in kind (BiK) — taxable on you as if you'd received the interest the company didn't
          charge.
        </p>
        <h3>The bed-and-breakfasting rule</h3>
        <p>
          Repaying a loan and then re-borrowing within 30 days is treated as if you never
          repaid. The rules close the obvious workaround.
        </p>
        <h3>Practical advice</h3>
        <ul>
          <li>Use the DLA only deliberately, not as accidental drawings.</li>
          <li>Reconcile and clear before year-end if you can.</li>
          <li>Document loans (interest, terms) — even informally — for clarity.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'vat',
    title: 'VAT',
    pattern: 'Threshold + classification',
    summary: `Register at ${formatGBP(VAT_REGISTRATION_THRESHOLD)} taxable turnover. Charges 20% on most outputs; recovers 20% on most inputs.`,
    body: () => (
      <>
        <h2>What it is</h2>
        <p>
          VAT is a tax on the value added at each stage of a supply chain. Customers pay it,
          businesses collect and remit it. As a registered business you generally:
        </p>
        <ul>
          <li>Add 20% to your sales (output VAT)</li>
          <li>Reclaim 20% on your purchases (input VAT)</li>
          <li>Pay HMRC the difference quarterly</li>
        </ul>
        <h3>When you must register</h3>
        <p>
          Once your taxable turnover exceeds {formatGBP(VAT_REGISTRATION_THRESHOLD)} in any
          rolling 12-month period — or you expect to in the next 30 days. Voluntary
          registration is also allowed below the threshold, often valuable if your customers
          are VAT-registered businesses.
        </p>
        <h3>B2B vs B2C: a critical structural difference</h3>
        <p>
          If your customers are VAT-registered businesses, charging VAT is neutral to them
          (they reclaim it). If your customers are consumers, charging VAT means you're 16.7%
          more expensive (or 16.7% less profitable if you absorb it). This is a make-or-break
          consideration for some B2C businesses near the threshold.
        </p>
        <h3>Schemes</h3>
        <ul>
          <li>
            <strong>Standard scheme</strong> — pay output VAT, reclaim input VAT.
          </li>
          <li>
            <strong>Flat Rate Scheme</strong> — pay a flat % of turnover, can't reclaim most
            input VAT. Simpler for low-cost service businesses.
          </li>
          <li>
            <strong>Cash accounting</strong> — based on payments rather than invoices. Helps
            cashflow.
          </li>
        </ul>
        <h3>Watch out for</h3>
        <ul>
          <li>Place-of-supply rules for cross-border services.</li>
          <li>Reverse charge for digital services and construction.</li>
          <li>"Voluntary" registration if your inputs are heavily VAT-bearing and outputs aren't.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'rd',
    title: 'R&D credits',
    pattern: 'Incentive',
    summary: 'Companies advancing science / tech can claim a credit on qualifying spend. Now under a unified merged scheme.',
    body: () => (
      <>
        <h2>What it is</h2>
        <p>
          The R&D scheme rewards companies for genuine attempts to advance science or technology
          where the outcome is uncertain — i.e. real research, not just routine work.
          Post-April 2024, schemes are merged into a single 20% above-the-line credit for most
          claimants, with an enhanced regime for R&D-intensive SMEs.
        </p>
        <h3>What counts</h3>
        <ul>
          <li>Solving technical uncertainty that competent professionals couldn't easily resolve.</li>
          <li>Staff costs, subcontractor costs (with rules), software, consumables.</li>
          <li>The R&D doesn't need to succeed; the attempt qualifies.</li>
        </ul>
        <h3>What doesn't count</h3>
        <ul>
          <li>Aesthetic / marketing changes.</li>
          <li>Routine application of existing tech.</li>
          <li>Work where the answer is known — even if it took you a while.</li>
        </ul>
        <h3>How to claim</h3>
        <p>
          Submit an additional information form, technical narrative, and figures alongside the
          CT return. HMRC scrutiny has tightened post-2023 — over-aggressive claims face
          significant pushback. Use a competent, honest adviser.
        </p>
        <h3>The pattern</h3>
        <p>
          R&D credits are a textbook incentive: the government wants more domestic technical
          experimentation, so it subsidises it. Founders doing the work anyway should claim;
          founders inventing claims out of nothing are walking into compliance trouble.
        </p>
      </>
    ),
  },
  {
    id: 'eis-seis',
    title: 'EIS / SEIS',
    pattern: 'Incentive',
    summary: 'Tax-advantaged investment schemes for getting outside capital into qualifying high-risk companies.',
    body: () => (
      <>
        <h2>What they are</h2>
        <p>
          EIS and SEIS are the UK's main schemes for incentivising investment into early-stage
          companies. They give individual investors income-tax relief now and CGT advantages
          later, in exchange for taking real equity risk.
        </p>
        <h3>Headline benefits to investors</h3>
        <ul>
          <li>
            <strong>SEIS</strong> — 50% income-tax relief on up to £200,000 / year, CGT
            disregarded on gains if held 3+ years, 50% CGT reinvestment relief.
          </li>
          <li>
            <strong>EIS</strong> — 30% income-tax relief on up to £1m / year (or £2m if at
            least £1m in knowledge-intensive companies), CGT-free gains, loss relief on the
            unrelieved portion.
          </li>
        </ul>
        <h3>Strict eligibility</h3>
        <p>
          The company must be qualifying (size, activities, age limits), the investor must be
          unconnected (broadly: not own &gt;30%, not be an employee, not have lent the company
          money structured as the investment), and shares must be ordinary risk equity.
        </p>
        <h3>Why founders care</h3>
        <p>
          Even if you're not the investor, structuring your fundraise as EIS-eligible is often
          the difference between getting funded and not. UK angel investors expect EIS-shaped
          deals.
        </p>
        <h3>Watch out for</h3>
        <ul>
          <li>Get advance assurance from HMRC before raising — it's standard.</li>
          <li>Investors must hold for 3 years to keep the IT relief.</li>
          <li>Bad-faith structures (preferential rights) can lose qualification.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'pensions',
    title: 'Pensions through your company',
    pattern: 'Deferral',
    summary: `Annual allowance ${formatGBP(PENSION_ANNUAL_ALLOWANCE)}. Company-paid contributions are deductible and not personal income.`,
    body: () => (
      <>
        <h2>What it is</h2>
        <p>
          Employer pension contributions paid by your company on your behalf are deductible for
          corporation tax, not subject to NI, and not income to you today. Inside the pension,
          investments grow tax-free. From age 55 (rising to 57 from 2028), 25% can be drawn tax-free.
        </p>
        <h3>Why this is so powerful for founders</h3>
        <p>
          Compare with paying yourself a dividend of the same gross amount and saving the
          residue:
        </p>
        <ul>
          <li>Pension: 0% in (after CT deduction), tax-free growth, partly tax-free out.</li>
          <li>
            Dividend route: 25% CT, then 33.75% dividend tax, then growth taxed at CGT or
            income.
          </li>
        </ul>
        <p>
          Over a 20–30 year horizon the gap is enormous. See lesson 1.9 for the simulator.
        </p>
        <h3>Limits</h3>
        <ul>
          <li>
            <strong>Annual allowance</strong> — £60,000 for most. Unused allowance from the
            three previous years can be carried forward.
          </li>
          <li>
            <strong>Tapering</strong> — for very high earners, the annual allowance reduces (down
            to £10,000).
          </li>
          <li>
            <strong>Wholly &amp; exclusively</strong> — large contributions for a director must
            be commercially justifiable (consistent with a market salary for their role).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'cgt',
    title: 'Capital gains tax',
    pattern: 'Classification',
    summary: 'Gains taxed at preferential rates vs income. Annual exemption tiny, post-Oct-2024 rates higher.',
    body: () => (
      <>
        <h2>What it is</h2>
        <p>
          When you sell an asset (shares, property, business, crypto) for more than you paid,
          the gain is taxable. Annual exemption is £3,000. Beyond that, the gain is taxed at:
        </p>
        <ul>
          <li>18% in the basic-rate band (post-Oct-2024)</li>
          <li>24% in the higher-rate band</li>
        </ul>
        <p>
          Property and carried interest can have different rates; check the rules at the time.
        </p>
        <h3>Why CGT exists at lower rates</h3>
        <p>
          The system rewards capital deployment by taxing its rewards more lightly than ongoing
          income. This is the universal capital-gains pattern.
        </p>
        <h3>Key reliefs</h3>
        <ul>
          <li>
            <G term="badr">BADR</G> — qualifying business sales, 14% on first £1m of lifetime
            gain.
          </li>
          <li>
            <strong>Investors' Relief</strong> — analogous, for outside investors, with its own
            rules.
          </li>
          <li>
            <strong>Hold-over relief</strong> — for gifts of business assets (or to trusts).
          </li>
          <li>
            <strong>Roll-over relief</strong> — when reinvesting proceeds into qualifying new
            assets.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'badr',
    title: 'Business Asset Disposal Relief',
    pattern: 'Incentive',
    summary: '14% CGT on the first £1m of qualifying lifetime gains when selling a business (post-Apr-2025 rate).',
    body: () => (
      <>
        <h2>What it is</h2>
        <p>
          BADR (formerly Entrepreneurs' Relief) reduces the CGT rate on qualifying business
          sales. The lifetime cap is £1,000,000 of gain, taxed at 14% (post-Apr-2025; was 10%
          before). Anything beyond that is taxed at the standard CGT rate.
        </p>
        <h3>Eligibility (broad strokes)</h3>
        <ul>
          <li>You hold ≥5% of ordinary shares and voting rights.</li>
          <li>You're an officer or employee of the company.</li>
          <li>The company is a trading company (or holding company of a trading group).</li>
          <li>All of the above held for at least 2 years before sale.</li>
        </ul>
        <h3>Why it matters for the structure decision</h3>
        <p>
          BADR is the single biggest reason for the retention pattern at scale. Money you keep
          inside the company eventually leaves either via dividend (33.75% top rate) or via
          sale (BADR-rate 14% on the first £1m). The latter is dramatically cheaper.
        </p>
        <h3>Watch out for</h3>
        <ul>
          <li>
            Significant cash piles can disqualify a company as "trading" — restructuring
            (e.g. moving cash to a holding company well in advance) may help.
          </li>
          <li>
            Rules have changed multiple times — what's BADR-qualifying today may not be at sale.
          </li>
          <li>
            Buyers sometimes structure deals in ways that disqualify BADR — get advice early.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'ir35',
    title: 'IR35 / off-payroll',
    pattern: 'Substance + classification',
    summary: 'Anti-avoidance: if your contract behaviour resembles employment, HMRC taxes you as an employee.',
    body: () => (
      <>
        <h2>What it is</h2>
        <p>
          IR35 is a set of rules that catch people working through a limited company in a way
          that is, economically, the same as being an employee of the client. If they apply,
          tax is largely the same as if you were on the client's payroll.
        </p>
        <h3>Three classic tests</h3>
        <ul>
          <li>
            <strong>Personal service</strong> — must you do the work yourself, or can you send a
            substitute?
          </li>
          <li>
            <strong>Control</strong> — does the client direct what, when and how you work?
          </li>
          <li>
            <strong>Mutuality of obligation</strong> — does the client have to give you work,
            and you have to do it?
          </li>
        </ul>
        <h3>Off-payroll rules (April 2017 / 2021)</h3>
        <p>
          For medium / large clients, the responsibility for the IR35 status determination sits
          with the client, not the contractor. They issue a Status Determination Statement.
          Small clients still leave the determination with the contractor's company.
        </p>
        <h3>Practical posture</h3>
        <ul>
          <li>If you genuinely operate as a business — multiple clients, real risk of loss, your own kit, freedom to substitute — IR35 typically doesn't bite.</li>
          <li>If you're embedded in a single client like a colleague, expect IR35 to apply.</li>
          <li>Keep evidence (contracts, invoices, marketing) of your independence.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'groups',
    title: 'Group structures',
    pattern: 'Structure',
    summary: 'Holding company over trading subsidiaries. Inter-company dividends usually tax-free; risk isolated to subsidiaries.',
    body: () => (
      <>
        <h2>What it is</h2>
        <p>
          A group structure has a parent (holding company) sitting above one or more trading
          subsidiaries. The parent typically does no trading itself.
        </p>
        <h3>Why it's useful</h3>
        <ul>
          <li>
            <strong>Risk isolation</strong> — if one subsidiary is sued or fails, the rest of
            the group is largely shielded.
          </li>
          <li>
            <strong>Tax-efficient cash movement</strong> — UK-to-UK group dividends are
            generally exempt from corporation tax. Cash can be swept up to the parent and
            redeployed without leakage.
          </li>
          <li>
            <strong>Sale flexibility</strong> — selling a subsidiary is cleaner than selling a
            mixed-purpose company.
          </li>
          <li>
            <strong>Group reliefs</strong> — losses can sometimes be transferred between
            qualifying group members.
          </li>
        </ul>
        <h3>When the complexity is worth it</h3>
        <ul>
          <li>You run multiple distinct businesses.</li>
          <li>You're accumulating significant cash that you don't want exposed to trading risk.</li>
          <li>You're preparing to sell one of several lines.</li>
        </ul>
        <h3>When it isn't</h3>
        <ul>
          <li>Single-business operations with little surplus cash.</li>
          <li>If the cost of running two sets of accounts exceeds the benefit.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'isa',
    title: 'ISAs and LISAs',
    pattern: 'Wrapper',
    summary: `${formatGBP(ISA_ALLOWANCE)}/year ISA allowance. ${formatGBP(LISA_ALLOWANCE)}/year LISA with ${formatPct(LISA_BONUS)} government bonus.`,
    body: () => (
      <>
        <h2>What they are</h2>
        <p>
          ISAs are tax-free wrappers for personal savings and investments. The £20,000 / year
          allowance gives you growth and withdrawals free of income tax and CGT for life.
        </p>
        <p>
          LISAs (Lifetime ISA) are a £4,000 / year subset for under-40s, with a 25% government
          bonus, usable for first-home or retirement (after 60) — early withdrawal incurs a
          25% penalty.
        </p>
        <h3>Why founders care</h3>
        <p>
          For surplus personal cash that you don't want inside the company, ISAs are the most
          straightforward shelter. The compounding inside an ISA over decades is significant.
        </p>
        <h3>The pattern</h3>
        <p>
          ISAs and pensions are both wrappers — but built differently. Pension: tax in is
          deferred, tax out comes later. ISA: tax in already happened, tax out is zero. Pick
          the wrapper that fits the cash's purpose.
        </p>
      </>
    ),
  },
  {
    id: 'iht',
    title: 'Inheritance tax & business property',
    pattern: 'Structure + relief',
    summary: '40% above the bands. Business Property Relief currently exempts qualifying trading-company shares.',
    body: () => (
      <>
        <h2>What it is</h2>
        <p>
          When you die, the value of your estate above the nil-rate bands (broadly £325k +
          £175k residence) is taxed at 40%. Spouses inherit tax-free; bands transfer to
          surviving spouse.
        </p>
        <h3>Business Property Relief (BPR)</h3>
        <p>
          Shares in qualifying unquoted trading companies have historically attracted 100%
          BPR — i.e. exempt from IHT. Investment-heavy companies, holding companies whose
          subsidiaries don't trade, or companies with disproportionate cash piles can lose
          qualification.
        </p>
        <p>
          <strong>Watch out:</strong> BPR has been the subject of policy debate. Rules can change.
          Don't structure decades of life around the current relief without ongoing review.
        </p>
        <h3>Practical posture</h3>
        <ul>
          <li>For non-trading wealth, look at gifts (7-year rule), trusts, and life insurance written in trust.</li>
          <li>For trading-company wealth, BPR makes it much easier — but stay BPR-eligible.</li>
          <li>Get specialist advice. IHT planning is the area where DIY hurts most.</li>
        </ul>
      </>
    ),
  },
];

export const UK_OVERVIEW_CHANGE_NOTE = `UK tax law has changed multiple times in recent years. Corporation tax tiers were re-introduced in 2023. The dividend allowance has dropped from £5,000 to £500. CGT thresholds have been cut. BADR rates have moved. Numbers shown reflect ${RATES_AS_OF}. Always verify before acting.`;

export function getUkTopic(id: string): UkTopic | undefined {
  return UK_TOPICS.find((t) => t.id === id);
}
