import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../state/AppState';
import {
  ltdResult,
  soleTraderResult,
  type ExtractionStrategy,
} from '../../lib/tax';
import { CashFlowDiagram, CashFlowLegend } from '../../components/diagrams/CashFlowDiagram';
import { buildLtdFlow, buildSoleTraderFlow } from '../../components/diagrams/buildFlow';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import { Slider } from '../../components/ui/Slider';
import { formatGBP, formatPct } from '../../lib/format';
import { NotesPanel } from '../../components/ui/NotesPanel';
import { LabBreakdown } from './LabBreakdown';

const STRUCTURES = [
  { id: 'sole-trader', label: 'Sole trader' },
  { id: 'ltd', label: 'Limited company' },
];

const STRATEGY_LABEL: Record<ExtractionStrategy, string> = {
  'salary-heavy': 'Salary-heavy (£70k base)',
  'dividend-heavy': 'Dividend-heavy (£12.57k salary)',
  balanced: 'Balanced (PA salary + dividends)',
  retain: 'Retain & reinvest (extract minimum)',
};

interface LabInputs {
  revenue: number;
  costs: number;
  desiredCash: number;
  ownerSalary: number;
  pensionContribution: number;
  rdEligibleSpend: number;
  selected: string[];
  strategy: ExtractionStrategy;
}

const DEFAULTS: LabInputs = {
  revenue: 100_000,
  costs: 30_000,
  desiredCash: 40_000,
  ownerSalary: 12_570,
  pensionContribution: 0,
  rdEligibleSpend: 0,
  selected: ['sole-trader', 'ltd'],
  strategy: 'balanced',
};

export function CashFlowLab() {
  const { saveScenario, state } = useAppState();
  const [inputs, setInputs] = useState<LabInputs>(DEFAULTS);
  const [scenarioName, setScenarioName] = useState('My scenario');
  const profile = state.personalProfile;
  const profileFieldsCount = [
    profile.annualRevenue,
    profile.annualCosts,
    profile.personalIncomeNeed,
    profile.ownerSalary,
    profile.pensionContribution,
    profile.rdEligibleSpend,
  ].filter((v) => typeof v === 'number').length;

  const useMyProfile = () => {
    setInputs((p) => ({
      ...p,
      revenue: profile.annualRevenue ?? p.revenue,
      costs: profile.annualCosts ?? p.costs,
      desiredCash: profile.personalIncomeNeed ?? p.desiredCash,
      ownerSalary: profile.ownerSalary ?? p.ownerSalary,
      pensionContribution: profile.pensionContribution ?? p.pensionContribution,
      rdEligibleSpend: profile.rdEligibleSpend ?? p.rdEligibleSpend,
    }));
  };

  const results = useMemo(() => {
    const sole = soleTraderResult(inputs.revenue, inputs.costs);
    const ltd = ltdResult({
      revenue: inputs.revenue,
      costs: inputs.costs,
      ownerSalary: inputs.ownerSalary,
      desiredCash: inputs.desiredCash,
      pensionContribution: inputs.pensionContribution,
      rdEligibleSpend: inputs.rdEligibleSpend,
    });
    return { sole, ltd };
  }, [inputs]);

  const summary = useMemo(() => {
    return [
      {
        id: 'sole-trader',
        label: 'Sole trader',
        net: results.sole.netToOwner,
        tax: results.sole.totalTax,
        retained: 0,
        rate: results.sole.effectiveTaxRate,
      },
      {
        id: 'ltd',
        label: 'Limited company',
        net: results.ltd.ownerTotalNet,
        tax: results.ltd.totalTaxToHmrc,
        retained: results.ltd.companyRetained,
        rate:
          inputs.revenue - inputs.costs > 0
            ? results.ltd.totalTaxToHmrc / (inputs.revenue - inputs.costs)
            : 0,
      },
    ].filter((r) => inputs.selected.includes(r.id));
  }, [results, inputs.selected, inputs.revenue, inputs.costs]);

  const update = (patch: Partial<LabInputs>) => setInputs((p) => ({ ...p, ...patch }));

  const setStrategy = (s: ExtractionStrategy) => {
    let salary = inputs.ownerSalary;
    let pension = inputs.pensionContribution;
    if (s === 'salary-heavy') {
      salary = 70_000;
      pension = 0;
    } else if (s === 'dividend-heavy') {
      salary = 12_570;
      pension = 0;
    } else if (s === 'balanced') {
      salary = 12_570;
      pension = 0;
    } else if (s === 'retain') {
      salary = 12_570;
      pension = 0;
    }
    update({ strategy: s, ownerSalary: salary, pensionContribution: pension });
  };

  const handleSave = () => {
    saveScenario({
      name: scenarioName || 'Untitled scenario',
      notes: '',
      inputs: {
        revenue: inputs.revenue,
        costs: inputs.costs,
        desiredCash: inputs.desiredCash,
        ownerSalary: inputs.ownerSalary,
        pensionContribution: inputs.pensionContribution,
        rdEligibleSpend: inputs.rdEligibleSpend,
        structures: inputs.selected,
      },
    });
    setScenarioName('My scenario');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Section 3 · The centerpiece"
        title="Cash Flow Lab"
        description="Move money through different structures. Watch the same pre-tax pound become very different post-tax pounds."
        pageId="lab"
        actions={
          <Link to="/lab/scenarios" className="btn-secondary">
            Pre-built scenarios
          </Link>
        }
      />

      <DisclaimerBanner compact />

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Controls */}
        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="card-pad space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Inputs
            </h2>
            <Slider
              label="Annual revenue"
              value={inputs.revenue}
              min={10_000}
              max={1_000_000}
              step={1_000}
              onChange={(v) => update({ revenue: v })}
            />
            <Slider
              label="Annual costs"
              value={inputs.costs}
              min={0}
              max={Math.max(50_000, inputs.revenue)}
              step={500}
              onChange={(v) => update({ costs: v })}
              hint="Pre-salary costs (rent, software, contractors)"
            />
            <Slider
              label="Personal cash needed"
              value={inputs.desiredCash}
              min={0}
              max={300_000}
              step={500}
              onChange={(v) => update({ desiredCash: v })}
              hint="How much you need to take home (after tax) to live on"
            />

            <div>
              <label className="mb-1 block text-sm font-medium">Extraction strategy</label>
              <select
                className="input"
                value={inputs.strategy}
                onChange={(e) => setStrategy(e.target.value as ExtractionStrategy)}
              >
                {Object.entries(STRATEGY_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <Slider
              label="Director salary (Ltd)"
              value={inputs.ownerSalary}
              min={0}
              max={150_000}
              step={500}
              onChange={(v) => update({ ownerSalary: v })}
              hint="Salary the company pays you"
            />
            <Slider
              label="Employer pension contribution"
              value={inputs.pensionContribution}
              min={0}
              max={60_000}
              step={500}
              onChange={(v) => update({ pensionContribution: v })}
              hint="Deductible for the company; not taxed on you now"
            />
            <Slider
              label="R&D-eligible spend"
              value={inputs.rdEligibleSpend}
              min={0}
              max={Math.max(0, inputs.costs)}
              step={500}
              onChange={(v) => update({ rdEligibleSpend: v })}
              hint="Illustrative ~16.2% credit on qualifying spend"
            />

            <div>
              <label className="mb-1 block text-sm font-medium">Compare structures</label>
              <div className="space-y-1.5">
                {STRUCTURES.map((s) => {
                  const checked = inputs.selected.includes(s.id);
                  return (
                    <label key={s.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          update({
                            selected: checked
                              ? inputs.selected.filter((x) => x !== s.id)
                              : [...inputs.selected, s.id],
                          })
                        }
                        className="h-4 w-4 rounded border-ink-300 text-accent-600 focus:ring-accent-500"
                      />
                      {s.label}
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              className="btn-secondary w-full"
              onClick={() => setInputs(DEFAULTS)}
            >
              Reset to defaults
            </button>

            <button
              className="btn-secondary w-full"
              onClick={useMyProfile}
              disabled={profileFieldsCount === 0}
              title={
                profileFieldsCount === 0
                  ? 'Save numbers from any lesson first to populate your profile'
                  : `Pull ${profileFieldsCount} value${profileFieldsCount === 1 ? '' : 's'} from your saved profile`
              }
            >
              Use my profile{profileFieldsCount > 0 ? ` (${profileFieldsCount})` : ''}
            </button>
            <p className="text-[11px] text-ink-500 dark:text-ink-400">
              Pulls revenue, costs, income need, salary, pension and R&D spend from your{' '}
              <Link to="/profile" className="underline">
                profile
              </Link>{' '}
              if you've saved them anywhere.
            </p>
          </div>

          <div className="card-pad space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Save scenario
            </h2>
            <input
              className="input"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Name this scenario"
            />
            <button className="btn-primary w-full" onClick={handleSave}>
              Save to my scenarios
            </button>
            <p className="text-xs text-ink-500 dark:text-ink-400">
              Saved locally. View at{' '}
              <Link to="/scenarios/saved" className="underline">
                Your saved scenarios
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <SummaryRow rows={summary} />

          {inputs.selected.includes('sole-trader') && (
            <FlowCard
              title="Sole trader"
              subtitle={`Profit £${Math.max(
                0,
                inputs.revenue - inputs.costs,
              ).toLocaleString()} → all taxed at your personal rates`}
              flow={buildSoleTraderFlow(results.sole)}
            >
              <SoleTraderBreakdown sole={results.sole} />
            </FlowCard>
          )}

          {inputs.selected.includes('ltd') && (
            <FlowCard
              title="Limited company"
              subtitle="Two-layer system: company pays CT, you pay personal tax on what you extract"
              flow={buildLtdFlow(results.ltd)}
            >
              <LabBreakdown ltd={results.ltd} />
            </FlowCard>
          )}

          {inputs.selected.length === 0 && (
            <div className="card-pad text-center text-sm text-ink-500 dark:text-ink-400">
              Select at least one structure on the left to see its cash flow.
            </div>
          )}

          <NotesPanel pageId="lab" />
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  rows,
}: {
  rows: { id: string; label: string; net: number; tax: number; retained: number; rate: number }[];
}) {
  if (rows.length === 0) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map((r) => (
        <div key={r.id} className="card-pad">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            {r.label}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <div className="font-mono text-base font-semibold text-accent-700 dark:text-accent-300">
                {formatGBP(r.net)}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
                Net to owner
              </div>
            </div>
            <div>
              <div className="font-mono text-base font-semibold text-danger-500">
                {formatGBP(r.tax)}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
                Tax to HMRC
              </div>
            </div>
            <div>
              <div className="font-mono text-base font-semibold text-yellow-600 dark:text-yellow-300">
                {formatGBP(r.retained)}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
                Retained
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-ink-500 dark:text-ink-400">
            Effective tax: {formatPct(r.rate)} of operating profit
          </div>
        </div>
      ))}
    </div>
  );
}

function FlowCard({
  title,
  subtitle,
  flow,
  children,
}: {
  title: string;
  subtitle?: string;
  flow: ReturnType<typeof buildSoleTraderFlow> | ReturnType<typeof buildLtdFlow>;
  children?: React.ReactNode;
}) {
  return (
    <section className="card overflow-hidden">
      <header className="flex flex-col items-start justify-between gap-2 border-b border-ink-200 px-5 py-4 dark:border-ink-800 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">{subtitle}</p>
          )}
        </div>
        <CashFlowLegend />
      </header>
      <div className="px-2 py-4 sm:px-4">
        <CashFlowDiagram
          nodes={flow.nodes}
          edges={flow.edges}
          layout={flow.layout}
          cols={flow.cols}
          rows={flow.rows}
        />
      </div>
      {children && (
        <div className="border-t border-ink-200 bg-ink-50/40 px-5 py-4 dark:border-ink-800 dark:bg-ink-950/40">
          {children}
        </div>
      )}
    </section>
  );
}

function SoleTraderBreakdown({ sole }: { sole: ReturnType<typeof soleTraderResult> }) {
  return (
    <div className="grid gap-3 text-sm sm:grid-cols-2 md:grid-cols-3">
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Profit
        </div>
        <div className="font-mono">{formatGBP(sole.profit)}</div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Income tax
        </div>
        <div className="font-mono text-danger-500">{formatGBP(sole.itOnProfit)}</div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Class 4 NI
        </div>
        <div className="font-mono text-danger-500">{formatGBP(sole.class4NI)}</div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Net to owner
        </div>
        <div className="font-mono text-accent-700 dark:text-accent-300">
          {formatGBP(sole.netToOwner)}
        </div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Effective rate
        </div>
        <div className="font-mono">{formatPct(sole.effectiveTaxRate)}</div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Retained in business
        </div>
        <div className="font-mono">{formatGBP(0)}</div>
      </div>
    </div>
  );
}
