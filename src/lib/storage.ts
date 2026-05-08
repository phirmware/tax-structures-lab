// Versioned LocalStorage layer.
// Schema version lets us migrate or reset cleanly when the shape changes.

const KEY = 'tsl:state';
// v2 introduces personalProfile (the "Show me with my numbers" memory).
const SCHEMA_VERSION = 2;

/**
 * Personal profile: the user's own numbers. Each "Show me with my numbers"
 * panel reads/writes the relevant variables from this single shared object,
 * so once a value has been entered anywhere it pre-populates everywhere.
 *
 * All fields are optional — callers fall back to lesson defaults when the
 * user hasn't entered a value yet.
 */
export interface PersonalProfile {
  // Operating numbers
  annualRevenue?: number;
  annualCosts?: number;
  // Personal extraction
  personalIncomeNeed?: number;
  ownerSalary?: number;
  pensionContribution?: number;
  // Misc planning inputs
  rdEligibleSpend?: number;
  // Time horizon used by deferral / retention demonstrations
  yearsHorizon?: number;
}

export const PROFILE_FIELDS: Array<{
  key: keyof PersonalProfile;
  label: string;
  hint: string;
  kind: 'currency' | 'years';
}> = [
  {
    key: 'annualRevenue',
    label: 'Annual revenue',
    hint: 'Money your business takes in across a year, before any costs.',
    kind: 'currency',
  },
  {
    key: 'annualCosts',
    label: 'Annual costs',
    hint: 'Costs of running the business — software, rent, contractors.',
    kind: 'currency',
  },
  {
    key: 'personalIncomeNeed',
    label: 'Personal cash needed',
    hint: 'How much you need to take home (after tax) to live on.',
    kind: 'currency',
  },
  {
    key: 'ownerSalary',
    label: 'Director salary (Ltd)',
    hint: 'The salary your company pays you directly.',
    kind: 'currency',
  },
  {
    key: 'pensionContribution',
    label: 'Pension contribution',
    hint: 'Annual employer pension contribution from your company.',
    kind: 'currency',
  },
  {
    key: 'rdEligibleSpend',
    label: 'R&D eligible spend',
    hint: 'Annual qualifying R&D spend, if relevant to you.',
    kind: 'currency',
  },
  {
    key: 'yearsHorizon',
    label: 'Time horizon',
    hint: 'How many years out you want to model deferral / retention.',
    kind: 'years',
  },
];

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
  // Personal profile — "Show me with my numbers" memory.
  // All fields optional so callers fall back to lesson defaults gracefully.
  personalProfile: PersonalProfile;
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
  personalProfile: {},
};

/**
 * Migrate older persisted shapes forward without losing user data. We try to
 * keep onboarding state, completion, bookmarks, notes, and saved scenarios
 * across schema bumps; new fields fall back to their defaults.
 */
function migrate(parsed: any): PersistedState {
  if (!parsed || typeof parsed !== 'object') return DEFAULT_STATE;
  if (parsed.version === SCHEMA_VERSION) {
    return { ...DEFAULT_STATE, ...parsed };
  }
  // v1 → v2: add personalProfile, bump version, keep everything else.
  if (parsed.version === 1) {
    return {
      ...DEFAULT_STATE,
      ...parsed,
      personalProfile: {},
      version: SCHEMA_VERSION,
    };
  }
  // Unknown / future version — start clean rather than risk corrupting state.
  return DEFAULT_STATE;
}

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return migrate(parsed);
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
