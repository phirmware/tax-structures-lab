import { useState, type ReactNode } from 'react';
import { findGlossary } from '../../lib/glossary';
import { Link } from 'react-router-dom';

// Wrap any term to show a hover-tooltip plus a link to learn more.
export function G({ term, children }: { term: string; children?: ReactNode }) {
  const entry = findGlossary(term);
  const [open, setOpen] = useState(false);

  if (!entry) return <span>{children ?? term}</span>;

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        className="glossary-term"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {children ?? entry.term}
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-1/2 top-full z-30 mt-1 w-64 -translate-x-1/2 rounded-lg border border-ink-200 bg-white p-3 text-left text-xs font-normal not-italic shadow-lg dark:border-ink-700 dark:bg-ink-900"
        >
          <span className="block font-semibold text-ink-900 dark:text-ink-50">
            {entry.term}
          </span>
          <span className="mt-1 block text-ink-700 dark:text-ink-300">{entry.short}</span>
          {entry.see && (
            <Link
              to={entry.see}
              className="mt-2 inline-block text-accent-600 hover:underline dark:text-accent-300"
            >
              Learn more →
            </Link>
          )}
        </span>
      )}
    </span>
  );
}
