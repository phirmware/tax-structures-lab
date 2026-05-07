import { useAppState } from '../state/AppState';
import { PageHeader } from '../components/ui/PageHeader';
import { DisclaimerBanner } from '../components/ui/Disclaimer';
import { RATES_AS_OF, RATES_LAST_REVIEWED } from '../lib/constants';
import { LESSONS } from '../content/lessons';

export function About() {
  const { state, resetAll } = useAppState();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reference"
        title="About this app"
        description="What it is, what it isn't, and how to use it well."
      />

      <DisclaimerBanner />

      <section className="card-pad prose-app">
        <h2 className="!mt-0">What this app is</h2>
        <p>
          Tax & Structures Lab is a self-paced curriculum for founders who've spent years running
          businesses without a clear understanding of how tax systems and entity structures shape
          their wealth.
        </p>
        <p>
          The structure is six sections: Foundations, Structures, Cash Flow Lab, UK Specifics,
          Patterns, Scenarios. Read the Foundations sequentially, then jump around as relevant.
          The Cash Flow Lab is where the abstract becomes concrete.
        </p>

        <h2>What this app isn't</h2>
        <p>
          It is not tax advice. It is not a substitute for a qualified accountant. It is not
          comprehensive — UK tax law has corners this curriculum doesn't reach.
        </p>
        <p>
          The numbers used are illustrative. Rates, thresholds, allowances, and reliefs change
          every budget. The principles taught here are durable; the numbers are dated.
        </p>

        <h2>How rates are sourced</h2>
        <ul>
          <li>
            All numbers reflect <strong>{RATES_AS_OF}</strong>.
          </li>
          <li>Last reviewed {RATES_LAST_REVIEWED}.</li>
          <li>
            Cross-check against gov.uk, your accountant, or HMRC's manuals before any decision.
          </li>
        </ul>

        <h2>How to use this app well</h2>
        <ol>
          <li>Walk the foundations in order. Each builds on the last.</li>
          <li>Use the Cash Flow Lab whenever a concept feels abstract.</li>
          <li>Read UK Specifics with one eye on which pattern is being implemented.</li>
          <li>Do the patterns recognition exercise — it's where the learning becomes durable.</li>
          <li>Save scenarios as you go. They're your personal worked examples.</li>
        </ol>

        <h2>Privacy & storage</h2>
        <p>
          Your progress, notes and scenarios are saved locally in your browser using
          LocalStorage. There is no backend; nothing leaves your device. Clearing browser data
          will delete your progress.
        </p>

        <div className="mt-8">
          <h2>Reset</h2>
          <p>
            If you want to start over (lessons, notes, scenarios, exercise progress), use the
            button below.
          </p>
          <button
            type="button"
            className="btn-secondary mt-2"
            onClick={() => {
              if (
                confirm(
                  'This will erase all saved progress, notes and scenarios for this app. Continue?',
                )
              ) {
                resetAll();
                window.location.hash = '#/';
                window.location.reload();
              }
            }}
          >
            Reset all progress
          </button>
        </div>

        <div className="mt-8 text-xs italic text-ink-500 dark:text-ink-400">
          Curriculum: {LESSONS.length} foundations lessons · Disclaimer accepted{' '}
          {state.disclaimerAcceptedAt
            ? new Date(state.disclaimerAcceptedAt).toLocaleString()
            : '—'}
        </div>
      </section>
    </div>
  );
}
