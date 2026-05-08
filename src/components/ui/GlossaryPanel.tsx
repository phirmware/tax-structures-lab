import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { abbrList } from '../../lib/abbreviations';
import { X } from './Icons';

/**
 * Persistent slide-in glossary. Opens from any page without losing the user's
 * place. Closes on outside-click or Escape.
 */
export function GlossaryPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const [query, setQuery] = useState('');

  if (!open) return null;

  const list = abbrList().filter((e) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      e.short.toLowerCase().includes(q) ||
      e.full.toLowerCase().includes(q) ||
      e.definition.toLowerCase().includes(q)
    );
  });

  if (typeof document === 'undefined') return null;

  // Portal to <body> so we escape the sticky/backdrop-blurred TopBar stacking
  // context — `position: fixed` is contained by an ancestor with backdrop-filter,
  // so without a portal the panel ends up trapped inside the header.
  return createPortal(
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label="Glossary"
    >
      <div
        className="absolute inset-0 bg-ink-900/60"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-ink-200 bg-white shadow-xl dark:border-ink-800 dark:bg-ink-950"
      >
        <header className="flex items-center justify-between border-b border-ink-200 px-5 py-4 dark:border-ink-800">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Reference
            </div>
            <h2 className="text-lg font-semibold tracking-tight">Glossary</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-md text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
            aria-label="Close glossary"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="border-b border-ink-200 px-5 py-3 dark:border-ink-800">
          <input
            className="input"
            placeholder="Search abbreviations…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {list.length === 0 ? (
            <p className="text-sm italic text-ink-500 dark:text-ink-400">
              No matches.
            </p>
          ) : (
            <ul className="space-y-3">
              {list.map((e) => (
                <li
                  key={e.short}
                  className="rounded-lg border border-ink-200 p-3 dark:border-ink-700"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="font-semibold text-ink-900 dark:text-ink-50">
                        {e.short}
                      </span>
                      <span className="ml-2 text-sm text-ink-500 dark:text-ink-400">
                        {e.full}
                      </span>
                    </div>
                    {e.see && (
                      <Link
                        to={e.see}
                        onClick={onClose}
                        className="shrink-0 text-xs text-accent-700 underline dark:text-accent-300"
                      >
                        Learn more →
                      </Link>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-ink-700 dark:text-ink-300">
                    {e.definition}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <footer className="border-t border-ink-200 px-5 py-3 text-[11px] text-ink-500 dark:border-ink-800 dark:text-ink-400">
          Tap any abbreviation in a lesson for the same definition inline.
        </footer>
      </aside>
    </div>,
    document.body,
  );
}
