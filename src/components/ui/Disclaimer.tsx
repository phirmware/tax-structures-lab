import { DISCLAIMER_LONG, DISCLAIMER_SHORT, RATES_AS_OF } from '../../lib/constants';

export function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      role="note"
      className="rounded-lg border border-warn-500/40 bg-warn-500/10 px-3 py-2 text-xs leading-relaxed text-warn-500 dark:text-warn-500"
    >
      <span className="font-semibold">Educational only.</span>{' '}
      {compact ? DISCLAIMER_SHORT : DISCLAIMER_LONG}
      <span className="ml-1 italic opacity-80">Rates referenced: {RATES_AS_OF}.</span>
    </div>
  );
}

export function DisclaimerInline() {
  return (
    <p className="mt-6 text-xs italic text-ink-500 dark:text-ink-400">
      Educational only — not advice. Numbers shown are illustrative; principles persist, rates change.
      Always consult a qualified accountant before acting.
    </p>
  );
}
