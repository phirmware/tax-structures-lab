import { useMemo, useState, type ReactNode } from 'react';
import { Calculator } from './Icons';
import { formatGBP } from '../../lib/format';

export type MiniSimInputKind =
  | 'currency'
  | 'years'
  | 'months'
  | 'count'
  | 'percent';

export interface MiniSimInput {
  key: string;
  label: string;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  kind?: MiniSimInputKind;
}

interface RenderArgs {
  values: Record<string, number>;
}

/**
 * Lightweight inline simulator for strategies that don't naturally map to the
 * personal-profile fields. Same visual feel as ShowWithMyNumbers but local-
 * state only — nothing is persisted.
 */
export function MiniSim({
  title = 'Show me with my numbers',
  inputs,
  render,
  defaultOpen = false,
  footer,
}: {
  title?: string;
  inputs: MiniSimInput[];
  render: (args: RenderArgs) => ReactNode;
  defaultOpen?: boolean;
  /** Optional small-print under the result. */
  footer?: ReactNode;
}) {
  const initial = useMemo(() => {
    const obj: Record<string, number> = {};
    for (const i of inputs) obj[i.key] = i.defaultValue;
    return obj;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [open, setOpen] = useState(defaultOpen);
  const [working, setWorking] = useState<Record<string, number>>(initial);

  const setOne = (k: string, v: number) =>
    setWorking((p) => ({ ...p, [k]: v }));

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
        Edit any input. Numbers update live; nothing is saved anywhere.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {inputs.map((i) => {
          const kind = i.kind ?? 'currency';
          const display =
            kind === 'currency'
              ? `£${Math.round(working[i.key]).toLocaleString('en-GB')}`
              : kind === 'percent'
                ? `${(working[i.key] * 100).toFixed(1)}%`
                : kind === 'years'
                  ? `${working[i.key]} yr${working[i.key] === 1 ? '' : 's'}`
                  : kind === 'months'
                    ? `${working[i.key]} mo${working[i.key] === 1 ? '' : 's'}`
                    : Math.round(working[i.key]).toString();
          const step =
            i.step ??
            (kind === 'percent'
              ? 0.005
              : kind === 'years' || kind === 'months' || kind === 'count'
                ? 1
                : 100);
          return (
            <label key={i.key} className="block text-sm">
              <span className="mb-1 flex items-baseline justify-between gap-2">
                <span className="font-medium text-ink-700 dark:text-ink-200">
                  {i.label}
                </span>
                <span className="font-mono text-xs text-ink-500 dark:text-ink-400">
                  {display}
                </span>
              </span>
              <input
                type="number"
                className="input"
                value={working[i.key]}
                min={i.min}
                max={i.max}
                step={step}
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

      {footer && (
        <p className="mt-3 text-[11px] text-ink-500 dark:text-ink-400">
          {footer}
        </p>
      )}
    </div>
  );
}

/** Small box used inside MiniSim render functions. */
export function SimBox({
  label,
  value,
  tone,
  full,
}: {
  label: string;
  value: number | string;
  tone?: 'ok' | 'bad' | 'warn';
  full?: boolean;
}) {
  const colour =
    tone === 'ok'
      ? 'text-accent-700 dark:text-accent-300'
      : tone === 'bad'
        ? 'text-danger-500'
        : tone === 'warn'
          ? 'text-yellow-700 dark:text-yellow-300'
          : 'text-ink-800 dark:text-ink-100';
  return (
    <div
      className={
        'rounded-lg border border-ink-200 p-3 dark:border-ink-700 ' +
        (full ? 'sm:col-span-2' : '')
      }
    >
      <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {label}
      </div>
      <div className={`mt-1 font-mono text-sm font-semibold tabular-nums ${colour}`}>
        {typeof value === 'number' ? formatGBP(value) : value}
      </div>
    </div>
  );
}
