// Versioned LocalStorage layer.
// Schema version lets us migrate or reset cleanly when the shape changes.

const KEY = 'tsl:state';
const SCHEMA_VERSION = 1;

export interface SavedScenario {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  notes?: string;
  inputs: {
    revenue: number;
    costs: number;
    desiredCash: number;
    ownerSalary: number;
    pensionContribution: number;
    rdEligibleSpend: number;
    structures: string[]; // structure ids being compared
    multiYear?: {
      years: number;
      revenueGrowth: number;
      reinvestReturn: number;
    };
  };
}

export interface PersistedState {
  version: number;
  // Onboarding
  hasOnboarded: boolean;
  disclaimerAcceptedAt: number | null;
  jurisdiction: 'UK';
  // Progress
  completedLessons: Record<string, number>; // lessonId -> completedAt
  bookmarks: Record<string, number>; // pageId -> savedAt
  notes: Record<string, string>; // pageId -> markdown
  // Scenarios
  scenarios: SavedScenario[];
  // UI prefs
  sidebarCollapsed: boolean;
  // Pattern recognition exercise progress
  patternQuiz: Record<string, string>; // exerciseId -> chosenPatternId
}

export const DEFAULT_STATE: PersistedState = {
  version: SCHEMA_VERSION,
  hasOnboarded: false,
  disclaimerAcceptedAt: null,
  jurisdiction: 'UK',
  completedLessons: {},
  bookmarks: {},
  notes: {},
  scenarios: [],
  sidebarCollapsed: false,
  patternQuiz: {},
};

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed || parsed.version !== SCHEMA_VERSION) {
      return DEFAULT_STATE;
    }
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage may be full or disabled; soft-fail.
  }
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
