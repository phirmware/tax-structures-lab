import { useState } from 'react';
import { useAppState } from '../state/AppState';
import { Book, Menu, Moon, Sun, X } from './ui/Icons';
import { LESSONS } from '../content/lessons';
import { GlossaryPanel } from './ui/GlossaryPanel';

export function TopBar({
  onToggleMobileNav,
  mobileOpen,
}: {
  onToggleMobileNav: () => void;
  mobileOpen: boolean;
}) {
  const { dark, setDark, state, isLessonComplete } = useAppState();
  const completed = LESSONS.filter((l) => isLessonComplete(l.id)).length;
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-ink-200 bg-white/80 px-4 backdrop-blur dark:border-ink-800 dark:bg-ink-950/80">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="grid h-9 w-9 place-items-center rounded-md text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800 md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="hidden text-sm text-ink-500 dark:text-ink-400 sm:block">
          <span className="font-mono">
            {completed}/{LESSONS.length}
          </span>{' '}
          foundations · jurisdiction:{' '}
          <span className="font-medium text-ink-700 dark:text-ink-200">{state.jurisdiction}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="hidden h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800 sm:inline-flex"
          onClick={() => setGlossaryOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={glossaryOpen}
          title="Open glossary"
        >
          <Book className="h-4 w-4" />
          Glossary
        </button>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-md text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800 sm:hidden"
          onClick={() => setGlossaryOpen(true)}
          aria-label="Open glossary"
          title="Open glossary"
        >
          <Book className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-md text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
          onClick={() => setDark(!dark)}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
      <GlossaryPanel open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </header>
  );
}
