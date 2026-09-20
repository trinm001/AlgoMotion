import type { ReactNode } from "react";
import { ConceptCard, LabControls, LabProgress } from "@/components/algorithm-lab-shared";
import type { useTracePlayback } from "@/components/use-trace-playback";
import type { Locale } from "@/lib/i18n";

const controls = {
  vi: { reset: "Về đầu", previous: "Lùi", play: "Chạy", pause: "Dừng", next: "Tiếp" },
  en: { reset: "Start over", previous: "Previous", play: "Play", pause: "Pause", next: "Next" },
} as const;

type Playback = ReturnType<typeof useTracePlayback>;

export function LabHeading({ eyebrow, title, intro, id }: { eyebrow: string; title: string; intro: string; id: string }) {
  return <><p className="eyebrow">{eyebrow}</p><h2 id={id} className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{title}</h2><p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">{intro}</p></>;
}

export function TraceWorkspace({ locale, playback, count, stepLabel, message, badge, children }: { locale: Locale; playback: Playback; count: number; stepLabel: string; message: string; badge?: string; children: ReactNode }) {
  return <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem]"><div className="min-w-0 space-y-6 p-4 sm:p-6">{children}</div><aside className="border-t border-[var(--line)] bg-[var(--surface)] p-5 lg:border-l lg:border-t-0"><div className="flex items-center justify-between gap-2"><p className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">{stepLabel} {playback.index + 1} / {count}</p>{badge ? <span className="rounded-lg bg-[var(--brand-soft)] px-2 py-1 text-xs font-black text-[var(--brand)]">{badge}</span> : null}</div><p className="mt-4 min-h-28 text-lg font-bold leading-7" aria-live="polite">{message}</p><LabProgress index={playback.index} count={count} /><div className="mt-6"><LabControls labels={controls[locale]} index={playback.index} count={count} playing={playback.playing} onIndex={playback.setIndex} onPlaying={playback.setPlaying} /></div></aside></div>;
}

export function ConceptGrid({ items }: { items: Array<readonly [string, string]> }) {
  return <div className="mt-8 grid gap-4 md:grid-cols-3">{items.map(([title, text], index) => <ConceptCard key={title} number={`0${index + 1}`} title={title}>{text}</ConceptCard>)}</div>;
}

export function ErrorMessage({ error }: { error: string }) {
  return error ? <p role="alert" className="border-b border-[var(--line)] bg-red-50 px-6 py-3 text-sm font-bold text-[var(--danger)] dark:bg-red-950/20">{error}</p> : null;
}

export function TextInput({ label, value, onChange, id, className = "" }: { label: string; value: string; onChange: (value: string) => void; id: string; className?: string }) {
  return <label htmlFor={id} className={`min-w-44 flex-1 text-xs font-black uppercase tracking-wider text-[var(--muted)] ${className}`}>{label}<input id={id} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 block h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--background)] px-3 font-mono text-base text-[var(--foreground)] outline-none focus:border-[var(--brand)]" /></label>;
}

export function NumberInput({ label, value, onChange, min, max }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number }) {
  return <label className="rounded-xl border border-[var(--line)] bg-[var(--background)] px-3 py-2 text-xs font-bold text-[var(--muted)]">{label}<input aria-label={label} type="number" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-1 w-full bg-transparent font-mono text-base font-black text-[var(--foreground)] outline-none" /></label>;
}

export function ActionButton({ onClick, children, primary = false, className = "" }: { onClick: () => void; children: ReactNode; primary?: boolean; className?: string }) {
  return <button type="button" onClick={onClick} className={`h-11 rounded-xl px-4 text-sm font-black ${primary ? "bg-[var(--brand)] text-white" : "border border-[var(--brand)] text-[var(--brand)]"} ${className}`}>{children}</button>;
}

export function ValueCells({ values, active = [], label = "value" }: { values: number[]; active?: number[]; label?: string }) {
  return <div className="flex flex-wrap gap-2">{values.map((value, index) => <div key={index} className={`grid min-h-14 min-w-14 place-items-center rounded-xl border px-2 font-mono font-black transition ${active.includes(index) ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--line)] bg-[var(--surface)]"}`}><span>{value}</span><span className="text-[9px] font-normal opacity-60">{label}[{index}]</span></div>)}</div>;
}

export function BinaryHeapDiagram({ values, active, label }: { values: number[]; active: number[]; label: string }) {
  const levels = values.length ? Math.floor(Math.log2(values.length)) + 1 : 1;
  const height = Math.max(100, levels * 82);
  const positions = values.map((_, index) => {
    const level = Math.floor(Math.log2(index + 1));
    const first = (1 << level) - 1;
    const position = index - first;
    return { x: ((position + 1) * 640) / ((1 << level) + 1), y: 42 + level * 78 };
  });
  return <svg role="img" aria-label={label} viewBox={`0 0 640 ${height}`} className="w-full min-w-[34rem] rounded-2xl border border-[var(--line)] bg-[var(--surface)]"><g stroke="var(--line)" strokeWidth="2">{positions.slice(1).map((position, index) => { const child = index + 1; const parent = positions[Math.floor((child - 1) / 2)]; return <line key={child} x1={parent.x} y1={parent.y} x2={position.x} y2={position.y} />; })}</g>{positions.map((position, index) => <g key={index}><circle cx={position.x} cy={position.y} r="24" fill={active.includes(index) ? "var(--accent)" : "var(--brand-soft)"} stroke={active.includes(index) ? "var(--accent)" : "var(--brand)"} strokeWidth="2" /><text x={position.x} y={position.y + 5} textAnchor="middle" fill={active.includes(index) ? "white" : "var(--foreground)"} className="font-mono text-sm font-black">{values[index]}</text><text x={position.x} y={position.y + 37} textAnchor="middle" fill="var(--muted)" className="font-mono text-[9px]">[{index}]</text></g>)}</svg>;
}

export function ParentForestDiagram({ parent, active, label }: { parent: number[]; active: number[]; label: string }) {
  const depth = parent.map((_, index) => { let current = index; let value = 0; const seen = new Set<number>(); while (parent[current] !== current && !seen.has(current)) { seen.add(current); current = parent[current]; value += 1; } return value; });
  const height = Math.max(130, (Math.max(...depth) + 1) * 82);
  const positions = parent.map((_, index) => ({ x: ((index + 1) * 640) / (parent.length + 1), y: 42 + depth[index] * 76 }));
  return <svg role="img" aria-label={label} viewBox={`0 0 640 ${height}`} className="w-full min-w-[34rem] rounded-2xl border border-[var(--line)] bg-[var(--surface)]"><defs><marker id="dsu-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="var(--muted)" /></marker></defs><g stroke="var(--muted)" strokeWidth="2" markerEnd="url(#dsu-arrow)">{parent.map((target, index) => target === index ? null : <line key={index} x1={positions[index].x} y1={positions[index].y - 22} x2={positions[target].x} y2={positions[target].y + 25} />)}</g>{positions.map((position, index) => <g key={index}><circle cx={position.x} cy={position.y} r="23" fill={active.includes(index) ? "var(--accent)" : parent[index] === index ? "var(--brand)" : "var(--brand-soft)"} /><text x={position.x} y={position.y + 5} textAnchor="middle" fill={active.includes(index) || parent[index] === index ? "white" : "var(--foreground)"} className="font-mono text-sm font-black">{index}</text></g>)}</svg>;
}
