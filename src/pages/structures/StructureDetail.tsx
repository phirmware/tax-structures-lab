import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import { getStructure, STRUCTURES } from '../../content/structures';
import { ltdResult, soleTraderResult } from '../../lib/tax';
import {
  CashFlowDiagram,
  CashFlowLegend,
} from '../../components/diagrams/CashFlowDiagram';
import { buildLtdFlow, buildSoleTraderFlow } from '../../components/diagrams/buildFlow';
import { formatGBP } from '../../lib/format';
import { NotesPanel } from '../../components/ui/NotesPanel';
import { useState } from 'react';
import { Slider } from '../../components/ui/Slider';
import { LessonSummary } from '../../components/ui/LessonSummary';
import { FounderMistakes } from '../../components/ui/FounderMistakes';
import { ShowWithMyNumbers } from '../../components/ui/ShowWithMyNumbers';
import { useAppState } from '../../state/AppState';
import { getStructureBody } from '../../content/structureBodies';
import {
  StructureSimulation,
  hasStructureSimulation,
} from './StructureSimulations';

const REVENUE = 100_000;
const COSTS = 30_000;
const DESIRED = 40_000;

export function StructureDetail() {
  const { structureId = 'sole-trader' } = useParams();
  const s = getStructure(structureId);
  const { state } = useAppState();
  const profile = state.personalProfile;
  const [revenue, setRevenue] = useState(profile.annualRevenue ?? REVENUE);
  const [costs, setCosts] = useState(profile.annualCosts ?? COSTS);
  const [desired, setDesired] = useState(profile.personalIncomeNeed ?? DESIRED);

  if (!s) {
    return (
      <div className="card-pad">
        <h1 className="heading-1">Structure not found</h1>
        <p className="mt-2">
          <Link className="text-accent-700 underline dark:text-accent-300" to="/structures">
            Back to structures
          </Link>
        </p>
      </div>
    );
  }

  const sole = soleTraderResult(revenue, costs);
  const ltd = ltdResult({
    revenue,
    costs,
    ownerSalary: 12_570,
    desiredCash: desired,
  });

  const showsFlow = s.id === 'sole-trader' || s.id === 'ltd';
  const flow = s.id === 'sole-trader' ? buildSoleTraderFlow(sole) : buildLtdFlow(ltd);

  const otherStructures = STRUCTURES.filter((x) => x.id !== s.id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Structures · ${s.complexity} complexity`}
        title={s.shortName}
        description={s.oneLiner}
        pageId={`structures/${s.id}`}
        actions={
          <Link to="/structures/compare" className="btn-secondary">
            Compare
          </Link>
        }
      />

      <LessonSummary pageId={`structures/${s.id}`} />

      <DisclaimerBanner compact />

      <section className="card-pad">
        <h2 className="heading-2">Plain English</h2>
        <p className="mt-2 lede">{s.whyExists}</p>
        <p className="mt-3 text-sm italic text-accent-700 dark:text-accent-300">
          Pattern: {s.patternNote}
        </p>
        <ShowWithMyNumbers
          title="Show me with my numbers — at this structure"
          inputs={[
            { key: 'annualRevenue', defaultValue: REVENUE, min: 0, step: 1_000 },
            { key: 'annualCosts', defaultValue: COSTS, min: 0, step: 500 },
            { key: 'personalIncomeNeed', defaultValue: DESIRED, min: 0, step: 500 },
          ]}
          render={({ values }) => {
            const r = values.annualRevenue ?? REVENUE;
            const c = values.annualCosts ?? COSTS;
            const d = values.personalIncomeNeed ?? DESIRED;
            const _sole = soleTraderResult(r, c);
            const _ltd = ltdResult({
              revenue: r,
              costs: c,
              ownerSalary: 12_570,
              desiredCash: d,
            });
            return (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-ink-200 p-3 dark:border-ink-700">
                  <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
                    Sole trader — net to you
                  </div>
                  <div className="font-mono text-sm">{formatGBP(_sole.netToOwner)}</div>
                  <div className="mt-1 text-[11px] text-danger-500">
                    Tax {formatGBP(_sole.totalTax)}
                  </div>
                </div>
                <div className="rounded-lg border border-ink-200 p-3 dark:border-ink-700">
                  <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
                    Ltd — net to you + retained
                  </div>
                  <div className="font-mono text-sm">
                    {formatGBP(_ltd.ownerTotalNet)} +{' '}
                    <span className="text-yellow-700 dark:text-yellow-300">
                      {formatGBP(_ltd.companyRetained)}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-danger-500">
                    Tax {formatGBP(_ltd.totalTaxToHmrc)}
                  </div>
                </div>
              </div>
            );
          }}
        />
      </section>

      {showsFlow ? (
        <section className="card overflow-hidden">
          <header className="flex flex-col gap-2 border-b border-ink-200 px-5 py-4 dark:border-ink-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Cash flow at this scale
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Adjust below to see flows recalculate
              </p>
            </div>
            <CashFlowLegend />
          </header>
          <div className="grid gap-4 px-4 py-4 md:grid-cols-[260px_minmax(0,1fr)]">
            <div className="space-y-3">
              <Slider
                label="Revenue"
                value={revenue}
                min={20_000}
                max={500_000}
                step={1_000}
                onChange={setRevenue}
              />
              <Slider
                label="Costs"
                value={costs}
                min={0}
                max={Math.max(revenue, 50_000)}
                step={500}
                onChange={setCosts}
              />
              {s.id === 'ltd' && (
                <Slider
                  label="Cash you want to take"
                  value={desired}
                  min={0}
                  max={300_000}
                  step={500}
                  onChange={setDesired}
                />
              )}
              <div className="rounded-lg border border-ink-200 p-3 text-xs dark:border-ink-700">
                {s.id === 'sole-trader' ? (
                  <>
                    Net to owner:{' '}
                    <span className="font-mono">{formatGBP(sole.netToOwner)}</span>
                    <br />
                    Tax to HMRC:{' '}
                    <span className="font-mono text-danger-500">
                      {formatGBP(sole.totalTax)}
                    </span>
                  </>
                ) : (
                  <>
                    Net to owner:{' '}
                    <span className="font-mono">{formatGBP(ltd.ownerTotalNet)}</span>
                    <br />
                    Retained:{' '}
                    <span className="font-mono text-yellow-700 dark:text-yellow-300">
                      {formatGBP(ltd.companyRetained)}
                    </span>
                    <br />
                    Total tax to HMRC:{' '}
                    <span className="font-mono text-danger-500">
                      {formatGBP(ltd.totalTaxToHmrc)}
                    </span>
                  </>
                )}
              </div>
            </div>
            <CashFlowDiagram {...flow} />
          </div>
        </section>
      ) : (
        <StructureSimulationSection structureId={s.id} />
      )}

      {(() => {
        const body = getStructureBody(s.id);
        return body ? (
          <article className="card-pad prose-app">{body}</article>
        ) : null;
      })()}

      <section className="grid gap-3 md:grid-cols-2">
        <Card heading="Pros">
          <ul className="text-sm">
            {s.pros.map((p) => (
              <li key={p}>• {p}</li>
            ))}
          </ul>
        </Card>
        <Card heading="Cons">
          <ul className="text-sm">
            {s.cons.map((c) => (
              <li key={c}>• {c}</li>
            ))}
          </ul>
        </Card>
        <Card heading="When to choose">
          <ul className="text-sm">
            {s.whenToChoose.map((w) => (
              <li key={w}>• {w}</li>
            ))}
          </ul>
        </Card>
        <Card heading="When to avoid">
          <ul className="text-sm">
            {s.whenToAvoid.map((w) => (
              <li key={w}>• {w}</li>
            ))}
          </ul>
        </Card>
      </section>

      <FounderMistakes pageId={`structures/${s.id}`} />

      <section className="card-pad">
        <h2 className="heading-2">Other structures to compare</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {otherStructures.slice(0, 6).map((o) => (
            <Link
              key={o.id}
              to={`/structures/${o.id}`}
              className="rounded-lg border border-ink-200 p-3 text-sm hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800"
            >
              <div className="font-medium">{o.shortName}</div>
              <div className="text-xs text-ink-500 dark:text-ink-400">{o.oneLiner}</div>
            </Link>
          ))}
        </div>
      </section>

      <NotesPanel pageId={`structures/${s.id}`} />
    </div>
  );
}

function Card({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="card-pad">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {heading}
      </h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/**
 * Card-shell wrapper around a per-structure simulation.
 */
function StructureSimulationSection({ structureId }: { structureId: string }) {
  const titled = hasStructureSimulation(structureId);
  return (
    <section className="card overflow-hidden">
      <header className="flex flex-col gap-2 border-b border-ink-200 px-5 py-4 dark:border-ink-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            {titled ? 'Simulation for this structure' : 'Not numerically modelled'}
          </h2>
          {titled && (
            <p className="text-xs text-ink-500 dark:text-ink-400">
              Adjust below — figures recalculate live. Illustrative only.
            </p>
          )}
        </div>
      </header>
      <StructureSimulation id={structureId} />
    </section>
  );
}
