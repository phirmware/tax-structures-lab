// Plain-language summaries and "mistakes I've seen real founders make" stories.
// Keyed by a stable pageId so any page (lesson, structure, UK topic, scenario,
// pattern) can opt-in to either or both extras.
//
// Style rules for summaries:
//   - 1–3 sentences, in plain English. No jargon, no abstract terminology.
//   - Capture the practical takeaway, not the conceptual framing.
//
// Style rules for mistakes:
//   - 2–4 sentences each, with concrete numbers and a "the fix" element.
//   - Illustrative — never named or accusatory.

import { RATES_AS_OF } from '../lib/constants';

export interface FounderMistake {
  id: string;
  title: string;
  body: string;
}

export interface LessonExtras {
  summary?: string;
  mistakes?: FounderMistake[];
}

/** Disclaimer shown at the foot of every mistakes panel. */
export const MISTAKES_DISCLAIMER = `These are illustrative scenarios based on common patterns, not specific real individuals. Numbers use rates current as of ${RATES_AS_OF} and will vary by situation.`;

export const LESSON_EXTRAS: Record<string, LessonExtras> = {
  // ----- Foundations ---------------------------------------------------
  'foundations/1-1': {
    summary:
      'A limited company is a separate "legal person" you can own. If the business gets sued or fails, only what you put into the company is at risk — not your house, your savings, or your other earnings. That single boundary is the reason every other tax and structure idea in this app exists.',
    mistakes: [
      {
        id: 'late-incorporation',
        title: 'Incorporating five years too late',
        body:
          'A founder runs a successful side business as a sole trader for six years, hitting £85,000 of profit annually by year three. Across those years they pay roughly £15,000 more in tax than if they had incorporated at year three, plus they carry personal liability for every contract. The fix would have been a 30-minute conversation with an accountant when profits first crossed £40k.',
      },
      {
        id: 'personal-guarantee-erases-protection',
        title: 'Signing a personal guarantee that erases the shield',
        body:
          'A first-time Ltd director signs a personal guarantee on the office lease and a £25,000 trade-credit line "to keep things moving." The company later folds. Despite limited liability, the director is personally chased for the £40,000 covered by guarantees. The fix: read every contract for "personal guarantee" clauses; push back, cap them, or accept the trade-off knowingly.',
      },
    ],
  },

  'foundations/1-2': {
    summary:
      "Your business's revenue, its profit, and your wealth are three different things — and tax cares about profit, not revenue. A £200,000-revenue business that spends £190,000 on costs has a £10,000 tax bill, not a £200,000 one. Confusing these three is how founders panic at headline numbers and miss the actual decisions.",
  },

  'foundations/1-3': {
    summary:
      'Every tax-efficiency strategy works one of three ways: it changes what counts as taxable, when you pay, or what rate applies. Once you can name which lever a strategy is pulling, you can compare strategies sensibly instead of treating each one as a magic trick.',
  },

  'foundations/1-4': {
    summary:
      "The same £100,000 is taxed very differently depending on whether the law calls it salary (up to ~47% in the UK), dividends, or a capital gain (as low as 18% with BADR). The label the system attaches to your money matters as much as the amount — sometimes more.",
    mistakes: [
      {
        id: 'all-salary',
        title: 'Taking everything as salary "to keep it simple"',
        body:
          "A Ltd director pays themselves £80,000 as salary because that's what they earned at their old job. They could have taken £12,570 as salary and most of the rest as dividends, saving roughly £4,000–£5,000 in tax and NI per year. Three years later, that's £15,000 of avoidable tax. The fix: a 15-minute conversation with their accountant about salary/dividend mix.",
      },
    ],
  },

  'foundations/1-5': {
    summary:
      "Money kept inside your company is taxed at a lower rate than money you take out personally. So if you don't need to spend it now, leaving it inside the business and letting it grow there builds wealth significantly faster than extracting and saving it personally.",
    mistakes: [
      {
        id: 'extract-everything',
        title: 'Extracting everything every year, by reflex',
        body:
          "A founder makes £180,000 of company profit every year and extracts the lot — paying corporation tax, then dividend tax on the way out, then putting the leftover in a personal savings account. Over 10 years, leaving even £40,000/year inside the company (or in a pension) instead of dividending it would have built six figures more wealth at the same risk. The fix: separate \"money I need to live\" from \"money I'm just storing,\" and only extract the first.",
      },
    ],
  },

  'foundations/1-6': {
    summary:
      "Costs that are genuinely for the business reduce the profit on which tax is calculated — so a £1,000 deductible expense roughly costs you £750–£810 after tax, not £1,000. The skill is knowing what's a legitimate business cost and what HMRC will push back on; the boundary is real, but generous.",
    mistakes: [
      {
        id: 'missed-deductions',
        title: 'Missing the small deductions every month',
        body:
          'A founder doesn\'t bother claiming home-office costs, mileage on business journeys, or their phone bill. Across a year that\'s £3,000–£5,000 of legitimate, easy-to-evidence deductions left on the table — which translates to roughly £600–£1,250 of avoidable tax. The fix: a five-minute monthly habit of categorising expenses with a receipt-capture app.',
      },
    ],
  },

  'foundations/1-7': {
    summary:
      "Paying tax later is paying less tax in real terms, because money you keep today is worth more than money you'd keep ten years from now. This is why pensions, capital allowances, and retirement accounts exist — they let you legally push the tax bill into the future, where inflation and growth eat away at its real cost.",
  },

  'foundations/1-8': {
    summary:
      "A loss in a bad year isn't just lost money — it's a credit you can use against future profits, or sometimes against this year's other income. Recording, tracking, and timing those losses can be worth tens of thousands later. Don't quietly write them off as if they never happened.",
  },

  'foundations/1-9': {
    summary:
      "Pension contributions paid by your company are deductible for corporation tax, dodge National Insurance entirely, and aren't taxed on you until you draw them — making them one of the cheapest ways to move company money into your personal long-term wealth. The trade-off is liquidity: you can't touch it until your late 50s.",
    mistakes: [
      {
        id: 'pension-vs-isa',
        title: 'Maxing the personal ISA while ignoring the pension',
        body:
          'A Ltd director takes maximum dividends every year and puts £20,000 into a personal ISA. They miss that company pension contributions skip corporation tax, NI, and dividend tax — moving £20,000 of company cash to a pension is far cheaper than moving the same amount to an ISA via dividend. Over 20 years and reasonable returns, the missed strategy can cost six figures of compound growth. The fix: route surplus profit through the pension first, ISA second.',
      },
    ],
  },

  'foundations/1-10': {
    summary:
      "The tax code isn't just a way to fund government — it's a list of behaviours the country wants more of. Where the government wants more pensions, R&D, green energy, or risk capital, it makes those activities cheaper. If your business does any of these naturally, you're leaving free money on the table by not claiming.",
    mistakes: [
      {
        id: 'rd-not-claimed',
        title: 'Assuming "real" research is something other people do',
        body:
          'A SaaS founder doesn\'t claim R&D credits because they assume their work isn\'t "real research." Their development work — solving non-trivial technical problems where the answer isn\'t known up front — actually qualifies. Over four years they leave roughly £60,000 of credits unclaimed, money that could have funded a hire or extended runway. The fix: a one-hour conversation with an R&D specialist before deciding you don\'t qualify.',
      },
    ],
  },

  // ----- Structures ----------------------------------------------------
  'structures/sole-trader': {
    summary:
      "As a sole trader, you and the business are legally the same person. Setup is free and admin is light, but if the business is sued or owes money, your house, savings, and other earnings are all on the line. Tax is also paid at your full personal rates regardless of whether you actually need the cash.",
  },
  'structures/partnership': {
    summary:
      "A general partnership is just two or more sole traders sharing one business. It's cheap and easy, but every partner is personally on the hook for the others' decisions and debts — one bad partner can pull everyone else down. For most modern situations an LLP is a safer version of the same idea.",
  },
  'structures/ltd': {
    summary:
      "As a sole trader, you and the business are legally the same — your assets are at risk if the business fails. As a Ltd, the company is a separate legal entity, your personal assets are protected, and you usually pay less tax — but with more admin and rules. Incorporation usually starts making sense once profits exceed roughly £30k–£50k a year, depending on your situation.",
    mistakes: [
      {
        id: 'no-separate-bank',
        title: 'Mixing personal and company money',
        body:
          'A new Ltd director pays for company costs from their personal card "and sorts it later." Six months later the books are a mess, expenses are unrecoverable, and HMRC scrutinises the company\'s deductions. Cleaning it up costs £1,500 in extra accountancy time. The fix: open a dedicated business bank account on day one and use it exclusively.',
      },
      {
        id: 'salary-out-of-habit',
        title: 'Paying salary at "what feels normal"',
        body:
          'A Ltd director pays themselves £60,000 as salary because their old employer paid them that much. Their accountant later points out they could have taken £12,570 as salary (covering personal allowance) and £47,430 as dividends, saving roughly £4,500 in NI alone — money that would have stayed in their pocket. The fix: review extraction strategy in the first quarter, not after three years.',
      },
    ],
  },
  'structures/llp': {
    summary:
      "An LLP gives you partnership-style tax (each member is taxed personally on their share) plus limited liability — so one partner's mess doesn't sink everyone. It's the standard structure for professional partnerships like lawyers or architects. You don't get the lower corporate tax rate on retained profits that a Ltd gives you.",
  },
  'structures/holding': {
    summary:
      "A holding company sits above your trading company(ies) and owns them. Cash sweeps up tax-free between UK companies, so you can park retained profit in the holding company away from operational risk and use it to fund new ventures or investments. Worth the extra admin and accountant cost once you have meaningful retained cash or more than one business line.",
  },
  'structures/fic': {
    summary:
      "A Family Investment Company is a Ltd designed to hold investments and pass wealth across generations at corporate tax rates instead of personal ones. It's a long-horizon tool — usually only worth the setup cost above £500k of investable capital and with a multi-decade plan. Heavy on admin; get specialist advice before going down this road.",
  },
  'structures/psc': {
    summary:
      "A Personal Service Company is just a Ltd that exists to invoice for one person's work. It used to be a slam-dunk tax saver for contractors. Today, IR35 rules mean if you only have one client and look like their employee, HMRC can tax you as one — wiping out most of the tax advantage and adding compliance pain.",
  },
  'structures/trust': {
    summary:
      "A trust separates legal ownership of assets (with the trustee) from who benefits (the beneficiary). Trusts are powerful for asset protection and multi-generation planning, but UK rules since 2006 have made many trust structures less tax-efficient than alternatives. Always specialist advice — DIY trusts go wrong expensively.",
  },

  // ----- UK Specifics --------------------------------------------------
  'uk/corporation-tax': {
    summary:
      "Corporation tax is the tax your UK company pays on its profits. The rate slides from 19% on small profits up to 25% on bigger profits, with a tapered band in between — meaning the marginal rate inside the band is actually higher than 25%. Knowing which side of the bands you sit on guides whether to bring expenses forward or push them out.",
  },
  'uk/income-tax': {
    summary:
      "Income tax in the UK is layered: the first £12,570 is free, then 20%, then 40% above ~£50k, and 45% above £125k. National Insurance sits on top. Between £100k and £125,140 you also lose your £12,570 tax-free allowance, which creates a 60%+ effective rate in that band — one of the most worth-knowing edges in UK tax.",
    mistakes: [
      {
        id: 'taper-bonus',
        title: 'Taking the year-end bonus that pushes through £100k',
        body:
          "A director takes a £15,000 dividend in March, pushing their total income from £98k to £113k. Inside the £100k–£125k band, every extra £2 of income removes £1 of tax-free allowance — the effective rate on that £15k is roughly 60%, not 40%. Pension-contributing £15k instead, or deferring the dividend to the next tax year, would have saved roughly £3,000. The fix: model income against the £100k edge before declaring extras in March.",
      },
    ],
  },
  'uk/dividends': {
    summary:
      "Dividends are how Ltd shareholders get paid out of post-tax company profit. They use lower rates than salary (10.75%/35.75%/39.35%) and skip National Insurance entirely. The catch: the company already paid corporation tax on the profit before declaring the dividend, so you have to compare the round-trip total to make a fair call.",
  },
  'uk/salary-vs-dividend': {
    summary:
      "Most owner-directors pay themselves a small salary up to the personal allowance (£12,570), and take the rest as dividends. Salary is deductible for the company, while dividends use lower personal rates and skip NI — and the combination usually beats taking it all one way or the other. Pension contributions through the company are often the third leg of an even cheaper strategy.",
    mistakes: [
      {
        id: 'salary-vs-dividend-flat',
        title: 'Paying yourself only as salary',
        body:
          "A Ltd company director pays themselves £60,000 as salary out of habit. Their accountant later points out they could have taken £12,570 as salary (covering personal allowance) and £47,430 as dividends, saving roughly £4,500 in NI alone. They had been overpaying for three years — about £13,500 of avoidable tax. The fix: a one-hour review of extraction strategy in the first month of any new Ltd.",
      },
    ],
  },
  'uk/directors-loan': {
    summary:
      "Money you pull from your company that isn't salary, dividend, expense reimbursement, or pension contribution sits as a loan from the company to you. If you don't repay it within nine months and one day of year-end, the company gets hit with a 35.75% extra corporation tax charge on the unpaid amount. Easy to forget; expensive when you do.",
    mistakes: [
      {
        id: 's455',
        title: 'Forgetting the £15k "I borrowed it briefly"',
        body:
          'A director takes £15,000 from the company as a loan, planning to repay it within the year. They forget. Nine months after year-end, the unpaid loan triggers a 35.75% s455 charge — about £5,400 of tax payable by the company. The cash is recoverable later when they repay, but it sits at HMRC for years. The fix: reconcile the director\'s loan account against year-end, every year, no exceptions.',
      },
    ],
  },
  'uk/vat': {
    summary:
      "Once your taxable turnover crosses £90,000 in any rolling 12 months, you must register for VAT, charge it on your sales, and remit the difference to HMRC every quarter. For B2B businesses VAT is mostly neutral; for B2C businesses it effectively makes you 16.7% more expensive overnight. Tracking turnover monthly is the difference between a clean transition and a nasty surprise.",
    mistakes: [
      {
        id: 'late-vat-registration',
        title: 'Missing the £90k threshold by accident',
        body:
          "A consultant crosses the £90,000 VAT threshold in October and doesn't register, assuming it's annual rather than rolling. By the time HMRC notices six months later, they owe back-VAT on six months of revenue plus penalties — easily £8,000–£12,000 of unbudgeted cost. The fix: a £0 calendar reminder that flags any month when rolling 12-month turnover crosses £80k.",
      },
    ],
  },
  'uk/rd': {
    summary:
      "If your company is genuinely solving technical problems where the answer isn't already known, HMRC will subsidise that work via R&D tax credits (a roughly 20% above-the-line credit on qualifying spend). Lots of software, engineering, and product companies qualify and don't claim. HMRC has tightened scrutiny — claim honestly, with proper documentation.",
    mistakes: [
      {
        id: 'rd-not-claiming',
        title: 'Not claiming because it doesn\'t feel like "real research"',
        body:
          'A SaaS founder doesn\'t claim R&D credits because they assume their work isn\'t "real research." Their development work — building novel software architecture, solving non-trivial technical challenges — actually qualifies. Over four years they leave roughly £60,000 of credits unclaimed, money they could have used to extend runway or hire. The fix: an hour with an R&D specialist before assuming you don\'t qualify.',
      },
    ],
  },
  'uk/eis-seis': {
    summary:
      "EIS and SEIS are how the UK incentivises private investors to back early-stage companies — the investor gets 30%–50% income-tax relief plus CGT advantages, in exchange for taking real equity risk. As a founder, structuring your raise as EIS/SEIS-eligible is often the difference between getting funded and not. Get advance assurance from HMRC before you raise, not after.",
  },
  'uk/pensions': {
    summary:
      "Pension contributions paid by your company on your behalf escape corporation tax, NI, and personal income tax all at once — making them one of the cheapest possible ways to move money from the company into your long-term wealth. The £60,000 annual allowance plus three years of carry-forward is generous, but the cash is locked until your late 50s.",
    mistakes: [
      {
        id: 'no-carry-forward',
        title: 'Letting carry-forward expire',
        body:
          "A founder finally has a profitable year and contributes £60,000 to their pension. They didn't realise unused annual allowance from the previous three years could have been used too — they could have made a one-off £200,000+ contribution from accumulated profits, saving roughly £40,000 in tax. The fix: review unused allowance at every year-end, not just when you finally have spare cash.",
      },
    ],
  },
  'uk/cgt': {
    summary:
      "When you sell something for more than you paid (shares, property, a business), the gain is taxed — but at lower rates than ordinary income (currently 18% basic and 24% higher rate). The annual exemption is now tiny at £3,000, so timing sales across tax years and using both spouses' allowances has gone from optional to material.",
  },
  'uk/badr': {
    summary:
      "BADR cuts the CGT rate to 18% on the first £1m of lifetime gains when you sell a qualifying business — a roughly 6-percentage-point saving versus the headline rate, worth £60,000 on a £1m sale. The catch: you have to genuinely qualify for two full years before the sale, and the rules are strict. Don't change share structures or behaviour close to a sale without checking BADR impact first.",
    mistakes: [
      {
        id: 'last-minute-share-class',
        title: 'Adding a share class 18 months before the sale',
        body:
          "A founder builds a successful Ltd company over six years, then decides to sell. They start the sale process before checking BADR eligibility, and a small structural detail — a new share class introduced 18 months earlier — disqualifies them. They pay the full 24% CGT instead of 18%, costing roughly £60,000 on a £1m sale. The fix: discuss any structural change with an adviser, and plan the sale 2+ years ahead.",
      },
    ],
  },
  'uk/ir35': {
    summary:
      "If you contract through your own Ltd but the day-to-day reality looks like being someone's employee — single client, fixed hours, doing what they say — HMRC can tax you as if you were on payroll. The advantage of running through a Ltd shrinks dramatically. The defence is genuine independence: multiple clients, real risk of loss, freedom to substitute, your own tools.",
    mistakes: [
      {
        id: 'ir35-single-client',
        title: 'Running a contractor Ltd with one embedded client',
        body:
          'A contractor invoices through their Ltd for a single client they sit alongside as if employed — same hours, same desk, same projects. After three years, HMRC challenges and reclassifies the engagement as inside IR35. The contractor owes back PAYE and NI of roughly £25,000–£40,000, plus penalties. The fix: build genuine multi-client independence early, document it, and re-evaluate annually.',
      },
    ],
  },
  'uk/groups': {
    summary:
      "Once you have meaningful retained cash or more than one business line, putting a holding company above your trading companies lets you sweep cash up tax-free, isolate operational risk in each subsidiary, and sell one business cleanly without disturbing the others. The cost is two sets of accounts and tighter CT thresholds — usually only worth it once a single trading company has £200k+ of cash that isn't immediately for the trade.",
  },
  'uk/isa': {
    summary:
      "An ISA is a personal wrapper that protects up to £20,000/year of savings or investments from any further tax — growth and withdrawals are free of income tax and CGT for life. A LISA is a £4,000/year subset for under-40s with a 25% government bonus, but the cash is locked until first-home or age 60. Both are obvious places to put surplus personal cash.",
  },
  'uk/iht': {
    summary:
      "When you die, the value of your estate above ~£325k–£500k is taxed at 40%. Trading-company shares often qualify for Business Property Relief and pay no IHT — but only if the company is genuinely trading, which excess cash piles or property holdings can quietly disqualify. Plan early, review often, and don't structure a 30-year strategy around any single relief without ongoing review.",
    mistakes: [
      {
        id: 'cash-pile-bpr',
        title: 'Letting the cash pile knock out BPR',
        body:
          "A founder has built up £700,000 of retained cash inside their trading Ltd. They die. Because the cash is no longer obviously \"used in the trade,\" HMRC challenges the BPR claim — the family pays IHT on a chunk of the company value at 40%. A holding-company structure five years earlier could have neutralised the issue. The fix: review BPR posture annually if your trading company carries large non-operational reserves.",
      },
    ],
  },

  // ----- Worked scenarios ---------------------------------------------
  'scenarios/first-freelancer': {
    summary:
      "If you're a freelancer making under ~£40k profit, sole trader is usually fine. Above ~£60k it starts tilting toward Ltd. Above ~£80k a Ltd almost always wins on tax even if you extract everything — and wins by a wide margin if you don't.",
  },
  'scenarios/100k-decision': {
    summary:
      "£100k is where the UK personal allowance starts disappearing — every extra £2 of income removes £1 of allowance, creating an effective 60% marginal rate up to £125,140. As a sole trader you can't dodge it; as a Ltd you choose how much to extract and can stay under the edge.",
  },
  'scenarios/side-hustle': {
    summary:
      "Most side hustles should start as sole trader — admin overhead matters more when revenue is small and sporadic. The exception is if you're confident profits will exceed ~£30–40k quickly, or your day-job contract restricts outside trading. Year-1 losses can offset employment income — a real benefit a Ltd doesn't share.",
  },
  'scenarios/going-fulltime': {
    summary:
      "When you go full-time, decide your structure deliberately rather than carrying over the sole-trader habit. Open the Ltd at incorporation, set the salary at the personal allowance, and open a separate bank account on day one. Backdating decisions later is messy and expensive.",
  },
  'scenarios/multi-business': {
    summary:
      "Once you have two or three real ventures, each large enough to matter, a holding company over each trading subsidiary becomes the cleaner answer. Cash sweeps tax-free between UK group companies, you can sell one business without disturbing the others, and one business's bad year doesn't sink the others.",
  },
  'scenarios/first-employee': {
    summary:
      "Hiring crosses you into payroll, employer NI, auto-enrolment pensions, and HR obligations — the fully-loaded cost of a £40k employee is closer to £48k–£50k. Don't dodge it by misclassifying the hire as a contractor; the IR35 / employment-status fight is exhausting and expensive.",
  },
  'scenarios/selling-business': {
    summary:
      "Plan a business sale 2+ years ahead, not 6 months ahead. BADR (18% CGT on the first £1m of gain) requires you to qualify for the full two years before the sale — and small late-stage structural changes can disqualify you. Strip excess cash, tidy share classes, and clear any director's loans well in advance.",
  },
  'scenarios/pension-extraction': {
    summary:
      "If your company is generating profit beyond what you need for living costs, the pension is usually the cheapest way to move that surplus to your personal balance sheet. Annual allowance is £60k, plus three years of carry-forward, so a one-off £200k+ contribution is on the table after a profitable year.",
  },
  'scenarios/holding-diversification': {
    summary:
      "When a single trading Ltd has £200k+ of cash that isn't immediately needed for the trade, you start risking BPR/BADR qualification (the company looks less like a \"trading\" one). A holding company above the trading company, with cash drip-fed up tax-free, isolates the cash without disturbing operations.",
  },
  'scenarios/international-saas': {
    summary:
      "A UK Ltd selling SaaS globally usually pays UK corporation tax on all profit, with VAT collected per the customer's location for B2C digital sales. The rules get complicated when you put real headcount in another country — that can create a taxable presence (\"PE\") there. For most early-stage SaaS, stay UK-tax-resident, mind the digital VAT rules, and revisit when you start hiring abroad.",
  },

  // ----- Patterns -----------------------------------------------------
  'patterns/retention': {
    summary:
      "Almost every developed country taxes profits inside a company at a lower rate than profits in your personal pocket. So if you don't need the cash today, leaving it inside the company and reinvesting compounds at a lower tax drag than extracting and reinvesting personally.",
  },
  'patterns/capital-gains': {
    summary:
      'Selling an asset is taxed at lower rates than earning income. Most countries reward you for taking long-term capital risk by giving you a discounted tax rate when the bet pays off. Identifying when income can legitimately be turned into a capital gain is a major source of tax efficiency.',
  },
  'patterns/deferral': {
    summary:
      "Tax paid in 10 years is worth less in real terms than tax paid today. Every pension, retirement account, capital allowance, and roll-over relief is an instance of this same idea: legally pushing the bill into the future.",
  },
  'patterns/classification': {
    summary:
      "Tax codes give different rates to salary, dividends, interest, capital gains, and royalties — economically similar flows of money, legally different labels. A lot of planning is about choosing (legitimately) which label your money carries.",
  },
  'patterns/incentive': {
    summary:
      "Where a government wants more of something — R&D, pensions, green energy, risk capital — it makes that activity cheaper through the tax code. If your business naturally does any of these things, you're leaving free money on the table by not claiming.",
  },
  'patterns/threshold': {
    summary:
      "Every bracketed tax system has cliff edges where the marginal rate jumps. Smart planning sits just below the kink — paying a pension contribution to drop back under £100k, deferring revenue to next year, or staying just under the VAT threshold.",
  },
  'patterns/timing': {
    summary:
      "Most UK allowances reset every tax year — the CGT exemption, dividend allowance, ISA allowance, and pension annual allowance. Splitting one transaction across two tax years can use both years' allowances and effectively double the relief.",
  },
  'patterns/structure': {
    summary:
      "The same activity through different legal structures — sole trader, Ltd, LLP, holding company — gets different tax treatment. Pick the structure deliberately, before the activity, and you avoid forcing a square peg into a round hole later.",
  },
  'patterns/residence': {
    summary:
      "Where you (and your entities) are tax-resident shapes everything. Most countries tax their residents on worldwide income; non-residents only on local income. Crossing borders changes your tax bill, sometimes dramatically.",
  },
  'patterns/relief': {
    summary:
      "Reliefs are deliberate carve-outs — for charity, R&D, business sales, reinvestment. Spotting which reliefs apply to your situation is a core skill of any decent adviser. Don't assume your situation is generic; reliefs are often hyper-specific.",
  },
  'patterns/double-tax': {
    summary:
      "The same money would sometimes be taxed twice — corporation tax then dividend tax, or by two countries on cross-border income. Most systems have credits, exemptions, or treaties that reduce the double-counting, but they're never seamless.",
  },
  'patterns/substance': {
    summary:
      'Tax authorities care about economic reality, not just paperwork. A structure that has the form of A but the substance of B will be challenged and treated as B. This is the limit on how much "label engineering" you can do.',
  },
};

export function getLessonExtras(pageId: string): LessonExtras | undefined {
  return LESSON_EXTRAS[pageId];
}
