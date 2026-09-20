"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Graph } from "@/lib/graph";
import type { Locale } from "@/lib/i18n";

type Position = { x: number; y: number };
type Layout = "circle" | "tree";

const width = 680;
const height = 430;

function circlePositions(vertexCount: number): Position[] {
  const radius = vertexCount <= 6 ? 145 : 170;
  return Array.from({ length: vertexCount }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / vertexCount;
    return { x: width / 2 + Math.cos(angle) * radius, y: height / 2 + Math.sin(angle) * radius };
  });
}

function treePositions(graph: Graph, requestedRoot: number): Position[] {
  const neighbors = Array.from({ length: graph.vertexCount }, () => [] as number[]);
  for (const edge of graph.edges) {
    neighbors[edge.from].push(edge.to);
    neighbors[edge.to].push(edge.from);
  }
  neighbors.forEach((list) => list.sort((left, right) => left - right));

  const depth = Array(graph.vertexCount).fill(-1) as number[];
  const roots = [requestedRoot, ...Array.from({ length: graph.vertexCount }, (_, index) => index)]
    .filter((vertex, index, values) => vertex >= 0 && vertex < graph.vertexCount && values.indexOf(vertex) === index);
  for (const root of roots) {
    if (depth[root] !== -1) continue;
    depth[root] = 0;
    const queue = [root];
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const vertex = queue[cursor];
      for (const next of neighbors[vertex]) {
        if (depth[next] !== -1) continue;
        depth[next] = depth[vertex] + 1;
        queue.push(next);
      }
    }
  }

  const maximumDepth = Math.max(0, ...depth);
  const layers = Array.from({ length: maximumDepth + 1 }, () => [] as number[]);
  depth.forEach((level, vertex) => layers[level].push(vertex));
  const positions = Array.from({ length: graph.vertexCount }, () => ({ x: width / 2, y: height / 2 }));
  layers.forEach((vertices, level) => {
    vertices.forEach((vertex, index) => {
      positions[vertex] = {
        x: ((index + 1) * width) / (vertices.length + 1),
        y: maximumDepth === 0 ? height / 2 : 58 + (level * (height - 116)) / maximumDepth,
      };
    });
  });
  return positions;
}

function initialPositions(graph: Graph, layout: Layout, treeRoot: number) {
  return layout === "tree" ? treePositions(graph, treeRoot) : circlePositions(graph.vertexCount);
}

type GraphDiagramProps = {
  graph: Graph;
  locale: Locale;
  activeVertices?: number[];
  visitedVertices?: number[];
  activeEdgeIds?: number[];
  selectedEdgeIds?: number[];
  annotations?: string[];
  label: string;
  showWeights?: boolean;
  layout?: Layout;
  treeRoot?: number;
};

export function GraphDiagram(props: GraphDiagramProps) {
  const { graph, layout = "circle", treeRoot = 0 } = props;
  const signature = `${graph.vertexCount}:${graph.directed}:${graph.edges.map((edge) => `${edge.from}-${edge.to}`).join(",")}:${layout}:${treeRoot}`;
  return <InteractiveGraphDiagram key={signature} {...props} layout={layout} treeRoot={treeRoot} />;
}

function InteractiveGraphDiagram({ graph, locale, activeVertices = [], visitedVertices = [], activeEdgeIds = [], selectedEdgeIds = [], annotations = [], label, showWeights = true, layout = "circle", treeRoot = 0 }: GraphDiagramProps) {
  const [positions, setPositions] = useState(() => initialPositions(graph, layout, treeRoot));
  const [draggedVertex, setDraggedVertex] = useState<number | null>(null);
  const [fixed, setFixed] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const text = locale === "vi"
    ? { arrange: "Sắp xếp dạng cây", fix: "Khóa tất cả node", unfix: "Mở khóa tất cả node", fixed: "Đã khóa", movable: "Có thể kéo node" }
    : { arrange: "Arrange as tree", fix: "Fix all nodes", unfix: "Unfix all nodes", fixed: "All nodes fixed", movable: "Nodes are draggable" };

  const moveDraggedVertex = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (draggedVertex === null || fixed || !svgRef.current) return;
    const bounds = svgRef.current.getBoundingClientRect();
    const x = Math.max(34, Math.min(width - 34, ((event.clientX - bounds.left) * width) / bounds.width));
    const y = Math.max(34, Math.min(height - 56, ((event.clientY - bounds.top) * height) / bounds.height));
    setPositions((current) => current.map((position, vertex) => vertex === draggedVertex ? { x, y } : position));
  };

  return <div className="space-y-3">
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => setPositions(treePositions(graph, treeRoot))} className="rounded-xl border border-[var(--brand)] px-3 py-2 text-sm font-black text-[var(--brand)]">{text.arrange}</button>
      <button type="button" onClick={() => { setFixed(true); setDraggedVertex(null); }} className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-black">{text.fix}</button>
      <button type="button" onClick={() => setFixed(false)} className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-black">{text.unfix}</button>
      <span aria-live="polite" className="rounded-lg bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-bold text-[var(--brand)]">{fixed ? text.fixed : text.movable}</span>
    </div>
    <svg ref={svgRef} role="img" aria-label={label} viewBox={`0 0 ${width} ${height}`} onPointerMove={moveDraggedVertex} onPointerUp={() => setDraggedVertex(null)} onPointerCancel={() => setDraggedVertex(null)} className="w-full min-w-[40rem] select-none rounded-2xl border border-[var(--line)] bg-[var(--surface)]" style={{ touchAction: "none" }}>
      <defs>
        <marker id="graph-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L0,9 L9,4.5 z" fill="var(--muted)" /></marker>
        <marker id="graph-arrow-active" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L0,9 L9,4.5 z" fill="var(--accent)" /></marker>
        <marker id="graph-arrow-selected" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L0,9 L9,4.5 z" fill="var(--brand)" /></marker>
      </defs>
      {graph.edges.map((edge) => {
        const from = positions[edge.from];
        const to = positions[edge.to];
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.max(1, Math.hypot(dx, dy));
        const startX = from.x + (dx / length) * 29;
        const startY = from.y + (dy / length) * 29;
        const endX = to.x - (dx / length) * 32;
        const endY = to.y - (dy / length) * 32;
        const hasReverse = graph.directed && graph.edges.some((candidate) => candidate.from === edge.to && candidate.to === edge.from);
        const bend = hasReverse ? 28 : 0;
        const controlX = (startX + endX) / 2 + (-dy / length) * bend;
        const controlY = (startY + endY) / 2 + (dx / length) * bend;
        const labelX = hasReverse ? controlX : (startX + endX) / 2;
        const labelY = hasReverse ? controlY : (startY + endY) / 2;
        const active = activeEdgeIds.includes(edge.id);
        const selected = selectedEdgeIds.includes(edge.id);
        const stroke = active ? "var(--accent)" : selected ? "var(--brand)" : "var(--line)";
        const marker = graph.directed ? active ? "url(#graph-arrow-active)" : selected ? "url(#graph-arrow-selected)" : "url(#graph-arrow)" : undefined;
        return <g key={edge.id}><path d={bend ? `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}` : `M ${startX} ${startY} L ${endX} ${endY}`} fill="none" stroke={stroke} strokeWidth={active || selected ? 4 : 2} markerEnd={marker} />{showWeights ? <><rect x={labelX - 16} y={labelY - 11} width="32" height="22" rx="7" fill="var(--surface)" stroke={stroke} /><text x={labelX} y={labelY + 4} textAnchor="middle" fill="var(--foreground)" className="pointer-events-none font-mono text-[11px] font-medium">{edge.weight}</text></> : null}</g>;
      })}
      {positions.map((position, vertex) => {
        const active = activeVertices.includes(vertex);
        const visited = visitedVertices.includes(vertex);
        return <g key={vertex} onPointerDown={(event) => { if (fixed) return; event.currentTarget.setPointerCapture(event.pointerId); setDraggedVertex(vertex); }} className={fixed ? "cursor-not-allowed" : draggedVertex === vertex ? "cursor-grabbing" : "cursor-grab"}><circle cx={position.x} cy={position.y} r="28" fill={active ? "var(--accent)" : visited ? "var(--brand)" : "var(--brand-soft)"} stroke={active ? "var(--accent)" : "var(--brand)"} strokeWidth="3" /><text x={position.x} y={position.y + 5} textAnchor="middle" fill={active || visited ? "white" : "var(--foreground)"} className="pointer-events-none font-mono text-sm font-black">{vertex}</text>{annotations[vertex] ? <g className="pointer-events-none"><rect x={position.x - 30} y={position.y + 34} width="60" height="20" rx="6" fill="var(--surface)" stroke="var(--line)" /><text x={position.x} y={position.y + 48} textAnchor="middle" fill="var(--muted)" className="font-mono text-[10px]">{annotations[vertex]}</text></g> : null}</g>;
      })}
    </svg>
  </div>;
}

export function DirectionSelect({ locale, directed, onChange }: { locale: Locale; directed: boolean; onChange: (directed: boolean) => void }) {
  const label = locale === "vi" ? "Hướng cạnh" : "Edge direction";
  return <label className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">{label}<select aria-label={label} value={directed ? "directed" : "undirected"} onChange={(event) => onChange(event.target.value === "directed")} className="mt-2 block h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--foreground)]"><option value="undirected">{locale === "vi" ? "Vô hướng" : "Undirected"}</option><option value="directed">{locale === "vi" ? "Có hướng" : "Directed"}</option></select></label>;
}

export function StatePills({ label, values }: { label: string; values: Array<string | number> }) {
  return <div><p className="mb-2 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{label}</p><div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2">{values.length ? values.map((value, index) => <span key={`${value}-${index}`} className="rounded-lg bg-[var(--brand-soft)] px-2.5 py-1 font-mono text-sm font-black text-[var(--brand)]">{value}</span>) : <span className="px-2 text-sm text-[var(--muted)]">—</span>}</div></div>;
}
