import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlgorithmCard } from "@/components/algorithm-card";
import { VisualizerDemo } from "@/components/visualizer-demo";
import { algorithms } from "@/data/algorithms";
import { getDictionary, isLocale } from "@/lib/i18n";

type LocalePageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: locale === "vi" ? "Học thuật toán bằng trực quan" : "Visual algorithm learning", description: getDictionary(locale).home.description, alternates: { languages: { vi: "/vi", en: "/en" } } };
}

export default async function HomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <>
      <section className="container-shell grid min-h-[calc(100vh-4rem)] items-center gap-12 py-20 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <p className="eyebrow">{t.home.eyebrow}</p>
          <h1 className="text-balance mt-5 max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">{t.home.title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">{t.home.description}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={`/${locale}/algorithms`} className="rounded-full bg-[var(--brand)] px-6 py-3.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[var(--brand-strong)]">{t.common.explore} →</Link>
            <a href="#demo" className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 py-3.5 text-sm font-extrabold transition hover:border-[var(--brand)]">{t.common.preview}</a>
          </div>
        </div>
        <div className="surface relative overflow-hidden rounded-[2rem] p-5 sm:p-8">
          <div className="absolute -right-16 -top-16 size-52 rounded-full bg-[var(--brand-soft)] blur-2xl" />
          <div className="relative rounded-3xl border border-[var(--line)] bg-[var(--background)] p-5">
            <div className="mb-8 flex items-center justify-between"><div className="flex gap-1.5"><i className="size-2.5 rounded-full bg-red-400" /><i className="size-2.5 rounded-full bg-amber-400" /><i className="size-2.5 rounded-full bg-emerald-400" /></div><span className="font-mono text-xs text-[var(--muted)]">step 03 / 07</span></div>
            <div className="space-y-3 font-mono text-sm">
              {["read(input)", "visit(state)", "emit(animation)", "explain(step)"].map((line, index) => <div key={line} className={`rounded-xl px-4 py-3 ${index === 2 ? "bg-[var(--brand)] text-white" : "text-[var(--muted)]"}`}><span className="mr-4 opacity-50">{index + 1}</span>{line}</div>)}
            </div>
          </div>
          <div className="relative mt-5 grid grid-cols-4 gap-2 text-center text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
            {t.home.workflow.map((step, index) => <div key={step}><span className="mx-auto mb-2 grid size-7 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">{index + 1}</span>{step}</div>)}
          </div>
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">MVP</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{t.home.catalogTitle}</h2><p className="mt-3 max-w-2xl text-[var(--muted)]">{t.home.catalogDescription}</p></div><Link href={`/${locale}/algorithms`} className="font-bold text-[var(--brand)]">{t.common.explore} →</Link></div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">{algorithms.slice(0, 3).map((algorithm) => <AlgorithmCard algorithm={algorithm} locale={locale} key={algorithm.slug} />)}</div>
      </section>

      <section id="demo" className="container-shell scroll-mt-24 py-20">
        <div className="mx-auto mb-9 max-w-2xl text-center"><p className="eyebrow">Phase 1</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{t.home.demoTitle}</h2><p className="mt-4 leading-7 text-[var(--muted)]">{t.home.demoDescription}</p></div>
        <VisualizerDemo locale={locale} />
      </section>

      <section id="roadmap" className="container-shell scroll-mt-24 py-20">
        <h2 className="text-center text-3xl font-black tracking-tight sm:text-4xl">{t.home.principlesTitle}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">{t.home.principles.map(([title, description], index) => <article key={title} className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-7"><span className="grid size-10 place-items-center rounded-xl bg-[var(--brand-soft)] font-black text-[var(--brand)]">0{index + 1}</span><h3 className="mt-6 text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-[var(--muted)]">{description}</p></article>)}</div>
      </section>
    </>
  );
}
