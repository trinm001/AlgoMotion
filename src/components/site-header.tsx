import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:color-mix(in_srgb,var(--background)_86%,transparent)] backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-2.5 font-black tracking-tight">
          <Image
            src="/algomotion-avatar.webp"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-xl object-cover shadow-lg shadow-emerald-950/15"
          />
          <span>AlgoMotion</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-[var(--muted)] sm:flex" aria-label="Primary navigation">
          <Link className="transition hover:text-[var(--brand)]" href={`/${locale}`}>{t.nav.home}</Link>
          <Link className="transition hover:text-[var(--brand)]" href={`/${locale}/algorithms`}>{t.nav.algorithms}</Link>
          <Link className="transition hover:text-[var(--brand)]" href={`/${locale}#roadmap`}>{t.nav.roadmap}</Link>
        </nav>
        <div className="flex items-center gap-2"><LanguageSwitcher locale={locale} /><ThemeToggle /></div>
      </div>
    </header>
  );
}
