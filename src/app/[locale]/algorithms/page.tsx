import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlgorithmCatalog } from "@/components/algorithm-catalog";
import { getDictionary, isLocale } from "@/lib/i18n";

type AlgorithmsPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: AlgorithmsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.catalog.title, description: t.catalog.description };
}

export default async function AlgorithmsPage({ params }: AlgorithmsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <div className="container-shell py-16 sm:py-24">
      <div className="max-w-3xl"><p className="eyebrow">{t.catalog.eyebrow}</p><h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">{t.catalog.title}</h1><p className="mt-5 text-lg leading-8 text-[var(--muted)]">{t.catalog.description}</p></div>
      <div className="mt-12"><AlgorithmCatalog locale={locale} /></div>
    </div>
  );
}
