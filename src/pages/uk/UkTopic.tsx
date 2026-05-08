import { Link, useParams } from 'react-router-dom';
import { getUkTopic, UK_TOPICS } from '../../content/ukTopics';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import { NotesPanel } from '../../components/ui/NotesPanel';
import { LessonSummary } from '../../components/ui/LessonSummary';
import { FounderMistakes } from '../../components/ui/FounderMistakes';
import { UkTopicInteractives } from './UkTopicInteractives';

export function UkTopic() {
  const { topic = '' } = useParams();
  const t = getUkTopic(topic);
  if (!t) {
    return (
      <div className="card-pad">
        <h1 className="heading-1">Topic not found</h1>
        <p className="mt-2">
          <Link className="text-accent-700 underline dark:text-accent-300" to="/uk">
            Back to UK overview
          </Link>
        </p>
      </div>
    );
  }
  const idx = UK_TOPICS.findIndex((x) => x.id === t.id);
  const prev = idx > 0 ? UK_TOPICS[idx - 1] : undefined;
  const next = idx < UK_TOPICS.length - 1 ? UK_TOPICS[idx + 1] : undefined;
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`UK Specifics · Pattern: ${t.pattern}`}
        title={t.title}
        description={t.summary}
        pageId={`uk/${t.id}`}
      />
      <LessonSummary pageId={`uk/${t.id}`} />
      <DisclaimerBanner compact />
      <article className="card-pad prose-app">{t.body()}</article>
      <UkTopicInteractives topicId={t.id} />
      <FounderMistakes pageId={`uk/${t.id}`} />
      <nav className="grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            to={`/uk/${prev.id}`}
            className="card-pad transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              ← Previous topic
            </div>
            <div className="text-sm font-semibold">{prev.title}</div>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/uk/${next.id}`}
            className="card-pad text-right transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Next topic →
            </div>
            <div className="text-sm font-semibold">{next.title}</div>
          </Link>
        ) : (
          <Link
            to="/patterns"
            className="card-pad text-right transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Next section →
            </div>
            <div className="text-sm font-semibold">5 · Patterns</div>
          </Link>
        )}
      </nav>
      <NotesPanel pageId={`uk/${t.id}`} />
    </div>
  );
}
