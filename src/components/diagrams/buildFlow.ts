import type { FlowEdge, FlowNode } from './CashFlowDiagram';
import type { LtdResult, SoleTraderResult } from '../../lib/tax';

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

  const nodes: FlowNode[] = [
    { id: 'rev', label: 'Revenue', amount: r.revenue, kind: 'inflow' },
    { id: 'costs', label: 'Business costs', amount: directExpense, kind: 'cost' },
    {
      id: 'salary',
      label: 'Director salary (deductible)',
      amount: salary,
      kind: 'cost',
    },
    {
      id: 'erNi',
      label: 'Employer NI → HMRC',
      amount: erNI,
      kind: 'tax',
    },
    ...(pension > 0
      ? [
          {
            id: 'pension',
            label: 'Pension (deductible)',
            amount: pension,
            kind: 'cost' as const,
          },
        ]
      : []),
    {
      id: 'preTax',
      label: 'Pre-tax profit',
      amount: r.preTaxProfit,
      kind: 'transit',
    },
    {
      id: 'ct',
      label: 'Corporation tax → HMRC',
      amount: r.corporationTax.total,
      kind: 'tax',
      sub: `${(r.corporationTax.effectiveRate * 100).toFixed(1)}% effective`,
    },
    {
      id: 'postTax',
      label: 'Post-tax profit',
      amount: r.postTaxProfit,
      kind: 'transit',
    },
    {
      id: 'div',
      label: 'Dividend declared',
      amount: r.dividendDeclared,
      kind: 'transit',
    },
    {
      id: 'retained',
      label: 'Retained earnings',
      amount: r.retainedEarnings,
      kind: 'retain',
      sub: 'Compounds at corporate rate',
    },
    {
      id: 'pTax',
      label: 'Personal tax → HMRC',
      amount: r.personal.totalPersonalTax,
      kind: 'tax',
      sub: 'IT + NI + dividend tax',
    },
    {
      id: 'netOwner',
      label: 'Net to owner',
      amount: r.ownerTotalNet,
      kind: 'net',
    },
  ];

  const edges: FlowEdge[] = [
    { from: 'rev', to: 'costs', amount: directExpense, kind: 'cost' },
    { from: 'rev', to: 'salary', amount: salary, kind: 'cost' },
    { from: 'rev', to: 'erNi', amount: erNI, kind: 'tax' },
    ...(pension > 0
      ? [{ from: 'rev', to: 'pension', amount: pension, kind: 'cost' as const }]
      : []),
    { from: 'rev', to: 'preTax', amount: r.preTaxProfit, kind: 'transit' },
    { from: 'preTax', to: 'ct', amount: r.corporationTax.total, kind: 'tax' },
    { from: 'preTax', to: 'postTax', amount: r.postTaxProfit, kind: 'transit' },
    { from: 'postTax', to: 'div', amount: r.dividendDeclared, kind: 'transit' },
    { from: 'postTax', to: 'retained', amount: r.retainedEarnings, kind: 'retain' },
    { from: 'salary', to: 'pTax', amount: r.personal.itOnSalary + r.personal.employeeNI, kind: 'tax' },
    { from: 'div', to: 'pTax', amount: r.personal.totalDividendTax, kind: 'tax' },
    { from: 'salary', to: 'netOwner', amount: r.personal.netSalary, kind: 'net' },
    { from: 'div', to: 'netOwner', amount: r.personal.netDividends, kind: 'net' },
  ];

  const layout: BuiltFlow['layout'] = {
    rev: { col: 0, row: 2 },
    costs: { col: 1, row: 0 },
    salary: { col: 1, row: 1 },
    erNi: { col: 1, row: 6 },
    ...(pension > 0 ? { pension: { col: 1, row: 5 } } : {}),
    preTax: { col: 1, row: 3 },
    ct: { col: 2, row: 4 },
    postTax: { col: 2, row: 3 },
    div: { col: 3, row: 2 },
    retained: { col: 3, row: 4 },
    pTax: { col: 4, row: 1 },
    netOwner: { col: 4, row: 2 },
  };

  return { nodes, edges, layout, cols: 5, rows: 7 };
}
