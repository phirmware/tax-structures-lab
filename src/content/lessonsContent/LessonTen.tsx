const INCENTIVES = [
  {
    country: 'United Kingdom',
    incentives: [
      ['R&D credits', 'Reward genuine experimentation in science / tech'],
      ['EIS / SEIS', 'Get private investors to fund risky early-stage companies'],
      ['Pension contributions', 'Defer income tax to encourage retirement saving'],
      ['Patent Box', 'Encourage UK-resident IP ownership'],
      ['Capital allowances / AIA', 'Encourage investment in plant and machinery'],
      ['BADR', 'Reduced CGT for founders selling their business'],
    ],
  },
  {
    country: 'United States',
    incentives: [
      ['QSBS (§1202)', 'Up to $10m gain tax-free on qualified small-business stock held 5+ yrs'],
      ['§174 R&E', 'Capitalised R&D expensing, special amortisation rules'],
      ['401(k) / IRA', 'Tax-deferred / tax-free retirement saving'],
      ['Opportunity Zones', 'Defer / reduce CGT on investments into designated zones'],
      ['Bonus depreciation', 'Accelerate equipment write-offs'],
    ],
  },
  {
    country: 'Canada',
    incentives: [
      ['SR&ED', 'Refundable credit for R&D — generous for CCPCs'],
      ['Lifetime Capital Gains Exemption', 'Up to ~$1m gain tax-free on QSBC shares'],
      ['RRSP / TFSA', 'Tax-deferred and tax-free saving wrappers'],
      ['Small business deduction', 'Reduced CT rate on first ~$500k of active income'],
    ],
  },
  {
    country: 'Singapore',
    incentives: [
      ['Start-up Tax Exemption', '75% off first S$100k of profit, 50% off next S$100k for 3 years'],
      ['Pioneer / Development & Expansion', 'Negotiable tax holidays for substantive operations'],
      ['IP Development Incentive', 'Concessionary rates on qualifying IP income'],
    ],
  },
  {
    country: 'Australia',
    incentives: [
      ['R&D Tax Incentive', 'Refundable credit for eligible R&D'],
      ['Small Business CGT concessions', '15-yr exemption, retirement, rollover, 50% reduction'],
      ['Superannuation', 'Concessional contributions — analogous to pensions'],
    ],
  },
];

export function LessonTen() {
  return (
    <>
      <h2>The tax code is a list of things the government wants you to do</h2>
      <p>
        Read any country's tax code and you can almost reconstruct its industrial policy. R&D
        credits exist because governments want innovation. Pension reliefs exist because they
        don't want everyone broke at 80. EIS exists because fast-growing companies struggle to
        raise risk capital. Patent boxes exist because IP-heavy economies want to keep the IP
        on their soil.
      </p>
      <p>
        When your activity happens to align with what the tax code wants, you get rewarded. The
        skill is recognising the alignment <em>before</em> you've already done the activity, so
        you actually claim the relief.
      </p>

      <h3>The pattern across countries</h3>
      <p>
        Most developed economies share five categories of incentive — they vary in name and
        generosity, but the rationale is identical:
      </p>
      <ul>
        <li>
          <strong>Innovation</strong> — R&D credits, patent boxes, IP regimes
        </li>
        <li>
          <strong>Investment</strong> — EIS / VCT / QSBS / accelerated depreciation
        </li>
        <li>
          <strong>Retirement saving</strong> — pensions, 401(k), RRSP, super
        </li>
        <li>
          <strong>Founder exit</strong> — BADR, QSBS, lifetime capital gains exemption
        </li>
        <li>
          <strong>Specific policy</strong> — green energy, regional zones, hiring credits
        </li>
      </ul>

      <h3>A non-exhaustive cross-jurisdiction list</h3>

      <div className="not-prose my-4 grid gap-4 md:grid-cols-2">
        {INCENTIVES.map((c) => (
          <div
            key={c.country}
            className="rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900"
          >
            <div className="font-semibold">{c.country}</div>
            <ul className="mt-2 space-y-1.5 text-sm">
              {c.incentives.map(([name, why]) => (
                <li key={name}>
                  <span className="font-medium">{name}</span>{' '}
                  <span className="text-ink-500 dark:text-ink-400">— {why}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h3>The mistake: chasing the relief</h3>
      <p>
        Tax incentives reward behaviour the government already wants. The mistake — common among
        founders — is to do the activity <em>because</em> of the relief, when the activity
        itself doesn't actually make commercial sense.
      </p>
      <p>
        If you're going to spend £100k on R&D, claim the credit. If you wouldn't have spent the
        £100k except to claim the credit, you're paying full price for a partial discount.
      </p>

      <h3>What to take away</h3>
      <ul>
        <li>
          Tax incentives are policy levers — they tell you what governments want.
        </li>
        <li>
          When your activity aligns, claim. When the alignment is the only reason for the
          activity, reconsider.
        </li>
        <li>
          The patterns repeat across jurisdictions. Once you can name them in the UK, you can
          spot them anywhere.
        </li>
      </ul>
    </>
  );
}
