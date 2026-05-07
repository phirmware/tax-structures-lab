import { useMemo } from 'react';
import { formatGBP } from '../../lib/format';

export type FlowKind = 'cost' | 'tax' | 'net' | 'transit' | 'retain';

export interface FlowNode {
  id: string;
  label: string;
  amount: number;
  kind?: 'inflow' | 'tax' | 'net' | 'retain' | 'transit' | 'cost';
  sub?: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  amount: number;
  kind: FlowKind;
  label?: string;
}

interface DiagramProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  // grid layout: positions in [col, row] units. col 0..N from left.
  layout: Record<string, { col: number; row: number }>;
  cols?: number;
  rows?: number;
  height?: number;
}

const KIND_FILL: Record<NonNullable<FlowNode['kind']>, string> = {
  inflow: 'rgb(59 130 246 / 0.12)',
  tax: 'rgb(220 38 38 / 0.14)',
  net: 'rgb(76 176 131 / 0.18)',
  retain: 'rgb(234 179 8 / 0.18)',
  transit: 'rgb(120 130 145 / 0.10)',
  cost: 'rgb(217 119 6 / 0.16)',
};

const KIND_STROKE: Record<NonNullable<FlowNode['kind']>, string> = {
  inflow: '#3b82f6',
  tax: '#dc2626',
  net: '#2e956a',
  retain: '#ca8a04',
  transit: '#67738c',
  cost: '#d97706',
};

const EDGE_CLASS: Record<FlowKind, string> = {
  tax: 'flow-line flow-line-tax',
  net: 'flow-line flow-line-net',
  cost: 'flow-line flow-line-cost',
  retain: 'flow-line flow-line-net',
  transit: 'flow-line flow-line-default',
};

export function CashFlowDiagram({
  nodes,
  edges,
  layout,
  cols = 5,
  rows = 4,
  height,
}: DiagramProps) {
  const padding = 24;
  const nodeW = 180;
  const nodeH = 64;
  const gapX = 80;
  const gapY = 24;
  const colW = nodeW + gapX;
  const rowH = nodeH + gapY;
  const innerW = cols * colW - gapX;
  const innerH = rows * rowH - gapY;
  const W = innerW + padding * 2;
  const H = (height ?? innerH) + padding * 2;

  const positions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    Object.entries(layout).forEach(([id, p]) => {
      map[id] = {
        x: padding + p.col * colW,
        y: padding + p.row * rowH,
      };
    });
    return map;
  }, [layout, colW, rowH]);

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        className="block"
        role="img"
        aria-label="Cash flow diagram"
      >
        {/* Edges first so nodes sit on top */}
        {edges.map((edge, i) => {
          const a = positions[edge.from];
          const b = positions[edge.to];
          if (!a || !b) return null;
          const ax = a.x + nodeW;
          const ay = a.y + nodeH / 2;
          const bx = b.x;
          const by = b.y + nodeH / 2;
          const midX = (ax + bx) / 2;
          const path = `M ${ax} ${ay} C ${midX} ${ay}, ${midX} ${by}, ${bx} ${by}`;
          const labelX = (ax + bx) / 2;
          const labelY = (ay + by) / 2 - 6;
          return (
            <g key={`${edge.from}-${edge.to}-${i}`}>
              <path d={path} className={EDGE_CLASS[edge.kind]} />
              <g transform={`translate(${labelX},${labelY})`}>
                <rect
                  x={-46}
                  y={-12}
                  rx={6}
                  width={92}
                  height={20}
                  className="fill-white dark:fill-ink-900"
                  stroke="currentColor"
                  strokeOpacity={0.18}
                  strokeWidth={1}
                />
                <text
                  x={0}
                  y={2}
                  textAnchor="middle"
                  className="fill-ink-700 dark:fill-ink-200"
                  style={{ fontSize: 11, fontWeight: 600 }}
                >
                  {formatGBP(Math.max(0, edge.amount))}
                </text>
              </g>
            </g>
          );
        })}

        {nodes.map((n) => {
          const p = positions[n.id];
          if (!p) return null;
          const kind = n.kind ?? 'transit';
          return (
            <g key={n.id} transform={`translate(${p.x},${p.y})`}>
              <rect
                width={nodeW}
                height={nodeH}
                rx={10}
                ry={10}
                fill={KIND_FILL[kind]}
                stroke={KIND_STROKE[kind]}
                strokeWidth={1.5}
              />
              <text
                x={12}
                y={22}
                style={{ fontSize: 11, fontWeight: 600 }}
                className="fill-ink-700 dark:fill-ink-200"
              >
                {n.label.toUpperCase()}
              </text>
              <text
                x={12}
                y={44}
                style={{ fontSize: 16, fontWeight: 700 }}
                className="fill-ink-900 dark:fill-ink-50"
              >
                {formatGBP(Math.max(0, n.amount))}
              </text>
              {n.sub && (
                <text
                  x={12}
                  y={58}
                  style={{ fontSize: 10 }}
                  className="fill-ink-500 dark:fill-ink-400"
                >
                  {n.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Small reusable legend for any cash flow diagram.
export function CashFlowLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-600 dark:text-ink-300">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-3 rounded bg-blue-500/30 ring-1 ring-blue-500" />
        Inflow
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-3 rounded bg-warn-500/30 ring-1 ring-warn-500" />
        Cost
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-3 rounded bg-danger-500/30 ring-1 ring-danger-500" />
        Tax → HMRC
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-3 rounded bg-accent-500/30 ring-1 ring-accent-500" />
        Net to owner
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-3 rounded bg-yellow-500/30 ring-1 ring-yellow-500" />
        Retained
      </span>
    </div>
  );
}
