import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_STATE,
  loadState,
  saveState,
  uid,
  type PersistedState,
  type PersonalProfile,
  type SavedScenario,
} from '../lib/storage';

interface AppStateValue {
  state: PersistedState;
  setState: (updater: (s: PersistedState) => PersistedState) => void;
  // Lessons / progress
  markLessonComplete: (lessonId: string) => void;
  isLessonComplete: (lessonId: string) => boolean;
  toggleBookmark: (pageId: string) => void;
  isBookmarked: (pageId: string) => boolean;
  setNote: (pageId: string, note: string) => void;
  getNote: (pageId: string) => string;
  // Onboarding
  acceptDisclaimer: () => void;
  finishOnboarding: () => void;
  // Scenarios
  saveScenario: (scenario: Omit<SavedScenario, 'id' | 'createdAt' | 'updatedAt'>) => SavedScenario;
  updateScenario: (id: string, patch: Partial<SavedScenario>) => void;
  deleteScenario: (id: string) => void;
  // Pattern quiz
  recordPatternAnswer: (exerciseId: string, patternId: string) => void;
  // Reset
  resetAll: () => void;
  // Personal profile ("Show me with my numbers" memory)
  updateProfile: (patch: Partial<PersonalProfile>) => void;
  resetProfile: () => void;
  // Dark mode
  dark: boolean;
  setDark: (d: boolean) => void;
}

const AppStateCtx = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setRawState] = useState<PersistedState>(() => loadState());
  const [dark, setDarkRaw] = useState<boolean>(() => {
    if (typeof document !== 'undefined')
      return document.documentElement.classList.contains('dark');
    return false;
  });

  // Persist whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const setState = useCallback(
    (updater: (s: PersistedState) => PersistedState) => {
      setRawState((prev) => updater(prev));
    },
    [],
  );

  const setDark = useCallback((d: boolean) => {
    setDarkRaw(d);
    try {
      localStorage.setItem('tsl:dark', d ? '1' : '0');
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', d);
    }
  }, []);

  const value: AppStateValue = useMemo(
    () => ({
      state,
      setState,
      dark,
      setDark,
      markLessonComplete: (lessonId) =>
        setRawState((s) => ({
          ...s,
          completedLessons: { ...s.completedLessons, [lessonId]: Date.now() },
        })),
      isLessonComplete: (lessonId) => Boolean(state.completedLessons[lessonId]),
      toggleBookmark: (pageId) =>
        setRawState((s) => {
          const next = { ...s.bookmarks };
          if (next[pageId]) delete next[pageId];
          else next[pageId] = Date.now();
          return { ...s, bookmarks: next };
        }),
      isBookmarked: (pageId) => Boolean(state.bookmarks[pageId]),
      setNote: (pageId, note) =>
        setRawState((s) => ({ ...s, notes: { ...s.notes, [pageId]: note } })),
      getNote: (pageId) => state.notes[pageId] ?? '',
      acceptDisclaimer: () =>
        setRawState((s) => ({ ...s, disclaimerAcceptedAt: Date.now() })),
      finishOnboarding: () => setRawState((s) => ({ ...s, hasOnboarded: true })),
      saveScenario: (scenario) => {
        const now = Date.now();
        const created: SavedScenario = {
          id: uid(),
          createdAt: now,
          updatedAt: now,
          ...scenario,
        };
        setRawState((s) => ({ ...s, scenarios: [created, ...s.scenarios] }));
        return created;
      },
      updateScenario: (id, patch) =>
        setRawState((s) => ({
          ...s,
          scenarios: s.scenarios.map((sc) =>
            sc.id === id ? { ...sc, ...patch, updatedAt: Date.now() } : sc,
          ),
        })),
      deleteScenario: (id) =>
        setRawState((s) => ({
          ...s,
          scenarios: s.scenarios.filter((sc) => sc.id !== id),
        })),
      recordPatternAnswer: (exerciseId, patternId) =>
        setRawState((s) => ({
          ...s,
          patternQuiz: { ...s.patternQuiz, [exerciseId]: patternId },
        })),
      resetAll: () => {
        setRawState(DEFAULT_STATE);
      },
      updateProfile: (patch) =>
        setRawState((s) => {
          // Strip undefined / NaN so the stored object stays clean.
          const merged: PersonalProfile = { ...s.personalProfile };
          for (const [k, v] of Object.entries(patch) as [
            keyof PersonalProfile,
            number | undefined,
          ][]) {
            if (v === undefined || v === null || (typeof v === 'number' && !isFinite(v))) {
              delete merged[k];
            } else {
              merged[k] = v as never;
            }
          }
          return { ...s, personalProfile: merged };
        }),
      resetProfile: () =>
        setRawState((s) => ({ ...s, personalProfile: {} })),
    }),
    [state, setState, dark, setDark],
  );

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState(): AppStateValue {
  const v = useContext(AppStateCtx);
  if (!v) throw new Error('useAppState must be used inside AppStateProvider');
  return v;
}
