import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import { UK_OVERVIEW_CHANGE_NOTE, UK_TOPICS } from '../../content/ukTopics';
import { RATES_AS_OF } from '../../lib/constants';

export function UkOverview() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Section 4"
        title="UK Specifics"
        description="Universal patterns applied to the UK system. Numbers are dated; the patterns are not."
        pageId="uk"
      />
      <DisclaimerBanner />

      <section className="card-pad border-warn-500/30 bg-warn-500/5">
        <h2 className="heading-2">What changed recently</h2>
        <p className="mt-2 lede">{UK_OVERVIEW_CHANGE_NOTE}</p>
        <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">
          Rates last reviewed for {RATES_AS_OF}. Cross-check current values before any decision.
        </p>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {UK_TOPICS.map((t) => (
          <Link
            key={t.id}
            to={`/uk/${t.id}`}
            className="card-pad transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="font-semibold">{t.title}</div>
              <span className="chip-accent text-[10px]">{t.pattern}</span>
            </div>
            <p className="mt-2 text-sm text-ink-700 dark:text-ink-300">{t.summary}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
