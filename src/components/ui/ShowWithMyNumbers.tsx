import { useMemo, useState, type ReactNode } from 'react';
import { Calculator, Check } from './Icons';
import { useAppState } from '../../state/AppState';
import {
  PROFILE_FIELDS,
  type PersonalProfile,
} from '../../lib/storage';
import { clamp, formatGBP } from '../../lib/format';

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

type InputBounds = Record<ProfileKey, { min: number; max: number; step: number }>;

function formatInputValue(key: ProfileKey, value: number) {
  if (key === 'yearsHorizon') {
    return `${Math.round(value)} yr${Math.round(value) === 1 ? '' : 's'}`;
  }
  return formatGBP(value);
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
  const seeded = useMemo(() => {
    const values = {} as Record<ProfileKey, number>;
    const bounds = {} as InputBounds;
    for (const i of inputs) {
      const fromProfile = profile[i.key];
      const rawValue =
        typeof fromProfile === 'number' && isFinite(fromProfile)
          ? fromProfile
          : i.defaultValue;
      const isYears = i.key === 'yearsHorizon';
      const min = i.min ?? 0;
      const max =
        i.max ??
        (isYears ? 40 : Math.max(rawValue * 4, i.defaultValue * 4, 100_000));
      const step = i.step ?? (isYears ? 1 : 100);
      bounds[i.key] = { min, max, step };
      values[i.key] = clamp(rawValue, min, max);
    }
    return { values, bounds };
    // We intentionally only seed once when the panel mounts — subsequent
    // edits in this panel are local until the user clicks "Save".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [open, setOpen] = useState(defaultOpen);
  const [working, setWorking] = useState<Record<ProfileKey, number>>(seeded.values);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const setOne = (k: ProfileKey, v: number) =>
    setWorking((p) => {
      const b = seeded.bounds[k];
      return { ...p, [k]: clamp(isFinite(v) ? v : b.min, b.min, b.max) };
    });

  const reset = () => {
    setWorking(seeded.values);
    setSavedAt(null);
  };

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
          className="group flex w-full items-center justify-between gap-4 rounded-xl border border-ink-200 bg-white px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-md dark:border-ink-700 dark:bg-ink-900 dark:hover:border-accent-700 sm:w-auto"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-100 text-accent-800 dark:bg-accent-900/50 dark:text-accent-100">
              <Calculator className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
                Interactive model
              </span>
              <span className="block truncate text-sm font-semibold text-ink-900 dark:text-ink-50">
                {title}
              </span>
            </span>
          </span>
          <span className="text-xs font-medium text-ink-500 transition group-hover:text-accent-700 dark:text-ink-400 dark:group-hover:text-accent-300">
            Open
          </span>
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
    <div className="not-prose my-5 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
      <div className="border-b border-ink-200 bg-ink-50/80 px-4 py-4 dark:border-ink-800 dark:bg-ink-950/50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-accent-700 dark:text-accent-300">
              Interactive model
            </div>
            <h4 className="text-base font-semibold text-ink-900 dark:text-ink-50">
              {title}
            </h4>
            <p className="mt-1 text-xs text-ink-600 dark:text-ink-300">
              Edit any input to see this lesson applied to your situation. Your numbers are saved locally.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-1 text-xs text-ink-500 hover:bg-ink-100 hover:text-ink-700 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-200"
          >
            Hide
          </button>
        </div>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)]">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Inputs
            </div>
            <button
              type="button"
              onClick={reset}
              className="rounded-md px-2 py-1 text-xs text-ink-500 hover:bg-ink-100 hover:text-ink-700 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-200"
            >
              Reset
            </button>
          </div>
          <div className="grid gap-3">
            {inputs.map((i) => {
              const profileLabel = PROFILE_FIELDS.find((f) => f.key === i.key)?.label;
              const label = i.label ?? profileLabel ?? String(i.key);
              const isYears = i.key === 'yearsHorizon';
              const { min, max, step } = seeded.bounds[i.key];
              const labelId = `show-model-${i.key}-label`;
              return (
                <div
                  key={i.key}
                  className="block rounded-lg border border-ink-200 bg-ink-50/70 p-3 text-sm dark:border-ink-800 dark:bg-ink-950/40"
                >
                  <span className="mb-1 flex items-baseline justify-between gap-2">
                    <span id={labelId} className="font-medium text-ink-700 dark:text-ink-200">
                      {label}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-accent-700 dark:text-accent-300">
                      {formatInputValue(i.key, working[i.key])}
                    </span>
                  </span>
                  <input
                    type="range"
                    className="w-full accent-accent-600"
                    aria-labelledby={labelId}
                    value={working[i.key]}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setOne(i.key, v);
                    }}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    {!isYears && (
                      <span className="text-xs font-medium text-ink-400">£</span>
                    )}
                    <input
                      type="number"
                      className="input h-8 px-2 py-1 font-mono text-xs"
                      aria-label={`${label} exact value`}
                      value={Math.round(working[i.key])}
                      min={min}
                      max={max}
                      step={step}
                      onFocus={(e) => e.currentTarget.select()}
                      onChange={(e) => setOne(i.key, Number(e.target.value))}
                    />
                    {isYears && (
                      <span className="text-xs font-medium text-ink-400">yrs</span>
                    )}
                  </div>
                  {i.hint && (
                    <span className="mt-1 block text-[11px] leading-relaxed text-ink-500 dark:text-ink-400">
                      {i.hint}
                    </span>
                  )}
                </div>
              );
            })}
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

        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            Result
          </div>
          <div className="rounded-lg border border-ink-200 bg-white p-4 text-sm shadow-inner dark:border-ink-700 dark:bg-ink-950/30">
            {render({ values: working })}
          </div>
        </div>
      </div>
    </div>
  );
}
