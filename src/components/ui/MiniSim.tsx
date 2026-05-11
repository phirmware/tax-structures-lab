import { useMemo, useState, type ReactNode } from 'react';
import { Calculator } from './Icons';
import { clamp, formatGBP } from '../../lib/format';

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

type InputBounds = Record<string, { min: number; max: number; step: number }>;

function inputKind(i: MiniSimInput) {
  return i.kind ?? 'currency';
}

function fallbackMax(i: MiniSimInput) {
  const kind = inputKind(i);
  if (kind === 'currency') return Math.max(i.defaultValue * 4, 100_000);
  if (kind === 'percent') return 1;
  return 40;
}

function fallbackStep(i: MiniSimInput) {
  const kind = inputKind(i);
  if (kind === 'percent') return 0.005;
  if (kind === 'years' || kind === 'months' || kind === 'count') return 1;
  return 100;
}

function formatInputValue(kind: MiniSimInputKind, value: number) {
  if (kind === 'currency') return formatGBP(value);
  if (kind === 'percent') return `${(value * 100).toFixed(1)}%`;
  if (kind === 'years') return `${Math.round(value)} yr${Math.round(value) === 1 ? '' : 's'}`;
  if (kind === 'months') return `${Math.round(value)} mo${Math.round(value) === 1 ? '' : 's'}`;
  return Math.round(value).toString();
}

function numberFieldValue(kind: MiniSimInputKind, value: number) {
  return kind === 'percent' ? Number((value * 100).toFixed(2)) : Math.round(value);
}

function valueFromNumberField(kind: MiniSimInputKind, value: number) {
  return kind === 'percent' ? value / 100 : value;
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
  const seeded = useMemo(() => {
    const values: Record<string, number> = {};
    const bounds: InputBounds = {};
    for (const i of inputs) {
      const min = i.min ?? 0;
      const max = i.max ?? fallbackMax(i);
      const step = i.step ?? fallbackStep(i);
      bounds[i.key] = { min, max, step };
      values[i.key] = clamp(i.defaultValue, min, max);
    }
    return { values, bounds };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [open, setOpen] = useState(defaultOpen);
  const [working, setWorking] = useState<Record<string, number>>(seeded.values);

  const setOne = (k: string, v: number) =>
    setWorking((p) => {
      const b = seeded.bounds[k];
      return { ...p, [k]: clamp(isFinite(v) ? v : b.min, b.min, b.max) };
    });

  const reset = () => setWorking(seeded.values);

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
              const kind = inputKind(i);
              const display = formatInputValue(kind, working[i.key]);
              const { min, max, step } = seeded.bounds[i.key];
              const fieldMin = kind === 'percent' ? min * 100 : min;
              const fieldMax = kind === 'percent' ? max * 100 : max;
              const fieldStep = kind === 'percent' ? step * 100 : step;
              const labelId = `mini-sim-${i.key}-label`;
              return (
                <div
                  key={i.key}
                  className="block rounded-lg border border-ink-200 bg-ink-50/70 p-3 text-sm dark:border-ink-800 dark:bg-ink-950/40"
                >
                  <span className="mb-1 flex items-baseline justify-between gap-2">
                    <span id={labelId} className="font-medium text-ink-700 dark:text-ink-200">
                      {i.label}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-accent-700 dark:text-accent-300">
                      {display}
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
                    {kind === 'currency' && (
                      <span className="text-xs font-medium text-ink-400">£</span>
                    )}
                    <input
                      type="number"
                      className="input h-8 px-2 py-1 font-mono text-xs"
                      aria-label={`${i.label} exact value`}
                      value={numberFieldValue(kind, working[i.key])}
                      min={fieldMin}
                      max={fieldMax}
                      step={fieldStep}
                      onFocus={(e) => e.currentTarget.select()}
                      onChange={(e) =>
                        setOne(i.key, valueFromNumberField(kind, Number(e.target.value)))
                      }
                    />
                    {kind !== 'currency' && (
                      <span className="text-xs font-medium text-ink-400">
                        {kind === 'percent'
                          ? '%'
                          : kind === 'years'
                            ? 'yrs'
                            : kind === 'months'
                              ? 'mo'
                              : 'count'}
                      </span>
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
