import { getLessonExtras, MISTAKES_DISCLAIMER } from '../../content/lessonExtras';

/**
 * "Mistakes I've seen real founders make" panel.
 * Stories are concrete, numbered, and end with a "fix" — not moralising.
 *
 * Renders nothing if the pageId has no mistakes defined, so callers can
 * include it on every relevant page without conditional logic.
 */
export function FounderMistakes({ pageId }: { pageId: string }) {
  const mistakes = getLessonExtras(pageId)?.mistakes;
  if (!mistakes || mistakes.length === 0) return null;

  return (
    <section
      aria-label="Mistakes I've seen real founders make"
      className="rounded-xl border border-ink-200 bg-ink-50/40 p-5 dark:border-ink-700 dark:bg-ink-900/40"
    >
      <header className="mb-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Lessons learned
        </div>
        <h3 className="text-base font-semibold tracking-tight text-ink-900 dark:text-ink-50">
          Mistakes I've seen real founders make
        </h3>
      </header>

      <ul className="grid gap-3 md:grid-cols-2">
        {mistakes.map((m) => (
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
    </section>
  );
}
