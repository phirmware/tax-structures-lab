import { getLessonExtras } from '../../content/lessonExtras';

/**
 * Plain-language summary block ("The point in two sentences").
 * Visually distinct, always visible — designed to be scannable in <30 seconds.
 *
 * Renders nothing if the pageId has no summary defined yet, so it's safe to
 * sprinkle calls everywhere.
 */
export function LessonSummary({
  pageId,
  text,
}: {
  /** Page key into LESSON_EXTRAS. Optional if `text` is provided directly. */
  pageId?: string;
  /** Inline summary text override (used when content lives elsewhere). */
  text?: string;
}) {
  const summary = text ?? (pageId ? getLessonExtras(pageId)?.summary : undefined);
  if (!summary) return null;

  return (
    <aside
      aria-label="Lesson summary in plain English"
      className="rounded-xl border-l-4 border-accent-500 bg-accent-50/70 p-4 sm:p-5 dark:bg-accent-900/20"
    >
      <div className="text-[10px] font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
        The point in two sentences
      </div>
      <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-800 dark:text-ink-100">
        {summary}
      </p>
    </aside>
  );
}
