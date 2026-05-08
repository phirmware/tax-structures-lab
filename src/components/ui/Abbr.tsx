import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { findAbbr, type AbbrEntry } from '../../lib/abbreviations';

/**
 * Per-page first-mention tracker. The page-scope is the route pathname; whenever
 * the path changes, we reset which abbreviations have been seen so the next page
 * starts fresh with full-term-on-first-mention behaviour.
 */
interface AbbrScopeValue {
  hasSeen: (key: string) => boolean;
  markSeen: (key: string) => void;
}

const AbbrScopeCtx = createContext<AbbrScopeValue | null>(null);

export function AbbrScopeProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  // Mutable ref so synchronous calls during render see updates immediately.
  const seenRef = useRef<Set<string>>(new Set());

  // Reset when route changes.
  useEffect(() => {
    seenRef.current = new Set();
  }, [pathname]);

  const value = useMemo<AbbrScopeValue>(
    () => ({
      hasSeen: (k) => seenRef.current.has(k),
      markSeen: (k) => {
        seenRef.current.add(k);
      },
    }),
    [],
  );

  return <AbbrScopeCtx.Provider value={value}>{children}</AbbrScopeCtx.Provider>;
}

function useAbbrScope(): AbbrScopeValue {
  const v = useContext(AbbrScopeCtx);
  if (v) return v;
  // Fallback: a no-op scope so <Abbr> can still render outside the provider.
  return { hasSeen: () => true, markSeen: () => {} };
}

/**
 * Show an abbreviation with first-mention expansion ("Full Term (ABC)") on the
 * first appearance per page, and the short form alone afterwards. Either way,
 * a hover/focus tooltip shows the definition.
 *
 * Usage:
 *   <Abbr k="vat" />                 → "Value Added Tax (VAT)" first time, "VAT" after
 *   <Abbr k="vat" force="short" />   → always "VAT"
 *   <Abbr k="vat" force="full" />    → always "Value Added Tax (VAT)"
 *   <Abbr k="vat">my custom label</Abbr>  → uses your label, still tooltip-active
 */
export function Abbr({
  k,
  force,
  children,
}: {
  k: string;
  force?: 'short' | 'full';
  children?: ReactNode;
}) {
  const entry = findAbbr(k);
  const scope = useAbbrScope();
  const [open, setOpen] = useState(false);

  // Decide rendering before marking seen, so the first paint is the expanded one.
  const expand = useMemo(() => {
    if (!entry) return false;
    if (force === 'short') return false;
    if (force === 'full') return true;
    return !scope.hasSeen(entry.short);
  }, [entry, force, scope]);

  // Mark in an effect so concurrent renders don't accidentally consume the slot.
  useEffect(() => {
    if (entry) scope.markSeen(entry.short);
  }, [entry, scope]);

  if (!entry) {
    return <span>{children ?? k}</span>;
  }

  const label = children ?? (expand ? `${entry.full} (${entry.short})` : entry.short);

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
        aria-label={`${entry.full} — ${entry.definition}`}
      >
        {label}
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-1/2 top-full z-30 mt-1 w-64 -translate-x-1/2 rounded-lg border border-ink-200 bg-white p-3 text-left text-xs font-normal not-italic shadow-lg dark:border-ink-700 dark:bg-ink-900"
        >
          <span className="block font-semibold text-ink-900 dark:text-ink-50">
            {entry.full} ({entry.short})
          </span>
          <span className="mt-1 block text-ink-700 dark:text-ink-300">
            {entry.definition}
          </span>
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

export type { AbbrEntry };
