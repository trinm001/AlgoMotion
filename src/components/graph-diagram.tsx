import type { Graph } from "@/lib/graph";

export function GraphDiagram({ graph, activeVertices = [], visitedVertices = [], activeEdgeIds = [], selectedEdgeIds = [], annotations = [], label, showWeights = true }: { graph: Graph; activeVertices?: number[]; visitedVertices?: number[]; activeEdgeIds?: number[]; selectedEdgeIds?: number[]; annotations?: string[]; label: string; showWeights?: boolean }) {
  const width = 680;
  const height = 430;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = graph.vertexCount <= 6 ? 145 : 170;
  const positions = Array.from({ length: graph.vertexCount }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / graph.vertexCount;
    return { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius };
  });

  return (
    <svg role="img" aria-label={label} viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[40rem] rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
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
        const length = Math.hypot(dx, dy);
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
        return <g key={edge.id}><path d={bend ? `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}` : `M ${startX} ${startY} L ${endX} ${endY}`} fill="none" stroke={stroke} strokeWidth={active || selected ? 4 : 2} markerEnd={marker} />{showWeights ? <><rect x={labelX - 16} y={labelY - 11} width="32" height="22" rx="7" fill="var(--surface)" stroke={stroke} /><text x={labelX} y={labelY + 4} textAnchor="middle" fill="var(--foreground)" className="font-mono text-[11px] font-medium">{edge.weight}</text></> : null}</g>;
      })}
      {positions.map((position, vertex) => {
        const active = activeVertices.includes(vertex);
        const visited = visitedVertices.includes(vertex);
        return <g key={vertex}><circle cx={position.x} cy={position.y} r="28" fill={active ? "var(--accent)" : visited ? "var(--brand)" : "var(--brand-soft)"} stroke={active ? "var(--accent)" : "var(--brand)"} strokeWidth="3" /><text x={position.x} y={position.y + 5} textAnchor="middle" fill={active || visited ? "white" : "var(--foreground)"} className="font-mono text-sm font-black">{vertex}</text>{annotations[vertex] ? <g><rect x={position.x - 30} y={position.y + 34} width="60" height="20" rx="6" fill="var(--surface)" stroke="var(--line)" /><text x={position.x} y={position.y + 48} textAnchor="middle" fill="var(--muted)" className="font-mono text-[10px]">{annotations[vertex]}</text></g> : null}</g>;
      })}
    </svg>
  );
}

export function StatePills({ label, values }: { label: string; values: Array<string | number> }) {
  return <div><p className="mb-2 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{label}</p><div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2">{values.length ? values.map((value, index) => <span key={`${value}-${index}`} className="rounded-lg bg-[var(--brand-soft)] px-2.5 py-1 font-mono text-sm font-black text-[var(--brand)]">{value}</span>) : <span className="px-2 text-sm text-[var(--muted)]">—</span>}</div></div>;
}
