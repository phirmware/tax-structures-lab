import { Link, useParams } from 'react-router-dom';
import { useAppState } from '../../state/AppState';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import { ltdResult, soleTraderResult } from '../../lib/tax';
import {
  CashFlowLegend,
  FullscreenDiagram,
} from '../../components/diagrams/CashFlowDiagram';
import { buildLtdFlow, buildSoleTraderFlow } from '../../components/diagrams/buildFlow';
import { LabBreakdown } from '../lab/LabBreakdown';
import { useState } from 'react';

export function ScenarioDetail() {
  const { scenarioId = '' } = useParams();
  const { state, updateScenario } = useAppState();
  const sc = state.scenarios.find((s) => s.id === scenarioId);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(sc?.name ?? '');
  const [notes, setNotes] = useState(sc?.notes ?? '');

  if (!sc) {
    return (
      <div className="card-pad">
        <h1 className="heading-1">Scenario not found</h1>
        <p className="mt-2">
          <Link className="text-accent-700 underline dark:text-accent-300" to="/scenarios/saved">
            Back to saved scenarios
          </Link>
        </p>
      </div>
    );
  }

  const sole = soleTraderResult(sc.inputs.revenue, sc.inputs.costs);
  const ltd = ltdResult({
    revenue: sc.inputs.revenue,
    costs: sc.inputs.costs,
    ownerSalary: sc.inputs.ownerSalary,
    desiredCash: sc.inputs.desiredCash,
    pensionContribution: sc.inputs.pensionContribution,
    rdEligibleSpend: sc.inputs.rdEligibleSpend,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Saved scenario"
        title={sc.name}
        description={`Saved ${new Date(sc.updatedAt).toLocaleString()}`}
        pageId={`scenarios/${sc.id}`}
        actions={
          <Link to="/lab" className="btn-secondary">
            Open in lab
          </Link>
        }
      />
      <DisclaimerBanner compact />

      <section className="card-pad">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Notes & rename
        </h2>
        {editing ? (
          <>
            <input
              className="input mt-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="input mt-2 h-32 resize-y"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="mt-3 flex gap-2">
              <button
                className="btn-primary"
                onClick={() => {
                  updateScenario(sc.id, { name: name || sc.name, notes });
                  setEditing(false);
                }}
              >
                Save
              </button>
              <button className="btn-secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 whitespace-pre-wrap text-sm text-ink-700 dark:text-ink-300">
              {sc.notes || (
                <span className="italic text-ink-400 dark:text-ink-500">No notes yet.</span>
              )}
            </p>
            <button
              className="btn-secondary mt-3"
              onClick={() => {
                setName(sc.name);
                setNotes(sc.notes ?? '');
                setEditing(true);
              }}
            >
              Edit
            </button>
          </>
        )}
      </section>

      {sc.inputs.structures.includes('sole-trader') && (
        <section className="card overflow-hidden">
          <header className="flex items-center justify-between border-b border-ink-200 px-5 py-4 dark:border-ink-800">
            <h3 className="text-sm font-semibold">Sole trader</h3>
            <CashFlowLegend />
          </header>
          <div className="px-2 py-4 sm:px-4">
            <FullscreenDiagram title="Sole trader" {...buildSoleTraderFlow(sole)} />
          </div>
        </section>
      )}

      {sc.inputs.structures.includes('ltd') && (
        <section className="card overflow-hidden">
          <header className="flex items-center justify-between border-b border-ink-200 px-5 py-4 dark:border-ink-800">
            <h3 className="text-sm font-semibold">Limited company</h3>
            <CashFlowLegend />
          </header>
          <div className="px-2 py-4 sm:px-4">
            <FullscreenDiagram title="Limited company" {...buildLtdFlow(ltd)} />
          </div>
          <div className="border-t border-ink-200 bg-ink-50/40 px-5 py-4 dark:border-ink-800 dark:bg-ink-950/40">
            <LabBreakdown ltd={ltd} />
          </div>
        </section>
      )}
    </div>
  );
}
