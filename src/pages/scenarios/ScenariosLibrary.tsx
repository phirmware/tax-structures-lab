import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import { WORKED } from '../../content/workedScenarios';

export function ScenariosLibrary() {
  const [active, setActive] = useState(WORKED[0].id);
  const a = WORKED.find((w) => w.id === active)!;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Section 6"
        title="Worked scenarios"
        description="Detailed walkthroughs of the most common founder situations. Each one shows which patterns are at play and which questions to bring to your accountant."
        pageId="scenarios"
        actions={
          <Link to="/scenarios/saved" className="btn-secondary">
            Your saved scenarios
          </Link>
        }
      />
      <DisclaimerBanner compact />

      <div className="grid gap-3 md:grid-cols-[260px_minmax(0,1fr)]">
        <ul className="space-y-1.5">
          {WORKED.map((w) => (
            <li key={w.id}>
              <button
                className={
                  'w-full rounded-lg border px-3 py-2 text-left text-sm transition ' +
                  (active === w.id
                    ? 'border-accent-500 bg-accent-50 text-accent-900 dark:bg-accent-900/40 dark:text-accent-100'
                    : 'border-ink-200 hover:bg-ink-100 dark:border-ink-700 dark:hover:bg-ink-800')
                }
                onClick={() => setActive(w.id)}
              >
                <div className="font-medium">{w.title}</div>
                <div className="text-xs text-ink-500 dark:text-ink-400">{w.oneLiner}</div>
              </button>
            </li>
          ))}
        </ul>

        <article className="card-pad">
          <h2 className="heading-2">{a.title}</h2>
          <p className="mt-2 lede">{a.oneLiner}</p>
          <div className="mt-3 text-xs italic text-accent-700 dark:text-accent-300">
            For: {a.forWhom}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {a.patternsUsed.map((p) => (
              <span key={p} className="chip-accent">
                Pattern: {p}
              </span>
            ))}
          </div>

          <div
            className="prose-app mt-5"
            dangerouslySetInnerHTML={{
              __html: a.body
                .split('\n\n')
                .map(
                  (p) =>
                    `<p>${p.replace(/\n/g, '<br/>').replace(/<em>/g, '<em>').replace(/<\/em>/g, '</em>')}</p>`,
                )
                .join(''),
            }}
          />

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {a.numbers.map((n) => (
              <div
                key={n.label}
                className="rounded-lg border border-ink-200 p-3 text-center dark:border-ink-700"
              >
                <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  {n.label}
                </div>
                <div className="font-mono text-sm font-semibold">{n.value}</div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
