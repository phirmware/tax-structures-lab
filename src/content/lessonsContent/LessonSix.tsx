import { useState } from 'react';
import { Check, X } from '../../components/ui/Icons';

const QUIZ: { id: string; item: string; verdict: 'yes' | 'no' | 'depends'; why: string }[] = [
  {
    id: 'laptop',
    item: 'A laptop bought solely for client work',
    verdict: 'yes',
    why: "Wholly and exclusively for the trade. Capital allowances or AIA apply.",
  },
  {
    id: 'suit',
    item: 'A new suit you bought for a client meeting',
    verdict: 'no',
    why: 'Clothing for general use is dual purpose. Mallalieu v Drummond — disallowed.',
  },
  {
    id: 'phone',
    item: 'Your mobile phone, used 70% for work',
    verdict: 'depends',
    why: 'Personally owned: only the business-use portion. In a company contract: usually fully deductible (with a small BiK if any).',
  },
  {
    id: 'lunch',
    item: 'Lunch with a prospective client',
    verdict: 'no',
    why: 'Client entertaining is not deductible for corporation tax. (Staff entertaining is.)',
  },
  {
    id: 'training',
    item: 'A course updating your skills in your existing trade',
    verdict: 'yes',
    why: 'Maintaining or updating skills used in the trade is allowed. New skills for a new trade are not.',
  },
  {
    id: 'coffee',
    item: 'Coffee while working from a café',
    verdict: 'no',
    why: 'Subsistence at a regular workplace fails the "wholly and exclusively" test.',
  },
  {
    id: 'home-office',
    item: 'A proportion of your home heating bill',
    verdict: 'yes',
    why: 'Reasonable proportion for the room used as an office. HMRC publishes flat rates if you prefer.',
  },
  {
    id: 'commute',
    item: 'Train fare from home to your usual office',
    verdict: 'no',
    why: 'Ordinary commuting is private. Travel between work locations or to clients is allowed.',
  },
];

export function LessonSix() {
  const [answers, setAnswers] = useState<Record<string, 'yes' | 'no' | 'depends'>>({});

  const score = QUIZ.filter((q) => answers[q.id] === q.verdict).length;
  const total = QUIZ.length;

  return (
    <>
      <h2>Why expenses reduce your tax</h2>
      <p>
        The principle is mechanical: tax is on profit, profit is revenue minus deductible costs,
        so any cost that's deductible reduces tax. Every other deductions question hangs off
        that one sentence.
      </p>
      <p>
        The boundary is set by a phrase HMRC uses constantly: <em>wholly and exclusively for the
        purposes of the trade</em>. If a cost is dual-purpose (you'd have spent it anyway for
        personal reasons), it usually isn't deductible.
      </p>

      <h3>Where the boundary actually sits</h3>
      <ul>
        <li>
          <strong>Wholly business</strong> — laptop used only for client work, software
          subscriptions, professional indemnity insurance: deductible.
        </li>
        <li>
          <strong>Mixed use</strong> — phone, vehicle, home office: deductible <em>in
          proportion</em> to business use, with reasonable evidence.
        </li>
        <li>
          <strong>Personal in nature</strong> — clothes for "looking professional," haircuts,
          gym membership: not deductible, even if they help you do business.
        </li>
        <li>
          <strong>Special-rule items</strong> — client entertainment (not deductible for CT but
          can be a legitimate cost), staff entertainment (deductible up to £150/head),
          political donations: each has its own rule.
        </li>
      </ul>

      <h3>Why this is rigorously enforced</h3>
      <p>
        Every personal expense disguised as business is, in effect, a tax cut at full rate.
        Tax authorities police the line because if they didn't, every freelancer would put
        their groceries through the company.
      </p>
      <p>
        For founders the practical posture is: be generous with what's clearly business, be
        careful with what's grey, don't push obvious personal items through.
      </p>

      <h3>Quick quiz</h3>
      <p>For each item, decide if the typical business owner can deduct it.</p>

      <div className="not-prose my-6 rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900">
        <ul className="divide-y divide-ink-200 dark:divide-ink-800">
          {QUIZ.map((q) => {
            const chosen = answers[q.id];
            const correct = chosen && chosen === q.verdict;
            return (
              <li key={q.id} className="py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="text-sm">{q.item}</div>
                  <div className="flex gap-1">
                    {(['yes', 'no', 'depends'] as const).map((opt) => {
                      const isChosen = chosen === opt;
                      const isCorrect = q.verdict === opt;
                      return (
                        <button
                          key={opt}
                          className={
                            'rounded-md px-2 py-1 text-xs ' +
                            (isChosen
                              ? isCorrect
                                ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-200'
                                : 'bg-danger-500/20 text-danger-500'
                              : 'text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800')
                          }
                          onClick={() =>
                            setAnswers((a) => ({ ...a, [q.id]: opt }))
                          }
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {chosen && (
                  <div
                    className={
                      'mt-2 flex items-start gap-2 text-xs ' +
                      (correct
                        ? 'text-accent-700 dark:text-accent-300'
                        : 'text-ink-600 dark:text-ink-300')
                    }
                  >
                    {correct ? (
                      <Check className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <X className="h-3.5 w-3.5 shrink-0 text-danger-500" />
                    )}
                    <span>
                      <strong>
                        {correct ? 'Right: ' : `Actually "${q.verdict}" — `}
                      </strong>
                      {q.why}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-3 text-xs text-ink-500 dark:text-ink-400">
          Score: {score}/{total}
        </div>
      </div>

      <h3>What to take away</h3>
      <ul>
        <li>
          The "wholly and exclusively" test is the bedrock. Most edge cases come down to it.
        </li>
        <li>
          Mixed-use items are fine — apportion them honestly.
        </li>
        <li>
          Don't dress up personal as business. The downside isn't just disallowance; it's
          interest, penalties, and trust with HMRC.
        </li>
      </ul>
    </>
  );
}
