"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_PORTFOLIO_CATEGORIES,
  getAllPortfolioCategories,
} from "@/lib/portfolioCategories";
import {
  PORTFOLIO_PLACEHOLDER_CARDS,
  type PortfolioCard,
} from "@/lib/placeholderContent";

function Card({ item }: { item: PortfolioCard }) {
  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-zinc-900/35 p-5 transition hover:border-white/20 hover:bg-zinc-900/55">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {item.meta}
      </p>
      <h3 className="mt-2 text-lg font-semibold leading-snug text-white">
        {item.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
        {item.description}
      </p>
    </article>
  );
}

export function PortfolioClient() {
  const [categories, setCategories] = useState<string[]>(() => [
    ...DEFAULT_PORTFOLIO_CATEGORIES,
  ]);

  useEffect(() => {
    setCategories(getAllPortfolioCategories());
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Portfolio</h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-400">
        Work grouped by focus — sample cards below; replace with real projects as you
        ship them.
      </p>

      <div className="mt-14 space-y-16">
        {categories.map((title) => {
          const cards =
            PORTFOLIO_PLACEHOLDER_CARDS[title] ??
            ([] as PortfolioCard[]);
          return (
            <section
              key={title}
              className="border-t border-white/10 pt-10 first:mt-0 first:border-t-0 first:pt-0"
            >
              <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                {title}
              </h2>
              {cards.length === 0 ? (
                <p className="mt-6 text-sm text-zinc-500">
                  No sample cards for this section yet. Add work here when ready.
                </p>
              ) : (
                <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cards.map((item) => (
                    <li key={item.title}>
                      <Card item={item} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
