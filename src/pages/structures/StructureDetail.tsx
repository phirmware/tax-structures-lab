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

const REVENUE = 100_000;
const COSTS = 30_000;
const DESIRED = 40_000;

export function StructureDetail() {
  const { structureId = 'sole-trader' } = useParams();
  const s = getStructure(structureId);
  const [revenue, setRevenue] = useState(REVENUE);
  const [costs, setCosts] = useState(COSTS);
  const [desired, setDesired] = useState(DESIRED);

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
      <DisclaimerBanner compact />

      <section className="card-pad">
        <h2 className="heading-2">Plain English</h2>
        <p className="mt-2 lede">{s.whyExists}</p>
        <p className="mt-3 text-sm italic text-accent-700 dark:text-accent-300">
          Pattern: {s.patternNote}
        </p>
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
        <section className="card-pad">
          <p className="text-sm text-ink-700 dark:text-ink-300">
            This structure isn't directly modelled in the simulator yet (its mechanics overlap
            with simpler structures). Use the comparison view, or read the rest of the page for
            tradeoffs and pattern notes.
          </p>
        </section>
      )}

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
