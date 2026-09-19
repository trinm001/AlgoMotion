"use client";

import { useMemo, useState } from "react";
import { AlgorithmCard } from "@/components/algorithm-card";
import { algorithms, categoryLabels, type AlgorithmStatus, type Category } from "@/data/algorithms";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";

export function AlgorithmCatalog({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [status, setStatus] = useState<AlgorithmStatus | "all">("all");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(locale);
    return algorithms.filter((algorithm) => {
      const matchesQuery = !normalizedQuery || `${algorithm.title.vi} ${algorithm.title.en} ${algorithm.description[locale]}`.toLocaleLowerCase(locale).includes(normalizedQuery);
      return matchesQuery && (category === "all" || algorithm.category === category) && (status === "all" || algorithm.status === status);
    });
  }, [category, locale, query, status]);

  return (
    <div>
      <div className="surface rounded-3xl p-4 sm:p-5">
        <label className="sr-only" htmlFor="algorithm-search">{t.common.search}</label>
        <input id="algorithm-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.common.search} className="h-12 w-full rounded-2xl border border-[var(--line)] bg-[var(--background)] px-4 outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:ring-4 focus:ring-emerald-500/10" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Filter label={t.catalog.category} value={category} onChange={(value) => setCategory(value as Category | "all")}>
            <option value="all">{t.common.all}</option>
            {Object.entries(categoryLabels).map(([value, label]) => <option value={value} key={value}>{label[locale]}</option>)}
          </Filter>
          <Filter label={t.catalog.status} value={status} onChange={(value) => setStatus(value as AlgorithmStatus | "all")}>
            <option value="all">{t.common.all}</option>
            <option value="developing">{t.common.developing}</option>
            <option value="planned">{t.common.planned}</option>
            <option value="available">{t.common.available}</option>
          </Filter>
        </div>
      </div>
      <p className="my-6 text-sm font-semibold text-[var(--muted)]">{filtered.length} {t.catalog.showing}</p>
      {filtered.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((algorithm) => <AlgorithmCard algorithm={algorithm} locale={locale} key={algorithm.slug} />)}</div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[var(--line)] py-20 text-center text-[var(--muted)]">{t.common.noResults}</div>
      )}
    </div>
  );
}

function Filter({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--background)] px-4">
      <span className="text-xs font-bold text-[var(--muted)]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-12 min-w-0 flex-1 bg-transparent text-right font-semibold outline-none">{children}</select>
    </label>
  );
}
