import { Link } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { LESSONS } from '../content/lessons';
import { ArrowRight, Check } from '../components/ui/Icons';
import { DisclaimerBanner } from '../components/ui/Disclaimer';
import { RATES_AS_OF } from '../lib/constants';

const PACING = [
  { week: 1, focus: 'Foundations 1.1 → 1.5' },
  { week: 2, focus: 'Foundations 1.6 → 1.10 + first Cash Flow Lab session' },
  { week: 3, focus: 'Structures + Compare view' },
  { week: 4, focus: 'UK Specifics' },
  { week: 5, focus: 'Patterns + recognition exercise' },
  { week: 6, focus: 'Worked Scenarios + your own custom scenario' },
];

export function Home() {
  const { isLessonComplete } = useAppState();
  const next = LESSONS.find((l) => !isLessonComplete(l.id));

  return (
    <div className="space-y-8">
      <DisclaimerBanner />

      <section className="card-pad bg-gradient-to-br from-accent-500/10 via-white to-white dark:from-accent-500/10 dark:via-ink-900 dark:to-ink-900">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
          Your home
        </div>
        <h1 className="mt-1 heading-1">Tax & Structures Lab</h1>
        <p className="mt-3 max-w-3xl lede">
          Most founders lose 30–40% of potential lifetime wealth to suboptimal tax structuring.
          You've operated for 10 years without this fluency. By the end of this curriculum, you'll
          have a durable mental model that survives budget changes and country moves — built on
          principles, not memorized rates.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {next ? (
            <Link to={`/foundations/${next.id}`} className="btn-primary">
              Continue with {next.number} {next.title} <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link to="/lab" className="btn-primary">
              Open the Cash Flow Lab <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <Link to="/lab" className="btn-secondary">
            Skip ahead to the simulator
          </Link>
          <Link to="/structures/compare" className="btn-secondary">
            Compare structures
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Link to="/foundations/1-1" className="group card-pad transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
            Section 1
          </div>
          <h2 className="mt-1 heading-2">Foundations</h2>
          <p className="mt-2 lede">
            Ten universal principles. The conceptual base every other section builds on.
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {LESSONS.slice(0, 5).map((l) => (
              <li key={l.id} className="flex items-center gap-2">
                {isLessonComplete(l.id) ? (
                  <Check className="h-4 w-4 text-accent-600 dark:text-accent-300" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-ink-300 dark:border-ink-700" />
                )}
                <span className="text-ink-700 dark:text-ink-200">
                  {l.number} · {l.title}
                </span>
              </li>
            ))}
            <li className="text-xs italic text-ink-500 dark:text-ink-400">+ 5 more</li>
          </ul>
        </Link>

        <Link to="/lab" className="group card-pad transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
            Section 3 · Centerpiece
          </div>
          <h2 className="mt-1 heading-2">Cash Flow Lab</h2>
          <p className="mt-2 lede">
            Move money through different structures and watch what comes out the other end. Live,
            animated, transparent maths.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded bg-ink-100 px-2 py-2 dark:bg-ink-800">Sole trader</div>
            <div className="rounded bg-ink-100 px-2 py-2 dark:bg-ink-800">Limited Co.</div>
            <div className="rounded bg-ink-100 px-2 py-2 dark:bg-ink-800">Holdco + sub</div>
          </div>
        </Link>

        <Link to="/structures" className="group card-pad transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
            Section 2
          </div>
          <h2 className="mt-1 heading-2">Structures</h2>
          <p className="mt-2 lede">
            Side-by-side comparisons of every entity you'll encounter, with interactive cash flow
            diagrams.
          </p>
        </Link>

        <Link to="/patterns" className="group card-pad transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
            Section 5
          </div>
          <h2 className="mt-1 heading-2">Patterns</h2>
          <p className="mt-2 lede">
            What makes the learning durable — recognizing tax-relevant patterns across jurisdictions.
          </p>
        </Link>
      </section>

      <section className="card-pad">
        <h2 className="heading-2">Suggested 6-week pacing</h2>
        <p className="mt-2 lede">
          ~30–60 minutes per session. Sequential — later lessons assume earlier ones.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {PACING.map((p) => (
            <div
              key={p.week}
              className="rounded-lg border border-ink-200 p-4 dark:border-ink-700"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
                Week {p.week}
              </div>
              <div className="mt-1 text-sm">{p.focus}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card-pad">
        <h2 className="heading-2">Three principles shape every lesson</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-ink-200 p-4 dark:border-ink-700">
            <div className="font-semibold">Why, not rates</div>
            <p className="mt-2 text-sm text-ink-700 dark:text-ink-300">
              Numbers shown reflect <span className="font-mono text-xs">{RATES_AS_OF}</span>. They
              will change. The reasoning behind them won't.
            </p>
          </div>
          <div className="rounded-lg border border-ink-200 p-4 dark:border-ink-700">
            <div className="font-semibold">Universal first</div>
            <p className="mt-2 text-sm text-ink-700 dark:text-ink-300">
              UK is one implementation of patterns shared across most developed economies. Learn the
              pattern; the local rules slot in.
            </p>
          </div>
          <div className="rounded-lg border border-ink-200 p-4 dark:border-ink-700">
            <div className="font-semibold">Interactive over passive</div>
            <p className="mt-2 text-sm text-ink-700 dark:text-ink-300">
              Every concept has something you manipulate. Reading is supplementary; understanding
              comes from moving the levers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
