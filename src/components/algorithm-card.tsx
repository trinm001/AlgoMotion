import Link from "next/link";
import type { Algorithm } from "@/data/algorithms";
import { categoryLabels } from "@/data/algorithms";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";

export function AlgorithmCard({ algorithm, locale }: { algorithm: Algorithm; locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <Link href={`/${locale}/algorithms/${algorithm.slug}`} className="group flex min-h-64 flex-col rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-[var(--shadow)]">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-bold text-[var(--brand)]">{categoryLabels[algorithm.category][locale]}</span>
        <span className="text-xs font-semibold text-[var(--muted)]">{t.common[algorithm.difficulty]}</span>
      </div>
      <h3 className="mt-7 text-2xl font-black tracking-tight group-hover:text-[var(--brand)]">{algorithm.title[locale]}</h3>
      <p className="mt-3 flex-1 leading-7 text-[var(--muted)]">{algorithm.description[locale]}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4 text-xs font-bold">
        <span className={algorithm.status === "developing" ? "text-[var(--accent)]" : "text-[var(--muted)]"}>● {t.common[algorithm.status]}</span>
        <span className="text-[var(--brand)] transition group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
