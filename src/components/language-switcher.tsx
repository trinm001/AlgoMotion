"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const nextLocale: Locale = locale === "vi" ? "en" : "vi";
  const nextPath = pathname.replace(/^\/(vi|en)(?=\/|$)/, `/${nextLocale}`);
  return (
    <Link href={nextPath || `/${nextLocale}`} className="grid h-10 min-w-12 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 text-xs font-extrabold tracking-wider transition hover:border-[var(--brand)]" aria-label={locale === "vi" ? "Switch to English" : "Chuyển sang tiếng Việt"}>
      {nextLocale.toUpperCase()}
    </Link>
  );
}
