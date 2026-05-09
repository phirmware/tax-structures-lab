import type { ReactNode } from 'react';
import { G } from '../components/ui/Glossary';
import {
  CT_MAIN_RATE,
  CT_SMALL_RATE,
  PERSONAL_ALLOWANCE,
} from '../lib/constants';
import { formatGBP, formatPct } from '../lib/format';

/**
 * Long-form "How it works" body for each structure. Renders nothing if a
 * structure doesn't have a body authored yet, so the page stays clean while
 * we build out coverage incrementally.
 */
export function getStructureBody(id: string): ReactNode | null {
  switch (id) {
    case 'sole-trader':
      return <SoleTraderBody />;
    case 'partnership':
      return <PartnershipBody />;
    case 'ltd':
      return <LtdBody />;
    case 'llp':
      return <LlpBody />;
    case 'holding':
      return <HoldingBody />;
    case 'fic':
      return <FicBody />;
    case 'psc':
      return <PscBody />;
    case 'trust':
      return <TrustBody />;
    default:
      return null;
  }
}

// ---------------- Sole trader ----------------

function SoleTraderBody() {
  return (
    <>
      <h2>How it actually works</h2>
      <p>
        There is no separate legal entity. <em>You</em> are the business. Every
        contract is between the customer and you personally; every debt is
        yours; every asset bought with business cash is owned by you. Setup is
        a single HMRC self-assessment registration — that's it.
      </p>
      <p>
        Each tax year you compute <strong>profit = revenue − allowable
        business expenses</strong>. That profit is added on top of any other
        personal income (employment, rental, etc.) and taxed through the
        normal income-tax bands plus Class 4 National Insurance.
      </p>

      <h3>Tax treatment in one paragraph</h3>
      <p>
        Profit is taxed at <strong>0% / 20% / 40% / 45%</strong> depending on
        which band each slice falls into, plus Class 4 NI of{' '}
        <strong>6%</strong> between £12,570 and £50,270 and{' '}
        <strong>2%</strong> above £50,270. There is no "company" layer, no
        corporation tax, and no dividend layer — just your personal bands.
      </p>

      <h3>The two real advantages</h3>
      <ul>
        <li>
          <strong>Loss relief against other income.</strong> A trading loss can
          offset employment income, pension income, or other earnings in the
          same year — useful in startup years when you might still have a day
          job or other revenue.
        </li>
        <li>
          <strong>Zero entity overhead.</strong> No company accounts, no
          confirmation statement, no separate corporation tax return. You file
          one self-assessment return per year and that's the whole compliance
          cost.
        </li>
      </ul>

      <h3>What it costs you</h3>
      <ul>
        <li>
          <strong>Personal liability.</strong> A claimant who wins a judgement
          can pursue your house, your savings, and any other personal assets.
          Not abstract — every contract you sign personally exposes them.
        </li>
        <li>
          <strong>No retention pattern.</strong> Every pound of profit is taxed
          at your full marginal rate the moment it's earned, whether you spent
          it or not. There is no lower-rate "company tier" you can let cash sit
          in between earning and spending.
        </li>
        <li>
          <strong>The £100k taper bites hard.</strong> Above £100k of profit
          you start losing your <G term="personal allowance">personal
          allowance</G> at 60% effective marginal rate. As a sole trader you
          can't choose to leave that profit somewhere else — it all flows
          through to you in the year it's earned.
        </li>
      </ul>

      <h3>Where the line sits in practice</h3>
      <p>
        The cost of running a Ltd (accountant, accounts filings, formation) is
        often £1,500–£3,000 a year. So Ltd starts winning, on tax alone, once
        the saved tax exceeds that overhead — typically once profits cross
        £30k–£50k a year, more aggressively if you can leave anything inside
        the company. Below that, the sole-trader simplicity is genuine value.
      </p>
    </>
  );
}

// ---------------- Partnership ----------------

function PartnershipBody() {
  return (
    <>
      <h2>How it actually works</h2>
      <p>
        A general partnership is two or more people running a business
        together with no separate legal entity. Profits are shared per the
        partnership agreement (or equally if there isn't one), and each
        partner is taxed on their share <em>as if they were a sole trader on
        that share</em>. The partnership files a single information return,
        but the tax flows through to the individuals.
      </p>

      <h3>Joint and several liability</h3>
      <p>
        This is the headline reason most modern small partnerships pick LLP
        instead. In a general partnership, every partner is fully responsible
        for every partnership debt — not just their share. If one partner
        signs a bad contract or runs up debts, the others' personal assets
        are on the line for the lot.
      </p>

      <h3>Tax mechanics</h3>
      <ul>
        <li>
          <strong>Tax-transparent.</strong> The partnership itself pays no
          tax. HMRC looks through it to the partners.
        </li>
        <li>
          <strong>Each partner uses their own allowances.</strong> Two
          partners splitting £100k of profit each get their own £12,570{' '}
          <G term="personal allowance">personal allowance</G> and their own
          basic-rate band — much better than one person taking £100k.
        </li>
        <li>
          <strong>Drawings are not the tax base.</strong> You're taxed on your
          share of the partnership profit whether you took it out or left it
          in the business. There is no retention pattern available.
        </li>
      </ul>

      <h3>Where partnerships still make sense</h3>
      <p>
        Tightly trusted small teams of professionals where every partner is
        personally accountable for the work, and where the cost or formality
        of an LLP isn't worth it. In practice, the moment liability starts to
        matter or capital is being raised, an LLP or Ltd is the better
        answer.
      </p>

      <h3>Watch out for</h3>
      <ul>
        <li>
          The partnership agreement matters more than people think — profit
          shares, decision rights, exit terms, what happens on a partner's
          death. Without one, the Partnership Act 1890 applies, and its
          defaults are not what you'd choose.
        </li>
        <li>
          Capital introduced and drawn down has to be tracked carefully;
          tax-allocated profit is separate from cash drawings.
        </li>
        <li>
          Bringing in new capital usually means restructuring as a Ltd or
          LLP — partnerships don't issue shares.
        </li>
      </ul>
    </>
  );
}

// ---------------- Ltd ----------------

function LtdBody() {
  return (
    <>
      <h2>How it actually works</h2>
      <p>
        A limited company is a separate legal "person." It owns its own
        assets, owes its own debts, and pays its own tax. You own the
        company; the company owns the business. When the company is sued,
        only company assets are at risk — your personal balance sheet sits
        outside the line of fire (unless you've signed personal guarantees).
      </p>

      <h3>The two-layer tax system</h3>
      <p>
        This is the structural fact that drives every founder-extraction
        decision:
      </p>
      <ol>
        <li>
          <strong>Layer 1 — Corporation tax.</strong> The company pays{' '}
          <G term="corporation tax">corporation tax</G> on its profits at{' '}
          {formatPct(CT_SMALL_RATE)} (under £50k profit) rising to{' '}
          {formatPct(CT_MAIN_RATE)} (above £250k), with marginal relief in
          between.
        </li>
        <li>
          <strong>Layer 2 — Personal tax on extraction.</strong> When money
          leaves the company to you, you pay personal tax on it — income tax
          + NI on salary, dividend tax on dividends, or CGT on a sale of
          shares.
        </li>
      </ol>

      <h3>Why this is so powerful for founders</h3>
      <p>
        You get to choose <em>when and how much</em> to extract. Profit you
        don't need can sit inside the company at the lower corporate rate
        and compound there. Profit you do need can be taken via the cheapest
        extraction route (typically PA-salary + dividends + a pension
        contribution). And on eventual sale, the gain can attract{' '}
        <G term="badr">BADR</G> at 14% — far below any income-tax route.
      </p>

      <h3>What it costs you</h3>
      <ul>
        <li>
          <strong>Compliance.</strong> Annual accounts, confirmation
          statement, corporation tax return, payroll if you take a salary,
          potentially VAT and PAYE — usually £1,500–£3,000 a year of
          accountancy plus your own time.
        </li>
        <li>
          <strong>Director duties.</strong> You can be personally liable for
          things like trading while insolvent, breaches of fiduciary duty, or
          unpaid PAYE/NI in some circumstances.
        </li>
        <li>
          <strong>Two layers of tax if you extract everything.</strong> If
          you take all profit out as dividends each year, the round-trip CT +
          dividend tax can exceed sole-trader rates at low profit levels.
          Ltd shines when you can leave some money inside.
        </li>
      </ul>

      <h3>The standard owner-extraction recipe</h3>
      <p>
        For most director-shareholders, the default-efficient mix is:
      </p>
      <ul>
        <li>
          Salary at the personal allowance ({formatGBP(PERSONAL_ALLOWANCE)})
          — uses your tax-free band, deductible for CT, costs only a small
          amount of employer NI.
        </li>
        <li>
          Dividends to top up to your living needs — taxed at 8.75% / 33.75%
          / 39.35% with no NI.
        </li>
        <li>
          Pension contributions for any surplus you don't need yet — fully
          deductible for CT, no income tax or NI today, taxed on the way
          out.
        </li>
        <li>
          Anything still left over: <em>retain inside the company</em> and
          let it compound at the lower CT rate, or invest it into the
          business.
        </li>
      </ul>
    </>
  );
}

// ---------------- LLP ----------------

function LlpBody() {
  return (
    <>
      <h2>How it actually works</h2>
      <p>
        An LLP is a hybrid. Legally it's a separate entity with limited
        liability, like a Ltd. For tax it's transparent like a partnership —
        the LLP itself pays no corporation tax; each member is taxed on their
        allocated profit share through self-assessment.
      </p>

      <h3>What "limited liability" means here</h3>
      <p>
        Unlike a general partnership, one member's bad call does not put the
        other members' personal assets on the line for the LLP's debts.
        Members are still responsible for their own negligence and for any
        personal guarantees they've signed, but routine business risk stays
        contained.
      </p>

      <h3>Tax mechanics — same as partnership</h3>
      <ul>
        <li>
          <strong>Each member is taxed on their share</strong> at IT bands +
          Class 4 NI, exactly as a sole trader on that share.
        </li>
        <li>
          <strong>No retention pattern.</strong> The LLP pays no CT, so
          there's no lower-rate corporate layer to leave money in. If you
          want to retain at corporate rates you need a Ltd or a hybrid
          structure with a corporate member.
        </li>
        <li>
          <strong>Profit allocation can be flexible.</strong> The members'
          agreement can set unequal shares, fixed-share members, salaried
          members — but salaried members earning a quasi-employee package can
          be reclassified by HMRC as employees for tax (the salaried-member
          rules).
        </li>
      </ul>

      <h3>When LLP wins</h3>
      <ul>
        <li>
          Multi-member professional firms (lawyers, architects, accountants,
          consulting partnerships) where the work is genuinely partnership-
          flavoured but liability protection matters.
        </li>
        <li>
          Property co-ownership where you want partnership-style tax but
          limited liability on each property.
        </li>
      </ul>

      <h3>When LLP loses</h3>
      <ul>
        <li>
          <strong>Single-member businesses</strong> can't form an LLP — it
          requires at least two members. Use a Ltd instead.
        </li>
        <li>
          <strong>Capital-intensive businesses that retain earnings.</strong>{' '}
          With no corporate-rate layer, every pound of profit is taxed at
          full personal rates the year it's earned — even if you wanted to
          leave it inside the business.
        </li>
        <li>
          <strong>Outside investment</strong> is much harder. LLPs don't
          issue shares, so equity-style investment is structurally awkward.
        </li>
      </ul>
    </>
  );
}

// ---------------- Holding ----------------

function HoldingBody() {
  return (
    <>
      <h2>How it actually works</h2>
      <p>
        A "holding" structure is a parent Ltd (the holdco) that owns 100% of
        the shares of one or more trading Ltds (the subs). The holdco
        usually does no trading itself — its only assets are shares in its
        subsidiaries, plus any cash that has been swept up from them.
      </p>

      <h3>The two mechanics that make it useful</h3>
      <ol>
        <li>
          <strong>Inter-company dividends are usually exempt from CT.</strong>{' '}
          A trading sub can dividend its post-CT profit up to its UK parent
          without further corporation tax. So cash can flow up out of the
          risky trading entity without leakage.
        </li>
        <li>
          <strong>Group relief for losses.</strong> Trading losses in one
          group company can, subject to rules, be surrendered to a profitable
          group company to reduce its CT bill.
        </li>
      </ol>

      <h3>Why founders use it</h3>
      <ul>
        <li>
          <strong>Risk isolation.</strong> If the trading sub is sued or
          fails, the cash already swept up to the holdco is generally
          protected — claimants pursuing the sub can't follow the dividend
          trail upward.
        </li>
        <li>
          <strong>Multiple trading lines.</strong> Each line can sit in its
          own sub, ringfencing the rest of the group from a bad year in any
          one of them, and making it cleaner to sell or wind up a single
          line later.
        </li>
        <li>
          <strong>Cleaner exit.</strong> A buyer can acquire one subsidiary
          without acquiring the others, the cash, or any unrelated history.
        </li>
        <li>
          <strong>BPR / BADR friendly cash management.</strong> A trading
          sub with too much non-operational cash can lose its "trading
          status" for BPR or BADR purposes. Sweeping that cash up to a
          holdco, well in advance of a sale, helps preserve the reliefs.
        </li>
      </ul>

      <h3>What it costs you</h3>
      <ul>
        <li>
          <strong>Two (or more) sets of accounts and CT returns.</strong>{' '}
          Each entity is its own taxpayer with its own filings.
        </li>
        <li>
          <strong>Associated-company rules tighten the CT bands.</strong>{' '}
          With several "associated" companies, the £50k small-profits
          threshold and the £250k main-rate threshold are divided between
          them — pushing each into the marginal band sooner.
        </li>
        <li>
          <strong>Substance considerations.</strong> The holdco needs to be a
          real entity with real activity — not a shell that exists only on
          paper — for several reliefs and treaty positions to hold up.
        </li>
        <li>
          <strong>Setup is non-trivial.</strong> Inserting a holdco above an
          existing trading Ltd is usually done via a share-for-share
          exchange. It's clean if you do it right and well in advance, but
          it's not a thing you do casually the year before a sale.
        </li>
      </ul>

      <h3>The threshold for "is it worth it?"</h3>
      <p>
        Single-trade Ltds with limited retained cash usually don't earn
        their group complexity. Once a trading Ltd is sitting on £200k+ of
        non-operational cash, or you have two distinct lines of business,
        the conversation about a group structure stops being theoretical.
      </p>
    </>
  );
}

// ---------------- FIC ----------------

function FicBody() {
  return (
    <>
      <h2>How it actually works</h2>
      <p>
        A Family Investment Company is a Ltd whose purpose is to hold
        investments — shares, funds, sometimes property — rather than to
        trade. Family members hold different classes of shares with different
        rights to income, capital, and votes. The company invests, the
        company is taxed on its returns at corporate rates, and value can be
        passed across generations through the share structure.
      </p>

      <h3>Why FICs exist</h3>
      <p>
        Discretionary trusts used to be the standard tool for multi-
        generational wealth planning. After the 2006 trust reforms, most
        large new trusts trigger an immediate 20% inheritance-tax charge plus
        10-year periodic charges. FICs emerged as the alternative: a
        corporate wrapper with no entry charge, taxed at corporate rates that
        are lower than top personal rates.
      </p>

      <h3>Key tax characteristics</h3>
      <ul>
        <li>
          <strong>Investment income is taxed at corporate rates.</strong>{' '}
          Dividend income received by a UK FIC from UK shares is generally
          exempt; interest income is taxable at the company's CT rate;
          gains on share sales are taxed at CT rates with the substantial-
          shareholding exemption available in narrow cases.
        </li>
        <li>
          <strong>Loan accounts are common.</strong> The founder usually
          funds the FIC by lending it cash. The loan can be repaid tax-free
          over time, drawing the founder's wealth back without dividend tax
          — until the loan is repaid.
        </li>
        <li>
          <strong>Alphabet shares for distributions.</strong> Different share
          classes let the company declare different dividends to different
          family members, using each adult's personal allowances and
          dividend allowances independently.
        </li>
        <li>
          <strong>IHT advantage on gifts of shares.</strong> Gifting growth
          shares to children early — when their value is low — pushes future
          appreciation outside the founder's estate. Combined with the
          7-year rule, this is the main IHT planning angle.
        </li>
      </ul>

      <h3>What an FIC is not</h3>
      <ul>
        <li>
          <strong>Not a tax dodge.</strong> Investment growth inside an FIC
          is still taxed; it's just taxed at corporate rates with eventual
          extraction tax on the way out. The win is rate (and timing), not
          exemption.
        </li>
        <li>
          <strong>Not a quick decision.</strong> Setup, share-class drafting,
          and ongoing administration are non-trivial. You typically need a
          long horizon (10–30 years) for the structure to outperform a
          well-used set of ISAs and personal allowances.
        </li>
      </ul>

      <h3>The honest threshold</h3>
      <p>
        Below ~£500k of investable capital and a 10+ year horizon, an FIC
        usually isn't worth its setup and administration cost relative to
        ISAs, pensions, and personal investment. Above that, with a clear
        multi-generation plan, it earns its place. Always specialist
        advice — the share structure has to match the family's actual
        intentions.
      </p>
    </>
  );
}

// ---------------- PSC ----------------

function PscBody() {
  return (
    <>
      <h2>How it actually works</h2>
      <p>
        A Personal Service Company is just a Ltd whose primary purpose is to
        invoice clients for one person's services. Mechanically it's no
        different from any other Ltd — same corporation tax, same
        salary+dividend extraction, same accounts. What makes it a "PSC" is
        the substance of the engagement: one person, one set of skills,
        often one or two clients.
      </p>

      <h3>Why people use PSCs</h3>
      <p>
        Three reasons, in order of importance:
      </p>
      <ul>
        <li>
          <strong>Limited liability.</strong> The contractor isn't personally
          on the hook for project risk.
        </li>
        <li>
          <strong>Tax efficiency, when outside IR35.</strong> The standard
          owner-director extraction recipe (PA salary + dividends +
          pension) typically beats employee tax-and-NI on the same gross
          earnings.
        </li>
        <li>
          <strong>Flexibility.</strong> Holding back retained earnings to
          smooth income across years, fund a sabbatical, or build a buffer
          before going employed again.
        </li>
      </ul>

      <h3>The IR35 problem in one paragraph</h3>
      <p>
        HMRC's view: if the day-to-day reality of the engagement looks like
        employment (one client, you sit with their team, they direct your
        work, mutual obligation to provide and accept work), the PSC is a
        wrapper, not a real business. In that case "off-payroll" rules apply
        and the income is taxed largely as employment — wiping out most of
        the PSC's tax advantage. For medium and large clients the client
        determines the status; for small clients, the PSC does.
      </p>

      <h3>Three tests, plus everything else</h3>
      <ul>
        <li>
          <strong>Personal service.</strong> Must you do the work yourself,
          or can you genuinely send a substitute? A real right of
          substitution helps.
        </li>
        <li>
          <strong>Control.</strong> Does the client direct what, when, where,
          and how you work? The more control they have, the more it looks
          like employment.
        </li>
        <li>
          <strong>Mutuality of obligation (MOO).</strong> Is the client
          obliged to give you ongoing work and you obliged to take it? If
          so, that resembles an employment contract.
        </li>
      </ul>
      <p>
        Beyond the three: who provides equipment, who carries the financial
        risk, are you "part and parcel" of the client's organisation, do you
        have multiple clients in parallel.
      </p>

      <h3>What "outside IR35" looks like in practice</h3>
      <ul>
        <li>Multiple genuine clients, not just a sequence of long contracts with the same one.</li>
        <li>You bring your own kit, your own methodology, your own team if any.</li>
        <li>You can refuse work and the client can refuse to give it — no MOO.</li>
        <li>Your contract has a real substitution clause that has actually been exercised.</li>
        <li>You market your services, take real financial risk on bad debts, fix your own mistakes at your cost.</li>
      </ul>

      <h3>Practical posture</h3>
      <p>
        Don't bet a five-year tax position on a marginal IR35 view. Get a
        contract review and an SDS where applicable. If you're inside IR35
        on a particular engagement, the PSC still works — it just doesn't
        save you tax on that engagement. The structural protection (limited
        liability, accounting cleanliness, flexibility on other work) is
        still useful.
      </p>
    </>
  );
}

// ---------------- Trust ----------------

function TrustBody() {
  return (
    <>
      <h2>How it actually works</h2>
      <p>
        A trust separates legal ownership of an asset (held by{' '}
        <em>trustees</em>) from the benefit of that asset (which goes to{' '}
        <em>beneficiaries</em>). The person who put the asset into the trust
        is the <em>settlor</em>. Trustees hold a fiduciary duty to manage the
        trust property for the beneficiaries' benefit per the trust deed.
      </p>

      <h3>The main types in UK practice</h3>
      <ul>
        <li>
          <strong>Bare trust.</strong> The beneficiary is absolutely entitled
          — typically used for assets held for a child until they turn 18.
          Tax-transparent: the beneficiary's tax position applies.
        </li>
        <li>
          <strong>Interest-in-possession trust.</strong> One beneficiary has
          a right to the income; another may inherit the capital later.
          Often used in second marriages and inheritance planning.
        </li>
        <li>
          <strong>Discretionary trust.</strong> Trustees have wide discretion
          over which beneficiaries to pay, when, and how much. Most flexible,
          but most heavily taxed.
        </li>
      </ul>

      <h3>Why trusts changed in 2006</h3>
      <p>
        The 2006 reforms aligned most discretionary and many interest-in-
        possession trusts under the "relevant property" regime. That brought
        with it:
      </p>
      <ul>
        <li>An immediate <strong>20% IHT entry charge</strong> on transfers above the nil-rate band.</li>
        <li><strong>10-year periodic charges</strong> of up to 6% on trust value.</li>
        <li><strong>Exit charges</strong> when assets leave the trust.</li>
      </ul>
      <p>
        For most new wealth, this made trusts less attractive than FICs or
        outright lifetime gifting plus the 7-year rule. Trusts remain useful
        for specific use cases below.
      </p>

      <h3>Where trusts still earn their place</h3>
      <ul>
        <li>
          <strong>Asset protection.</strong> Wealth held in a properly
          structured trust is generally not the beneficiary's asset, so
          shielded from divorce, bankruptcy, and creditor claims (with strict
          rules on look-through where the trust was set up to defeat
          creditors).
        </li>
        <li>
          <strong>Vulnerable beneficiaries.</strong> A trust can hold and
          manage assets for someone who can't manage them themselves
          (minors, those with capacity issues), with specific tax regimes for
          vulnerable-beneficiary trusts.
        </li>
        <li>
          <strong>Multi-generation planning where the settlor wants control
          retained.</strong> An outright gift transfers control; a trust lets
          the settlor specify how and when distributions happen even after
          death.
        </li>
      </ul>

      <h3>Honest caveat</h3>
      <p>
        Trust law is intricate, the tax regimes change, and amateur trust
        structures fail expensively. If you're thinking about trusts as a
        primary tax-efficiency tool, an FIC or sensible use of personal
        wrappers (pensions, ISAs, allowances) is usually a more durable
        starting point. If you're thinking about trusts for protection or
        succession, get specialist advice before drafting anything.
      </p>
    </>
  );
}

