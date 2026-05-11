import {
  useMemo,
  useState,
  useEffect,
  useId,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { formatGBP, formatPct } from '../../lib/format';
import { X, Expand } from '../ui/Icons';

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

const EDGE_STROKE: Record<FlowKind, string> = {
  tax: '#dc2626',
  net: '#2e956a',
  cost: '#d97706',
  retain: '#ca8a04',
  transit: '#67738c',
};

const KIND_LABEL: Record<NonNullable<FlowNode['kind']>, string> = {
  inflow: 'Inflow',
  tax: 'Tax',
  net: 'Net',
  retain: 'Retained',
  transit: 'Step',
  cost: 'Cost',
};

const SUMMARY_KINDS: Array<NonNullable<FlowNode['kind']>> = [
  'inflow',
  'tax',
  'net',
  'retain',
];

function splitLabel(label: string) {
  const words = label.replace(' → ', ' to ').split(/\s+/);
  const lines: string[] = [''];

  for (const word of words) {
    const current = lines[lines.length - 1];
    const next = current ? `${current} ${word}` : word;
    if (next.length > 22 && lines.length < 2) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = next;
    }
  }

  if (lines.length > 1 && lines[1].length > 24) {
    lines[1] = `${lines[1].slice(0, 21)}...`;
  }

  return lines;
}

function truncateSub(sub: string) {
  return sub.length > 30 ? `${sub.slice(0, 27)}...` : sub;
}

export function CashFlowDiagram({
  nodes,
  edges,
  layout,
  cols = 5,
  rows = 4,
  height,
}: DiagramProps) {
  const rawId = useId();
  const diagramId = rawId.replace(/:/g, '');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
  });
  const padding = 24;
  const nodeW = 196;
  const nodeH = 78;
  const gapX = 84;
  const gapY = 30;
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

  const maxEdge = useMemo(
    () => Math.max(1, ...edges.map((edge) => Math.max(0, edge.amount))),
    [edges],
  );

  const rootAmount = useMemo(() => {
    const inflow = nodes
      .filter((node) => node.kind === 'inflow')
      .reduce((sum, node) => sum + Math.max(0, node.amount), 0);
    return inflow || Math.max(1, ...nodes.map((node) => Math.max(0, node.amount)));
  }, [nodes]);

  const summary = useMemo(
    () =>
      SUMMARY_KINDS.map((kind) => ({
        kind,
        amount: nodes
          .filter((node) => node.kind === kind)
          .reduce((sum, node) => sum + Math.max(0, node.amount), 0),
      })).filter((item) => item.amount > 0),
    [nodes],
  );

  const startScrollDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const scrollEl = scrollRef.current;
    if (!scrollEl || scrollEl.scrollWidth <= scrollEl.clientWidth) return;
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: scrollEl.scrollLeft,
    };
  };

  const moveScrollDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scrollEl = scrollRef.current;
    const drag = dragRef.current;
    if (!scrollEl || !drag.active) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) < 4 || Math.abs(dx) <= Math.abs(dy)) return;

    event.preventDefault();
    scrollEl.scrollLeft = drag.scrollLeft - dx;
  };

  const endScrollDrag = () => {
    dragRef.current.active = false;
  };

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-ink-200 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-950/40">
      {summary.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b border-ink-200 bg-ink-50/70 px-3 py-2 dark:border-ink-800 dark:bg-ink-950/70">
          {summary.map((item) => (
            <div
              key={item.kind}
              className="flex items-baseline gap-2 rounded-md border border-ink-200 bg-white px-2.5 py-1 text-xs dark:border-ink-800 dark:bg-ink-900"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: KIND_STROKE[item.kind] }}
              />
              <span className="font-medium text-ink-500 dark:text-ink-400">
                {KIND_LABEL[item.kind]}
              </span>
              <span className="font-mono font-semibold tabular-nums text-ink-900 dark:text-ink-50">
                {formatGBP(item.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
      <div
        className="cash-flow-scroll overflow-x-scroll overscroll-x-contain focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        ref={scrollRef}
        tabIndex={0}
        aria-label="Scrollable cash flow diagram"
        onPointerDown={startScrollDrag}
        onPointerMove={moveScrollDrag}
        onPointerCancel={endScrollDrag}
        onPointerLeave={endScrollDrag}
        onPointerUp={endScrollDrag}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          className="cash-flow-svg block"
          role="img"
          aria-label="Cash flow diagram"
          preserveAspectRatio="xMidYMid meet"
        >
        <defs>
          <filter id={`${diagramId}-node-shadow`} x="-15%" y="-20%" width="130%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#111827" floodOpacity="0.08" />
          </filter>
          {Object.entries(EDGE_STROKE).map(([kind, colour]) => (
            <marker
              key={kind}
              id={`${diagramId}-arrow-${kind}`}
              markerWidth="7"
              markerHeight="7"
              refX="6"
              refY="3.5"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path d="M 0.5 0.5 L 6.5 3.5 L 0.5 6.5 z" fill={colour} opacity={0.85} />
            </marker>
          ))}
        </defs>

        <rect
          x={1}
          y={1}
          width={W - 2}
          height={H - 2}
          rx={16}
          className="fill-ink-50/40 dark:fill-ink-950"
          stroke="currentColor"
          strokeOpacity={0.08}
        />
        {Array.from({ length: cols }).map((_, col) => (
          <line
            key={`grid-col-${col}`}
            x1={padding + col * colW - gapX / 2}
            x2={padding + col * colW - gapX / 2}
            y1={padding / 2}
            y2={H - padding / 2}
            className="stroke-ink-200 dark:stroke-ink-800"
            strokeDasharray="2 10"
            strokeOpacity={col === 0 ? 0 : 0.6}
          />
        ))}

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
          const labelY = (ay + by) / 2 - 8 + ((i % 3) - 1) * 11;
          const label = formatGBP(Math.max(0, edge.amount));
          const labelW = Math.max(84, label.length * 7 + 22);
          const strokeWidth = Math.min(3.8, 1.35 + (Math.max(0, edge.amount) / maxEdge) * 2.45);
          return (
            <g key={`${edge.from}-${edge.to}-${i}`}>
              <path
                d={path}
                className={EDGE_CLASS[edge.kind]}
                markerEnd={`url(#${diagramId}-arrow-${edge.kind})`}
                style={{ strokeWidth }}
                strokeOpacity={edge.amount > 0 ? 0.9 : 0.24}
              />
              {edge.amount > 0 && (
                <g transform={`translate(${labelX},${labelY})`}>
                  <rect
                    x={-labelW / 2}
                    y={-13}
                    rx={7}
                    width={labelW}
                    height={24}
                    className="fill-white dark:fill-ink-900"
                    stroke={EDGE_STROKE[edge.kind]}
                    strokeOpacity={0.32}
                    strokeWidth={1}
                  />
                  <text
                    x={0}
                    y={2.5}
                    textAnchor="middle"
                    className="fill-ink-800 dark:fill-ink-100"
                    style={{ fontSize: 11, fontWeight: 700 }}
                  >
                    {label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {nodes.map((n) => {
          const p = positions[n.id];
          if (!p) return null;
          const kind = n.kind ?? 'transit';
          const labelLines = splitLabel(n.label);
          const amountY = labelLines.length > 1 ? 55 : 49;
          const share = rootAmount > 0 ? n.amount / rootAmount : 0;
          return (
            <g key={n.id} transform={`translate(${p.x},${p.y})`}>
              <rect
                width={nodeW}
                height={nodeH}
                rx={8}
                ry={8}
                className="fill-white dark:fill-ink-900"
                filter={`url(#${diagramId}-node-shadow)`}
              />
              <rect
                width={nodeW}
                height={nodeH}
                rx={8}
                ry={8}
                fill={KIND_FILL[kind]}
                stroke={KIND_STROKE[kind]}
                strokeWidth={1.5}
              />
              <rect
                width={nodeW}
                height={5}
                rx={8}
                ry={8}
                fill={KIND_STROKE[kind]}
                opacity={0.8}
              />
              <circle cx={14} cy={20} r={4} fill={KIND_STROKE[kind]} opacity={0.9} />
              <text
                x={26}
                y={20}
                style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0 }}
                className="fill-ink-700 dark:fill-ink-200"
              >
                {labelLines.map((line, lineIndex) => (
                  <tspan key={`${n.id}-${lineIndex}`} x={26} dy={lineIndex === 0 ? 0 : 13}>
                    {line}
                  </tspan>
                ))}
              </text>
              <text
                x={12}
                y={amountY}
                style={{ fontSize: 16, fontWeight: 800, letterSpacing: 0 }}
                className="fill-ink-900 dark:fill-ink-50"
              >
                {formatGBP(Math.max(0, n.amount))}
              </text>
              {share > 0 && (
                <text
                  x={nodeW - 12}
                  y={amountY}
                  textAnchor="end"
                  style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0 }}
                  className="fill-ink-500 dark:fill-ink-400"
                >
                  {formatPct(share)}
                </text>
              )}
              {n.sub && (
                <text
                  x={12}
                  y={70}
                  style={{ fontSize: 10 }}
                  className="fill-ink-500 dark:fill-ink-400"
                >
                  {truncateSub(n.sub)}
                </text>
              )}
            </g>
          );
        })}
        </svg>
      </div>
    </div>
  );
}

export function FullscreenDiagram({
  title,
  ...props
}: DiagramProps & { title?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div className="min-w-0 max-w-full">
        <div className="flex justify-end pb-1 pr-1">
          <button
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-ink-500 transition hover:bg-ink-100 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100"
            onClick={() => setOpen(true)}
            aria-label="View fullscreen"
          >
            <Expand className="h-3.5 w-3.5" />
            Expand
          </button>
        </div>
        <CashFlowDiagram {...props} />
      </div>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex flex-col bg-white/97 backdrop-blur-sm dark:bg-ink-950/97"
            onClick={() => setOpen(false)}
          >
            <div
              className="flex shrink-0 flex-col gap-3 border-b border-ink-200 px-4 py-3 dark:border-ink-800 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4">
                {title && (
                  <span className="text-sm font-semibold text-ink-900 dark:text-ink-100">{title}</span>
                )}
                <CashFlowLegend />
              </div>
              <button
                className="rounded p-2 text-ink-500 transition hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-ink-100"
                onClick={() => setOpen(false)}
                aria-label="Close fullscreen"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div
              className="flex flex-1 items-center justify-center overflow-auto bg-ink-50/80 p-6 dark:bg-ink-950"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-6xl">
                <CashFlowDiagram {...props} />
              </div>
            </div>
            <p className="shrink-0 pb-3 text-center text-xs text-ink-400 dark:text-ink-500">
              Press Esc or click outside to close
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}

// Small reusable legend for any cash flow diagram.
export function CashFlowLegend() {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-600 dark:text-ink-300">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-3 rounded-sm bg-blue-500/30 ring-1 ring-blue-500" />
        Inflow
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-3 rounded-sm bg-warn-500/30 ring-1 ring-warn-500" />
        Cost
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-3 rounded-sm bg-danger-500/30 ring-1 ring-danger-500" />
        Tax → HMRC
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-3 rounded-sm bg-accent-500/30 ring-1 ring-accent-500" />
        Net to owner
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-3 rounded-sm bg-yellow-500/30 ring-1 ring-yellow-500" />
        Retained
      </span>
    </div>
  );
}
