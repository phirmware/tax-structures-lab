import { useMemo, useState, type DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { DisclaimerBanner } from '../../components/ui/Disclaimer';
import { Slider } from '../../components/ui/Slider';
import { ArrowRight, Book, Calculator, Check, Plus, Trash, X } from '../../components/ui/Icons';
import { useAppState } from '../../state/AppState';
import {
  ir35Result,
  ltdResult,
  maxDirectorSalary,
  partnershipResult,
  soleTraderResult,
  umbrellaResult,
  type LtdResult,
} from '../../lib/tax';
import { PERSONAL_ALLOWANCE, VAT_REGISTRATION_THRESHOLD } from '../../lib/constants';
import { clamp, formatGBP, formatPct } from '../../lib/format';

type LaneId = 'structure' | 'extraction' | 'growth' | 'guardrails';
type Ir35Risk = 'low' | 'medium' | 'high';
type Tone = 'ok' | 'warn' | 'bad' | 'info';

interface BuilderInputs {
  revenue: number;
  costs: number;
  personalCashNeed: number;
  ownerCount: number;
  reinvestTarget: number;
  pensionContribution: number;
  rdEligibleSpend: number;
  ir35Risk: Ir35Risk;
  outsideFunding: boolean;
  exitHorizon: number;
}

interface NodeLink {
  label: string;
  to: string;
}

interface NodeDefinition {
  id: string;
  lane: LaneId;
  title: string;
  shortTitle?: string;
  summary: string;
  tags: string[];
  links: NodeLink[];
}

interface Mission {
  id: string;
  title: string;
  summary: string;
  inputs: BuilderInputs;
}

interface PlanResult {
  label: string;
  netToOwner: number;
  taxToHmrc: number;
  retained: number;
  effectiveRate: number;
  primaryStructureId: string;
  ltd?: LtdResult;
}

interface Finding {
  tone: Tone;
  title: string;
  body: string;
  links?: NodeLink[];
}

interface ScoreLine {
  label: string;
  score: number;
  max: number;
  note: string;
}

interface Critique {
  score: number;
  verdict: string;
  scoreLines: ScoreLine[];
  findings: Finding[];
  suggestedWorkspace: Workspace;
  suggestedResult: PlanResult | null;
}

type Workspace = Record<LaneId, string[]>;

const LANES: Array<{
  id: LaneId;
  title: string;
  kicker: string;
  color: string;
}> = [
  {
    id: 'structure',
    title: 'Structure',
    kicker: 'Who earns the profit and carries the risk.',
    color:
      'border-sky-300 bg-sky-50/80 text-sky-900 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100',
  },
  {
    id: 'extraction',
    title: 'Extraction',
    kicker: 'How value leaves the business for the owner.',
    color:
      'border-accent-300 bg-accent-50/80 text-accent-900 dark:border-accent-800 dark:bg-accent-900/30 dark:text-accent-100',
  },
  {
    id: 'growth',
    title: 'Growth',
    kicker: 'Where surplus compounds or becomes exit value.',
    color:
      'border-amber-300 bg-amber-50/80 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100',
  },
  {
    id: 'guardrails',
    title: 'Guardrails',
    kicker: 'The checks that keep a structure defensible.',
    color:
      'border-rose-300 bg-rose-50/80 text-rose-900 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-100',
  },
];

const NODE_LIBRARY: NodeDefinition[] = [
  {
    id: 'sole-trader',
    lane: 'structure',
    title: 'Sole trader',
    summary: 'Simple pass-through trade: no company layer, no retained-profit lever, unlimited personal liability.',
    tags: ['Simple', 'Personal tax', 'Low admin'],
    links: [{ label: 'Sole trader structure', to: '/structures/sole-trader' }],
  },
  {
    id: 'partnership',
    lane: 'structure',
    title: 'General partnership',
    shortTitle: 'Partnership',
    summary: 'Tax-transparent profit split between owners, but each partner can expose the others to debts.',
    tags: ['Multi-owner', 'Transparent', 'High liability'],
    links: [{ label: 'Partnership structure', to: '/structures/partnership' }],
  },
  {
    id: 'llp',
    lane: 'structure',
    title: 'LLP',
    summary: 'Partnership-style tax with limited liability, usually strongest for professional multi-owner firms.',
    tags: ['Multi-owner', 'Limited liability', 'Transparent'],
    links: [{ label: 'LLP structure', to: '/structures/llp' }],
  },
  {
    id: 'ltd',
    lane: 'structure',
    title: 'Limited company',
    shortTitle: 'Ltd',
    summary: 'Separate legal person with CT, limited liability, retained earnings, salary/dividend/pension extraction.',
    tags: ['Retention', 'Flexible extraction', 'Limited liability'],
    links: [
      { label: 'Limited company structure', to: '/structures/ltd' },
      { label: 'Corporation tax', to: '/uk/corporation-tax' },
    ],
  },
  {
    id: 'holding',
    lane: 'structure',
    title: 'Holding company',
    shortTitle: 'HoldCo',
    summary: 'Parent company over a trading company for risk isolation, retained cash, multiple lines, or exit planning.',
    tags: ['Group', 'Risk isolation', 'Retained cash'],
    links: [
      { label: 'Holding company structure', to: '/structures/holding' },
      { label: 'Multi-entity strategies', to: '/strategies/multi-entity#holding-company' },
    ],
  },
  {
    id: 'umbrella',
    lane: 'structure',
    title: 'Umbrella / PAYE',
    summary: 'Employment-like route for contract income when the tax answer is mostly payroll rather than dividends.',
    tags: ['IR35', 'PAYE', 'Low flexibility'],
    links: [{ label: 'IR35 specifics', to: '/uk/ir35' }],
  },
  {
    id: 'inside-ir35-ltd',
    lane: 'structure',
    title: 'Ltd inside IR35',
    shortTitle: 'Inside IR35',
    summary: 'Company wrapper remains, but the contract income is treated like employment for tax.',
    tags: ['IR35', 'Deemed employment', 'Contracting'],
    links: [
      { label: 'IR35 aware strategy', to: '/strategies/income-classification#ir35-aware' },
      { label: 'IR35 specifics', to: '/uk/ir35' },
    ],
  },
  {
    id: 'pa-salary-dividends',
    lane: 'extraction',
    title: 'PA salary + dividends',
    summary: 'Default owner-director mix: small salary to use allowance, dividends for flexible top-up cash.',
    tags: ['Classification', 'Owner-director', 'Dividends'],
    links: [
      { label: 'Salary vs dividends', to: '/uk/salary-vs-dividend' },
      { label: 'Extraction strategy', to: '/strategies/extraction#salary-vs-dividends' },
    ],
  },
  {
    id: 'salary-heavy',
    lane: 'extraction',
    title: 'Salary-heavy extraction',
    shortTitle: 'Salary-heavy',
    summary: 'More PAYE salary for lending, pensionable earnings, or simplicity, but usually higher NI drag.',
    tags: ['PAYE', 'Mortgageable', 'Higher NI'],
    links: [{ label: 'Income tax & NI', to: '/uk/income-tax' }],
  },
  {
    id: 'pension',
    lane: 'extraction',
    title: 'Employer pension',
    summary: 'Company-paid pension contribution: deductible for CT, no NI, long-term personal wealth route.',
    tags: ['Deferral', 'No NI', 'Long-term'],
    links: [
      { label: 'Pensions specifics', to: '/uk/pensions' },
      { label: 'Pension extraction', to: '/strategies/extraction#pension-extraction' },
    ],
  },
  {
    id: 'benefits-expenses',
    lane: 'extraction',
    title: 'Allowable expenses / benefits',
    shortTitle: 'Benefits & expenses',
    summary: 'Legitimate business expenses, home-office claims, mileage, and small benefits before taxed extraction.',
    tags: ['Deduction', 'Evidence', 'Low friction'],
    links: [{ label: 'Mileage and home office', to: '/strategies/extraction#mileage-and-home' }],
  },
  {
    id: 'family-payroll',
    lane: 'extraction',
    title: 'Commercial family payroll',
    shortTitle: 'Family payroll',
    summary: 'Pay family members for real work at market value; weak if the role is fictional or overpaid.',
    tags: ['Commerciality', 'Payroll', 'Evidence'],
    links: [{ label: 'Family employment', to: '/strategies/extraction#family-employment' }],
  },
  {
    id: 'directors-loan',
    lane: 'extraction',
    title: "Director's loan bridge",
    shortTitle: "Director's loan",
    summary: 'Short-term cash bridge only; s455, benefit-in-kind, and bed-and-breakfasting rules make it fragile.',
    tags: ['Timing', 's455', 'Risk'],
    links: [
      { label: "Director's loans", to: '/uk/directors-loan' },
      { label: "Director's loan strategy", to: '/strategies/extraction#directors-loans' },
    ],
  },
  {
    id: 'retain-reinvest',
    lane: 'growth',
    title: 'Retain & reinvest',
    summary: 'Leave surplus in the company after owner cash needs, then compound or fund hiring and product growth.',
    tags: ['Retention', 'Compounding', 'Growth'],
    links: [
      { label: 'Retention pattern', to: '/patterns' },
      { label: 'Multi-year lab', to: '/lab/multi-year' },
    ],
  },
  {
    id: 'rd-relief',
    lane: 'growth',
    title: 'R&D relief / credit',
    shortTitle: 'R&D relief',
    summary: 'Model qualifying innovation spend separately, then stress-test documentation and eligibility.',
    tags: ['Incentive', 'Documentation', 'Innovation'],
    links: [{ label: 'R&D specifics', to: '/uk/rd' }],
  },
  {
    id: 'eis-seis',
    lane: 'growth',
    title: 'EIS / SEIS fundraising',
    shortTitle: 'EIS / SEIS',
    summary: 'Investor tax relief can make early-stage funding easier if the company and shares qualify.',
    tags: ['Funding', 'Investor relief', 'Restrictions'],
    links: [
      { label: 'EIS / SEIS specifics', to: '/uk/eis-seis' },
      { label: 'EIS / SEIS strategy', to: '/strategies/investment#eis-seis' },
    ],
  },
  {
    id: 'exit-badr',
    lane: 'growth',
    title: 'Exit / BADR readiness',
    shortTitle: 'Exit readiness',
    summary: 'Plan shareholdings, officer status, trading status, and timing before a sale is close.',
    tags: ['Capital gains', 'Exit', 'Timing'],
    links: [
      { label: 'BADR specifics', to: '/uk/badr' },
      { label: 'Sale & exit', to: '/strategies/sale-exit#badr-qualification' },
    ],
  },
  {
    id: 'group-relief',
    lane: 'growth',
    title: 'Group relief / loss use',
    shortTitle: 'Group relief',
    summary: 'Use group structure to move qualifying losses, cash, or risk between entities with care.',
    tags: ['Group', 'Losses', 'Intercompany'],
    links: [
      { label: 'UK groups', to: '/uk/groups' },
      { label: 'Group relief', to: '/strategies/multi-entity#group-relief' },
    ],
  },
  {
    id: 'asset-holdco',
    lane: 'growth',
    title: 'Ringfence cash / IP',
    shortTitle: 'Ringfence assets',
    summary: 'Move surplus cash or IP away from trading risk only where the group mechanics and substance make sense.',
    tags: ['Risk isolation', 'IP', 'HoldCo'],
    links: [
      { label: 'Ringfencing risk', to: '/strategies/multi-entity#ringfencing-risk' },
      { label: 'Groups', to: '/uk/groups' },
    ],
  },
  {
    id: 'ir35-check',
    lane: 'guardrails',
    title: 'IR35 status review',
    shortTitle: 'IR35 review',
    summary: 'Check control, substitution, mutuality, working practices, and client size before assuming dividends work.',
    tags: ['Contractor', 'Status', 'Evidence'],
    links: [
      { label: 'IR35 specifics', to: '/uk/ir35' },
      { label: 'IR35 aware strategy', to: '/strategies/income-classification#ir35-aware' },
    ],
  },
  {
    id: 'vat-register',
    lane: 'guardrails',
    title: 'VAT threshold watch',
    shortTitle: 'VAT watch',
    summary: 'Track taxable turnover and pricing when revenue approaches or exceeds the VAT registration threshold.',
    tags: ['Threshold', 'Pricing', 'Compliance'],
    links: [{ label: 'VAT specifics', to: '/uk/vat' }],
  },
  {
    id: 'commercial-purpose',
    lane: 'guardrails',
    title: 'Commercial purpose memo',
    shortTitle: 'Commercial purpose',
    summary: 'Write the non-tax reason for the structure before relying on tax outcomes.',
    tags: ['Substance', 'Anti-avoidance', 'Evidence'],
    links: [{ label: 'Substance pattern', to: '/patterns' }],
  },
  {
    id: 'substance-docs',
    lane: 'guardrails',
    title: 'Substance & board evidence',
    shortTitle: 'Substance docs',
    summary: 'Minutes, contracts, decision logs, actual director time, and matching bank/accounting records.',
    tags: ['Evidence', 'Companies', 'Governance'],
    links: [{ label: 'Multi-entity strategies', to: '/strategies/multi-entity' }],
  },
  {
    id: 'transfer-pricing',
    lane: 'guardrails',
    title: 'Intercompany pricing file',
    shortTitle: 'Interco pricing',
    summary: 'Document arm’s-length management charges, IP licences, and cost-sharing between companies.',
    tags: ['Groups', 'Pricing', 'Documentation'],
    links: [{ label: 'Inter-company charges', to: '/strategies/multi-entity#inter-co-charges' }],
  },
  {
    id: 'accounting-controls',
    lane: 'guardrails',
    title: 'Payroll / dividend controls',
    shortTitle: 'Bookkeeping controls',
    summary: 'Keep PAYE, reserves, dividend vouchers, pension payments, and claim evidence tidy from month one.',
    tags: ['Records', 'Payroll', 'Reserves'],
    links: [
      { label: 'Dividends specifics', to: '/uk/dividends' },
      { label: 'Salary vs dividend', to: '/uk/salary-vs-dividend' },
    ],
  },
];

const NODE_BY_ID = NODE_LIBRARY.reduce<Record<string, NodeDefinition>>((acc, node) => {
  acc[node.id] = node;
  return acc;
}, {});

const DEFAULT_INPUTS: BuilderInputs = {
  revenue: 150_000,
  costs: 35_000,
  personalCashNeed: 55_000,
  ownerCount: 1,
  reinvestTarget: 25_000,
  pensionContribution: 15_000,
  rdEligibleSpend: 0,
  ir35Risk: 'low',
  outsideFunding: false,
  exitHorizon: 5,
};

const MISSIONS: Mission[] = [
  {
    id: 'consultant',
    title: 'Solo consultant',
    summary: 'Healthy profit, moderate cash need, low contractor-status risk.',
    inputs: DEFAULT_INPUTS,
  },
  {
    id: 'contractor',
    title: 'IR35-sensitive contractor',
    summary: 'Single-client income, high status risk, little scope for pure dividend planning.',
    inputs: {
      ...DEFAULT_INPUTS,
      revenue: 120_000,
      costs: 12_000,
      personalCashNeed: 70_000,
      reinvestTarget: 5_000,
      pensionContribution: 10_000,
      ir35Risk: 'high',
      exitHorizon: 1,
    },
  },
  {
    id: 'studio',
    title: 'Product studio',
    summary: 'More retained cash, R&D spend, and a possible investor round.',
    inputs: {
      ...DEFAULT_INPUTS,
      revenue: 320_000,
      costs: 155_000,
      personalCashNeed: 60_000,
      reinvestTarget: 85_000,
      pensionContribution: 25_000,
      rdEligibleSpend: 60_000,
      outsideFunding: true,
      exitHorizon: 7,
    },
  },
  {
    id: 'agency',
    title: 'Two-founder agency',
    summary: 'Two active owners, meaningful liability, and profits above personal needs.',
    inputs: {
      ...DEFAULT_INPUTS,
      revenue: 240_000,
      costs: 90_000,
      personalCashNeed: 45_000,
      ownerCount: 2,
      reinvestTarget: 35_000,
      pensionContribution: 12_000,
      exitHorizon: 4,
    },
  },
];

const STRUCTURE_PRIORITY = [
  'inside-ir35-ltd',
  'umbrella',
  'holding',
  'ltd',
  'llp',
  'partnership',
  'sole-trader',
];

function emptyWorkspace(): Workspace {
  return {
    structure: [],
    extraction: [],
    growth: [],
    guardrails: [],
  };
}

function starterWorkspace(): Workspace {
  return {
    structure: ['ltd'],
    extraction: ['pa-salary-dividends'],
    growth: ['retain-reinvest'],
    guardrails: ['accounting-controls'],
  };
}

function cloneWorkspace(workspace: Workspace): Workspace {
  return {
    structure: [...workspace.structure],
    extraction: [...workspace.extraction],
    growth: [...workspace.growth],
    guardrails: [...workspace.guardrails],
  };
}

function idsInWorkspace(workspace: Workspace): string[] {
  return Object.values(workspace).flat();
}

function hasNode(workspace: Workspace, id: string): boolean {
  return idsInWorkspace(workspace).includes(id);
}

function nodeLane(workspace: Workspace, id: string): LaneId | null {
  for (const lane of LANES) {
    if (workspace[lane.id].includes(id)) return lane.id;
  }
  return null;
}

function addNodeToWorkspace(workspace: Workspace, nodeId: string, lane: LaneId): Workspace {
  const next = emptyWorkspace();
  for (const laneId of LANES.map((l) => l.id)) {
    next[laneId] = workspace[laneId].filter((id) => id !== nodeId);
  }
  next[lane] = [...next[lane], nodeId];
  return next;
}

function removeNodeFromWorkspace(workspace: Workspace, nodeId: string): Workspace {
  const next = cloneWorkspace(workspace);
  for (const lane of LANES) {
    next[lane.id] = next[lane.id].filter((id) => id !== nodeId);
  }
  return next;
}

function getSelectedStructures(workspace: Workspace): string[] {
  return idsInWorkspace(workspace).filter((id) => NODE_BY_ID[id]?.lane === 'structure');
}

function getPrimaryStructureId(workspace: Workspace): string | null {
  const selected = getSelectedStructures(workspace);
  return STRUCTURE_PRIORITY.find((id) => selected.includes(id)) ?? null;
}

function getRecommendedStructure(inputs: BuilderInputs): string {
  const operatingProfit = Math.max(0, inputs.revenue - inputs.costs);
  if (inputs.ir35Risk === 'high') return 'inside-ir35-ltd';
  if (inputs.revenue < 60_000 && operatingProfit < inputs.personalCashNeed + 10_000 && inputs.ownerCount === 1) {
    return 'sole-trader';
  }
  if (inputs.ownerCount > 1 && inputs.reinvestTarget < 15_000 && !inputs.outsideFunding) return 'llp';
  if (inputs.reinvestTarget > 50_000 || inputs.revenue > 250_000 || inputs.outsideFunding) return 'holding';
  return 'ltd';
}

function suggestedWorkspaceFor(inputs: BuilderInputs): Workspace {
  const workspace = emptyWorkspace();
  const structure = getRecommendedStructure(inputs);
  workspace.structure.push(structure);
  if (structure === 'holding') workspace.structure.unshift('ltd');

  const isCompany = ['ltd', 'holding'].includes(structure);
  if (isCompany) {
    workspace.extraction.push('pa-salary-dividends');
    if (inputs.pensionContribution > 0 || inputs.revenue - inputs.costs > 90_000) {
      workspace.extraction.push('pension');
    }
    workspace.extraction.push('benefits-expenses');
  }

  if (inputs.reinvestTarget > 0 && isCompany) workspace.growth.push('retain-reinvest');
  if (inputs.rdEligibleSpend > 0 && isCompany) workspace.growth.push('rd-relief');
  if (inputs.outsideFunding) workspace.growth.push('eis-seis');
  if (inputs.exitHorizon >= 3 && isCompany) workspace.growth.push('exit-badr');
  if (structure === 'holding') {
    workspace.growth.push('asset-holdco');
  }

  if (inputs.ir35Risk !== 'low') workspace.guardrails.push('ir35-check');
  if (inputs.revenue >= VAT_REGISTRATION_THRESHOLD * 0.9) workspace.guardrails.push('vat-register');
  if (isCompany) workspace.guardrails.push('accounting-controls');
  if (structure === 'holding' || workspace.growth.includes('asset-holdco') || workspace.growth.includes('group-relief')) {
    workspace.guardrails.push('commercial-purpose', 'substance-docs', 'transfer-pricing');
  } else if (workspace.extraction.includes('family-payroll')) {
    workspace.guardrails.push('commercial-purpose');
  }

  for (const lane of LANES) {
    workspace[lane.id] = Array.from(new Set(workspace[lane.id]));
  }
  return workspace;
}

function salaryFor(workspace: Workspace, inputs: BuilderInputs): number {
  const maxSalary = maxDirectorSalary(
    inputs.revenue,
    inputs.costs,
    hasNode(workspace, 'pension') ? inputs.pensionContribution : 0,
  );
  if (hasNode(workspace, 'salary-heavy')) return Math.min(70_000, maxSalary);
  if (hasNode(workspace, 'pa-salary-dividends')) return Math.min(PERSONAL_ALLOWANCE, maxSalary);
  return Math.min(PERSONAL_ALLOWANCE, maxSalary);
}

function resultForWorkspace(workspace: Workspace, inputs: BuilderInputs): PlanResult | null {
  const primary = getPrimaryStructureId(workspace);
  if (!primary) return null;

  if (primary === 'sole-trader') {
    const r = soleTraderResult(inputs.revenue, inputs.costs);
    return {
      label: 'Sole trader plan',
      netToOwner: r.netToOwner,
      taxToHmrc: r.totalTax,
      retained: 0,
      effectiveRate: r.effectiveTaxRate,
      primaryStructureId: primary,
    };
  }

  if (primary === 'partnership' || primary === 'llp') {
    const r = partnershipResult(inputs.revenue, inputs.costs, Math.max(2, inputs.ownerCount));
    return {
      label: primary === 'llp' ? 'LLP plan' : 'Partnership plan',
      netToOwner: r.totalNetToOwners,
      taxToHmrc: r.totalTaxToHmrc,
      retained: 0,
      effectiveRate: r.effectiveTaxRate,
      primaryStructureId: primary,
    };
  }

  if (primary === 'umbrella') {
    const r = umbrellaResult(inputs.revenue);
    return {
      label: 'Umbrella / PAYE plan',
      netToOwner: r.netToContractor,
      taxToHmrc: r.totalTax,
      retained: 0,
      effectiveRate: r.effectiveTaxRate,
      primaryStructureId: primary,
    };
  }

  if (primary === 'inside-ir35-ltd') {
    const r = ir35Result(inputs.revenue, inputs.costs);
    return {
      label: 'Inside IR35 plan',
      netToOwner: r.netToContractor,
      taxToHmrc: r.totalTax,
      retained: 0,
      effectiveRate: r.effectiveTaxRate,
      primaryStructureId: primary,
    };
  }

  const ltd = ltdResult({
    revenue: inputs.revenue,
    costs: inputs.costs,
    ownerSalary: salaryFor(workspace, inputs),
    desiredCash: inputs.personalCashNeed,
    pensionContribution: hasNode(workspace, 'pension') ? inputs.pensionContribution : 0,
    rdEligibleSpend: hasNode(workspace, 'rd-relief') ? inputs.rdEligibleSpend : 0,
  });

  return {
    label: primary === 'holding' ? 'Holding company plan' : 'Limited company plan',
    netToOwner: ltd.ownerTotalNet,
    taxToHmrc: ltd.totalTaxToHmrc,
    retained: ltd.companyRetained,
    effectiveRate:
      inputs.revenue - inputs.costs > 0
        ? ltd.totalTaxToHmrc / (inputs.revenue - inputs.costs)
        : 0,
    primaryStructureId: primary,
    ltd,
  };
}

function baselineResults(inputs: BuilderInputs) {
  const sole = soleTraderResult(inputs.revenue, inputs.costs);
  const ltdWorkspace = emptyWorkspace();
  ltdWorkspace.structure = ['ltd'];
  ltdWorkspace.extraction = ['pa-salary-dividends'];
  ltdWorkspace.growth = ['retain-reinvest'];
  ltdWorkspace.guardrails = ['accounting-controls'];
  const ltd = resultForWorkspace(ltdWorkspace, inputs);
  return {
    sole: {
      label: 'Sole trader baseline',
      netToOwner: sole.netToOwner,
      taxToHmrc: sole.totalTax,
      retained: 0,
      effectiveRate: sole.effectiveTaxRate,
      primaryStructureId: 'sole-trader',
    } satisfies PlanResult,
    ltd,
  };
}

function buildCritique(workspace: Workspace, inputs: BuilderInputs): Critique {
  const selectedIds = idsInWorkspace(workspace);
  const selectedSet = new Set(selectedIds);
  const suggestedWorkspace = suggestedWorkspaceFor(inputs);
  const recommendedIds = idsInWorkspace(suggestedWorkspace);
  const plan = resultForWorkspace(workspace, inputs);
  const suggestedResult = resultForWorkspace(suggestedWorkspace, inputs);
  const primary = getPrimaryStructureId(workspace);
  const recommendedStructure = getRecommendedStructure(inputs);
  const selectedStructures = getSelectedStructures(workspace);
  const findings: Finding[] = [];
  const operatingProfit = Math.max(0, inputs.revenue - inputs.costs);

  const structureScore = (() => {
    if (!primary) return 0;
    if (primary === recommendedStructure) return 25;
    if (recommendedStructure === 'holding' && primary === 'ltd') return 19;
    if (recommendedStructure === 'ltd' && ['holding', 'llp'].includes(primary)) return 17;
    if (recommendedStructure === 'inside-ir35-ltd' && ['umbrella'].includes(primary)) return 21;
    return 10;
  })();

  const extractionRecommended = recommendedIds.filter((id) => NODE_BY_ID[id]?.lane === 'extraction');
  const extractionMatches = extractionRecommended.filter((id) => selectedSet.has(id)).length;
  const extractionScore = extractionRecommended.length
    ? Math.round((extractionMatches / extractionRecommended.length) * 20)
    : 15;

  const growthRecommended = recommendedIds.filter((id) => NODE_BY_ID[id]?.lane === 'growth');
  const growthMatches = growthRecommended.filter((id) => selectedSet.has(id)).length;
  const growthScore = growthRecommended.length
    ? Math.round((growthMatches / growthRecommended.length) * 20)
    : selectedIds.some((id) => NODE_BY_ID[id]?.lane === 'growth')
      ? 12
      : 15;

  const guardrailRecommended = recommendedIds.filter((id) => NODE_BY_ID[id]?.lane === 'guardrails');
  const guardrailMatches = guardrailRecommended.filter((id) => selectedSet.has(id)).length;
  const guardrailScore = guardrailRecommended.length
    ? Math.round((guardrailMatches / guardrailRecommended.length) * 20)
    : 15;

  const taxScore = (() => {
    if (!plan || !suggestedResult) return 0;
    if (suggestedResult.taxToHmrc <= 0) return 10;
    const ratio = plan.taxToHmrc / suggestedResult.taxToHmrc;
    if (ratio <= 1.03) return 15;
    if (ratio <= 1.12) return 12;
    if (ratio <= 1.25) return 8;
    return 4;
  })();

  const laneMisplacements = selectedIds.filter((id) => {
    const lane = nodeLane(workspace, id);
    return lane && NODE_BY_ID[id]?.lane !== lane;
  });
  const simplicityPenalty = Math.min(
    10,
    Math.max(0, selectedIds.length - recommendedIds.length - 2) * 2 +
      (selectedStructures.length > 2 ? 4 : 0) +
      laneMisplacements.length * 2,
  );

  if (!primary) {
    findings.push({
      tone: 'bad',
      title: 'No primary structure yet',
      body: 'Choose who earns the profit first. Extraction and growth tactics only make sense once the legal/tax person is clear.',
      links: [{ label: 'Structures overview', to: '/structures' }],
    });
  } else if (primary !== recommendedStructure) {
    findings.push({
      tone: recommendedStructure === 'inside-ir35-ltd' ? 'bad' : 'warn',
      title: `Research ${NODE_BY_ID[recommendedStructure].title} against your draft`,
      body:
        recommendedStructure === 'inside-ir35-ltd'
          ? 'The scenario has high IR35 exposure, so a low-salary dividend plan is the exact assumption to challenge.'
          : `${NODE_BY_ID[recommendedStructure].title} looks like the stronger starting point for these inputs. Your draft can still be right, but it needs a reason.`,
      links: NODE_BY_ID[recommendedStructure].links,
    });
  }

  if (selectedStructures.length > 2) {
    findings.push({
      tone: 'warn',
      title: 'Too many primary structures',
      body: 'A training plan can compare several structures, but a real plan needs one main route. Use extra nodes as alternatives, not all at once.',
    });
  }

  if (laneMisplacements.length > 0) {
    const labels = laneMisplacements.map((id) => NODE_BY_ID[id].title).join(', ');
    findings.push({
      tone: 'info',
      title: 'Some nodes are in the wrong lane',
      body: `${labels} still count in the simulation, but the lane mismatch is a useful classification drill.`,
    });
  }

  if (['ltd', 'holding'].includes(primary ?? '') && !hasNode(workspace, 'pa-salary-dividends') && !hasNode(workspace, 'salary-heavy')) {
    findings.push({
      tone: 'bad',
      title: 'No owner-director extraction route',
      body: 'A company plan needs an explicit salary/dividend/pension logic. Otherwise the cash is trapped or extracted accidentally.',
      links: [{ label: 'Salary vs dividends', to: '/uk/salary-vs-dividend' }],
    });
  }

  if (hasNode(workspace, 'salary-heavy') && !hasNode(workspace, 'pa-salary-dividends')) {
    findings.push({
      tone: 'warn',
      title: 'Salary-heavy needs a reason',
      body: 'High salary can make sense for lending, pensionable earnings, or simplicity, but the NI drag usually needs to be justified.',
      links: [{ label: 'Income tax & NI', to: '/uk/income-tax' }],
    });
  }

  if (inputs.ir35Risk !== 'low' && !hasNode(workspace, 'ir35-check')) {
    findings.push({
      tone: inputs.ir35Risk === 'high' ? 'bad' : 'warn',
      title: 'IR35 status is missing from the plan',
      body: 'Contractor-style income can collapse the salary/dividend advantage. Add a status review before trusting the company result.',
      links: NODE_BY_ID['ir35-check'].links,
    });
  }

  if (inputs.revenue >= VAT_REGISTRATION_THRESHOLD && !hasNode(workspace, 'vat-register')) {
    findings.push({
      tone: 'bad',
      title: 'VAT threshold ignored',
      body: `Revenue is above the ${formatGBP(VAT_REGISTRATION_THRESHOLD)} registration threshold. Pricing and cash-flow assumptions need VAT in the model.`,
      links: NODE_BY_ID['vat-register'].links,
    });
  } else if (inputs.revenue >= VAT_REGISTRATION_THRESHOLD * 0.9 && !hasNode(workspace, 'vat-register')) {
    findings.push({
      tone: 'warn',
      title: 'Close to the VAT threshold',
      body: 'You are close enough that the next growth step should include VAT monitoring and customer-pricing checks.',
      links: NODE_BY_ID['vat-register'].links,
    });
  }

  if (inputs.rdEligibleSpend > 0 && !hasNode(workspace, 'rd-relief')) {
    findings.push({
      tone: 'info',
      title: 'R&D spend is not being tested',
      body: 'You entered qualifying spend, so the stronger simulation should test whether the work has claimable uncertainty and documentation.',
      links: NODE_BY_ID['rd-relief'].links,
    });
  }

  if (inputs.reinvestTarget > 0 && ['ltd', 'holding'].includes(primary ?? '') && !hasNode(workspace, 'retain-reinvest')) {
    findings.push({
      tone: 'warn',
      title: 'Growth cash has no destination',
      body: 'The inputs say you want to keep money working in the business. Add a retention/reinvestment route so the plan is not pure extraction.',
      links: NODE_BY_ID['retain-reinvest'].links,
    });
  }

  if (inputs.outsideFunding && !hasNode(workspace, 'eis-seis')) {
    findings.push({
      tone: 'info',
      title: 'Investor relief has not been explored',
      body: 'If outside funding is part of the goal, EIS/SEIS eligibility can change the practical attractiveness of the raise.',
      links: NODE_BY_ID['eis-seis'].links,
    });
  }

  if (inputs.exitHorizon >= 3 && ['ltd', 'holding'].includes(primary ?? '') && !hasNode(workspace, 'exit-badr')) {
    findings.push({
      tone: 'info',
      title: 'Exit readiness is absent',
      body: 'With a multi-year horizon, sale planning starts before the buyer appears: shares, trading status, officers, and timing all matter.',
      links: NODE_BY_ID['exit-badr'].links,
    });
  }

  if ((hasNode(workspace, 'holding') || hasNode(workspace, 'asset-holdco') || hasNode(workspace, 'group-relief')) && !hasNode(workspace, 'commercial-purpose')) {
    findings.push({
      tone: 'bad',
      title: 'Multi-entity plan needs commercial purpose',
      body: 'A group structure should have a business reason beyond tax: risk isolation, investors, sale readiness, IP ownership, or operational separation.',
      links: NODE_BY_ID['commercial-purpose'].links,
    });
  }

  if ((hasNode(workspace, 'holding') || hasNode(workspace, 'asset-holdco') || hasNode(workspace, 'group-relief')) && !hasNode(workspace, 'transfer-pricing')) {
    findings.push({
      tone: 'warn',
      title: 'Intercompany pricing is not documented',
      body: 'Once entities charge each other, the price and paper trail matter as much as the diagram.',
      links: NODE_BY_ID['transfer-pricing'].links,
    });
  }

  if (hasNode(workspace, 'directors-loan')) {
    findings.push({
      tone: 'warn',
      title: "Director's loan is a bridge, not an extraction strategy",
      body: 'Use it for timing only after checking repayment dates, benefit-in-kind rules, and s455 exposure.',
      links: NODE_BY_ID['directors-loan'].links,
    });
  }

  if (plan?.ltd && hasNode(workspace, 'retain-reinvest') && plan.ltd.companyRetained < inputs.reinvestTarget * 0.5 && operatingProfit > 0) {
    findings.push({
      tone: 'warn',
      title: 'Your cash need crowds out reinvestment',
      body: `The plan retains ${formatGBP(plan.ltd.companyRetained)}, below the ${formatGBP(inputs.reinvestTarget)} growth target. Either lower extraction, increase profit, or accept slower growth.`,
    });
  }

  if (findings.length === 0) {
    findings.push({
      tone: 'ok',
      title: 'Strong draft',
      body: 'The structure, extraction route, growth logic, and major guardrails line up with the scenario. The next level is testing edge cases and adviser questions.',
      links: [{ label: 'Worked scenarios', to: '/scenarios' }],
    });
  }

  const scoreLines: ScoreLine[] = [
    {
      label: 'Structure fit',
      score: structureScore,
      max: 25,
      note: primary ? `${NODE_BY_ID[primary].title} vs suggested ${NODE_BY_ID[recommendedStructure].title}` : 'No structure selected',
    },
    {
      label: 'Extraction logic',
      score: extractionScore,
      max: 20,
      note: extractionRecommended.length ? `${extractionMatches}/${extractionRecommended.length} key nodes` : 'Not central for this mission',
    },
    {
      label: 'Growth design',
      score: growthScore,
      max: 20,
      note: growthRecommended.length ? `${growthMatches}/${growthRecommended.length} key nodes` : 'Low-growth scenario',
    },
    {
      label: 'Guardrails',
      score: guardrailScore,
      max: 20,
      note: guardrailRecommended.length ? `${guardrailMatches}/${guardrailRecommended.length} key checks` : 'Low-risk scenario',
    },
    {
      label: 'Tax model',
      score: taxScore,
      max: 15,
      note: plan && suggestedResult ? `${formatGBP(plan.taxToHmrc)} vs suggested ${formatGBP(suggestedResult.taxToHmrc)}` : 'Needs a calculable plan',
    },
  ];

  const rawScore = scoreLines.reduce((sum, line) => sum + line.score, 0) - simplicityPenalty;
  const score = clamp(Math.round(rawScore), 0, 100);
  const verdict =
    score >= 85
      ? 'Adviser-ready training draft'
      : score >= 70
        ? 'Strong, with a few research gaps'
        : score >= 50
          ? 'Promising but incomplete'
          : 'Needs a clearer structure first';

  if (simplicityPenalty > 0) {
    scoreLines.push({
      label: 'Complexity penalty',
      score: -simplicityPenalty,
      max: 0,
      note: 'Extra or misplaced nodes reduce clarity',
    });
  }

  return {
    score,
    verdict,
    scoreLines,
    findings,
    suggestedWorkspace,
    suggestedResult,
  };
}

function toneClasses(tone: Tone): string {
  switch (tone) {
    case 'ok':
      return 'border-accent-500/40 bg-accent-500/10 text-accent-800 dark:text-accent-100';
    case 'warn':
      return 'border-warn-500/40 bg-warn-500/10 text-warn-500';
    case 'bad':
      return 'border-danger-500/40 bg-danger-500/10 text-danger-500';
    case 'info':
      return 'border-sky-500/40 bg-sky-500/10 text-sky-800 dark:text-sky-100';
  }
}

function nodeToneClasses(lane: LaneId): string {
  switch (lane) {
    case 'structure':
      return 'border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100';
    case 'extraction':
      return 'border-accent-200 bg-accent-50 text-accent-900 dark:border-accent-800 dark:bg-accent-900/30 dark:text-accent-100';
    case 'growth':
      return 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100';
    case 'guardrails':
      return 'border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-100';
  }
}

export function StructureBuilderLab() {
  const { saveScenario, state } = useAppState();
  const [inputs, setInputs] = useState<BuilderInputs>({
    ...DEFAULT_INPUTS,
    revenue: state.personalProfile.annualRevenue ?? DEFAULT_INPUTS.revenue,
    costs: state.personalProfile.annualCosts ?? DEFAULT_INPUTS.costs,
    personalCashNeed: state.personalProfile.personalIncomeNeed ?? DEFAULT_INPUTS.personalCashNeed,
    pensionContribution: state.personalProfile.pensionContribution ?? DEFAULT_INPUTS.pensionContribution,
    rdEligibleSpend: state.personalProfile.rdEligibleSpend ?? DEFAULT_INPUTS.rdEligibleSpend,
    exitHorizon: state.personalProfile.yearsHorizon ?? DEFAULT_INPUTS.exitHorizon,
  });
  const [workspace, setWorkspace] = useState<Workspace>(() => starterWorkspace());
  const [scenarioName, setScenarioName] = useState('Structure builder draft');
  const [savedMessage, setSavedMessage] = useState('');

  const plan = useMemo(() => resultForWorkspace(workspace, inputs), [workspace, inputs]);
  const critique = useMemo(() => buildCritique(workspace, inputs), [workspace, inputs]);
  const baselines = useMemo(() => baselineResults(inputs), [inputs]);
  const selectedIds = idsInWorkspace(workspace);

  const updateInputs = (patch: Partial<BuilderInputs>) => {
    setInputs((prev) => {
      const next = { ...prev, ...patch };
      next.costs = Math.min(next.costs, next.revenue);
      next.personalCashNeed = Math.min(next.personalCashNeed, Math.max(0, next.revenue - next.costs));
      next.reinvestTarget = Math.min(next.reinvestTarget, Math.max(0, next.revenue - next.costs));
      next.pensionContribution = Math.min(next.pensionContribution, 60_000);
      next.rdEligibleSpend = Math.min(next.rdEligibleSpend, next.costs);
      return next;
    });
  };

  const addNode = (nodeId: string, lane: LaneId = NODE_BY_ID[nodeId].lane) => {
    setWorkspace((prev) => addNodeToWorkspace(prev, nodeId, lane));
  };

  const removeNode = (nodeId: string) => {
    setWorkspace((prev) => removeNodeFromWorkspace(prev, nodeId));
  };

  const handleDragStart = (event: DragEvent, nodeId: string) => {
    event.dataTransfer.setData('application/x-tax-node', nodeId);
    event.dataTransfer.effectAllowed = 'copyMove';
  };

  const handleDrop = (event: DragEvent, lane: LaneId) => {
    event.preventDefault();
    const nodeId = event.dataTransfer.getData('application/x-tax-node');
    if (!nodeId || !NODE_BY_ID[nodeId]) return;
    addNode(nodeId, lane);
  };

  const loadMission = (mission: Mission) => {
    setInputs(mission.inputs);
    setWorkspace(emptyWorkspace());
    setSavedMessage('');
  };

  const handleSave = () => {
    const primary = getPrimaryStructureId(workspace);
    const salary = plan?.ltd?.ownerSalary ?? salaryFor(workspace, inputs);
    saveScenario({
      name: scenarioName || 'Structure builder draft',
      notes: [
        `Builder score: ${critique.score}/100 (${critique.verdict})`,
        `Primary structure: ${primary ? NODE_BY_ID[primary].title : 'none'}`,
        `Nodes: ${selectedIds.map((id) => NODE_BY_ID[id].title).join(', ') || 'none'}`,
      ].join('\n'),
      inputs: {
        revenue: inputs.revenue,
        costs: inputs.costs,
        desiredCash: inputs.personalCashNeed,
        ownerSalary: salary,
        pensionContribution: hasNode(workspace, 'pension') ? inputs.pensionContribution : 0,
        rdEligibleSpend: hasNode(workspace, 'rd-relief') ? inputs.rdEligibleSpend : 0,
        structures: getSelectedStructures(workspace),
      },
    });
    setSavedMessage('Saved to your scenarios.');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Lab · Training simulation"
        title="Structure Builder"
        description="Assemble structure, extraction, growth, and guardrail nodes, then stress-test the plan against the scenario."
        pageId="lab/structure-builder"
        actions={
          <Link to="/lab" className="btn-secondary">
            Cash Flow Lab
          </Link>
        }
      />

      <DisclaimerBanner compact />

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
          <section className="card-pad space-y-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                Mission inputs
              </h2>
              <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                The critique changes as the commercial facts change.
              </p>
            </div>

            <div className="grid gap-2">
              {MISSIONS.map((mission) => (
                <button
                  key={mission.id}
                  type="button"
                  className="rounded-lg border border-ink-200 px-3 py-2 text-left text-xs transition hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800"
                  onClick={() => loadMission(mission)}
                >
                  <div className="font-semibold text-ink-900 dark:text-ink-50">{mission.title}</div>
                  <div className="mt-0.5 text-ink-500 dark:text-ink-400">{mission.summary}</div>
                </button>
              ))}
            </div>

            <Slider
              label="Annual revenue"
              value={inputs.revenue}
              min={10_000}
              max={750_000}
              step={1_000}
              onChange={(v) => updateInputs({ revenue: v })}
            />
            <Slider
              label="Annual costs"
              value={inputs.costs}
              min={0}
              max={Math.max(10_000, inputs.revenue)}
              step={1_000}
              onChange={(v) => updateInputs({ costs: v })}
            />
            <Slider
              label="Personal cash needed"
              value={inputs.personalCashNeed}
              min={0}
              max={Math.max(10_000, inputs.revenue - inputs.costs)}
              step={1_000}
              onChange={(v) => updateInputs({ personalCashNeed: v })}
            />
            <Slider
              label="Growth cash target"
              value={inputs.reinvestTarget}
              min={0}
              max={Math.max(10_000, inputs.revenue - inputs.costs)}
              step={1_000}
              onChange={(v) => updateInputs({ reinvestTarget: v })}
            />
            <Slider
              label="Owners / active founders"
              value={inputs.ownerCount}
              min={1}
              max={4}
              step={1}
              format={(v) => `${Math.round(v)} owner${Math.round(v) === 1 ? '' : 's'}`}
              onChange={(v) => updateInputs({ ownerCount: Math.round(v) })}
            />
            <Slider
              label="Employer pension test"
              value={inputs.pensionContribution}
              min={0}
              max={60_000}
              step={1_000}
              onChange={(v) => updateInputs({ pensionContribution: v })}
            />
            <Slider
              label="R&D spend test"
              value={inputs.rdEligibleSpend}
              min={0}
              max={Math.max(0, inputs.costs)}
              step={1_000}
              onChange={(v) => updateInputs({ rdEligibleSpend: v })}
            />
            <Slider
              label="Exit horizon"
              value={inputs.exitHorizon}
              min={1}
              max={10}
              step={1}
              format={(v) => `${Math.round(v)} yr${Math.round(v) === 1 ? '' : 's'}`}
              onChange={(v) => updateInputs({ exitHorizon: Math.round(v) })}
            />

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Contract / IR35 exposure</span>
              <select
                className="input"
                value={inputs.ir35Risk}
                onChange={(e) => updateInputs({ ir35Risk: e.target.value as Ir35Risk })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={inputs.outsideFunding}
                onChange={(e) => updateInputs({ outsideFunding: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-ink-300 text-accent-600 focus:ring-accent-500"
              />
              <span>
                Outside investors are part of the plan
                <span className="block text-xs text-ink-500 dark:text-ink-400">
                  Adds investor-relief and share-structure pressure.
                </span>
              </span>
            </label>
          </section>

          <section className="card-pad space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Save draft
            </h2>
            <input
              className="input"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Name this draft"
            />
            <button type="button" className="btn-primary w-full" onClick={handleSave}>
              Save to my scenarios
            </button>
            {savedMessage && (
              <p className="text-xs font-medium text-accent-700 dark:text-accent-300">
                {savedMessage}
              </p>
            )}
          </section>
        </aside>

        <div className="space-y-4">
          <section className="card-pad">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  Node library
                </h2>
                <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                  Add the pieces you think belong in the plan. Buttons add to the native lane; dragging lets you classify them yourself.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-secondary" onClick={() => setWorkspace(starterWorkspace())}>
                  Starter plan
                </button>
                <button type="button" className="btn-secondary" onClick={() => setWorkspace(emptyWorkspace())}>
                  Clear
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
              {LANES.map((lane) => (
                <div key={lane.id} className="space-y-2">
                  <div className={`rounded-lg border px-3 py-2 text-xs font-semibold ${lane.color}`}>
                    {lane.title}
                  </div>
                  <div className="space-y-2">
                    {NODE_LIBRARY.filter((node) => node.lane === lane.id).map((node) => {
                      const selected = selectedIds.includes(node.id);
                      return (
                        <NodeCard
                          key={node.id}
                          node={node}
                          selected={selected}
                          onDragStart={handleDragStart}
                          onAdd={() => addNode(node.id)}
                          compact
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {LANES.map((lane) => (
              <DropLane
                key={lane.id}
                lane={lane}
                workspace={workspace}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onRemove={removeNode}
              />
            ))}
          </section>

          <CritiquePanel
            critique={critique}
            plan={plan}
            soleBaseline={baselines.sole}
            ltdBaseline={baselines.ltd}
            onApplySuggestion={() => setWorkspace(cloneWorkspace(critique.suggestedWorkspace))}
          />
        </div>
      </div>
    </div>
  );
}

function NodeCard({
  node,
  selected,
  compact = false,
  onAdd,
  onRemove,
  onDragStart,
}: {
  node: NodeDefinition;
  selected?: boolean;
  compact?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  onDragStart: (event: DragEvent, nodeId: string) => void;
}) {
  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, node.id)}
      className={`group rounded-lg border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${nodeToneClasses(node.lane)} ${
        selected ? 'ring-2 ring-accent-500/50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold">{node.shortTitle ?? node.title}</span>
            {selected && <Check className="h-3.5 w-3.5 shrink-0 text-accent-600 dark:text-accent-300" />}
          </div>
          {!compact && <p className="mt-1 text-xs leading-relaxed opacity-80">{node.summary}</p>}
        </div>
        {onRemove ? (
          <button
            type="button"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md hover:bg-white/60 dark:hover:bg-ink-800"
            onClick={onRemove}
            aria-label={`Remove ${node.title}`}
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md hover:bg-white/60 dark:hover:bg-ink-800"
            onClick={onAdd}
            aria-label={`Add ${node.title}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
      {!compact && (
        <div className="mt-2 flex flex-wrap gap-1">
          {node.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium dark:bg-ink-900/70">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function DropLane({
  lane,
  workspace,
  onDrop,
  onDragStart,
  onRemove,
}: {
  lane: (typeof LANES)[number];
  workspace: Workspace;
  onDrop: (event: DragEvent, lane: LaneId) => void;
  onDragStart: (event: DragEvent, nodeId: string) => void;
  onRemove: (nodeId: string) => void;
}) {
  const nodes = workspace[lane.id].map((id) => NODE_BY_ID[id]).filter(Boolean);
  return (
    <section
      className="min-h-[220px] rounded-xl border border-dashed border-ink-300 bg-white/70 p-4 shadow-sm transition dark:border-ink-700 dark:bg-ink-900/60"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => onDrop(event, lane.id)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={`inline-flex rounded-lg border px-3 py-1 text-xs font-semibold ${lane.color}`}>
            {lane.title}
          </div>
          <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">{lane.kicker}</p>
        </div>
        <span className="font-mono text-xs text-ink-400">{nodes.length}</span>
      </div>

      <div className="mt-4 space-y-3">
        {nodes.length === 0 ? (
          <div className="grid min-h-[120px] place-items-center rounded-lg border border-dashed border-ink-200 px-3 text-center text-xs text-ink-400 dark:border-ink-800">
            Drop nodes here
          </div>
        ) : (
          nodes.map((node) => {
            const misplaced = node.lane !== lane.id;
            return (
              <div key={node.id} className="space-y-1">
                <NodeCard
                  node={node}
                  selected
                  onDragStart={onDragStart}
                  onRemove={() => onRemove(node.id)}
                />
                {misplaced && (
                  <p className="px-1 text-[11px] text-warn-500">
                    Usually belongs in {LANES.find((l) => l.id === node.lane)?.title}.
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function CritiquePanel({
  critique,
  plan,
  soleBaseline,
  ltdBaseline,
  onApplySuggestion,
}: {
  critique: Critique;
  plan: PlanResult | null;
  soleBaseline: PlanResult;
  ltdBaseline: PlanResult | null;
  onApplySuggestion: () => void;
}) {
  const deltaToSuggested =
    plan && critique.suggestedResult ? plan.taxToHmrc - critique.suggestedResult.taxToHmrc : null;

  return (
    <>
      <section className="card-pad space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Critique
            </div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">{critique.score}/100</h2>
            <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">{critique.verdict}</p>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-full border border-accent-300 bg-accent-50 font-mono text-lg font-semibold text-accent-800 dark:border-accent-800 dark:bg-accent-900/40 dark:text-accent-100">
            {critique.score}
          </div>
        </div>

        <div className="space-y-2">
          {critique.scoreLines.map((line) => (
            <div key={line.label}>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium">{line.label}</span>
                <span className="font-mono text-ink-500 dark:text-ink-400">
                  {line.max > 0 ? `${line.score}/${line.max}` : line.score}
                </span>
              </div>
              {line.max > 0 && (
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
                  <div
                    className="h-full rounded-full bg-accent-500"
                    style={{ width: `${clamp((line.score / line.max) * 100, 0, 100)}%` }}
                  />
                </div>
              )}
              <p className="mt-1 text-[11px] text-ink-500 dark:text-ink-400">{line.note}</p>
            </div>
          ))}
        </div>

        <button type="button" className="btn-primary w-full" onClick={onApplySuggestion}>
          <Calculator className="h-4 w-4" />
          Apply suggested research path
        </button>
      </section>

      <section className="card-pad space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Numeric comparison
        </div>
        <ResultMini label="Your draft" result={plan} />
        <ResultMini label="Suggested path" result={critique.suggestedResult} />
        <ResultMini label="Sole trader baseline" result={soleBaseline} />
        {ltdBaseline && <ResultMini label="Simple Ltd baseline" result={ltdBaseline} />}
        {deltaToSuggested !== null && (
          <div
            className={`rounded-lg border px-3 py-2 text-xs ${
              deltaToSuggested <= 0
                ? 'border-accent-500/40 bg-accent-500/10 text-accent-800 dark:text-accent-100'
                : 'border-warn-500/40 bg-warn-500/10 text-warn-500'
            }`}
          >
            {deltaToSuggested <= 0
              ? `Your draft is ${formatGBP(Math.abs(deltaToSuggested))} lower tax than the suggested path. Check the risk notes before celebrating.`
              : `The suggested path is about ${formatGBP(deltaToSuggested)} lower tax on these simplified inputs.`}
          </div>
        )}
      </section>

      <section className="card-pad space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            Research queue
          </div>
          <Book className="h-4 w-4 text-ink-400" />
        </div>
        {critique.findings.map((finding) => (
          <div key={finding.title} className={`rounded-lg border p-3 text-sm ${toneClasses(finding.tone)}`}>
            <div className="font-semibold">{finding.title}</div>
            <p className="mt-1 text-xs leading-relaxed opacity-90">{finding.body}</p>
            {finding.links && finding.links.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {finding.links.map((link) => (
                  <Link
                    key={link.to + link.label}
                    to={link.to}
                    className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium underline-offset-2 hover:underline dark:bg-ink-900/60"
                  >
                    {link.label}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </>
  );
}

function ResultMini({ label, result }: { label: string; result: PlanResult | null }) {
  if (!result) {
    return (
      <div className="rounded-lg border border-ink-200 px-3 py-2 text-xs text-ink-500 dark:border-ink-700 dark:text-ink-400">
        <div className="font-semibold text-ink-700 dark:text-ink-200">{label}</div>
        Select a structure to calculate.
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-ink-200 px-3 py-2 dark:border-ink-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-ink-900 dark:text-ink-50">{label}</div>
          <div className="mt-0.5 text-[11px] text-ink-500 dark:text-ink-400">{result.label}</div>
        </div>
        <div className="text-right font-mono text-xs text-ink-500 dark:text-ink-400">
          {formatPct(result.effectiveRate)}
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="font-mono font-semibold text-accent-700 dark:text-accent-300">
            {formatGBP(result.netToOwner)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-ink-400">Owner</div>
        </div>
        <div>
          <div className="font-mono font-semibold text-danger-500">{formatGBP(result.taxToHmrc)}</div>
          <div className="text-[10px] uppercase tracking-wider text-ink-400">Tax</div>
        </div>
        <div>
          <div className="font-mono font-semibold text-warn-500">{formatGBP(result.retained)}</div>
          <div className="text-[10px] uppercase tracking-wider text-ink-400">Retained</div>
        </div>
      </div>
    </div>
  );
}
