import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return <footer className="mt-20 border-t border-[var(--line)] py-8 text-sm text-[var(--muted)]">
    <div className="container-shell flex flex-col justify-between gap-3 sm:flex-row">
      <p>© {new Date().getFullYear()} AlgoMotion. {t.footer}</p>
      <div className="flex gap-5 font-semibold text-[var(--foreground)]">
        <Link className="hover:text-[var(--brand)]" href={`/${locale}/algorithms`}>{t.nav.algorithms} →</Link>
        <a className="hover:text-[var(--brand)]" href="https://github.com/trinm001/AlgoMotion" target="_blank" rel="noreferrer">GitHub ↗</a>
      </div>
    </div>
  </footer>;
}
