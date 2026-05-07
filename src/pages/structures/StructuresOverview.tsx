import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import { STRUCTURES } from '../../content/structures';

export function StructuresOverview() {
  const universal = STRUCTURES.filter((s) => s.jurisdiction === 'universal');
  const uk = STRUCTURES.filter((s) => s.jurisdiction === 'uk');
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Section 2"
        title="Structures"
        description="Side-by-side breakdowns of every entity you'll encounter, from sole trader to holding company. Each one has an interactive cash flow."
        pageId="structures"
        actions={
          <Link to="/structures/compare" className="btn-primary">
            Open compare view
          </Link>
        }
      />
      <DisclaimerBanner compact />
      <Section title="Universal" entries={universal} />
      <Section title="UK-specific" entries={uk} />
    </div>
  );
}

function Section({
  title,
  entries,
}: {
  title: string;
  entries: typeof STRUCTURES;
}) {
  return (
    <section>
      <h2 className="heading-2">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {entries.map((s) => (
          <Link
            to={`/structures/${s.id}`}
            key={s.id}
            className="card-pad transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold">{s.shortName}</div>
                <div className="text-xs text-ink-500 dark:text-ink-400">{s.longName}</div>
              </div>
              <span className="chip">{s.complexity}</span>
            </div>
            <p className="mt-2 text-sm">{s.oneLiner}</p>
            <p className="mt-3 text-xs italic text-accent-700 dark:text-accent-300">
              {s.patternNote}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
