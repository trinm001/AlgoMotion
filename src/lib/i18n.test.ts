import { describe, expect, it } from "vitest";
import { getDictionary, isLocale } from "./i18n";

describe("locale helpers", () => {
  it("accepts only supported locales", () => {
    expect(isLocale("vi")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it("provides complete primary navigation labels", () => {
    for (const locale of ["vi", "en"] as const) {
      const dictionary = getDictionary(locale);
      expect(dictionary.nav.home).toBeTruthy();
      expect(dictionary.nav.algorithms).toBeTruthy();
      expect(dictionary.nav.roadmap).toBeTruthy();
    }
  });
});
