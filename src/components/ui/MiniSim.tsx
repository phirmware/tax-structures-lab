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

  const reset = () => setWorking(initial);

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
              Edit any input. Numbers update live; nothing is saved anywhere.
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
              const min = i.min ?? 0;
              const max =
                i.max ??
                (kind === 'currency'
                  ? Math.max(working[i.key] * 4, 100_000)
                  : kind === 'percent'
                    ? 1
                    : 40);
              return (
                <label
                  key={i.key}
                  className="block rounded-lg border border-ink-200 bg-ink-50/70 p-3 text-sm dark:border-ink-800 dark:bg-ink-950/40"
                >
                  <span className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="font-medium text-ink-700 dark:text-ink-200">
                      {i.label}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-accent-700 dark:text-accent-300">
                      {display}
                    </span>
                  </span>
                  <input
                    type="range"
                    className="w-full accent-accent-600"
                    value={working[i.key]}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setOne(i.key, isFinite(v) ? v : 0);
                    }}
                  />
                  {i.hint && (
                    <span className="mt-1 block text-[11px] leading-relaxed text-ink-500 dark:text-ink-400">
                      {i.hint}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            Result
          </div>
          <div className="rounded-lg border border-ink-200 bg-white p-4 text-sm shadow-inner dark:border-ink-700 dark:bg-ink-950/30">
            {render({ values: working })}
          </div>
          {footer && (
            <p className="mt-3 text-[11px] leading-relaxed text-ink-500 dark:text-ink-400">
              {footer}
            </p>
          )}
        </div>
      </div>
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
  const frame =
    tone === 'ok'
      ? 'border-accent-300 bg-accent-50/60 dark:border-accent-800 dark:bg-accent-900/20'
      : tone === 'bad'
        ? 'border-danger-500/40 bg-danger-500/10'
        : tone === 'warn'
          ? 'border-warn-500/40 bg-warn-500/10'
          : 'border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-900/60';
  return (
    <div
      className={
        `rounded-lg border p-3 shadow-sm ${frame} ` +
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
