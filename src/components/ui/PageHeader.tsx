import { type ReactNode } from 'react';
import { Bookmark } from './Icons';
import { useAppState } from '../../state/AppState';

export function PageHeader({
  eyebrow,
  title,
  description,
  pageId,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  pageId?: string;
  actions?: ReactNode;
}) {
  const { isBookmarked, toggleBookmark } = useAppState();
  const bookmarked = pageId ? isBookmarked(pageId) : false;
  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
            {eyebrow}
          </div>
        )}
        <h1 className="heading-1">{title}</h1>
        {description && (
          <p className="mt-2 max-w-3xl lede">{description}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {pageId && (
          <button
            type="button"
            onClick={() => toggleBookmark(pageId)}
            className={
              bookmarked
                ? 'btn bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-200'
                : 'btn-secondary'
            }
            aria-pressed={bookmarked}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this page'}
          >
            <Bookmark filled={bookmarked} className="h-4 w-4" />
            {bookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        )}
        {actions}
      </div>
    </header>
  );
}
