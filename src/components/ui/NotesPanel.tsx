import { useState } from 'react';
import { useAppState } from '../../state/AppState';

export function NotesPanel({ pageId }: { pageId: string }) {
  const { getNote, setNote } = useAppState();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => getNote(pageId));

  return (
    <div className="mt-8 rounded-xl border border-dashed border-ink-300 bg-ink-50/50 p-4 dark:border-ink-700 dark:bg-ink-900/40">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold tracking-tight">Your notes</h3>
        <div className="flex gap-2">
          {open ? (
            <>
              <button
                className="btn-secondary !py-1 !px-2 text-xs"
                onClick={() => {
                  setDraft(getNote(pageId));
                  setOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary !py-1 !px-2 text-xs"
                onClick={() => {
                  setNote(pageId, draft);
                  setOpen(false);
                }}
              >
                Save
              </button>
            </>
          ) : (
            <button
              className="btn-secondary !py-1 !px-2 text-xs"
              onClick={() => {
                setDraft(getNote(pageId));
                setOpen(true);
              }}
            >
              {getNote(pageId) ? 'Edit' : 'Add note'}
            </button>
          )}
        </div>
      </div>
      {open ? (
        <textarea
          className="input mt-2 h-32 resize-y"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="What was the takeaway? What questions does this raise for your accountant?"
        />
      ) : (
        <p className="mt-2 whitespace-pre-wrap text-sm text-ink-700 dark:text-ink-300">
          {getNote(pageId) || (
            <span className="italic text-ink-400 dark:text-ink-500">No notes yet.</span>
          )}
        </p>
      )}
    </div>
  );
}
