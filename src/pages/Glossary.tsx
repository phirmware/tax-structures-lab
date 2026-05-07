import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { GLOSSARY } from '../lib/glossary';

export function Glossary() {
  const entries = Object.values(GLOSSARY).sort((a, b) =>
    a.term.localeCompare(b.term),
  );
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reference"
        title="Glossary"
        description="Plain-English definitions for the jargon used throughout the app. Hover the dotted-underlined terms in any lesson for the same definitions inline."
      />

      <div className="grid gap-3 md:grid-cols-2">
        {entries.map((e) => (
          <div key={e.term} className="card-pad">
            <div className="flex items-baseline justify-between gap-2">
              <div className="font-semibold">{e.term}</div>
              {e.see && (
                <Link
                  to={e.see}
                  className="text-xs text-accent-700 underline dark:text-accent-300"
                >
                  Learn more →
                </Link>
              )}
            </div>
            <p className="mt-2 text-sm text-ink-700 dark:text-ink-300">{e.short}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
