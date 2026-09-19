"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

const steps = {
  vi: ["Sẵn sàng", "Đọc dữ liệu", "Chọn trạng thái", "Cập nhật hình ảnh", "Hoàn tất bước"],
  en: ["Ready", "Read input", "Select state", "Update the visual", "Step complete"],
} as const;

export function VisualizerDemo({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const labels = locale === "vi"
    ? { previous: "Lùi", next: "Tiếp", play: "Chạy", pause: "Dừng", reset: "Đặt lại" }
    : { previous: "Previous", next: "Next", play: "Play", pause: "Pause", reset: "Reset" };

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setIndex((current) => {
        if (current >= steps[locale].length - 1) { setPlaying(false); return current; }
        return current + 1;
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [locale, playing]);

  const progress = ((index + 1) / steps[locale].length) * 100;
  return (
    <div className="surface overflow-hidden rounded-[2rem]">
      <div className="grid-paper relative min-h-72 p-6 sm:p-10">
        <div className="absolute left-1/2 top-10 h-28 w-px bg-[var(--line)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-lg grid-cols-2 gap-x-20 gap-y-12 pt-2">
          <DemoNode label="input" active={index >= 1} className="col-span-2 mx-auto" />
          <DemoNode label="state" active={index >= 2} />
          <DemoNode label="visual" active={index >= 3} />
        </div>
        <div className="mx-auto mt-9 max-w-lg rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="mb-3 flex items-center justify-between text-sm font-bold"><span>{steps[locale][index]}</span><span className="text-[var(--muted)]">{index + 1}/{steps[locale].length}</span></div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-strong)]"><div className="h-full rounded-full bg-[var(--brand)] transition-all" style={{ width: `${progress}%` }} /></div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-[var(--line)] bg-[var(--surface)] p-4">
        <Control onClick={() => { setIndex(0); setPlaying(false); }} label={labels.reset}>↺</Control>
        <Control onClick={() => setIndex((value) => Math.max(0, value - 1))} label={labels.previous} disabled={index === 0}>←</Control>
        <Control primary onClick={() => setPlaying((value) => !value)} label={playing ? labels.pause : labels.play}>{playing ? "Ⅱ" : "▶"}</Control>
        <Control onClick={() => setIndex((value) => Math.min(steps[locale].length - 1, value + 1))} label={labels.next} disabled={index === steps[locale].length - 1}>→</Control>
      </div>
    </div>
  );
}

function DemoNode({ label, active, className = "" }: { label: string; active: boolean; className?: string }) {
  return <div className={`grid h-14 min-w-28 place-items-center rounded-2xl border font-mono text-sm font-bold transition-all ${className} ${active ? "border-[var(--brand)] bg-[var(--brand)] text-white shadow-lg" : "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]"}`}>{label}</div>;
}

function Control({ children, label, onClick, disabled = false, primary = false }: { children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; primary?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`flex h-10 min-w-20 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-35 ${primary ? "bg-[var(--brand)] text-white hover:bg-[var(--brand-strong)]" : "border border-[var(--line)] hover:border-[var(--brand)]"}`} aria-label={label}>
      <span aria-hidden="true">{children}</span><span>{label}</span>
    </button>
  );
}
