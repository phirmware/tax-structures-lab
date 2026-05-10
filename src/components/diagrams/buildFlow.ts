import type { FlowEdge, FlowNode } from './CashFlowDiagram';
import type { Ir35Result, LtdResult, PartnershipResult, SoleTraderResult, UmbrellaResult } from '../../lib/tax';
import { formatGBP } from '../../lib/format';

export interface BuiltFlow {
  nodes: FlowNode[];
  edges: FlowEdge[];
  layout: Record<string, { col: number; row: number }>;
  cols: number;
  rows: number;
}

// Sole trader flow: revenue → costs / profit → IT, NI4, net.
export function buildSoleTraderFlow(r: SoleTraderResult): BuiltFlow {
  const nodes: FlowNode[] = [
    { id: 'rev', label: 'Revenue', amount: r.revenue, kind: 'inflow' },
    { id: 'costs', label: 'Business costs', amount: r.costs, kind: 'cost' },
    { id: 'profit', label: 'Self-employed profit', amount: r.profit, kind: 'transit' },
    { id: 'it', label: 'Income tax → HMRC', amount: r.itOnProfit, kind: 'tax' },
    { id: 'ni', label: 'Class 4 NI → HMRC', amount: r.class4NI, kind: 'tax' },
    { id: 'net', label: 'Net to owner', amount: r.netToOwner, kind: 'net' },
  ];
  const edges: FlowEdge[] = [
    { from: 'rev', to: 'costs', amount: r.costs, kind: 'cost' },
    { from: 'rev', to: 'profit', amount: r.profit, kind: 'transit' },
    { from: 'profit', to: 'it', amount: r.itOnProfit, kind: 'tax' },
    { from: 'profit', to: 'ni', amount: r.class4NI, kind: 'tax' },
    { from: 'profit', to: 'net', amount: r.netToOwner, kind: 'net' },
  ];
  const layout: BuiltFlow['layout'] = {
    rev: { col: 0, row: 1 },
    costs: { col: 1, row: 0 },
    profit: { col: 1, row: 1 },
    it: { col: 2, row: 0 },
    ni: { col: 2, row: 1 },
    net: { col: 2, row: 2 },
  };
  return { nodes, edges, layout, cols: 3, rows: 3 };
}

// Limited company flow: rev → costs / salary / pension → preTax → CT → postTax →
// dividends + retained. Personal side: salary → IT/NI/net; div → divTax/net.
export function buildLtdFlow(r: LtdResult): BuiltFlow {
  const directExpense = r.costs;
  const salary = r.ownerSalary;
  const erNI = r.employerNI;
  const pension = r.pensionContribution;
  const totalEmploymentCost = salary + erNI;
  const isLoss = r.preTaxProfit < 0;
  const distributable = Math.max(0, r.postTaxProfit);

  // Derived flags — drive which nodes/edges exist.
  const hasPension = pension > 0;
  const hasCT = r.corporationTax.total > 0;
  const hasPostTax = distributable > 0;
  const hasDiv = r.dividendDeclared > 0;
  const hasRetained = r.retainedEarnings > 0;
  const hasSalaryTax = r.personal.itOnSalary + r.personal.employeeNI > 0;
  const hasDivTax = r.personal.totalDividendTax > 0;
  const hasPersonalTax = r.personal.totalPersonalTax > 0;

  const nodes: FlowNode[] = [
    { id: 'rev', label: 'Revenue', amount: r.revenue, kind: 'inflow' },
    { id: 'costs', label: 'Business costs', amount: directExpense, kind: 'cost' },
    {
      id: 'salary',
      label: 'Director salary (deductible)',
      amount: totalEmploymentCost,
      kind: 'cost',
      sub: erNI > 0 ? `Incl. ${formatGBP(erNI)} employer NI` : undefined,
    },
    { id: 'erNi', label: 'Employer NI → HMRC', amount: erNI, kind: 'tax' },
    ...(hasPension ? [{ id: 'pension', label: 'Pension (deductible)', amount: pension, kind: 'cost' as const }] : []),
    {
      id: 'preTax',
      label: isLoss ? 'Pre-tax loss' : 'Pre-tax profit',
      amount: Math.abs(r.preTaxProfit),
      kind: isLoss ? 'tax' : ('transit' as const),
      sub: isLoss ? 'Employment costs exceed revenue' : undefined,
    },
    ...(hasCT ? [{ id: 'ct', label: 'Corporation tax → HMRC', amount: r.corporationTax.total, kind: 'tax' as const, sub: `${(r.corporationTax.effectiveRate * 100).toFixed(1)}% effective` }] : []),
    ...(hasPostTax ? [{ id: 'postTax', label: 'Post-tax profit', amount: distributable, kind: 'transit' as const }] : []),
    ...(hasDiv ? [{ id: 'div', label: 'Dividend declared', amount: r.dividendDeclared, kind: 'transit' as const }] : []),
    ...(hasRetained ? [{ id: 'retained', label: 'Retained earnings', amount: r.retainedEarnings, kind: 'retain' as const, sub: 'Compounds at corporate rate' }] : []),
    ...(hasPersonalTax ? [{ id: 'pTax', label: 'Personal tax → HMRC', amount: r.personal.totalPersonalTax, kind: 'tax' as const, sub: 'IT + NI + dividend tax' }] : []),
    { id: 'netOwner', label: 'Net to owner', amount: r.ownerTotalNet, kind: 'net' },
  ];

  const edges: FlowEdge[] = [
    { from: 'rev', to: 'costs', amount: directExpense, kind: 'cost' },
    { from: 'rev', to: 'salary', amount: totalEmploymentCost, kind: 'cost' },
    { from: 'salary', to: 'erNi', amount: erNI, kind: 'tax' },
    ...(hasPension ? [{ from: 'rev', to: 'pension', amount: pension, kind: 'cost' as const }] : []),
    ...(!isLoss && r.preTaxProfit > 0 ? [{ from: 'rev', to: 'preTax', amount: r.preTaxProfit, kind: 'transit' as const }] : []),
    ...(hasCT ? [{ from: 'preTax', to: 'ct', amount: r.corporationTax.total, kind: 'tax' as const }] : []),
    ...(hasPostTax ? [{ from: 'preTax', to: 'postTax', amount: distributable, kind: 'transit' as const }] : []),
    ...(hasDiv ? [{ from: 'postTax', to: 'div', amount: r.dividendDeclared, kind: 'transit' as const }] : []),
    ...(hasRetained ? [{ from: 'postTax', to: 'retained', amount: r.retainedEarnings, kind: 'retain' as const }] : []),
    ...(hasDivTax ? [{ from: 'div', to: 'pTax', amount: r.personal.totalDividendTax, kind: 'tax' as const }] : []),
    ...(hasDiv ? [{ from: 'div', to: 'netOwner', amount: r.personal.netDividends, kind: 'net' as const }] : []),
    ...(hasSalaryTax ? [{ from: 'salary', to: 'pTax', amount: r.personal.itOnSalary + r.personal.employeeNI, kind: 'tax' as const }] : []),
    { from: 'salary', to: 'netOwner', amount: r.personal.netSalary, kind: 'net' },
  ];

  const layout: BuiltFlow['layout'] = {
    rev: { col: 0, row: 2 },
    costs: { col: 1, row: 0 },
    salary: { col: 1, row: 1 },
    erNi: { col: 2, row: 0 },
    ...(hasPension ? { pension: { col: 1, row: 5 } } : {}),
    preTax: { col: 1, row: 3 },
    ct: { col: 2, row: 4 },
    postTax: { col: 2, row: 3 },
    div: { col: 3, row: 2 },
    retained: { col: 3, row: 4 },
    pTax: { col: 4, row: 1 },
    netOwner: { col: 4, row: 2 },
  };

  return { nodes, edges, layout, cols: 5, rows: hasPension ? 6 : 5 };
}

// Partnership / LLP flow: rev → costs → profit → share_a / share_b → pTax_a / pTax_b → net_a / net_b
function buildPartnershipLikeFlow(r: PartnershipResult, labelPrefix: string): BuiltFlow {
  const hasProfit = r.profit > 0;
  const hasCosts = r.costs > 0;
  const hasTax = r.taxPerPartner > 0;

  const nodes: FlowNode[] = [
    { id: 'rev', label: 'Revenue', amount: r.revenue, kind: 'inflow' },
    ...(hasCosts ? [{ id: 'costs', label: 'Business costs', amount: r.costs, kind: 'cost' as const }] : []),
    ...(hasProfit ? [{ id: 'profit', label: 'Partnership profit', amount: r.profit, kind: 'transit' as const }] : []),
    { id: 'share_a', label: `${labelPrefix} A share`, amount: r.profitPerPartner, kind: 'transit' as const },
    { id: 'share_b', label: `${labelPrefix} B share`, amount: r.profitPerPartner, kind: 'transit' as const },
    ...(hasTax ? [
      { id: 'pTax_a', label: `IT + Class 4 NI (${labelPrefix} A)`, amount: r.taxPerPartner, kind: 'tax' as const },
      { id: 'pTax_b', label: `IT + Class 4 NI (${labelPrefix} B)`, amount: r.taxPerPartner, kind: 'tax' as const },
    ] : []),
    { id: 'net_a', label: `Net (${labelPrefix} A)`, amount: r.netPerPartner, kind: 'net' as const },
    { id: 'net_b', label: `Net (${labelPrefix} B)`, amount: r.netPerPartner, kind: 'net' as const },
  ];

  const source = hasProfit ? 'profit' : 'rev';
  const edges: FlowEdge[] = [
    ...(hasCosts ? [{ from: 'rev', to: 'costs', amount: r.costs, kind: 'cost' as const }] : []),
    ...(hasProfit ? [{ from: 'rev', to: 'profit', amount: r.profit, kind: 'transit' as const }] : []),
    { from: source, to: 'share_a', amount: r.profitPerPartner, kind: 'transit' as const },
    { from: source, to: 'share_b', amount: r.profitPerPartner, kind: 'transit' as const },
    ...(hasTax ? [
      { from: 'share_a', to: 'pTax_a', amount: r.taxPerPartner, kind: 'tax' as const },
      { from: 'share_b', to: 'pTax_b', amount: r.taxPerPartner, kind: 'tax' as const },
    ] : []),
    { from: 'share_a', to: 'net_a', amount: r.netPerPartner, kind: 'net' as const },
    { from: 'share_b', to: 'net_b', amount: r.netPerPartner, kind: 'net' as const },
  ];

  const layout: BuiltFlow['layout'] = {
    rev: { col: 0, row: 2 },
    ...(hasCosts ? { costs: { col: 1, row: 0 } } : {}),
    ...(hasProfit ? { profit: { col: 1, row: 2 } } : {}),
    share_a: { col: 2, row: 1 },
    share_b: { col: 2, row: 3 },
    ...(hasTax ? { pTax_a: { col: 3, row: 0 }, pTax_b: { col: 3, row: 3 } } : {}),
    net_a: { col: 4, row: 1 },
    net_b: { col: 4, row: 3 },
  };

  return { nodes, edges, layout, cols: 5, rows: 4 };
}

export function buildPartnershipFlow(r: PartnershipResult): BuiltFlow {
  return buildPartnershipLikeFlow(r, 'Partner');
}

export function buildLlpFlow(r: PartnershipResult): BuiltFlow {
  return buildPartnershipLikeFlow(r, 'Member');
}

// Umbrella flow: rev → fee / erNI / grossPay → IT / eeNI / net
export function buildUmbrellaFlow(r: UmbrellaResult): BuiltFlow {
  const hasFee = r.umbrellaFee > 0;
  const hasErNI = r.employerNI > 0;

  const nodes: FlowNode[] = [
    { id: 'rev', label: 'Contract value', amount: r.revenue, kind: 'inflow' },
    ...(hasFee ? [{ id: 'fee', label: 'Umbrella fee', amount: r.umbrellaFee, kind: 'cost' as const }] : []),
    ...(hasErNI ? [{ id: 'erNI', label: 'Employer NI → HMRC', amount: r.employerNI, kind: 'tax' as const }] : []),
    { id: 'grossPay', label: 'Gross pay', amount: r.grossPay, kind: 'transit' },
    { id: 'it', label: 'Income tax → HMRC', amount: r.itOnPay, kind: 'tax' },
    { id: 'eeNI', label: 'Employee NI → HMRC', amount: r.employeeNI, kind: 'tax' },
    { id: 'net', label: 'Net to contractor', amount: r.netToContractor, kind: 'net' },
  ];

  const edges: FlowEdge[] = [
    ...(hasFee ? [{ from: 'rev', to: 'fee', amount: r.umbrellaFee, kind: 'cost' as const }] : []),
    ...(hasErNI ? [{ from: 'rev', to: 'erNI', amount: r.employerNI, kind: 'tax' as const }] : []),
    { from: 'rev', to: 'grossPay', amount: r.grossPay, kind: 'transit' },
    { from: 'grossPay', to: 'it', amount: r.itOnPay, kind: 'tax' },
    { from: 'grossPay', to: 'eeNI', amount: r.employeeNI, kind: 'tax' },
    { from: 'grossPay', to: 'net', amount: r.netToContractor, kind: 'net' },
  ];

  const layout: BuiltFlow['layout'] = {
    rev: { col: 0, row: 1 },
    ...(hasFee ? { fee: { col: 1, row: 0 } } : {}),
    ...(hasErNI ? { erNI: { col: 1, row: 2 } } : {}),
    grossPay: { col: 2, row: 1 },
    it: { col: 3, row: 0 },
    eeNI: { col: 3, row: 2 },
    net: { col: 4, row: 1 },
  };

  return { nodes, edges, layout, cols: 5, rows: 3 };
}

// IR35 flow: rev → costs / erNI / deemedSalary → IT / eeNI / net
export function buildIr35Flow(r: Ir35Result): BuiltFlow {
  const hasCosts = r.costs > 0;
  const hasErNI = r.employerNI > 0;

  const nodes: FlowNode[] = [
    { id: 'rev', label: 'Contract income', amount: r.revenue, kind: 'inflow' },
    ...(hasCosts ? [{ id: 'costs', label: 'Deductible expenses', amount: r.costs, kind: 'cost' as const }] : []),
    ...(hasErNI ? [{ id: 'erNI', label: 'Employer NI → HMRC', amount: r.employerNI, kind: 'tax' as const }] : []),
    { id: 'deemedSalary', label: 'Deemed salary', amount: r.deemedSalary, kind: 'transit', sub: 'No dividend option under IR35' },
    { id: 'it', label: 'Income tax → HMRC', amount: r.itOnSalary, kind: 'tax' },
    { id: 'eeNI', label: 'Employee NI → HMRC', amount: r.employeeNI, kind: 'tax' },
    { id: 'net', label: 'Net to contractor', amount: r.netToContractor, kind: 'net' },
  ];

  const edges: FlowEdge[] = [
    ...(hasCosts ? [{ from: 'rev', to: 'costs', amount: r.costs, kind: 'cost' as const }] : []),
    ...(hasErNI ? [{ from: 'rev', to: 'erNI', amount: r.employerNI, kind: 'tax' as const }] : []),
    { from: 'rev', to: 'deemedSalary', amount: r.deemedSalary, kind: 'transit' },
    { from: 'deemedSalary', to: 'it', amount: r.itOnSalary, kind: 'tax' },
    { from: 'deemedSalary', to: 'eeNI', amount: r.employeeNI, kind: 'tax' },
    { from: 'deemedSalary', to: 'net', amount: r.netToContractor, kind: 'net' },
  ];

  const layout: BuiltFlow['layout'] = {
    rev: { col: 0, row: 1 },
    ...(hasCosts ? { costs: { col: 1, row: 0 } } : {}),
    ...(hasErNI ? { erNI: { col: 1, row: 2 } } : {}),
    deemedSalary: { col: 2, row: 1 },
    it: { col: 3, row: 0 },
    eeNI: { col: 3, row: 2 },
    net: { col: 4, row: 1 },
  };

  return { nodes, edges, layout, cols: 5, rows: 3 };
}

// Holding company flow: same as Ltd but post-tax profit routes through HoldCo node
// before reaching the owner, making the two-entity structure explicit.
export function buildHoldingFlow(r: LtdResult): BuiltFlow {
  const directExpense = r.costs;
  const salary = r.ownerSalary;
  const erNI = r.employerNI;
  const pension = r.pensionContribution;
  const totalEmploymentCost = salary + erNI;
  const isLoss = r.preTaxProfit < 0;
  const distributable = Math.max(0, r.postTaxProfit);

  const hasPension = pension > 0;
  const hasCT = r.corporationTax.total > 0;
  const hasPostTax = distributable > 0;
  const hasDiv = r.dividendDeclared > 0;
  const hasHoldRetained = r.retainedEarnings > 0;
  const hasSalaryTax = r.personal.itOnSalary + r.personal.employeeNI > 0;
  const hasDivTax = r.personal.totalDividendTax > 0;
  const hasPersonalTax = r.personal.totalPersonalTax > 0;

  const nodes: FlowNode[] = [
    { id: 'rev', label: 'Revenue', amount: r.revenue, kind: 'inflow' },
    { id: 'costs', label: 'Business costs', amount: directExpense, kind: 'cost' },
    {
      id: 'salary',
      label: 'Director salary (deductible)',
      amount: totalEmploymentCost,
      kind: 'cost',
      sub: erNI > 0 ? `Incl. ${formatGBP(erNI)} employer NI` : undefined,
    },
    { id: 'erNi', label: 'Employer NI → HMRC', amount: erNI, kind: 'tax' },
    ...(hasPension ? [{ id: 'pension', label: 'Pension (deductible)', amount: pension, kind: 'cost' as const }] : []),
    {
      id: 'preTax',
      label: isLoss ? 'Pre-tax loss' : 'Pre-tax profit',
      amount: Math.abs(r.preTaxProfit),
      kind: isLoss ? 'tax' : ('transit' as const),
      sub: isLoss ? 'Employment costs exceed revenue' : undefined,
    },
    ...(hasCT ? [{ id: 'ct', label: 'Corporation tax → HMRC', amount: r.corporationTax.total, kind: 'tax' as const, sub: `${(r.corporationTax.effectiveRate * 100).toFixed(1)}% effective` }] : []),
    ...(hasPostTax ? [{ id: 'postTax', label: 'Post-tax profit (OpCo)', amount: distributable, kind: 'transit' as const }] : []),
    // HoldCo sits between OpCo and the owner's personal extraction.
    ...(hasPostTax ? [{ id: 'holdCo', label: 'HoldCo buffer', amount: distributable, kind: 'retain' as const, sub: 'Inter-company dividend (tax-free)' }] : []),
    ...(hasDiv ? [{ id: 'div', label: 'Dividend to owner', amount: r.dividendDeclared, kind: 'transit' as const }] : []),
    ...(hasHoldRetained ? [{ id: 'holdRetained', label: 'Retained in HoldCo', amount: r.retainedEarnings, kind: 'retain' as const, sub: 'Personal tax deferred' }] : []),
    ...(hasPersonalTax ? [{ id: 'pTax', label: 'Personal tax → HMRC', amount: r.personal.totalPersonalTax, kind: 'tax' as const, sub: 'IT + NI + dividend tax' }] : []),
    { id: 'netOwner', label: 'Net to owner', amount: r.ownerTotalNet, kind: 'net' },
  ];

  const edges: FlowEdge[] = [
    { from: 'rev', to: 'costs', amount: directExpense, kind: 'cost' },
    { from: 'rev', to: 'salary', amount: totalEmploymentCost, kind: 'cost' },
    { from: 'salary', to: 'erNi', amount: erNI, kind: 'tax' },
    ...(hasPension ? [{ from: 'rev', to: 'pension', amount: pension, kind: 'cost' as const }] : []),
    ...(!isLoss && r.preTaxProfit > 0 ? [{ from: 'rev', to: 'preTax', amount: r.preTaxProfit, kind: 'transit' as const }] : []),
    ...(hasCT ? [{ from: 'preTax', to: 'ct', amount: r.corporationTax.total, kind: 'tax' as const }] : []),
    ...(hasPostTax ? [{ from: 'preTax', to: 'postTax', amount: distributable, kind: 'transit' as const }] : []),
    // OpCo → HoldCo as inter-company (tax-free) dividend
    ...(hasPostTax ? [{ from: 'postTax', to: 'holdCo', amount: distributable, kind: 'retain' as const }] : []),
    ...(hasDiv ? [{ from: 'holdCo', to: 'div', amount: r.dividendDeclared, kind: 'transit' as const }] : []),
    ...(hasHoldRetained ? [{ from: 'holdCo', to: 'holdRetained', amount: r.retainedEarnings, kind: 'retain' as const }] : []),
    ...(hasDivTax ? [{ from: 'div', to: 'pTax', amount: r.personal.totalDividendTax, kind: 'tax' as const }] : []),
    ...(hasDiv ? [{ from: 'div', to: 'netOwner', amount: r.personal.netDividends, kind: 'net' as const }] : []),
    ...(hasSalaryTax ? [{ from: 'salary', to: 'pTax', amount: r.personal.itOnSalary + r.personal.employeeNI, kind: 'tax' as const }] : []),
    { from: 'salary', to: 'netOwner', amount: r.personal.netSalary, kind: 'net' },
  ];

  const layout: BuiltFlow['layout'] = {
    rev: { col: 0, row: 2 },
    costs: { col: 1, row: 0 },
    salary: { col: 1, row: 1 },
    erNi: { col: 2, row: 0 },
    ...(hasPension ? { pension: { col: 1, row: 5 } } : {}),
    preTax: { col: 1, row: 3 },
    ct: { col: 2, row: 4 },
    postTax: { col: 2, row: 3 },
    holdCo: { col: 3, row: 3 },
    div: { col: 4, row: 2 },
    holdRetained: { col: 4, row: 4 },
    pTax: { col: 5, row: 1 },
    netOwner: { col: 5, row: 2 },
  };

  return { nodes, edges, layout, cols: 6, rows: hasPension ? 6 : 5 };
}
