"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DEFAULT_PORTFOLIO_CATEGORIES,
  addPortfolioCategory,
  getAllPortfolioCategories,
  getStoredExtraCategories,
  removePortfolioCategory,
} from "@/lib/portfolioCategories";
import { getAccessToken } from "@/lib/auth";

export default function DashboardPortfolioPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [newName, setNewName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  function refresh() {
    setCategories(getAllPortfolioCategories());
  }

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/dashboard/login");
      return;
    }
    refresh();
  }, [router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const ok = addPortfolioCategory(newName);
    if (ok) {
      setNewName("");
      setMsg("Category added. It appears on the public Portfolio page in this browser.");
      refresh();
    } else {
      setMsg(
        "Use a unique name (not empty or duplicate of an existing category).",
      );
    }
  }

  function remove(name: string) {
    if ((DEFAULT_PORTFOLIO_CATEGORIES as readonly string[]).includes(name)) {
      setMsg("Built-in categories (Mechatronics, Brand, Photography) cannot be removed.");
      return;
    }
    removePortfolioCategory(name);
    refresh();
    setMsg("Category removed.");
  }

  if (!getAccessToken()) return null;

  const extras = getStoredExtraCategories();

  return (
    <div className="pt-2">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        Portfolio categories
      </h1>
      <p className="mt-2 max-w-xl text-sm text-zinc-400">
        Default sections are{" "}
        <span className="text-zinc-300">Mechatronics</span>,{" "}
        <span className="text-zinc-300">Brand</span>, and{" "}
        <span className="text-zinc-300">Photography</span>. Add more below; they
        are stored in this browser (localStorage) until a CMS or API is wired up.
      </p>

      <ul className="mt-8 space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        {categories.map((c) => {
          const isDefault = (
            DEFAULT_PORTFOLIO_CATEGORIES as readonly string[]
          ).includes(c);
          return (
            <li
              key={c}
              className="flex items-center justify-between gap-3 border-b border-white/5 py-2 last:border-0"
            >
              <span className="font-medium text-white">{c}</span>
              {isDefault ? (
                <span className="text-xs text-zinc-600">Built-in</span>
              ) : (
                <button
                  type="button"
                  onClick={() => remove(c)}
                  className="text-xs text-red-400/90 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <form onSubmit={submit} className="mt-8 max-w-md">
        <label className="block text-sm text-zinc-500">New category</label>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Motion design"
            className="min-w-[200px] flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
          />
          <button
            type="submit"
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
          >
            Add category
          </button>
        </div>
      </form>

      {msg ? (
        <p className="mt-4 text-sm text-emerald-400/90" role="status">
          {msg}
        </p>
      ) : null}
      {extras.length === 0 ? (
        <p className="mt-4 text-xs text-zinc-600">
          No extra categories yet.
        </p>
      ) : null}
    </div>
  );
}
