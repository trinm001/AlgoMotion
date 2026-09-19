"use client";

import { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const shouldUseDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button type="button" onClick={toggleTheme} className="grid size-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-lg transition hover:border-[var(--brand)]" aria-label="Toggle color theme" title="Toggle color theme">
      <span aria-hidden="true">◐</span>
    </button>
  );
}
