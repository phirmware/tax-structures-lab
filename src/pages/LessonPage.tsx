import { Link, useParams } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { getLessonById, LESSONS, nextLesson, prevLesson } from '../content/lessons';
import { PageHeader } from '../components/ui/PageHeader';
import { DisclaimerBanner } from '../components/ui/Disclaimer';
import { NotesPanel } from '../components/ui/NotesPanel';
import { Check } from '../components/ui/Icons';
import { LessonOne } from '../content/lessonsContent/LessonOne';
import { LessonTwo } from '../content/lessonsContent/LessonTwo';
import { LessonThree } from '../content/lessonsContent/LessonThree';
import { LessonFour } from '../content/lessonsContent/LessonFour';
import { LessonFive } from '../content/lessonsContent/LessonFive';
import { LessonSix } from '../content/lessonsContent/LessonSix';
import { LessonSeven } from '../content/lessonsContent/LessonSeven';
import { LessonEight } from '../content/lessonsContent/LessonEight';
import { LessonNine } from '../content/lessonsContent/LessonNine';
import { LessonTen } from '../content/lessonsContent/LessonTen';

const LESSON_BODIES: Record<string, () => JSX.Element> = {
  '1-1': LessonOne,
  '1-2': LessonTwo,
  '1-3': LessonThree,
  '1-4': LessonFour,
  '1-5': LessonFive,
  '1-6': LessonSix,
  '1-7': LessonSeven,
  '1-8': LessonEight,
  '1-9': LessonNine,
  '1-10': LessonTen,
};

export function LessonPage() {
  const { lessonId = '1-1' } = useParams();
  const lesson = getLessonById(lessonId);
  const { isLessonComplete, markLessonComplete } = useAppState();

  if (!lesson) {
    return (
      <div className="card-pad">
        <h1 className="heading-1">Lesson not found</h1>
        <p className="mt-2 lede">
          <Link className="text-accent-700 underline dark:text-accent-300" to="/foundations/1-1">
            Back to lesson 1.1
          </Link>
        </p>
      </div>
    );
  }

  const Body = LESSON_BODIES[lesson.id];
  const prev = prevLesson(lesson.id);
  const next = nextLesson(lesson.id);
  const completed = isLessonComplete(lesson.id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Foundations · Lesson ${lesson.number}`}
        title={lesson.title}
        description={lesson.summary}
        pageId={`foundations/${lesson.id}`}
        actions={
          <button
            type="button"
            onClick={() => markLessonComplete(lesson.id)}
            className={
              completed
                ? 'btn bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-200'
                : 'btn-primary'
            }
          >
            <Check className="h-4 w-4" /> {completed ? 'Completed' : 'Mark complete'}
          </button>
        }
      />

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="chip">{lesson.minutes} min</span>
        {lesson.patternsTouched.map((p) => (
          <span className="chip-accent" key={p}>
            Pattern: {p}
          </span>
        ))}
      </div>

      <DisclaimerBanner compact />

      <article className="card-pad prose-app">
        {Body ? <Body /> : <p>Lesson content coming soon.</p>}
      </article>

      <nav className="grid gap-3 sm:grid-cols-3">
        {prev ? (
          <Link to={`/foundations/${prev.id}`} className="card-pad text-left transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              ← Previous
            </div>
            <div className="text-sm font-semibold">
              {prev.number} · {prev.title}
            </div>
          </Link>
        ) : (
          <span />
        )}
        <Link to="/foundations/1-1" className="card-pad text-center text-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            All foundations
          </div>
          <div className="font-mono">
            {LESSONS.findIndex((l) => l.id === lesson.id) + 1}/{LESSONS.length}
          </div>
        </Link>
        {next ? (
          <Link to={`/foundations/${next.id}`} className="card-pad text-right transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Next →
            </div>
            <div className="text-sm font-semibold">
              {next.number} · {next.title}
            </div>
          </Link>
        ) : (
          <Link to="/structures" className="card-pad text-right transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Next section →
            </div>
            <div className="text-sm font-semibold">2 · Structures</div>
          </Link>
        )}
      </nav>

      <NotesPanel pageId={`foundations/${lesson.id}`} />
    </div>
  );
}
