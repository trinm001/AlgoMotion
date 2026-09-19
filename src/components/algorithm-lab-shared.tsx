import type { ReactNode } from "react";

export function LabControls({
  labels,
  index,
  count,
  playing,
  onIndex,
  onPlaying,
}: {
  labels: { reset: string; previous: string; play: string; pause: string; next: string };
  index: number;
  count: number;
  playing: boolean;
  onIndex: (index: number) => void;
  onPlaying: (playing: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Control label={labels.reset} onClick={() => { onIndex(0); onPlaying(false); }}>↺</Control>
      <Control label={labels.previous} disabled={index === 0} onClick={() => { onIndex(Math.max(0, index - 1)); onPlaying(false); }}>←</Control>
      <Control label={playing ? labels.pause : labels.play} primary onClick={() => {
        if (index === count - 1) onIndex(0);
        onPlaying(!playing);
      }}>{playing ? "Ⅱ" : "▶"}</Control>
      <Control label={labels.next} disabled={index === count - 1} onClick={() => { onIndex(Math.min(count - 1, index + 1)); onPlaying(false); }}>→</Control>
    </div>
  );
}

function Control({ label, children, onClick, disabled = false, primary = false }: { label: string; children: ReactNode; onClick: () => void; disabled?: boolean; primary?: boolean }) {
  return <button type="button" aria-label={label} onClick={onClick} disabled={disabled} className={`rounded-xl px-3 py-2 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-35 ${primary ? "bg-[var(--brand)] text-white" : "border border-[var(--line)] hover:border-[var(--brand)]"}`}><span aria-hidden="true" className="mr-2">{children}</span>{label}</button>;
}

export function CodePanel({ title, lines, activeLine }: { title: string; lines: string[]; activeLine: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[#102019] text-[#d9f5e8]">
      <div className="border-b border-white/10 px-4 py-3 text-xs font-black uppercase tracking-wider text-emerald-300">{title}</div>
      <pre className="overflow-x-auto py-3 text-xs leading-6 sm:text-sm">
        {lines.map((line, index) => (
          <code key={`${index}-${line}`} className={`block min-w-max px-4 ${activeLine === index + 1 ? "bg-emerald-400/20 text-white" : "text-emerald-50/70"}`}>
            <span className="mr-4 inline-block w-4 select-none text-right text-emerald-400/50">{index + 1}</span>{line || " "}
          </code>
        ))}
      </pre>
    </div>
  );
}

export function LabProgress({ index, count }: { index: number; count: number }) {
  return <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-strong)]"><div className="h-full rounded-full bg-[var(--brand)] transition-all" style={{ width: `${((index + 1) / count) * 100}%` }} /></div>;
}

export function ConceptCard({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <article className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5"><span className="font-mono text-xs font-black text-[var(--brand)]">{number}</span><h3 className="mt-3 font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{children}</p></article>;
}

