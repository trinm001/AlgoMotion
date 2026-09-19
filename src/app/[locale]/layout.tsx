import { notFound } from "next/navigation";
import { LocaleHtml } from "@/components/locale-html";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <><LocaleHtml locale={locale} /><SiteHeader locale={locale} /><main>{children}</main><SiteFooter locale={locale} /></>;
}
