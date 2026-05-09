import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import {
  STRATEGY_SUBSECTIONS,
  getStrategiesBySubsection,
} from '../../content/strategies';

export function StrategiesLanding() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Section 6"
        title="Strategies"
        description="What experienced founders do once they understand how the system works."
        pageId="strategies"
      />
      <DisclaimerBanner compact />

      <section className="rounded-xl border-l-4 border-accent-500 bg-accent-50/70 p-5 dark:bg-accent-900/20">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
          Read this first
        </div>
        <div className="mt-1 space-y-3 text-[0.95rem] leading-relaxed text-ink-800 dark:text-ink-100">
          <p>
            <strong>Strategies are what experienced founders do, not what
            beginners should copy.</strong> The earlier sections taught how the
            tax system works. This section teaches what operators do with that
            knowledge. Every strategy here is real and legitimate — but every
            one also has conditions where it works, conditions where it
            doesn't, and costs you need to weigh.
          </p>
          <p>
            A strategy that saved one founder £30,000 a year might cost
            another founder money or expose them to risk. The "When this
            applies / When it doesn't" panel on each strategy is the single
            most important part — read it before the strategy itself.
          </p>
          <p>
            This section pushes you toward professional advice more than the
            others, because strategies usually require coordinated execution
            between an accountant, a solicitor, and sometimes a financial
            adviser. The goal here is to make you smart enough to ask the
            right questions and evaluate the answers — not smart enough to
            skip the professionals.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {STRATEGY_SUBSECTIONS.map((s) => {
          const items = getStrategiesBySubsection(s.id);
          return (
            <Link
              key={s.id}
              to={`/strategies/${s.id}`}
              className="card-pad transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold tracking-tight">
                  {s.title}
                </h2>
                <span className="text-xs text-ink-500 dark:text-ink-400">
                  {items.length}{' '}
                  {items.length === 1 ? 'strategy' : 'strategies'}
                </span>
              </div>
              <p className="mt-1 lede">{s.oneLiner}</p>
              <ul className="mt-3 space-y-1 text-xs text-ink-600 dark:text-ink-300">
                {items.slice(0, 3).map((item) => (
                  <li key={item.id} className="truncate">
                    · {item.title}
                  </li>
                ))}
                {items.length > 3 && (
                  <li className="italic text-ink-500 dark:text-ink-400">
                    + {items.length - 3} more
                  </li>
                )}
              </ul>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
