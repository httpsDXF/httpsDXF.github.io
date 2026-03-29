"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getApiBase, type BlogCategory } from "@/lib/api";
import { authHeaders, clearTokens, getAccessToken } from "@/lib/auth";

export default function BlogCategoriesDashboardPage() {
  const router = useRouter();
  const base = getApiBase();
  const [list, setList] = useState<BlogCategory[]>([]);
  const [newName, setNewName] = useState("");
  const [newOrder, setNewOrder] = useState("0");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editOrder, setEditOrder] = useState("0");
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!base) return;
    setErr(null);
    const r = await fetch(`${base}/api/blog/categories/`, {
      headers: authHeaders(),
    });
    if (r.status === 401) {
      clearTokens();
      router.replace("/dashboard/login");
      return;
    }
    if (!r.ok) {
      setErr("Could not load categories.");
      return;
    }
    setList(await r.json());
  }, [base, router]);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/dashboard/login");
      return;
    }
    void load();
  }, [router, load]);

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (!base) {
      setErr("Missing NEXT_PUBLIC_API_URL.");
      return;
    }
    const name = newName.trim();
    if (!name) {
      setErr("Enter a category name.");
      return;
    }
    const order = Number.parseInt(newOrder, 10);
    setBusy("create");
    try {
      const r = await fetch(`${base}/api/blog/categories/`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          order: Number.isFinite(order) ? order : 0,
        }),
      });
      if (r.status === 401) {
        clearTokens();
        router.replace("/dashboard/login");
        return;
      }
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as Record<string, unknown>;
        setErr(JSON.stringify(j));
        return;
      }
      setNewName("");
      setNewOrder("0");
      setMsg("Category created.");
      void load();
    } finally {
      setBusy(null);
    }
  }

  function startEdit(c: BlogCategory) {
    setEditingSlug(c.slug);
    setEditName(c.name);
    setEditOrder(String(c.order));
    setErr(null);
    setMsg(null);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSlug || !base) return;
    setErr(null);
    setMsg(null);
    const name = editName.trim();
    if (!name) {
      setErr("Enter a category name.");
      return;
    }
    const order = Number.parseInt(editOrder, 10);
    setBusy(`edit:${editingSlug}`);
    try {
      const r = await fetch(
        `${base}/api/blog/categories/${encodeURIComponent(editingSlug)}/`,
        {
          method: "PATCH",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            order: Number.isFinite(order) ? order : 0,
          }),
        },
      );
      if (r.status === 401) {
        clearTokens();
        router.replace("/dashboard/login");
        return;
      }
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as Record<string, unknown>;
        setErr(JSON.stringify(j));
        return;
      }
      setEditingSlug(null);
      setMsg("Category updated.");
      void load();
    } finally {
      setBusy(null);
    }
  }

  async function removeCategory(slug: string, name: string) {
    if (!base) return;
    const ok = window.confirm(`Delete category “${name}”? Posts keep their other categories.`);
    if (!ok) return;
    setErr(null);
    setMsg(null);
    setBusy(`del:${slug}`);
    try {
      const r = await fetch(
        `${base}/api/blog/categories/${encodeURIComponent(slug)}/`,
        { method: "DELETE", headers: authHeaders() },
      );
      if (r.status === 401) {
        clearTokens();
        router.replace("/dashboard/login");
        return;
      }
      if (!r.ok) {
        setErr("Could not delete category.");
        return;
      }
      if (editingSlug === slug) setEditingSlug(null);
      setMsg("Category deleted.");
      void load();
    } finally {
      setBusy(null);
    }
  }

  if (!getAccessToken()) return null;

  const sorted = [...list].sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name),
  );

  return (
    <div className="pt-2">
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <Link
          href="/dashboard/blog"
          className="text-zinc-500 transition hover:text-white"
        >
          ← Blog posts
        </Link>
      </div>

      <p className="text-sm text-zinc-500">
        These names show up as filter chips on the public blog. Attach them in
        each post&apos;s form.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-white">Add category</h2>
        <form
          onSubmit={createCategory}
          className="mt-4 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-end"
        >
          <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
            <span className="text-zinc-500">Name</span>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Engineering"
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
            />
          </label>
          <label className="flex w-full flex-col gap-1 text-sm sm:w-24">
            <span className="text-zinc-500">Order</span>
            <input
              type="number"
              value={newOrder}
              onChange={(e) => setNewOrder(e.target.value)}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
            />
          </label>
          <button
            type="submit"
            disabled={busy === "create"}
            className="interaction-smooth shrink-0 rounded-full border border-emerald-600/50 bg-emerald-600/25 px-5 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-600/35 disabled:opacity-50"
          >
            {busy === "create" ? "…" : "Add"}
          </button>
        </form>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-white">All categories</h2>
        {sorted.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center text-sm text-zinc-500">
            No categories yet. Add one above.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {sorted.map((c) => (
              <li key={c.id}>
                {editingSlug === c.slug ? (
                  <form
                    onSubmit={saveEdit}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-900/40 p-4 sm:flex-row sm:items-end"
                  >
                    <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
                      <span className="text-zinc-500">Name</span>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
                      />
                    </label>
                    <label className="flex w-full flex-col gap-1 text-sm sm:w-24">
                      <span className="text-zinc-500">Order</span>
                      <input
                        type="number"
                        value={editOrder}
                        onChange={(e) => setEditOrder(e.target.value)}
                        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
                      />
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="submit"
                        disabled={busy === `edit:${c.slug}`}
                        className="rounded-full border border-emerald-600/50 bg-emerald-600/25 px-4 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-600/35 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSlug(null)}
                        className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-900/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-white">{c.name}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Slug: <code className="text-zinc-400">{c.slug}</code>
                        {" · "}
                        order {c.order}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={busy === `del:${c.slug}`}
                        onClick={() => void removeCategory(c.slug, c.name)}
                        className="rounded-lg px-3 py-1.5 text-sm text-red-400/90 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                      >
                        {busy === `del:${c.slug}` ? "…" : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {err ? (
        <p className="mt-6 text-sm text-red-400/90" role="alert">
          {err}
        </p>
      ) : null}
      {msg ? (
        <p className="mt-6 text-sm text-emerald-400/90">{msg}</p>
      ) : null}
    </div>
  );
}
