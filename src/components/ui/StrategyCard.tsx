import { type ReactNode } from 'react';
import type { Strategy } from '../../content/strategies';
import { LessonSummary } from './LessonSummary';
import { MISTAKES_DISCLAIMER } from '../../content/lessonExtras';

/**
 * Renders the full structured strategy card — the same parts in the same
 * order on every strategy. The simulator (if any) is rendered by the caller
 * and passed in as `simulator`, so we can keep the simulator code separate
 * from the card layout.
 */
export function StrategyCard({
  strategy,
  simulator,
}: {
  strategy: Strategy;
  simulator?: ReactNode;
}) {
  return (
    <article
      id={strategy.id}
      className="card-pad scroll-mt-20 space-y-5"
      aria-labelledby={`strategy-${strategy.id}-title`}
    >
      <header>
        <h2
          id={`strategy-${strategy.id}-title`}
          className="text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {strategy.title}
        </h2>
      </header>

      <LessonSummary text={strategy.summary} />

      <Section title="How it works">
        <div className="prose-app">{strategy.body()}</div>
      </Section>

      <Section title="Why it works (the principle)">
        <p className="text-sm italic text-accent-700 dark:text-accent-300">
          {strategy.principle}
        </p>
      </Section>

      <div className="grid gap-4 md:grid-cols-2">
        <ConditionList
          title="When this applies"
          items={strategy.whenApplies}
          tone="ok"
        />
        <ConditionList
          title="When this doesn't apply (or backfires)"
          items={strategy.whenDoesNot}
          tone="warn"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ConditionList title="Pros" items={strategy.pros} />
        <ConditionList title="Cons" items={strategy.cons} />
      </div>

      <Section title="The professionals you need">
        <ul className="ml-4 list-disc space-y-1 text-sm text-ink-700 dark:text-ink-300">
          {strategy.professionals.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </Section>

      {simulator && (
        <Section title="Show me with my numbers">
          {simulator}
        </Section>
      )}

      {strategy.mistakes && strategy.mistakes.length > 0 && (
        <Section title="Mistakes founders make">
          <ul className="grid gap-3 md:grid-cols-2">
            {strategy.mistakes.map((m) => (
              <li
                key={m.id}
                className="rounded-lg border border-ink-200 bg-white p-4 text-sm dark:border-ink-700 dark:bg-ink-900"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
                  {m.title}
                </div>
                <p className="mt-2 leading-relaxed text-ink-700 dark:text-ink-300">
                  {m.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] italic text-ink-500 dark:text-ink-400">
            {MISTAKES_DISCLAIMER}
          </p>
        </Section>
      )}

      <Section title="Worth reading">
        <ul className="ml-4 list-disc space-y-1 text-sm text-ink-700 dark:text-ink-300">
          {strategy.worthReading.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {title}
      </h3>
      {children}
    </section>
  );
}

function ConditionList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone?: 'ok' | 'warn';
}) {
  const colour =
    tone === 'ok'
      ? 'border-accent-300 bg-accent-50/40 dark:border-accent-700 dark:bg-accent-900/20'
      : tone === 'warn'
        ? 'border-yellow-300 bg-yellow-50/40 dark:border-yellow-800 dark:bg-yellow-900/20'
        : 'border-ink-200 bg-ink-50/40 dark:border-ink-700 dark:bg-ink-900/30';
  return (
    <div className={`rounded-lg border p-4 ${colour}`}>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-700 dark:text-ink-200">
        {title}
      </div>
      <ul className="mt-2 ml-4 list-disc space-y-1 text-sm text-ink-700 dark:text-ink-300">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
