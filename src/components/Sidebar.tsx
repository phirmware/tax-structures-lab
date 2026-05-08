import { NavLink } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { Check } from './ui/Icons';
import { LESSONS } from '../content/lessons';
import { STRUCTURES } from '../content/structures';

const SECTIONS = [
  {
    title: 'Get started',
    items: [{ to: '/', label: 'Home' }],
  },
  {
    title: '1. Foundations',
    items: LESSONS.map((l) => ({
      to: `/foundations/${l.id}`,
      label: `${l.number} · ${l.title}`,
      lessonId: l.id,
    })),
  },
  {
    title: '2. Structures',
    items: [
      { to: '/structures', label: 'Overview' },
      ...STRUCTURES.map((s) => ({
        to: `/structures/${s.id}`,
        label: s.shortName,
      })),
      { to: '/structures/compare', label: 'Compare side-by-side' },
    ],
  },
  {
    title: '3. Cash Flow Lab',
    items: [
      { to: '/lab', label: 'Open the simulator' },
      { to: '/lab/scenarios', label: 'Pre-built scenarios' },
      { to: '/lab/multi-year', label: 'Multi-year mode' },
    ],
  },
  {
    title: '4. UK Specifics',
    items: [
      { to: '/uk', label: 'Overview' },
      { to: '/uk/corporation-tax', label: 'Corporation tax' },
      { to: '/uk/income-tax', label: 'Income tax & NI' },
      { to: '/uk/dividends', label: 'Dividend tax' },
      { to: '/uk/salary-vs-dividend', label: 'Salary vs. dividend' },
      { to: '/uk/directors-loan', label: "Director's loans" },
      { to: '/uk/vat', label: 'VAT' },
      { to: '/uk/rd', label: 'R&D credits' },
      { to: '/uk/eis-seis', label: 'EIS / SEIS' },
      { to: '/uk/pensions', label: 'Pensions' },
      { to: '/uk/cgt', label: 'Capital gains' },
      { to: '/uk/badr', label: 'BADR' },
      { to: '/uk/ir35', label: 'IR35' },
      { to: '/uk/groups', label: 'Group structures' },
      { to: '/uk/isa', label: 'ISAs / LISAs' },
      { to: '/uk/iht', label: 'Inheritance tax' },
    ],
  },
  {
    title: '5. Patterns',
    items: [
      { to: '/patterns', label: 'Universal patterns' },
      { to: '/patterns/exercise', label: 'Recognition exercise' },
    ],
  },
  {
    title: '6. Scenarios',
    items: [
      { to: '/scenarios', label: 'Worked examples' },
      { to: '/scenarios/saved', label: 'Your saved scenarios' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { to: '/profile', label: 'My profile' },
      { to: '/glossary', label: 'Glossary' },
      { to: '/about', label: 'About this app' },
    ],
  },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { state, isLessonComplete } = useAppState();

  const completedCount = LESSONS.filter((l) => isLessonComplete(l.id)).length;
  const total = LESSONS.length;

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-ink-200 bg-white/80 backdrop-blur dark:border-ink-800 dark:bg-ink-950/80">
      <div className="border-b border-ink-200 px-4 py-4 dark:border-ink-800">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-600 text-white shadow-sm">
            <span className="font-mono text-sm font-bold">£</span>
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Tax & Structures Lab</div>
            <div className="text-[11px] text-ink-500 dark:text-ink-400">
              Educational · {state.jurisdiction}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-ink-200 px-4 py-3 dark:border-ink-800">
        <div className="flex items-center justify-between text-xs text-ink-500 dark:text-ink-400">
          <span>Foundations progress</span>
          <span className="font-mono">
            {completedCount}/{total}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
          <div
            className="h-full bg-accent-500 transition-[width] duration-500"
            style={{ width: total ? `${(completedCount / total) * 100}%` : '0%' }}
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {SECTIONS.map((section) => (
          <div key={section.title} className="mb-3">
            <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              {section.title}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const lessonDone =
                  'lessonId' in item && (item as any).lessonId
                    ? isLessonComplete((item as any).lessonId)
                    : false;
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        [
                          'flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-sm transition',
                          isActive
                            ? 'bg-accent-100 font-medium text-accent-900 dark:bg-accent-900/40 dark:text-accent-100'
                            : 'text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800',
                        ].join(' ')
                      }
                    >
                      <span className="truncate">{item.label}</span>
                      {lessonDone && (
                        <Check className="h-3.5 w-3.5 shrink-0 text-accent-600 dark:text-accent-300" />
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
