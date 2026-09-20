import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FenwickTreeVisualizer } from "@/components/fenwick-tree-visualizer";
import { BinarySearchVisualizer, PrefixSumVisualizer, SortingVisualizer } from "@/components/fundamentals-visualizers";
import { SegmentTreeVisualizer } from "@/components/segment-tree-visualizer";
import { SieveVisualizer } from "@/components/sieve-visualizer";
import { algorithms, categoryLabels, findAlgorithm } from "@/data/algorithms";
import { getDictionary, isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((locale) => algorithms.map(({ slug }) => ({ locale, slug })));
}

type AlgorithmPageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: AlgorithmPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const algorithm = findAlgorithm(slug);
  return algorithm ? { title: algorithm.title[locale], description: algorithm.description[locale] } : {};
}

export default async function AlgorithmDetailPage({ params }: AlgorithmPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const algorithm = findAlgorithm(slug);
  if (!algorithm) notFound();
  const t = getDictionary(locale);
  return (
    <div className="container-shell py-12 sm:py-20">
      <Link href={`/${locale}/algorithms`} className="text-sm font-bold text-[var(--brand)]">← {t.detail.back}</Link>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <article>
          <div className="flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-[var(--brand)]">{categoryLabels[algorithm.category][locale]}</span><span className="rounded-full border border-[var(--line)] px-3 py-1.5">{t.common[algorithm.difficulty]}</span></div>
          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">{algorithm.title[locale]}</h1>
          <p className="mt-5 max-w-3xl text-xl leading-9 text-[var(--muted)]">{algorithm.description[locale]}</p>
          <div className="mt-10 rounded-3xl border border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_10%,var(--surface))] p-6"><p className="font-bold">● {t.common[algorithm.status]}</p><p className="mt-2 leading-7 text-[var(--muted)]">{algorithm.status === "available" ? t.detail.publishedNotice : t.detail.statusNotice}</p></div>
          {algorithm.slug === "segment-tree" ? (
            <SegmentTreeVisualizer locale={locale} />
          ) : algorithm.slug === "fenwick-tree" ? (
            <FenwickTreeVisualizer locale={locale} />
          ) : algorithm.slug === "sieve-of-eratosthenes" ? (
            <SieveVisualizer locale={locale} />
          ) : algorithm.slug === "elementary-sorting" ? (
            <SortingVisualizer locale={locale} />
          ) : algorithm.slug === "binary-search" ? (
            <BinarySearchVisualizer locale={locale} />
          ) : algorithm.slug === "prefix-sum" ? (
            <PrefixSumVisualizer locale={locale} />
          ) : (
            <section className="mt-12"><h2 className="text-2xl font-black">{t.detail.overview}</h2><div className="grid-paper mt-5 grid min-h-80 place-items-center rounded-3xl border border-dashed border-[var(--line)] text-center"><div><span className="text-4xl">◇</span><p className="mt-3 font-mono text-sm text-[var(--muted)]">visualizer / roadmap</p></div></div></section>
          )}
        </article>
        <aside className="space-y-5">
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6"><h2 className="font-black">{t.detail.prerequisites}</h2><ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">{algorithm.prerequisites.map((item) => <li key={item.en}>✓ {item[locale]}</li>)}</ul></div>
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6"><h2 className="font-black">{t.common.source}</h2><ul className="mt-4 space-y-3 text-sm">{algorithm.sources.map((source) => <li key={source.url}><a className="font-semibold text-[var(--brand)] hover:underline" href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a><p className="mt-1 text-xs text-[var(--muted)]">{source.role}</p></li>)}</ul></div>
        </aside>
      </div>
    </div>
  );
}
