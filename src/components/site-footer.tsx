import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <footer className="mt-20 border-t border-[var(--line)] py-8 text-sm text-[var(--muted)]">
      <div className="container-shell flex flex-col justify-between gap-3 sm:flex-row">
        <p>© {new Date().getFullYear()} AlgoMotion. {t.footer}</p>
        <Link className="font-semibold text-[var(--foreground)] hover:text-[var(--brand)]" href={`/${locale}/algorithms`}>{t.nav.algorithms} →</Link>
      </div>
    </footer>
  );
}
