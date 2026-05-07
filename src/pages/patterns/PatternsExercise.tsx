import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import { PATTERNS } from '../../content/patterns';
import { Check, X } from '../../components/ui/Icons';
import { useAppState } from '../../state/AppState';

interface Exercise {
  id: string;
  country: string;
  scenario: string;
  expected: string[]; // pattern ids
  explanation: string;
}

const EXERCISES: Exercise[] = [
  {
    id: 'us-qsbs',
    country: 'US',
    scenario:
      'A US founder sells qualifying small-business stock (QSBS) held for 5+ years and pays 0% federal tax on the first $10m of gain.',
    expected: ['capital-gains', 'incentive', 'relief'],
    explanation:
      'QSBS is a relief (specific carve-out), an incentive (encourages early-stage investment), and an instance of capital-gains preferential treatment.',
  },
  {
    id: 'sg-pioneer',
    country: 'Singapore',
    scenario:
      "A multinational negotiates a Singapore Pioneer / Development & Expansion incentive and pays a concessionary corporate tax rate on qualifying income for 5 years.",
    expected: ['incentive', 'substance', 'residence'],
    explanation:
      'Incentive (rate cut for desired activity); substance (real operations required); residence (tax allocation depends on local presence).',
  },
  {
    id: 'uk-bonus-deferral',
    country: 'UK',
    scenario:
      "A founder who's just crossed into the £100k taper agrees with the company to defer her year-end bonus into a pension contribution.",
    expected: ['threshold', 'deferral', 'classification'],
    explanation:
      'Threshold (the £100k taper edge), deferral (pension defers tax to retirement), classification (re-labelling salary into pension contribution).',
  },
  {
    id: 'ca-ccpc',
    country: 'Canada',
    scenario:
      "A Canadian-controlled private corporation (CCPC) gets the small business deduction on its first ~$500k of active income and pays a sharply reduced federal rate.",
    expected: ['retention', 'incentive', 'threshold'],
    explanation:
      'Retention (lower rate to compound inside the corp), incentive (favouring small businesses), threshold (kicks in below $500k of active income).',
  },
  {
    id: 'au-super',
    country: 'Australia',
    scenario:
      "An Australian sole director routes part of his salary into superannuation. The contribution is concessionally taxed at 15% inside super, and benefits taxed favourably on retirement withdrawal.",
    expected: ['deferral', 'incentive'],
    explanation:
      'Deferral (tax on the way out, often at lower rates), incentive (encouraging retirement saving).',
  },
  {
    id: 'eu-pe',
    country: 'Cross-border',
    scenario:
      "A UK Ltd opens an office and hires sales staff in Germany. Germany asserts a 'permanent establishment' and taxes the German-sourced profit there.",
    expected: ['residence', 'substance', 'double-tax'],
    explanation:
      'Residence (where the activity is taxed), substance (real presence triggers tax), double-tax (treaty mechanisms decide which side gets what).',
  },
  {
    id: 'uk-fic',
    country: 'UK',
    scenario:
      "A family forms a Family Investment Company, contributes investments, and structures shares so children participate in capital growth without immediate tax events.",
    expected: ['structure', 'retention', 'classification'],
    explanation:
      'Structure (entity choice), retention (corporate-rate growth), classification (capital growth on children\'s shares vs immediate income).',
  },
  {
    id: 'us-vehicle-credit',
    country: 'US',
    scenario:
      'A small business buys an electric vehicle and claims a clean-vehicle tax credit, accelerating the recovery via bonus depreciation.',
    expected: ['incentive', 'deferral', 'relief'],
    explanation:
      'Incentive (credit nudges electric purchase), deferral / acceleration (bonus depreciation pulls deduction forward), relief (specific carve-out).',
  },
];

export function PatternsExercise() {
  const { state, recordPatternAnswer } = useAppState();
  const [activeIdx, setActiveIdx] = useState(0);
  const ex = EXERCISES[activeIdx];
  const [selection, setSelection] = useState<string[]>(
    () => state.patternQuiz[ex.id]?.split(',').filter(Boolean) ?? [],
  );

  const checkSelection = () => {
    const correct =
      ex.expected.every((p) => selection.includes(p)) &&
      selection.every((s) => ex.expected.includes(s));
    return correct;
  };
  const submitted = Boolean(state.patternQuiz[ex.id]);
  const correct = submitted ? checkSelection() : false;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Patterns · Recognition exercise"
        title="Spot the pattern"
        description="Each scenario activates one or more universal patterns. Pick all that apply, then check yourself."
        pageId="patterns/exercise"
      />
      <DisclaimerBanner compact />

      <div className="flex flex-wrap gap-2">
        {EXERCISES.map((e, i) => {
          const stored = state.patternQuiz[e.id];
          const sel = stored?.split(',').filter(Boolean) ?? [];
          const right = stored
            ? e.expected.every((p) => sel.includes(p)) &&
              sel.every((s) => e.expected.includes(s))
            : null;
          return (
            <button
              key={e.id}
              className={
                'rounded-full border px-3 py-1 text-xs ' +
                (i === activeIdx
                  ? 'border-accent-500 bg-accent-50 text-accent-800 dark:bg-accent-900/40 dark:text-accent-200'
                  : 'border-ink-200 dark:border-ink-700 hover:bg-ink-100 dark:hover:bg-ink-800')
              }
              onClick={() => {
                setActiveIdx(i);
                setSelection(state.patternQuiz[e.id]?.split(',').filter(Boolean) ?? []);
              }}
            >
              {i + 1} · {e.country}
              {right === true && (
                <Check className="ml-1 inline h-3 w-3 text-accent-600 dark:text-accent-300" />
              )}
              {right === false && (
                <X className="ml-1 inline h-3 w-3 text-danger-500" />
              )}
            </button>
          );
        })}
      </div>

      <section className="card-pad">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Scenario · {ex.country}
        </div>
        <p className="mt-2 text-base">{ex.scenario}</p>

        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            Pick all patterns at play
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {PATTERNS.map((p) => {
              const picked = selection.includes(p.id);
              const isCorrectChoice = ex.expected.includes(p.id);
              const reveal = submitted;
              const tone = reveal
                ? isCorrectChoice
                  ? 'border-accent-500 bg-accent-50 text-accent-800 dark:bg-accent-900/40 dark:text-accent-200'
                  : picked
                  ? 'border-danger-500 bg-danger-500/10 text-danger-500'
                  : 'border-ink-200 dark:border-ink-700'
                : picked
                ? 'border-accent-500 bg-accent-50 text-accent-800 dark:bg-accent-900/40 dark:text-accent-200'
                : 'border-ink-200 hover:bg-ink-100 dark:border-ink-700 dark:hover:bg-ink-800';
              return (
                <button
                  key={p.id}
                  className={`rounded-full border px-3 py-1 text-xs ${tone}`}
                  onClick={() =>
                    setSelection((s) =>
                      s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id],
                    )
                  }
                  disabled={submitted}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {!submitted ? (
            <button
              className="btn-primary"
              onClick={() => recordPatternAnswer(ex.id, selection.join(','))}
              disabled={selection.length === 0}
            >
              Check
            </button>
          ) : (
            <button
              className="btn-secondary"
              onClick={() => {
                recordPatternAnswer(ex.id, '');
                // also clear stored
                setSelection([]);
              }}
            >
              Try again
            </button>
          )}
          {activeIdx < EXERCISES.length - 1 && (
            <button
              className="btn-ghost"
              onClick={() => {
                setActiveIdx((i) => i + 1);
                const nextEx = EXERCISES[activeIdx + 1];
                setSelection(state.patternQuiz[nextEx.id]?.split(',').filter(Boolean) ?? []);
              }}
            >
              Next →
            </button>
          )}
        </div>

        {submitted && (
          <div
            className={
              'mt-5 rounded-lg border p-4 text-sm ' +
              (correct
                ? 'border-accent-500/50 bg-accent-500/10'
                : 'border-warn-500/50 bg-warn-500/10')
            }
          >
            <div className="font-semibold">
              {correct ? 'Spot on.' : 'Not quite.'} The patterns at play are:{' '}
              <span className="font-mono">{ex.expected.join(', ')}</span>.
            </div>
            <p className="mt-2 text-ink-700 dark:text-ink-200">{ex.explanation}</p>
          </div>
        )}
      </section>
    </div>
  );
}
