import { useState } from 'react';
import { G } from '../../components/ui/Glossary';
import { formatGBP } from '../../lib/format';

export function LessonOne() {
  return (
    <>
      <h2>The structural decision behind every business</h2>
      <p>
        Before tax, before structures, before any of this matters, there is a question: <em>who
        is doing the business?</em> You, personally? Or some legal entity that is separate from
        you?
      </p>
      <p>
        For most of human history, the answer was the first one. If your bakery burned down and
        the customer in the corner was injured, your house could be sold to pay them. There was
        no boundary between you and your trade.
      </p>
      <p>
        We invented the <strong>company</strong> to draw that boundary. A limited company is a
        legal fiction — a "person" that can own assets, owe debts, sign contracts, sue and be
        sued. Crucially, when it goes bankrupt, you, the shareholder, lose only what you put in.
        The judgment doesn't follow you home.
      </p>

      <h3>Why this is the foundation of everything else</h3>
      <p>
        Once a company is a separate legal person, it follows that:
      </p>
      <ul>
        <li>
          The company can have <strong>its own income</strong> (revenue, contracts, royalties).
        </li>
        <li>
          The company can have <strong>its own expenses</strong> (salaries, rent, inputs).
        </li>
        <li>
          The company can have <strong>its own profit</strong> — and therefore its own tax bill.
        </li>
        <li>
          You, the owner, are taxed only when money <em>leaves the company</em> and lands in
          your hands.
        </li>
      </ul>
      <p>
        Every tax planning idea you'll meet in the rest of this app — <G term="retained earnings">retention</G>,
        salary vs. <G term="dividend">dividends</G>, <G term="pension">pensions</G>, <G term="capital gains">capital gains</G> on exit — only exists because we drew this
        boundary.
      </p>

      <h3>Interactive: what happens when the business gets sued</h3>
      <p>
        Drag the slider to see what a £200,000 lawsuit does to a sole trader vs. a company with
        £20,000 in its bank account.
      </p>

      <LawsuitWidget />

      <h3>The tradeoff</h3>
      <p>
        Limited liability isn't free. In exchange for the protection, you accept:
      </p>
      <ul>
        <li>Filing duties (annual accounts, tax returns, confirmation statements)</li>
        <li>Statutory director responsibilities (you can be personally liable if you breach them)</li>
        <li>The cost of running an entity (formation, accountancy, banking)</li>
      </ul>
      <p>
        For very small ventures, the cost of running an entity exceeds the benefit. As soon as
        the business is doing real money or carrying real risk, the calculus flips hard.
      </p>

      <h3>What to take away</h3>
      <ul>
        <li>A <G term="limited company">limited company</G> is a legal fiction we invented to <em>separate the person from the business</em>.</li>
        <li>Everything else in this curriculum — every tax pattern, every structure — is built on top of this separation.</li>
        <li>The price of the separation is paperwork. The reward is that one bad year doesn't destroy you.</li>
      </ul>
    </>
  );
}

function LawsuitWidget() {
  const [claim, setClaim] = useState(50_000);
  const personalAssets = 250_000;
  const companyAssets = 20_000;

  const personalLoss = Math.min(claim, personalAssets);
  const companyLoss = Math.min(claim, companyAssets);
  const ownerLossViaCompany = Math.min(claim, companyAssets); // the shareholder loses only the company

  return (
    <div className="not-prose my-6 rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <label className="block">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-sm font-medium">Claim against the business</span>
          <span className="font-mono text-sm tabular-nums text-danger-500">
            {formatGBP(claim)}
          </span>
        </div>
        <input
          type="range"
          min={1_000}
          max={500_000}
          step={1_000}
          value={claim}
          onChange={(e) => setClaim(Number(e.target.value))}
          className="w-full accent-accent-600"
        />
      </label>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-danger-500/30 bg-danger-500/5 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-danger-500">
            Sole trader
          </div>
          <p className="mt-1 text-xs text-ink-600 dark:text-ink-300">
            Personal assets exposed. House, car, savings — fair game.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <Stat label="Personal assets at risk" value={formatGBP(personalAssets)} />
            <Stat label="Loss to you" value={formatGBP(personalLoss)} tone="bad" />
          </div>
        </div>
        <div className="rounded-lg border border-accent-500/30 bg-accent-500/5 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
            Limited company
          </div>
          <p className="mt-1 text-xs text-ink-600 dark:text-ink-300">
            Only the company's assets are exposed. Your home is yours.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <Stat label="Company assets" value={formatGBP(companyAssets)} />
            <Stat label="Loss to you" value={formatGBP(ownerLossViaCompany)} tone="ok" />
          </div>
          {claim > companyAssets && (
            <p className="mt-3 text-[11px] text-ink-500 dark:text-ink-400">
              The remaining {formatGBP(claim - companyAssets)} is unrecoverable from you,
              assuming no personal guarantees and no breach of director duties.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'ok' | 'bad' }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {label}
      </div>
      <div
        className={
          'font-mono text-sm tabular-nums ' +
          (tone === 'ok'
            ? 'text-accent-700 dark:text-accent-300'
            : tone === 'bad'
            ? 'text-danger-500'
            : '')
        }
      >
        {value}
      </div>
    </div>
  );
}
