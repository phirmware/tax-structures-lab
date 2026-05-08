import { useMemo, useState, type ReactNode } from 'react';
import { Calculator, Check } from './Icons';
import { useAppState } from '../../state/AppState';
import {
  PROFILE_FIELDS,
  type PersonalProfile,
} from '../../lib/storage';

type ProfileKey = keyof PersonalProfile;

export interface InputSpec {
  /** Profile field this input maps to (and reads from / writes to). */
  key: ProfileKey;
  /** Display label override (defaults to the canonical profile label). */
  label?: string;
  /** Default to use when the user has nothing in their profile yet. */
  defaultValue: number;
  /** Optional clamps for the editable input. */
  min?: number;
  max?: number;
  step?: number;
  /** Optional helper hint shown under the input. */
  hint?: string;
}

interface RenderArgs {
  /** Resolved current values (profile if present, else defaults). */
  values: Record<ProfileKey, number>;
}

/**
 * "Show me with my numbers" inline panel. Pre-populates from the user's
 * personal profile (LocalStorage), falling back to the lesson defaults the
 * caller supplies. Saving persists those values to the profile so other
 * lessons pick them up automatically.
 *
 * Rendered as an inline expandable panel — never a modal — so the user
 * stays on the lesson.
 */
export function ShowWithMyNumbers({
  inputs,
  render,
  defaultOpen = false,
  title = 'Show me with my numbers',
}: {
  inputs: InputSpec[];
  render: (args: RenderArgs) => ReactNode;
  defaultOpen?: boolean;
  title?: string;
}) {
  const { state, updateProfile } = useAppState();
  const profile = state.personalProfile;

  // Local working values: start from profile (if set) else the spec default.
  const initial = useMemo(() => {
    const obj = {} as Record<ProfileKey, number>;
    for (const i of inputs) {
      const fromProfile = profile[i.key];
      obj[i.key] =
        typeof fromProfile === 'number' && isFinite(fromProfile)
          ? fromProfile
          : i.defaultValue;
    }
    return obj;
    // We intentionally only seed once when the panel mounts — subsequent
    // edits in this panel are local until the user clicks "Save".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [open, setOpen] = useState(defaultOpen);
  const [working, setWorking] = useState<Record<ProfileKey, number>>(initial);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const setOne = (k: ProfileKey, v: number) =>
    setWorking((p) => ({ ...p, [k]: v }));

  const save = () => {
    const patch: Partial<PersonalProfile> = {};
    for (const i of inputs) {
      patch[i.key] = working[i.key];
    }
    updateProfile(patch);
    setSavedAt(Date.now());
    window.setTimeout(() => setSavedAt(null), 2200);
  };

  const usingProfileFor = inputs.filter(
    (i) => typeof profile[i.key] === 'number',
  ).length;

  if (!open) {
    return (
      <div className="not-prose my-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-secondary"
        >
          <Calculator className="h-4 w-4" />
          {title}
        </button>
        {usingProfileFor > 0 && (
          <span className="ml-3 text-xs text-ink-500 dark:text-ink-400">
            {usingProfileFor} of {inputs.length} fields will pre-fill from your saved profile.
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="not-prose my-4 rounded-xl border border-accent-300/60 bg-accent-50/40 p-4 dark:border-accent-700/60 dark:bg-accent-900/20">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
            With your numbers
          </div>
          <h4 className="text-sm font-semibold text-ink-900 dark:text-ink-50">
            {title}
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-ink-500 underline hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-200"
        >
          Hide
        </button>
      </div>

      <p className="mt-1 text-xs text-ink-600 dark:text-ink-300">
        Edit any input to see this lesson applied to your situation. Your numbers are saved locally.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {inputs.map((i) => {
          const profileLabel = PROFILE_FIELDS.find((f) => f.key === i.key)?.label;
          const label = i.label ?? profileLabel ?? String(i.key);
          const isYears = i.key === 'yearsHorizon';
          return (
            <label key={i.key} className="block text-sm">
              <span className="mb-1 flex items-baseline justify-between gap-2">
                <span className="font-medium text-ink-700 dark:text-ink-200">
                  {label}
                </span>
                <span className="font-mono text-xs text-ink-500 dark:text-ink-400">
                  {isYears
                    ? `${working[i.key]} yr${working[i.key] === 1 ? '' : 's'}`
                    : `£${Math.round(working[i.key]).toLocaleString('en-GB')}`}
                </span>
              </span>
              <input
                type="number"
                className="input"
                value={working[i.key]}
                min={i.min}
                max={i.max}
                step={i.step ?? (isYears ? 1 : 100)}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setOne(i.key, isFinite(v) ? v : 0);
                }}
              />
              {i.hint && (
                <span className="mt-1 block text-[11px] text-ink-500 dark:text-ink-400">
                  {i.hint}
                </span>
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg border border-ink-200 bg-white p-4 text-sm dark:border-ink-700 dark:bg-ink-900">
        {render({ values: working })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} className="btn-primary">
          {savedAt ? (
            <>
              <Check className="h-4 w-4" /> Saved
            </>
          ) : (
            'Save these numbers'
          )}
        </button>
        <span className="text-[11px] text-ink-500 dark:text-ink-400">
          Saved values pre-populate this panel on every other lesson.
        </span>
      </div>
    </div>
  );
}
