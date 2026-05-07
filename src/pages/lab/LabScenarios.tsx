import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import { PREBUILT } from './prebuiltScenarios';
import { ltdResult, soleTraderResult } from '../../lib/tax';
import {
  buildLtdFlow,
  buildSoleTraderFlow,
} from '../../components/diagrams/buildFlow';
import {
  CashFlowDiagram,
  CashFlowLegend,
} from '../../components/diagrams/CashFlowDiagram';
import { formatGBP, formatPct } from '../../lib/format';
import { useAppState } from '../../state/AppState';
import { Link } from 'react-router-dom';

export function LabScenarios() {
  const { saveScenario } = useAppState();
  const [activeId, setActiveId] = useState(PREBUILT[0].id);
  const active = PREBUILT.find((s) => s.id === activeId)!;

  const sole = soleTraderResult(active.inputs.revenue, active.inputs.costs);
  const ltd = ltdResult({
    revenue: active.inputs.revenue,
    costs: active.inputs.costs,
    ownerSalary: active.inputs.ownerSalary,
    desiredCash: active.inputs.desiredCash,
    pensionContribution: active.inputs.pensionContribution,
    rdEligibleSpend: active.inputs.rdEligibleSpend,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cash Flow Lab"
        title="Pre-built scenarios"
        description="Eight common founder situations, each with commentary and what to look for. Click one, then load it into the lab to manipulate the inputs."
        pageId="lab/scenarios"
      />
      <DisclaimerBanner compact />

      <div className="flex flex-wrap gap-2">
        {PREBUILT.map((s) => (
          <button
            key={s.id}
            className={
              s.id === activeId
                ? 'chip-accent !text-sm !py-1 !px-3'
                : 'chip !text-sm !py-1 !px-3 hover:bg-ink-100 dark:hover:bg-ink-800'
            }
            onClick={() => setActiveId(s.id)}
          >
            {s.name}
          </button>
        ))}
      </div>

      <section className="card-pad">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="heading-2">{active.name}</h2>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{active.oneLiner}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="btn-secondary"
              onClick={() => {
                saveScenario({
                  name: active.name,
                  notes: active.commentary,
                  inputs: {
                    revenue: active.inputs.revenue,
                    costs: active.inputs.costs,
                    desiredCash: active.inputs.desiredCash,
                    ownerSalary: active.inputs.ownerSalary,
                    pensionContribution: active.inputs.pensionContribution,
                    rdEligibleSpend: active.inputs.rdEligibleSpend,
                    structures: active.inputs.structures,
                  },
                });
              }}
            >
              Save to my scenarios
            </button>
            <Link to="/lab" className="btn-primary">
              Open in lab →
            </Link>
          </div>
        </div>
        <p className="mt-4 lede max-w-3xl">{active.commentary}</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink-700 dark:text-ink-200">
          {active.whatToLookFor.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      {active.inputs.structures.includes('sole-trader') && (
        <section className="card overflow-hidden">
          <header className="flex items-center justify-between border-b border-ink-200 px-5 py-4 dark:border-ink-800">
            <div>
              <h3 className="text-base font-semibold tracking-tight">Sole trader</h3>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Net to owner: {formatGBP(sole.netToOwner)} · Effective rate{' '}
                {formatPct(sole.effectiveTaxRate)}
              </p>
            </div>
            <CashFlowLegend />
          </header>
          <div className="px-2 py-4 sm:px-4">
            <CashFlowDiagram {...buildSoleTraderFlow(sole)} />
          </div>
        </section>
      )}

      {active.inputs.structures.includes('ltd') && (
        <section className="card overflow-hidden">
          <header className="flex items-center justify-between border-b border-ink-200 px-5 py-4 dark:border-ink-800">
            <div>
              <h3 className="text-base font-semibold tracking-tight">Limited company</h3>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Net to owner: {formatGBP(ltd.ownerTotalNet)} · Retained{' '}
                {formatGBP(ltd.companyRetained)} · Total tax {formatGBP(ltd.totalTaxToHmrc)}
              </p>
            </div>
            <CashFlowLegend />
          </header>
          <div className="px-2 py-4 sm:px-4">
            <CashFlowDiagram {...buildLtdFlow(ltd)} />
          </div>
        </section>
      )}
    </div>
  );
}
