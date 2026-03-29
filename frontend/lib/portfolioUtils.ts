import {
  PORTFOLIO_PLACEHOLDER_CARDS,
  type PortfolioCard,
} from "@/lib/placeholderContent";

export function findPortfolioCardBySlug(
  slug: string,
): { card: PortfolioCard; category: string } | null {
  for (const [category, cards] of Object.entries(PORTFOLIO_PLACEHOLDER_CARDS)) {
    const card = cards.find((c) => c.slug === slug);
    if (card) return { card, category };
  }
  return null;
}

export function getAllPortfolioSlugs(): string[] {
  return Object.values(PORTFOLIO_PLACEHOLDER_CARDS)
    .flat()
    .map((c) => c.slug);
}
