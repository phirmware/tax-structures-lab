import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { useAppState } from '../state/AppState';
import { PROFILE_FIELDS, type PersonalProfile } from '../lib/storage';
import { Trash } from '../components/ui/Icons';

export function MyProfile() {
  const { state, updateProfile, resetProfile } = useAppState();
  const profile = state.personalProfile;

  const [draft, setDraft] = useState<Record<string, string>>(() => {
    const obj: Record<string, string> = {};
    for (const f of PROFILE_FIELDS) {
      const v = profile[f.key];
      obj[f.key] = typeof v === 'number' ? String(v) : '';
    }
    return obj;
  });

  const [savedAt, setSavedAt] = useState<number | null>(null);

  const setField = (k: string, v: string) =>
    setDraft((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    const patch: Partial<PersonalProfile> = {};
    for (const f of PROFILE_FIELDS) {
      const raw = draft[f.key];
      if (raw === '' || raw == null) {
        patch[f.key] = undefined;
      } else {
        const n = Number(raw);
        patch[f.key] = isFinite(n) ? n : undefined;
      }
    }
    updateProfile(patch);
    setSavedAt(Date.now());
    window.setTimeout(() => setSavedAt(null), 2000);
  };

  const handleReset = () => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(
        'Clear all saved numbers from your profile? This only affects "Show me with my numbers" panels.',
      )
    ) {
      return;
    }
    resetProfile();
    const cleared: Record<string, string> = {};
    for (const f of PROFILE_FIELDS) cleared[f.key] = '';
    setDraft(cleared);
  };

  const filledCount = PROFILE_FIELDS.filter(
    (f) => typeof profile[f.key] === 'number',
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Personalisation"
        title="My profile"
        description="Numbers you've entered through any 'Show me with my numbers' panel. Edit them in one place — every lesson with a calculation will use these values."
        pageId="profile"
      />

      <div className="card-pad">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Status
            </div>
            <div className="mt-1 text-sm">
              {filledCount === 0 ? (
                <>
                  No numbers saved yet. Use{' '}
                  <span className="font-medium">Show me with my numbers</span> on any
                  lesson to start filling this in.
                </>
              ) : (
                <>
                  <span className="font-mono">{filledCount}</span> of{' '}
                  <span className="font-mono">{PROFILE_FIELDS.length}</span> fields
                  saved.
                </>
              )}
            </div>
          </div>
          <Link to="/lab" className="btn-secondary text-sm">
            Open the lab
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {PROFILE_FIELDS.map((f) => (
            <label key={f.key} className="block text-sm">
              <span className="mb-1 block font-medium text-ink-700 dark:text-ink-200">
                {f.label}
              </span>
              <div className="flex items-center gap-2">
                {f.kind === 'currency' && (
                  <span className="text-sm text-ink-500 dark:text-ink-400">£</span>
                )}
                <input
                  type="number"
                  className="input"
                  value={draft[f.key]}
                  placeholder={
                    f.kind === 'years' ? 'e.g. 10' : 'Leave blank to use lesson defaults'
                  }
                  onChange={(e) => setField(f.key, e.target.value)}
                />
                {f.kind === 'years' && (
                  <span className="text-sm text-ink-500 dark:text-ink-400">years</span>
                )}
              </div>
              <span className="mt-1 block text-[11px] text-ink-500 dark:text-ink-400">
                {f.hint}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" className="btn-primary" onClick={handleSave}>
            {savedAt ? 'Saved' : 'Save profile'}
          </button>
          <button type="button" className="btn-secondary" onClick={handleReset}>
            <Trash className="h-4 w-4" />
            Reset profile
          </button>
          <span className="text-[11px] text-ink-500 dark:text-ink-400">
            Your numbers stay on your device. Nothing is sent anywhere.
          </span>
        </div>
      </div>

      <div className="card-pad text-sm text-ink-700 dark:text-ink-300">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          How this works
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Each lesson with a calculation has a{' '}
            <span className="font-medium">Show me with my numbers</span> button.
          </li>
          <li>Editing values there saves them here, automatically.</li>
          <li>
            Values you've saved here pre-populate every other lesson's panel —
            including the Cash Flow Lab via its <em>Use my profile</em> button.
          </li>
          <li>Lessons fall back to their example numbers for any field you haven't filled in.</li>
        </ul>
      </div>
    </div>
  );
}
