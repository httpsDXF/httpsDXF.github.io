/**
 * Portfolio section headings. Defaults are always shown; extras persist in localStorage (client only).
 */

export const DEFAULT_PORTFOLIO_CATEGORIES = [
  "Mechatronics",
  "Brand",
  "Photography",
] as const;

const STORAGE_KEY = "portfolio_categories_extra";

export function getStoredExtraCategories(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (s): s is string => typeof s === "string" && s.trim().length > 0,
    );
  } catch {
    return [];
  }
}

export function setStoredExtraCategories(categories: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

export function addPortfolioCategory(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  const defaults = new Set(
    DEFAULT_PORTFOLIO_CATEGORIES.map((c) => c.toLowerCase()),
  );
  if (defaults.has(lower)) return false;
  const extra = getStoredExtraCategories();
  if (extra.some((e) => e.toLowerCase() === lower)) return false;
  extra.push(trimmed);
  setStoredExtraCategories(extra);
  return true;
}

export function removePortfolioCategory(name: string): void {
  const extra = getStoredExtraCategories().filter(
    (c) => c.toLowerCase() !== name.toLowerCase(),
  );
  setStoredExtraCategories(extra);
}

export function getAllPortfolioCategories(): string[] {
  return [...DEFAULT_PORTFOLIO_CATEGORIES, ...getStoredExtraCategories()];
}
