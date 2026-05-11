import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { LessonPage } from './pages/LessonPage';
import { StructuresOverview } from './pages/structures/StructuresOverview';
import { StructureDetail } from './pages/structures/StructureDetail';
import { StructureCompare } from './pages/structures/StructureCompare';
import { CashFlowLab } from './pages/lab/CashFlowLab';
import { LabScenarios } from './pages/lab/LabScenarios';
import { MultiYearLab } from './pages/lab/MultiYearLab';
import { UkOverview } from './pages/uk/UkOverview';
import { UkTopic } from './pages/uk/UkTopic';
import { PatternsOverview } from './pages/patterns/PatternsOverview';
import { PatternsExercise } from './pages/patterns/PatternsExercise';
import { StrategiesLanding } from './pages/strategies/StrategiesLanding';
import { StrategySection } from './pages/strategies/StrategySection';
import { ScenariosLibrary } from './pages/scenarios/ScenariosLibrary';
import { SavedScenarios } from './pages/scenarios/SavedScenarios';
import { ScenarioDetail } from './pages/scenarios/ScenarioDetail';
import { Glossary as GlossaryPage } from './pages/Glossary';
import { About } from './pages/About';
import { useAppState } from './state/AppState';
import { Menu } from './components/ui/Icons';
import { AbbrScopeProvider } from './components/ui/Abbr';
import { MyProfile } from './pages/MyProfile';

export default function App() {
  const { state } = useAppState();
  const [mobileNav, setMobileNav] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  if (!state.hasOnboarded) {
    return <Onboarding />;
  }

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
      {/* Desktop sidebar */}
      <div className="hidden md:sticky md:top-0 md:h-screen md:self-start md:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
            onClick={() => setMobileNav(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw]">
            <Sidebar onNavigate={() => setMobileNav(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onToggleMobileNav={() => setMobileNav((v) => !v)}
          mobileOpen={mobileNav}
        />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
          <AbbrScopeProvider>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/foundations" element={<Navigate to="/foundations/1-1" replace />} />
              <Route path="/foundations/:lessonId" element={<LessonPage />} />

              <Route path="/structures" element={<StructuresOverview />} />
              <Route path="/structures/compare" element={<StructureCompare />} />
              <Route path="/structures/:structureId" element={<StructureDetail />} />

              <Route path="/lab" element={<CashFlowLab />} />
              <Route path="/lab/scenarios" element={<LabScenarios />} />
              <Route path="/lab/multi-year" element={<MultiYearLab />} />

              <Route path="/uk" element={<UkOverview />} />
              <Route path="/uk/:topic" element={<UkTopic />} />

              <Route path="/patterns" element={<PatternsOverview />} />
              <Route path="/patterns/exercise" element={<PatternsExercise />} />

              <Route path="/strategies" element={<StrategiesLanding />} />
              <Route path="/strategies/:subsection" element={<StrategySection />} />

              <Route path="/scenarios" element={<ScenariosLibrary />} />
              <Route path="/scenarios/saved" element={<SavedScenarios />} />
              <Route path="/scenarios/:scenarioId" element={<ScenarioDetail />} />

              <Route path="/profile" element={<MyProfile />} />
              <Route path="/glossary" element={<GlossaryPage />} />
              <Route path="/about" element={<About />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AbbrScopeProvider>
        </main>
        <footer className="border-t border-ink-200 px-4 py-4 text-center text-xs text-ink-500 dark:border-ink-800 dark:text-ink-400">
          Tax & Structures Lab · Educational only · Not advice · Verify all figures with a qualified adviser
        </footer>
      </div>

      {/* Mobile menu button (only shown on mobile when nav closed) */}
      {!mobileNav && (
        <button
          className="fixed bottom-4 right-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-accent-600 text-white shadow-lg md:hidden"
          onClick={() => setMobileNav(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
