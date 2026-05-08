import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import { PATTERNS } from '../../content/patterns';
import { LessonSummary } from '../../components/ui/LessonSummary';

export function PatternsOverview() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Section 5"
        title="Universal patterns"
        description="The patterns that make this learning durable. Once you can see them, you can read tax systems anywhere."
        pageId="patterns"
        actions={
          <Link to="/patterns/exercise" className="btn-primary">
            Recognition exercise →
          </Link>
        }
      />
      <DisclaimerBanner compact />

      <section className="grid gap-4">
        {PATTERNS.map((p) => (
          <article key={p.id} className="card-pad">
            <div className="flex flex-wrap items-baseline gap-2">
              <h2 className="text-lg font-semibold tracking-tight">{p.name}</h2>
              <span className="chip-accent text-[10px]">{p.id}</span>
            </div>
            <p className="mt-1 lede">{p.oneLiner}</p>
            <div className="mt-3">
              <LessonSummary pageId={`patterns/${p.id}`} />
            </div>
            <p className="mt-3 text-sm text-ink-700 dark:text-ink-300">{p.why}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  Where you'll see it
                </div>
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {p.examples.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  How to recognise it
                </div>
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {p.recognise.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
