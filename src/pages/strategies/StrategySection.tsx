import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import { NotesPanel } from '../../components/ui/NotesPanel';
import { StrategyCard } from '../../components/ui/StrategyCard';
import {
  STRATEGY_SUBSECTIONS,
  getStrategiesBySubsection,
  getSubsection,
  type StrategySubsectionId,
} from '../../content/strategies';
import { StrategySimulator } from './StrategySimulators';

export function StrategySection() {
  const { subsection = '' } = useParams();
  const sub = getSubsection(subsection as StrategySubsectionId);

  if (!sub) {
    return (
      <div className="card-pad">
        <h1 className="heading-1">Strategies sub-section not found</h1>
        <p className="mt-2">
          <Link
            className="text-accent-700 underline dark:text-accent-300"
            to="/strategies"
          >
            Back to Strategies
          </Link>
        </p>
      </div>
    );
  }

  const items = getStrategiesBySubsection(sub.id);
  const idx = STRATEGY_SUBSECTIONS.findIndex((s) => s.id === sub.id);
  const prev = idx > 0 ? STRATEGY_SUBSECTIONS[idx - 1] : undefined;
  const next =
    idx < STRATEGY_SUBSECTIONS.length - 1
      ? STRATEGY_SUBSECTIONS[idx + 1]
      : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Strategies"
        title={sub.title}
        description={sub.oneLiner}
        pageId={`strategies/${sub.id}`}
      />

      <section className="rounded-xl border-l-4 border-accent-500 bg-accent-50/40 p-4 sm:p-5 dark:bg-accent-900/15">
        <p className="text-[0.95rem] leading-relaxed text-ink-800 dark:text-ink-100">
          {sub.intro}
        </p>
      </section>

      <DisclaimerBanner compact />

      <p className="text-sm text-ink-700 dark:text-ink-300">
        <strong>Strategies require professional execution.</strong> The
        principles here help you ask the right questions; the actual
        implementation requires a qualified adviser who knows your full
        situation.
      </p>

      {/* Quick in-page navigation */}
      {items.length > 1 && (
        <nav className="card-pad">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            Strategies in this sub-section
          </div>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {items.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-accent-700 hover:underline dark:text-accent-300"
                >
                  · {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="space-y-6">
        {items.map((s) => (
          <StrategyCard
            key={s.id}
            strategy={s}
            simulator={
              s.hasSimulator ? (
                <StrategySimulator strategyId={s.id} />
              ) : undefined
            }
          />
        ))}
      </div>

      <nav className="grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            to={`/strategies/${prev.id}`}
            className="card-pad transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              ← Previous strategies
            </div>
            <div className="text-sm font-semibold">{prev.title}</div>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/strategies/${next.id}`}
            className="card-pad text-right transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Next strategies →
            </div>
            <div className="text-sm font-semibold">{next.title}</div>
          </Link>
        ) : (
          <Link
            to="/scenarios"
            className="card-pad text-right transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Next section →
            </div>
            <div className="text-sm font-semibold">7 · Scenarios</div>
          </Link>
        )}
      </nav>

      <NotesPanel pageId={`strategies/${sub.id}`} />
    </div>
  );
}
