import { useState } from 'react';
import { useAppState } from '../state/AppState';
import { DISCLAIMER_LONG } from '../lib/constants';
import { Check } from '../components/ui/Icons';

const STEPS = ['welcome', 'disclaimer', 'jurisdiction', 'storage'] as const;

export function Onboarding() {
  const { acceptDisclaimer, finishOnboarding, state } = useAppState();
  const [step, setStep] = useState<(typeof STEPS)[number]>('welcome');
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-ink-50 to-ink-100 dark:from-ink-950 dark:via-ink-950 dark:to-ink-900">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent-600 text-white shadow-md">
            <span className="font-mono text-lg font-bold">£</span>
          </div>
          <div>
            <div className="text-base font-semibold leading-tight">Tax & Structures Lab</div>
            <div className="text-xs text-ink-500 dark:text-ink-400">
              An interactive learning environment for founders
            </div>
          </div>
        </div>

        <div className="card-pad flex-1">
          <Stepper current={step} />

          {step === 'welcome' && (
            <div className="mt-8 prose-app">
              <h2 className="!mt-0">Welcome.</h2>
              <p>
                You've spent the last decade running businesses without a clear picture of how
                taxes and structures shape what you actually keep. That stops here.
              </p>
              <p>
                This app teaches the <strong>why</strong>, not just the rates. Tax law changes every
                budget; the underlying patterns don't. By the end of the curriculum you'll be able
                to read any business situation — UK or otherwise — and see where the tax-relevant
                levers are.
              </p>
              <p>The path you'll walk:</p>
              <ul>
                <li><strong>Foundations</strong> — universal principles that apply everywhere</li>
                <li><strong>Structures</strong> — entity types compared, with cash flow diagrams</li>
                <li><strong>Cash Flow Lab</strong> — an interactive simulator (the centerpiece)</li>
                <li><strong>UK Specifics</strong> — your current jurisdiction</li>
                <li><strong>Patterns</strong> — recognizing tax-relevant patterns in any business</li>
                <li><strong>Scenarios</strong> — worked examples + your own saved scenarios</li>
              </ul>
              <p>Plan on roughly six weeks of 30–60 minute sessions for genuine fluency.</p>
              <div className="mt-6 flex justify-end">
                <button className="btn-primary" onClick={() => setStep('disclaimer')}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 'disclaimer' && (
            <div className="mt-8">
              <h2 className="heading-2">Read this before going further.</h2>
              <div className="mt-4 rounded-lg border border-warn-500/40 bg-warn-500/10 p-4 text-sm leading-relaxed text-ink-800 dark:text-ink-100">
                {DISCLAIMER_LONG}
              </div>
              <label className="mt-6 flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-ink-300 text-accent-600 focus:ring-accent-500"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span className="text-sm">
                  I understand this is educational, not advisory. I will verify any specific decision
                  with a qualified accountant or tax adviser before acting.
                </span>
              </label>
              <div className="mt-6 flex justify-between">
                <button className="btn-secondary" onClick={() => setStep('welcome')}>
                  ← Back
                </button>
                <button
                  className="btn-primary"
                  disabled={!agreed}
                  onClick={() => {
                    acceptDisclaimer();
                    setStep('jurisdiction');
                  }}
                >
                  I agree, continue →
                </button>
              </div>
            </div>
          )}

          {step === 'jurisdiction' && (
            <div className="mt-8 prose-app">
              <h2 className="!mt-0">Which jurisdiction?</h2>
              <p>
                You're being taught universal patterns, with the UK as the worked example. The
                principles you learn will transfer to other countries.
              </p>
              <div className="mt-4 rounded-lg border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">United Kingdom</div>
                    <div className="text-xs text-ink-500 dark:text-ink-400">
                      Selected — current scope of the app
                    </div>
                  </div>
                  <Check className="h-5 w-5 text-accent-600 dark:text-accent-300" />
                </div>
              </div>
              <p className="mt-3 text-xs text-ink-500 dark:text-ink-400">
                Other jurisdictions are not implemented yet. The patterns section will help you
                evaluate situations elsewhere.
              </p>
              <div className="mt-6 flex justify-between">
                <button className="btn-secondary" onClick={() => setStep('disclaimer')}>
                  ← Back
                </button>
                <button className="btn-primary" onClick={() => setStep('storage')}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 'storage' && (
            <div className="mt-8 prose-app">
              <h2 className="!mt-0">One last thing.</h2>
              <p>
                Your progress, notes, and scenarios are saved in this browser using LocalStorage.
                There is no backend — nothing leaves this device.
              </p>
              <p>
                If you clear browser data, you'll lose your progress. You can also export saved
                scenarios as Markdown / PDF from inside the app.
              </p>
              <p className="text-sm text-ink-500 dark:text-ink-400">
                Disclaimer accepted{' '}
                {state.disclaimerAcceptedAt
                  ? new Date(state.disclaimerAcceptedAt).toLocaleString()
                  : ''}.
              </p>
              <div className="mt-6 flex justify-between">
                <button className="btn-secondary" onClick={() => setStep('jurisdiction')}>
                  ← Back
                </button>
                <button className="btn-primary" onClick={finishOnboarding}>
                  Open the app →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ current }: { current: (typeof STEPS)[number] }) {
  const idx = STEPS.indexOf(current);
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => (
        <div key={s} className="flex flex-1 items-center gap-2">
          <div
            className={
              i <= idx
                ? 'h-1.5 w-full rounded-full bg-accent-500'
                : 'h-1.5 w-full rounded-full bg-ink-200 dark:bg-ink-800'
            }
          />
        </div>
      ))}
    </div>
  );
}
